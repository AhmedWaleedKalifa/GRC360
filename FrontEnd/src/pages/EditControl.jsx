import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Form from '../components/Form';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { complianceAPI } from '../services/api';
import { useUser } from '../hooks/useUser';

function EditControl() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get current user and permissions
  const { currentUser, permissions, loading: userLoading } = useUser();

  // UPDATED: Use new compliance status values that match database constraint
  const allowedStatuses = ["compliant", "partially compliant", "not compliant"];

  // Format status for display (capitalize)
  const formatStatusForDisplay = (status) => {
    switch (status) {
      case "compliant":
        return "Compliant";
      case "partially compliant":
        return "Partially Compliant";
      case "not compliant":
        return "Not Compliant";
      default:
        return status;
    }
  };

  // Safe user property access
  const getCurrentUserName = () => {
    return currentUser?.user_name || currentUser?.name || 'Current User';
  };

  const getCurrentUserId = () => {
    return currentUser?.user_id || currentUser?.id || null;
  };

  // Fetch control data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log('Fetching control with ID:', id);

        // Fetch control
        const controlData = await complianceAPI.getControlById(id);
        console.log('Control data received:', controlData);
        setItem(controlData);

        setError(null);
      } catch (err) {
        console.error("Error fetching control:", err);
        setError("Failed to fetch control data");
      } finally {
        setLoading(false);
      }
    };

    if (id && !userLoading) {
      // Check permissions
      if (!permissions.isAdmin) {
        setError("You do not have permission to edit controls. Admin access required.");
        setLoading(false);
        return;
      }
      
      // Validate that ID is a number or valid string
      if (!id || id === 'undefined' || id === 'null') {
        setError("Invalid control ID");
        setLoading(false);
        return;
      }
      
      fetchData();
    }
  }, [id, userLoading, permissions.isAdmin]);

  // Handle form submit
  const handleSubmit = async (formData) => {
    if (!permissions.isAdmin) {
      alert('You do not have permission to edit controls. Admin access required.');
      return;
    }

    try {
      setLoading(true);

      // Validate status value
      const submittedStatus = formData.status;
      if (!allowedStatuses.includes(submittedStatus)) {
        alert(`Invalid status value. Allowed values are: ${allowedStatuses.join(', ')}`);
        setLoading(false);
        return;
      }

      // Prepare control payload - use current user as owner
      const controlData = {
        control_name: formData.name,
        status: submittedStatus, // Use validated status
        owner: getCurrentUserId(), // Use current user as owner
        last_reviewed: formData.lastReviewed || null,
        reference: formData.reference,
        notes: formData.notes || "",
      };

      console.log('Submitting control data:', controlData);

      await complianceAPI.updateControl(id, controlData);
      
      // Show success message
      alert('Control updated successfully!');
      
      // Navigate back to compliance page
      navigate('/app/compliance');
    } catch (err) {
      console.error("Error updating control:", err);
      
      // Provide more specific error messages
      if (err.message && err.message.includes('violates check constraint')) {
        alert("Failed to update control: Invalid status value. Please contact administrator.");
      } else {
        alert("Failed to update control. Please check the console for details.");
      }
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
          You do not have permission to edit controls. Admin access required.
        </p>
        <button 
          onClick={() => navigate('/app/compliance')}
          className="button buttonStyle"
        >
          Return to Compliance
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-500 self-center"></div>
        <p className="mt-4 text-gray-600">Loading control data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="smallContainer">
        <div className="editConfig">
          <h1 className="editConfigTitle">Edit Control</h1>
          <div className="text-red-500 p-4 bg-red-50 rounded-lg mb-4">Error: {error}</div>
          <button 
            onClick={() => navigate('/app/compliance')}
            className="button buttonStyle"
          >
            Back to Compliance
          </button>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="smallContainer">
        <div className="editConfig">
          <h1 className="editConfigTitle">Edit Control</h1>
          <div className="p-4 bg-yellow-50 rounded-lg mb-4">Control not found for ID: {id}</div>
          <button 
            onClick={() => navigate('/app/compliance')}
            className="button buttonStyle"
          >
            Back to Compliance
          </button>
        </div>
      </div>
    );
  }

  // Ensure the current item status is valid, fallback to 'not compliant' if not
  const currentStatus = allowedStatuses.includes(item.status) ? item.status : 'not compliant';

  return (
    <div className="smallContainer">
      <div className="editConfig">
        <div className="flex items-center justify-between mb-6">
          <h1 className="editConfigTitle">Edit Control</h1>
        </div>
        
        <div className='flex flex-row w-full justify-center relative bottom-6'>
          <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
            Editing as: {getCurrentUserName()}
          </div>
        </div>
        
        <button className="templateBackLink" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="text-2xl mr-2" />
          Back
        </button>

        <Form
          fstyle={{
            form: "profileForm grid grid-cols-1 md:grid-cols-2 gap-4",
            button: "button buttonStyle col-span-2 mt-4",
          }}
          onSubmit={handleSubmit}
          inputarray={[
            {
              changeable: false,
              id: "name",
              type: "text",
              isInput: true,
              label: "Control Name:",
              initialValue: item.control_name || "",
              required: true,
              Class: {
                container: "editInputContainer",
                label: "label",
                input: "profileFormInput",
              },
            },
            {
              id: "status",
              type: "select",
              isInput: true,
              label: "Compliance Status:",
              selectList: allowedStatuses, // Use simple array of strings
              initialValue: currentStatus,
              required: true,
              Class: {
                container: "editInputContainer",
                label: "label",
                input: "select",
              },
            },
            {
              id: "lastReviewed",
              type: "date",
              isInput: true,
              label: "Last Reviewed:",
              initialValue: item.last_reviewed 
                ? new Date(item.last_reviewed).toISOString().split('T')[0]
                : "",
              Class: {
                container: "editInputContainer",
                label: "label",
                input: "profileFormInput",
              },
            },
            {
              changeable: false,
              id: "reference",
              type: "text",
              isInput: true,
              label: "Reference:",
              initialValue: item.reference || "",
              Class: {
                container: "editInputContainer",
                label: "label",
                input: "profileFormInput",
              },
            },
            {
              id: "notes",
              type: "textarea",
              isInput: true,
              label: "Notes:",
              initialValue: item.notes || "",
              Class: {
                container: "editInputContainer col-span-2",
                label: "label",
                input: "profileFormInput h-24",
              },
            },
          ]}
          button={loading ? "Saving..." : "Save Changes"}
        />
      </div>
    </div>
  );
}

export default EditControl;