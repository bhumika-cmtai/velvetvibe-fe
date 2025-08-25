"use client";
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { RootState } from '@/lib/redux/store';
import { mockOrders, Order } from '@/lib/data';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  Truck,
  FileDown,
} from 'lucide-react';
// import { mockOrders } from '@/lib/data';

// Tracking Info Component from your image
const TrackingCard = ({ trackingInfo }: { trackingInfo: Order['trackingInfo'] }) => {
  if (!trackingInfo) return null;

  return (
    <div className="rounded-lg bg-teal-50 p-6 text-teal-800">
      <h3 className="mb-3 text-lg font-bold text-teal-900">
        Live Tracking ({trackingInfo.provider})
      </h3>
      <div className="space-y-2 text-sm">
        <p><span className="font-semibold">Status:</span> {trackingInfo.status}</p>
        <p><span className="font-semibold">Location:</span> {trackingInfo.location}</p>
        <p><span className="font-semibold">Tracking #:</span> {trackingInfo.trackingNumber}</p>
        <p><span className="font-semibold">Last Updated:</span> {trackingInfo.lastUpdated}</p>
      </div>
    </div>
  );
};

export default function OrderDetailsPage() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // Find the specific order from our mock data
      const foundOrder = mockOrders.find(o => o.id === orderId) || null;
      setOrder(foundOrder);
      setIsLoading(false);
    }
  }, [isAuthenticated, router, orderId]);

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><p>Loading...</p></div>;
  }

  if (!order) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto flex items-center justify-center text-center">
                <div>
                    <h1 className="text-2xl font-bold">Order Not Found</h1>
                    <p className="text-gray-600">We couldn't find an order with that ID.</p>
                    <Button asChild className="mt-4">
                        <Link href="/account/orders">Back to My Orders</Link>
                    </Button>
                </div>
            </main>
            <Footer />
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="mb-6">
          <Link href="/account/orders" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
            <ArrowLeft size={16} className="mr-2" />
            Back to My Orders
          </Link>
          <h1 className="mt-2 text-3xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-500">Order #{order.id} &bull; Placed on {new Date(order.orderDate).toDateString()}</p>
        </div>
        
        <div className="space-y-8">
          {/* Tracking Section */}
          <TrackingCard trackingInfo={order.trackingInfo} />

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Button variant="outline" className="w-full justify-center py-6 text-base">
              <Truck size={18} className="mr-2" />
              Track Order
            </Button>
            <Button variant="outline" className="w-full justify-center py-6 text-base">
              <FileDown size={18} className="mr-2" />
              Download Invoice
            </Button>
          </div>

          {/* Items in this order */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Items in this order</h2>
            <div className="space-y-4 rounded-lg border bg-white p-4">
              {order.items.map(item => (
                <div key={item.productId} className="flex items-center space-x-4">
                  <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{item.price.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}