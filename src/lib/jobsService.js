import { api } from './api';
import { API_ENDPOINTS, API_BASE_URL } from './config';

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
   * Create a new job with file upload (multipart/form-data)
   */
  async createJob(jobName, jobType, file) {
    try {
      // Create FormData for multipart/form-data request
      const formData = new FormData();
      formData.append('job_name', jobName);
      formData.append('job_type', jobType);
      formData.append('file', file);

      const response = await api.uploadFile(API_ENDPOINTS.JOB_CREATE, formData);
      return {
        success: true,
        job: response,
        job_id: response.job_id,
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
   * Upload data file for a specific job
   */
  async uploadDataFile(jobId, formData) {
    try {
      const response = await api.uploadFile(API_ENDPOINTS.JOB_UPLOAD_DATA(jobId), formData);
      
      // Return the backend response format with our success flag
      return {
        success: true,
        message: response.message || 'Data file uploaded successfully',
        data_chunk_index: response.data_chunk_index,
        job_id: response.job_id,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to upload data file',
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
   * Download job result file
   * This triggers a direct file download from the API for CSV format
   */
  downloadJobResult(jobId) {
    // We return the full URL to be used in a direct download
    // The download will use browser's native functionality with longer timeout
    // The result is expected to be a CSV file
    const resultUrl = `${API_BASE_URL}${API_ENDPOINTS.JOB_RESULT(jobId)}`;
    return resultUrl;
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

  /**
   * Get job payment details including task usage information
   */
  async getJobPayment(jobId) {
    try {
      const response = await api.get(API_ENDPOINTS.JOB_PAYMENT(jobId));
      return {
        success: true,
        payment: response,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to fetch payment details',
      };
    }
  }

  /**
   * Process payment for a job
   */
  async processPayment(jobId) {
    try {
      const response = await api.post(API_ENDPOINTS.JOB_PAYMENT(jobId));
      return {
        success: true,
        message: response.message || 'Payment processed successfully',
        data: response
      };
    } catch (error) {
      return {
        success: false,
        message: error.message || 'Failed to process payment',
      };
    }
  }
}

// Create singleton instance
export const jobsService = new JobsService(); 