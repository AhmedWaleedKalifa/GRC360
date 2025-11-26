import { faPlus, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useEffect, useState } from 'react'
import Card from '../components/Card'
import CardSlider from '../components/CardSlider'
import Progress from '../components/Progress'
import Chart from "../components/Chart"
import { useNavigate, useParams } from 'react-router-dom'
import { incidentsAPI, usersAPI } from "../services/api"
import { useUser } from '../hooks/useUser'

function Incidents() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]); // Add users state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get current user and permissions
  const { permissions, loading: userLoading } = useUser();

  // Stats for cards
  const [closed, setClosed] = useState(0);
  const [open, setOpen] = useState(0);
  const [investigating, setInvestigating] = useState(0);
  const [highSeverity, setHighSeverity] = useState(0);

  // Function to get user name by ID
  const getUserNameById = (userId) => {
    if (!userId) return "Unassigned";
    const user = users.find(u => u.user_id === userId || u.id === userId);
    return user ? user.user_name || user.name : `User ${userId}`;
  };

  // Fetch incidents and users from API
  useEffect(() => {
    if (permissions.canView) {
      fetchIncidents();
      fetchUsers();
    }
  }, [permissions.canView]);

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const data = await incidentsAPI.getAll();
      setIncidents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch incidents');
      console.error('Error fetching incidents:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  // Delete incident function
  const deleteIncident = async (incidentId) => {
    if (!permissions.isAdmin) {
      alert('You do not have permission to delete incidents. Admin access required.');
      return;
    }

    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await incidentsAPI.delete(incidentId);
        setIncidents(incidents.filter(incident => incident.incident_id !== incidentId));
      } catch (err) {
        console.error('Error deleting incident:', err);
        alert('Failed to delete incident');
      }
    }
  };

  // Navigation handlers
  const handleAddIncident = () => {
    if (!permissions.isAdmin) {
      alert('You do not have permission to add incidents. Admin access required.');
      return;
    }
    navigate('/app/addIncident');
  };

  const handleEditIncident = (incidentId) => {
    if (!permissions.isAdmin) {
      alert('You do not have permission to edit incidents. Admin access required.');
      return;
    }
    navigate(`/app/editIncident/${incidentId}`);
  };

  // Calculate stats whenever incidents change
  useEffect(() => {
    if (!incidents.length) return;

    let newOpen = 0;
    let newClosed = 0;
    let newInvestigating = 0;
    let newHighSeverity = 0;
    incidents.forEach(incident => {
      if (incident.status === 'open') {
        newOpen += 1;
      } else if (incident.status === 'closed') {
        newClosed += 1;
      } else if (incident.status === 'investigating') {
        newInvestigating += 1;
      }

      if (incident.severity === 'high' || incident.severity === 'critical') {
        newHighSeverity += 1;
      }
    });

    setOpen(newOpen);
    setClosed(newClosed);
    setInvestigating(newInvestigating);
    setHighSeverity(newHighSeverity);
  }, [incidents]);

  // Prepare data for CardSlider components
  const recentIncidentsFields = incidents.slice(0, 5).map(incident => [
    { type: "t", text: incident.title },
    { type: "t", text: new Date(incident.reported_at).toLocaleDateString() },
    {
      type: "b",
      text: incident.status,
      color: incident.status === "open"
        ? "#FFA72699"
        : incident.status === "closed"
          ? "#00ff0099"
          : "#3b82f699"
    }
  ]);

  const allIncidentsFields = incidents.map(incident => {
    const actionButtons = [];
    const ownerName = getUserNameById(incident.owner); // Get owner name

    if (permissions.isAdmin) {
      actionButtons.push(
        { type: "i", text: "faPen", color: "#26A7F6", click: () => handleEditIncident(incident.incident_id) },
        { type: "i", text: "faTrash", color: "#F44336", click: () => deleteIncident(incident.incident_id) }
      );
    }

    return [
      { type: "t", text: incident.title },
      { type: "t", text: incident.category },
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
      { type: "t", text: new Date(incident.reported_at).toLocaleDateString() },
      { type: "t", text: ownerName }, // Use owner name instead of ID
      { type: "t", text: incident.description || 'No description' },
      ...actionButtons
    ];
  });

  const colors = incidents.map(item =>
    String(item.incident_id) === id ? "#26A7F680" : ""
  );
  const recentIncidentsIds = incidents.slice(0, 5).map(incident => incident.incident_id);
  const allIncidentsIds = incidents.map(incident => incident.incident_id);

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
          You do not have permission to view incidents.
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
      <>
        <div className='w-full h-[fit-content] flex flex-row justify-between items-center'>
          <h1><FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon' /> Incidents</h1>
          <div className={`button mr-2 ${permissions.isAdmin ? 'buttonStyle' : 'buttonStyle opacity-30 cursor-not-allowed'}`}>
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Add Incident
          </div>
        </div>

        <div className='cardsContainer'>
          <Card title="Total Incidents" value='0' model={1} />
          <Card title="Open" value='0' model={2} />
          <Card title="Closed" value='0' model={1} />
          <Card title="High Severity" value='0' model={2} />
        </div>

        <div className='flex flex-row items-center x w-full flex-nowrap xl:flex-nowrap sm:flex-wrap'>
          <div className='w-[50%] h-full flex flex-row items-center gap-4'>
            <Chart
              title={"Incidents by Status"}
              array={[
                { name: "Closed", value: 0, color: "#00ff0080" },
                { name: "Investigating", value: 0, color: "#3b82f680" },
                { name: "Open", value: 0, color: "#FFA72680" }
              ]}
            />
            <Progress
              title={"Resolution Progress"}
              footer={"incidents closed"}
              num='0'
              all='0'
            />
          </div>
          <div className='w-[50%] h-full flex flex-col justify-center'>
            <CardSlider
              caption={{ text: "Recent Incidents", icon: "faClock" }}
              titles={["Title", "Date", "Status"]}
              sizes={[5, 5, 2]}
              fields={[]}
              ids={[]}
              height={"408px"}
            />
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-500 self-center"></div>
          </div>
        </div>
        <div className='flex flex-col justify-center'>
          <CardSlider
            caption={{ text: "All Incidents", icon: "faFolder" }}
            sizes={permissions.isAdmin ? [7, 3, 6, 5, 5, 4, 10, 2, 2] : [7, 3, 6, 5, 5, 4, 10]}
            titles={permissions.isAdmin ?
              ["Title", "Category", "Status", "Severity", "Reported At", "Owner", "Description", "Edit", "Delete"] :
              ["Title", "Category", "Status", "Severity", "Reported At", "Owner", "Description"]
            }
            ids={[]}
            fields={[]}
          />
          <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-500 self-center"></div>
        </div>
      </>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className='w-full h-[fit-content] flex flex-row justify-between items-center'>
        <h1><FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon' /> Incidents</h1>
        {permissions.isAdmin ? (
          <button
            className="button buttonStyle mr-2"
            onClick={handleAddIncident}
            title="Add new incident"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Add Incident
          </button>
        ) : (
          <div
            className="button buttonStyle mr-2 opacity-30 cursor-not-allowed"
            title="Admin access required to add incidents"
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            Add Incident
          </div>
        )}
      </div>

      <div className='cardsContainer'>
        <Card title="Total Incidents" value={incidents.length} model={1} />
        <Card title="Open" value={open} model={2} />
        <Card title="Closed" value={closed} model={1} />
        <Card title="High Severity" value={highSeverity} model={2} />
      </div>

      <div className='flex flex-row items-center x w-full flex-nowrap xl:flex-nowrap sm:flex-wrap mx-2'>
        <div className='w-[48%] h-full flex flex-row items-center gap-4'>
          <Chart
            title={"Incidents by Status"}
            array={[
              { name: "Closed", value: closed, color: "#00ff0080" },
              { name: "Investigating", value: investigating, color: "#3b82f680" },
              { name: "Open", value: open, color: "#FFA72680" }
            ]}
          />
          <Progress
            title={"Resolution Progress"}
            footer={"incidents closed"}
            num={closed}
            all={incidents.length}
          />
        </div>
        <div className='ml-4 w-[50%] h-full '>
          <CardSlider
            caption={{ text: "Recent Incidents", icon: "faClock" }}
            titles={["Title", "Date", "Status"]}
            sizes={[11, 3, 3]}
            colors={["", "", ""]}
            ids={recentIncidentsIds}
            fields={recentIncidentsFields}
            height={"408px"}
          />
        </div>
      </div>

      <CardSlider
        caption={{ text: "All Incidents", icon: "faFolder" }}
        sizes={permissions.isAdmin ? [18, 6, 7, 5, 5, 8, 18, 2.2, 3.7] : [16, 5, 5, 4, 5, 7, 20]}
        titles={permissions.isAdmin ?
          ["Title", "Category", "Status", "Severity", "Reported At", "Owner", "Description", `Edit`, `    Delete`] :
          ["Title", "Category", "Status", "Severity", "Reported At", "Owner", "Description"]
        }
        ids={allIncidentsIds}
        fields={allIncidentsFields}
        colors={colors}
      />
    </>
  );
}

export default Incidents;