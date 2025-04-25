"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { axiosProtected } from "@/lib/axios";
import { useAuth } from "@/hooks/useAuth";
import { formatCurrency, formatDate, getStatusColor } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the order interface
interface OrderDetails {
  _id: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
  };
  mealId: {
    _id: string;
    mealName: string;
    description?: string;
    imageUrl?: string;
  };
  deliveryAddress: string;
  phone: number;
  mealItemIds: string[];
  status: "pending" | "in progress" | "delivered" | "cancelled";
  scheduledDate: {
    startDate: string;
    endDate: string;
  };
  extraItems: string[];
  pricing: number;
  providerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("");

  // Fetch order details
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user?.id) {
      toast.error("You must be logged in as a provider to view order details");
      return;
    }

    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        // Note: API endpoint for getting a specific order needs to be implemented
        // This is a placeholder that would need to be adjusted based on your actual API
        const response = await axiosProtected.get(`/api/v1/orders/${id}`);

        if (response.data.success) {
          setOrder(response.data.data);
          setStatus(response.data.data.status);
        } else {
          toast.error("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
        toast.error("Error fetching order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id, user, isAuthenticated, authLoading]);

  // Update order status
  const handleStatusChange = async () => {
    if (!order) return;

    try {
      const response = await axiosProtected.patch(
        `/api/v1/orders/${order._id}`,
        {
          status,
        }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully");
        setOrder({
          ...order,
          status: status as
            | "pending"
            | "in progress"
            | "delivered"
            | "cancelled",
        });
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 mb-4 rounded-full bg-gray-300"></div>
          <p className="text-xl">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10">
        <p className="text-xl text-red-600">Order not found</p>
        <p className="text-muted-foreground">
          The order you&apos;re looking for could not be found.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Order Details</h1>
        <p className="text-muted-foreground">
          View and manage order #{order._id.substring(0, 8)}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="font-medium">Name</p>
                <p>{order.customerId?.name}</p>
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p>{order.customerId?.email}</p>
              </div>
              <div>
                <p className="font-medium">Phone</p>
                <p>{order.phone}</p>
              </div>
              <div>
                <p className="font-medium">Delivery Address</p>
                <p>{order.deliveryAddress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Information */}
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="font-medium">Order ID</p>
                <p>#{order._id}</p>
              </div>
              <div>
                <p className="font-medium">Date Placed</p>
                <p>{formatDate(order.createdAt)}</p>
              </div>
              <div>
                <p className="font-medium">Status</p>
                <Badge className={getStatusColor(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div>
                <p className="font-medium">Delivery Period</p>
                <p>
                  {formatDate(order.scheduledDate.startDate)} -{" "}
                  {formatDate(order.scheduledDate.endDate)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items and Total */}
        <Card>
          <CardHeader>
            <CardTitle>Meal Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-medium">Meal</p>
                <p>{order.mealId?.mealName}</p>
              </div>
              <div>
                <p className="font-medium">Portion Size</p>
                <p>{order.mealItemIds.join(", ")}</p>
              </div>
              {order.extraItems && order.extraItems.length > 0 && (
                <div>
                  <p className="font-medium">Extras</p>
                  <p>{order.extraItems.join(", ")}</p>
                </div>
              )}
              <div>
                <p className="font-medium">Total</p>
                <p className="text-xl font-bold">
                  {formatCurrency(order.pricing)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Update Order Status</CardTitle>
            <CardDescription>
              Change the current status of this order
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in progress">In Progress</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleStatusChange}>Update Status</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
