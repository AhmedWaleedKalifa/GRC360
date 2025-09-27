import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { governanceItemsAPI } from "../services/api";
import { useUser } from '../hooks/useUser';

function EditGovernance() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get current user and permissions
    const { currentUser, permissions, loading: userLoading } = useUser();

    // Allowed values from your database schema
    const allowedTypes = ['policy', 'procedure', 'standard', 'guideline', 'framework'];
    const allowedStatuses = ['draft', 'under_review', 'approved', 'active', 'archived', 'expired'];
    const allowedApprovalStatuses = ['pending', 'approved', 'rejected', 'requires_changes'];

    // Safe user property access
    const getCurrentUserName = () => {
        return currentUser?.user_name || currentUser?.name || 'Current User';
    };

    const getCurrentUserId = () => {
        return currentUser?.user_id || currentUser?.id || null;
    };

    // Fetch governance data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // Fetch governance item data
                const governanceData = await governanceItemsAPI.getById(id);
                setItem(governanceData);

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
                setError('You do not have permission to edit governance items. Admin access required.');
                setLoading(false);
                return;
            }

            fetchData();
        }
    }, [id, userLoading, permissions.isAdmin]);

    // Handle form submission
    const handleSubmit = async (formData) => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to edit governance items. Admin access required.');
            return;
        }

        try {
            setLoading(true);

            // Prepare governance data with current user as owner
            const governanceData = {
                governance_name: formData.name,
                type: formData.type,
                owner: getCurrentUserId(), // Use current user as owner
                status: formData.status,
                effective_date: formData.effectiveDate || null,
                expiry_date: formData.expiryDate || null,
                next_review: formData.nextReview || null,
                last_reviewed: formData.lastReviewed || null,
                approval_status: formData.approverState,
                approver: null, // Remove approver selection for now
                latest_change_summary: formData.changeSummary || ''
            };

            await governanceItemsAPI.update(id, governanceData);

            // Show success message
            alert('Governance item updated successfully!');

            navigate(-1); // Go back to previous page after successful update
        } catch (err) {
            console.error('Error updating governance item:', err);
            alert('Failed to update governance item');
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
                    You do not have permission to edit governance items. Admin access required.
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

    if (loading) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading governance data...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Governance</h1>
                    <div className="text-red-500 p-4 bg-red-50 rounded-lg">Error: {error}</div>
                    <button
                        onClick={() => navigate('/app/governance')}
                        className="button buttonStyle mt-4"
                    >
                        Back to Governance
                    </button>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className='smallContainer'>
                <div className="editConfig">
                    <h1 className="editConfigTitle">Edit Governance</h1>
                    <div className="p-4 bg-yellow-50 rounded-lg">Governance item not found</div>
                    <button
                        onClick={() => navigate('/app/governance')}
                        className="button buttonStyle mt-4"
                    >
                        Back to Governance
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="editConfigTitle">Edit Governance</h1>

                </div>
                <div className='flex flex-row w-full justify-center relative bottom-6'>
                    <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
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
                            type: "textarea",
                            isInput: true,
                            label: "Change Summary:",
                            initialValue: item.latest_change_summary || "",
                            Class: { container: "editInputContainer col-span-2", label: "label", input: "profileFormInput h-24" }
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
                    button={loading ? "Saving..." : "Save Changes"}
                />
            </div>
        </div>
    )
}

export default EditGovernance