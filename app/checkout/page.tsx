"use client"
import React, { useEffect, useState, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

// --- UI Components & Hooks ---
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, CreditCard, Shield, MapPin, PlusCircle, CheckCircle, Loader2, XCircle, Home, Briefcase } from "lucide-react"

// --- Redux Imports ---
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/lib/redux/store"
import { fetchCart, clearLocalCartState, applyCoupon, removeCoupon } from "@/lib/redux/slices/cartSlice"
import { fetchCouponByName } from "@/lib/redux/slices/couponSlice"
import { fetchUserProfile, addUserAddress, NewAddressPayload, type Address } from "@/lib/redux/slices/userSlice"
import { placeCodOrder, createRazorpayOrder, verifyRazorpayPayment } from "@/lib/redux/slices/orderSlice"
import { selectIsAuthenticated } from "@/lib/redux/slices/authSlice"

// Custom hook to load external scripts like Razorpay
const useScript = (src: string) => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, [src]);
};

export default function CheckoutPage() {
  useScript("https://checkout.razorpay.com/v1/checkout.js");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  // --- Read all data directly from Redux slices ---
  const { items, subTotal, shippingCost, discountAmount, finalTotal, appliedCoupon, loading: cartLoading } = useSelector((state: RootState) => state.cart);
  const { user, addresses, status: userStatus } = useSelector((state: RootState) => state.user);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // --- Local UI State ---
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const initialAddressFormState = useMemo(() => ({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    street: "", city: "", state: "", postalCode: "", type: "Home" as const,
  }), [user]);

  const [newAddressFormData, setNewAddressFormData] = useState<NewAddressPayload>(initialAddressFormState);

  // Initial data fetch
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchUserProfile());
    }
  }, [dispatch, isAuthenticated]);

  // Set default selected address once addresses are loaded
  useEffect(() => {
    if (addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      setSelectedAddressId(defaultAddress._id);
    }
  }, [addresses, selectedAddressId]);
  
  // Pre-fill new address form when user data is available
  useEffect(() => {
    setNewAddressFormData(initialAddressFormState);
  }, [initialAddressFormState]);
  
  // Redirect if cart is empty after loading
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      toast({ title: "Your cart is empty!", description: "Redirecting you to the cart page..." });
      const timer = setTimeout(() => router.push('/cart'), 2000);
      return () => clearTimeout(timer);
    }
  }, [items.length, cartLoading, router, toast]);

  const handleNewAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewAddressFormData({ ...newAddressFormData, [e.target.name]: e.target.value });
  };
  
  const handleAddNewAddress = async () => {
    const requiredFields: (keyof NewAddressPayload)[] = ['fullName', 'phone', 'street', 'city', 'state', 'postalCode'];
    if (requiredFields.some(field => !newAddressFormData[field])) {
        toast({ title: "Please fill all required fields.", variant: "destructive" });
        return;
    }

    // `toast.promise` ki jagah `try...catch` ka use karein
    try {
        // API call ko await karein. .unwrap() error throw karega agar API fail hui.
        // Hum TypeScript ko bata rahe hain ki result 'Address[]' hoga.
        const addedAddresses: Address[] = await dispatch(addUserAddress(newAddressFormData)).unwrap();

        // Success logic
        toast({ title: "Address added successfully!" });
        setShowNewAddressForm(false);
        setNewAddressFormData(initialAddressFormState);
        if (addedAddresses && addedAddresses.length > 0) {
            // Naye add kiye gaye address ko select karein
            setSelectedAddressId(addedAddresses[addedAddresses.length - 1]._id);
        }

    } catch (err: any) {
        // Error logic: Agar .unwrap() fail hua, to yeh block chalega
        toast({ 
            title: "Failed to add address", 
            description: String(err), // Error ko string mein convert karein
            variant: "destructive" 
        });
    }
};

  const handleApplyDiscount = async () => {
    if (!couponCodeInput.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const validCoupon = await dispatch(fetchCouponByName(couponCodeInput.trim().toUpperCase())).unwrap();
      dispatch(applyCoupon(validCoupon));
      toast({ title: "Coupon Applied!" });
      setCouponCodeInput("");
    } catch (errorMessage: any) {
      toast({ title: "Invalid Coupon", description: String(errorMessage), variant: "destructive" });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveDiscount = () => {
    dispatch(removeCoupon());
    toast({ title: "Coupon Removed" });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAddressId) {
      toast({ title: "Please select a shipping address.", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    const orderDetails = { addressId: selectedAddressId, couponCode: appliedCoupon?.code };

    if (selectedPaymentMethod === 'cod') {
      try {
        const result = await dispatch(placeCodOrder(orderDetails)).unwrap();
        router.push(`/order-success?orderId=${result.order._id}`);
        dispatch(clearLocalCartState());
        toast({ title: "Order placed successfully!" });
      } catch (error: any) {
        toast({ title: "Order Failed", description: error, variant: "destructive" });
      } finally {
        setIsProcessing(false);
      }
    } else { // Razorpay Logic
      try {
        const razorpayOrder = await dispatch(createRazorpayOrder({ ...orderDetails, amount: finalTotal })).unwrap();
        
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: "INR",
          name: "Your Store Name",
          description: "Order Payment",
          order_id: razorpayOrder.orderId,
          handler: async function (response: any) {
            try {
              const result = await dispatch(verifyRazorpayPayment({
                ...orderDetails,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              })).unwrap();
              router.push(`/order-success?orderId=${result.order._id}`);
              dispatch(clearLocalCartState());
              toast({ title: "Payment Successful, Order Placed!" });
            } catch (verifyError: any) {
              toast({ title: "Payment Verification Failed", description: verifyError, variant: "destructive" });
            }
          },
          prefill: { name: user?.fullName, email: user?.email, contact: user?.phone },
          theme: { color: "#000000" }
        };
        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response: any) => {
            toast({ title: 'Payment Failed', description: response.error.description, variant: 'destructive' });
        });
        rzp.open();
      } catch (error: any) {
        toast({ title: "Payment Initiation Failed", description: error, variant: "destructive" });
      } finally {
        setIsProcessing(false);
      }
    }
  };
  
  if (cartLoading || userStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>
        <Footer />
      </div>
    );
  }
  
  if (items.length === 0 && !cartLoading) {
     return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="min-h-[60vh] flex items-center justify-center flex-col gap-4">
                <h2 className="text-2xl font-semibold">Your cart is empty.</h2>
                <p>Redirecting you back to the cart...</p>
            </div>
            <Footer />
        </div>
     );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-4 mb-8">
            <Link href="/cart" className="p-2 rounded-full hover:bg-gray-200"><ArrowLeft /></Link>
            <h1 className="text-3xl font-serif font-bold">Checkout</h1>
        </motion.div>

        <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Shipping and Payment */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">1. Shipping Information</h2>
              
              {addresses && addresses.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Select Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`relative p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedAddressId === address._id 
                            ? 'border-black ring-2 ring-black bg-gray-50' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedAddressId(address._id)}
                      >
                        {selectedAddressId === address._id && (
                          <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-black" />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold">{address.fullName}</p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{address.type}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-black text-white px-2 py-1 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.street}</p>
                          <p className="text-sm text-gray-600">{address.city}, {address.state} - {address.postalCode}</p>
                          <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2"><MapPin className="h-5 w-5 text-yellow-600" /><h3 className="font-medium text-yellow-800">No Shipping Address Found</h3></div>
                  <p className="text-sm text-yellow-700 mb-4">Please add a shipping address to continue.</p>
                </div>
              )}
              
              <div className="mb-8">
                <Button type="button" variant="outline" className="w-full" onClick={() => setShowNewAddressForm(!showNewAddressForm)}>
                  <PlusCircle className="h-5 w-5 mr-2" /> 
                  {showNewAddressForm ? "Cancel" : "Add New Address"}
                </Button>
                
                <AnimatePresence>
                  {showNewAddressForm && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-6 p-6 border rounded-2xl bg-gray-50 space-y-4 overflow-hidden">
                      <h4 className="font-medium text-lg mb-4">Add New Address</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label htmlFor="fullName">Full Name *</Label><Input id="fullName" name="fullName" value={newAddressFormData.fullName} onChange={handleNewAddressInputChange} /></div>
                        <div className="space-y-2"><Label htmlFor="phone">Phone *</Label><Input id="phone" name="phone" type="tel" value={newAddressFormData.phone} onChange={handleNewAddressInputChange} /></div>
                      </div>
                      <div className="space-y-2"><Label htmlFor="street">Street Address *</Label><Input id="street" name="street" value={newAddressFormData.street} onChange={handleNewAddressInputChange} /></div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label htmlFor="state">State *</Label><Input id="state" name="state" value={newAddressFormData.state} onChange={handleNewAddressInputChange} /></div>
                        <div className="space-y-2"><Label htmlFor="city">City *</Label><Input id="city" name="city" value={newAddressFormData.city} onChange={handleNewAddressInputChange} /></div>
                        <div className="space-y-2"><Label htmlFor="postalCode">PIN Code *</Label><Input id="postalCode" name="postalCode" value={newAddressFormData.postalCode} onChange={handleNewAddressInputChange} /></div>
                      </div>
                      <div className="space-y-2 pt-2">
                        <Label>Address Type</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Button type="button" variant={newAddressFormData.type === 'Home' ? 'default' : 'outline'} onClick={() => handleNewAddressInputChange({ target: { name: 'type', value: 'Home' } } as React.ChangeEvent<HTMLSelectElement>)} className="flex items-center justify-center py-6"><Home className="mr-2 h-4 w-4" />Home</Button>
                            <Button type="button" variant={newAddressFormData.type === 'Work' ? 'default' : 'outline'} onClick={() => handleNewAddressInputChange({ target: { name: 'type', value: 'Work' } } as React.ChangeEvent<HTMLSelectElement>)} className="flex items-center justify-center py-6"><Briefcase className="mr-2 h-4 w-4" />Work</Button>
                        </div>
                      </div>
                      <Button type="button" className="w-full mt-4" onClick={handleAddNewAddress}>Save Address</Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="pt-6 border-t">
                <h2 className="text-xl font-semibold mb-6">2. Payment Method</h2>
                <div className="space-y-4">
                  <div onClick={() => setSelectedPaymentMethod('cod')} className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${ selectedPaymentMethod === 'cod' ? 'border-black ring-2 ring-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                      <CreditCard className="h-5 w-5 text-gray-500" /><span className="flex-1 font-medium">Cash on Delivery (COD)</span>{selectedPaymentMethod === 'cod' && <CheckCircle className="h-5 w-5 text-black" />}
                  </div>
                  <div onClick={() => setSelectedPaymentMethod('razorpay')} className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${ selectedPaymentMethod === 'razorpay' ? 'border-black ring-2 ring-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'}`}>
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">R</div><span className="flex-1 font-medium">Pay Online (Razorpay)</span>{selectedPaymentMethod === 'razorpay' && <CheckCircle className="h-5 w-5 text-black" />}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Order Summary */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl p-8 border shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={item.product.images[0]} alt={item.product.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium truncate">{item.product.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <hr className="my-6" />
              
              <div className="space-y-3 mb-6">
                <Label>Discount Code</Label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium">Code "{appliedCoupon.code}" applied</span>
                    <Button onClick={handleRemoveDiscount} variant="ghost" size="icon" className="h-6 w-6 text-red-500"><XCircle className="h-4 w-4" /></Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input placeholder="Enter code" value={couponCodeInput} onChange={(e) => setCouponCodeInput(e.target.value)} disabled={isApplyingCoupon} />
                    <Button type="button" onClick={handleApplyDiscount} variant="outline" disabled={isApplyingCoupon}>
                      {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-gray-600">Subtotal</span><span>₹{subTotal.toLocaleString()}</span></div>
                {discountAmount > 0 && (<div className="flex justify-between text-green-600"><span>Discount</span><span>- ₹{discountAmount.toLocaleString()}</span></div>)}
                <div className="flex justify-between"><span className="text-gray-600">Shipping</span><span className={shippingCost === 0 ? 'text-green-600' : ''}>{shippingCost === 0 ? "FREE" : `₹${shippingCost.toLocaleString()}`}</span></div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-bold"><span>Total</span><span className="text-black">₹{finalTotal.toLocaleString()}</span></div>
              </div>
              
              <Button type="submit" disabled={isProcessing || !selectedAddressId} className="w-full py-3 h-12 mt-6 font-semibold text-base bg-black text-white hover:bg-gray-800">
                {isProcessing ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>) : (`Place Order - ₹${finalTotal.toLocaleString()}`)}
              </Button>
              
              <div className="flex items-center justify-center space-x-2 mt-3 text-sm text-gray-600"><Shield className="h-4 w-4" /><span>Secure SSL Encrypted Payment</span></div>
            </div>
          </motion.div>
        </form>
      </main>
      <Footer />
    </div>
  )
}