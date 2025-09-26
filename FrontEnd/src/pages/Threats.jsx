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
      newFields.push([
        { type: "t", text: threat.message },
        { type: "t", text: threat.severity },
        { type: "t", text: threat.created_at },
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
    <>
     {/* <div className='flex flex-col justify-center'>
       <CardSlider
      caption={{ text: "Live Threat Feed", icon: "faCircleExclamation" }}
      titles={["description", "severity", "time"]}
      sizes={[4, 1, 2]}
      fields={[]}
    />

      </div> */}
      <div class="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-600 self-center"></div>
    </>
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <CardSlider
      caption={{ text: "Live Threat Feed", icon: "faCircleExclamation" }}
      titles={["description", "severity", "time"]}
      sizes={[4, 1, 2]}
      colors={colors} // Use the colors array for highlighting
      height={"500"}
      fields={fields}
      ids={ids}
      selectedId={id} // Pass the selected ID to CardSlider if it supports it
    />
  );
}

export default Threats