// API Configuration
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  REFRESH_TOKEN: '/api/auth/refresh',
  ME: '/api/auth/me',
  LOGOUT: '/api/auth/logout',
  
  // Job endpoints
  JOBS: '/jobs',
  JOB_CREATE: '/jobs',
  JOB_DETAIL: (id) => `/jobs/${id}`,
  JOB_UPDATE: (id) => `/jobs/${id}`,
  JOB_DELETE: (id) => `/jobs/${id}`,
  
  // User endpoints
  USERS: '/users',
  USER_PROFILE: '/users/profile',
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000; 