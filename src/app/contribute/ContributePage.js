// /app/contribute/page.js

"use client";

import ProtectedRoute from "../components/ProtectedRoute";
// 1. Import your new reusable component
import DownloadToolkitButton from "../components/DownloadToolkitButton"; // Adjust path if needed

const ContributePage = () => {
  return (
    <ProtectedRoute>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-md max-w-lg w-full text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-900">
            Contributor Toolkit
          </h1>

          <p className="text-gray-600 mb-8 px-4">
            Download our official GUI toolkit to get started with the
            guidelines, assets, and best practices.
          </p>

          {/* 2. Use the component. It's much cleaner! */}
          <DownloadToolkitButton />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ContributePage;
