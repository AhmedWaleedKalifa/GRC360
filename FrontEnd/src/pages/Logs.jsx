import React, { useState, useEffect } from 'react'
import { auditLogsAPI } from '../services/api'
import CardSlider from '../components/CardSlider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRotateRight } from '@fortawesome/free-solid-svg-icons';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Prepare data for CardSlider
  const fields = logs.map((log) => [
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

  const ids = logs.map(log => log.audit_id);

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
      {/* <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <button
          className="button uppercase buttonStyle"
          onClick={fetchLogs}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Logs'}
        </button>
      </div> */}

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
          colors={Array(logs.length).fill("")}
          height="600px"
          ids={ids}
          fields={fields}
          navigation={[]} // No navigation needed for logs
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