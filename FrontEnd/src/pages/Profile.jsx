import { useEffect, useState } from 'react';
import Form from '../components/Form';
import { useUser } from '../hooks/useUser';
import { usersAPI } from '../services/api';

function Profile() {
    const [loading, setLoading] = useState(true);
    const [saveLoading, setSaveLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get current user and permissions
    const { currentUser, refreshUser, loading: userLoading } = useUser();

    // Safe user property access
    const getCurrentUserName = () => {
        return currentUser?.user_name || currentUser?.name || '';
    };

    const getCurrentUserEmail = () => {
        return currentUser?.email || '';
    };

    const getCurrentUserPhone = () => {
        return currentUser?.phone || '';
    };

    const getCurrentUserJobTitle = () => {
        return currentUser?.job_title || '';
    };

    const getCurrentUserId = () => {
        return currentUser?.user_id || currentUser?.id || null;
    };

    // Handle form submission
    const handleSubmit = async (formData) => {
        try {
            setSaveLoading(true);
            setError(null);

            // Prepare user data for update
            const userData = {
                user_name: formData.user_name,
                email: formData.email,
                phone: formData.phone,
                job_title: formData.job_title,
                ...(formData.password && formData.password.trim() !== '' && { password: formData.password })
            };


            // Get current user ID
            const userId = getCurrentUserId();
            if (!userId) {
                throw new Error('User ID not found');
            }

            // Call API to update the user profile
            await usersAPI.update(userId, userData);

            // Show success message
            alert('Profile updated successfully!');

            // Refresh user data to get updated information - this now works properly
            if (refreshUser) {
                await refreshUser();
            }

        } catch (err) {
            console.error('Error updating profile:', err);
            const errorMessage = err.message || 'Failed to update profile. Please try again.';
            setError(errorMessage);
            alert('Error: ' + errorMessage);
        } finally {
            setSaveLoading(false);
        }
    };

    // Set loading state based on user loading
    useEffect(() => {
        if (!userLoading && currentUser) {
            setLoading(false);
        }
    }, [userLoading, currentUser]);

    // Show loading while checking user data
    if (userLoading || loading || !currentUser) {
        return (
            <div className="h-full w-full flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading user data...</p>
            </div>
        );
    }

    return (
        <>
            <div className='profile'>
                <div className='profileHeader'>
                    <span>Welcome {getCurrentUserJobTitle() ? `${getCurrentUserJobTitle()}.` : ''} {getCurrentUserName()}</span>
                </div>
                <div className='profileBr'></div>
                <div className='profileInfo'>
                    <img
                        className='profileInfoImage'
                        src={'/default-avatar.png'}
                        alt="Profile"
                    />
                    <div className='profileInfoTextContainer'>
                        <span className='profileInfoFirstSpan'>
                            {getCurrentUserName()}
                        </span>
                        <span className='profileInfoSecondSpan'>
                            {getCurrentUserEmail()}
                        </span>
                    </div>
                </div>

                <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 h-fit rounded-2xl mt-4 text-center">
                    Editing profile: {getCurrentUserName()}
                </div>

                {error && (
                    <div className="text-red-500 p-4 bg-red-50 rounded-lg mt-4">
                        Error: {error}
                    </div>
                )}

                <Form
                    fstyle={{
                        form: "profileForm",
                        title: "profileFormTitle",
                        button: "profileFormButton col-span-2"
                    }}
                    button={saveLoading ? "Saving..." : "Save Changes"}
                    inputarray={[
                        {
                            id: "user_name",
                            label: "User Name:",
                            type: "text",
                            isInput: true,
                            initialValue: getCurrentUserName(),
                            placeholder: "Your Name",
                            required: true,
                            Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" }
                        },
                        {
                            id: "email",
                            label: "Email:",
                            type: "email",
                            isInput: true,
                            initialValue: getCurrentUserEmail(),
                            changeable: false,
                            placeholder: "Your Email",
                            required: true,
                            Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" }
                        },
                        {
                            id: "password",
                            label: "New Password:",
                            type: "password",
                            isInput: true,
                            initialValue: "",
                            placeholder: "Enter new password (leave blank to keep current)",
                            required: false,
                            Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" }
                        },
                        {
                            id: "phone",
                            label: "Phone Number:",
                            type: "tel",
                            isInput: true,
                            initialValue: getCurrentUserPhone(),
                            placeholder: "Your Phone Number",
                            required: false,
                            Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" }
                        },
                        {
                            id: "job_title",
                            label: "Job Title:",
                            type: "text",
                            isInput: true,
                            initialValue: getCurrentUserJobTitle(),
                            placeholder: "Your Job Title",
                            required: false,
                            Class: { container: "profileInputContainer", label: "profileFormLabel", input: "profileFormInput" }
                        },
                    ]}
                    onSubmit={handleSubmit}
                />

                <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
                    <strong>Security Note:</strong> Password changes will take effect immediately.
                    Make sure to use a strong, unique password.
                </div>
            </div>
        </>
    );
}

export default Profile;