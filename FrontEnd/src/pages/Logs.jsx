import React, { useState, useEffect } from 'react'
import { auditLogsAPI } from '../services/api'
import CardSlider from '../components/CardSlider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router-dom';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get the ID from URL params

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await auditLogsAPI.getAll();
      setLogs(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Format action details for display
  const formatDetails = (details) => {
    if (!details) return 'No details';
    try {
      const parsedDetails = JSON.parse(details);
      if (typeof parsedDetails === 'object') {
        // Show only the first few key details to avoid overcrowding
        const entries = Object.entries(parsedDetails);
          return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
      }
      return String(parsedDetails).substring(0, 50) + (String(parsedDetails).length > 50 ? '...' : '');
    } catch {
      return String(details).substring(0, 50) + (String(details).length > 50 ? '...' : '');
    }
  };

  // Prepare data for CardSlider with color highlighting
  const [fields, setFields] = useState([]);
  const [colors, setColors] = useState([]);
  const [ids, setIds] = useState([]);

  useEffect(() => {
    const newFields = [];
    const newIds = [];
    const newColors = [];
    
    logs.forEach((log) => {
      newFields.push([
        { 
          type: "t", 
          text: formatTimestamp(log.timestamp),
          title: formatTimestamp(log.timestamp)
        },
        { 
          type: "t", 
          text: log.user_id || 'System',
          title: `User: ${log.user_id || 'System'}`
        },
        { 
          type: "b", 
          text: log.action,
          color: log.action === 'CREATE' ? '#10B981' :
                 log.action === 'UPDATE' ? '#3B82F6' :
                 log.action === 'DELETE' ? '#EF4444' : '#6B7280',
          title: `Action: ${log.action}`
        },
        { 
          type: "t", 
          text: log.entity,
          title: `Entity: ${log.entity}`
        },
        { 
          type: "t", 
          text: log.entity_id || 'N/A',
          title: `Entity ID: ${log.entity_id || 'N/A'}`
        },
        { 
          type: "t", 
          text: formatDetails(log.details),
          title: `Details: ${formatDetails(log.details)}`
        }
      ]);
      
      // Highlight the row if it matches the ID from params
      if (String(log.audit_id) === id) {
        newColors.push("#26A7F680"); // Highlight color
      } else {
        newColors.push(""); // Default color
      }
      
      newIds.push(log.audit_id);
    });

    setFields(newFields);
    setIds(newIds);
    setColors(newColors);
  }, [logs, id]); // Re-run when logs or id changes

  // Auto-fetch logs when component mounts
  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <div className="logsPage p-4">
        <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
        <div className="p-4">Loading audit logs...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="logsPage p-4">
        <h1 className="text-2xl font-bold mb-4">Audit Logs</h1>
        <div className="p-4 text-red-500">Error: {error}</div>
        <button
          className="button uppercase buttonStyle mt-4"
          onClick={fetchLogs}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="logsPage p-4">
      {logs.length === 0 ? (
        <div className="text-gray-500 text-center py-8">
          <p>No audit logs found.</p>
        </div>
      ) : (
        <CardSlider
          caption={{ 
            text: `Audit Logs (${logs.length} entries)`, 
            icon: "faClipboardList" 
          }}
          titles={[
            "Timestamp", 
            "User", 
            "Action", 
            "Entity", 
            "Entity ID", 
            "Details"
          ]}
          sizes={[3, 2, 2, 2, 2, 4]}
          colors={colors} // Use the colors array for highlighting
          height="600px"
          ids={ids}
          fields={fields}
          navigation={[]} // No navigation needed for logs
          selectedId={id} // Pass the selected ID to CardSlider if it supports it
        />
      )}
       <div className='h2AndButtonContainer mt-8'>
        <h2></h2>
        <button
          className="button uppercase buttonStyle"
          onClick={fetchLogs}
          disabled={loading}
        >
          <FontAwesomeIcon icon={faArrowRotateRight} className=' mr-1' />
          {loading ? 'Refreshing...' : 'Refresh Logs'}
        </button>
      </div>
    </div>
  );
}

export default Logs;