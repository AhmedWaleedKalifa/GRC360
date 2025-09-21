import { faChartSimple, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { risksAPI } from "../services/api"

function Risks() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch risks from API
  useEffect(() => {
    const fetchRisks = async () => {
      try {
        setLoading(true);
        const data = await risksAPI.getAll();
        setRisks(data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch risks');
        console.error('Error fetching risks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRisks();
  }, []);

  const deleteRisk = async (riskId) => {
    if (window.confirm('Are you sure you want to delete this risk?')) {
      try {
        await risksAPI.delete(riskId);
        setRisks(prev => prev.filter(risk => risk.risk_id !== riskId));
      } catch (err) {
        console.error('Error deleting risk:', err);
        alert('Failed to delete risk');
      }
    }
  };

  const [fields, setFields] = useState([]);
  const [colors, setColors] = useState([]);
  const [ids, setIds] = useState([]);

  const currentDate = new Date();
  const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed

  useEffect(() => {
    const newFields = [];
    const newIds = [];
    const newColors = [];
    
    risks.forEach((risk) => {
      newFields.push([
        { type: "t", text: risk.risk_id },
        { type: "t", text: risk.title },
        { type: "t", text: risk.category || "Uncategorized" },
        { type: "t", text: risk.owner || "Unassigned" },
        { 
          type: "b", 
          text: risk.status,
          color: risk.status === "open" 
            ? "#FFA72699" 
            : risk.status === "closed" 
            ? "#00ff0099" 
            : "#3b82f699"
        },
        { type: "t", text: risk.likelihood || "Unknown" },
        { type: "t", text: risk.impact || "Unknown" },
        { 
          type: "b", 
          text: risk.severity,
          color: risk.severity === "high" || risk.severity === "critical"
            ? "#ff000099"
            : risk.severity === "medium"
            ? "#ffff0099"
            : "#00ff0099"
        },
        { type: "t", text: risk.last_reviewed ? new Date(risk.last_reviewed).toLocaleDateString() : "Never" },
        { type: "i", text: "faPen", color: "#26A7F6", selfNav: "/dashboard/editRisk/" + risk.risk_id },
        { type: "i", text: "faTrash", color: "#F44336", click: () => { deleteRisk(risk.risk_id) } },
      ]);
      
      if (String(risk.risk_id) === id) {
        newColors.push("#26A7F680");
      } else {
        newColors.push("")
      }
      newIds.push(risk.risk_id);
    });

    setFields(newFields);
    setIds(newIds);
    setColors(newColors);
  }, [id, risks]);

  // Calculate stats for cards
  const totalRisks = risks.length;
  const openRisks = risks.filter(risk => risk.status === "open").length;
  const highSeverityRisks = risks.filter(risk => risk.severity === "high" || risk.severity === "critical").length;
  const reviewedThisMonth = risks.filter(risk => {
    if (!risk.last_reviewed) return false;
    const reviewDate = new Date(risk.last_reviewed);
    const reviewMonth = String(reviewDate.getMonth() + 1).padStart(2, '0');
    const reviewYear = reviewDate.getFullYear();
    return reviewMonth === currentMonth && reviewYear === currentDate.getFullYear();
  }).length;

  if (loading) {
    return (
      <>
        <h1>
          <FontAwesomeIcon icon={faChartSimple} className="h1Icon" />
          Risk Register
        </h1>
        <div className="p-4">Loading risks...</div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <h1>
          <FontAwesomeIcon icon={faChartSimple} className="h1Icon" />
          Risk Register
        </h1>
        <div className="p-4 text-red-500">Error: {error}</div>
      </>
    );
  }

  return (
    <>
      <h1>
        <FontAwesomeIcon icon={faChartSimple} className="h1Icon" />
        Risk Register
      </h1>

      <div className="cardsContainer">
        <Card title="Total Risks" value={totalRisks} model={1} />
        <Card title="Open Risks" value={openRisks} model={2} />
        <Card title="High Severity" value={highSeverityRisks} model={1} />
        <Card title="Reviewed This Month" value={reviewedThisMonth} model={2} />
      </div>

      <div className="h2AndButtonContainer">
        <h2>Risks</h2>
        <div className="button buttonStyle" onClick={() => { navigate("/dashboard/addRisk") }}>
          <FontAwesomeIcon icon={faPlus} className="mr-1" />
          Add Risk
        </div>
      </div>

      <CardSlider
        titles={[
          "ID",
          "Title",
          "Category",
          "Owner",
          "Status",
          "Likelihood",
          "Impact",
          "Severity",
          "Last Reviewed",
          "Actions",
          "",
        ]}
        sizes={[2, 8, 8, 8, 8, 8, 8, 8, 8, 8, 2]}
        ids={ids}
        fields={fields}
        colors={colors}
        selectedId={id}
      />
    </>
  );
}

export default Risks