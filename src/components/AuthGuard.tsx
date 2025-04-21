"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ReactNode } from "react";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: "customer" | "provider";
  fallback?: ReactNode;
}

export default function AuthGuard({
  children,
  requiredRole,
  fallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, hasRole, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }

    // If authenticated but doesn't have the required role, show fallback or redirect
    if (
      !isLoading &&
      isAuthenticated &&
      requiredRole &&
      user?.role !== requiredRole
    ) {
      if (!fallback) {
        router.push("/");
      }
    }
  }, [isLoading, isAuthenticated, router, requiredRole, user?.role, fallback]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  // Authenticated but wrong role
  if (requiredRole && !hasRole(requiredRole)) {
    return fallback || null; // Show fallback or null (will redirect in useEffect)
  }

  // Authenticated and correct role
  return <>{children}</>;
}
