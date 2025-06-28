"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { nodeService } from "../../../lib/nodeService";
import toast from "react-hot-toast";

// Status indicator component for node alive status
const StatusIndicator = ({ isAlive }) => {
  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full mr-2 ${isAlive ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <span className={`text-sm font-medium ${isAlive ? 'text-green-700' : 'text-red-700'}`}>
        {isAlive ? '✅ Online' : '❌ Offline'}
      </span>
    </div>
  );
};

// Component to format bytes to human-readable format
const FormattedBytes = ({ bytes }) => {
  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return <span>{formatBytes(bytes)}</span>;
};

// Component to format time in seconds to a readable format
const FormattedTime = ({ seconds }) => {
  const formatTime = (seconds) => {
    if (!seconds) return '0s';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.round(seconds % 60);
    
    let result = '';
    if (hours > 0) result += `${hours}h `;
    if (minutes > 0 || hours > 0) result += `${minutes}m `;
    result += `${remainingSeconds}s`;
    
    return result;
  };

  return <span>{formatTime(seconds)}</span>;
};

// Component for earning status badge
const EarningStatusBadge = ({ status }) => {
  if (!status) return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">N/A</span>;
  
  const statusClasses = {
    paid: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    default: "bg-gray-100 text-gray-800"
  };
  
  const baseClasses = "px-1 py-0.5 text-xs font-medium rounded-full";
  const colorClasses = statusClasses[status.toLowerCase()] || statusClasses.default;
  
  return (
    <span className={`${baseClasses} ${colorClasses} capitalize`}>
      {status}
    </span>
  );
};

export default function NodeDetailPage({ params }) {
  const router = useRouter();
  const [nodeDetails, setNodeDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Make sure we have the node_id from params
  const nodeId = params?.node_id;
  
  console.log("Node ID from params:", nodeId); // Debug log

  useEffect(() => {
    const fetchNodeDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!nodeId) {
          console.error("Node ID is missing from params:", params);
          setError('Node ID is required');
          return;
        }
        
        console.log("Fetching details for node:", nodeId);
        const result = await nodeService.getNodeDetails(nodeId);
        console.log("API response:", result);
        
        if (result.success) {
          setNodeDetails(result.nodeDetails);
        } else {
          setError(result.message || 'Failed to load node details');
          toast.error(result.message || 'Failed to load node details');
        }
      } catch (error) {
        console.error("Error fetching node details:", error);
        setError('Failed to load node details. Please try again.');
        toast.error('Failed to load node details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNodeDetails();
  }, [nodeId]);

  // Format currency values
  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value);
  };

  // Format date values
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex justify-between items-center mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">Node Details</h1>
                  <button
                    onClick={() => router.push("/nodes")}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Back to Nodes
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                    <span className="ml-3 text-gray-600">Loading node details...</span>
                  </div>
                ) : error ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading node details</h3>
                    <p className="mt-1 text-sm text-gray-500">{error}</p>
                    <div className="mt-6">
                      <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Try Again
                      </button>
                    </div>
                  </div>
                ) : nodeDetails ? (
                  <>
                    {/* Node Summary Card */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                      <div className="px-4 py-5 sm:px-6 flex justify-between">
                        <div>
                          <h3 className="text-lg leading-6 font-medium text-gray-900">Node Information</h3>
                          <p className="mt-1 max-w-2xl text-sm text-gray-500">Details and metrics for this compute node.</p>
                        </div>
                        <StatusIndicator isAlive={nodeDetails.is_alive} />
                      </div>
                      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Node ID</dt>
                            <dd className="mt-1 text-sm text-gray-900">{nodeDetails.node_id}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Completed Tasks</dt>
                            <dd className="mt-1 text-sm text-gray-900">{nodeDetails.num_of_completed_tasks}</dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Total Earnings</dt>
                            <dd className="mt-1 text-sm font-medium text-green-600">
                              {formatCurrency(nodeDetails.total_node_earnings)}
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>

                    {/* Tasks List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                      <div className="px-4 py-5 sm:px-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          Tasks ({nodeDetails.tasks?.length || 0})
                        </h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                          List of tasks processed by this node
                        </p>
                      </div>
                      <div className="border-t border-gray-200">
                        {nodeDetails.tasks && nodeDetails.tasks.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Task ID
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Started
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Completed
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Active Time
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Avg Memory
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Earning
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {nodeDetails.tasks.map((task) => (
                                  <tr key={task.task_id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="text-sm font-medium text-gray-900">
                                        {task.task_id}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatDate(task.started_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {formatDate(task.completed_at)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <FormattedTime seconds={task.total_active_time} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      <FormattedBytes bytes={task.avg_memory_bytes} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                                        {task.status}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                      <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">
                                          {task.earning_amount !== null ? formatCurrency(task.earning_amount) : 'N/A'}
                                        </span>
                                        <EarningStatusBadge status={task.earning_status} />
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
                            <p className="mt-1 text-sm text-gray-500">This node hasn't processed any tasks yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Node Not Found</h3>
                    <p className="mt-1 text-sm text-gray-500">The requested node could not be found.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 