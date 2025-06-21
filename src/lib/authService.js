import { api } from './api';
import { API_ENDPOINTS } from './config';

/**
 * Authentication service for handling auth-related API calls
 */
export class AuthService {
  constructor() {
    this.currentUser = null;
    this.authCheckPromise = null;
  }

  /**
   * Login user with username/email and password
   */
  async login(usernameOrEmail, password) {
    try {
      console.log('🔐 Attempting login with:', { usernameOrEmail });
      
      const response = await api.post(API_ENDPOINTS.LOGIN, {
        username_or_email: usernameOrEmail,
        password,
      });
      
      console.log('🔐 Login response:', response);
      
      // Backend returns: { user: {...}, message: "...", success: true }
      // Server sets HTTP-only cookies automatically
      if (response.success && response.user) {
        this.currentUser = response.user;
        console.log('✅ Login successful, user:', response.user);
        return {
          success: true,
          user: response.user,
          message: response.message,
          token: 'http-only-cookie',
        };
      } else {
        this.currentUser = null;
        console.log('❌ Login failed - no success or user in response');
        return {
          success: false,
          message: response.message || 'Login failed',
        };
      }
    } catch (error) {
      this.currentUser = null;
      console.error('🔐 Login error:', error);
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

      // Backend returns: { user: {...}, message: "...", success: true }
      if (response.success) {
        // If user is returned, they're automatically logged in
        if (response.user) {
          this.currentUser = response.user;
          return {
            success: true,
            user: response.user,
            message: response.message || 'Registration successful',
          };
        } else {
          this.currentUser = null;
          return {
            success: true,
            message: response.message || 'Registration successful',
          };
        }
      } else {
        this.currentUser = null;
        return {
          success: false,
          message: response.message || 'Registration failed',
        };
      }
    } catch (error) {
      this.currentUser = null;
      return {
        success: false,
        message: error.message || 'Registration failed',
      };
    }
  }

  /**
   * Get current user data from server
   */
  async getCurrentUser() {
    try {
      console.log('👤 Checking current user...');
      const response = await api.get(API_ENDPOINTS.ME);
      console.log('👤 Me response:', response);
      
      // Backend returns: 
      // Authenticated: { status: "authenticated", user: {...}, message: "..." }
      // Unauthenticated: { status: "unauthenticated", user: null, message: "..." }
      
      if (response.status === "authenticated" && response.user) {
        this.currentUser = response.user;
        console.log('✅ User authenticated:', response.user);
        return {
          success: true,
          user: response.user,
          message: response.message,
        };
      } else {
        this.currentUser = null;
        console.log('❌ User not authenticated:', response.message);
        return {
          success: false,
          message: response.message || 'Not authenticated',
        };
      }
    } catch (error) {
      this.currentUser = null;
      console.error('👤 getCurrentUser error:', error);
      return {
        success: false,
        message: error.message || 'Failed to get user data',
      };
    }
  }

  /**
   * Check if user is authenticated
   * This method tries to get current user from server
   * Returns a Promise that resolves to boolean
   */
  async checkAuthentication() {
    try {
      // If we already have a pending auth check, return that promise
      if (this.authCheckPromise) {
        return await this.authCheckPromise;
      }

      // Create new auth check promise
      this.authCheckPromise = this.getCurrentUser();
      const result = await this.authCheckPromise;
      
      // Clear the promise
      this.authCheckPromise = null;
      
      return result.success;
    } catch (error) {
      this.authCheckPromise = null;
      this.currentUser = null;
      return false;
    }
  }

  /**
   * Synchronous check if user is authenticated
   * Returns true if we have user data cached, false otherwise
   * For real-time check, use checkAuthentication() instead
   */
  isAuthenticated() {
    return !!this.currentUser;
  }

  /**
   * Get cached user data
   */
  getUser() {
    return this.currentUser;
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
    
    // Clear local user data
    this.currentUser = null;
    this.authCheckPromise = null;
  }

  /**
   * Refresh authentication token
   */
  async refreshToken() {
    try {
      const response = await api.post(API_ENDPOINTS.REFRESH_TOKEN);
      
      return {
        success: true,
        token: response.token,
      };
    } catch (error) {
      // If refresh fails, clear user data
      this.currentUser = null;
      
      return {
        success: false,
        message: error.message || 'Token refresh failed',
      };
    }
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