"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ProtectedRoute from "../../components/ProtectedRoute";
import { groupService } from "../../lib/groupService";
import { useAuth } from "../context/AuthContext";

// Component for styling the group status according to README requirements
const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusClasses = {
    submitted: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800", 
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  
  const normalizedStatus = status?.toLowerCase() || 'submitted';
  
  return (
    <span className={`${baseClasses} ${statusClasses[normalizedStatus] || statusClasses.submitted}`}>
      {normalizedStatus.toUpperCase()}
    </span>
  );
};

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, loading: authLoading, isAuthenticated, refreshAuth } = useAuth();

  // Load user groups from FastAPI backend
  useEffect(() => {
    const loadUserGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const result = await groupService.getUserGroups();
        
        if (result.success) {
          setGroups(result.groups);
        } else {
          setError(result.message || 'Failed to load groups');
          console.error('Failed to load user groups:', result.message);
        }
      } catch (error) {
        // Handle 401 errors specifically
        if (error.message && error.message.includes('401')) {
          console.error('Authentication error - refreshing auth state');
          setError('Session expired. Please login again.');
          // Refresh authentication state
          await refreshAuth();
        } else {
          setError('Failed to load groups. Please try again.');
          console.error("Failed to load groups:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    // Only load groups if:
    // 1. Authentication is not loading
    // 2. User is authenticated 
    // 3. User data exists
    if (!authLoading && isAuthenticated && user) {
      loadUserGroups();
    } else if (!authLoading && !isAuthenticated) {
      // If not authenticated and auth loading is complete, clear groups and show appropriate state
      setGroups([]);
      setLoading(false);
      setError(null);
    }
  }, [user, authLoading, isAuthenticated, refreshAuth]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Your Groups
                  </h1>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Back to Dashboard
                  </Link>
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Grouped Jobs</h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Manage and monitor your grouped jobs
                      </p>
                    </div>
                    <div>
                      <Link
                        href="/group/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        Create New Group
                      </Link>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200">
                    {loading || authLoading ? (
                      <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                        <span className="ml-3 text-gray-600">Loading your groups...</span>
                      </div>
                    ) : error ? (
                      <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading groups</h3>
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
                    ) : groups.length === 0 ? (
                      <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No groups</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new group.</p>
                        <div className="mt-6">
                          <Link
                            href="/group/new"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                          >
                            Create New Group
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Group Name
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Number of Jobs
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {groups.map((group) => (
                              <tr key={group.group_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">{group.group_name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <StatusBadge status={group.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(group.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                  {group.num_of_jobs}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <Link
                                    href={`/group/${group.group_id}`}
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