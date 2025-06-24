import { api } from './api';
import { API_ENDPOINTS } from './config';

/**
 * Group service for handling group-related API calls
 */
export class GroupService {
  /**
   * Create a new group job with file upload (multipart/form-data)
   */
  async createGroup(groupName, numOfJobs, pythonFile) {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('group_name', groupName);
      formData.append('num_of_jobs', numOfJobs);
      formData.append('file', pythonFile);

      const response = await api.uploadFile(API_ENDPOINTS.GROUP_CREATE, formData);
      return {
        success: true,
        group: response,
        group_id: response.group_id,
        message: 'Group created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create group',
      };
    }
  }

  /**
   * Get a group by ID
   */
  async getGroup(id) {
    try {
      const response = await api.get(API_ENDPOINTS.GROUP_DETAIL(id));
      return {
        success: true,
        group: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch group',
      };
    }
  }
}

// Create singleton instance
export const groupService = new GroupService(); 