import { api } from './api';
import { API_ENDPOINTS } from './config';

/**
 * Statistics service for fetching platform-wide statistics
 */
export class StatisticsService {
  /**
   * Get global platform statistics
   * Returns total active nodes and lifetime earnings
   */
  async getGlobalStatistics() {
    try {
      const response = await api.get(API_ENDPOINTS.STATISTICS);
      return {
        success: true,
        statistics: response,
      };
    } catch (error) {
      console.error('Error fetching global statistics:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch statistics',
        statistics: { nodes: 0, earnings: 0 }, // Default values in case of error
      };
    }
  }
}

// Create singleton instance
export const statisticsService = new StatisticsService(); 