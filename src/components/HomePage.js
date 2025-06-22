"use client";

import Link from "next/link";
import { useAuth } from "../app/context/AuthContext";
import DownloadToolkitButton from "./DownloadToolkitButton";

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center animate-fade-in">
          {/* Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">RunSurge</span>
          </h1>
          
          {/* Supporting Description */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            A distributed parallel work platform that connects resources and opportunities. 
            Join our community and turn your computational power into earnings.
          </p>

          {/* Call-to-Action Section */}
          <div className="animate-slide-up space-y-8">
            {/* Main CTA with DownloadToolkitButton as specified in README */}
            <div>
              <p className="text-lg text-gray-700 mb-6">
                Share your resources and start earning
              </p>
              <DownloadToolkitButton className="mb-8" />
            </div>
            
            {/* Authentication Section */}
            {isAuthenticated ? (
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Welcome back, {user?.name || user?.username}!
                </h2>
                <p className="text-gray-600 mb-6">
                  Ready to continue your work?
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[140px]"
                >
                  Get Started
                </Link>
                <Link
                  href="/login"
                  className="bg-white hover:bg-gray-50 text-primary-600 font-semibold py-4 px-8 rounded-lg border-2 border-primary-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 min-w-[140px]"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
