"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import toast from "react-hot-toast";
import { jobsService } from "../../../lib/jobsService";

const CHUNK_SIZE = 100 * 1024 * 1024; // 100MB

// File upload component
const FileUploadArea = ({ onFileSelect, selectedFile, acceptedFormats = ".csv" }) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragOver
            ? "border-primary-500 bg-primary-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="space-y-2">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="text-sm text-gray-600">
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="text-primary-600 hover:text-primary-500">
                Click to upload
              </span>
              <span> or drag and drop</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept={acceptedFormats}
                onChange={handleFileSelect}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            CSV files up to 1GB (will be uploaded in chunks)
          </p>
        </div>
      </div>

      {/* Selected File */}
      {selectedFile && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Selected File:</h4>
          <div className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-gray-400 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm text-gray-900">{selectedFile.name}</span>
              <span className="text-xs text-gray-500 ml-2">
                ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            </div>
            <button
              onClick={() => onFileSelect(null)}
              className="text-red-500 hover:text-red-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Status badge component
const StatusBadge = ({ status }) => {
  const baseClasses = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusClasses = {
    submitted: "bg-gray-100 text-gray-800",
    pending_schedule: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  
  const normalizedStatus = status?.toLowerCase() || 'submitted';
  
  // Format display text to be more readable
  const getDisplayText = (status) => {
    if (status === 'pending_schedule') return 'PENDING';
    return status.toUpperCase();
  };
  
  return (
    <span className={`${baseClasses} ${statusClasses[normalizedStatus] || statusClasses.submitted}`}>
      {getDisplayText(normalizedStatus)}
    </span>
  );
};

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

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentChunk, setCurrentChunk] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  // Fetch job details from API
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const result = await jobsService.getJob(params.id);
        
        if (result.success) {
          setJob(result.job);
        } else {
          toast.error(result.message || "Failed to load job");
          router.push("/dashboard");
        }
      } catch (error) {
        toast.error("Failed to load job");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, [params.id, router]);

  // Handle file selection
  const handleFileSelect = (file) => {
    setSelectedFile(file);
    if (file) {
      const chunks = Math.ceil(file.size / CHUNK_SIZE);
      setTotalChunks(chunks);
      setCurrentChunk(0);
      setUploadProgress(0);
    }
  };

  // Upload a single chunk
  const uploadChunk = async (chunk, chunkIndex, totalChunks, jobId) => {
    try {
      const formData = new FormData();
      formData.append('file', chunk);
      formData.append('chunk_index', chunkIndex);
      formData.append('total_chunks', totalChunks);
      
      const result = await jobsService.uploadDataFile(jobId, formData);
      
      if (result.success) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error(`❌ Error uploading chunk ${chunkIndex + 1}/${totalChunks}:`, error);
      return false;
    }
  };

  // Handle data file upload with chunking
  const handleUploadDataFile = async () => {
    if (!selectedFile || !job) return;

    setIsUploading(true);
    try {
      // Calculate total chunks
      const totalChunks = Math.ceil(selectedFile.size / CHUNK_SIZE);
      let uploadedChunks = 0;

      // Upload each chunk sequentially
      for (let i = 0; i < totalChunks; i++) {
        setCurrentChunk(i + 1);
        
        // Update toast message for each chunk
        toast.dismiss();        
        const start = i * CHUNK_SIZE;
        const end = Math.min(selectedFile.size, start + CHUNK_SIZE);
        const chunk = selectedFile.slice(start, end);
        
        // Create a blob with the chunk data
        const chunkBlob = new Blob([chunk], { type: selectedFile.type });
        
        // Create a File object from the blob (to maintain filename)
        const chunkFile = new File([chunkBlob], selectedFile.name, { 
          type: selectedFile.type,
          lastModified: selectedFile.lastModified
        });

        // Upload the chunk
        const success = await uploadChunk(chunkFile, i, totalChunks, job.job_id);

        if (!success) {
          toast.dismiss();
          toast.error(`Upload failed.`);
          setIsUploading(false);
          return;
        }

        uploadedChunks++;
        const progress = Math.round((uploadedChunks / totalChunks) * 100);
        setUploadProgress(progress);
      }

      toast.dismiss();
      toast.success("File uploaded successfully! Job is being scheduled for processing.");
      setSelectedFile(null);
      setUploadProgress(0);
      setCurrentChunk(0);
      setTotalChunks(0);
      router.push("/dashboard");


    } catch (error) {
      toast.dismiss();
      toast.error("Failed to upload file: " + (error.message || "Unknown error"));
    } finally {
      setIsUploading(false);
    }
  };

  // Handle result download
  const handleDownloadResult = () => {
    if (!job) return;
    
    try {
      // Get the download URL
      const downloadUrl = jobsService.downloadJobResult(job.job_id);
      
      // Create a temporary link and click it to trigger the download
      const link = document.createElement('a');
      link.href = downloadUrl;
      // Set filename with .csv extension
      link.download = `job_${job.job_id}_result.csv`;
      // Set MIME type for CSV
      link.type = 'text/csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("CSV file download started!");
    } catch (error) {
      toast.error("Failed to download result. Please try again.");
      console.error("Download error:", error);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!job) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Job Not Found</h2>
            <p className="mt-2 text-gray-600">The requested job could not be found.</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{job.job_name}</h1>
                  <p className="mt-1 text-sm text-gray-600">Job ID: {job.job_id}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>
            </div>

            {/* Job Metadata */}
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{job.job_type} Job</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(job.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Script File</dt>
                  <dd className="mt-1 text-sm text-gray-900">{job.script_name}</dd>
                </div>
                {job.input_file_name && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Input File</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.input_file_name}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Data Files Section - Only show for simple jobs */}
          {job.status === "submitted" && (
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upload Data File</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Upload a CSV file that your script needs to process. Large files will be uploaded in chunks.
                </p>
              </div>
              <div className="px-6 py-4">
                <FileUploadArea 
                  onFileSelect={handleFileSelect}
                  selectedFile={selectedFile}
                  acceptedFormats=".csv"
                />
                
                {selectedFile && (
                  <div className="mt-4">
                    <div className="flex justify-end">
                      <button
                        onClick={handleUploadDataFile}
                        disabled={isUploading}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
                      >
                        {isUploading ? `Uploading... (${uploadProgress}%)` : "Upload File"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Job Status and Input File Display - Show for jobs with status other than submitted */}
          {job.status !== "submitted" && job.input_file_name && (
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Job Data</h2>
              </div>
              <div className="px-6 py-4">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-900">Input File:</span>
                  <span className="text-sm text-gray-700">{job.input_file_name}</span>
                </div>
                
                {job.status === "running" && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">Your job is currently running. Check back later for results.</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                )}
                
                {job.status === "completed" && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700">Your job has completed successfully!</p>
                    <button
                      onClick={handleDownloadResult}
                      className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center"
                    >
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download Result (CSV)
                    </button>
                  </div>
                )}
                
                {job.status === "failed" && (
                  <div className="mt-4">
                    <p className="text-sm text-red-700">Your job failed to complete. Please check the logs or try again.</p>
                  </div>
                )}

                {job.status === "pending_schedule" && (
                  <div className="mt-4">
                    <p className="text-sm text-yellow-700">Your job is pending scheduling. It will start running soon.</p>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-yellow-600 h-2.5 rounded-full animate-pulse w-1/4"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 