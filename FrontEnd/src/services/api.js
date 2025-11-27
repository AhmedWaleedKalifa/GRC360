// services/api.js - Updated with email verification
const API_BASE_URL = import.meta.env.VITE_API_URL;

// ========== UTILITY FUNCTIONS ==========
const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

const getToken = () => localStorage.getItem('token');

const setAuthData = (user, token) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
  localStorage.setItem('token', token);
};

const clearAuthData = () => {
  localStorage.removeItem('currentUser');
  localStorage.removeItem('token');
};

const isAuthenticated = () => !!getToken();

// ========== CORE API REQUEST FUNCTION ==========
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const currentUser = getCurrentUser();
  const token = getToken();
  
  const config = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(currentUser && {
        'X-User-ID': currentUser.user_id || currentUser.id || '',
        'X-User-Name': currentUser.user_name || currentUser.name || '',
        'X-User-Email': currentUser.email || '',
        'X-User-Role': currentUser.role || '',
      }),
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };
  
  if (options.body && !['GET', 'HEAD'].includes(options.method || 'GET')) {
    config.body = JSON.stringify(options.body);
  }
  
  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      clearAuthData();
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Authentication required. Please login again.');
    }

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. Insufficient permissions.');
      } else if (response.status === 404) {
        throw new Error('Requested resource not found');
      } else if (response.status === 409) {
        throw new Error('Resource conflict');
      } else if (response.status === 500) {
        throw new Error('Server error - please try again later');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return { success: true };
    }
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ========== STATUS MAPPING UTILITIES ==========
const mapTrainingStatus = (backendStatus) => {
  const statusMap = {
    'not_started': 'not-started',
    'in_progress': 'in-progress',
    'completed': 'completed'
  };
  return statusMap[backendStatus] || 'not-started';
};

const mapCampaignStatus = (backendStatus) => {
  const statusMap = {
    'draft': 'draft',
    'active': 'active', 
    'completed': 'completed',
    'cancelled': 'cancelled'
  };
  return statusMap[backendStatus] || 'draft';
};

// ========== API IMPLEMENTATIONS ==========

// Auth API - UPDATED WITH EMAIL VERIFICATION
const authAPI = {
  register: async (userData) => {
    const response = await apiRequest('/api/auth/register', {
      method: 'POST',
      body: userData,
    });
    
    // Store auth data only if verification is not required
    if (!response.requires_verification) {
      setAuthData(response.user, response.token);
    }
    
    return response;
  },

  login: async (credentials) => {
    const response = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: credentials,
    });
    
    // Only set auth data if login is successful (email verified)
    if (response.user && response.token) {
      setAuthData(response.user, response.token);
    }
    
    return response;
  },

  logout: async () => {
    await apiRequest('/api/auth/logout', { method: 'POST' });
    clearAuthData();
  },

  // NEW: Email verification endpoints
  sendVerificationCode: async (email) => {
    return await apiRequest('/api/auth/send-verification', {
      method: 'POST',
      body: { email },
    });
  },

  // services/api.js - FIXED verifyEmail function
verifyEmail: async (email, verificationCode) => {
  const response = await apiRequest('/api/auth/verify-email', {
    method: 'POST',
    body: { email, verificationCode },
  });
  
  // FIXED: Use the complete response data instead of trying to merge
  if (response.user && response.token) {
    setAuthData(response.user, response.token);
  }
  
  return response;
},
  resendVerificationCode: async (email) => {
    return await apiRequest('/api/auth/resend-verification', {
      method: 'POST',
      body: { email },
    });
  },

  getCurrentUser: getCurrentUser,
  isAuthenticated: isAuthenticated,
};

// AI API
const aiAPI = {
  chat: (history) => apiRequest('/api/ai/chat', { 
    method: 'POST', 
    body: { history } 
  }),
};

// Configurations API
const configurationsAPI = {
  getAll: () => apiRequest('/configurations'),
  getById: (id) => apiRequest(`/configurations/${id}`),
  getByKey: (key) => apiRequest(`/configurations/key/${key}`),
  search: (query) => apiRequest(`/configurations/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/configurations', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/configurations/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/configurations/${id}`, { method: 'DELETE' }),
};

