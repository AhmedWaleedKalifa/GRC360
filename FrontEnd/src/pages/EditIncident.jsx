import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { incidentsAPI } from "../services/api";
import { useUser } from '../hooks/useUser';

function EditIncident() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Get current user and permissions
    const { currentUser, permissions, loading: userLoading } = useUser();

    // Allowed values from your database schema
    const allowedCategories = ['security', 'compliance', 'operational', 'technical', 'physical', 'environmental', 'personnel', 'other'];
    const allowedStatuses = ['reported', 'investigating', 'contained', 'open', 'resolved', 'closed', 'reopened'];
    const allowedSeverities = ['low', 'medium', 'high', 'critical'];
    const allowedPriorities = ['low', 'medium', 'high', 'urgent'];

    // Safe user property access
    const getCurrentUserName = () => {
        return currentUser?.user_name || currentUser?.name || 'Current User';
    };

    const getCurrentUserId = () => {
        return currentUser?.user_id || currentUser?.id || null;
    };

    // Fetch incident data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch incident data
                const incidentData = await incidentsAPI.getById(id);
                setItem(incidentData);
                
                setError(null);
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id && !userLoading) {
            // Check permissions
            if (!permissions.isAdmin) {
                setError('You do not have permission to edit incidents. Admin access required.');
                setLoading(false);
                return;
            }
            
            fetchData();
        }
    }, [id, userLoading, permissions.isAdmin]);

    // Handle form submission
    const handleSubmit = async (formData) => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to edit incidents. Admin access required.');
            return;
        }

        try {
            setLoading(true);
            
            // Prepare incident data with current user as owner
            const incidentData = {
                title: formData.title,
                category: formData.category,
                description: formData.description || "",
                owner: getCurrentUserId(), // Use current user as owner
                status: formData.status,
                severity: formData.severity,
                priority: formData.priority || "medium"
            };
            
            await incidentsAPI.update(id, incidentData);
            
            // Show success message
            alert('Incident updated successfully!');
            
            navigate(-1); // Go back to previous page after successful update
        } catch (err) {
            console.error('Error updating incident:', err);
            alert('Failed to update incident');
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

    // Check if user has admin permission
    if (!permissions.isAdmin) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You do not have permission to edit incidents. Admin access required.
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

    if (loading) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading incident data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Incident</h1>
                    <div className="text-red-500 p-4 bg-red-50 rounded-lg">Error: {error}</div>
                    <button 
                        onClick={() => navigate('/app/incidents')}
                        className="button buttonStyle mt-4"
                    >
                        Back to Incidents
                    </button>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Incident</h1>
                    <div className="p-4 bg-yellow-50 rounded-lg">Incident not found</div>
                    <button 
                        onClick={() => navigate('/app/incidents')}
                        className="button buttonStyle mt-4"
                    >
                        Back to Incidents
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="editConfigTitle">Edit Incident</h1>
                   
                </div>
                <div className='flex flex-row w-full justify-center relative bottom-6'>
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
  Editing as: {getCurrentUserName()}
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
                            label: "betweenTitle:", 
                            initialValue: item.title, 
                            required: true,
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } 
                        },
                        { 
                            id: "category", 
                            type: "select", 
                            isInput: true, 
                            label: "Category:", 
                            selectList: allowedCategories, 
                            initialValue: item.category, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "description", 
                            type: "textarea", 
                            isInput: true, 
                            label: "Description:", 
                            initialValue: item.description || "", 
                            Class: { container: "editInputContainer col-span-2", label: "label", input: "profileFormInput h-24" } 
                        },
                        { 
                            changeable:false,
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
                            initialValue: item.status, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "severity", 
                            type: "select", 
                            isInput: true, 
                            label: "Severity:", 
                            selectList: allowedSeverities, 
                            initialValue: item.severity, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "priority", 
                            type: "select", 
                            isInput: true, 
                            label: "Priority:", 
                            selectList: allowedPriorities, 
                            initialValue: item.priority || "medium", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                    ]}
                    button={loading ? "Saving..." : "Save Changes"}
                />
            </div>
        </div>
    );
}

export default EditIncident;