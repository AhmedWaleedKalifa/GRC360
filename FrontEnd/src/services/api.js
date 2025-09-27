// services/api.js - Complete updated version
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Get current user from localStorage
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Enhanced apiRequest function to include user data
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get current user from localStorage
  const currentUser = getCurrentUser();
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Add user information to headers if user exists
  if (currentUser) {
    defaultHeaders['X-User-ID'] = currentUser.user_id || currentUser.id || '';
    defaultHeaders['X-User-Name'] = currentUser.user_name || currentUser.name || '';
    defaultHeaders['X-User-Email'] = currentUser.email || '';
    defaultHeaders['X-User-Role'] = currentUser.role || '';
  }
  
  const config = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };
  
  // Log the request for debugging
  console.log('API Request:', {
    url,
    headers: config.headers,
    method: config.method,
    body: config.body
  });
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Rest of your existing API functions remain the same, but they will now automatically include user headers
export const globalSearchAPI = {
  searchAll: async (query) => {
    try {
      const searches = await Promise.allSettled([
        risksAPI.search(query),
        governanceItemsAPI.search(query),
        complianceAPI.searchControls(query),
        incidentsAPI.search(query),
      ]);

      const results = {
        risks: searches[0].status === 'fulfilled' ? searches[0].value : [],
        governanceItems: searches[1].status === 'fulfilled' ? searches[1].value : [],
        controls: searches[2].status === 'fulfilled' ? searches[2].value : [],
        incidents: searches[3].status === 'fulfilled' ? searches[3].value : [],
      };

      return results;
    } catch (error) {
      console.error('Global search failed:', error);
      throw error;
    }
  }
};

// Configurations API calls
export const configurationsAPI = {
  getAll: () => apiRequest('/configurations'),
  getById: (id) => apiRequest(`/configurations/${id}`),
  getByKey: (key) => apiRequest(`/configurations/key/${key}`),
  search: (query) => apiRequest(`/configurations/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/configurations', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/configurations/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/configurations/${id}`, {
    method: 'DELETE',
  }),
};

// Users API calls
export const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  getByEmail: (email) => apiRequest(`/users/email/${email}`),
  search: (query) => apiRequest(`/users/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/users', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/users/${id}`, {
    method: 'DELETE',
  }),
};

// Risks API calls
export const risksAPI = {
  getAll: () => apiRequest('/risks'),
  getById: (id) => apiRequest(`/risks/${id}`),
  getByOwner: (ownerId) => apiRequest(`/risks/owner/${ownerId}`),
  search: (query) => apiRequest(`/risks/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/risks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/risks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/risks/${id}`, {
    method: 'DELETE',
  }),
};

// Governance Items API calls
export const governanceItemsAPI = {
  getAll: () => apiRequest('/governanceItems'),
  getById: (id) => apiRequest(`/governanceItems/${id}`),
  getByOwner: (ownerId) => apiRequest(`/governanceItems/owner/${ownerId}`),
  getRisks: (id) => apiRequest(`/governanceItems/${id}/risks`),
  getFrameworks: (id) => apiRequest(`/governanceItems/${id}/frameworks`),
  search: (query) => apiRequest(`/governanceItems/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/governanceItems', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/governanceItems/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/governanceItems/${id}`, {
    method: 'DELETE',
  }),
};

// Incidents API calls
export const incidentsAPI = {
  getAll: () => apiRequest('/incidents'),
  getById: (id) => apiRequest(`/incidents/${id}`),
  getByOwner: (ownerId) => apiRequest(`/incidents/owner/${ownerId}`),
  search: (query) => apiRequest(`/incidents/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/incidents', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/incidents/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/incidents/${id}`, {
    method: 'DELETE',
  }),
};

