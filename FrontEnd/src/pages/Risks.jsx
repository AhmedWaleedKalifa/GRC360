import { faChartSimple, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { risksAPI } from "../services/api"

function Risks() {
    const [risks, setRisks] = useState([]);
    const [filteredRisks, setFilteredRisks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();
    
    // Get search context from outlet
    const outletContext = useOutletContext();
    const globalSearchQuery = outletContext?.searchQuery || '';

    // Fetch risks from API with search
    useEffect(() => {
      const fetchRisks = async () => {
          try {
              setLoading(true);
              
              let data;
              
              if (globalSearchQuery) {
                  // Use search API when there's a global search query
                  data = await risksAPI.search(globalSearchQuery);
              } else {
                  // Get all risks when no search
                  data = await risksAPI.getAll();
              }
              
              setRisks(data);
              setFilteredRisks(data);
              setError(null);
          } catch (err) {
              setError('Failed to fetch risks');
          } finally {
              setLoading(false);
          }
      };

      fetchRisks();
  }, [globalSearchQuery]); // Re-fetch when global search changes

  // Listen for global search events
  useEffect(() => {
      const handleGlobalSearch = (event) => {
          if (event.detail.activeSection === 'Risks') {
              // The search will trigger the useEffect above
          }
      };

      window.addEventListener('globalSearch', handleGlobalSearch);
      return () => window.removeEventListener('globalSearch', handleGlobalSearch);
  }, []);

    const deleteRisk = async (riskId) => {
        if (window.confirm('Are you sure you want to delete this risk?')) {
            try {
                await risksAPI.delete(riskId);
                setRisks(prev => prev.filter(risk => risk.risk_id !== riskId));
                setFilteredRisks(prev => prev.filter(risk => risk.risk_id !== riskId));
            } catch (err) {
                alert('Failed to delete risk');
            }
        }
    };

    const [fields, setFields] = useState([]);
    const [colors, setColors] = useState([]);
    const [ids, setIds] = useState([]);

    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

    useEffect(() => {
        const newFields = [];
        const newIds = [];
        const newColors = [];
        
        filteredRisks.forEach((risk) => {
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
    }, [id, filteredRisks]);

    // Calculate stats based on filtered risks
    const totalRisks = filteredRisks.length;
    const openRisks = filteredRisks.filter(risk => risk.status === "open").length;
    const highSeverityRisks = filteredRisks.filter(risk => risk.severity === "high" || risk.severity === "critical").length;
    const reviewedThisMonth = filteredRisks.filter(risk => {
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
                    {globalSearchQuery && <span style={{ fontSize: '1rem', marginLeft: '1rem', color: '#666' }}>Searching...</span>}
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
                {globalSearchQuery && (
                    <span style={{ fontSize: '1rem', marginLeft: '1rem', color: '#666' }}>
                        - Search results for "{globalSearchQuery}" ({filteredRisks.length} found)
                    </span>
                )}
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

            {filteredRisks.length === 0 ? (
                <div className="p-4 text-center">
                    {globalSearchQuery ? `No risks found matching "${globalSearchQuery}"` : "No risks found"}
                </div>
            ) : (
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
            )}
        </>
    );
}

export default Risks;