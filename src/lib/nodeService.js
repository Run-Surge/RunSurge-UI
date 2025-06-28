import { api } from './api';
import { API_ENDPOINTS } from './config';

/**
 * Node service for handling node-related API calls
 */
export class NodeService {
  /**
   * Get user's nodes and dashboard data
   */
  async getUserNodes() {
    try {
      const response = await api.get(API_ENDPOINTS.USER_NODES);
      return {
        success: true,
        ...response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch nodes',
      };
    }
  }

  /**
   * Get details for a specific node by ID
   */
  async getNodeDetails(nodeId) {
    try {
      const response = await api.get(API_ENDPOINTS.NODE_DETAIL(nodeId));
      return {
        success: true,
        nodeDetails: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch node details',
      };
    }
  }
}

// Create singleton instance
export const nodeService = new NodeService(); 