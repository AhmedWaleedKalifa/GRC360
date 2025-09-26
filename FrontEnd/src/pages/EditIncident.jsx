import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { incidentsAPI, usersAPI } from "../services/api";

function EditIncident() {
    const { id } = useParams();
    const [owners, setOwners] = useState([]);
    const [severity, setSeverity] = useState([]);
    const [status, setStatus] = useState([]);
    const [category, setCategory] = useState([]);
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ownerName, setOwnerName] = useState("Loading...");
    const navigate = useNavigate();

    // Allowed values from your database schema
    const allowedCategories = ['security', 'compliance', 'operational', 'technical', 'physical', 'environmental', 'personnel', 'other'];
    const allowedStatuses = ['reported', 'investigating', 'contained', 'open', 'resolved', 'closed', 'reopened'];
    const allowedSeverities = ['low', 'medium', 'high', 'critical'];
    const allowedPriorities = ['low', 'medium', 'high', 'urgent'];

    // Get owner name from user ID
    const getOwnerName = async (ownerId) => {
        if (!ownerId) return "Unassigned";
        
        try {
            const users = await usersAPI.getAll();
            const user = users.find(u => u.user_id === ownerId);
            return user ? user.user_name : "Unknown";
        } catch (err) {
            console.error('Error fetching user:', err);
            return "Unknown";
        }
    };

    // Fetch incident data and users
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch incident data
                const incidentData = await incidentsAPI.getById(id);
                setItem(incidentData);
                
                // Fetch users for owner dropdown
                const usersData = await usersAPI.getAll();
                const userNames = usersData.map(user => user.user_name);
                setOwners(userNames);
                
                // Set the allowed values for dropdowns
                setCategory(allowedCategories);
                setStatus(allowedStatuses);
                setSeverity(allowedSeverities);
                
                // Get owner name for display
                const name = await getOwnerName(incidentData.owner);
                setOwnerName(name);
                
                setError(null);
            } catch (err) {
                setError('Failed to fetch data');
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchData();
        }
    }, [id]);

    // Handle form submission
    const handleSubmit = async (formData) => {
        try {
            // Convert owner name to user ID if needed
            if (formData.owner && formData.owner !== "Unassigned") {
                const users = await usersAPI.getAll();
                const user = users.find(u => u.user_name === formData.owner);
                if (user) {
                    formData.owner = user.user_id;
                }
            } else {
                formData.owner = null; // Set to null if unassigned
            }
            
            await incidentsAPI.update(id, formData);
            navigate(-1); // Go back to previous page after successful update
        } catch (err) {
            console.error('Error updating incident:', err);
            alert('Failed to update incident');
        }
    };

    if (loading) {
        return (
            <>
            <div className="h-full w-full flex flex-col justify-center items-center">
               <div class="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 self-center"></div>
            </div>
          </>
        );
    }

    if (error) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Incident</h1>
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Incident</h1>
                    <div>Incident not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <h1 className="editConfigTitle">Edit Incident</h1>
                <button className='templateBackLink' onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
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
                            initialValue: item.title, 
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } 
                        },
                        { 
                            id: "category", 
                            type: "select", 
                            isInput: true, 
                            label: "Category:", 
                            selectList: category, 
                            initialValue: item.category, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "description", 
                            type: "text", 
                            isInput: true, 
                            label: "Description:", 
                            initialValue: item.description || "", 
                            Class: { container: "editInputContainer col-span-2", label: "label", input: "profileFormInput" } 
                        },
                        { 
                            id: "owner", 
                            type: "select", 
                            isInput: true, 
                            label: "Owner:", 
                            selectList: ["Unassigned", ...owners], 
                            initialValue: ownerName, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "status", 
                            type: "select", 
                            isInput: true, 
                            label: "Status:", 
                            selectList: status, 
                            initialValue: item.status, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "severity", 
                            type: "select", 
                            isInput: true, 
                            label: "Severity:", 
                            selectList: severity, 
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
                    button={"Save"}
                />
            </div>
        </div>
    );
}

export default EditIncident;