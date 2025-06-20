import { api } from './api';
import { API_ENDPOINTS } from './config';
import Cookies from 'js-cookie';

/**
 * Authentication service for handling auth-related API calls
 */
export class AuthService {
  /**
   * Login user with username/email and password
   */
  async login(usernameOrEmail, password) {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        username_or_email: usernameOrEmail,
        password,
      });
      
      // Server sets HTTP-only cookies automatically
      // No need to manually store tokens since they're HTTP-only
      
      return {
        success: true,
        user: response.user || response, // User data from response
        token: 'http-only-cookie', // Placeholder since we can't access HTTP-only cookies
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Login failed',
      };
    }
  }

  async register(username, email, password) {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, {
        username,
        email,
        password,
      });

      return {
        success: true,
        message: response.message || 'Registration successful',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  }

  /**
   * Get current user data
   */
  async getCurrentUser() {
    try {
      const response = await api.get(API_ENDPOINTS.ME);
      return {
        success: true,
        user: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to get user data',
      };
    }
  }

  /**
   * Logout user
   */
  async logout() {
    try {
      // Call logout endpoint - server will clear HTTP-only cookies
      await api.post(API_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout API call failed:', error);
      // Continue with local logout even if API call fails
    }
    // No need to manually remove cookies since they're HTTP-only and managed by server
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const refreshToken = Cookies.get('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN, {
        refresh_token: refreshToken,
      });

      if (response.token) {
        Cookies.set('token', response.token, { expires: 7 });
        
        if (response.refresh_token) {
          Cookies.set('refresh_token', response.refresh_token, { expires: 30 });
        }
      }

      return {
        success: true,
        token: response.token,
      };
    } catch (error) {
      // If refresh fails, clear all tokens
      Cookies.remove('token');
      Cookies.remove('refresh_token');
      
      return {
        success: false,
        message: error.message || 'Token refresh failed',
      };
    }
  }

  /**
   * Check if user is authenticated
   * Since cookies are HTTP-only, we can't check them directly
   * We'll rely on API calls to determine authentication status
   */
  isAuthenticated() {
    // Can't check HTTP-only cookies, so we'll determine this through API calls
    return null; // This will be determined by AuthContext through getCurrentUser()
  }

  /**
   * Get current token
   * Returns placeholder since HTTP-only cookies can't be accessed by JavaScript
   */
  getToken() {
    return 'http-only-cookie'; // Placeholder since we can't access HTTP-only cookies
  }
}

// Create singleton instance
export const authService = new AuthService(); 