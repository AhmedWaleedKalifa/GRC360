import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext, useNavigate } from 'react-router-dom';
import CardSlider from '../components/CardSlider';
import { configurationsAPI } from '../services/api';
import { useUser } from '../hooks/useUser';

function Configurations() {
  const [configurations, setConfigurations] = useState([]);
  const [filteredConfigurations, setFilteredConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get current user and permissions
  const { currentUser, permissions, loading: userLoading } = useUser();

  // Get search context from outlet
  const outletContext = useOutletContext();
  const globalSearchQuery = outletContext?.searchQuery || '';

  useEffect(() => {
    if (permissions.canView) {
      fetchConfigurations();
    }
  }, [globalSearchQuery, permissions.canView]);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      
      let data;
      
      if (globalSearchQuery) {
        data = await configurationsAPI.search(globalSearchQuery);
      } else {
        data = await configurationsAPI.getAll();
      }
      
      setConfigurations(data);
      setFilteredConfigurations(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch configurations');
      console.error('Error fetching configurations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Listen for global search events
  useEffect(() => {
    const handleGlobalSearch = (event) => {
      if (event.detail.activeSection === 'Configurations' && permissions.canView) {
        fetchConfigurations();
      }
    };

    window.addEventListener('globalSearch', handleGlobalSearch);
    return () => window.removeEventListener('globalSearch', handleGlobalSearch);
  }, [permissions.canView]);

  const [fields, setFields] = useState([]);
  const [colors, setColors] = useState([]);
  const [ids, setIds] = useState([]);

  // Edit configuration handler
  const handleEditConfiguration = (configId) => {
    if (!permissions.isAdmin) {
      alert('You do not have permission to edit configurations. Admin access required.');
      return;
    }
   navigate(`/app/editConfigurations/${configId}`);
  };

  useEffect(() => {
    const newFields = [];
    const newIds = [];
    const newColors = [];
    
    filteredConfigurations.forEach((config) => {
      const actionButtons = [];
      
      if (permissions.isAdmin) {
        actionButtons.push(
          { 
            type: "i", 
            text: "faPen", 
            color: "#26A7F6", 
            click: () => handleEditConfiguration(config.config_id) 
          }
        );
      }

      newFields.push([
        { type: "t", text: config.key },
        { type: "t", text: config.value },
        ...actionButtons
      ]);
      
      if (String(config.config_id) === id) {
        newColors.push("#26A7F680");
      } else {
        newColors.push("");
      }
      
      newIds.push(config.config_id);
    });

    setFields(newFields);
    setIds(newIds);
    setColors(newColors);
  }, [id, filteredConfigurations, permissions.isAdmin]);

  // Show loading while checking user permissions
  if (userLoading) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <div className="animate-spin rounded-full h-14 w-14 border-4 border-blue-200 border-t-blue-500"></div>
        <p className="mt-4 text-gray-600">Loading user permissions...</p>
      </div>
    );
  }

  // Check if user has view permission
  if (!permissions.canView) {
    return (
      <div className="h-full w-full flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          You do not have permission to view configurations.
        </p>
        <button 
          onClick={() => navigate('/app/dashboard')}
          className="button buttonStyle"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <>
        <div className='flex flex-col justify-center'>
          <CardSlider
            caption={{ text: "Configurations", icon: "faGear" }}
            titles={permissions.isAdmin ? ["Name", "Value", "Edit"] : ["Name", "Value"]}
            sizes={permissions.isAdmin ? [8, 8, 1] : [12, 12]}
            height={"500"}
            ids={ids}
            fields={[]}
            colors={colors}
            selectedId={id}
          />
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-500 self-center"></div>
        </div>
      </>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <CardSlider
        caption={{ text: "Configurations", icon: "faGear" }}
        titles={permissions.isAdmin ? ["Name", "Value", "Edit"] : ["Name", "Value"]}
        sizes={permissions.isAdmin ? [10, 10, 1] : [12, 12]}
        height="600px"
        ids={ids}
        fields={fields}
        colors={colors}
        selectedId={id}
      />
    </>
  );
}

export default Configurations;