"use client"
import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Shield, MapPin, PlusCircle, CheckCircle, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// --- REDUX IMPORTS ---
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/lib/redux/store"
import { fetchCart, clearCart, applyCoupon, removeCoupon } from "@/lib/redux/slices/cartSlice"
import { fetchCouponByName } from "@/lib/redux/slices/couponSlice"
import { fetchUserProfile, addUserAddress, NewAddressPayload } from "@/lib/redux/slices/userSlice"

export default function CheckoutPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  // --- Select all necessary state from Redux ---
  const {
    items,
    totalItems,
    subTotal,
    shippingCost,
    discountAmount,
    finalTotal,
    appliedCoupon,
    loading: cartLoading,
    error: cartError
  } = useSelector((state: RootState) => state.cart);

  const { user, addresses, status: userStatus, error: userError } = useSelector(
    (state: RootState) => state.user
  );

  // --- Local state for UI interactions ---
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [showNewAddressForm, setShowNewAddressForm] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cod' | 'razorpay'>('cod');
  const [isProcessing, setIsProcessing] = useState(false)
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [newAddressFormData, setNewAddressFormData] = useState<NewAddressPayload>({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    type: "Home",
  });

  // Fetch initial data on component mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await dispatch(fetchCart());
        await dispatch(fetchUserProfile());
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };
    fetchInitialData();
  }, [dispatch])

  // Set default selected address and pre-fill new address form with user data
  useEffect(() => {
    console.log('Current addresses:', addresses);
    console.log('Current user:', user);
    
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];
      console.log('Setting default address:', defaultAddress);
      setSelectedAddressId(defaultAddress._id);
    }
    
    if (user && (!newAddressFormData.fullName || !newAddressFormData.phone)) {
      setNewAddressFormData(prev => ({
        ...prev,
        fullName: user.fullName || "",
        phone: user.phone || "",
      }));
    }
  }, [addresses, selectedAddressId, user]);

  // --- Handlers ---
  const handleNewAddressInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewAddressFormData({
      ...newAddressFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddNewAddress = async () => {
    // Basic validation
    const requiredFields = ['fullName', 'phone', 'street', 'city', 'state', 'postalCode'];
    const missingFields = requiredFields.filter(field => !newAddressFormData[field as keyof NewAddressPayload]);
    
    if (missingFields.length > 0) {
        toast({ 
          title: "Missing Information", 
          description: `Please fill in: ${missingFields.join(', ')}`,
          variant: "destructive" 
        });
        return;
    }
    
    try {
        const addedAddresses = await dispatch(addUserAddress(newAddressFormData)).unwrap();
        toast({ title: "Address added successfully" });
        setShowNewAddressForm(false);
        
        // Reset form
        setNewAddressFormData({
          fullName: user?.fullName || "",
          phone: user?.phone || "",
          street: "",
          city: "",
          state: "",
          postalCode: "",
          type: "Home",
        });
        
        // Automatically select the newly added address
        if (addedAddresses && addedAddresses.length > 0) {
          const newAddress = addedAddresses[addedAddresses.length - 1];
          setSelectedAddressId(newAddress._id);
        }
    } catch (err: any) {
        toast({ 
          title: "Failed to add address", 
          description: typeof err === 'string' ? err : 'An error occurred while adding the address',
          variant: "destructive" 
        });
    }
  }

  const handleApplyDiscount = async () => {
    if (!couponCode.trim()) {
      toast({ title: "Please enter a coupon code.", variant: "destructive" });
      return;
    }
    setIsApplyingCoupon(true);
    try {
      const validCoupon = await dispatch(fetchCouponByName(couponCode)).unwrap();
      dispatch(applyCoupon(validCoupon));
      const discountValue = subTotal * (validCoupon.discountPercentage / 100);
      toast({
        title: "Coupon Applied!",
        description: `You saved ₹${discountValue.toLocaleString()} with code "${validCoupon.code}".`,
      });
      setCouponCode("");
    } catch (errorMessage: any) {
      toast({
        title: "Invalid Coupon",
        description: String(errorMessage),
        variant: "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveDiscount = () => {
    dispatch(removeCoupon());
    toast({
      title: "Coupon Removed",
      description: "The discount has been removed from your cart.",
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
        toast({ title: "Your cart is empty.", variant: "destructive" });
        return;
    }
    if (!selectedAddressId) {
        toast({ title: "Please select a shipping address.", variant: "destructive" });
        return;
    }

    setIsProcessing(true);
    const finalShippingAddress = addresses.find(addr => addr._id === selectedAddressId);

    const orderPayload = {
      orderItems: items.map(item => ({ product: item.product._id, quantity: item.quantity })),
      shippingAddress: finalShippingAddress,
      totalPrice: finalTotal,
      paymentMethod: selectedPaymentMethod,
      appliedCoupon: appliedCoupon?.code || null,
    };

    console.log("Final Order Payload:", orderPayload);

    try {
      // Simulate order processing
      if (selectedPaymentMethod === 'cod') {
          await new Promise((resolve) => setTimeout(resolve, 2000));
          toast({ title: "Order placed successfully!" });
          dispatch(clearCart());
          setIsProcessing(false);
          window.location.href = "/order-success";
      } else {
          toast({ title: "Redirecting to payment...", description: "Razorpay integration placeholder." });
          setIsProcessing(false);
      }
    } catch (error) {
      toast({ 
        title: "Order failed", 
        description: "Something went wrong. Please try again.",
        variant: "destructive" 
      });
      setIsProcessing(false);
    }
  }

  // --- Render Logic ---
  if (cartLoading || userStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }
  
  if (items.length === 0 && !cartLoading) {
     if (typeof window !== 'undefined') { 
       window.location.href = '/cart'; 
     }
     return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center space-x-4 mb-8">
            <Link href="/cart">
                <Button variant="ghost" size="icon" className="rounded-full"><ArrowLeft /></Button>
            </Link>
            <h1 className="text-2xl font-serif font-bold">Checkout</h1>
        </motion.div>

        <form onSubmit={handleSubmitOrder} className="grid lg:grid-cols-2 gap-12">
          {/* Left Column: Shipping and Payment */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">1. Shipping Information</h2>
              
              {/* Debug info - remove in production */}
              {/* {process.env.NODE_ENV === 'development' && (
                <div className="mb-4 p-4 bg-gray-100 rounded text-sm">
                  <p>Debug: User Status: {userStatus}</p>
                  <p>Debug: Addresses Count: {addresses?.length || 0}</p>
                  <p>Debug: Selected Address ID: {selectedAddressId}</p>
                </div>
              )} */}
              
              {/* Existing Addresses */}
              {addresses && addresses.length > 0 ? (
                <div className="mb-8">
                  <h3 className="text-lg font-medium mb-4">Select Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        className={`relative p-4 border rounded-xl cursor-pointer transition-all ${
                          selectedAddressId === address._id 
                            ? 'border-[#A77C38] ring-2 ring-[#A77C38] bg-[#A77C38]/5' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                        onClick={() => setSelectedAddressId(address._id)}
                      >
                        {selectedAddressId === address._id && (
                          <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-[#A77C38]" />
                        )}
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold">{address.fullName}</p>
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{address.type}</span>
                            {address.isDefault && (
                              <span className="text-xs bg-[#A77C38] text-white px-2 py-1 rounded">Default</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{address.street}</p>
                          <p className="text-sm text-gray-600">
                            {address.city}, {address.state} - {address.postalCode}
                          </p>
                          <p className="text-sm text-gray-600">Phone: {address.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mb-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-5 w-5 text-yellow-600" />
                    <h3 className="font-medium text-yellow-800">No Shipping Address Found</h3>
                  </div>
                  <p className="text-sm text-yellow-700 mb-4">
                    Please add a shipping address to continue with your order.
                  </p>
                </div>
              )}
              
              {/* Add New Address Form */}
              <div className="mb-8">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setShowNewAddressForm(!showNewAddressForm)}
                >
                  <PlusCircle className="h-5 w-5 mr-2" /> 
                  {showNewAddressForm ? "Cancel" : "Add New Address"}
                </Button>
                
                <AnimatePresence>
                  {showNewAddressForm && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }} 
                      animate={{ opacity: 1, height: 'auto' }} 
                      exit={{ opacity: 0, height: 0 }} 
                      className="mt-6 p-6 border rounded-2xl bg-gray-50 space-y-4 overflow-hidden"
                    >
                      <h4 className="font-medium text-lg mb-4">Add New Shipping Address</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="fullName">Full Name *</Label>
                          <Input 
                            id="fullName"
                            name="fullName" 
                            value={newAddressFormData.fullName} 
                            onChange={handleNewAddressInputChange}
                            placeholder="Enter full name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone *</Label>
                          <Input 
                            id="phone"
                            name="phone" 
                            type="tel" 
                            value={newAddressFormData.phone} 
                            onChange={handleNewAddressInputChange}
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="street">Street Address *</Label>
                        <Input 
                          id="street"
                          name="street" 
                          value={newAddressFormData.street} 
                          onChange={handleNewAddressInputChange}
                          placeholder="Enter street address"
                        />
                      </div>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="state">State *</Label>
                          <Input 
                            id="state"
                            name="state" 
                            value={newAddressFormData.state} 
                            onChange={handleNewAddressInputChange}
                            placeholder="Enter state"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City *</Label>
                          <Input 
                            id="city"
                            name="city" 
                            value={newAddressFormData.city} 
                            onChange={handleNewAddressInputChange}
                            placeholder="Enter city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="postalCode">PIN Code *</Label>
                          <Input 
                            id="postalCode"
                            name="postalCode" 
                            value={newAddressFormData.postalCode} 
                            onChange={handleNewAddressInputChange}
                            placeholder="Enter PIN code"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Address Type</Label>
                        <select
                          id="type"
                          name="type"
                          value={newAddressFormData.type}
                          onChange={handleNewAddressInputChange}
                          className="w-full p-2 border rounded-md"
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                        </select>
                      </div>
                      <Button type="button" className="w-full mt-4" onClick={handleAddNewAddress}>
                        Save Address
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Payment Method */}
              <div className="pt-6 border-t">
                <h2 className="text-xl font-semibold mb-6">2. Payment Method</h2>
                <div className="space-y-4">
                  <div 
                    onClick={() => setSelectedPaymentMethod('cod')} 
                    className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedPaymentMethod === 'cod' 
                        ? 'border-[#A77C38] ring-2 ring-[#A77C38] bg-[#A77C38]/5' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                      <CreditCard className="h-5 w-5 text-gray-500" />
                      <span className="flex-1 font-medium">Cash on Delivery (COD)</span>
                      {selectedPaymentMethod === 'cod' && <CheckCircle className="h-5 w-5 text-[#A77C38]" />}
                  </div>
                  <div 
                    onClick={() => setSelectedPaymentMethod('razorpay')} 
                    className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                      selectedPaymentMethod === 'razorpay' 
                        ? 'border-[#A77C38] ring-2 ring-[#A77C38] bg-[#A77C38]/5' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">R</div>
                      <span className="flex-1 font-medium">Pay Online (Razorpay)</span>
                      {selectedPaymentMethod === 'razorpay' && <CheckCircle className="h-5 w-5 text-[#A77C38]" />}
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
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                      <Image 
                        src={item.product.images[0]} 
                        alt={item.product.name} 
                        fill 
                        className="object-cover" 
                      />
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
              
              {/* Coupon Form */}
              <div className="space-y-3 mb-6">
                <Label>Discount Code</Label>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-2 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-medium">Code "{appliedCoupon.code}" applied</span>
                    <Button 
                      onClick={handleRemoveDiscount} 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-red-500"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Input 
                      placeholder="Enter code" 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value)} 
                      disabled={isApplyingCoupon} 
                    />
                    <Button 
                      type="button" 
                      onClick={handleApplyDiscount} 
                      variant="outline" 
                      disabled={isApplyingCoupon}
                    >
                      {isApplyingCoupon ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Totals */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subTotal.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shippingCost === 0 ? "Free" : `₹${shippingCost.toLocaleString()}`}</span>
                </div>
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-[#A77C38]">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Place Order Button */}
              <Button 
                type="submit" 
                disabled={isProcessing || !selectedAddressId} 
                className="w-full py-3 mt-6 font-medium bg-[#A77C38] hover:bg-[#966b2a]"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    Processing...
                  </>
                ) : (
                  `Place Order - ₹${finalTotal.toLocaleString()}`
                )}
              </Button>
              
              <div className="flex items-center justify-center space-x-2 mt-3 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Secure SSL Encrypted Payment</span>
              </div>
            </div>
          </motion.div>
        </form>
      </main>
      <Footer />
    </div>
  )
}