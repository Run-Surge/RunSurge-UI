"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../app/context/AuthContext";
import DownloadToolkitButton from "./DownloadToolkitButton";
import { statisticsService } from "../lib/statisticsService";

export default function HomePage() {
  const { isAuthenticated, user, loading } = useAuth();
  const [statistics, setStatistics] = useState({ nodes: 0, earnings: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  // Fetch global statistics on component mount
  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setStatsLoading(true);
        const result = await statisticsService.getGlobalStatistics();
        if (result.success) {
          setStatistics(result.statistics);
        }
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  // Format currency with commas and 2 decimal places
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

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
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            A distributed parallel work platform that connects resources and opportunities. 
            Join our community and turn your computational power into earnings.
          </p>

          {/* Statistics Section */}
          <div className="max-w-4xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Contributions Stat */}
              <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all hover:scale-105">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-primary-100 p-3 mb-4">
                    <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">Total Active Contributions</h3>
                  {statsLoading ? (
                    <div className="animate-pulse h-8 w-24 bg-gray-200 rounded mt-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-primary-600 mt-2">{formatNumber(statistics.nodes)}</p>
                  )}
                </div>
              </div>

              {/* Lifetime Earnings Stat */}
              <div className="bg-white rounded-lg shadow-lg p-6 transform transition-all hover:scale-105">
                <div className="flex flex-col items-center">
                  <div className="rounded-full bg-green-100 p-3 mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700">Lifetime Earnings</h3>
                  {statsLoading ? (
                    <div className="animate-pulse h-8 w-32 bg-gray-200 rounded mt-2"></div>
                  ) : (
                    <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(statistics.earnings)}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

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

      {/* Footer Section */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center">
                <svg
                  className="h-8 w-8 text-primary-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 2l9 7-9 7-9-7 9-7zM12 22l9-7v-5l-9 7-9-7v5l9 7z"
                  />
                </svg>
                <span className="text-xl font-bold text-gray-900">RunSurge</span>
              </div>
              <p className="text-gray-600 mt-2">
                Connecting computing resources with opportunities
              </p>
            </div>
            
            <div className="flex flex-col items-center md:items-end">
              <div className="flex space-x-4 mb-4">
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/docs"
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Documentation
                </Link>
              </div>
              <p className="text-gray-500 text-sm">
                &copy; {new Date().getFullYear()} RunSurge. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
