const API_BASE_URL = import.meta.env.VITE_API_URL;

// handle API requests
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get auth token if available
  const token = localStorage.getItem('authToken');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };
  
  // Add authorization header if token exists
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    ...options,
  };
  
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

// Configurations API calls
export const configurationsAPI = {
  getAll: () => apiRequest('/configurations'),
  getById: (id) => apiRequest(`/configurations/${id}`),
  getByKey: (key) => apiRequest(`/configurations/key/${key}`),
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
  create: (data) => apiRequest('/auditLogs', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  delete: (id) => apiRequest(`/auditLogs/${id}`, {
    method: 'DELETE',
  }),
};

// Compliance API calls
export const complianceAPI = {
  // Frameworks
  getFrameworks: () => apiRequest('/complianceItems/frameworks'),
  getFrameworkById: (id) => apiRequest(`/complianceItems/frameworks/${id}`),
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