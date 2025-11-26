import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Form from "../components/Form";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { configurationsAPI } from "../services/api";
import { useUser } from "../hooks/useUser";

const EditConfigurations = () => {
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();

  const getCurrentUserName = () => {
    return currentUser?.user_name || currentUser?.name || 'Current User';
  };


  // Fetch configuration by ID
  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        setLoading(true);
        const configuration = await configurationsAPI.getById(id);
        setItem(configuration);
        setError(null);
      } catch (err) {
        setError('Failed to fetch configuration');
        console.error('Error fetching configuration:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchConfiguration();
    }
  }, [id]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      await configurationsAPI.update(id, {
        value: formData.value, // only update the value
      });
      navigate(-1); // Go back to previous page after successful update
    } catch (err) {
      console.error('Error updating configuration:', err);
      alert('Failed to update configuration');
    }
  };

  if (loading) {
    return (
      <>
        <div className="h-full w-full flex flex-col justify-center items-center">
          <div class="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-500 self-center"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className='smallContainer'>
        <div className="editConfig">
          <h1 className="editConfigTitle">Edit Configuration</h1>
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className='smallContainer'>
        <div className="editConfig">
          <h1 className="editConfigTitle">Edit Configuration</h1>
          <div>Configuration not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className='smallContainer'>
      <div className="editConfig">
        <h1 className="editConfigTitle">Edit {item?.key} </h1>
        <div className='flex flex-row w-full justify-center relative '>
          <div className="text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full dark:text-blue-400 dark:bg-blue-900/30">
            Editing as: {getCurrentUserName()}
          </div>
        </div>
        <button className='templateBackLink' onClick={() => navigate("/app/configurations")}>
          <FontAwesomeIcon icon={faArrowLeft} className='text-2xl' />
        </button>
        <Form
          fstyle={{ form: "editConfigForm", button: "button buttonStyle" }}
          onSubmit={handleSubmit}
          inputarray={[
            {
              id: "value",
              type: "text",
              isInput: true,
              label: "Value:",
              initialValue: item?.value,
              Class: { container: "editInputContainer", label: "label", input: "profileFormInput" }
            },
          ]}
          button={"Save"}
        />
      </div>
    </div>
  );
};

export default EditConfigurations;
