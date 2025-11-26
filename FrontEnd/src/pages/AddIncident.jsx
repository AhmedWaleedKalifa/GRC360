import { useState } from 'react'
import Form from '../components/Form'
import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { incidentsAPI } from "../services/api";
import { useUser } from '../hooks/useUser';

function AddIncident() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Get current user and permissions
    const { currentUser, permissions, loading: userLoading } = useUser();

    // Allowed values from your database schema
    const allowedCategories = ['security', 'compliance', 'operational', 'technical', 'physical', 'environmental', 'personnel', 'other'];
    const allowedStatuses = ['reported', 'investigating', 'contained', 'open', 'resolved', 'closed', 'reopened'];
    const allowedSeverities = ['low', 'medium', 'high', 'critical'];
    const allowedPriorities = ['low', 'medium', 'high', 'urgent'];

    // Get current user name safely
    const getCurrentUserName = () => {
        return currentUser?.user_name || currentUser?.name || 'Current User';
    };

    // Get current user ID safely
    const getCurrentUserId = () => {
        return currentUser?.user_id || currentUser?.id || null;
    };

    // Handle form submission
    const handleSubmit = async (formData) => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to add incidents. Admin access required.');
            return;
        }

        try {
            setLoading(true);

            // Prepare incident data with current user as owner
            const incidentData = {
                title: formData.title,
                category: formData.category,
                severity: formData.severity,
                description: formData.description || '',
                status: formData.status || 'reported',
                priority: formData.priority || 'medium',
                owner: getCurrentUserId(), // Use current user ID
                reported_at: new Date().toISOString() // Add current timestamp
            };

            await incidentsAPI.create(incidentData);
            navigate(-1); // Go back to previous page after successful creation
        } catch (err) {
            console.error('Error creating incident:', err);
            alert('Failed to create incident');
        } finally {
            setLoading(false);
        }
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

    // Check if user has permission to add incidents
    if (!permissions.isAdmin) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You do not have permission to add incidents. Admin access required.
                </p>
                <button
                    onClick={() => navigate('/app/incidents')}
                    className="button buttonStyle"
                >
                    Return to Incidents
                </button>
            </div>
        );
    }

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="editConfigTitle">Add Incident</h1>

                </div>
                <div className='flex flex-row w-full justify-center relative bottom-6'>
                    <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
                        Adding as: {getCurrentUserName()}
                    </div>
                </div>
                <button className='templateBackLink' onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} className='text-2xl mr-2' />
                    Back
                </button>



                <Form
                    fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 mt-4" }}
                    onSubmit={handleSubmit}
                    inputarray={[
                        {
                            id: "title",
                            type: "text",
                            isInput: true,
                            label: "Title:",
                            required: true,
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput" }
                        },
                        {
                            id: "category",
                            type: "select",
                            isInput: true,
                            label: "Category:",
                            selectList: allowedCategories,
                            required: true,
                            Class: { container: "editInputContainer", label: "label", input: "select" }
                        },
                        {
                            id: "description",
                            type: "textarea",
                            isInput: true,
                            label: "Description:",
                            Class: { container: "editInputContainer col-span-2", label: "label", input: "profileFormInput h-24" }
                        },
                        {
                            changeable: false,
                            id: "ownerDisplay",
                            type: "text",
                            isInput: true,
                            label: "Owner:",
                            initialValue: getCurrentUserName(),
                            disabled: true,
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput bg-gray-100" }
                        },
                        {
                            id: "status",
                            type: "select",
                            isInput: true,
                            label: "Status:",
                            selectList: allowedStatuses,
                            initialValue: "reported",
                            Class: { container: "editInputContainer", label: "label", input: "select" }
                        },
                        {
                            id: "severity",
                            type: "select",
                            isInput: true,
                            label: "Severity:",
                            selectList: allowedSeverities,
                            required: true,
                            Class: { container: "editInputContainer", label: "label", input: "select" }
                        },
                        {
                            id: "priority",
                            type: "select",
                            isInput: true,
                            label: "Priority:",
                            selectList: allowedPriorities,
                            initialValue: "medium",
                            Class: { container: "editInputContainer", label: "label", input: "select" }
                        },
                    ]}
                    button={loading ? "Adding..." : "Add Incident"}
                />
            </div>
        </div>
    );
}

export default AddIncident;