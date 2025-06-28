import { api } from './api';
import { API_ENDPOINTS, API_BASE_URL } from './config';

/**
 * Group service for handling group-related API calls
 */
export class GroupService {
  /**
   * Create a new group job with file upload (multipart/form-data)
   */
  async createGroup(groupName, numOfJobs, pythonFile, aggregatorFile) {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('group_name', groupName);
      formData.append('num_of_jobs', numOfJobs);
      formData.append('python_file', pythonFile);
      formData.append('aggregator_file', aggregatorFile);

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
   * Get all groups for the current user
   */
  async getUserGroups() {
    try {
      const response = await api.get(API_ENDPOINTS.USER_GROUPS);
      return {
        success: true,
        groups: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch groups',
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

  /**
   * Upload task data file for a group
   */
  async uploadTaskData(groupId, taskIndex, dataFile, requiredRam) {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('task_index', taskIndex);
      formData.append('data_file', dataFile);
      formData.append('required_ram', requiredRam);

      const response = await api.uploadFile(API_ENDPOINTS.GROUP_UPLOAD_DATA(groupId), formData);
      return {
        success: true,
        message: 'Task data uploaded successfully',
        task_index: response.task_index,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to upload task data',
      };
    }
  }

  /**
   * Upload a single chunk of a zip file for a job within a group
   */
  async uploadJobZipChunk(groupId, jobId, chunk, chunkIndex, totalChunks, requiredRam) {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('chunk_index', chunkIndex);
      formData.append('total_chunks', totalChunks);
      formData.append('required_ram', requiredRam);

      const response = await api.uploadFile(`/api/group/${groupId}/${jobId}/upload-zip-file`, formData);
      return {
        success: true,
        message: 'Chunk uploaded successfully',
        chunk_index: chunkIndex,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to upload chunk',
      };
    }
  }

  /**
   * Process payment for a completed group
   */
  async processGroupPayment(groupId) {
    try {
      const response = await api.post(API_ENDPOINTS.GROUP_PAYMENT(groupId));
      return {
        success: true,
        message: 'Payment processed successfully',
        payment: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to process payment',
      };
    }
  }

  /**
   * Download group result file
   * This triggers a direct file download from the API for ZIP format
   */
  downloadGroupResult(groupId) {
    // We return the full URL to be used in a direct download
    // The download will use browser's native functionality with longer timeout
    // The result is expected to be a ZIP file
    const resultUrl = `${API_BASE_URL}${API_ENDPOINTS.GROUP_RESULT(groupId)}`;
    return resultUrl;
  }
}

// Create singleton instance
export const groupService = new GroupService(); 