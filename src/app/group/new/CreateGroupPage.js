"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { groupService } from "../../../lib/groupService";

export default function CreateGroupPage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [numTasks, setNumTasks] = useState("");
  const [pythonFile, setPythonFile] = useState(null);
  const [aggregatorFile, setAggregatorFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.py')) {
      setPythonFile(file);
      setError("");
    } else {
      setPythonFile(null);
      setError("Please upload a valid Python (.py) file");
    }
  };

  const handleAggregatorFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.name.endsWith('.py')) {
      setAggregatorFile(file);
      setError("");
    } else {
      setAggregatorFile(null);
      setError("Please upload a valid Python (.py) file for the aggregator");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }
    
    if (!numTasks || isNaN(parseInt(numTasks)) || parseInt(numTasks) <= 0) {
      setError("Number of tasks must be a positive number");
      return;
    }
    
    if (!pythonFile) {
      setError("Python file is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Call the API to create a new group
      const result = await groupService.createGroup(groupName, parseInt(numTasks), pythonFile, aggregatorFile);
      
      if (result.success) {
        // Redirect to the group detail page
        router.push(`/group/${result.group_id}`);
      } else {
        if (result.message && result.message.includes("Vulnerable script detected")) {
          setError("Vulnerable script detected");
        } else {
          setError(result.message || "Failed to create group. Please try again.");
        }
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error creating group:", err);
      setError("Failed to create group. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create New Grouped Job</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Fill out the form below to create a new grouped job.
                </p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="groupName" className="block text-sm font-medium text-gray-700">
                    Group Name
                  </label>
                  <input
                    type="text"
                    id="groupName"
                    name="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter group name"
                  />
                </div>
                
                <div>
                  <label htmlFor="numTasks" className="block text-sm font-medium text-gray-700">
                    Number of Tasks
                  </label>
                  <input
                    type="number"
                    id="numTasks"
                    name="numTasks"
                    value={numTasks}
                    onChange={(e) => setNumTasks(e.target.value)}
                    min="1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter number of tasks"
                  />
                </div>
                
                <div>
                  <label htmlFor="pythonFile" className="block text-sm font-medium text-gray-700">
                    Python File
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      id="pythonFile"
                      name="pythonFile"
                      accept=".py"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Only .py files are accepted
                  </p>
                </div>
                
                <div>
                  <label htmlFor="aggregatorFile" className="block text-sm font-medium text-gray-700">
                    Choose Aggregator File
                  </label>
                  <div className="mt-1 flex items-center">
                    <input
                      type="file"
                      id="aggregatorFile"
                      name="aggregatorFile"
                      accept=".py"
                      onChange={handleAggregatorFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Only .py files are accepted
                  </p>
                </div>
                
                <div className="flex justify-end space-x-3">
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  >
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
                      isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Group"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 