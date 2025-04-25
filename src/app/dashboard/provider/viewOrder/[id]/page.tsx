import { Order } from "@/lib/data";

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  return (
    <div>
      <h2>Order Details</h2>
      <p>Order ID: {order.id}</p>
      {/* Add more order details as needed */}
    </div>
  );
}
