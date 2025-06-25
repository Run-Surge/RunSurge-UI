"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { groupService } from '../../../lib/groupService';

export default function GroupDetailPage() {
  const { id } = useParams();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskUploads, setTaskUploads] = useState([]);
  const [uploadStatus, setUploadStatus] = useState({});

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const result = await groupService.getGroup(id);
        
        if (result.success) {
          setGroup(result.group);
          
          // Initialize task uploads array based on number of jobs
          if (result.group.num_of_jobs) {
            const initialTaskUploads = Array(result.group.num_of_jobs).fill().map(() => ({
              dataFile: null,
              requiredRam: '',
            }));
            setTaskUploads(initialTaskUploads);
          }
          
          setError(null);
        } else {
          setError(result.message || 'Failed to load group details');
        }
      } catch (err) {
        console.error('Error fetching group details:', err);
        setError('An error occurred while loading group details');
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const handleFileChange = (index, file) => {
    if (file && file.name.endsWith('.csv')) {
      const updatedUploads = [...taskUploads];
      updatedUploads[index] = {
        ...updatedUploads[index],
        dataFile: file,
      };
      setTaskUploads(updatedUploads);
      
      // Clear any previous error for this task
      setUploadStatus({
        ...uploadStatus,
        [index]: { error: null }
      });
    } else {
      // Set error for invalid file type
      setUploadStatus({
        ...uploadStatus,
        [index]: { error: 'Please upload a valid CSV file' }
      });
    }
  };

  const handleRamChange = (index, value) => {
    const updatedUploads = [...taskUploads];
    updatedUploads[index] = {
      ...updatedUploads[index],
      requiredRam: value,
    };
    setTaskUploads(updatedUploads);
  };

  const handleUpload = async (index) => {
    const taskData = taskUploads[index];
    
    // Validate inputs
    if (!taskData.dataFile) {
      setUploadStatus({
        ...uploadStatus,
        [index]: { error: 'Please select a CSV file' }
      });
      return;
    }
    
    if (!taskData.requiredRam || isNaN(parseInt(taskData.requiredRam)) || parseInt(taskData.requiredRam) <= 0) {
      setUploadStatus({
        ...uploadStatus,
        [index]: { error: 'Please enter a valid RAM value' }
      });
      return;
    }
    
    // Set uploading status
    setUploadStatus({
      ...uploadStatus,
      [index]: { loading: true, error: null }
    });
    
    try {
      const result = await groupService.uploadTaskData(
        id,
        index,
        taskData.dataFile,
        taskData.requiredRam
      );
      
      if (result.success) {
        setUploadStatus({
          ...uploadStatus,
          [index]: { success: true, message: 'Upload successful', loading: false }
        });
      } else {
        setUploadStatus({
          ...uploadStatus,
          [index]: { error: result.message, loading: false }
        });
      }
    } catch (err) {
      console.error(`Error uploading task ${index} data:`, err);
      setUploadStatus({
        ...uploadStatus,
        [index]: { error: 'Failed to upload data', loading: false }
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Group Job Details</h1>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Back to Dashboard
                </Link>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-3 text-gray-600">Loading group details...</span>
                </div>
              ) : error ? (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {error}
                      </p>
                    </div>
                  </div>
                </div>
              ) : group ? (
                <>
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Group ID</dt>
                        <dd className="mt-1 text-sm text-gray-900">{group.group_id}</dd>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Group Name</dt>
                        <dd className="mt-1 text-sm text-gray-900">{group.group_name}</dd>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Python File</dt>
                        <dd className="mt-1 text-sm text-gray-900">{group.python_file_name}</dd>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Number of Jobs</dt>
                        <dd className="mt-1 text-sm text-gray-900">{group.num_of_jobs}</dd>
                      </div>
                      
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">Created At</dt>
                        <dd className="mt-1 text-sm text-gray-900">{formatDate(group.created_at)}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  {/* Task Data Upload Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Task Data</h2>
                    
                    {taskUploads.length > 0 ? (
                      <div className="space-y-8">
                        {taskUploads.map((task, index) => (
                          <div 
                            key={index}
                            className="bg-gray-50 p-4 rounded-md border border-gray-200"
                          >
                            <h3 className="text-md font-medium text-gray-900 mb-4">Task {index + 1}</h3>
                            
                            {uploadStatus[index]?.error && (
                              <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                                {uploadStatus[index].error}
                              </div>
                            )}
                            
                            {uploadStatus[index]?.success && (
                              <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
                                {uploadStatus[index].message || 'Upload successful'}
                              </div>
                            )}
                            
                            <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-4">
                              <div>
                                <label htmlFor={`data-file-${index}`} className="block text-sm font-medium text-gray-700">
                                  Data File (CSV only)
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="file"
                                    id={`data-file-${index}`}
                                    name={`data-file-${index}`}
                                    accept=".csv"
                                    onChange={(e) => handleFileChange(index, e.target.files[0])}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                                    disabled={uploadStatus[index]?.success || uploadStatus[index]?.loading}
                                  />
                                </div>
                                <p className="mt-1 text-xs text-gray-500">
                                  {task.dataFile ? task.dataFile.name : 'No file selected'}
                                </p>
                              </div>
                              
                              <div>
                                <label htmlFor={`required-ram-${index}`} className="block text-sm font-medium text-gray-700">
                                  Required RAM (MB)
                                </label>
                                <div className="mt-1">
                                  <input
                                    type="number"
                                    id={`required-ram-${index}`}
                                    name={`required-ram-${index}`}
                                    value={task.requiredRam}
                                    onChange={(e) => handleRamChange(index, e.target.value)}
                                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                                    placeholder="Enter required RAM"
                                    min="1"
                                    disabled={uploadStatus[index]?.success || uploadStatus[index]?.loading}
                                  />
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-4 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleUpload(index)}
                                className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                                  (uploadStatus[index]?.success || uploadStatus[index]?.loading) ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                                disabled={uploadStatus[index]?.success || uploadStatus[index]?.loading}
                              >
                                {uploadStatus[index]?.loading ? (
                                  <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Uploading...
                                  </>
                                ) : uploadStatus[index]?.success ? (
                                  <>
                                    <svg className="-ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                    Uploaded
                                  </>
                                ) : (
                                  'Upload'
                                )}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-md">
                        <p className="text-gray-500">No tasks available for this group.</p>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No group found</h3>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 