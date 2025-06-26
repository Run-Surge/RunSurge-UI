'use client';
import { useState } from 'react';
import { useJobs } from '../hooks/useJobs';
import { useAuth } from '../app/context/AuthContext';
import toast from 'react-hot-toast';

export default function JobsList() {
  const { user, token } = useAuth();
  const { 
    jobs, 
    loading, 
    error, 
    total, 
    fetchJobs, 
    deleteJob, 
    toggleJobStatus 
  } = useJobs();
  
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10,
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    setFilters(newFilters);
    fetchJobs(newFilters);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      await deleteJob(id);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const action = currentStatus === 'running' ? 'stop' : 'start';
    await toggleJobStatus(id, action);
  };

  // Format status for display
  const formatStatus = (status) => {
    if (status === 'pending_schedule') return 'PENDING';
    return status.toUpperCase();
  };

  if (loading && jobs.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Jobs</h2>
        <div className="text-sm text-gray-600">
          Total: {total} jobs
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search jobs..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Status</option>
          <option value="submitted">Submitted</option>
          <option value="pending_schedule">Pending</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <button
          onClick={() => fetchJobs(filters)}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Jobs List */}
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No jobs found
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {job.name || job.title || `Job #${job.id}`}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Status:</span>
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        job.status === 'completed' ? 'bg-green-100 text-green-800' :
                        job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'failed' ? 'bg-red-100 text-red-800' :
                        job.status === 'pending_schedule' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {formatStatus(job.status)}
                      </span>
                    </div>
                    
                    <div>
                      <span className="font-medium">Created:</span>
                      <span className="ml-2">
                        {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {job.duration && (
                      <div>
                        <span className="font-medium">Duration:</span>
                        <span className="ml-2">{job.duration}</span>
                      </div>
                    )}
                    
                    {job.progress && (
                      <div>
                        <span className="font-medium">Progress:</span>
                        <span className="ml-2">{job.progress}%</span>
                      </div>
                    )}
                  </div>

                  {job.description && (
                    <p className="mt-3 text-gray-600 text-sm">
                      {job.description}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  {/* Toggle Status Button */}
                  {(job.status === 'pending_schedule' || job.status === 'running') && (
                    <button
                      onClick={() => handleToggleStatus(job.id, job.status)}
                      className={`px-3 py-1 rounded text-sm font-medium ${
                        job.status === 'running'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {job.status === 'running' ? 'Stop' : 'Start'}
                    </button>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {/* Progress Bar */}
              {job.progress && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${job.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {total > filters.limit && (
        <div className="flex justify-center mt-6">
          <div className="flex gap-2">
            <button
              onClick={() => handleFilterChange('page', Math.max(1, filters.page - 1))}
              disabled={filters.page <= 1}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            
            <span className="px-3 py-2 text-gray-600">
              Page {filters.page} of {Math.ceil(total / filters.limit)}
            </span>
            
            <button
              onClick={() => handleFilterChange('page', filters.page + 1)}
              disabled={filters.page >= Math.ceil(total / filters.limit)}
              className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 