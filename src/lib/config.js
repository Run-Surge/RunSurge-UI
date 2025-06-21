// API Configuration - Point to FastAPI backend
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

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
  JOB_CREATE: '/api/jobs',
  JOB_DETAIL: (id) => `/api/jobs/${id}`,
  JOB_UPDATE: (id) => `/api/jobs/${id}`,
  JOB_DELETE: (id) => `/api/jobs/${id}`,
  
  // Additional endpoints
  USERS: '/api/users',
  USER_PROFILE: '/api/users/profile',
  USER_JOBS: '/api/users/jobs',
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 10000; 