import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { risksAPI, usersAPI } from "../services/api";

function EditRisk() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [owners, setOwners] = useState([]);
    const [ownerName, setOwnerName] = useState("Loading...");
    const navigate = useNavigate();

    // Allowed values from your database schema
    const allowedStatuses = ['open', 'in_progress', 'closed', 'mitigated'];
    const allowedSeverities = ['low', 'medium', 'high', 'critical'];
    const allowedImpacts = ['low', 'medium', 'high', 'critical'];
    const allowedLikelihoods = ['low', 'medium', 'high', 'certain'];
    const allowedCategories = ['Financial', 'Operational', 'Strategic', 'Compliance', 'Reputational', 'Technical', 'Other'];

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

    // Fetch risk data and users
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch risk data
                const riskData = await risksAPI.getById(id);
                setItem(riskData);
                
                // Fetch users for owner dropdown
                const usersData = await usersAPI.getAll();
                const userNames = usersData.map(user => user.user_name);
                setOwners(userNames);
                
                // Get owner name for display
                const name = await getOwnerName(riskData.owner);
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
            
            // Prepare risk data for update
            const riskData = {
                title: formData.title,
                description: formData.description || '',
                category: formData.category,
                status: formData.status,
                severity: formData.severity,
                impact: formData.impact,
                likelihood: formData.likelihood,
                owner: formData.owner,
                last_reviewed: formData.lastReviewed || null,
                notes: formData.notes || ''
            };
            
            await risksAPI.update(id, riskData);
            navigate(-1); // Go back to previous page after successful update
        } catch (err) {
            console.error('Error updating risk:', err);
            alert('Failed to update risk');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center">
            <div class="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-600 self-center"></div>
         </div>
        );
    }

    if (error) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Risk</h1>
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Risk</h1>
                    <div>Risk not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <h1 className="editConfigTitle">Edit Risk</h1>
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
                            required: true,
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } 
                        },
                        { 
                            id: "category", 
                            type: "select", 
                            isInput: true, 
                            label: "Category:", 
                            selectList: allowedCategories, 
                            initialValue: item.category || "Other", 
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
                            selectList: allowedStatuses, 
                            initialValue: item.status, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "likelihood", 
                            type: "select", 
                            isInput: true, 
                            label: "Likelihood:", 
                            selectList: allowedLikelihoods, 
                            initialValue: item.likelihood || "medium", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "impact", 
                            type: "select", 
                            isInput: true, 
                            label: "Impact:", 
                            selectList: allowedImpacts, 
                            initialValue: item.impact || "medium", 
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
                            id: "lastReviewed", 
                            type: "date", 
                            isInput: true, 
                            label: "Last Reviewed:", 
                            initialValue: item.last_reviewed ? item.last_reviewed.split('T')[0] : "", 
                            Class: { container: "editInputContainer ", label: "label", input: "select" } 
                        },
                    ]}
                    button={loading ? "Saving..." : "Save"}
                />
            </div>
        </div>
    )
}

export default EditRisk