// Users API
const usersAPI = {
  getAll: () => apiRequest('/users'),
  getById: (id) => apiRequest(`/users/${id}`),
  getByEmail: (email) => apiRequest(`/users/email/${email}`),
  search: (query) => apiRequest(`/users/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/users', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/users/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/users/${id}`, { method: 'DELETE' }),
};

// Risks API
const risksAPI = {
  getAll: () => apiRequest('/risks'),
  getById: (id) => apiRequest(`/risks/${id}`),
  getByOwner: (ownerId) => apiRequest(`/risks/owner/${ownerId}`),
  search: (query) => apiRequest(`/risks/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/risks', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/risks/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/risks/${id}`, { method: 'DELETE' }),
};

// Governance Items API
const governanceItemsAPI = {
  getAll: () => apiRequest('/governanceItems'),
  getById: (id) => apiRequest(`/governanceItems/${id}`),
  getByOwner: (ownerId) => apiRequest(`/governanceItems/owner/${ownerId}`),
  getRisks: (id) => apiRequest(`/governanceItems/${id}/risks`),
  getFrameworks: (id) => apiRequest(`/governanceItems/${id}/frameworks`),
  search: (query) => apiRequest(`/governanceItems/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/governanceItems', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/governanceItems/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/governanceItems/${id}`, { method: 'DELETE' }),
};

// Incidents API
const incidentsAPI = {
  getAll: () => apiRequest('/incidents'),
  getById: (id) => apiRequest(`/incidents/${id}`),
  getByOwner: (ownerId) => apiRequest(`/incidents/owner/${ownerId}`),
  search: (query) => apiRequest(`/incidents/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/incidents', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/incidents/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/incidents/${id}`, { method: 'DELETE' }),
};

