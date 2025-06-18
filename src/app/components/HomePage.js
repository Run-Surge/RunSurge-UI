'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center animate-fade-in">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-primary-600">RunSurge</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            A platform for parallel work distribution.
          </p>

          {isAuthenticated ? (
            <div className="animate-slide-up">
              <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                  Welcome back, {user?.name}!
                </h2>
                <p className="text-gray-600 mb-6">
                  You are logged in as: <span className="font-semibold text-primary-600">{user?.role}</span>
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
                >
                  Go to Dashboard
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                href="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Get Started
              </Link>
              <Link
                href="/login"
                className="bg-white hover:bg-gray-50 text-primary-600 font-semibold py-4 px-8 rounded-lg border-2 border-primary-600 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}