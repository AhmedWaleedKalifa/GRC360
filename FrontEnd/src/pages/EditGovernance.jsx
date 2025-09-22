import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { governanceItemsAPI, usersAPI } from "../services/api";

function EditGovernance() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [owners, setOwners] = useState([]);
    const [approvers, setApprovers] = useState([]);
    const [ownerName, setOwnerName] = useState("Loading...");
    const [approverName, setApproverName] = useState("Loading...");

    // Allowed values from your database schema
    const allowedTypes = ['policy', 'procedure', 'standard', 'guideline', 'framework'];
    const allowedStatuses = ['draft', 'under_review', 'approved', 'active', 'archived', 'expired'];
    const allowedApprovalStatuses = ['pending', 'approved', 'rejected', 'requires_changes'];

    // Get user name from user ID
    const getUserName = async (userId) => {
        if (!userId) return "Unassigned";
        
        try {
            const users = await usersAPI.getAll();
            const user = users.find(u => u.user_id === userId);
            return user ? user.user_name : "Unknown";
        } catch (err) {
            console.error('Error fetching user:', err);
            return "Unknown";
        }
    };

    // Fetch governance data and users
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch governance item data
                const governanceData = await governanceItemsAPI.getById(id);
                setItem(governanceData);
                
                // Fetch users for dropdowns
                const usersData = await usersAPI.getAll();
                const userNames = usersData.map(user => user.user_name);
                setOwners(userNames);
                setApprovers(userNames);
                
                // Get owner and approver names for display
                const ownerName = await getUserName(governanceData.owner);
                const approverName = await getUserName(governanceData.approver);
                setOwnerName(ownerName);
                setApproverName(approverName);
                
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
            
            // Convert owner and approver names to user IDs if needed
            const users = await usersAPI.getAll();
            
            if (formData.owner && formData.owner !== "Unassigned") {
                const user = users.find(u => u.user_name === formData.owner);
                if (user) {
                    formData.owner = user.user_id;
                }
            } else {
                formData.owner = null;
            }
            
            if (formData.approver && formData.approver !== "Unassigned") {
                const user = users.find(u => u.user_name === formData.approver);
                if (user) {
                    formData.approver = user.user_id;
                }
            } else {
                formData.approver = null;
            }
            
            // Prepare governance data for update
            const governanceData = {
                governance_name: formData.name,
                type: formData.type,
                owner: formData.owner,
                status: formData.status,
                effective_date: formData.effectiveDate || null,
                expiry_date: formData.expiryDate || null,
                next_review: formData.nextReview || null,
                last_reviewed: formData.lastReviewed || null,
                approval_status: formData.approverState,
                approver: formData.approver,
                latest_change_summary: formData.changeSummary || ''
            };
            
            await governanceItemsAPI.update(id, governanceData);
            navigate(-1); // Go back to previous page after successful update
        } catch (err) {
            console.error('Error updating governance item:', err);
            alert('Failed to update governance item');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Governance</h1>
                    <div>Loading governance data...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Governance</h1>
                    <div className="text-red-500">Error: {error}</div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Governance</h1>
                    <div>Governance item not found</div>
                </div>
            </div>
        );
    }

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <h1 className="editConfigTitle">Edit Governance</h1>
                <button className='templateBackLink' onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
                </button>
                <Form 
                    fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 mt-4" }}
                    onSubmit={handleSubmit}
                    inputarray={[
                        { 
                            id: "name", 
                            type: "text", 
                            isInput: true, 
                            label: "Name:", 
                            initialValue: item.governance_name, 
                            required: true,
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } 
                        },
                        { 
                            id: "type", 
                            type: "select", 
                            isInput: true, 
                            label: "Type:", 
                            selectList: allowedTypes, 
                            initialValue: item.type, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
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
                            id: "lastReviewed", 
                            type: "date", 
                            isInput: true, 
                            label: "Last Reviewed:", 
                            initialValue: item.last_reviewed ? item.last_reviewed.split('T')[0] : "", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "effectiveDate", 
                            type: "date", 
                            isInput: true, 
                            label: "Effective Date:", 
                            initialValue: item.effective_date ? item.effective_date.split('T')[0] : "", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "expiryDate", 
                            type: "date", 
                            isInput: true, 
                            label: "Expiry Date:", 
                            initialValue: item.expiry_date ? item.expiry_date.split('T')[0] : "", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "nextReview", 
                            type: "date", 
                            isInput: true, 
                            label: "Next Review:", 
                            initialValue: item.next_review ? item.next_review.split('T')[0] : "", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "changeSummary", 
                            type: "text", 
                            isInput: false, 
                            label: "Change Summary:", 
                            initialValue: item.latest_change_summary || "", 
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } 
                        },
                        { 
                            id: "approver", 
                            type: "select", 
                            isInput: true, 
                            label: "Approver:", 
                            selectList: ["Unassigned", ...approvers], 
                            initialValue: approverName, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "approverState", 
                            type: "select", 
                            isInput: true, 
                            label: "Approval Status:", 
                            selectList: allowedApprovalStatuses, 
                            initialValue: item.approval_status, 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                    ]}
                    button={loading ? "Saving..." : "Save"}
                />
            </div>
        </div>
    )
}

export default EditGovernance