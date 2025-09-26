import React, { useEffect, useState } from 'react'
import CardSlider from "../components/CardSlider"
import { risksAPI, governanceItemsAPI, incidentsAPI, complianceAPI } from "../services/api"
import { useNavigate } from 'react-router-dom'
import RisksOverview from '../components/RisksOverview'
import IncidentsOverview from '../components/IncidentsOverview'
import ComplianceOverview from '../components/ComplianceOverview'

function Main() {
  const [risks, setRisks] = useState([]);
  const [governanceItems, setGovernanceItems] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [controls, setControls] = useState([]);
  const [controlFrameworkMap, setControlFrameworkMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Function to calculate due date by adding months to a given date
  const calculateDueDate = (baseDate, monthsToAdd) => {
    if (!baseDate) return null;
    
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    return date;
  };

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
        let frameworkMap = {};
        
        for (const framework of frameworksData) {
          try {
            const requirementsData = await complianceAPI.getRequirementsByFramework(framework.framework_id);
            
            requirementsData.forEach(req => {
              frameworkMap[req.requirement_id] = framework.framework_id;
            });
            
            allRequirements = [...allRequirements, ...requirementsData];
            
            for (const requirement of requirementsData) {
              try {
                const controlsData = await complianceAPI.getControlsByRequirement(requirement.requirement_id);
                
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

  // Prepare data for all overview components
  const [overviewData, setOverviewData] = useState({
    risks: { ids: [], fields: [] },
    incidents: { ids: [], fields: [] },
    compliance: { ids: [], fields: [] },
    upcoming: { ids: [], fields: [], navigation: [] }
  });

  useEffect(() => {
    if (risks.length === 0 && governanceItems.length === 0 && incidents.length === 0 && controls.length === 0) return;

    const allItems = [];
    const risksData = { ids: [], fields: [] };
    const incidentsData = { ids: [], fields: [] };
    const complianceData = { ids: [], fields: [] };

    // Process risks
    risks.forEach((risk) => {
      const dueDate = calculateDueDate(risk.last_reviewed, 2);
      const date = dueDate || new Date(0);
      
      // For upcoming slider
      allItems.push({
        type: "risk",
        field: [
          { type: "i", text: "faChartSimple", color: "#FFA72699" },
          { type: "b", text: "Risk Review", color: "#FFA72699" },
          { type: "t", text: risk.title },
          { type: "t", text: risk.owner || "Unassigned" },
          { type: "t", text: dueDate ? dueDate.toLocaleDateString() : "No date" },
          { type: "t", text: risk.status }
        ],
        id: risk.risk_id,
        path: "/dashboard/risks",
        date: date
      });

      // For risks overview slider
      risksData.ids.push(risk.risk_id);
      risksData.fields.push([
        { type: "t", text: risk.risk_id },
        { type: "t", text: risk.title },
        { type: "t", text: risk.category || "N/A" },
        { type: "t", text: risk.owner || "Unassigned" },
        { type: "t", text: risk.status },
        { type: "t", text: risk.likelihood },
        { type: "t", text: risk.impact },
        { type: "t", text: risk.severity },
        { type: "t", text: risk.last_reviewed ? new Date(risk.last_reviewed).toLocaleDateString() : "Never" },
        { type: "i", text: "faPen", color: "#26A7F6" },
        { type: "i", text: "faTrash", color: "#F44336" }
      ]);
    });

    // Process governance items
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

    // Process incidents
    incidents.forEach((incident) => {
      const dueDate = calculateDueDate(incident.reported_at, 9);
      const date = dueDate || new Date(0);
      
      // For upcoming slider
      allItems.push({
        type: "incident",
        field: [
          { type: "i", text: "faTriangleExclamation", color: "#3b82f699" },
          { type: "b", text: "Incident Review", color: "#3b82f699" },
          { type: "t", text: incident.title },
          { type: "t", text: incident.owner || "Unassigned" },
          { type: "t", text: dueDate ? dueDate.toLocaleDateString() : "No date" },
          { type: "t", text: incident.status }
        ],
        id: incident.incident_id,
        path: "/dashboard/incidents",
        date: date
      });

      // For incidents overview slider
      incidentsData.ids.push(incident.incident_id);
      incidentsData.fields.push([
        { type: "t", text: incident.title },
        { type: "t", text: incident.category || "N/A" },
        { type: "t", text: incident.status },
        { type: "t", text: incident.severity },
        { type: "t", text: incident.reported_at ? new Date(incident.reported_at).toLocaleDateString() : "N/A" },
        { type: "t", text: incident.owner || "Unassigned" },
        { type: "t", text: incident.description || "No description" },
        { type: "i", text: "faPen", color: "#26A7F6" },
        { type: "i", text: "faTrash", color: "#F44336" }
      ]);
    });

    // Process controls
    controls.forEach((control) => {
      const dueDate = calculateDueDate(control.last_reviewed, 9);
      const date = dueDate || new Date(0);
      const frameworkId = controlFrameworkMap[control.control_id] || control.control_id;
      
      // For upcoming slider
      allItems.push({
        type: "control",
        field: [
          { type: "i", text: "faShield", color: "#ff00ff99" },
          { type: "b", text: "Control Review", color: "#ff00ff99" },
          { type: "t", text: control.control_name },
          { type: "t", text: control.owner || "Unassigned" },
          { type: "t", text: dueDate ? dueDate.toLocaleDateString() : "No date" },
          { type: "t", text: control.status }
        ],
        id: frameworkId,
        path: "/dashboard/compliance",
        date: date
      });

      // For compliance overview slider
      complianceData.ids.push(control.control_id);
      complianceData.fields.push([
        { type: "t", text: control.control_id },
        { type: "t", text: control.control_name },
        { type: "t", text: control.description || "No description" },
        { type: "t", text: control.owner || "Unassigned" },
        { type: "t", text: control.status },
        { type: "t", text: control.compliance_status || "Not assessed" },
        { type: "t", text: control.last_reviewed ? new Date(control.last_reviewed).toLocaleDateString() : "Never" },
        { type: "i", text: "faEdit", color: "#3b82f6" },
        { type: "i", text: "faTrash", color: "#ef4444" }
      ]);
    });

    // Sort all items by due date for upcoming slider
    const sortedItems = allItems.sort((a, b) => a.date - b.date);
    const upcomingData = {
      fields: sortedItems.map(item => item.field),
      ids: sortedItems.map(item => item.id),
      navigation: sortedItems.map((item, index) => ({
        path: item.path,
        start: index,
        end: index
      }))
    };

    setOverviewData({
      risks: risksData,
      incidents: incidentsData,
      compliance: complianceData,
      upcoming: upcomingData
    });

  }, [risks, governanceItems, incidents, controls, controlFrameworkMap]);

  if (loading) {
    return (
      <div className="p-4">Loading dashboard data...</div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">Error: {error}</div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* Upcoming Reviews CardSlider */}
      <CardSlider
        caption={{ text: 'upcoming', icon: "faCalendarDay" }}
        titles={["Type", " ", "Title", "owner", "Due Date", "status"]}
        colors={[""]}
        sizes={[2, 8, 20, 6, 6, 6]}
        navigation={overviewData.upcoming.navigation}
        ids={overviewData.upcoming.ids}
        fields={overviewData.upcoming.fields}
      />
      
      {/* Risks Overview */}
      <RisksOverview 
        risks={risks}
        allRisksIds={overviewData.risks.ids}
        allRisksFields={overviewData.risks.fields}
        onAddRisk={() => navigate("/dashboard/addRisk")}
      />
      
      {/* Incidents Overview */}
      <IncidentsOverview 
        incidents={incidents}
        allIncidentsIds={overviewData.incidents.ids}
        allIncidentsFields={overviewData.incidents.fields}
        onAddIncident={() => navigate("/dashboard/addIncident")}
      />
      
      {/* Compliance Overview */}
      <ComplianceOverview 
        frameworks={frameworks}
        requirements={requirements}
        controls={controls}
        allControlsIds={overviewData.compliance.ids}
        allControlsFields={overviewData.compliance.fields}
        onViewCompliance={() => navigate("/dashboard/compliance")}
      />
    </div>
  );
}

export default Main;