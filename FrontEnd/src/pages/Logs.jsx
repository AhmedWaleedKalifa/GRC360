import  { useState, useEffect } from 'react'
import { auditLogsAPI, usersAPI } from '../services/api'
import CardSlider from '../components/CardSlider'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faTrash, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useUser';

function Logs() {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Get current user and permissions
  const {  permissions, loading: userLoading } = useUser();


  // Enhanced function to get user info with role
  const getUserInfoFromLog = (log) => {
    if (!log.details) return { name: 'System', role: 'system' };
    
    try {
      const details = JSON.parse(log.details);
      
      // Try to get complete user info from details
      if (details.user_info) {
        return {
          name: details.user_info.user_name || `User ${details.user_info.user_id}`,
          role: details.user_info.role || 'user',
          email: details.user_info.email
        };
      }
      
      // Fall back to basic user_name
      if (details.user_name && details.user_name !== 'System') {
        return {
          name: details.user_name,
          role: 'user',
          email: null
        };
      }
      
      // Final fallback to user ID lookup
      if (log.user_id) {
        const user = users.find(u => u.user_id === log.user_id || u.id === log.user_id);
        return {
          name: user ? user.user_name || user.name || `User ${log.user_id}` : `User ${log.user_id}`,
          role: user ? user.role || 'user' : 'user',
          email: user ? user.email : null
        };
      }
      
      return { name: 'System', role: 'system' };
    } catch  {
      // If JSON parsing fails, fall back to user ID lookup
      if (log.user_id) {
        const user = users.find(u => u.user_id === log.user_id || u.id === log.user_id);
        return {
          name: user ? user.user_name || user.name || `User ${log.user_id}` : `User ${log.user_id}`,
          role: user ? user.role || 'user' : 'user',
          email: user ? user.email : null
        };
      }
      return { name: 'System', role: 'system' };
    }
  };

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

  const fetchUsers = async () => {
    try {
      const usersData = await usersAPI.getAll();
      setUsers(usersData);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  // Function to delete all logs using the new API endpoint
  const deleteAllLogs = async () => {
    if (!permissions.isAdmin) {
      alert('You do not have permission to delete audit logs. Admin access required.');
      return;
    }

    if (!window.confirm('Are you sure you want to delete ALL audit logs? This action cannot be undone!')) {
      return;
    }

    try {
      setDeleteLoading(true);
      
      // Use the new bulk delete endpoint
      await auditLogsAPI.deleteAll();
      
      // Refresh the logs list
      await fetchLogs();
      alert('All audit logs have been deleted successfully.');
      
    } catch (err) {
      console.error("Error deleting logs:", err);
      setError("Failed to delete audit logs");
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown time';
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Enhanced format action details for display
  const formatDetails = (details) => {
    if (!details) return 'No details';
    try {
      const parsedDetails = JSON.parse(details);
      
      if (typeof parsedDetails === 'object') {
        // Remove user info from details display since we're showing it separately
        const {  ...actionDetails } = parsedDetails;
        
        if (Object.keys(actionDetails).length === 0) {
          return 'No additional details';
        }
        
        // Format the remaining action details
        const entries = Object.entries(actionDetails);
        if (entries.length === 1 && entries[0][0] === 'changed_fields') {
          return `Updated: ${entries[0][1].join(', ')}`;
        }
        
        return entries.map(([key, value]) => {
          if (key === 'changed_fields' && Array.isArray(value)) {
            return `Updated: ${value.join(', ')}`;
          }
          return `${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
        }).join(', ');
      }
      
      return String(parsedDetails).substring(0, 50) + (String(parsedDetails).length > 50 ? '...' : '');
    } catch {
      return String(details).substring(0, 50) + (String(details).length > 50 ? '...' : '');
    }
  };

  // Get action color
  const getActionColor = (action) => {
    switch (action) {
      case 'CREATE': return '#10B981'; // green
      case 'UPDATE': return '#3B82F6'; // blue
      case 'DELETE': return '#EF4444'; // red
      case 'DELETE_ALL': return '#DC2626'; // dark red
      case 'SYSTEM': return '#8B5CF6'; // purple
      default: return '#6B7280'; // gray
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
      const userInfo = getUserInfoFromLog(log);
      
      newFields.push([
        {
          type: "t",
          text: formatTimestamp(log.timestamp),
          title: formatTimestamp(log.timestamp)
        },
        {
          type: "t",
          text: userInfo.name,
          title: `User: ${userInfo.name}${userInfo.role ? ` (${userInfo.role})` : ''}${userInfo.email ? ` - ${userInfo.email}` : ''}`
        },
        {
          type: "b",
          text: log.action,
          color: getActionColor(log.action),
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

      if (String(log.audit_id) === id) {
        newColors.push("#26A7F680");
      } else {
        newColors.push("");
      }

      newIds.push(log.audit_id);
    });

    setFields(newFields);
    setIds(newIds);
    setColors(newColors);
  }, [logs, id, users]);

  // Auto-fetch logs and users when component mounts
  useEffect(() => {
    if (permissions.isAdmin) {
      fetchLogs();
      fetchUsers();
    }
  }, [permissions.isAdmin]);

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
          You do not have permission to view audit logs. Admin access required.
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
       <div className="logsPage p-4">
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
            height="600px"
            fields={[]}
            navigation={[]}
          />
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-200 border-t-blue-500 self-center"></div>
      </div>
      </>
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Audit Logs</h1>
        <div className="flex gap-2">
       
          
          {logs.length > 0 && (
            <button
              className="button buttonStyle flex items-center bg-red-600 hover:bg-red-700"
              onClick={() => setShowDeleteConfirm(true)}
              title="Delete all logs"
              disabled={deleteLoading}
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2" />
              {deleteLoading ? 'Deleting...' : 'Delete All Logs'}
            </button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-500 text-2xl mr-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Confirm Deletion</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete ALL {logs.length} audit logs? This action cannot be undone and will permanently remove all audit history.
            </p>
            <div className="flex justify-end gap-3">
              <button
                className="button buttonStyle bg-gray-300 hover:bg-gray-400 text-gray-800"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="button buttonStyle bg-red-600 hover:bg-red-700 text-white"
                onClick={deleteAllLogs}
                disabled={deleteLoading}
              >
                {deleteLoading ? 'Deleting...' : 'Delete All'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          sizes={[4, 3, 2, 3, 2, 8]}
          colors={colors}
          height="600px"
          ids={ids}
          fields={fields}
          navigation={[]}
          selectedId={id}
        />
      )}
    </div>
  );
}

export default Logs;