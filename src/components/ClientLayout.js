"use client";

import { useAuth } from "../app/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DownloadToolkitButton from "./DownloadToolkitButton"; // Adjust path if needed

const ClientLayout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <svg
                  className="h-8 w-8 text-primary-600"
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
                {/* <div>
                  <img
                    src="/GP_Logo.png"
                    alt="GP Logo"
                    width={64}
                    height={64}
                  />
                </div> */}
                <span className="text-xl font-bold text-gray-900">
                  RunSurge
                </span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <>
                  <Link
                    href="/dashboard"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      pathname === "/dashboard"
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-700 hover:text-primary-600 hover:bg-gray-100"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-700">
                      Welcome, {user?.name}
                    </span>
                    <button
                      onClick={logout}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              )}
              {!isAuthenticated && (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default ClientLayout;
