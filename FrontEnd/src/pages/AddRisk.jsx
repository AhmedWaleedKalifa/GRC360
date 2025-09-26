import React, { useEffect, useState } from 'react'
import Form from '../components/Form'
import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { risksAPI, usersAPI } from "../services/api";

function AddRisk() {
    const [loading, setLoading] = useState(false);
    const [owners, setOwners] = useState([]);
    const navigate = useNavigate();

    // Allowed values from your database schema
    const allowedStatuses = ['open', 'in_progress', 'closed', 'mitigated'];
    const allowedSeverities = ['low', 'medium', 'high', 'critical'];
    const allowedImpacts = ['low', 'medium', 'high', 'critical'];
    const allowedLikelihoods = ['low', 'medium', 'high', 'certain'];
    const allowedCategories = ['Financial', 'Operational', 'Strategic', 'Compliance', 'Reputational', 'Technical', 'Other'];

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
                formData.owner = null;
            }
            
            // Prepare risk data with proper formatting
            const riskData = {
                title: formData.title,
                description: formData.description || '',
                category: formData.category || 'Other',
                type: formData.type || 'Operational',
                status: formData.status || 'open',
                severity: formData.severity,
                impact: formData.impact || 'medium',
                likelihood: formData.likelihood || 'medium',
                owner: formData.owner || null,
                last_reviewed: formData.lastReviewed || null,
                notes: formData.notes || ''
            };
            
            await risksAPI.create(riskData);
            navigate(-1); // Go back to previous page after successful creation
        } catch (err) {
            console.error('Error creating risk:', err);
            alert('Failed to create risk');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <h1 className="editConfigTitle">Add Risk</h1>
                <button className='templateBackLink' onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
                </button>
                <Form 
                    fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 my-4" }}
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
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "description", 
                            type: "text", 
                            isInput: true, 
                            label: "Description:", 
                            Class: { container: "editInputContainer col-span-2", label: "label", input: "profileFormInput" } 
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
                            initialValue: "open",
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "likelihood", 
                            type: "select", 
                            isInput: true, 
                            label: "Likelihood:", 
                            selectList: allowedLikelihoods, 
                            initialValue: "medium",
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "impact", 
                            type: "select", 
                            isInput: true, 
                            label: "Impact:", 
                            selectList: allowedImpacts, 
                            initialValue: "medium",
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
                            id: "lastReviewed", 
                            type: "date", 
                            isInput: true, 
                            label: "Last Reviewed:", 
                            Class: { container: "editInputContainer ", label: "label", input: "select" } 
                        },
                    ]}
                    button={loading ? "Adding..." : "Add"}
                />
            </div>
        </div>
    )
}

export default AddRisk