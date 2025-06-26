import { API_BASE_URL, REQUEST_TIMEOUT } from './config';
import Cookies from 'js-cookie';

// Define a longer timeout for downloads
const DOWNLOAD_TIMEOUT = 60000; // 60 seconds

/**
 * Custom fetch wrapper with authentication and error handling
 */
export class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.timeout = REQUEST_TIMEOUT;
  }

  /**
   * Get authentication headers
   */
  getAuthHeaders() {
    // For HTTP-only cookies, we don't need to manually set Authorization header
    // The browser will automatically include the cookies in requests
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Create request with timeout
   */
  createRequestWithTimeout(url, options, customTimeout = this.timeout) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Request timeout')), customTimeout)
      ),
    ]);
  }

  /**
   * Handle API response
   */
  async handleResponse(response) {
    if (!response.ok) {
      let errorMessage = `HTTP error! status: ${response.status}`;
      
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.detail || errorMessage;
      } catch (e) {
        // If JSON parsing fails, use the default error message
      }

      // Don't automatically redirect on 401 - let AuthContext handle it
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return response;
  }

  /**
   * Generic API request method
   */
  async request(endpoint, options = {}, customTimeout = this.timeout) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      credentials: 'include', // Important: Include cookies in requests
      ...options,
    };

    try {
      const response = await this.createRequestWithTimeout(url, config, customTimeout);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, {
      method: 'GET',
    });
  }

  /**
   * GET request with longer timeout (for downloads)
   */
  async getWithLongerTimeout(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, {
      method: 'GET',
    }, DOWNLOAD_TIMEOUT);
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  /**
   * Upload file (multipart/form-data)
   */
  async uploadFile(endpoint, formData) {
    const headers = {
    };

    return this.request(endpoint, {
      method: 'POST',
      headers,
      body: formData,
      credentials: 'include',
    });
  }
}

// Create singleton instance
export const api = new ApiService();

// Convenience methods for common operations
export const apiRequest = {
  get: (endpoint, params) => api.get(endpoint, params),
  post: (endpoint, data) => api.post(endpoint, data),
  put: (endpoint, data) => api.put(endpoint, data),
  delete: (endpoint) => api.delete(endpoint),
  patch: (endpoint, data) => api.patch(endpoint, data),
  upload: (endpoint, formData) => api.uploadFile(endpoint, formData),
}; 