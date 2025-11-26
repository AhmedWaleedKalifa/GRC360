import { useEffect, useState } from 'react'
import { faGavel, faPlus, faChevronDown, faChevronUp, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Card from "../components/Card"
import CardSlider from '../components/CardSlider'
import { useNavigate, useParams } from 'react-router-dom'
import { governanceItemsAPI, usersAPI } from "../services/api"
import { useUser } from '../hooks/useUser'

// Mission Card Component
const GovernanceMissionCard = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showDetails, setShowDetails] = useState(false);

    if (!isVisible) {
        return (
            <div className="flex justify-center mb-6">
                <button
                    onClick={() => setIsVisible(true)}
                    className="button buttonStyle flex items-center"
                >
                    <FontAwesomeIcon icon={faChevronDown} className="mr-2" />
                    Show Governance Mission & Values
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-200 dark:bg-gray-800 rounded-2xl p-6 mb-6 border-2 border-gray-300 dark:border-gray-600 shadow-lg">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                    <FontAwesomeIcon icon={faInfoCircle} className="h1Icon mr-3 text-blue-600 dark:text-blue-400" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Governance Mission & Values</h3>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowDetails(!showDetails)}
                        className="button buttonStyle text-sm"
                    >
                        <FontAwesomeIcon icon={showDetails ? faChevronUp : faChevronDown} className="mr-1" />
                        {showDetails ? 'Less' : 'More'} Details
                    </button>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="button buttonStyle text-sm"
                    >
                        <FontAwesomeIcon icon={faChevronUp} className="mr-1" />
                        Hide
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">🎯 Mission</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                        To empower organizations with a unified, intelligent platform that simplifies governance,
                        strengthens compliance, and transforms risk into a driver of trust and resilience.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">👁️ Vision</h4>
                    <p className="text-gray-700 dark:text-gray-300">
                        To be the leading digital advisor that redefines GRC by bridging global standards,
                        automation, and actionable insights—making security and compliance an enabler of
                        sustainable growth for every business.
                    </p>
                </div>

                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 border-2 border-purple-200 dark:border-purple-800">
                    <h4 className="font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">💎 Core Values</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <div>• Integrity First</div>
                        <div>• Security by Design</div>
                        <div>• Innovation with Purpose</div>
                        <div>• Collaboration</div>
                        <div>• Excellence</div>
                        <div>• Resilience</div>
                    </div>
                </div>
            </div>

            {showDetails && (
                <div className="mt-6 bg-white dark:bg-gray-900 rounded-xl p-6 border-2 border-orange-200 dark:border-orange-800">
                    <h4 className="font-bold text-lg mb-4 text-gray-900 dark:text-gray-100">Core Values Explained</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-3">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                <h5 className="font-semibold text-blue-700 dark:text-blue-300">1. Integrity First</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    We build trust through transparency, accountability, and ethical practices.
                                </p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                                <h5 className="font-semibold text-green-700 dark:text-green-300">2. Security by Design</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Every feature and service is shaped around safeguarding what matters most.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg">
                                <h5 className="font-semibold text-purple-700 dark:text-purple-300">3. Innovation with Purpose</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    We embrace technology to simplify complexity and deliver real business value.
                                </p>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-lg">
                                <h5 className="font-semibold text-yellow-700 dark:text-yellow-300">4. Collaboration</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    We believe in shared responsibility across people, process, and technology.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                <h5 className="font-semibold text-red-700 dark:text-red-300">5. Excellence</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    We pursue precision, continuous improvement, and measurable outcomes in risk management.
                                </p>
                            </div>
                            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg">
                                <h5 className="font-semibold text-indigo-700 dark:text-indigo-300">6. Resilience</h5>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    We see challenges as opportunities to strengthen and grow.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function Governance() {
    const { id } = useParams();
    const [governanceItems, setGovernanceItems] = useState([]);
    const [users, setUsers] = useState([]); // Add users state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [active, setActive] = useState(0);
    const [notApproved, setNotApproved] = useState(0);
    const navigate = useNavigate();

    // Get current user and permissions
    const { permissions, loading: userLoading } = useUser();

    // Function to get user name by ID
    const getUserNameById = (userId) => {
        if (!userId) return "Unassigned";
        const user = users.find(u => u.user_id === userId || u.id === userId);
        return user ? user.user_name || user.name : `User ${userId}`;
    };

    // Fetch governance items and users from API
    useEffect(() => {
        if (permissions.canView) {
            fetchGovernanceItems();
            fetchUsers();
        }
    }, [permissions.canView]);

    const fetchGovernanceItems = async () => {
        try {
            setLoading(true);
            const data = await governanceItemsAPI.getAll();
            setGovernanceItems(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch governance items');
            console.error('Error fetching governance items:', err);
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

    // Delete governance function
    const deleteGovernance = async (governanceId) => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to delete governance items. Admin access required.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this governance item?')) {
            try {
                await governanceItemsAPI.delete(governanceId);
                setGovernanceItems(prev => prev.filter(item => item.governance_id !== governanceId));
            } catch (err) {
                console.error('Error deleting governance item:', err);
                alert('Failed to delete governance item');
            }
        }
    };

    // Navigation handlers
    const handleAddGovernance = () => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to add governance items. Admin access required.');
            return;
        }
        navigate('/app/addGovernance');
    };

    const handleEditGovernance = (governanceId) => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to edit governance items. Admin access required.');
            return;
        }
        navigate(`/app/editGovernance/${governanceId}`);
    };

    // Calculate stats when data changes
    useEffect(() => {
        if (governanceItems.length === 0) return;

        let newActive = 0;
        let newNotApproved = 0;

        governanceItems.forEach(item => {
            if (item.approval_status !== "approved") {
                newNotApproved++;
            }
            if (item.status === "active") {
                newActive++;
            }
        });

        setActive(newActive);
        setNotApproved(newNotApproved);
    }, [governanceItems]);

    // Prepare data for CardSlider
    const fields = governanceItems.map((item, index) => {
        const actionButtons = [];
        const ownerName = getUserNameById(item.owner); // Get owner name

        if (permissions.isAdmin) {
            actionButtons.push(
                {
                    type: "i",
                    text: "faPen",
                    color: "#26A7F6",
                    click: () => handleEditGovernance(item.governance_id)
                },
                {
                    type: "i",
                    text: "faTrash",
                    color: "#F44336",
                    click: () => deleteGovernance(item.governance_id)
                }
            );
        }

        return [
            { type: "t", text: index + 1 },
            { type: "t", text: item.governance_name },
            { type: "t", text: item.type },
            { type: "t", text: ownerName }, // Use owner name instead of ID
            {
                type: "b",
                text: item.status,
                color: item.status === "active"
                    ? "#00ff0099"
                    : item.status === "draft"
                        ? "#FFA72699"
                        : "#3b82f699"
            },
            { type: "t", text: item.last_reviewed ? new Date(item.last_reviewed).toLocaleDateString() : "Never" },
            { type: "t", text: item.effective_date ? new Date(item.effective_date).toLocaleDateString() : "N/A" },
            { type: "t", text: item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "N/A" },
            { type: "t", text: item.next_review ? new Date(item.next_review).toLocaleDateString() : "N/A" },
            { type: "t", text: "-" },
            { type: "t", text: item.latest_change_summary || "No changes" },
            {
                type: "b",
                text: item.approval_status,
                color: item.approval_status === "approved"
                    ? "#00ff0099"
                    : item.approval_status === "pending"
                        ? "#FFA72699"
                        : "#ff000099"
            },

            { type: "t", text: item.attachment ? "Has attachment" : "No file" },
            ...actionButtons
        ];
    });

    const ids = governanceItems.map(item => item.governance_id);
    const colors = governanceItems.map(item =>
        String(item.governance_id) === id ? "#26A7F680" : ""
    );

    // Calculate expiring soon items
    const expiringSoon = governanceItems.filter(item => {
        if (!item.expiry_date) return false;
        const expiry = new Date(item.expiry_date);
        const now = new Date();
        const expiryYear = expiry.getFullYear();
        const expiryMonth = expiry.getMonth();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const isThisMonth = expiryYear === currentYear && expiryMonth === currentMonth;
        const nextMonth = (currentMonth + 1) % 12;
        const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
        const isNextMonth = expiryYear === nextMonthYear && expiryMonth === nextMonth;
        return isThisMonth || isNextMonth;
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
                    You do not have permission to view governance items.
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
                <h1><FontAwesomeIcon icon={faGavel} className='h1Icon' /> Governance</h1>
                <div className='cardsContainer'>
                    <Card title="Total Documents" value="0" model={1} />
                    <Card title="Active" value="0" model={2} />
                    <Card title="Expiring Soon" value="0" model={1} />
                    <Card title="Pending Approval" value="0" model={2} />
                </div>
                <div className='h2AndButtonContainer '>
                    <div className={`button buttonStyle mr-2 ${permissions.isAdmin ? '' : 'opacity-30 cursor-not-allowed'}`}>
                        <span className={permissions.isAdmin ? '' : 'opacity-0'}>
                            <FontAwesomeIcon icon={faPlus} className=' mr-1' />
                            Add Item
                        </span>
                        {!permissions.isAdmin && (
                            <div className="absolute top-4 left-8 animate-spin rounded-full h-4 w-4 border-4 border-blue-200 border-t-blue-500 self-center"></div>
                        )}
                    </div>
                </div>
                <CardSlider
                    titles={permissions.isAdmin ?
                        ["#", "Name", "Type", "Owner", "Status", "Last Reviewed", "Effective Date", "Expiry Date", "Next Review", "Version", "Change Summary", "Approval Status", "Attachment", "Edit", "Delete"] :
                        ["#", "Name", "Type", "Owner", "Status", "Last Reviewed", "Effective Date", "Expiry Date", "Next Review", "Version", "Change Summary", "Approval Status", "Attachment"]
                    }
                    sizes={permissions.isAdmin ? [1, 16, 5, 11, 9, 7, 7, 7, 6, 4, 9, 7, 4, 3, 4] : [1, 16, 5, 9, 8, 7, 7, 7, 6, 4, 9, 7, 4]}
                    fields={[]}
                    ids={[]}
                />
                <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-500 self-center"></div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <h1><FontAwesomeIcon icon={faGavel} className='h1Icon' /> Governance</h1>
                <div className="p-4 text-red-500">Error: {error}</div>
            </>
        );
    }

    return (
        <>
            <div className='flex flex-row justify-between items-start'>
                <h1><FontAwesomeIcon icon={faGavel} className='h1Icon' /> Governance</h1>
                <div className='max-w-3/4 float-right'>
                    <GovernanceMissionCard />
                </div>
            </div>

            <div className='cardsContainer'>
                <Card title="Total Documents" value={governanceItems.length} model={1} />
                <Card title="Active" value={active} model={2} />
                <Card title="Expiring Soon" value={expiringSoon} model={1} />
                <Card title="Pending Approval" value={notApproved} model={2} />
            </div>

            <div className='h2AndButtonContainer '>
                {permissions.isAdmin ? (
                    <button
                        className="button buttonStyle ml-2"
                        onClick={handleAddGovernance}
                        title="Add new governance item"
                    >
                        <FontAwesomeIcon icon={faPlus} className=' mr-1' />
                        Add Item
                    </button>
                ) : (
                    <div
                        className="button buttonStyle ml-2 opacity-30 cursor-not-allowed"
                        title="Admin access required to add governance items"
                    >
                        <FontAwesomeIcon icon={faPlus} className=' mr-1' />
                        Add Item
                    </div>
                )}
            </div>

            <CardSlider
                caption={{ text: "Governance Items", icon: "faGavel" }}

                titles={permissions.isAdmin ?
                    ["#", "Name", "Type", "Owner", "Status", "Last Reviewed", "Effective Date", "Expiry Date", "Next Review", "Version", "Change Summary", "Approval Status", "Attachment", "Edit", "Delete"] :
                    ["#", "Name", "Type", "Owner", "Status", "Last Reviewed", "Effective Date", "Expiry Date", "Next Review", "Version", "Change Summary", "Approval Status", "Attachment"]
                }
                sizes={permissions.isAdmin ? [1, 16, 5, 11, 9, 7, 7, 7, 6, 4, 9, 7, 4, 3, 4] : [1, 16, 5, 9, 8, 7, 7, 7, 6, 4, 9, 7, 4]}
                colors={colors}
                fields={fields}
                ids={ids}
            />
        </>
    )
}

export default Governance