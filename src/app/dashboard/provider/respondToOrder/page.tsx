"use client";

import { useState } from 'react';
import { Check, X, FileEdit, Clock, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { orders as initialOrders, OrderStatus } from '@/lib/data';
import { formatDateTime, formatCurrency } from '@/lib/utils';

const statusFilters: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Modified', value: 'modified' },
  { label: 'Accepted', value: 'accepted' },
  { label: 'Declined', value: 'declined' },
  { label: 'Completed', value: 'completed' },
];

export default function ResponsesPage() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const getStatusConfig = (status: OrderStatus) => {
    const configs = {
      pending: {
        icon: <Clock className="h-4 w-4" />,
        class: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
      },
      accepted: {
        icon: <Check className="h-4 w-4" />,
        class: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      },
      declined: {
        icon: <X className="h-4 w-4" />,
        class: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      },
      modified: {
        icon: <FileEdit className="h-4 w-4" />,
        class: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      },
      completed: {
        icon: <Check className="h-4 w-4" />,
        class: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      },
      cancelled: {
        icon: <X className="h-4 w-4" />,
        class: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
      },
    };
    return configs[status];
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Order Responses</h2>
        <p className="text-muted-foreground">
          Manage and respond to customer orders efficiently.
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
        <div className="flex gap-2 md:w-[200px]">
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as OrderStatus | 'all')}
          >
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.map((order) => {
          const statusConfig = getStatusConfig(order.status);
          return (
            <Card key={order.id} className="transition-all hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  Order #{order.id}
                </CardTitle>
                <Badge className={`flex items-center gap-1 ${statusConfig.class}`}>
                  {statusConfig.icon}
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {order.customer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                      </div>
                    </div>
                    <div className="text-sm">
                      <p className="text-muted-foreground">Order placed:</p>
                      <p>{formatDateTime(order.createdAt)}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Items:</p>
                    <div className="space-y-1">
                      {order.meals.map((item) => (
                        <div key={item.meal.id} className="flex justify-between text-sm">
                          <span>{item.quantity}x {item.meal.name}</span>
                          <span className="font-medium">
                            {formatCurrency(item.meal.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-2 flex justify-between font-medium">
                      <span>Total</span>
                      <span>{formatCurrency(order.total)}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex gap-2">
                    <Button 
                      className="flex-1" 
                      variant={order.status === 'pending' ? 'default' : 'outline'}
                      asChild
                    >
                      <a href={`/dashboard/provider/orders/${order.id}`}>
                        View Details
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredOrders.length === 0 && (
        <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8 text-center">
          <h3 className="text-xl font-medium">No orders found</h3>
          <p className="mt-2 text-muted-foreground">
            {searchQuery || statusFilter !== 'all'
              ? "Try adjusting your filters or search query."
              : "No orders to display at the moment."}
          </p>
        </div>
      )}
    </div>
  );
}