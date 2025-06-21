import { api } from './api';
import { API_ENDPOINTS } from './config';

/**
 * Jobs service for handling job-related API calls
 */
export class JobsService {
  /**
   * Get all jobs with optional filters
   */
  async getJobs(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.JOBS, params);
      return {
        success: true,
        jobs: response.jobs || response, // Handle different response formats
        total: response.total,
        page: response.page,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch jobs',
      };
    }
  }

  /**
   * Get a single job by ID
   */
  async getJob(id) {
    try {
      const response = await api.get(API_ENDPOINTS.JOB_DETAIL(id));
      return {
        success: true,
        job: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch job',
      };
    }
  }

  /**
   * Create a new job
   */
  async createJob(jobData) {
    try {
      const response = await api.post(API_ENDPOINTS.JOB_CREATE, jobData);
      return {
        success: true,
        job: response,
        message: 'Job created successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to create job',
      };
    }
  }

  /**
   * Update an existing job
   */
  async updateJob(id, jobData) {
    try {
      const response = await api.put(API_ENDPOINTS.JOB_UPDATE(id), jobData);
      return {
        success: true,
        job: response,
        message: 'Job updated successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to update job',
      };
    }
  }

  /**
   * Delete a job
   */
  async deleteJob(id) {
    try {
      await api.delete(API_ENDPOINTS.JOB_DELETE(id));
      return {
        success: true,
        message: 'Job deleted successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to delete job',
      };
    }
  }

  /**
   * Upload job file
   */
  async uploadJobFile(formData) {
    try {
      const response = await api.uploadFile('/jobs/upload', formData);
      return {
        success: true,
        fileUrl: response.file_url,
        message: 'File uploaded successfully',
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to upload file',
      };
    }
  }

  /**
   * Get user's jobs
   */
  async getUserJobs(params = {}) {
    try {
      const response = await api.get(API_ENDPOINTS.USER_JOBS, params);
      return {
        success: true,
        jobs: response.jobs || response,
        total: response.total,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch user jobs',
      };
    }
  }

  /**
   * Start/Stop a job
   */
  async toggleJobStatus(id, action) {
    try {
      const response = await api.post(`/jobs/${id}/${action}`);
      return {
        success: true,
        job: response,
        message: `Job ${action} successfully`,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || `Failed to ${action} job`,
      };
    }
  }
}

// Create singleton instance
export const jobsService = new JobsService(); 