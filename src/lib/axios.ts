import axios from "axios";
import { getSession } from "next-auth/react";
// Explicitly import our custom Session type to fix the linter error
import type { Session } from "next-auth";

// Base URL from environment variable or fallback
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Public instance - for non-authenticated requests
export const axiosPublic = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Protected instance - for authenticated requests
export const axiosProtected = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to get the auth token
export const getAuthToken = async () => {
  const session = (await getSession()) as Session | null;
  return session?.accessToken;
};

// Add request interceptor to the protected instance
axiosProtected.interceptors.request.use(
  async (config) => {
    // Get the token
    const token = await getAuthToken();

    // If token exists, add to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for handling token expiration
axiosProtected.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 (Unauthorized) and we haven't tried refreshing yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // You could implement token refresh logic here if needed
      // For now, we'll just redirect to login
      window.location.href = "/login";
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
