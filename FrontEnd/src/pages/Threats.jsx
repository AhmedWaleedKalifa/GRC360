import React, { useEffect, useState } from 'react'
import CardSlider from '../components/CardSlider'
import { threatsAPI } from "../services/api"
import { useParams } from 'react-router-dom'

function Threats() {
  const [threats, setThreats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the ID from URL params
  
  const [fields, setFields] = useState([]);
  const [colors, setColors] = useState([]);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    fetchThreats();
  }, []);

  // Update fields and colors when threats or id changes
  useEffect(() => {
    const newFields = [];
    const newIds = [];
    const newColors = [];
    
    threats.forEach((threat) => {
      // Format the date for better readability
      const formattedDate = threat.created_at 
        ? new Date(threat.created_at).toLocaleDateString() 
        : 'Unknown';
      
      // Create severity badge with colors
      const severityBadge = {
        type: "b",
        text: threat.severity,
        color: getSeverityColor(threat.severity)
      };

      newFields.push([
        { type: "t", text: threat.message },
        severityBadge, // Use the colored badge instead of plain text
        { type: "t", text: formattedDate },
      ]);
      
      // Highlight the row if it matches the ID from params
      if (String(threat.threat_id) === id) {
        newColors.push("#26A7F680"); // Highlight color
      } else {
        newColors.push(""); // Default color
      }
      
      newIds.push(threat.id);
    });

    setFields(newFields);
    setIds(newIds);
    setColors(newColors);
  }, [threats, id]); // Re-run when threats or id changes

  // Function to get color based on severity
  const getSeverityColor = (severity) => {
    if (!severity) return "#3b82f699"; // Default blue
    
    const severityLower = severity.toLowerCase();
    
    switch (severityLower) {
      case 'critical':
      case 'high':
        return "#ff000099"; // Red
      case 'medium':
        return "#ffff0099"; // Yellow
      case 'low':
      case 'info':
        return "#00ff0099"; // Green
      default:
        return "#3b82f699"; // Blue for unknown
    }
  };

  const fetchThreats = async () => {
    try {
      setLoading(true);
      const data = await threatsAPI.getAll();
      setThreats(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch threats');
      console.error('Error fetching threats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading threats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 text-center">
        Error: {error}
        <button 
          onClick={fetchThreats} 
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <CardSlider
      caption={{ text: "Live Threat Feed", icon: "faCircleExclamation" }}
      titles={["Description", "Severity", "Time"]}
      sizes={[20, 4, 2]}
      colors={colors} // Use the colors array for highlighting
      height={"500"}
      fields={fields}
      ids={ids}
      selectedId={id} // Pass the selected ID to CardSlider if it supports it
    />
  );
}

export default Threats