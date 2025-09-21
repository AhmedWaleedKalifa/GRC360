import { faTriangleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Card from '../components/Card'
import CardSlider from '../components/CardSlider'
import Progress from '../components/Progress'
import Chart from "../components/Chart"
import { useNavigate, useParams } from 'react-router-dom'
import { incidentsAPI } from "../services/api"

function Incidents() {
  const nav = useNavigate();
  const { id } = useParams();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [colors, setColors] = useState([]);

  // Stats for cards
  const [closed, setClosed] = useState(0);
  const [open, setOpen] = useState(0);
  const [investigating, setInvestigating] = useState(0);
  const [highSeverity, setHighSeverity] = useState(0);

  // Fetch incidents from API
  useEffect(() => {
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

    fetchIncidents();
  }, []);

  // Delete incident function
  const deleteIncident = async (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      try {
        await incidentsAPI.delete(incidentId);
        // Remove the deleted incident from state
        setIncidents(incidents.filter(incident => incident.incident_id !== incidentId));
      } catch (err) {
        console.error('Error deleting incident:', err);
        alert('Failed to delete incident');
      }
    }
  };

  // Calculate stats whenever incidents change
  useEffect(() => {
    if (!incidents.length) return;

    let newOpen = 0;
    let newClosed = 0;
    let newInvestigating = 0;
    let newHighSeverity = 0;
    let newColors=[];
    incidents.forEach(incident => {
      if (incident.status === 'open') {
        newOpen += 1;
      } else if (incident.status === 'closed') {
        newClosed += 1;
      } else if (incident.status === 'investigating') {
        newInvestigating += 1;
      }
      if (String(incident.id) === id) {
        newColors.push("#26A7F680");
      } else {
        newColors.push("")
      }
      if (incident.severity === 'high' || incident.severity === 'critical') {
        newHighSeverity += 1;
      }
    });

    setOpen(newOpen);
    setClosed(newClosed);
    setInvestigating(newInvestigating);
    setHighSeverity(newHighSeverity);
    setColors(newColors)
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

  const allIncidentsFields = incidents.map(incident => [
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
    { type: "t", text: incident.owner || 'Unassigned' },
    { type: "t", text: incident.description || 'No description' },
    { type: "i", text: "faPen", color: "#26A7F6", selfNav: `/dashboard/editIncident/${incident.incident_id}` },
    { type: "i", text: "faTrash", color: "#F44336", click: () => deleteIncident(incident.incident_id) }
  ]);

  const recentIncidentsIds = incidents.slice(0, 5).map(incident => incident.incident_id);
  const allIncidentsIds = incidents.map(incident => incident.incident_id);

  if (loading) {
    return <div className="p-4">Loading incidents...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <>
      <div className='w-full h-[fit-content] flex flex-row justify-between items-center'>
        <h1><FontAwesomeIcon icon={faTriangleExclamation} className='h1Icon' /> Incidents</h1>
        <div className='button buttonStyle' onClick={() => { nav('/dashboard/addIncident') }}>Add Incident</div>
      </div>

      <div className='cardsContainer'>
        <Card title="Total Incidents" value={incidents.length} model={1} />
        <Card title="Open" value={open} model={2} />
        <Card title="Closed" value={closed} model={1} />
        <Card title="High Severity" value={highSeverity} model={2} />
      </div>

      <div className='flex flex-row items-center gap-5 w-full flex-nowrap xl:flex-nowrap sm:flex-wrap'>
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
        <div className='w-full h-full'>
          <CardSlider
            caption={{ text: "Recent Incidents", icon: "faClock" }}
            titles={["Title", "Date", "Status"]}
            sizes={[5, 5, 2]}
            colors={["", "", ""]}
            ids={recentIncidentsIds}
            fields={recentIncidentsFields}
            height={"408px"}
          />
        </div>
      </div>

      <CardSlider
        caption={{ text: "All Incidents", icon: "faFolder" }}
        sizes={[6, 2, 4, 3, 5, 3, 7, 2, 0.8]}
        titles={["Title", "Category", "Status", "Severity", "Reported At", "Owner", "Description", "Actions", ""]}
        ids={allIncidentsIds}
        fields={allIncidentsFields}
        colors={colors}
      />
    </>
  );
}

export default Incidents;