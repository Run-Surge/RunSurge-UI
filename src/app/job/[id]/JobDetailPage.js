"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "../../../components/ProtectedRoute";
import toast from "react-hot-toast";

// File upload component
const FileUploadArea = ({ onFilesSelect, uploadedFiles }) => {
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
    const files = Array.from(e.dataTransfer.files);
    onFilesSelect(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    onFilesSelect(files);
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
                multiple
                onChange={handleFileSelect}
              />
            </label>
          </div>
          <p className="text-xs text-gray-500">
            CSV, JSON, TXT files up to 10MB each
          </p>
        </div>
      </div>

      {/* Uploaded Files List */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900">Uploaded Files:</h4>
          <div className="space-y-1">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
              >
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
                  <span className="text-sm text-gray-900">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({Math.round(file.size / 1024)}KB)
                  </span>
                </div>
                <button
                  onClick={() => {
                    const newFiles = uploadedFiles.filter((_, i) => i !== index);
                    onFilesSelect(newFiles);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
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
    created: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    running: "bg-blue-100 text-blue-800",
    complete: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
  };
  
  const normalizedStatus = status?.toLowerCase() || 'created';
  
  return (
    <span className={`${baseClasses} ${statusClasses[normalizedStatus] || statusClasses.created}`}>
      {normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)}
    </span>
  );
};

export default function JobDetailPage({ params }) {
  const router = useRouter();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load job data from localStorage (mock data)
    const loadJob = () => {
      try {
        const mockJobs = JSON.parse(localStorage.getItem("mockJobs") || "[]");
        const foundJob = mockJobs.find(j => j.id.toString() === params.id);
        
        if (foundJob) {
          setJob(foundJob);
        } else {
          toast.error("Job not found");
          router.push("/dashboard");
        }
      } catch (error) {
        toast.error("Failed to load job");
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadJob();
  }, [params.id, router]);

  const handleFilesSelect = (files) => {
    setUploadedFiles(files);
  };

  const handleSubmitJob = async () => {
    if (!job) return;

    setIsSubmitting(true);
    toast.loading("Submitting job...");

    try {
      // Update job status to PENDING
      const mockJobs = JSON.parse(localStorage.getItem("mockJobs") || "[]");
      const updatedJobs = mockJobs.map(j => 
        j.id === job.id 
          ? { ...j, status: "pending", data_files: uploadedFiles.map(f => f.name), submitted_at: new Date().toISOString() }
          : j
      );
      localStorage.setItem("mockJobs", JSON.stringify(updatedJobs));

      // Update local state
      setJob(prev => ({ 
        ...prev, 
        status: "pending", 
        data_files: uploadedFiles.map(f => f.name),
        submitted_at: new Date().toISOString()
      }));

      toast.dismiss();
      toast.success("Job submitted successfully!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to submit job");
    } finally {
      setIsSubmitting(false);
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
                  <h1 className="text-2xl font-bold text-gray-900">{job.name}</h1>
                  <p className="mt-1 text-sm text-gray-600">Job ID: {job.id}</p>
                </div>
                <StatusBadge status={job.status} />
              </div>
            </div>

            {/* Job Metadata */}
            <div className="px-6 py-4">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{job.type} Job</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(job.created_at).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Script File</dt>
                  <dd className="mt-1 text-sm text-gray-900">{job.script_file}</dd>
                </div>
                {job.submitted_at && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Submitted</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(job.submitted_at).toLocaleString()}
                    </dd>
                  </div>
                )}
                {job.description && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">Description</dt>
                    <dd className="mt-1 text-sm text-gray-900">{job.description}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>

          {/* Data Files Section */}
          {job.status === "created" && (
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Upload Data Files</h2>
                <p className="mt-1 text-sm text-gray-600">
                  Upload any data files that your script needs to process
                </p>
              </div>
              <div className="px-6 py-4">
                <FileUploadArea 
                  onFilesSelect={handleFilesSelect}
                  uploadedFiles={uploadedFiles}
                />
              </div>
            </div>
          )}

          {/* Data Files Display (for submitted jobs) */}
          {job.data_files && job.data_files.length > 0 && (
            <div className="bg-white shadow rounded-lg mb-6">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Data Files</h2>
              </div>
              <div className="px-6 py-4">
                <div className="space-y-2">
                  {job.data_files.map((filename, index) => (
                    <div key={index} className="flex items-center bg-gray-50 px-3 py-2 rounded-md">
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
                      <span className="text-sm text-gray-900">{filename}</span>
                    </div>
                  ))}
                </div>
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

            {job.status === "created" && (
              <button
                onClick={handleSubmitJob}
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Submit Job"}
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 