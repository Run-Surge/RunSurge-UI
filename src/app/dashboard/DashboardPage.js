"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import { jobsService } from "../../lib/jobsService";
import { useAuth } from "../context/AuthContext";

// Component for styling the job status according to README requirements
const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusClasses = {
    created: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800", 
    complete: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  
  const normalizedStatus = status?.toLowerCase() || 'created';
  
  return (
    <span className={`${baseClasses} ${statusClasses[normalizedStatus] || statusClasses.created}`}>
      {normalizedStatus.toUpperCase()}
    </span>
  );
};

export default function DashboardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading, isAuthenticated, refreshAuth } = useAuth();

  // Load user jobs from FastAPI backend
  useEffect(() => {
    const loadUserJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await jobsService.getUserJobs();
        
        if (result.success) {
          // Transform backend response to match frontend expectations
          const transformedJobs = result.jobs.map(job => ({
            id: job.job_id,
            name: job.job_name,
            description: job.description || `${job.job_type} job`,
            script_file: job.script_file || `${job.job_name}.py`,
            status: job.status,
            type: job.job_type,
            created_at: job.created_at,
            submitted_at: job.created_at,
            data_files: job.data_files || []
          }));
          
          setJobs(transformedJobs);
        } else {
          setError(result.message || 'Failed to load jobs');
          console.error('Failed to load user jobs:', result.message);
        }
      } catch (error) {
        // Handle 401 errors specifically
        if (error.message && error.message.includes('401')) {
          console.error('Authentication error - refreshing auth state');
          setError('Session expired. Please login again.');
          // Refresh authentication state
          await refreshAuth();
        } else {
          setError('Failed to load jobs. Please try again.');
          console.error("Failed to load jobs:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    // Only load jobs if:
    // 1. Authentication is not loading
    // 2. User is authenticated 
    // 3. User data exists
    if (!authLoading && isAuthenticated && user) {
      loadUserJobs();
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated and auth loading is complete, clear jobs and show appropriate state
      setJobs([]);
      setLoading(false);
      setError(null);
    }
  }, [user, authLoading, isAuthenticated, refreshAuth]);

  // Calculate stats
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter(job => job.status === 'complete').length;
  const runningJobs = jobs.filter(job => job.status === 'running' || job.status === 'pending').length;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                  Dashboard
                </h1>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs</dt>
                            <dd className="text-2xl font-bold text-gray-900">{totalJobs}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                            <dd className="text-2xl font-bold text-gray-900">{completedJobs}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-yellow-600 rounded-lg flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-5 w-0 flex-1">
                          <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">Running</dt>
                            <dd className="text-2xl font-bold text-gray-900">{runningJobs}</dd>
                          </dl>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Jobs Section */}
                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Your Jobs</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Manage and monitor your submitted jobs
                      </p>
                    </div>
                    <div className="flex space-x-4">
                      <Link
                        href="/job/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Submit New Job
                      </Link>
                      <Link
                        href="/groups"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        View Groups
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200">
                    {loading || authLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <span className="ml-3 text-gray-600">Loading your jobs...</span>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading jobs</h3>
                        <p className="mt-1 text-sm text-gray-500">{error}</p>
                        <div className="mt-6">
                          {error.includes('Session expired') ? (
                            <Link
                              href="/login"
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                            >
                              Login Again
                            </Link>
                          ) : (
                            <button
                              onClick={() => window.location.reload()}
                              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                            >
                              Try Again
                            </button>
                          )}
                        </div>
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0H8m8 0v2a2 2 0 01-2 2H10a2 2 0 01-2-2V6" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new job.</p>
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Job Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Type
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {jobs.map((job) => (
                              <tr key={job.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{job.name}</div>
                                  {job.description && (
                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                      {job.description}
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <StatusBadge status={job.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                                  {job.type} Job
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(job.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <Link
                                    href={`/job/${job.id}`}
                                    className="text-primary-600 hover:text-primary-900"
                                  >
                                    View Details
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
