import React, { useEffect, useState } from 'react'
import Form from '../components/Form'
import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { governanceItemsAPI } from "../services/api";
import { useUser } from '../hooks/useUser';

function AddGovernance() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Get current user and permissions
    const { currentUser, permissions, loading: userLoading } = useUser();

    // Allowed values from your database schema
    const allowedTypes = ['policy', 'procedure', 'standard', 'guideline', 'framework'];
    const allowedStatuses = ['draft', 'under_review', 'approved', 'active', 'archived', 'expired'];
    const allowedApprovalStatuses = ['pending', 'approved', 'rejected', 'requires_changes'];

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
            alert('You do not have permission to add governance items. Admin access required.');
            return;
        }

        try {
            setLoading(true);

            // Prepare governance data with current user as owner
            const governanceData = {
                governance_name: formData.name,
                type: formData.type,
                owner: getCurrentUserId(), // Use current user ID
                status: formData.status || 'draft',
                effective_date: formData.effectiveDate || null,
                expiry_date: formData.expiryDate || null,
                next_review: formData.nextReview || null,
                last_reviewed: formData.lastReviewed || null,
                approval_status: formData.approverState || 'pending',
                approver: null, // Remove approver selection - can be set later
                latest_change_summary: formData.changeSummary || '',
                attachment: null // Remove attachment for now
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

    // Show loading while checking user permissions
    if (userLoading) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading user permissions...</p>
            </div>
        );
    }

    // Check if user has permission to add governance items
    if (!permissions.isAdmin) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You do not have permission to add governance items. Admin access required.
                </p>
                <button
                    onClick={() => navigate('/app/governance')}
                    className="button buttonStyle"
                >
                    Return to Governance
                </button>
            </div>
        );
    }

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="editConfigTitle">Add Governance</h1>
                   
                </div>
                <div className='flex flex-row w-full justify-center relative bottom-6'>
                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
  Adding as: {getCurrentUserName()}
</div>
       </div>
            <button className='templateBackLink' onClick={() => navigate(-1)}>
                <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
                Back
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
                        type: "textarea",
                        isInput: true,
                        label: "Change Summary:",
                        Class: { container: "editInputContainer col-span-2", label: "label", input: "profileFormInput h-24" }
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
                button={loading ? "Adding..." : "Add Governance Item"}
            />
        </div>
        </div >
    )
}

export default AddGovernance