import React, { useEffect, useState } from 'react'
import CardSlider from "../components/CardSlider"
import { faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import { risksAPI, governanceItemsAPI, incidentsAPI, complianceAPI } from "../services/api"
import { useNavigate } from 'react-router-dom'

function Main() {
  const [risks, setRisks] = useState([]);
  const [governanceItems, setGovernanceItems] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [controls, setControls] = useState([]);
  const [controlFrameworkMap, setControlFrameworkMap] = useState({}); // Map control_id to framework_id
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch all data from APIs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from all APIs in parallel
        const [risksData, governanceData, incidentsData, frameworksData] = await Promise.all([
          risksAPI.getAll().catch(err => { console.error('Error fetching risks:', err); return []; }),
          governanceItemsAPI.getAll().catch(err => { console.error('Error fetching governance:', err); return []; }),
          incidentsAPI.getAll().catch(err => { console.error('Error fetching incidents:', err); return []; }),
          complianceAPI.getFrameworks().catch(err => { console.error('Error fetching frameworks:', err); return []; })
        ]);

        setRisks(risksData);
        setGovernanceItems(governanceData);
        setIncidents(incidentsData);
        setFrameworks(frameworksData);

        // Fetch requirements and controls for each framework
        let allRequirements = [];
        let allControls = [];
        let frameworkMap = {}; // Map requirement_id to framework_id
        
        for (const framework of frameworksData) {
          try {
            const requirementsData = await complianceAPI.getRequirementsByFramework(framework.framework_id);
            
            // Store framework_id for each requirement
            requirementsData.forEach(req => {
              frameworkMap[req.requirement_id] = framework.framework_id;
            });
            
            allRequirements = [...allRequirements, ...requirementsData];
            
            for (const requirement of requirementsData) {
              try {
                const controlsData = await complianceAPI.getControlsByRequirement(requirement.requirement_id);
                
                // Store framework_id for each control
                controlsData.forEach(control => {
                  frameworkMap[control.control_id] = frameworkMap[requirement.requirement_id];
                });
                
                allControls = [...allControls, ...controlsData];
              } catch (err) {
                console.error(`Error fetching controls for requirement ${requirement.requirement_id}:`, err);
              }
            }
          } catch (err) {
            console.error(`Error fetching requirements for framework ${framework.framework_id}:`, err);
          }
        }
        
        setRequirements(allRequirements);
        setControls(allControls);
        setControlFrameworkMap(frameworkMap);
        setError(null);

      } catch (err) {
        setError('Failed to fetch dashboard data');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Prepare combined data for CardSlider
  const [sortedData, setSortedData] = useState({
    fields: [],
    ids: [],
    navigation: []
  });

  useEffect(() => {
    if (risks.length === 0 && governanceItems.length === 0 && incidents.length === 0 && controls.length === 0) return;

    // Create combined array with all items and their metadata
    const allItems = [];

    // Add risks with their metadata
    risks.forEach((risk) => {
      const date = risk.last_reviewed ? new Date(risk.last_reviewed) : new Date(0);
      allItems.push({
        type: "risk",
        field: [
          { type: "i", text: "faChartSimple", color: "#FFA72699" },
          { type: "b", text: "Risk Review", color: "#FFA72699" },
          { type: "t", text: risk.title },
          { type: "t", text: risk.owner || "Unassigned" },
          { type: "t", text: risk.last_reviewed ? new Date(risk.last_reviewed).toLocaleDateString() : "No date" },
          { type: "t", text: risk.status }
        ],
        id: risk.risk_id,
        path: "/dashboard/risks",
        date: date
      });
    });

    // Add governance items with their metadata
    governanceItems.forEach((item) => {
      const date = item.next_review ? new Date(item.next_review) : new Date(0);
      allItems.push({
        type: "governance",
        field: [
          { type: "i", text: "faGavel", color: "#00ff0099" },
          { type: "b", text: "Governance Review", color: "#00ff0099" },
          { type: "t", text: item.governance_name },
          { type: "t", text: item.owner || "Unassigned" },
          { type: "t", text: item.next_review ? new Date(item.next_review).toLocaleDateString() : "No date" },
          { type: "t", text: item.status }
        ],
        id: item.governance_id,
        path: "/dashboard/governance",
        date: date
      });
    });

    // Add incidents with their metadata
    incidents.forEach((incident) => {
      const date = incident.reported_at ? new Date(incident.reported_at) : new Date(0);
      allItems.push({
        type: "incident",
        field: [
          { type: "i", text: "faTriangleExclamation", color: "#3b82f699" },
          { type: "b", text: "Incident Review", color: "#3b82f699" },
          { type: "t", text: incident.title },
          { type: "t", text: incident.owner || "Unassigned" },
          { type: "t", text: incident.reported_at ? new Date(incident.reported_at).toLocaleDateString() : "No date" },
          { type: "t", text: incident.status }
        ],
        id: incident.incident_id,
        path: "/dashboard/incidents",
        date: date
      });
    });

    // Add controls with their metadata - using framework_id instead of control_id
    controls.forEach((control) => {
      const date = control.last_reviewed ? new Date(control.last_reviewed) : new Date(0);
      const frameworkId = controlFrameworkMap[control.control_id] || control.control_id; // Fallback to control_id if framework not found
      
      allItems.push({
        type: "control",
        field: [
          { type: "i", text: "faShield", color: "#ff00ff99" },
          { type: "b", text: "Control Review", color: "#ff00ff99" },
          { type: "t", text: control.control_name },
          { type: "t", text: control.owner || "Unassigned" },
          { type: "t", text: control.last_reviewed ? new Date(control.last_reviewed).toLocaleDateString() : "No date" },
          { type: "t", text: control.status }
        ],
        id: frameworkId, // Use framework_id instead of control_id
        path: "/dashboard/compliance",
        date: date
      });
    });

    // Sort all items by date
    const sortedItems = allItems.sort((a, b) => a.date - b.date);

    // Extract sorted arrays
    const sortedFields = sortedItems.map(item => item.field);
    const sortedIds = sortedItems.map(item => item.id);
    const sortedNavigation = sortedItems.map((item, index) => ({
      path: item.path,
      start: index,
      end: index
    }));

    setSortedData({
      fields: sortedFields,
      ids: sortedIds,
      navigation: sortedNavigation
    });
  }, [risks, governanceItems, incidents, controls, controlFrameworkMap]);

  // Calculate risk statistics
  const totalRisks = risks.length;
  const openRisks = risks.filter(risk => risk.status === "open").length;
  const mitigatedRisks = risks.filter(risk => risk.status === "mitigated").length;
  const closedRisks = risks.filter(risk => risk.status === "closed").length;
  const highSeverityRisks = risks.filter(risk => risk.severity === "high" || risk.severity === "critical").length;

  if (loading) {
    return (
      <>
        <div className="p-4">Loading dashboard data...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="p-4 text-red-500">Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <CardSlider
        caption={{ text: 'upcoming', icon: "faCalendarDay" }}
        titles={["Type", " ", "Title", "owner", "Due Date", "status"]}
        colors={[""]}
        sizes={[2, 8, 20, 6, 6, 6]}
        navigation={sortedData.navigation}
        ids={sortedData.ids}
        fields={sortedData.fields}
      />
      
      <div className='p-3.5 flex flex-col bg-teal/90 rounded-2xl w-full h-full capitalize font-bold text-3xl gap-4'>
        <div>
          <FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon' />
          <span>Risks Overview</span>
        </div>
        <div className='cardsContainer'>
          <Card title="Total Risks" value={totalRisks} model={1} />
          <Card title="Mitigated" value={mitigatedRisks} model={2} />
          <Card title="Open" value={openRisks} model={2} />
          <Card title="Closed" value={closedRisks} model={2} />
          <Card title="High Severity" value={highSeverityRisks} model={1} />
        </div>
        <div className='flex'>
          <div className='button buttonStyle my-4' onClick={() => navigate("/dashboard/addRisk")}>
            <FontAwesomeIcon icon={faPlus} className='mr-1' />
            Add Risks
          </div>
        </div>
      </div>
    </>
  )
}

export default Main