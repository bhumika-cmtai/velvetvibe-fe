// cart/page.tsx (Simplified)

"use client"
import { useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

// --- REDUX IMPORTS (Simplified) ---
import { useDispatch, useSelector } from "react-redux"
import { RootState, AppDispatch } from "@/lib/redux/store"
import {
  fetchCart,
  updateCartQuantity,
  removeFromCart,
} from "@/lib/redux/slices/cartSlice"
import { RecommendedProducts } from "@/components/RecommendProducts"

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  // --- SIMPLIFIED SELECTOR ---
  // We only need items, subtotal, and loading/error status here.
  const {
    items,
    subTotal,
    loading,
    error
  } = useSelector((state: RootState) => state.cart);

  useEffect(() => {
   dispatch(fetchCart())
  }, [dispatch])

  // handleUpdateQuantity and handleRemoveFromCart remain unchanged
  const handleUpdateQuantity = async (cartItemId: string, productId: string, newQuantity: number, stock: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(cartItemId, productId);
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
    await dispatch(updateCartQuantity({ productId, quantity: newQuantity })).unwrap();
  };

  const handleRemoveFromCart = async (cartItemId: string, productName: string) => {
    await dispatch(removeFromCart(cartItemId)).unwrap()
    toast({
      title: "Item Removed",
      description: `${productName} has been removed from your cart.`,
    })
  }
  
  // --- REMOVED: handleApplyDiscount and handleRemoveDiscount ---

  // Loading, error, and empty cart JSX remains the same
  if (loading && items.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading your cart...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;
  }
  if (items.length === 0) {
    return (
        <div className="min-h-screen">
          <Navbar />
          <main className="container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md mx-auto"
            >
              <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-gray-300" />
              <h1 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h1>
              <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
              <Link href="/">
                <Button>Continue Shopping</Button>
              </Link>
            </motion.div>
          </main>
          <Footer />
        </div>
      )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-serif font-bold">Shopping Cart ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</h1>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 50, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -50, scale: 0.8 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.product.images[0] || "/placeholder.svg"} alt={item.product.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.product.name}</h3>
                        <span className="font-semibold" style={{ color: "#AA7E3D" }}>₹{item.product.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-8">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border rounded-lg">
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateQuantity(item._id, item.product._id, item.quantity - 1, item.product.stock)} className="h-8 w-8" disabled={loading}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 font-medium">{item.quantity}</span>
                          <Button variant="ghost" size="icon" onClick={() => handleUpdateQuantity(item._id, item.product._id, item.quantity + 1, item.product.stock)} className="h-8 w-8" disabled={loading}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveFromCart(item._id, item.product.name)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50" disabled={loading}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* --- SIMPLIFIED ORDER SUMMARY --- */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Cart Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subTotal.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-500">Taxes and shipping calculated at checkout.</p>
              </div>
              <Link href="/checkout">
                <Button className="w-full py-3 rounded-xl font-medium" style={{ backgroundColor: "#AA7E3D", color: "white" }}>
                  Proceed to Checkout
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <RecommendedProducts cartItems={items} />
      <Footer />
    </div>
  )
}