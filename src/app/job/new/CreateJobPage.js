"use client";

import { useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { jobsService } from "../../../lib/jobsService";

// Simple file input component
const SimpleFileInput = ({
  id,
  label,
  acceptedFormats,
  selectedFile,
  onFileSelect,
  required = false
}) => {
  const fileName = selectedFile ? selectedFile.name : "No file selected";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="mt-1 flex items-center">
        <label
          htmlFor={id}
          className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          Choose File
          <input
            id={id}
            name={id}
            type="file"
            className="sr-only"
            accept={acceptedFormats}
            onChange={(e) => onFileSelect(e.target.files[0])}
          />
        </label>
        <span className="ml-3 text-sm text-gray-500 truncate">{fileName}</span>
      </div>
    </div>
  );
};

// Tab component
const TabButton = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`px-6 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
      active
        ? "text-primary-600 border-primary-600 bg-primary-50"
        : "text-gray-500 border-gray-200 hover:text-gray-700 hover:border-gray-300"
    }`}
  >
    {children}
  </button>
);

const CreateJobPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("simple");
  const [pythonScript, setPythonScript] = useState(null);
  const [jobName, setJobName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Real job creation - integrates with backend API
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!pythonScript) {
      toast.error("Please upload a Python script file.");
      return;
    }

    if (!jobName.trim()) {
      toast.error("Please enter a job name.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Creating job...");

    try {
      // Call backend API to create job with multipart/form-data
      const result = await jobsService.createJob(
        jobName.trim(),
        activeTab, // job_type (simple or complex)
        pythonScript // file
      );

      toast.dismiss();

      if (result.success) {
        toast.success("Job created successfully!");
        
        // Redirect to job detail page using job_id from response
        router.push(`/job/${result.job_id}`);
      } else {
        toast.error(result.message || "Failed to create job");
        setIsSubmitting(false);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to create job. Please try again.");
      console.error("Job creation error:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Submit New Job</h2>
              <p className="mt-1 text-sm text-gray-600">
                Upload your Python script to create a new processing job
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <TabButton
                  active={activeTab === "simple"}
                  onClick={() => setActiveTab("simple")}
                >
                  Simple Job
                </TabButton>
                <TabButton
                  active={activeTab === "complex"}
                  onClick={() => setActiveTab("complex")}
                >
                  Complex Job
                </TabButton>
              </nav>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Job Name */}
              <div>
                <label htmlFor="jobName" className="block text-sm font-medium text-gray-700">
                  Job Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="jobName"
                  value={jobName}
                  onChange={(e) => setJobName(e.target.value)}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter a name for your job"
                  required
                />
              </div>

              {/* Python Script Upload */}
              <SimpleFileInput
                id="python-script-upload"
                label="Python Script File"
                acceptedFormats=".py"
                selectedFile={pythonScript}
                onFileSelect={setPythonScript}
                required
              />

              {/* Tab-specific content */}
              {activeTab === "simple" && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Simple Job</h4>
                  <p className="text-sm text-blue-700">
                    Upload a Python script that will be executed with default settings. 
                    You can add data files after the job is created.
                  </p>
                </div>
              )}

              {activeTab === "complex" && (
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-purple-900 mb-2">Complex Job</h4>
                  <p className="text-sm text-purple-700">
                    Upload a Python script with advanced configuration options. 
                    You can specify custom parameters and dependencies after the job is created.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
                >
                  {isSubmitting ? "Creating..." : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreateJobPage;
