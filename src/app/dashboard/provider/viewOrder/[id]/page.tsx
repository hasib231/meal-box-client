import { Order, orders } from '@/lib/data';
import { OrderDetails } from '@/components/orders/order-details';
import { notFound } from 'next/navigation';

interface OrderPageProps {
  params: {
    id: string;
  };
}

export default function OrderPage({ params }: OrderPageProps) {
  // Find the order with the matching ID
  const order = orders.find((order) => order.id === params.id);

  // If no order is found, show the 404 page
  if (!order) {
    notFound();
  }

  return <OrderDetails order={order} />;
}