// Threats API
const threatsAPI = {
  getAll: () => apiRequest('/threats'),
  getById: (id) => apiRequest(`/threats/${id}`),
  getByCategory: (category) => apiRequest(`/threats/category/${category}`),
  search: (query) => apiRequest(`/threats/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/threats', { method: 'POST', body: data }),
  update: (id, data) => apiRequest(`/threats/${id}`, { method: 'PUT', body: data }),
  delete: (id) => apiRequest(`/threats/${id}`, { method: 'DELETE' }),
};

// Audit Logs API
const auditLogsAPI = {
  getAll: () => apiRequest('/auditLogs'),
  getById: (id) => apiRequest(`/auditLogs/${id}`),
  getByUser: (userId) => apiRequest(`/auditLogs/user/${userId}`),
  getByEntity: (entity, entityId) => apiRequest(`/auditLogs/entity/${entity}/${entityId}`),
  search: (query) => apiRequest(`/auditLogs/search?q=${encodeURIComponent(query)}`),
  create: (data) => apiRequest('/auditLogs', { method: 'POST', body: data }),
  delete: (id) => apiRequest(`/auditLogs/${id}`, { method: 'DELETE' }),
  deleteAll: () => apiRequest('/auditLogs', { method: 'DELETE' }),
};

// Compliance API
const complianceAPI = {
  getFrameworks: () => apiRequest('/complianceItems/frameworks'),
  getFrameworkById: (id) => apiRequest(`/complianceItems/frameworks/${id}`),
  searchFrameworks: (query) => apiRequest(`/complianceItems/frameworks/search?q=${encodeURIComponent(query)}`),
  createFramework: (data) => apiRequest('/complianceItems/frameworks', { method: 'POST', body: data }),
  updateFramework: (id, data) => apiRequest(`/complianceItems/frameworks/${id}`, { method: 'PUT', body: data }),
  deleteFramework: (id) => apiRequest(`/complianceItems/frameworks/${id}`, { method: 'DELETE' }),
  
  getRequirementsByFramework: (frameworkId) => apiRequest(`/complianceItems/frameworks/${frameworkId}/requirements`),
  getRequirementById: (id) => apiRequest(`/complianceItems/requirements/${id}`),
  searchRequirements: (query) => apiRequest(`/complianceItems/requirements/search?q=${encodeURIComponent(query)}`),
  createRequirement: (data) => apiRequest('/complianceItems/requirements', { method: 'POST', body: data }),
  updateRequirement: (id, data) => apiRequest(`/complianceItems/requirements/${id}`, { method: 'PUT', body: data }),
  deleteRequirement: (id) => apiRequest(`/complianceItems/requirements/${id}`, { method: 'DELETE' }),
  
  getControlsByRequirement: (requirementId) => apiRequest(`/complianceItems/requirements/${requirementId}/controls`),
  getControlsByOwner: (ownerId) => apiRequest(`/complianceItems/controls/owner/${ownerId}`),
  getControlById: (id) => apiRequest(`/complianceItems/controls/${id}`),
  searchControls: (query) => apiRequest(`/complianceItems/controls/search?q=${encodeURIComponent(query)}`),
  createControl: (data) => apiRequest('/complianceItems/controls', { method: 'POST', body: data }),
  updateControl: (id, data) => apiRequest(`/complianceItems/controls/${id}`, { method: 'PUT', body: data }),
  deleteControl: (id) => apiRequest(`/complianceItems/controls/${id}`, { method: 'DELETE' }),
};

// Awareness API
const awarenessAPI = {
  getTrainingModules: () => apiRequest('/awareness/training-modules'),
  getTrainingModuleById: (id) => apiRequest(`/awareness/training-modules/${id}`),
  searchTrainingModules: (query) => apiRequest(`/awareness/training-modules/search?q=${encodeURIComponent(query)}`),
  createTrainingModule: (data) => apiRequest('/awareness/training-modules', { method: 'POST', body: data }),
  updateTrainingModule: (id, data) => apiRequest(`/awareness/training-modules/${id}`, { method: 'PUT', body: data }),
  deleteTrainingModule: (id) => apiRequest(`/awareness/training-modules/${id}`, { method: 'DELETE' }),

  getModuleSteps: (moduleId) => apiRequest(`/awareness/training-modules/${moduleId}/steps`),
  createStep: (moduleId, data) => apiRequest(`/awareness/training-modules/${moduleId}/steps`, { method: 'POST', body: data }),
  updateStep: (stepId, data) => apiRequest(`/awareness/steps/${stepId}`, { method: 'PUT', body: data }),
  deleteStep: (stepId) => apiRequest(`/awareness/steps/${stepId}`, { method: 'DELETE' }),

  getQuestionsByStepId: (stepId) => apiRequest(`/awareness/steps/${stepId}/questions`),
  createQuestion: (stepId, data) => apiRequest(`/awareness/steps/${stepId}/questions`, { method: 'POST', body: data }),
  updateQuestion: (questionId, data) => apiRequest(`/awareness/questions/${questionId}`, { method: 'PUT', body: data }),
  deleteQuestion: (questionId) => apiRequest(`/awareness/questions/${questionId}`, { method: 'DELETE' }),

  getOptionsByQuestionId: (questionId) => apiRequest(`/awareness/questions/${questionId}/options`),
  createOption: (questionId, data) => apiRequest(`/awareness/questions/${questionId}/options`, { method: 'POST', body: data }),
  updateOption: (optionId, data) => apiRequest(`/awareness/options/${optionId}`, { method: 'PUT', body: data }),
  deleteOption: (optionId) => apiRequest(`/awareness/options/${optionId}`, { method: 'DELETE' }),

  getUserProgress: (userId) => apiRequest(`/awareness/users/${userId}/progress`),
  updateUserProgress: (userId, moduleId, data) => apiRequest(`/awareness/users/${userId}/progress/${moduleId}`, { method: 'PUT', body: data }),

  createQuizAttempt: (userId, moduleId, data) => apiRequest(`/awareness/users/${userId}/quiz-attempts/${moduleId}`, { method: 'POST', body: data }),
  getUserQuestionAnswers: (attemptId) => apiRequest(`/awareness/quiz-attempts/${attemptId}/answers`),

  getCampaigns: () => apiRequest('/awareness/campaigns'),
  getCampaignById: (id) => apiRequest(`/awareness/campaigns/${id}`),
  searchCampaigns: (query) => apiRequest(`/awareness/campaigns/search?q=${encodeURIComponent(query)}`),
  createCampaign: (data) => apiRequest('/awareness/campaigns', { method: 'POST', body: data }),
  updateCampaign: (id, data) => apiRequest(`/awareness/campaigns/${id}`, { method: 'PUT', body: data }),
  deleteCampaign: (id) => apiRequest(`/awareness/campaigns/${id}`, { method: 'DELETE' }),

  getCampaignModules: (campaignId) => apiRequest(`/awareness/campaigns/${campaignId}/modules`),
  addCampaignModule: (campaignId, data) => apiRequest(`/awareness/campaigns/${campaignId}/modules`, { method: 'POST', body: data }),
  removeCampaignModule: (campaignId, moduleId) => apiRequest(`/awareness/campaigns/${campaignId}/modules/${moduleId}`, { method: 'DELETE' }),

  getUserCampaignAssignments: (userId) => apiRequest(`/awareness/users/${userId}/campaign-assignments`),
  assignUserToCampaign: (userId, campaignId) => apiRequest(`/awareness/users/${userId}/campaign-assignments/${campaignId}`, { method: 'POST' }),
  updateUserCampaignAssignment: (assignmentId, data) => apiRequest(`/awareness/user-campaign-assignments/${assignmentId}`, { method: 'PUT', body: data }),

  getUserTrainingStats: (userId) => apiRequest(`/awareness/users/${userId}/training-stats`),
  getCampaignStats: (campaignId) => apiRequest(`/awareness/campaigns/${campaignId}/stats`),
};

// Global Search API
const globalSearchAPI = {
  searchAll: async (query) => {
    try {
      const searches = await Promise.allSettled([
        risksAPI.search(query),
        governanceItemsAPI.search(query),
        complianceAPI.searchControls(query),
        incidentsAPI.search(query),
      ]);

      return {
        risks: searches[0].status === 'fulfilled' ? searches[0].value : [],
        governanceItems: searches[1].status === 'fulfilled' ? searches[1].value : [],
        controls: searches[2].status === 'fulfilled' ? searches[2].value : [],
        incidents: searches[3].status === 'fulfilled' ? searches[3].value : [],
      };
    } catch (error) {
      console.error('Global search failed:', error);
      throw error;
    }
  }
};

// ========== HELPER FUNCTIONS ==========
const getModuleAPI = (activeModule) => {
  const apiMap = {
    'Users': usersAPI,
    'Risks': risksAPI,
    'Governance Items': governanceItemsAPI,
    'Configurations': configurationsAPI,
    'Incidents': incidentsAPI,
    'Threats': threatsAPI,
    'Audit Logs': auditLogsAPI,
    'Compliance Frameworks': complianceAPI,
    'Compliance Controls': complianceAPI,
    'Training Modules': awarenessAPI,
    'Campaigns': awarenessAPI
  };
  return apiMap[activeModule] || risksAPI;
};

const getSearchFunction = (activeModule) => {
  const searchMap = {
    'Users': usersAPI.search,
    'Risks': risksAPI.search,
    'Governance Items': governanceItemsAPI.search,
    'Configurations': configurationsAPI.search,
    'Incidents': incidentsAPI.search,
    'Threats': threatsAPI.search,
    'Audit Logs': auditLogsAPI.search,
    'Compliance Frameworks': complianceAPI.searchFrameworks,
    'Compliance Controls': complianceAPI.searchControls,
    'Training Modules': awarenessAPI.searchTrainingModules,
    'Campaigns': awarenessAPI.searchCampaigns
  };
  return searchMap[activeModule] || risksAPI.search;
};

// ========== EXPORTS ==========
export {
  authAPI,
  aiAPI,
  configurationsAPI,
  usersAPI,
  risksAPI,
  governanceItemsAPI,
  incidentsAPI,
  threatsAPI,
  auditLogsAPI,
  complianceAPI,
  awarenessAPI,
  globalSearchAPI,
  getCurrentUser,
  isAuthenticated,
  getModuleAPI,
  getSearchFunction,
  mapTrainingStatus,
  mapCampaignStatus
};

// Default export for convenience
export default {
  authAPI,
  aiAPI,
  configurationsAPI,
  usersAPI,
  risksAPI,
  governanceItemsAPI,
  incidentsAPI,
  threatsAPI,
  auditLogsAPI,
  complianceAPI,
  awarenessAPI,
  globalSearchAPI,
  getCurrentUser,
  isAuthenticated,
  getModuleAPI,
  getSearchFunction,
  mapTrainingStatus,
  mapCampaignStatus
};