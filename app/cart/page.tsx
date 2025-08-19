"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart()
  const [discountCode, setDiscountCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState(0)

  const handleApplyDiscount = () => {
    if (discountCode.toLowerCase() === "welcome10") {
      setAppliedDiscount(totalPrice * 0.1)
    } else if (discountCode.toLowerCase() === "save20") {
      setAppliedDiscount(totalPrice * 0.2)
    } else {
      setAppliedDiscount(0)
    }
  }

  const shipping = totalPrice > 2000 ? 0 : 99
  const finalTotal = totalPrice - appliedDiscount + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-md mx-auto"
          >
            <ShoppingBag className="h-24 w-24 mx-auto mb-6 text-gray-300" />
            <h1 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/">
              <Button
                className="px-8 py-3 rounded-xl font-medium"
                style={{ backgroundColor: "var(--theme-primary)", color: "white" }}
              >
                Continue Shopping
              </Button>
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-2xl font-serif font-bold" style={{ color: "black" }}>
              Shopping Cart ({totalItems} items)
            </h1>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 border border-gray-200 shadow-sm"
                >
                  {/* --- FIX START: Responsive Layout Container --- */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    {/* Left Side: Image and Details */}
                    <div className="flex items-center space-x-4 min-w-0 flex-1">
                      <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                        <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.material}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="font-semibold" style={{ color: "#AA7E3D" }}>
                            ₹{item.priceDiscounted.toLocaleString()}
                          </span>
                          {item.priceOriginal > item.priceDiscounted && (
                            <span className="text-sm text-gray-500 line-through">
                              ₹{item.priceOriginal.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Controls and Total */}
                    <div className="flex items-center justify-between mt-4 sm:mt-0 sm:space-x-8">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center border rounded-lg">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="h-8 w-8"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-3 py-1 font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="h-8 w-8"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Item Total (with a fixed width for alignment) */}
                      <div className="text-right w-24">
                        <p className="font-semibold" style={{ color: "#AA7E3D" }}>
                          ₹{(item.priceDiscounted * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* --- FIX END --- */}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold mb-6">Order Summary</h2>

              {/* Discount Code */}
              <div className="space-y-3 mb-6">
                <label className="text-sm font-medium text-gray-700">Discount Code</label>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Enter code"
                    value={discountCode}
                    onChange={(e) => setDiscountCode(e.target.value)}
                    className="rounded-xl"
                  />
                  <Button
                    onClick={handleApplyDiscount}
                    variant="outline"
                    className="px-4 rounded-xl bg-transparent"
                    style={{ borderColor: "var(--theme-primary)", color: "var(--theme-primary)" }}
                  >
                    Apply
                  </Button>
                </div>
                {appliedDiscount > 0 && (
                  <p className="text-sm text-green-600">Discount applied: -₹{appliedDiscount.toLocaleString()}</p>
                )}
              </div>

              {/* Summary Details */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-₹{appliedDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                {shipping === 0 && totalPrice <= 2000 && (
                  <p className="text-xs text-gray-500">Free shipping on orders above ₹2,000</p>
                )}
                <hr className="my-4" />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span style={{ color: "var(--theme-primary)" }}>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout">
                <Button
                  className="w-full py-3 rounded-xl font-medium"
                  style={{ backgroundColor: "#AA7E3D", color: "white" }}
                >
                  Proceed to Checkout
                </Button>
              </Link>

              {/* Continue Shopping */}
              <Link href="/">
                <Button variant="ghost" className="w-full mt-3 text-gray-600">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}