import { useState, useEffect } from 'react';
import { jobsService } from '../lib/jobsService';
import toast from 'react-hot-toast';

/**
 * Custom hook for managing jobs
 */
export const useJobs = (initialParams = {}) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  /**
   * Fetch jobs with parameters
   */
  const fetchJobs = async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const result = await jobsService.getJobs({ ...initialParams, ...params });
      
      if (result.success) {
        setJobs(result.jobs);
        setTotal(result.total || result.jobs.length);
        setPage(result.page || 1);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch jobs');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create a new job
   */
  const createJob = async (jobData) => {
    setLoading(true);
    
    try {
      const result = await jobsService.createJob(jobData);
      
      if (result.success) {
        toast.success(result.message);
        // Refresh jobs list
        await fetchJobs();
        return { success: true, job: result.job };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error('Failed to create job');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Update a job
   */
  const updateJob = async (id, jobData) => {
    setLoading(true);
    
    try {
      const result = await jobsService.updateJob(id, jobData);
      
      if (result.success) {
        toast.success(result.message);
        // Update the job in the current list
        setJobs(jobs.map(job => job.id === id ? result.job : job));
        return { success: true, job: result.job };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error('Failed to update job');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a job
   */
  const deleteJob = async (id) => {
    setLoading(true);
    
    try {
      const result = await jobsService.deleteJob(id);
      
      if (result.success) {
        toast.success(result.message);
        // Remove the job from the current list
        setJobs(jobs.filter(job => job.id !== id));
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error('Failed to delete job');
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /**
   * Toggle job status (start/stop)
   */
  const toggleJobStatus = async (id, action) => {
    try {
      const result = await jobsService.toggleJobStatus(id, action);
      
      if (result.success) {
        toast.success(result.message);
        // Update the job in the current list
        setJobs(jobs.map(job => job.id === id ? result.job : job));
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error(`Failed to ${action} job`);
      return { success: false, message: error.message };
    }
  };

  // Initial fetch when component mounts
  useEffect(() => {
    fetchJobs();
  }, []);

  return {
    jobs,
    loading,
    error,
    total,
    page,
    fetchJobs,
    createJob,
    updateJob,
    deleteJob,
    toggleJobStatus,
    refetch: fetchJobs,
  };
};

/**
 * Custom hook for managing a single job
 */
export const useJob = (id) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchJob = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await jobsService.getJob(id);
      
      if (result.success) {
        setJob(result.job);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error('Failed to fetch job');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  return {
    job,
    loading,
    error,
    refetch: fetchJob,
  };
}; 