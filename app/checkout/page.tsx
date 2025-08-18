"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CreditCard, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

export default function CheckoutPage() {
  const { items, totalPrice, totalItems, clearCart } = useCart()
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    state: "",
    city: "",
    pinCode: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 3000))

    toast({
      title: "Order placed successfully!",
      description: "Thank you for your purchase. You'll receive a confirmation email shortly.",
    })

    clearCart()
    setIsProcessing(false)

    // Redirect to success page or home
    window.location.href = "/"
  }

  const shipping = totalPrice > 2000 ? 0 : 99
  const finalTotal = totalPrice + shipping

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container mx-auto px-4 py-20">
          <div className="text-center max-w-md mx-auto">
            <h1 className="text-2xl font-serif font-bold mb-4">Your cart is empty</h1>
            <p className="text-gray-600 mb-8">Add some items to your cart before checking out.</p>
            <Link href="/">
              <Button
                className="px-8 py-3 rounded-xl font-medium"
                style={{ backgroundColor: "var(--theme-primary)", color: "white" }}
              >
                Continue Shopping
              </Button>
            </Link>
          </div>
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
          className="flex items-center space-x-4 mb-8"
        >
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-serif font-bold" style={{ color: "var(--theme-primary)" }}>
            Checkout
          </h1>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="rounded-xl"
                    placeholder="Street address, apartment, suite, etc."
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pinCode">PIN Code *</Label>
                    <Input
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleInputChange}
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                    style={{ backgroundColor: "var(--theme-primary)", color: "white" }}
                  >
                    {isProcessing ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="h-5 w-5" />
                        <span>Pay Now - ₹{finalTotal.toLocaleString()}</span>
                      </>
                    )}
                  </Button>
                  <div className="flex items-center justify-center space-x-2 mt-3 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Secure payment powered by SSL encryption</span>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm sticky top-24">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image src={item.images[0] || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{item.name}</h4>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{(item.priceDiscounted * item.quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <hr className="mb-6" />

              {/* Summary Totals */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                {shipping === 0 && <p className="text-xs text-green-600">Free shipping applied!</p>}
                <hr />
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span style={{ color: "var(--theme-primary)" }}>₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">We accept:</p>
                <div className="flex justify-center space-x-2">
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs">Visa</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs">Mastercard</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs">UPI</div>
                  <div className="px-3 py-1 bg-gray-100 rounded text-xs">Net Banking</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
