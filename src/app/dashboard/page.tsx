"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { CircleLoader } from "react-spinners";

const DashboardPage = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (user?.role === "provider") {
        router.push("/dashboard/provider/manageMenu");
      } else if (user?.role === "customer") {
        router.push("/dashboard/customer/selectMeals");
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh]">
      {isLoading ? (
        <div className="text-center">
          <CircleLoader color="#ef4444" />
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600">Redirecting to your dashboard...</p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
