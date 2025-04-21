"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { axiosPublic } from "@/lib/axios";
import { AUTH_ROUTES } from "@/routes/api-routes";

export function useAuth() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";
  const user = session?.user as Session["user"] & {
    role?: "customer" | "provider";
  };

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

      router.push("/");
      router.refresh();
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

      const response = await axiosPublic.post(
        AUTH_ROUTES.REGISTER,
        requestData
      );

      if (response.status === 201 || response.status === 200) {
        // Auto-login after successful registration
        return login(userData.email, userData.password);
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
        };
      };

      // Log more detailed error information
      if (errorResponse.response?.data) {
        console.error("Server response:", errorResponse.response.data);
      }

      return {
        success: false,
        error:
          errorResponse.response?.data?.message ||
          errorResponse.response?.data?.error ||
          "Registration failed",
      };
    }
  };

  const logout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
    router.refresh();
    return { success: true };
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
