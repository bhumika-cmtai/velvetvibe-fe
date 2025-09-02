"use client";
import { useEffect, useRef } from 'react'; // Import useRef
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { RootState, AppDispatch } from '@/lib/redux/store';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, ShoppingBag, Home, Truck, FileDown } from 'lucide-react';

import { fetchSingleOrder, Order } from '@/lib/redux/slices/orderSlice';

// ===================================================================================
// 1. DEDICATED PRINT STYLESHEET COMPONENT
// This CSS hides everything on the page EXCEPT for the invoice when printing.
// ===================================================================================
const PrintStyles = () => (
  <style jsx global>{`
    @media print {
      .no-print { display: none !important; }
      .print-only { display: block !important; }
      #printable-invoice { position: absolute; left: 0; top: 0; width: 100%; }
      body {
        background-color: white !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
    }
  `}</style>
);

// ===================================================================================
// 2. VISUAL INVOICE COMPONENT
// Renders the invoice design.
// ===================================================================================
const InvoiceTemplate = ({ order }: { order: Order }) => {
  const companyDetails = {
    name: 'Gullnaaz',
    address: 'Shop No. 12, MC NO.181/225, Shri Ram Market, Gali Kunj, Dariba Kalan, Chandni Chowk, Delhi - 110006',
    gstin: '07BATPS3910H1ZC',
    contact: '+91 70117 06767',
    email: 'gullnaaz2025@.com',
    website: 'www.gullnaaz.com',
    logo: '/GULLNAAZ-BLACK-LOGO-PNG.png'
  };

  return (
    <div id="printable-invoice" className="hidden print-only">
        <div className="w-[800px] bg-white p-4 font-sans mx-auto">
            <div className="flex items-center justify-between bg-black text-white p-6">
                <div className="w-40">
                    <Image src={companyDetails.logo} alt="Gullnaaz Logo" width={150} height={42} className="brightness-0 invert"/>
                </div>
                <h1 className="text-4xl font-bold tracking-wider">INVOICE</h1>
            </div>
            <div className="grid grid-cols-2 gap-8 p-6 text-sm">
                <div>
                    <h2 className="font-bold text-lg mb-1">{companyDetails.name}</h2>
                    <p className="text-xs leading-snug">{companyDetails.address}</p>
                    <p className="text-xs">GSTIN: {companyDetails.gstin}</p>
                    <p className="text-xs">Contact: {companyDetails.contact}</p>
                    <p className="text-xs">Website: {companyDetails.website}</p>
                </div>
                <div className="text-right">
                    <p><span className="font-bold">Invoice #:</span> {order._id.slice(-8).toUpperCase()}</p>
                    <p><span className="font-bold">Order Date:</span> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-bold">Status:</span> {order.orderStatus}</p>
                </div>
            </div>
            <div className="px-6 pb-6 text-sm">
                <h3 className="font-bold mb-1">Billed To:</h3>
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}</p>
                <p>India</p>
            </div>
            <div className="px-6">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-black text-white">
                            <th className="p-2 text-left w-12">#</th>
                            <th className="p-2 text-left">Product</th>
                            <th className="p-2 text-right">Qty x Price</th>
                            <th className="p-2 text-right">Total (INR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems.map((item, index) => (
                            <tr key={index} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{item.name}</td>
                                <td className="p-2 text-right">{item.quantity} x ₹{item.price.toLocaleString()}</td>
                                <td className="p-2 text-right">₹{(item.quantity * item.price).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="grid grid-cols-2 p-6 mt-4">
                <div className="text-xs text-gray-600">
                    <p className="font-bold mb-1">Note:</p>
                    <p>This is a computer-generated invoice.</p>
                    <p>For support, contact us at {companyDetails.contact} or email {companyDetails.email}</p>
                </div>
                <div className="text-right space-y-1 text-sm">
                    <p><span className="font-semibold">Subtotal:</span> ₹{order.itemsPrice.toLocaleString()}</p>
                    <p><span className="font-semibold">Shipping Charges:</span> ₹{order.shippingPrice.toLocaleString()}</p>
                    <p><span className="font-semibold">Tax (Included):</span> ₹{order.taxPrice.toLocaleString()}</p>
                    <p className="font-bold text-base mt-2"><span className="font-bold">Grand Total:</span> ₹{order.totalPrice.toLocaleString()}</p>
                </div>
            </div>
            <div className="text-center p-6 mt-2">
                <p className="font-bold text-purple-800">Thank you for your business!</p>
                <p className="text-sm text-gray-500">{companyDetails.website}</p>
            </div>
        </div>
    </div>
  );
};

// =================================================================
// --- REUSABLE CARD COMPONENTS ---
// =================================================================
const ShippingInfoCard = ({ address }: { address: Order['shippingAddress'] }) => (
    <div>
      <h2 className="text-xl font-semibold mb-4 flex items-center"><Home className="mr-2 h-5 w-5" /> Shipping Address</h2>
      <div className="rounded-lg border bg-white p-6 text-sm">
        <div className="space-y-1">
          <p className="font-bold text-gray-800">{address.fullName}</p>
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
      <div className="flex justify-between">
        <span className="text-gray-600">Subtotal</span>
        <span className="font-medium">₹{order.itemsPrice.toLocaleString()}</span>
      </div>

      {order.discountAmount && order.discountAmount > 0 && (
          <div className="flex justify-between text-green-600">
              <span className="font-medium">Discount ({order.couponCode})</span>
              <span>-₹{order.discountAmount.toLocaleString()}</span>
          </div>
      )}
      
      <div className="flex justify-between">
        <span className="text-gray-600">Shipping</span>
        <span className="font-medium">₹{order.shippingPrice.toLocaleString()}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Tax</span>
        <span className="font-medium">₹{order.taxPrice.toLocaleString()}</span>
      </div>
      <hr className="my-2"/>
      <div className="flex justify-between font-bold text-base">
        <span>Total</span>
        <span>₹{order.totalPrice.toLocaleString()}</span>
      </div>
      <div className="flex justify-between text-xs text-gray-500 pt-2">
        <span>Payment Method</span>
        <span>{order.paymentMethod}</span>
      </div>
    </div>
  </div>
);

// =================================================================
// --- MAIN PAGE COMPONENT ---
// =================================================================
export default function UserOrderDetailsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const params = useParams();
  const orderId = params.orderId as string;

  const { currentOrder: order, loading, error } = useSelector((state: RootState) => state.order);
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    } else if (orderId) {
      dispatch(fetchSingleOrder(orderId));
    }
  }, [isAuthenticated, router, orderId, dispatch]);

  const handleDownloadInvoice = () => {
    window.print();
  };

  if (loading && !order) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="flex flex-col items-center justify-center text-center h-[70vh]">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
            <h1 className="mt-4 text-3xl font-bold">Order Not Found</h1>
            <p className="text-gray-600 mt-2">{error || "We couldn't find an order with that ID."}</p>
            <Button asChild className="mt-6">
                <Link href="/account/user/order-history">Back to Order History</Link>
            </Button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <PrintStyles />
      {order && <InvoiceTemplate order={order} />}

      <div className="min-h-screen bg-gray-50 no-print">
          <Navbar />
          <main className="container mx-auto max-w-4xl px-4 py-12">
              <div className="mb-8">
              <Link href="/account/user/order-history" className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                  <ArrowLeft size={16} className="mr-2" />
                  Back to Order History
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
                {/* --- ACTION BUTTONS ADDED HERE --- */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Button variant="outline" className="w-full justify-center py-6 text-base" disabled>
                        <Truck size={18} className="mr-2" />
                        Track Order (Coming Soon)
                    </Button>
                    <Button 
                        variant="outline" 
                        className="w-full justify-center py-6 text-base"
                        onClick={handleDownloadInvoice}
                    >
                        <FileDown size={18} className="mr-2" />
                        Download Invoice
                    </Button>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4">Items in your order ({order.orderItems.length})</h2>
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
                  <ShippingInfoCard address={order.shippingAddress} />
                  <OrderSummaryCard order={order} />
              </div>
              </div>
          </main>
          <Footer />
      </div>
    </>
  );
}