"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import { axiosProtected } from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define order interface
interface Order {
  _id: string;
  customerId: string;
  mealId: {
    _id: string;
    mealName: string;
    description: string;
    imageUrl?: string;
  };
  providerId: string;
  providerData?: {
    _id: string;
    name: string;
  };
  deliveryAddress: string;
  phone: number;
  status: "pending" | "in progress" | "delivered" | "cancelled";
  scheduledDate: {
    startDate: string;
    endDate: string;
  };
  extraItems: string[];
  pricing: number;
  createdAt: string;
  numberOfDays?: number;
}

const TrackOrder = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [previousOrders, setPreviousOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "previous">("active");
  const [providerNames, setProviderNames] = useState<{ [key: string]: string }>(
    {}
  );

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      // Handle not authenticated
      return;
    }

    const fetchOrders = async () => {
      try {
        if (!user?.id) return;

        const response = await axiosProtected.get(
          `api/v1/customers/orders/${user.id}`
        );
        console.log("User ID: ", user.id);

        if (response.data.success) {
          const ordersData = response.data.data;
          setOrders(ordersData);

          // Categorize orders as active or previous
          const now = new Date();
          const active: Order[] = [];
          const previous: Order[] = [];

          ordersData.forEach((order: Order) => {
            const endDate = new Date(order.scheduledDate.endDate);

            // Order is previous if:
            // 1. Status is "delivered" or "cancelled", OR
            // 2. End date has passed (order duration finished)
            if (
              order.status === "delivered" ||
              order.status === "cancelled" ||
              endDate < now
            ) {
              previous.push(order);
            } else {
              active.push(order);
            }
          });

          setActiveOrders(active);
          setPreviousOrders(previous);

          // Extract unique provider IDs
          const providerIds = [
            ...new Set(ordersData.map((order: Order) => order.providerId)),
          ];
          console.log("Provider IDs: ", providerIds);
          // Fetch provider information for each provider ID
          const providerInfo: { [key: string]: string } = {};
          await Promise.all(
            providerIds.map(async (providerId) => {
              try {
                const providerResponse = await axiosProtected.get(
                  `api/v1/providers/user/${providerId}`
                );

                if (providerResponse.data.success) {
                  providerInfo[providerId as string] =
                    providerResponse.data.data.userId.name;
                }
              } catch (error) {
                console.error(`Error fetching provider ${providerId}:`, error);
              }
            })
          );

          setProviderNames(providerInfo);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated, authLoading]);

  // Function to cancel an order
  const handleCancelOrder = async (orderId: string) => {
    try {
      const response = await axiosProtected.patch(`api/v1/orders/${orderId}`, {
        status: "cancelled",
      });

      if (response.data.success) {
        // Update local state to reflect the change
        const updatedOrders = orders.map((order) =>
          order._id === orderId
            ? { ...order, status: "cancelled" as const }
            : order
        );
        setOrders(updatedOrders);

        // Move the cancelled order from active to previous
        const cancelledOrder = activeOrders.find(
          (order) => order._id === orderId
        );
        if (cancelledOrder) {
          const updatedCancelledOrder = {
            ...cancelledOrder,
            status: "cancelled" as const,
          };
          setActiveOrders(
            activeOrders.filter((order) => order._id !== orderId)
          );
          setPreviousOrders([updatedCancelledOrder, ...previousOrders]);
        }

        toast.success("Order cancelled successfully");
      } else {
        toast.error("Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    }
  };

  // Function to format date
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get appropriate status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "in progress":
        return "text-blue-600";
      case "delivered":
        return "text-green-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Get provider name for an order
  const getProviderName = (providerId: string) => {
    return providerNames[providerId] || "Unknown Provider";
  };

  // Check if order end date has passed
  const isOrderExpired = (endDateStr: string) => {
    const endDate = new Date(endDateStr);
    const now = new Date();
    return endDate < now;
  };

  return (
    <div className="container mx-auto py-4 px-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <h1 className="text-3xl font-bold text-center py-6 my-8 bg-red-800 text-white">
        Your Orders
      </h1>

      {/* Tabs for Active and Previous orders */}
      <div className="flex justify-center mb-8">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={`px-8 py-3 text-sm font-medium border border-gray-200 rounded-l-lg ${
              activeTab === "active"
                ? "bg-red-800 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Active Orders ({activeOrders.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("previous")}
            className={`px-8 py-3 text-sm font-medium border border-gray-200 rounded-r-lg ${
              activeTab === "previous"
                ? "bg-red-800 text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Previous Orders ({previousOrders.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 mb-4 rounded-full bg-gray-300"></div>
            <p className="text-xl">Loading your orders...</p>
          </div>
        </div>
      ) : activeTab === "active" && activeOrders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">
            No active orders found
          </h2>
          <p className="mt-2 text-gray-500">
            You don&apos;t have any active orders at the moment.
          </p>
        </div>
      ) : activeTab === "previous" && previousOrders.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-700">
            No previous orders found
          </h2>
          <p className="mt-2 text-gray-500">
            You don&apos;t have any completed or cancelled orders yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === "active" ? activeOrders : previousOrders).map(
            (order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col"
              >
                {/* Order Image */}
                <div className="relative h-48">
                  <Image
                    src={
                      order.mealId.imageUrl ||
                      "https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2940&auto=format&fit=crop"
                    }
                    alt={order.mealId.mealName}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Status Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm">
                    <span
                      className={`font-semibold uppercase text-sm ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                      {isOrderExpired(order.scheduledDate.endDate) &&
                        order.status !== "cancelled" &&
                        order.status !== "delivered" &&
                        " (Completed)"}
                    </span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-xl font-bold">{order.mealId.mealName}</h2>

                  <div className="mt-2 space-y-1 text-sm text-gray-600">
                    <p>
                      <span className="font-medium">Order Date:</span>{" "}
                      {formatDate(order.createdAt)}
                    </p>

                    <p>
                      <span className="font-medium">Delivery Period:</span>{" "}
                      {formatDate(order.scheduledDate.startDate)} to{" "}
                      {formatDate(order.scheduledDate.endDate)}
                    </p>

                    <p>
                      <span className="font-medium">Duration:</span>{" "}
                      {order.numberOfDays ||
                        Math.ceil(
                          (new Date(order.scheduledDate.endDate).getTime() -
                            new Date(order.scheduledDate.startDate).getTime()) /
                            (1000 * 60 * 60 * 24)
                        ) + 1}{" "}
                      days
                    </p>

                    {order.extraItems && order.extraItems.length > 0 && (
                      <p>
                        <span className="font-medium">Add-ons:</span>{" "}
                        {order.extraItems.join(", ")}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="font-bold text-lg">
                      Total: ${order.pricing.toFixed(2)}
                    </p>
                  </div>

                  {/* Delivery Information */}
                  <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                    <p className="font-medium">Delivery Address:</p>
                    <p className="text-gray-600">{order.deliveryAddress}</p>

                    <p className="font-medium mt-2">Provider:</p>
                    <p className="text-gray-600">
                      {getProviderName(order.providerId)}
                    </p>
                  </div>
                </div>

                {/* Actions - Cancel button for pending orders */}
                {activeTab === "active" && order.status === "pending" && (
                  <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                    <button
                      className="w-full py-2 px-4 bg-red-50 text-red-600 rounded-md border border-red-300 hover:bg-red-100 transition-colors font-medium text-sm"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
