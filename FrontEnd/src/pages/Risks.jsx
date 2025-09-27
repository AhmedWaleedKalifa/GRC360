import { faChartSimple, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from '../components/Card'
import CardSlider from "../components/CardSlider"
import RiskFormulaCard from "../components/RiskFormulaCard"
import { useNavigate, useParams, useOutletContext } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'
import { risksAPI, usersAPI } from "../services/api"
import { useUser } from '../hooks/useUser'

function Risks() {
    const [risks, setRisks] = useState([]);
    const [filteredRisks, setFilteredRisks] = useState([]);
    const [users, setUsers] = useState([]); // Add users state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    // Get current user and permissions
    const { currentUser, permissions, loading: userLoading } = useUser();

    // Get search context from outlet
    const outletContext = useOutletContext();
    const globalSearchQuery = outletContext?.searchQuery || '';

    // Function to get user name by ID
    const getUserNameById = (userId) => {
        if (!userId) return "Unassigned";
        const user = users.find(u => u.user_id === userId || u.id === userId);
        return user ? user.user_name || user.name : `User ${userId}`;
    };

    // Fetch risks and users from API with search
    const fetchRisks = useCallback(async () => {
        try {
            setLoading(true);
            let data;

            if (globalSearchQuery) {
                data = await risksAPI.search(globalSearchQuery);
            } else {
                data = await risksAPI.getAll();
            }

            setRisks(data);
            setFilteredRisks(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch risks');
            console.error('Error fetching risks:', err);
        } finally {
            setLoading(false);
        }
    }, [globalSearchQuery]);

    const fetchUsers = async () => {
        try {
            const usersData = await usersAPI.getAll();
            setUsers(usersData);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    useEffect(() => {
        fetchRisks();
        fetchUsers();
    }, [fetchRisks]);

    // Simple event handler without dependencies that might cause loops
    useEffect(() => {
        const handleGlobalSearch = (event) => {
            if (event.detail?.activeSection === 'Risks') {
                fetchRisks();
            }
        };

        window.addEventListener('globalSearch', handleGlobalSearch);
        return () => window.removeEventListener('globalSearch', handleGlobalSearch);
    }, []);

    // Delete risk function
    const deleteRisk = async (riskId) => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to delete risks. Admin access required.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this risk?')) {
            try {
                await risksAPI.delete(riskId);
                // Update local state without refetching
                setRisks(prev => prev.filter(risk => risk.risk_id !== riskId));
                setFilteredRisks(prev => prev.filter(risk => risk.risk_id !== riskId));
            } catch (err) {
                alert('Failed to delete risk');
                console.error('Error deleting risk:', err);
            }
        }
    };

    // Navigation handlers - simplified without complex dependencies
    const handleEditRisk = (riskId) => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to edit risks. Admin access required.');
            return;
        }
        // Use window.location to force navigation if navigate() doesn't work
        window.location.href = `/app/editRisk/${riskId}`;
    };

    const handleViewRisk = (riskId) => {
        window.location.href = `/app/viewRisk/${riskId}`;
    };

    const handleAddRisk = () => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to add risks. Admin access required.');
            return;
        }
        window.location.href = '/app/addRisk';
    };

    const [fields, setFields] = useState([]);
    const [colors, setColors] = useState([]);
    const [ids, setIds] = useState([]);

    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');

    // Update fields - simplified to avoid dependency loops
    useEffect(() => {
        if (!filteredRisks.length) {
            setFields([]);
            setIds([]);
            setColors([]);
            return;
        }

        const newFields = [];
        const newIds = [];
        const newColors = [];

        filteredRisks.forEach((risk) => {
            const actionButtons = [];
            const ownerName = getUserNameById(risk.owner); // Get owner name
            
            if (permissions.isAdmin) {
                actionButtons.push(
                    { 
                        type: "i", 
                        text: "faPen", 
                        color: "#26A7F6", 
                        click: () => handleEditRisk(risk.risk_id)
                    },
                    { 
                        type: "i", 
                        text: "faTrash", 
                        color: "#F44336", 
                        click: () => deleteRisk(risk.risk_id)
                    }
                );
            } else {
                actionButtons.push(
                    { 
                        type: "i", 
                        text: "faEye", 
                        color: "#666666",
                        click: () => handleViewRisk(risk.risk_id)
                    }
                );
            }

            newFields.push([
                { type: "t", text: risk.risk_id },
                { type: "t", text: risk.title },
                { type: "t", text: risk.category || "Uncategorized" },
                { type: "t", text: ownerName }, // Use owner name instead of ID
                {
                    type: "b",
                    text: risk.status,
                    color: risk.status === "open" ? "#FFA72699" :
                           risk.status === "closed" ? "#00ff0099" : "#3b82f699"
                },
                { type: "t", text: risk.likelihood || "Unknown" },
                { type: "t", text: risk.impact || "Unknown" },
                {
                    type: "b",
                    text: risk.severity,
                    color: risk.severity === "high" || risk.severity === "critical" ? "#ff000099" :
                           risk.severity === "medium" ? "#ffff0099" : "#00ff0099"
                },
                { type: "t", text: risk.last_reviewed ? new Date(risk.last_reviewed).toLocaleDateString() : "Never" },
                ...actionButtons
            ]);

            newColors.push(String(risk.risk_id) === id ? "#26A7F680" : "");
            newIds.push(risk.risk_id);
        });

        setFields(newFields);
        setIds(newIds);
        setColors(newColors);
    }, [filteredRisks, id, permissions.isAdmin, users]); // Add users to dependencies

    // Calculate stats
    const totalRisks = filteredRisks.length;
    const openRisks = filteredRisks.filter(risk => risk.status === "open").length;
    const highSeverityRisks = filteredRisks.filter(risk => 
        risk.severity === "high" || risk.severity === "critical"
    ).length;
    const reviewedThisMonth = filteredRisks.filter(risk => {
        if (!risk.last_reviewed) return false;
        const reviewDate = new Date(risk.last_reviewed);
        return reviewDate.getMonth() === currentDate.getMonth() && 
               reviewDate.getFullYear() === currentDate.getFullYear();
    }).length;

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
                    You do not have permission to view risks.
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
                <h1>
                    <FontAwesomeIcon icon={faChartSimple} className="h1Icon" />
                    Risk Register
                    {globalSearchQuery && (
                        <span style={{ fontSize: '1rem', marginLeft: '1rem', color: '#666' }}>
                            - Searching...
                        </span>
                    )}
                </h1>

                <RiskFormulaCard />

                <div className="cardsContainer">
                    <Card title="Total Risks" value="0" model={1} />
                    <Card title="Open Risks" value="0" model={2} />
                    <Card title="High Severity" value="0" model={1} />
                    <Card title="Reviewed This Month" value="0" model={2} />
                </div>

                <div className="h2AndButtonContainer">
                    <h2>Risk items</h2>
                    <div className={`button mr-2 ${permissions.isAdmin ? 'buttonStyle' : 'buttonStyle opacity-30 cursor-not-allowed'}`}>
                        <FontAwesomeIcon icon={faPlus} className="mr-1" />
                        Add Risk
                    </div>
                </div>

                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-500 self-center"></div>
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
                <button onClick={fetchRisks} className="button buttonStyle mt-4">
                    Retry
                </button>
            </>
        );
    }

    return (
        <>
            <div className='flex flex-row justify-between'>
                <h1>
                    <FontAwesomeIcon icon={faChartSimple} className="h1Icon" />
                    Risk Register
                    {globalSearchQuery && (
                        <span style={{ fontSize: '1rem', marginLeft: '1rem', color: '#666' }}>
                            - Search results for "{globalSearchQuery}" ({filteredRisks.length} found)
                        </span>
                    )}
                    {!permissions.isAdmin && (
                        <span style={{ fontSize: '0.8rem', marginLeft: '1rem', color: '#ff6b35' }}>
                            (View Only)
                        </span>
                    )}
                </h1>

                <div className='max-w-3/4 float-right'>
                    <RiskFormulaCard />
                </div>
            </div>

            <div className="cardsContainer">
                <Card title="Total Risks" value={totalRisks} model={1} />
                <Card title="Open Risks" value={openRisks} model={2} />
                <Card title="High Severity" value={highSeverityRisks} model={1} />
                <Card title="Reviewed This Month" value={reviewedThisMonth} model={2} />
            </div>

            <div className="h2AndButtonContainer">
                <h2>Risk items</h2>
                {permissions.isAdmin ? (
                    <button 
                        className="button buttonStyle mr-2"
                        onClick={handleAddRisk}
                        title="Add new risk"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-1" />
                        Add Risk
                    </button>
                ) : (
                    <div 
                        className="button buttonStyle mr-2 opacity-30 cursor-not-allowed"
                        title="Admin access required to add risks"
                    >
                        <FontAwesomeIcon icon={faPlus} className="mr-1" />
                        Add Risk
                    </div>
                )}
            </div>

            {filteredRisks.length === 0 ? (
                <div className="p-4 text-center">
                    {globalSearchQuery ? `No risks found matching "${globalSearchQuery}"` : "No risks found"}
                </div>
            ) : (
                <CardSlider
                    titles={permissions.isAdmin ? 
                        ["ID", "Title", "Category", "Owner", "Status", "Likelihood", "Impact", "Severity", "Last Reviewed", "Edit", "Delete"] :
                        ["ID", "Title", "Category", "Owner", "Status", "Likelihood", "Impact", "Severity", "Last Reviewed", "View"]
                    }
                    sizes={permissions.isAdmin ? [2, 8, 8, 8, 8, 8, 8, 8, 8, 3, 3] : [2, 8, 8, 8, 8, 8, 8, 8, 8, 6]}
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