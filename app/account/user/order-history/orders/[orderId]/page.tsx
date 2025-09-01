"use client";
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { RootState, AppDispatch } from '@/lib/redux/store';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ShoppingBag, Loader2, Save, User, Home } from 'lucide-react';
import { toast } from "sonner";
import { Navbar } from '@/components/Navbar'; // Assuming you have a Navbar for admin
import { Footer } from '@/components/Footer'; // Assuming you have a Footer for admin

// --- Import the correct admin-specific action and other necessary types/actions ---
import {
  fetchSingleOrderAsAdmin, // Use the new admin-specific thunk
  updateOrderStatus,
  Order,
} from '@/lib/redux/slices/orderSlice';

// =================================================================
// --- REUSABLE CARD COMPONENTS (Admin Version) ---
// =================================================================

const CustomerInfoCard = ({ user, address }: { user: Order['user'], address: Order['shippingAddress'] }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4 flex items-center"><User className="mr-2 h-5 w-5" /> Customer Details</h2>
    <div className="rounded-lg border bg-white p-6 text-sm">
      <p className="font-bold text-gray-800">{user.fullName}</p>
      <p className="text-gray-600">{user.email || 'No email provided'}</p>
      <hr className="my-3"/>
      <div className="space-y-1">
        <p className="font-semibold text-gray-700">Shipping Address</p>
        <p className="text-gray-600">{address.street}</p>
        <p className="text-gray-600">{address.city}, {address.state} - {address.postalCode}</p>
        <p className="text-gray-600 mt-2">Phone: {address.phone}</p>
      </div>
    </div>
  </div>
);

const OrderSummaryCard = ({ order }: { order: Order }) => (
  <div>
    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
    <div className="rounded-lg border bg-white p-6 space-y-3 text-sm">
      <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span className="font-medium">₹{order.itemsPrice.toLocaleString()}</span></div>
      <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className="font-medium">₹{order.shippingPrice.toLocaleString()}</span></div>
      <div className="flex justify-between"><span className="text-gray-600">Tax</span><span className="font-medium">₹{order.taxPrice.toLocaleString()}</span></div>
      <hr className="my-2"/>
      <div className="flex justify-between font-bold text-base"><span>Total</span><span>₹{order.totalPrice.toLocaleString()}</span></div>
      <div className="flex justify-between text-xs text-gray-500 pt-2"><span>Payment Method</span><span>{order.paymentMethod}</span></div>
    </div>
  </div>
);


// =================================================================
// --- MAIN PAGE COMPONENT ---
// =================================================================
export default function AdminOrderDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const { currentOrder: order, loading, error } = useSelector((state: RootState) => state.order);
  const { user: adminUser } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (adminUser?.role !== 'admin') {
      router.push('/login');
    } else if (orderId) {
      // --- THE FIX IS HERE: Dispatch the admin-specific action ---
      dispatch(fetchSingleOrderAsAdmin(orderId));
    }
  }, [adminUser, router, orderId, dispatch]);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.orderStatus);
    }
  }, [order]);

  const handleStatusUpdate = async () => {
    if (!order || selectedStatus === order.orderStatus) {
      toast.info("No changes to save.");
      return;
    }
    setIsUpdating(true);
    try {
      await dispatch(updateOrderStatus({ orderId: order._id, status: selectedStatus })).unwrap();
      toast.success("Order status has been updated successfully.");
    } catch (err: any) {
      toast.error(err || "Failed to update the order status.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading && !order) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex flex-col items-center justify-center text-center h-[70vh]">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
            <h1 className="mt-4 text-3xl font-bold font-serif">Order Not Found</h1>
            <p className="text-gray-600 mt-2">{error || "We couldn't find an order with that ID."}</p>
            <Button asChild className="mt-6">
                <Link href="/admin/orders">Back to All Orders</Link>
            </Button>
        </main>
        <Footer />
      </div>
    );
  }

  const orderStatuses = ["Pending", "Paid", "Processing", "Shipped", "Delivered", "Cancelled"];

  return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto max-w-4xl px-4 py-12">
            <div className="mb-8">
            <Link href="/admin/orders" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                <ArrowLeft size={16} className="mr-2" />
                Back to All Orders
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2">
                <div>
                <h1 className="text-3xl font-bold text-gray-900">Order #{order._id}</h1>
                <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <Badge className="mt-2 sm:mt-0 text-base">{order.orderStatus}</Badge>
            </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
                <div className="rounded-lg border bg-white p-6">
                    <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
                    <div className="flex items-center gap-4">
                        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                            <SelectTrigger><SelectValue placeholder="Select a status..." /></SelectTrigger>
                            <SelectContent>
                                {orderStatuses.map(status => (
                                    <SelectItem key={status} value={status}>{status}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleStatusUpdate} disabled={isUpdating || selectedStatus === order.orderStatus}>
                            {isUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Save Status
                        </Button>
                    </div>
                </div>

                <div>
                <h2 className="text-xl font-semibold mb-4">Items in this order ({order.orderItems.length})</h2>
                <div className="space-y-4 rounded-lg border bg-white">
                    {order.orderItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-4 p-4 border-b last:border-b-0">
                        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                        <Image 
                            src={item.product?.images?.[0] || '/placeholder.svg'} 
                            alt={item.name} 
                            fill 
                            className="object-cover" 
                        />
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

            <div className="lg:col-span-1 space-y-8">
                <CustomerInfoCard user={order.user} address={order.shippingAddress} />
                <OrderSummaryCard order={order} />
            </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}