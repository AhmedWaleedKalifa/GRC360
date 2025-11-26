import { useState } from 'react'
import Form from '../components/Form'
import { useNavigate } from 'react-router-dom';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { risksAPI } from "../services/api";
import { useUser } from '../hooks/useUser';

function AddRisk() {
    const [loading, setLoading] = useState(false);
    const [calculatedSeverity, setCalculatedSeverity] = useState('');
    const [riskScore, setRiskScore] = useState(0);
    const navigate = useNavigate();

    // Get current user and permissions
    const { currentUser, permissions, loading: userLoading } = useUser();

    // Allowed values from your database schema
    const allowedStatuses = ['open', 'in_progress', 'closed', 'mitigated'];
    const allowedImpacts = [1, 2, 3, 4, 5];
    const allowedLikelihoods = [1, 2, 3, 4, 5];
    const allowedCategories = ['Financial', 'Operational', 'Strategic', 'Compliance', 'Reputational', 'Technical', 'Other'];

    // Create simple numeric options for impact and likelihood
    const impactOptions = allowedImpacts.map(num => num.toString());
    const likelihoodOptions = allowedLikelihoods.map(num => num.toString());

    // Get current user name safely
    const getCurrentUserName = () => {
        return currentUser?.user_name || currentUser?.name || 'Current User';
    };

    // Get current user ID safely
    const getCurrentUserId = () => {
        return currentUser?.user_id || currentUser?.id || null;
    };

    // Calculate severity based on impact and likelihood
    const calculateSeverity = (impact, likelihood) => {
        if (!impact || !likelihood) return { score: 0, severity: '' };

        const impactValue = parseInt(impact);
        const likelihoodValue = parseInt(likelihood);

        const score = impactValue * likelihoodValue;
        let severity = '';

        if (score >= 16 && score <= 25) severity = 'critical';
        else if (score >= 11 && score <= 15) severity = 'high';
        else if (score >= 6 && score <= 10) severity = 'medium';
        else if (score >= 1 && score <= 5) severity = 'low';

        return { score, severity };
    };

    // Handle form data changes to update calculated severity
    const handleFormChange = (formData) => {
        if (formData.impact && formData.likelihood) {
            const calculation = calculateSeverity(formData.impact, formData.likelihood);
            setRiskScore(calculation.score);
            setCalculatedSeverity(calculation.severity);
        }
    };

    // Handle form submission
    const handleSubmit = async (formData) => {
        if (!permissions.isAdmin) {
            alert('You do not have permission to add risks. Admin access required.');
            return;
        }

        try {
            setLoading(true);

            // Prepare risk data with current user as owner
            const riskData = {
                title: formData.title,
                description: formData.description || '',
                category: formData.category || 'Other',
                type: 'Operational', // Default type
                status: formData.status || 'open',
                impact: parseInt(formData.impact || 3),
                likelihood: parseInt(formData.likelihood || 3),
                severity: calculatedSeverity || 'medium', // Use calculated severity
                owner: getCurrentUserId(), // Use current user ID
                last_reviewed: formData.lastReviewed || null,
                notes: formData.notes || '',
                due_date: null // Add required field
            };

            await risksAPI.create(riskData);
            navigate(-1);
        } catch (err) {
            console.error('Error creating risk:', err);
            alert('Failed to create risk: ' + (err.message || 'Unknown error'));
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

    // Check if user has permission to add risks
    if (!permissions.isAdmin) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                    You do not have permission to add risks. Admin access required.
                </p>
                <button
                    onClick={() => navigate('/app/risks')}
                    className="button buttonStyle"
                >
                    Return to Risks
                </button>
            </div>
        );
    }

    return (
        <div className='smallContainer'>
            <div className="editConfig">
                <div className="flex items-center justify-center mb-6">
                    <h1 className="editConfigTitle">Add Risk</h1>

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

                {/* Current user info */}


                {/* Display calculated severity */}
                {(calculatedSeverity || riskScore > 0) && (
                    <div className="mb-4 p-3 border rounded bg-gray-50 dark:bg-gray-800">
                        <h3 className="font-semibold">Risk Calculation</h3>
                        <p>Risk Score: {riskScore} ({calculatedSeverity})</p>
                        <small className="text-gray-600 dark:text-gray-400">
                            Score = Impact × Likelihood
                        </small>
                    </div>
                )}

                <Form
                    fstyle={{ form: "profileForm", button: "button buttonStyle col-span-2 my-4" }}
                    onSubmit={handleSubmit}
                    onFormChange={handleFormChange}
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
                            initialValue: "open",
                            Class: { container: "editInputContainer", label: "label", input: "select" }
                        },
                        {
                            id: "impact",
                            type: "select",
                            isInput: true,
                            label: "Impact (1-5):",
                            selectList: impactOptions,
                            initialValue: "3",
                            Class: { container: "editInputContainer", label: "label", input: "select" }
                        },
                        {
                            id: "likelihood",
                            type: "select",
                            isInput: true,
                            label: "Likelihood (1-5):",
                            selectList: likelihoodOptions,
                            initialValue: "3",
                            Class: { container: "editInputContainer", label: "label", input: "select" }
                        },
                        {
                            id: "lastReviewed",
                            type: "date",
                            isInput: true,
                            label: "Last Reviewed:",
                            Class: { container: "editInputContainer", label: "label", input: "select" }
                        },
                    ]}
                    button={loading ? "Adding..." : "Add Risk"}
                />
            </div>
        </div>
    )
}

export default AddRisk