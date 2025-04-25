"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderList, OrderListItem } from "@/components/orders/orderList";
import { Search } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { axiosProtected } from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define types
interface Order {
  _id: string;
  customerId: {
    _id: string;
    name: string;
    email: string;
  };
  mealId: {
    _id: string;
    mealName: string;
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

// Define the possible status filters
const statusFilters: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in progress" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function OrdersPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Fetch orders from API
  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated || !user?.id) {
      toast.error("You must be logged in as a provider to view orders");
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axiosProtected.get(
          `/api/v1/providers/orders/${user.id}`
        );

        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          toast.error("Failed to fetch orders");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        toast.error("Error fetching orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated, authLoading]);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    // Search filter
    const customerName = order.customerId?.name?.toLowerCase() || "";
    const customerEmail = order.customerId?.email?.toLowerCase() || "";
    const orderId = order._id || "";

    const matchesSearch =
      customerName.includes(searchQuery.toLowerCase()) ||
      customerEmail.includes(searchQuery.toLowerCase()) ||
      orderId.includes(searchQuery);

    // Status filter
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    // Date filter
    let matchesDate = true;
    const orderDate = new Date(order.createdAt);
    const now = new Date();

    if (dateFilter === "today") {
      matchesDate =
        orderDate.getDate() === now.getDate() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear();
    } else if (dateFilter === "thisWeek") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      matchesDate = orderDate >= startOfWeek;
    } else if (dateFilter === "thisMonth") {
      matchesDate =
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear();
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  // Convert backend orders to the format expected by OrderList component
  const formattedOrders: OrderListItem[] = filteredOrders.map((order) => ({
    id: order._id,
    customer: {
      name: order.customerId?.name || "Unknown Customer",
      email: order.customerId?.email || "No email",
    },
    status: order.status,
    total: order.pricing,
    createdAt: order.createdAt,
    deliveryAddress: order.deliveryAddress,
    meals: [
      {
        meal: {
          id: order.mealId?._id || "",
          name: order.mealId?.mealName || "Unknown Meal",
        },
        quantity: 1, // Quantity information is not in the API response
      },
    ],
  }));

  if (loading || authLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 mb-4 rounded-full bg-gray-300"></div>
          <p className="text-xl">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div>
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <p className="text-muted-foreground">
          View and manage customer orders.
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders, customers..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:w-2/5 lg:w-1/3">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value)}
          >
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {formattedOrders.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-xl">No orders found</p>
          <p className="text-muted-foreground">
            There are no orders matching your filters.
          </p>
        </div>
      ) : (
        <OrderList orders={formattedOrders} />
      )}
    </div>
  );
}
