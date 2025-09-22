import React, { useEffect, useState } from 'react'
import Form from '../components/Form'
import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { governanceItemsAPI, usersAPI } from "../services/api";

function AddGovernance() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [owners, setOwners] = useState([]);
    const [approvers, setApprovers] = useState([]);

    // Allowed values from your database schema
    const allowedTypes = ['policy', 'procedure', 'standard', 'guideline', 'framework'];
    const allowedStatuses = ['draft', 'under_review', 'approved', 'active', 'archived', 'expired'];
    const allowedApprovalStatuses = ['pending', 'approved', 'rejected', 'requires_changes'];

    // Fetch users for owner and approver dropdowns
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const usersData = await usersAPI.getAll();
                const userNames = usersData.map(user => user.user_name);
                setOwners(userNames);
                setApprovers(userNames);
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
            
            // Prepare governance data with proper field mapping
            const governanceData = {
                governance_name: formData.name,
                type: formData.type,
                owner: formData.owner,
                status: formData.status || 'draft',
                effective_date: formData.effectiveDate || null,
                expiry_date: formData.expiryDate || null,
                next_review: formData.nextReview || null,
                last_reviewed: formData.lastReviewed || null,
                approval_status: formData.approverState || 'pending',
                approver: formData.approver,
                latest_change_summary: formData.changeSummary || '',
                attachment: formData.attach || null
            };
            
            await governanceItemsAPI.create(governanceData);
            navigate(-1); // Go back to previous page after successful creation
        } catch (err) {
            console.error('Error creating governance item:', err);
            alert('Failed to create governance item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <h1 className="editConfigTitle">Add Governance</h1>
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
                            required: true,
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } 
                        },
                        { 
                            id: "type", 
                            type: "select", 
                            isInput: true, 
                            label: "Type:", 
                            selectList: allowedTypes, 
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
                            initialValue: "draft",
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "lastReviewed", 
                            type: "date", 
                            isInput: true, 
                            label: "Last Reviewed:", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "effectiveDate", 
                            type: "date", 
                            isInput: true, 
                            label: "Effective Date:", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "expiryDate", 
                            type: "date", 
                            isInput: true, 
                            label: "Expiry Date:", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "nextReview", 
                            type: "date", 
                            isInput: true, 
                            label: "Next Review:", 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "changeSummary", 
                            type: "text", 
                            isInput: false, 
                            label: "Change Summary:", 
                            Class: { container: "editInputContainer", label: "label", input: "profileFormInput" } 
                        },
                        { 
                            id: "approver", 
                            type: "select", 
                            isInput: true, 
                            label: "Approver:", 
                            selectList: ["Unassigned", ...approvers], 
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                        { 
                            id: "approverState", 
                            type: "select", 
                            isInput: true, 
                            label: "Approval Status:", 
                            selectList: allowedApprovalStatuses, 
                            initialValue: "pending",
                            Class: { container: "editInputContainer", label: "label", input: "select" } 
                        },
                    ]}
                    button={loading ? "Adding..." : "Add"}
                />
            </div>
        </div>
    )
}

export default AddGovernance