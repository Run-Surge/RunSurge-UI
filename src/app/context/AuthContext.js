"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authService } from "../../lib/authService";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // For HTTP-only cookies, we directly try to get user data
      // If it fails, it means the user is not authenticated
      const result = await authService.getCurrentUser();
      
      if (result.success) {
        setUser(result.user);
        setToken(authService.getToken()); // Placeholder token
      } else {
        // User is not authenticated
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (usernameOrEmail, password) => {
    try {
      const result = await authService.login(usernameOrEmail, password);

      if (result.success) {
        setUser(result.user);
        setToken(result.token);
        toast.success("Login successful!");
        router.push("/dashboard");
        return { success: true };
      } else {
        toast.error(result.message || "Login failed");
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error("Login failed");
      return { success: false, message: "Network error" };
    }
  };

  const register = async (username, email, password) => {
    try {
      const result = await authService.register(username, email, password);

      if (result.success) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
        return { success: true };
      } else {
        toast.error(result.message || "Registration failed");
        return { success: false, message: result.message };
      }
    } catch (error) {
      toast.error("Registration failed");
      return { success: false, message: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setToken(null);
      toast.success("Logged out successfully");
      router.push("/");
    } catch (error) {
      // Even if logout API fails, clear local state
      setUser(null);
      setToken(null);
      toast.success("Logged out successfully");
      router.push("/");
    }
  };

  const value = {
    user,
    login,
    token, // Provide the token
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
