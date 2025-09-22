import React, { useState, useEffect } from 'react'
import Form from '../components/Form'
import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { incidentsAPI, usersAPI } from "../services/api";

function AddIncident() {
    const navigate = useNavigate();
    const [owners, setOwners] = useState([]);
    const [loading, setLoading] = useState(false);
    
    // Allowed values from your database schema
    const allowedCategories = ['security', 'compliance', 'operational', 'technical', 'physical', 'environmental', 'personnel', 'other'];
    const allowedStatuses = ['reported', 'investigating', 'contained', 'open', 'resolved', 'closed', 'reopened'];
    const allowedSeverities = ['low', 'medium', 'high', 'critical'];
    const allowedPriorities = ['low', 'medium', 'high', 'urgent'];

    // Fetch users for owner dropdown
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await usersAPI.getAll();
                const userNames = usersData.map(user => user.user_name);
                setOwners(userNames);
            } catch (err) {
                console.error('Error fetching users:', err);
            }
        };

        fetchUsers();
    }, []);

    // Handle form submission
    const handleSubmit = async (formData) => {
        try {
            setLoading(true);
            
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
            
            // Add default values for required fields
            const incidentData = {
                title: formData.title,
                category: formData.category,
                severity: formData.severity,
                description: formData.description || '',
                status: formData.status || 'reported',
                priority: formData.priority || 'medium',
                owner: formData.owner || null
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

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <h1 className="editConfigTitle">Add Incident</h1>
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
                            required: true,
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } 
                        },
                        { 
                            id: "description", 
                            type: "text", 
                            isInput: false, 
                            label: "Description:", 
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
                            id: "owner", 
                            type: "select", 
                            isInput: true, 
                            label: "Owner:", 
                            selectList: ["Unassigned", ...owners], 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
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
                    button={loading ? "Adding..." : "Add"}
                />
            </div>
        </div>
    );
}

export default AddIncident;