
  "use client";
  
  import { useState, useEffect } from 'react';
  import { useSelector } from 'react-redux';
  import { useRouter } from 'next/navigation';
  import Link from 'next/link';
  import Image from 'next/image';
  import type { RootState } from '@/lib/redux/store';
  import { mockOrders, Order } from '@/lib/data'; // Import mock data
  import { Navbar } from '@/components/Navbar';
  import { Footer } from '@/components/Footer';
  import { Button } from '@/components/ui/button';
  import {
    CircleCheck, // Delivered
    RefreshCw,   // Processing
    Truck,       // Shipped
    XCircle,     // Cancelled
  } from 'lucide-react';
  
  // A map to associate status with an icon and color
  const statusStyles = {
    Delivered: { icon: CircleCheck, color: 'text-green-600' },
    Processing: { icon: RefreshCw, color: 'text-yellow-600' },
    Shipped: { icon: Truck, color: 'text-blue-600' },
    Cancelled: { icon: XCircle, color: 'text-red-600' },
  };
  
  // Component to display a single order card
  const OrderCard = ({ order }: { order: Order }) => {
    const StatusIcon = statusStyles[order.status].icon;
    const statusColor = statusStyles[order.status].color;
  
    return (
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b bg-gray-50 p-4">
          <div>
            <p className="text-sm font-bold text-gray-800">Order #{order.id}</p>
            <p className="text-xs text-gray-500">Placed on: {new Date(order.orderDate).toDateString()}</p>
          </div>
          <div className={`flex items-center text-sm font-semibold ${statusColor}`}>
            <StatusIcon size={16} className="mr-2" />
            {order.status}
          </div>
        </div>
  
        {/* Card Body */}
        <div className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-4">
              {order.items.slice(0, 3).map(item => (
                <div key={item.productId} className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-white">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
              ))}
            </div>
            <div className="flex-grow">
              <h3 className="font-semibold text-gray-800">
                {order.items[0].name}
                {order.items.length > 1 && ` + ${order.items.length - 1} more item(s)`}
              </h3>
              <p className="text-sm text-gray-500">Total: <span className="font-bold text-gray-900">₹{order.totalAmount.toLocaleString()}</span></p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/account/user/order-history/orders/${order.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  export default function MyOrdersPage() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
  
    // For this static example, we'll just use the mockOrders.
    // In a real app, you would fetch orders for the logged-in user here.
    const orders = mockOrders; 
  
    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      } else {
        setIsLoading(false);
      }
    }, [isAuthenticated, router]);
  
    if (isLoading) {
      return <div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>;
    }
  
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto max-w-4xl px-4 py-12">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">My Orders</h1>
          
          {orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          ) : (
            <div className="text-center rounded-lg border-2 border-dashed border-gray-300 p-12">
              <h2 className="text-xl font-medium text-gray-900">No orders yet</h2>
              <p className="mt-1 text-sm text-gray-500">Looks like you haven't made any purchases with us.</p>
              <Button asChild className="mt-6">
                <Link href="/">Start Shopping</Link>
              </Button>
            </div>
          )}
        </main>
        <Footer />
      </div>
    );
  }