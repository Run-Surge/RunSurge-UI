"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
  const [token, setToken] = useState(null); // 1. ADD TOKEN STATE
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // 2. MODIFY THIS useEffect
  useEffect(() => {
    // We'll check for an existing token first, like a real app would.
    const tokenFromCookie = Cookies.get("token");

    // This block is for development-only auto-login.
    // In a production environment, you would remove the `else` block.
    if (tokenFromCookie) {
      // If a token exists, use it.
      // For now, we'll trust the token and set a mock user.
      // In a real app, you would call your `checkAuth()` function here.
      const mockUser = {
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "user", // Let's use admin to test conditional UI
      };
      setToken(tokenFromCookie);
      setUser(mockUser);
      setLoading(false);
    } else {
      // --- THE NEW MAGIC FOR DEVELOPMENT ---
      // If no token, we create a fake one to simulate a logged-in state.
      const fakeJwt =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiSm9obiBEb2UiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjJ9.D_0pB3tSg9aV1FzW-b2M_jZ-5jJ4-rJ6b_rY3bK_jZc";
      const mockUser = {
        id: "123",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "user",
      };

      // Set the state AND the cookie, just like a real login
      setToken(fakeJwt);
      setUser(mockUser);
      Cookies.set("token", fakeJwt, { expires: 7 });

      setLoading(false);
    }
  }, []);

  // useEffect(() => {
  //   checkAuth();
  // }, []);

  const checkAuth = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        Cookies.remove("token");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      Cookies.remove("token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set("token", data.token, { expires: 7 });
        setUser(data.user);
        setToken(data.token); // Add this to keep state in sync
        toast.success("Login successful!");
        router.push("/dashboard");
        return { success: true };
      } else {
        toast.error(data.message || "Login failed");
        return { success: false, message: data.message };
      }
    } catch (error) {
      toast.error("Login failed");
      return { success: false, message: "Network error" };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Registration successful! Please login.");
        router.push("/login");
        return { success: true };
      } else {
        toast.error(data.message || "Registration failed");
        return { success: false, message: data.message };
      }
    } catch (error) {
      toast.error("Registration failed");
      return { success: false, message: "Network error" };
    }
  };

  const logout = () => {
    Cookies.remove("token");
    setUser(null);
    setToken(null); // Also clear the token from state
    toast.success("Logged out successfully");
    router.push("/");
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
