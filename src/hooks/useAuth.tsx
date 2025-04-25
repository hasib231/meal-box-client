"use client";

import { useSession, signIn, signOut, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { axiosPublic } from "@/lib/axios";
import { AUTH_ROUTES } from "@/routes/api-routes";
import { useEffect } from "react";

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user as Session["user"] & {
    role?: "customer" | "provider";
  };

  // Force client-side route revalidation when session changes
  useEffect(() => {
    // This will trigger a rerender when session status changes
  }, [status]);

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        return { success: false, error: "Invalid email or password" };
      }

      // Get the session to access the token
      const session = await getSession();

      // Store the access token in localStorage
      if (session?.accessToken) {
        localStorage.setItem("accessToken", session.accessToken);
        console.log("Access token stored in localStorage");
      }

      // Update session and force a complete refresh
      await update();

      // Use router.replace instead of push for a cleaner navigation
      router.replace("/");

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "An unexpected error occurred" };
    }
  };
  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    role: "customer" | "provider";
  }) => {
    try {
      console.log("Registering with data:", userData);

      // Create a new request object that matches the backend schema
      const requestData = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.password, // Add confirmPassword
        role: userData.role,
        address: "Default Address", // Add required address field
      };

      console.log("Sending registration request with data:", requestData);

      const response = await axiosPublic.post(
        AUTH_ROUTES.REGISTER,
        requestData
      );

      console.log("Registration response:", response.data);

      if (response.status === 201 || response.status === 200) {
        // Wait for a moment before attempting login to ensure the user is fully registered
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Auto-login after successful registration
        console.log("Registration successful, attempting login");
        const loginResult = await login(userData.email, userData.password);

        if (!loginResult.success) {
          console.error(
            "Auto-login after registration failed:",
            loginResult.error
          );
          return {
            success: false,
            error:
              "Registration successful but auto-login failed. Please try logging in manually.",
          };
        }

        return { success: true };
      }

      return { success: false, error: "Registration failed" };
    } catch (error: unknown) {
      console.error("Register error:", error);
      const errorResponse = error as {
        response?: {
          data?: {
            message?: string;
            error?: string;
            errors?: Record<string, string[]>;
            success?: boolean;
          };
          status?: number;
        };
      };

      // Log more detailed error information
      if (errorResponse.response?.data) {
        console.error("Server response data:", errorResponse.response.data);
        console.error(
          "Server response status:",
          errorResponse.response?.status
        );
      }

      return {
        success: false,
        error:
          errorResponse.response?.data?.message ||
          errorResponse.response?.data?.error ||
          "Registration failed. Please try again later.",
      };
    }
  };

  const logout = async () => {
    try {
      // First clear any local storage items
      localStorage.removeItem("accessToken");

      // Sign out without redirect and wait for it to complete
      await signOut({
        redirect: false,
        callbackUrl: "/login",
      });

      // Force a client-side navigation to the login page
      window.location.href = "/login";

      return { success: true };
    } catch (error) {
      console.error("Logout error:", error);
      return { success: false, error: "An error occurred during logout" };
    }
  };

  const hasRole = (role: "customer" | "provider") => {
    return user?.role === role;
  };

  return {
    session,
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
  };
}

export default useAuth;
