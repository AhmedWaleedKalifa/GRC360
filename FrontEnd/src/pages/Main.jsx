import React, { useEffect, useState } from 'react'
import CardSlider from "../components/CardSlider"
import { risksAPI, governanceItemsAPI, incidentsAPI, complianceAPI, usersAPI } from "../services/api"
import { useNavigate } from 'react-router-dom'
import RisksOverview from '../components/RisksOverview'
import IncidentsOverview from '../components/IncidentsOverview'
import ComplianceOverview from '../components/ComplianceOverview'
import { useUser } from '../hooks/useUser'

function Main() {
  const [risks, setRisks] = useState([]);
  const [governanceItems, setGovernanceItems] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [requirements, setRequirements] = useState([]);
  const [controls, setControls] = useState([]);
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});
  const [controlFrameworkMap, setControlFrameworkMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get current user and permissions
  const { currentUser, permissions, loading: userLoading } = useUser();

  // Function to calculate due date by adding months to a given date
  const calculateDueDate = (baseDate, monthsToAdd) => {
    if (!baseDate) return null;
    
    const date = new Date(baseDate);
    date.setMonth(date.getMonth() + monthsToAdd);
    return date;
  };

  // Function to format date as "M/D/YYYY" (e.g., "1/15/2024")
  const formatDateToMonthNumber = (dateString) => {
    if (!dateString) return "No date";
    
    const date = new Date(dateString);
    if (isNaN(date)) return "Invalid date";
    
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Function to get user name by ID
  const getUserNameById = (userId) => {
    if (!userId) return "Unassigned";
    const user = users.find(u => u.user_id === userId || u.id === userId);
    return user ? user.user_name || user.name : `User ${userId}`;
  };

  // Fetch all data from APIs
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        // Fetch data from all APIs in parallel
        const [risksData, governanceData, incidentsData, frameworksData, usersData] = await Promise.all([
          risksAPI.getAll().catch(err => { console.error('Error fetching risks:', err); return []; }),
          governanceItemsAPI.getAll().catch(err => { console.error('Error fetching governance:', err); return []; }),
          incidentsAPI.getAll().catch(err => { console.error('Error fetching incidents:', err); return []; }),
          complianceAPI.getFrameworks().catch(err => { console.error('Error fetching frameworks:', err); return []; }),
          usersAPI.getAll().catch(err => { console.error('Error fetching users:', err); return []; })
        ]);

        setRisks(risksData);
        setGovernanceItems(governanceData);
        setIncidents(incidentsData);
        setFrameworks(frameworksData);
        setUsers(usersData);

        // Create user mapping
        const userMapping = {};
        usersData.forEach(user => {
          userMapping[user.user_id || user.id] = user.user_name || user.name;
        });
        setUserMap(userMapping);

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
        setError('Failed to fetch app data');
        console.error('Error fetching app data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (permissions.canView) {
      fetchAllData();
    }
  }, [permissions.canView]);

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
      const ownerName = getUserNameById(risk.owner);
      
      // For upcoming slider
      allItems.push({
        type: "risk",
        field: [
          { type: "i", text: "faChartSimple", color: "#FFA72699" },
          { type: "b", text: "Risk Review", color: "#FFA72699" },
          { type: "t", text: risk.title },
          { type: "t", text: ownerName },
          { type: "t", text: dueDate ? formatDateToMonthNumber(dueDate) : "No date" },
          { type: "t", text: risk.status }
        ],
        id: risk.risk_id,
        path: "/app/risks",
        date: date
      });

      // For risks overview slider - format dates to M/D/YYYY
      risksData.ids.push(risk.risk_id);
      risksData.fields.push([
        { type: "t", text: risk.title },
        { type: "t", text: risk.category || "N/A" },
        { 
          type: "b", 
          text: risk.status,
          color: risk.status === "open" 
              ? "#FFA72699" 
              : risk.status === "closed" 
              ? "#00ff0099" 
              : "#3b82f699"
        },
        { 
          type: "b", 
          text: risk.severity,
          color: risk.severity === "high" || risk.severity === "critical"
              ? "#ff000099"
              : risk.severity === "medium"
              ? "#ffff0099"
              : "#00ff0099"
        },
        { type: "t", text: formatDateToMonthNumber(risk.created_at) },
        { type: "t", text: ownerName },
        { type: "t", text: calculateDueDate(risk.last_reviewed, 2) ? formatDateToMonthNumber(calculateDueDate(risk.last_reviewed, 2)) : "Unassigned" },
      ]);
    });

    // Process governance items
    governanceItems.forEach((item) => {
      const date = item.next_review ? new Date(item.next_review) : new Date(0);
      const ownerName = getUserNameById(item.owner);
      
      allItems.push({
        type: "governance",
        field: [
          { type: "i", text: "faGavel", color: "#00ff0099" },
          { type: "b", text: "Governance Review", color: "#00ff0099" },
          { type: "t", text: item.governance_name },
          { type: "t", text: ownerName },
          { type: "t", text: item.next_review ? formatDateToMonthNumber(item.next_review) : "No date" },
          { type: "t", text: item.status }
        ],
        id: item.governance_id,
        path: "/app/governance",
        date: date
      });
    });

    // Process incidents
    incidents.forEach((incident) => {
      const dueDate = calculateDueDate(incident.reported_at, 9);
      const date = dueDate || new Date(0);
      const ownerName = getUserNameById(incident.owner);
      
      // For upcoming slider
      allItems.push({
        type: "incident",
        field: [
          { type: "i", text: "faTriangleExclamation", color: "#3b82f699" },
          { type: "b", text: "Incident Review", color: "#3b82f699" },
          { type: "t", text: incident.title },
          { type: "t", text: ownerName },
          { type: "t", text: dueDate ? formatDateToMonthNumber(dueDate) : "No date" },
          { type: "t", text: incident.status }
        ],
        id: incident.incident_id,
        path: "/app/incidents",
        date: date
      });

      // For incidents overview slider - format dates to M/D/YYYY
      incidentsData.ids.push(incident.incident_id);
      incidentsData.fields.push([
        { type: "t", text: incident.title },
        { type: "t", text: incident.category || "N/A" },
        { 
          type: "b", 
          text: incident.status,
          color: incident.status === "open" 
              ? "#FFA72699" 
              : incident.status === "closed" 
              ? "#00ff0099" 
              : "#3b82f699"
        },
        { 
          type: "b", 
          text: incident.severity,
          color: incident.severity === "high" || incident.severity === "critical"
              ? "#ff000099"
              : incident.severity === "medium"
              ? "#ffff0099"
              : "#00ff0099"
        },
        { type: "t", text: formatDateToMonthNumber(incident.created_at) },
        { type: "t", text: ownerName },
        { type: "t", text: calculateDueDate(incident.created_at, 2) ? formatDateToMonthNumber(calculateDueDate(incident.created_at, 2)) : "Unassigned" },
      ]);
    });

    // Process controls
    controls.forEach((control) => {
      const dueDate = calculateDueDate(control.last_reviewed, 9);
      const date = dueDate || new Date(0);
      const frameworkId = controlFrameworkMap[control.control_id] || control.control_id;
      const ownerName = getUserNameById(control.owner);
      
      // For upcoming slider
      allItems.push({
        type: "control",
        field: [
          { type: "i", text: "faShield", color: "#ff00ff99" },
          { type: "b", text: "Control Review", color: "#ff00ff99" },
          { type: "t", text: control.control_name },
          { type: "t", text: ownerName },
          { type: "t", text: dueDate ? formatDateToMonthNumber(dueDate) : "No date" },
          { type: "t", text: control.status }
        ],
        id: frameworkId,
        path: "/app/compliance",
        date: date
      });

      // For compliance overview slider
      complianceData.ids.push(control.control_id);
      complianceData.fields.push([
        { type: "t", text: control.control_id },
        { type: "t", text: control.control_name },
        { type: "t", text: control.description || "No description" },
        { type: "t", text: ownerName },
        { type: "t", text: control.status },
        { type: "t", text: control.compliance_status || "Not assessed" },
        { type: "t", text: control.last_reviewed ? formatDateToMonthNumber(control.last_reviewed) : "Never" },
        { type: "i", text: "faPen", color: "#26A7F6" },
        { type: "i", text: "faTrash", color: "#F44336" }
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

  }, [risks, governanceItems, incidents, controls, controlFrameworkMap, users]);

  // Navigation handlers with permission checks
  const handleAddRisk = () => {
    if (!permissions.isAdmin) {
      alert('You do not have permission to add risks. Admin access required.');
      return;
    }
    navigate('/app/addRisk');
  };

  const handleAddIncident = () => {
    if (!permissions.isAdmin) {
      alert('You do not have permission to add incidents. Admin access required.');
      return;
    }
    navigate('/app/addIncident');
  };

  const handleViewCompliance = () => {
    navigate("/app/compliance");
  };

  // Show loading while checking user permissions
  if (userLoading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading user permissions...</p>
      </div>
    );
  }

  // Check if user has view permission
  if (!permissions.canView) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You do not have permission to view the dashboard.
        </p>
        <button 
          onClick={() => navigate('/app/dashboard')}
          className="button buttonStyle"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        {/* Upcoming Reviews CardSlider */}
        <div className='flex flex-col justify-center'>
          <CardSlider
            caption={{ text: 'upcoming', icon: "faCalendarDay" }}
            titles={["Type", " ", "Title", "owner", "Due Date", "status"]}
            colors={[""]}
            sizes={[2, 8, 20, 6, 6, 6]}
            navigation={overviewData.upcoming.navigation}
            ids={overviewData.upcoming.ids}
            fields={overviewData.upcoming.fields}
          />
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-500 self-center"></div>
        </div>
        
        {/* Risks Overview */}
        <RisksOverview 
          risks={risks}
          allRisksIds={overviewData.risks.ids}
          allRisksFields={overviewData.risks.fields}
          onAddRisk={handleAddRisk}
          permissions={permissions}
        />
        
        {/* Incidents Overview */}
        <IncidentsOverview 
          incidents={incidents}
          allIncidentsIds={overviewData.incidents.ids}
          allIncidentsFields={overviewData.incidents.fields}
          onAddIncident={handleAddIncident}
          permissions={permissions}
        />
        
        {/* Compliance Overview */}
        <ComplianceOverview 
          frameworks={frameworks}
          requirements={requirements}
          controls={controls}
          allControlsIds={overviewData.compliance.ids}
          allControlsFields={overviewData.compliance.fields}
          onViewCompliance={handleViewCompliance}
          permissions={permissions}
        />
      </div>
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
        onAddRisk={handleAddRisk}
        permissions={permissions}
      />
      
      {/* Incidents Overview */}
      <IncidentsOverview 
        incidents={incidents}
        allIncidentsIds={overviewData.incidents.ids}
        allIncidentsFields={overviewData.incidents.fields}
        onAddIncident={handleAddIncident}
        permissions={permissions}
      />
      
      {/* Compliance Overview */}
      <ComplianceOverview 
        frameworks={frameworks}
        requirements={requirements}
        controls={controls}
        onViewCompliance={handleViewCompliance}
        permissions={permissions}
      />
    </div>
  );
}

export default Main;