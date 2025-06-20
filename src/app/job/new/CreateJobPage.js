"use client";

import { useState } from "react";
import ProtectedRoute from "../../../components/ProtectedRoute"; // Adjust path if needed
import { useAuth } from "../../../app/context/AuthContext"; // 1. Import useAuth
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// A simpler, more "normal" looking file input field
const SimpleFileInput = ({
  id,
  label,
  acceptedFormats,
  selectedFile,
  onFileSelect,
}) => {
  const fileName = selectedFile ? selectedFile.name : "No file selected";

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 flex items-center">
        {/* The clickable button */}
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
        {/* The text showing the selected file name */}
        <span className="ml-3 text-sm text-gray-500 truncate">{fileName}</span>
      </div>
    </div>
  );
};

const CreateJobPage = () => {
  const { token } = useAuth(); // 2. Get the token
  const router = useRouter();

  const [pythonScript, setPythonScript] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- THIS IS THE CORRECTED SUBMISSION LOGIC ---
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Simple validation
    if (!pythonScript || !dataFile) {
      toast.error("Please upload both a Python script and a data file.");
      return;
    }

    setIsSubmitting(true);
    toast.loading("Uploading files and creating job...");

    // 3. Create a FormData object
    const formData = new FormData();
    formData.append("pythonScript", pythonScript); // The key "pythonScript" must match what the backend expects
    formData.append("dataFile", dataFile); // The key "dataFile" must also match

    try {
      // 4. Send the request with FormData
      const response = await fetch("/api/jobs", {
        // Assuming you use the same endpoint with POST
        method: "POST",
        headers: {
          // DO NOT set 'Content-Type'. The browser sets it automatically
          // to 'multipart/form-data' with the correct boundary.
          Authorization: `Bearer ${token}`,
        },
        body: formData, // The body is the FormData object
      });

      const result = await response.json();
      toast.dismiss();

      if (response.ok) {
        toast.success("Job created successfully!");
        // Redirect to the dashboard to see the new job
        router.push("/dashboard");
      } else {
        throw new Error(result.message || "Failed to create job.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.message);
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-lg rounded-xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create a New Job
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Upload your script and data to start a new processing job.
            </p>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* REPLACE the old file inputs */}
            <SimpleFileInput
              id="python-script-upload"
              label="Python Script (.py)"
              acceptedFormats=".py"
              selectedFile={pythonScript}
              onFileSelect={setPythonScript}
            />

            <SimpleFileInput
              id="data-file-upload"
              label="Data File (.csv)"
              acceptedFormats=".csv"
              selectedFile={dataFile}
              onFileSelect={setDataFile}
            />
            {/* END OF REPLACEMENT */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
              >
                {isSubmitting ? "Submitting..." : "Submit Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default CreateJobPage;
