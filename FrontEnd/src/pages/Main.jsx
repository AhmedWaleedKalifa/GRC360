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
        
        for (const framework of frameworksData) {
          try {
            const requirementsData = await complianceAPI.getRequirementsByFramework(framework.framework_id);
            allRequirements = [...allRequirements, ...requirementsData];
            
            for (const requirement of requirementsData) {
              try {
                const controlsData = await complianceAPI.getControlsByRequirement(requirement.requirement_id);
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

  // Prepare data for CardSlider
  const [risksFields, setRisksFields] = useState([]);
  const [governanceFields, setGovernanceFields] = useState([]);
  const [incidentsFields, setIncidentsFields] = useState([]);
  const [controlsFields, setControlsFields] = useState([]);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    if (risks.length === 0 && governanceItems.length === 0 && incidents.length === 0 && controls.length === 0) return;

    let risksArray = [];
    let governanceArray = [];
    let incidentsArray = [];
    let controlsArray = [];
    let idsArray = [];

    // Risks
    risks.forEach((risk) => {
      risksArray.push([
        { type: "i", text: "faChartSimple", color: "#FFA72699" },
        { type: "b", text: "Risk Review", color: "#FFA72699" },
        { type: "t", text: risk.title },
        { type: "t", text: risk.owner || "Unassigned" },
        { type: "t", text: risk.last_reviewed ? new Date(risk.last_reviewed).toLocaleDateString() : "No date" },
        { type: "t", text: risk.status }
      ]);
      idsArray.push(risk.risk_id); // Only the ID, no prefix
    });

    // Governance Items
    governanceItems.forEach((item) => {
      governanceArray.push([
        { type: "i", text: "faGavel", color: "#00ff0099" },
        { type: "b", text: "Governance Review", color: "#00ff0099" },
        { type: "t", text: item.governance_name },
        { type: "t", text: item.owner || "Unassigned" },
        { type: "t", text: item.next_review ? new Date(item.next_review).toLocaleDateString() : "No date" },
        { type: "t", text: item.status }
      ]);
      idsArray.push(item.governance_id); // Only the ID, no prefix
    });

    // Incidents
    incidents.forEach((incident) => {
      incidentsArray.push([
        { type: "i", text: "faTriangleExclamation", color: "#3b82f699" },
        { type: "b", text: "Incident Review", color: "#3b82f699" },
        { type: "t", text: incident.title },
        { type: "t", text: incident.owner || "Unassigned" },
        { type: "t", text: incident.reported_at ? new Date(incident.reported_at).toLocaleDateString() : "No date" },
        { type: "t", text: incident.status }
      ]);
      idsArray.push(incident.incident_id); // Only the ID, no prefix
    });

    // Controls
    controls.forEach((control) => {
      controlsArray.push([
        { type: "i", text: "faShield", color: "#ff00ff99" },
        { type: "b", text: "Control Review", color: "#ff00ff99" },
        { type: "t", text: control.control_name },
        { type: "t", text: control.owner || "Unassigned" },
        { type: "t", text: control.last_reviewed ? new Date(control.last_reviewed).toLocaleDateString() : "No date" },
        { type: "t", text: control.status }
      ]);
      idsArray.push(control.control_id); 
    });

    setIds(idsArray);
    setRisksFields(risksArray);
    setGovernanceFields(governanceArray);
    setControlsFields(controlsArray);
    setIncidentsFields(incidentsArray);
  }, [risks, governanceItems, incidents, controls]);

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

  const allFields = [...risksFields, ...governanceFields, ...incidentsFields, ...controlsFields];

  // Sort by date (assuming the date is in the 4th position of each field array)
  const sortedFields = allFields.sort((a, b) => {
    const dateA = new Date(a[4].text);
    const dateB = new Date(b[4].text);
    return dateA - dateB;
  });
  const sortedNavigation = sortedFields.map((field, index) => {
    let path = "";

    const label = field[1].text; // "Risk Review", "Governance Review", etc.

    if (label === "Risk Review") path = "/dashboard/risks";
    else if (label === "Governance Review") path = "/dashboard/governance";
    else if (label === "Incident Review") path = "/dashboard/incidents";
    else if (label === "Control Review") path = "/dashboard/compliance";

    return {
      path,
      start: index,
      end: index + 1, // one element range
    };
  });
  console.log(sortedNavigation)

  return (
    <>
      <CardSlider
        caption={{ text: 'upcoming', icon: "faCalendarDay" }}
        titles={["Type", " ", "Title", "owner", "Due Date", "status"]}
        colors={[""]}
        sizes={[2, 8, 20, 6, 6, 6]}
        navigation={sortedNavigation}
        ids={ids}
        fields={sortedFields}
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