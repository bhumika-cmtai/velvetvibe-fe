"use client"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Lock, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

// --- REDUX IMPORTS ---
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/lib/redux/store"
import {
  fetchCart,
  updateCartQuantity,
  removeFromCart,
} from "@/lib/redux/slices/cartSlice"
import { mockCartItems, mockSubTotal } from "@/lib/data"

import { RecommendedProducts } from "@/components/RecommendProducts"

// --- UI Components for the New Layout ---

const CartItemCard = ({ item, onUpdate, onRemove, loading }: any) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ type: "spring", stiffness: 300, damping: 30 }}
    className="grid grid-cols-12 items-center gap-4 py-4"
  >
    {/* Image & Product Details */}
    <div className="col-span-6 flex items-center gap-4">
      <Link href={`/products/${item.product.slug}`}>
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-[var(--theme-background)]">
          <Image src={item.product.images[0] || "/placeholder.svg"} alt={item.product.name} fill className="object-cover hover:scale-105 transition-transform duration-300" />
        </div>
      </Link>
      <div>
        <Link href={`/products/${item.product.slug}`} className="font-semibold text-gray-800 hover:text-[var(--theme-accent)] transition-colors">{item.product.name}</Link>
        <p className="text-sm text-gray-500">Color: {item.color} / Size: {item.size}</p>
        <button onClick={() => onRemove(item._id, item.product.name)} className="text-xs text-red-500 hover:underline mt-2 flex items-center gap-1" disabled={loading}>
          <Trash2 size={12} /> Remove
        </button>
      </div>
    </div>
    
    {/* Quantity Selector */}
    <div className="col-span-3 flex justify-center">
      <div className="flex items-center border rounded-full">
        <Button variant="ghost" size="icon" onClick={() => onUpdate(item._id, item.quantity - 1, item.product.stock)} className="h-8 w-8 rounded-full" disabled={loading}><Minus className="h-4 w-4" /></Button>
        <span className="px-4 font-medium text-sm w-12 text-center">{item.quantity}</span>
        <Button variant="ghost" size="icon" onClick={() => onUpdate(item._id, item.quantity + 1, item.product.stock)} className="h-8 w-8 rounded-full" disabled={loading}><Plus className="h-4 w-4" /></Button>
      </div>
    </div>
    
    {/* Price */}
    <div className="col-span-3 text-right">
      <p className="font-semibold text-gray-800">₹{(item.price / 100).toLocaleString()}</p>
    </div>
  </motion.div>
);

export default function CartPage() {
  const { toast } = useToast()

  // --- USESTATE FOR STATIC DATA MANAGEMENT ---
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [subTotal, setSubTotal] = useState(mockSubTotal);
  const [loading, setLoading] = useState(false); // For simulating loading state on actions

  useEffect(() => {
    // Recalculate subtotal whenever cartItems change
    const newSubTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    setSubTotal(newSubTotal);
  }, [cartItems]);


  const handleUpdateQuantity = (cartItemId: string, newQuantity: number, stock: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(cartItemId, cartItems.find(i => i._id === cartItemId)?.product.name || "Item");
      return;
    }
    if (newQuantity > stock) {
      toast({
        title: "Stock limit reached",
        description: `Only ${stock} items available.`,
        variant: "destructive",
      });
      return;
    }
    setCartItems(currentItems => 
      currentItems.map(item => 
        item._id === cartItemId 
          ? { ...item, quantity: newQuantity, price: item.product.price * newQuantity }
          : item
      )
    );
  };

  const handleRemoveFromCart = (cartItemId: string, productName: string) => {
    setCartItems(currentItems => currentItems.filter(item => item._id !== cartItemId));
    toast({
      title: "Item Removed",
      description: `${productName} has been removed from your cart.`,
    });
  };

  // Empty Cart State
  if (cartItems.length === 0) {
    return (
        <div className="min-h-screen bg-[var(--theme-background)]">
          <Navbar />
          <main className="container mx-auto px-4 py-24 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <ShoppingBag className="h-20 w-20 mx-auto mb-6 text-gray-300" />
              <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Your Bag is Empty</h1>
              <p className="text-gray-500 mb-8 max-w-sm mx-auto">Once you add something to your bag, it will appear here. Ready to find something you'll love?</p>
              <Link href="/">
                <Button className="bg-[var(--theme-accent)] text-white hover:bg-opacity-90 px-8 py-6 rounded-full font-semibold">Start Shopping</Button>
              </Link>
            </motion.div>
          </main>
          <Footer />
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-[var(--theme-background)]">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black mb-6 transition-colors">
            <ArrowLeft size={16} /> Back to shopping
          </Link>
          <h1 className="text-4xl font-serif font-bold text-gray-800 mb-8">My Bag ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})</h1>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-[var(--theme-card-background)] rounded-2xl shadow-sm p-6">
            <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 uppercase pb-4 border-b">
              <div className="col-span-6">Product</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-3 text-right">Total</div>
            </div>
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <div key={item._id} className={` ${index !== cartItems.length - 1 ? 'border-b' : ''}`}>
                  <CartItemCard item={item} onUpdate={handleUpdateQuantity} onRemove={handleRemoveFromCart} loading={loading} />
                </div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-1">
            <div className="bg-[var(--theme-card-background)] rounded-2xl shadow-sm p-6 sticky top-28">
              <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">Order Summary</h2>
              
              <div className="space-y-3 mb-6 text-gray-700">
                <div className="flex justify-between items-center"><span className="text-gray-500">Subtotal</span><span className="font-semibold">₹{(subTotal / 100).toLocaleString()}</span></div>
                <div className="flex justify-between items-center"><span className="text-gray-500">Shipping</span><span className="font-semibold">FREE</span></div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                 <div className="flex justify-between items-center text-lg font-bold text-gray-800">
                    <span>Estimated Total</span>
                    <span>₹{(subTotal / 100).toLocaleString()}</span>
                  </div>
              </div>
              
              <Link href="/checkout">
                <Button className="w-full h-12 rounded-sm font-bold text-base bg-[var(--accent-primary)] text-white hover:bg-opacity-90">
                  <Lock size={16} className="mr-2" />
                  Proceed to Checkout
                </Button>
              </Link>
              
              <div className="text-center mt-6">
                 <p className="text-xs text-gray-500 mb-2">We accept:</p>
                 <div className="flex justify-center items-center gap-3">
                    <CreditCard size={20} className="text-gray-400" />
                    <p className="text-xs text-gray-400">Visa, Mastercard, Amex, UPI</p>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      {/* <RecommendedProducts cartItems={cartItems} /> */}
      <Footer />
    </div>
  )
}