// Threats API calls
export const threatsAPI = {
  getAll: () => apiRequest('/threats'),
  getById: (id) => apiRequest(`/threats/${id}`),
  getByCategory: (category) => apiRequest(`/threats/category/${category}`),
  search: (query) => apiRequest(`/threats/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/threats', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id, data) => apiRequest(`/threats/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/threats/${id}`, {
    method: 'DELETE',
  }),
};

// Audit Logs API calls
export const auditLogsAPI = {
  getAll: () => apiRequest('/auditLogs'),
  getById: (id) => apiRequest(`/auditLogs/${id}`),
  getByUser: (userId) => apiRequest(`/auditLogs/user/${userId}`),
  getByEntity: (entity, entityId) => apiRequest(`/auditLogs/entity/${entity}/${entityId}`),
  search: (query) => apiRequest(`/auditLogs/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/auditLogs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/auditLogs/${id}`, {
    method: 'DELETE',
  }),
  deleteAll: () => apiRequest('/auditLogs', {
    method: 'DELETE',
  }),
};

// Compliance API calls
export const complianceAPI = {
  // Frameworks
  getFrameworks: () => apiRequest('/complianceItems/frameworks'),
  getFrameworkById: (id) => apiRequest(`/complianceItems/frameworks/${id}`),
  searchFrameworks: (query) => apiRequest(`/complianceItems/frameworks/search?q=${encodeURIComponent(query)}`),
  createFramework: (data) => apiRequest('/complianceItems/frameworks', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateFramework: (id, data) => apiRequest(`/complianceItems/frameworks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteFramework: (id) => apiRequest(`/complianceItems/frameworks/${id}`, {
    method: 'DELETE',
  }),
  
  // Requirements
  getRequirementsByFramework: (frameworkId) => apiRequest(`/complianceItems/frameworks/${frameworkId}/requirements`),
  getRequirementById: (id) => apiRequest(`/complianceItems/requirements/${id}`),
  searchRequirements: (query) => apiRequest(`/complianceItems/requirements/search?q=${encodeURIComponent(query)}`),
  createRequirement: (data) => apiRequest('/complianceItems/requirements', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateRequirement: (id, data) => apiRequest(`/complianceItems/requirements/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteRequirement: (id) => apiRequest(`/complianceItems/requirements/${id}`, {
    method: 'DELETE',
  }),
  
  // Controls
  getControlsByRequirement: (requirementId) => apiRequest(`/complianceItems/requirements/${requirementId}/controls`),
  getControlsByOwner: (ownerId) => apiRequest(`/complianceItems/controls/owner/${ownerId}`),
  getControlById: (id) => apiRequest(`/complianceItems/controls/${id}`),
  searchControls: (query) => apiRequest(`/complianceItems/controls/search?q=${encodeURIComponent(query)}`),
  createControl: (data) => apiRequest('/complianceItems/controls', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateControl: (id, data) => apiRequest(`/complianceItems/controls/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  deleteControl: (id) => apiRequest(`/complianceItems/controls/${id}`, {
    method: 'DELETE',
  }),
};

// Helper function to get the appropriate API based on active module
export const getModuleAPI = (activeModule) => {
  const apiMap = {
    'Users': usersAPI,
    'Risks': risksAPI,
    'Governance Items': governanceItemsAPI,
    'Configurations': configurationsAPI,
    'Incidents': incidentsAPI,
    'Threats': threatsAPI,
    'Audit Logs': auditLogsAPI,
    'Compliance Frameworks': complianceAPI,
    'Compliance Controls': complianceAPI
  };

  return apiMap[activeModule] || risksAPI;
};

// Helper function to get search function based on active module
export const getSearchFunction = (activeModule) => {
  const searchMap = {
    'Users': usersAPI.search,
    'Risks': risksAPI.search,
    'Governance Items': governanceItemsAPI.search,
    'Configurations': configurationsAPI.search,
    'Incidents': incidentsAPI.search,
    'Threats': threatsAPI.search,
    'Audit Logs': auditLogsAPI.search,
    'Compliance Frameworks': complianceAPI.searchFrameworks,
    'Compliance Controls': complianceAPI.searchControls
  };

  return searchMap[activeModule] || risksAPI.search;
};