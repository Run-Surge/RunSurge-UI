"use client";

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '../../../components/ProtectedRoute';
import { groupService } from '../../../lib/groupService';
import toast from "react-hot-toast";

// Constants for chunked upload
const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB

// Progress bar component
const ProgressBar = ({ progress }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div 
        className="bg-primary-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusClasses = {
    created: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800",
    success: "bg-green-100 text-green-800",
    complete: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    submitted: "bg-purple-100 text-purple-800",
  };
  
  const normalizedStatus = status?.toLowerCase() || 'created';
  
  return (
    <span className={`${baseClasses} ${statusClasses[normalizedStatus] || statusClasses.created}`}>
      {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
    </span>
  );
};

export default function GroupDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Job upload state
  const [jobUploads, setJobUploads] = useState({});
  const [requiredRam, setRequiredRam] = useState({});
  
  // File input refs
  const fileInputRefs = useRef({});

  useEffect(() => {
    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const result = await groupService.getGroup(id);
        
        if (result.success) {
          setGroup(result.group);
          console.log("Group data with jobs:", result.group);
          
          // Initialize requiredRam state for each job
          if (result.group.jobs && result.group.jobs.length > 0) {
            const initialRequiredRam = {};
            result.group.jobs.forEach(job => {
              initialRequiredRam[job.job_id] = '';
            });
            setRequiredRam(initialRequiredRam);
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

  const handleFileSelect = (jobId, e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      const chunks = Math.ceil(file.size / CHUNK_SIZE);
      setJobUploads({
        ...jobUploads,
        [jobId]: {
          file,
          totalChunks: chunks,
          currentChunk: 0,
          uploadProgress: 0,
          isUploading: false,
          error: null,
          success: false
        }
      });
    } else if (file) {
      setJobUploads({
        ...jobUploads,
        [jobId]: {
          file: null,
          error: 'Please upload a valid ZIP file'
        }
      });
      toast.error('Please upload a valid ZIP file');
    }
  };

  const handleRamChange = (jobId, value) => {
    setRequiredRam({
      ...requiredRam,
      [jobId]: value
    });
  };

  // Upload a single chunk
  const uploadChunk = async (chunk, chunkIndex, totalChunks, groupId, jobId, ram) => {
    try {
      const result = await groupService.uploadJobZipChunk(
        groupId,
        jobId,
        chunk,
        chunkIndex,
        totalChunks,
        ram
      );
      
      return result.success;
    } catch (error) {
      console.error(`Error uploading chunk ${chunkIndex + 1}/${totalChunks}:`, error);
      return false;
    }
  };

  // Handle data file upload with chunking
  const handleUploadZipFile = async (jobId) => {
    const jobUpload = jobUploads[jobId];
    const ram = requiredRam[jobId];
    
    if (!jobUpload || !jobUpload.file) {
      setJobUploads({
        ...jobUploads,
        [jobId]: {
          ...jobUpload,
          error: 'Please select a ZIP file'
        }
      });
      toast.error('Please select a ZIP file');
      return;
    }
    
    if (!ram || isNaN(parseInt(ram)) || parseInt(ram) <= 0) {
      setJobUploads({
        ...jobUploads,
        [jobId]: {
          ...jobUpload,
          error: 'Please enter a valid RAM value'
        }
      });
      toast.error('Please enter a valid RAM value');
      return;
    }

    // Update job upload state to show uploading
    setJobUploads({
      ...jobUploads,
      [jobId]: {
        ...jobUpload,
        isUploading: true,
        error: null
      }
    });

    try {
      // Calculate total chunks
      const totalChunks = jobUpload.totalChunks;
      let uploadedChunks = 0;

      // Upload each chunk sequentially
      for (let i = 0; i < totalChunks; i++) {
        // Update current chunk
        setJobUploads(prev => ({
          ...prev,
          [jobId]: {
            ...prev[jobId],
            currentChunk: i + 1
          }
        }));
        
        const start = i * CHUNK_SIZE;
        const end = Math.min(jobUpload.file.size, start + CHUNK_SIZE);
        const chunk = jobUpload.file.slice(start, end);
        
        // Create a blob with the chunk data
        const chunkBlob = new Blob([chunk], { type: jobUpload.file.type });
        
        // Create a File object from the blob (to maintain filename)
        const chunkFile = new File([chunkBlob], jobUpload.file.name, { 
          type: jobUpload.file.type,
          lastModified: jobUpload.file.lastModified
        });

        // Upload the chunk
        const success = await uploadChunk(chunkFile, i, totalChunks, id, jobId, ram);

        if (!success) {
          setJobUploads(prev => ({
            ...prev,
            [jobId]: {
              ...prev[jobId],
              isUploading: false,
              error: 'Upload failed. Please try again.'
            }
          }));
          toast.error(`Upload failed for job ${jobId}`);
          return;
        }

        uploadedChunks++;
        const progress = Math.round((uploadedChunks / totalChunks) * 100);
        
        // Update progress
        setJobUploads(prev => ({
          ...prev,
          [jobId]: {
            ...prev[jobId],
            uploadProgress: progress
          }
        }));
      }

      // Upload completed successfully
      setJobUploads(prev => ({
        ...prev,
        [jobId]: {
          ...prev[jobId],
          isUploading: false,
          success: true,
          uploadProgress: 100
        }
      }));
      
      toast.success(`File uploaded successfully for job ${jobId}`);

    } catch (error) {
      console.error(`Error uploading file for job ${jobId}:`, error);
      setJobUploads(prev => ({
        ...prev,
        [jobId]: {
          ...prev[jobId],
          isUploading: false,
          error: 'Failed to upload file: ' + (error.message || 'Unknown error')
        }
      }));
      toast.error(`Upload failed for job ${jobId}: ${error.message || 'Unknown error'}`);
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
                  
                  {/* Job Data Upload Section */}
                  <div className="border-t border-gray-200 pt-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Job Data Files</h2>
                    
                    {group.jobs && group.jobs.length > 0 ? (
                      <div className="space-y-8">
                        {group.jobs.map((job) => (
                          <div 
                            key={job.job_id}
                            className="bg-gray-50 p-4 rounded-md border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-md font-medium text-gray-900">
                                Job: {`${group.jobs.indexOf(job) + 1}`}
                              </h3>
                              <StatusBadge status={job.status} />
                            </div>
                            
                            {job.input_file_name && job.input_file_name !== "No input file" && (
                              <div className="mb-4">
                                <dt className="text-sm font-medium text-gray-500">Data File</dt>
                                <dd className="mt-1 text-sm text-gray-900">{job.input_file_name}</dd>
                              </div>
                            )}
                            
                            {job.status === 'submitted' && (
                              <>
                                {jobUploads[job.job_id]?.error && (
                                  <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md text-sm">
                                    {jobUploads[job.job_id].error}
                                  </div>
                                )}
                                
                                {jobUploads[job.job_id]?.success && (
                                  <div className="mb-4 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
                                    File uploaded successfully!
                                  </div>
                                )}
                                
                                <div className="mb-4">
                                  <label htmlFor={`required-ram-${job.job_id}`} className="block text-sm font-medium text-gray-700">
                                    Required RAM (B)
                                  </label>
                                  <div className="mt-1">
                                    <input
                                      type="number"
                                      id={`required-ram-${job.job_id}`}
                                      name={`required-ram-${job.job_id}`}
                                      value={requiredRam[job.job_id] || ''}
                                      onChange={(e) => handleRamChange(job.job_id, e.target.value)}
                                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 text-sm"
                                      placeholder="Enter required RAM"
                                      min="1"
                                      disabled={jobUploads[job.job_id]?.isUploading || jobUploads[job.job_id]?.success}
                                    />
                                  </div>
                                </div>
                                
                                <div className="mb-4">
                                  <input
                                    type="file"
                                    id={`file-upload-${job.job_id}`}
                                    ref={el => fileInputRefs.current[job.job_id] = el}
                                    accept=".zip"
                                    onChange={(e) => handleFileSelect(job.job_id, e)}
                                    className="hidden"
                                    disabled={jobUploads[job.job_id]?.isUploading || jobUploads[job.job_id]?.success}
                                  />
                                  
                                  <div className="flex items-center space-x-4">
                                    <button
                                      type="button"
                                      onClick={() => fileInputRefs.current[job.job_id]?.click()}
                                      disabled={jobUploads[job.job_id]?.isUploading || jobUploads[job.job_id]?.success}
                                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                                    >
                                      Select ZIP File
                                    </button>
                                    
                                    {jobUploads[job.job_id]?.file && (
                                      <span className="text-sm text-gray-600">
                                        {jobUploads[job.job_id].file.name} ({(jobUploads[job.job_id].file.size / (1024 * 1024)).toFixed(2)} MB)
                                      </span>
                                    )}
                                  </div>
                                </div>
                                
                                {jobUploads[job.job_id]?.isUploading && (
                                  <div className="mb-4">
                                    <div className="flex justify-between text-sm text-gray-700 mb-1">
                                      <span>Uploading chunk {jobUploads[job.job_id].currentChunk} of {jobUploads[job.job_id].totalChunks}</span>
                                      <span>{jobUploads[job.job_id].uploadProgress}%</span>
                                    </div>
                                    <ProgressBar progress={jobUploads[job.job_id].uploadProgress} />
                                  </div>
                                )}
                                
                                <div className="flex justify-end">
                                  <button
                                    onClick={() => handleUploadZipFile(job.job_id)}
                                    disabled={!jobUploads[job.job_id]?.file || jobUploads[job.job_id]?.isUploading || jobUploads[job.job_id]?.success}
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400 disabled:opacity-50"
                                  >
                                    {jobUploads[job.job_id]?.isUploading ? `Uploading... (${jobUploads[job.job_id].uploadProgress}%)` : 
                                     jobUploads[job.job_id]?.success ? "Uploaded" : "Upload File"}
                                  </button>
                                </div>
                              </>
                            )}
                            
                            {job.status !== 'submitted' && (
                              <div className="text-sm text-gray-700">
                                This job is already in progress or completed. No uploads needed.
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 bg-gray-50 rounded-md">
                        <p className="text-gray-500">No jobs available for this group.</p>
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