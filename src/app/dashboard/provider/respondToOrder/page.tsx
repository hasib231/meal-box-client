"use client";

import { useState, useEffect } from "react";
import {
  ChevronRight,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Info,
  AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDateTime, formatCurrency, getStatusColor } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { axiosProtected } from "@/lib/axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define order interface
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

// Order status options
const statusOptions = [
  { label: "Pending", value: "pending" },
  { label: "In Progress", value: "in progress" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

// Status filter options
const statusFilters = [{ label: "All", value: "all" }, ...statusOptions];

export default function ResponsesPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
        toast.error("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, isAuthenticated, authLoading]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      const response = await axiosProtected.patch(
        `/api/v1/orders/${selectedOrder._id}`,
        {
          status: newStatus,
        }
      );

      if (response.data.success) {
        // Update local orders list with the new status
        const updatedOrders = orders.map((order) =>
          order._id === selectedOrder._id
            ? { ...order, status: newStatus as Order["status"] }
            : order
        );

        setOrders(updatedOrders);
        toast.success(`Order status updated to ${newStatus}`);
        setStatusDialogOpen(false);
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Error updating order status");
    } finally {
      setIsUpdating(false);
    }
  };

  // Status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "in progress":
        return <Info className="h-4 w-4 text-blue-600" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "cancelled":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const customerName = order.customerId?.name?.toLowerCase() || "";
    const customerEmail = order.customerId?.email?.toLowerCase() || "";
    const orderId = order._id || "";

    const matchesSearch =
      customerName.includes(searchQuery.toLowerCase()) ||
      customerEmail.includes(searchQuery.toLowerCase()) ||
      orderId.includes(searchQuery);

    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Handle open status dialog
  const openStatusDialog = (order: Order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusDialogOpen(true);
  };

  // Loading state
  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-[250px] bg-gray-200 animate-pulse rounded"></div>
        <div className="h-4 w-[300px] bg-gray-200 animate-pulse rounded"></div>
        <div className="flex flex-col gap-4 md:flex-row py-4">
          <div className="h-10 flex-1 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-[200px] bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="rounded-md border">
          <div className="h-10 bg-muted/40 px-4 py-2"></div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center px-4 py-4 border-t">
              <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse mr-2"></div>
              <div className="space-y-2 flex-1">
                <div className="h-4 w-[200px] bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 w-[150px] bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Respond to Orders</h1>
        <p className="text-muted-foreground">
          Update the status of customer orders and track their progress
        </p>
      </div>

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by customer name, email, or order ID..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 md:w-[200px]">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              {statusFilters.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Meal</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <div className="text-muted-foreground">No orders found</div>
                    <div className="text-sm text-muted-foreground">
                      {searchQuery || statusFilter !== "all"
                        ? "Try adjusting your filters"
                        : "No orders to display"}
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>#{order._id.substring(0, 8)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {order.customerId?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {order.customerId?.name || "Unknown"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.customerId?.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{formatDateTime(order.createdAt)}</TableCell>
                  <TableCell>
                    {order.mealId?.mealName || "Unknown Meal"}
                  </TableCell>
                  <TableCell>{formatCurrency(order.pricing)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(order.status)}
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openStatusDialog(order)}
                      >
                        Update Status
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <a href={`/dashboard/provider/viewOrder/${order._id}`}>
                          <ChevronRight className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order #{selectedOrder?._id.substring(0, 8)}
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Current Status</h3>
                <Badge
                  className={
                    selectedOrder ? getStatusColor(selectedOrder.status) : ""
                  }
                >
                  {selectedOrder?.status.charAt(0).toUpperCase() +
                    selectedOrder?.status.slice(1)}
                </Badge>
              </div>

              <div>
                <h3 className="font-medium mb-2">New Status</h3>
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem
                        key={status.value}
                        value={status.value}
                        disabled={selectedOrder?.status === status.value}
                      >
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              disabled={
                isUpdating || !newStatus || newStatus === selectedOrder?.status
              }
            >
              {isUpdating ? "Updating..." : "Update Status"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
