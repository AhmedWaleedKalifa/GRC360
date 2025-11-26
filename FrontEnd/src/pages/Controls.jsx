import { useEffect, useState } from 'react'
import CardSlider from "../components/CardSlider"
import { useNavigate, useParams } from 'react-router-dom'
import { complianceAPI, usersAPI } from "../services/api"
import { useUser } from '../hooks/useUser'

function Controls() {
    const navigate = useNavigate()
    const { id } = useParams();
    const [controls, setControls] = useState([]);
    const [requirement, setRequirement] = useState(null);
    const [framework, setFramework] = useState(null);
    const [users, setUsers] = useState([]); // Add users state
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get current user and permissions
    const { permissions, loading: userLoading } = useUser();

    // Function to get user name by ID
    const getUserNameById = (userId) => {
        if (!userId) return "Unassigned";
        const user = users.find(u => u.user_id === userId || u.id === userId);
        return user ? user.user_name || user.name : `User ${userId}`;
    };

    // Function to get status color based on new compliance values
    const getStatusColor = (status) => {
        switch (status) {
            case "compliant":
                return "#00ff0099"; // Green
            case "partially compliant":
                return "#FFA72699"; // Orange/Amber
            case "not compliant":
                return "#ff000099"; // Red
            default:
                return "#6b728099"; // Gray for unknown status
        }
    };

    // Function to get status display text with proper capitalization
    const getStatusDisplayText = (status) => {
        switch (status) {
            case "compliant":
                return "Compliant";
            case "partially compliant":
                return "Partially Compliant";
            case "not compliant":
                return "Not Compliant";
            default:
                return status; // Fallback for any unexpected values
        }
    };

    useEffect(() => {
        const fetchControlsData = async () => {
            try {
                setLoading(true);

                // Fetch users first
                const usersData = await usersAPI.getAll();
                setUsers(usersData);

                // Fetch requirement details
                const requirementData = await complianceAPI.getRequirementById(id);
                setRequirement(requirementData);

                // Fetch framework details
                if (requirementData && requirementData.framework_id) {
                    const frameworkData = await complianceAPI.getFrameworkById(requirementData.framework_id);
                    setFramework(frameworkData);
                }

                // Fetch controls for this requirement
                const controlsData = await complianceAPI.getControlsByRequirement(id);
                setControls(controlsData);
                setError(null);
            } catch (err) {
                setError('Failed to fetch controls data');
                console.error('Error fetching controls data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id && permissions.canView) {
            fetchControlsData();
        }
    }, [id, permissions.canView]);

    // Edit control handler
    const handleEditControl = (controlId) => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to edit controls. Admin access required.');
            return;
        }
        navigate(`/app/editControl/${controlId}`);
    };

    // Prepare data for CardSlider
    const fields = controls.map((control, index) => {
        const actionButtons = [];

        if (permissions.isAdmin) {
            actionButtons.push(
                {
                    type: "i",
                    text: "faPen",
                    color: "#26A7F6",
                    click: () => handleEditControl(control.control_id)
                }
            );
        }

        return [
            { type: "t", text: index + 1 },
            { type: "t", text: control.control_name },
            {
                type: "b",
                text: getStatusDisplayText(control.status),
                color: getStatusColor(control.status)
            },
            { type: "t", text: getUserNameById(control.owner) }, // Use owner name instead of ID
            { type: "t", text: control.last_reviewed ? new Date(control.last_reviewed).toLocaleDateString() : "Never" },
            { type: "t", text: control.reference || "N/A" },
            { type: "t", text: control.notes || "No notes" },
            ...actionButtons
        ];
    });

    const ids = controls.map(control => control.control_id);

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
                    You do not have permission to view controls.
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
                <h2>FrameWorks / framework name  / requirement name</h2>
                <CardSlider
                    caption={{ text: `requirement name Controls` }}
                    titles={permissions.isAdmin ?
                        ["#", "Name", "Status", "Owner", "Last Reviewed", "Reference", "Notes", "Edit"] :
                        ["#", "Name", "Status", "Owner", "Last Reviewed", "Reference", "Notes"]
                    }
                    sizes={permissions.isAdmin ? [1, 16, 5, 6, 5, 5, 6, 2] : [1, 16, 5, 6, 5, 5, 6]}
                    ids={[]}
                    fields={[]}
                />
                <div onClick={() => { navigate(-1) }} className='button buttonStyle w-[fit-content] ml-2' >
                    Back
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <h2>FrameWorks / Requirements / {id}</h2>
                <div className="p-4 text-red-500">Error: {error}</div>
            </>
        );
    }

    if (!requirement) {
        return (
            <>
                <h2>FrameWorks / Requirements / {id}</h2>
                <div className="p-4">Requirement not found</div>
            </>
        );
    }

    return (
        <>
            <h2>FrameWorks / {framework?.framework_name || "Unknown"} / {requirement.requirement_name}</h2>
            <CardSlider
                caption={{ text: `${requirement.requirement_name} Controls` }}
                titles={permissions.isAdmin ?
                    ["#", "Name", "Status", "Owner", "Last Reviewed", "Reference", "Notes", "Edit"] :
                    ["#", "Name", "Status", "Owner", "Last Reviewed", "Reference", "Notes"]
                }
                sizes={permissions.isAdmin ? [1, 12, 7, 6, 5, 5, 12, 1.8] : [1, 12, 5, 6, 5, 5, 12]}
                colors={[]}
                ids={ids}
                fields={fields}
            />
            <div onClick={() => { navigate(-1) }} className='button buttonStyle w-[fit-content] ml-2' >
                Back
            </div>
        </>
    )
}

export default Controls