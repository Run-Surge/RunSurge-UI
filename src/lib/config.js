// API Configuration - Point to FastAPI backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://10.10.10.249:8000';

// API Endpoints for FastAPI backend
export const API_ENDPOINTS = {
  // Auth endpoints (FastAPI backend - root level)
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register', 
  REFRESH_TOKEN: '/api/auth/refresh',
  LOGOUT: '/api/auth/logout',
  
  // User endpoints (FastAPI backend)
  ME: '/api/users/me',
  
  // Job endpoints (FastAPI backend)
  JOBS: '/api/jobs',
  JOB_CREATE: '/api/job/',
  JOB_DETAIL: (id) => `/api/job/${id}`,
  JOB_UPDATE: (id) => `/api/jobs/${id}`,
  JOB_DELETE: (id) => `/api/jobs/${id}`,
  JOB_UPLOAD_DATA: (id) => `/api/job/${id}/upload-data`,
  JOB_RESULT: (id) => `/api/job/${id}/result`,
  JOB_PAYMENT: (id) => `/api/job/${id}/payment`,
  
  // Group endpoints (FastAPI backend)
  GROUP_CREATE: '/api/group',
  GROUP_DETAIL: (id) => `/api/group/${id}`,
  GROUP_UPLOAD_DATA: (id) => `/api/group/${id}/upload-data`,
  GROUP_RESULT: (id) => `/api/group/${id}/result`,
  GROUP_PAYMENT: (id) => `/api/group/${id}/payment`,
  
  // Node endpoints (FastAPI backend)
  NODE_DETAIL: (id) => `/api/node/${id}`,
  
  // Statistics endpoint
  STATISTICS: '/api/statistics',
  
  // Additional endpoints
  USERS: '/api/users',
  USER_PROFILE: '/api/users/profile',
  USER_JOBS: '/api/users/jobs',
  USER_GROUPS: '/api/users/groups',
  USER_NODES: '/api/users/nodes',
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000; 