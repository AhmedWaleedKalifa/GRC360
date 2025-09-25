// components/SearchResults.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { risksAPI, usersAPI, governanceItemsAPI, incidentsAPI, threatsAPI, complianceAPI, configurationsAPI, auditLogsAPI, globalSearchAPI } from '../services/api';
import Field from './Field';
import CardSlider from './CardSlider';

// Helper functions moved outside the component
const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  const date = new Date(timestamp);
  return date.toLocaleString();
};

const formatDetails = (details) => {
  if (!details) return 'No details';
  try {
    const parsedDetails = JSON.parse(details);
    if (typeof parsedDetails === 'object') {
      const entries = Object.entries(parsedDetails);
      return entries.map(([key, value]) => `${key}: ${value}`).join(', ');
    }
    return String(parsedDetails).substring(0, 50) + (String(parsedDetails).length > 50 ? '...' : '');
  } catch {
    return String(details).substring(0, 50) + (String(details).length > 50 ? '...' : '');
  }
};

function SearchResults({ activeModule, searchQuery, onClose }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchType, setSearchType] = useState('single'); // 'single' or 'global'
  const navigate = useNavigate();

  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch();
    }
  }, [searchQuery, activeModule]);

  const performSearch = async () => {
    setLoading(true);
    setError(null);
    
    try {
      let searchResults = [];
      
      if (activeModule === 'Main') {
        // Global search across multiple modules
        setSearchType('global');
        const globalResults = await globalSearchAPI.searchAll(searchQuery);
        
        // Combine all results into a single array with type indicators
        searchResults = [
          ...globalResults.risks.map(item => ({ ...item, _type: 'risk', _module: 'Risks' })),
          ...globalResults.governanceItems.map(item => ({ ...item, _type: 'governance', _module: 'Governance' })),
          ...globalResults.controls.map(item => ({ ...item, _type: 'control', _module: 'Compliance' })),
          ...globalResults.incidents.map(item => ({ ...item, _type: 'incident', _module: 'Incidents' })),
        ];
      } else {
        // Single module search
        setSearchType('single');
        switch (activeModule) {
          case 'Risks':
            searchResults = await risksAPI.search(searchQuery);
            break;
          case 'Governance':
            searchResults = await governanceItemsAPI.search(searchQuery);
            break;
          case 'Incidents':
            searchResults = await incidentsAPI.search(searchQuery);
            break;
          case 'Threats':
            searchResults = await threatsAPI.search(searchQuery);
            break;
          case 'Configurations':
            searchResults = await configurationsAPI.search(searchQuery);
            break;
          case 'Logs':
            searchResults = await auditLogsAPI.search(searchQuery);
            break;
          case 'Compliance':
            searchResults = await complianceAPI.searchFrameworks(searchQuery);
            break;
          default:
            searchResults = await risksAPI.search(searchQuery);
        }
      }
      
      setResults(searchResults);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Function to get the correct base path without ID
  const getBaseNavigationPath = (item) => {
    if (searchType === 'global' && item._type) {
      switch (item._type) {
        case 'risk':
          return '/dashboard/risks';
        case 'governance':
          return '/dashboard/governance';
        case 'control':
          return '/dashboard/compliance';
        case 'incident':
          return '/dashboard/incidents';
        case 'threat':
          return '/dashboard/threats';
        case 'logs': // Add logs case
          return '/dashboard/logs';
        default:
          return '/dashboard';
      }
    }
    
    switch (activeModule) {
      case 'Risks':
        return '/dashboard/risks';
      case 'Governance':
        return '/dashboard/governance';
      case 'Incidents':
        return '/dashboard/incidents';
      case 'Threats':
        return '/dashboard/threats';
      case 'Configurations':
        return '/dashboard/configurations';
      case 'Logs':
        return '/dashboard/logs';
      case 'Compliance':
        return '/dashboard/compliance';
      default:
        return '/dashboard';
    }
  };

  // Function to get the correct ID from the item
  const getItemId = (item) => {
    if (searchType === 'global' && item._type) {
      switch (item._type) {
        case 'risk':
          return item.risk_id;
        case 'governance':
          return item.governance_id;
        case 'framework':
          return item.framework_id;
        case 'incident':
          return item.incident_id;
        case 'threat':
          return item.threat_id;
        case 'logs': // Add logs case
          return item.audit_id;
        default:
          return item.id || item._id;
      }
    }
    
    switch (activeModule) {
      case 'Risks':
        return item.risk_id;
      case 'Governance':
        return item.governance_id;
      case 'Incidents':
        return item.incident_id;
      case 'Threats':
        return item.threat_id;
      case 'Configurations':
        return item.config_id;
      case 'Logs':
        return item.audit_id;
      case 'Compliance':
        return item.framework_id;
      default:
        return item.id || item._id;
    }
  };

  // Function to get module name for display
  const getModuleName = (item) => {
    if (searchType === 'global' && item._module) {
      return item._module;
    }
    return activeModule;
  };

  // Function to get item title for display
  const getItemTitle = (item) => {
    if (searchType === 'global') {
      // For logs in global search, use a combination of fields for the title
      if (item._type === 'logs') {
        return `${item.action} on ${item.entity}`;
      }
      return item.title || item.name || item.user_name || item.governance_name || item.framework_name || 'Unknown Item';
    }
    
    switch (activeModule) {
      case 'Risks':
        return item.title;
      case 'Governance':
        return item.governance_name;
      case 'Incidents':
        return item.title;
      case 'Threats':
        return item.name || item.message;
      case 'Compliance':
        return item.framework_name;
      case 'Configurations':
        return item.key;
      case 'Logs':
        return `${item.action} - ${item.entity}`; // Better title for logs
      default:
        return item.title || item.name || item.user_name || 'Unknown Item';
    }
  };

  // Function to convert search results to Field format
  const convertResultsToFields = () => {
    if (searchType === 'global') {
      return results.map((item, index) => [
        { type: "t", text: getModuleName(item), color: "#6b7280" },
        { type: "t", text: getItemTitle(item) || 'No Title' },
        { type: "t", text: item.description ? item.description.substring(0, 50) + '...' : 'No description' },
        { type: "b", text: "View", color: "#3b82f6" }
      ]);
    }
    
    return results.map((item, index) => {
      const itemId = getItemId(item);
      
      switch (activeModule) {
        case 'Risks':
          return [
            { type: "t", text: itemId || index + 1 },
            { type: "t", text: item.title || 'No Title' },
            { type: "t", text: item.category || 'Uncategorized' },
            { type: "t", text: item.owner || 'Unknown' },
            { 
              type: "b", 
              text: item.status || 'Unknown',
              color: item.status === "open" 
                ? "#FFA72699" 
                : item.status === "closed" 
                ? "#00ff0099" 
                : "#3b82f699"
            },
            { type: "t", text: item.likelihood || 'Unknown' },
            { type: "t", text: item.impact || 'Unknown' },
            { 
              type: "b", 
              text: item.severity || 'Unknown',
              color: item.severity === "high" || item.severity === "critical"
                ? "#ff000099"
                : item.severity === "medium"
                ? "#ffff0099"
                : "#00ff0099"
            },
            { type: "t", text: item.last_reviewed ? new Date(item.last_reviewed).toLocaleDateString() : 'Never' },
            { type: "b", text: "View", color: "#3b82f6" }
          ];
        
        case 'Governance':
          return [
            { type: "t", text: index + 1 },
            { type: "t", text: item.governance_name || 'No Name' },
            { type: "t", text: item.type || 'Unknown' },
            { type: "t", text: item.owner || 'Unassigned' },
            { 
              type: "b", 
              text: item.status || 'Unknown',
              color: item.status === "active" 
                ? "#00ff0099" 
                : item.status === "draft"
                ? "#FFA72699"
                : "#3b82f699"
            },
            { type: "t", text: item.last_reviewed ? new Date(item.last_reviewed).toLocaleDateString() : "Never" },
            { type: "t", text: item.effective_date ? new Date(item.effective_date).toLocaleDateString() : "N/A" },
            { type: "t", text: item.expiry_date ? new Date(item.expiry_date).toLocaleDateString() : "N/A" },
            { type: "t", text: item.next_review ? new Date(item.next_review).toLocaleDateString() : "N/A" },
            { type: "t", text: "-" }, // Version
            { type: "t", text: item.latest_change_summary || "No changes" },
            { 
              type: "b", 
              text: item.approval_status || 'Unknown',
              color: item.approval_status === "approved" 
                ? "#00ff0099" 
                : item.approval_status === "pending"
                ? "#FFA72699"
                : "#ff000099"
            },
            { type: "t", text: item.approver || "N/A" },
            { type: "t", text: "N/A" }, // Confidentiality
            { type: "t", text: item.attachment ? "Has attachment" : "No file" },
            { type: "b", text: "View", color: "#3b82f6" }
          ];
        
        case 'Compliance':
          return [
            { type: "t", text: item.framework_name || 'No Name' },
            { type: "t", text: item.requirement_count || '0' },
            { type: "t", text: item.control_count || '0' },
            { type: "b", text: "View", color: "#3b82f6" }
          ];
        
        case 'Incidents':
          return [
            { type: "t", text: item.title || 'No Title' },
            { type: "t", text: item.category || 'Uncategorized' },
            { 
              type: "b", 
              text: item.status || 'Unknown',
              color: item.status === "open"
                ? "#FFA72699"
                : item.status === "closed"
                ? "#00ff0099"
                : "#3b82f699"
            },
            { 
              type: "b", 
              text: item.severity || 'Unknown',
              color: item.severity === "high" || item.severity === "critical"
                ? "#ff000099"
                : item.severity === "medium"
                ? "#ffff0099"
                : "#00ff0099"
            },
            { type: "t", text: item.reported_at ? new Date(item.reported_at).toLocaleDateString() : 'Unknown' },
            { type: "t", text: item.owner || 'Unassigned' },
            { type: "t", text: item.description || 'No description' },
            { type: "b", text: "View", color: "#3b82f6" }
          ];
        
        case 'Threats':
          return [
            { type: "t", text: item.message || item.name || 'No Description' },
            { 
              type: "b", 
              text: item.severity || 'Unknown',
              color: item.severity === "high" || item.severity === "critical"
                ? "#ff000099"
                : item.severity === "medium"
                ? "#ffff0099"
                : "#00ff0099"
            },
            { type: "t", text: item.detected_at || item.created_at ? new Date(item.detected_at || item.created_at).toLocaleDateString() : 'Unknown' },
            { type: "b", text: "View", color: "#3b82f6" }
          ];
        
        case 'Configurations':
          return [
            { type: "t", text: item.key || 'No Key' },
            { type: "t", text: item.value || 'No Value' },
            { type: "b", text: "View", color: "#3b82f6" }
          ];
        
        case 'Logs':
          return [
            { type: "t", text: formatTimestamp(item.timestamp) },
            { type: "t", text: item.user_id || 'System' },
            { 
              type: "b", 
              text: item.action || 'Unknown',
              color: item.action === 'CREATE' ? '#10B981' :
                     item.action === 'UPDATE' ? '#3B82F6' :
                     item.action === 'DELETE' ? '#EF4444' : '#6B7280'
            },
            { type: "t", text: item.entity || 'Unknown' },
            { type: "t", text: item.entity_id || 'N/A' },
            { type: "t", text: formatDetails(item.details) },
            { type: "b", text: "View", color: "#3b82f6" }
          ];
        
        default:
          return [
            { type: "t", text: index + 1 },
            { type: "t", text: getItemTitle(item) },
            { type: "t", text: item.type || item.category || item.role || 'Unknown' },
            { type: "t", text: item.status || 'Unknown' },
            { type: "b", text: "View", color: "#3b82f6" }
          ];
      }
    });
  };

  // Function to get titles based on search type
  const getTitles = () => {
    if (searchType === 'global') {
      return ["Module", "Title", "Description", "Actions"];
    }
    
    switch (activeModule) {
      case 'Risks':
        return ["ID", "Title", "Category", "Owner", "Status", "Likelihood", "Impact", "Severity", "Last Reviewed", "Actions"];
      case 'Governance':
        return ["#", "Name", "Type", "Owner", "Status", "Last Reviewed", "Effective Date", "Expiry Date", "Next Review", "Version", "Change Summary", "Approval Status", "Approver", "Confidentiality", "Attachment", "Actions"];
      case 'Compliance':
        return ["Framework", "# Requirements", "# Controls", "Actions"];
      case 'Incidents':
        return ["Title", "Category", "Status", "Severity", "Reported At", "Owner", "Description", "Actions"];
      case 'Threats':
        return ["Description", "Severity", "Time", "Actions"];
      case 'Configurations':
        return ["Key", "Value", "Actions"];
      case 'Logs':
        return ["Timestamp", "User", "Action", "Entity", "Entity ID", "Details", "Actions"];
      default:
        return ["ID", "Name", "Type", "Status", "Actions"];
    }
  };

  // Function to get sizes based on search type
  const getSizes = () => {
    if (searchType === 'global') {
      return [15, 25, 45, 15];
    }
    
    switch (activeModule) {
      case 'Risks':
        return [2, 8, 8, 8, 8, 8, 8, 8, 8, 10];
      case 'Governance':
        return [1, 4, 3, 3, 4, 4, 4, 4, 4, 3, 7, 4, 4, 4, 4, 10];
      case 'Compliance':
        return [1, 1, 1, 1];
      case 'Incidents':
        return [6, 2, 4, 3, 3, 3, 7, 10];
      case 'Threats':
        return [4, 1, 2, 1];
      case 'Configurations':
        return [4, 4, 2];
      case 'Logs':
        return [3, 2, 2, 2, 2, 4, 2];
      default:
        return [3, 15, 12, 10, 5];
    }
  };

  const handleFieldClick = (item) => {
    const itemId = getItemId(item);
    const basePath = getBaseNavigationPath(item);
    
    if (itemId && basePath) {
      const fullPath = `${basePath}`;
      console.log(fullPath)
      onClose(); // Close search results first
      navigate(fullPath); // Then navigate to correct path
    }
  };

  const renderResultsWithCardSlider = () => {
    if (!results || results.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No results found for "{searchQuery}"
        </div>
      );
    }

    const fieldsData = convertResultsToFields();
    const ids = results.map(item => getItemId(item));

    return (
      <CardSlider
        titles={getTitles()}
        sizes={getSizes()}
        ids={ids}
        fields={fieldsData.map((field, index) => 
          field.map((element, elemIndex) => {
            if (element.type === "b" && element.text === "View") {
              return {
                ...element,
                click: () => handleFieldClick(results[index])
              };
            }
            return element;
          })
        )}
        colors={[]}
        caption={{ 
          text: searchType === 'global' 
            ? `Global Search Results (${results.length} items)` 
            : `${activeModule} Search Results`,
          icon: "faSearch" 
        }}
        navigation={results.map((item, index) => ({
          start: index,
          end: index,
          path: `${getBaseNavigationPath(item)}`
        }))}
        height={400}
      />
    );
  };

  const renderSimpleResults = () => {
    if (!results || results.length === 0) {
      return (
        <div className="text-center py-8 text-gray-600 dark:text-gray-400">
          No results found for "{searchQuery}"
        </div>
      );
    }

    return (
      <div className="space-y-3 max-h-96 overflow-y-auto pr-2 search-results-scrollbar">
        {results.map((item, index) => {
          const itemId = getItemId(item);
          const basePath = getBaseNavigationPath(item);
          const fullPath = `${basePath}`;
          const moduleName = getModuleName(item);
          const itemTitle = getItemTitle(item);

          return (
            <Field
              key={index}
              mode={index % 2 === 0 ? 1 : 2}
              sizes={[100]}
              id={itemId}
              navigation={fullPath}
              values={[
                {
                  type: "t",
                  text: searchType === 'global' 
                    ? `${moduleName}: ${itemTitle}` 
                    : `${activeModule}: ${itemTitle}`
                },
                {
                  type: "b",
                  text: "View",
                  color: "#3b82f6",
                  click: () => handleFieldClick(item)
                }
              ]}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="card cardStyle1 w-full max-w-4xl h-[600px] flex flex-col">
        <div className="cardSliderHeader rounded-t-2xl rounded-b-none shrink-0">
          <div className="cardSliderTitles cardSliderTitlesCaptions">
            <div className="fieldDiv">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                {searchType === 'global' ? 'Global Search Results' : `Search Results in ${activeModule}`}
              </h3>
            </div>
            <button onClick={onClose} className="smallButton buttonStyle ml-auto">
              Close
            </button>
          </div>
        </div>

        <div className="p-4 border-b border-gray-300 dark:border-gray-600 shrink-0">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Searching for: <span className="font-medium">"{searchQuery}"</span>
            <span className="ml-4">Found {results.length} result{results.length !== 1 ? 's' : ''}</span>
            {searchType === 'global' && (
              <span className="ml-4 text-blue-600 dark:text-blue-400">
                (Across Risks, Governance, Compliance, Incidents, Threats, Logs)
              </span>
            )}
          </p>
        </div>

        <div className="cardSliderBody flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            {loading && (
              <div className="flex-1 flex flex-col items-center justify-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  {searchType === 'global' ? 'Searching across all modules...' : 'Searching...'}
                </p>
              </div>
            )}

            {error && (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center py-4 text-red-600 dark:text-red-400">
                  {error}
                </div>
              </div>
            )}

            {!loading && !error && (
              <div className="h-full flex flex-col">
                <div className="flex-1 p-4 overflow-y-auto search-results-scrollbar">
                  {results.length > 3 ? renderResultsWithCardSlider() : renderSimpleResults()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchResults;