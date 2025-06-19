// /components/UserJobs.js

"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

// The StatusBadge is only used here, so it's good to keep it in this file.
const StatusBadge = ({ status }) => {
  const baseClasses =
    "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
  const statusClasses = {
    completed: "bg-green-100 text-green-800",
    in_progress: "bg-yellow-100 text-yellow-800",
    failed: "bg-red-100 text-red-800",
    default: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`${baseClasses} ${
        statusClasses[status] || statusClasses.default
      }`}
    >
      {status.replace("_", " ")}
    </span>
  );
};

const UserJobs = () => {
  // This component now manages its own state and logic.
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!token) {
        setIsLoadingJobs(false);
        return;
      }

      try {
        setIsLoadingJobs(true);
        const response = await fetch("/api/jobs", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch jobs.");
        }

        const data = await response.json();
        setJobs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoadingJobs(false);
      }
    };

    fetchJobs();
  }, [token]);

  // The JSX for the jobs list is moved here.
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Your Recent Jobs
      </h2>

      {isLoadingJobs && <p>Loading your jobs...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoadingJobs && !error && (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Job ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {jobs.length > 0 ? (
                jobs.map((job) => (
                  <tr key={job.job_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {job.job_id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <StatusBadge status={job.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    You have no jobs yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserJobs;
