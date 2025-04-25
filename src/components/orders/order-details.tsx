"use client";

import { Order } from "@/lib/data";
import { formatCurrency, formatDateTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div className="container py-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Order #{order.id}</h1>
        <Badge className="text-sm py-1">{order.status}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{order.customer.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{order.customer.name}</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer.email}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Delivery Address</p>
              <p className="text-sm text-muted-foreground">
                {order.deliveryAddress}
              </p>
            </div>
            {order.customer.phone && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Phone</p>
                <p className="text-sm text-muted-foreground">
                  {order.customer.phone}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Date Placed</p>
              <p className="text-sm text-muted-foreground">
                {formatDateTime(order.createdAt)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Payment Status</p>
              <Badge variant="outline">{order.paymentStatus}</Badge>
            </div>
            {order.deliveryTime && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Delivery Time</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(order.deliveryTime)}
                </p>
              </div>
            )}
            <div className="space-y-1">
              <p className="text-sm font-medium">Total Amount</p>
              <p className="text-xl font-bold">{formatCurrency(order.total)}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Ordered Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.meals.map((item) => (
              <div
                key={`${item.meal.id}-${item.quantity}`}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{item.meal.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.meal.description.substring(0, 100)}
                    {item.meal.description.length > 100 ? "..." : ""}
                  </p>
                  {item.specialInstructions && (
                    <p className="text-sm mt-1 italic">
                      Note: {item.specialInstructions}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-sm">x{item.quantity}</p>
                  <p className="font-medium">
                    {formatCurrency(item.meal.price * item.quantity)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
