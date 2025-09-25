import React, { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import CardSlider from '../components/CardSlider';
import { configurationsAPI } from '../services/api';

function Configurations() {
  const [configurations, setConfigurations] = useState([]);
  const [filteredConfigurations, setFilteredConfigurations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  
  // Get search context from outlet
  const outletContext = useOutletContext();
  const globalSearchQuery = outletContext?.searchQuery || '';

  useEffect(() => {
    fetchConfigurations();
  }, [globalSearchQuery]);

  const fetchConfigurations = async () => {
    try {
      setLoading(true);
      
      let data;
      
      if (globalSearchQuery) {
        // Use search API when there's a global search query
        data = await configurationsAPI.search(globalSearchQuery);
      } else {
        // Get all configurations when no search
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
      if (event.detail.activeSection === 'Configurations') {
        // The search will trigger the useEffect above
      }
    };

    window.addEventListener('globalSearch', handleGlobalSearch);
    return () => window.removeEventListener('globalSearch', handleGlobalSearch);
  }, []);

  const [fields, setFields] = useState([]);
  const [colors, setColors] = useState([]);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const newFields = [];
    const newIds = [];
    const newColors = [];
    
    filteredConfigurations.forEach((config) => {
      newFields.push([
        { type: "t", text: config.key },
        { type: "t", text: config.value },
        { type: "i", text: "faPen", color: "#26A7F6", selfNav: "/dashboard/editConfigurations/" + config.config_id },
      ]);
      
      // Set background color for selected configuration
      if (String(config.config_id) === id) {
        newColors.push("#26A7F680"); // Highlight color with transparency
      } else {
        newColors.push(""); // Default no color
      }
      
      newIds.push(config.config_id);
    });

    setFields(newFields);
    setIds(newIds);
    setColors(newColors);
  }, [id, filteredConfigurations]);

  if (loading) {
    return <div>Loading configurations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <CardSlider
        caption={{ text: "Configurations", icon: "faGear" }}
        titles={["Key", "Value", "Action"]}
        sizes={[4, 4, 1]}
        height={"500"}
        ids={ids}
        fields={fields}
        colors={colors}
        selectedId={id}
      />
    </>
  );
}

export default Configurations;