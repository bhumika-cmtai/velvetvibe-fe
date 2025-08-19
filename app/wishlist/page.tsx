"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Heart, ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useWishlist } from "@/context/WishlistContext"
import { useCart } from "@/context/CartContext"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/lib/data"

export default function WishlistPage() {
  const { items, removeFromWishlist, totalItems } = useWishlist()
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleMoveToCart = (item: Product) => {
    addToCart(item)
    removeFromWishlist(item.id)
    toast({
      title: "Moved to Cart",
      description: `${item.name} has been moved to your cart.`,
    })
  }

  // Empty state remains the same
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
            <Heart className="h-24 w-24 mx-auto mb-6 text-gray-300" />
            <h1 className="text-2xl font-serif font-bold mb-4">Your wishlist is empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your wishlist yet.</p>
            <Link href="/">
              <Button
                className="px-8 py-3 rounded-xl font-medium"
                style={{ backgroundColor: "#AA7E3D", color: "white" }}
              >
                Discover Products
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
        {/* --- MODIFICATION START: Header updated to match image --- */}
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
            {/* Font and color changed to match the new design */}
            <h1 className="text-2xl font-bold" style={{ color: "black" }}>
              My Wishlist ({totalItems} items)
            </h1>
          </div>
        </motion.div>
        {/* --- MODIFICATION END --- */}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                // Card style updated to match image (more rounded, stronger shadow)
                className="bg-white rounded-2xl border border-gray-200 shadow-md flex flex-col group overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square">
                  <Image
                    src={item.images[0] || "/placeholder.svg"}
                    alt={item.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Product Details & Actions */}
                <div className="p-3 flex flex-col flex-grow">
                  <div className="flex-grow">
                    {/* Price */}
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{item.priceDiscounted.toLocaleString()}
                      </span>
                      {item.priceOriginal > item.priceDiscounted && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.priceOriginal.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {/* Name */}
                    <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                      {item.name}
                    </p>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-3 flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromWishlist(item.id)}
                      className="h-10 w-10 flex-shrink-0 rounded-md"
                    >
                      <Trash2 className="h-5 w-5 text-gray-600" />
                    </Button>
                    {/* --- FIX: Replaced `w-full` with `flex-1` --- */}
                    <Button
                      onClick={() => handleMoveToCart(item)}
                      className="flex-1 h-10 rounded-md font-medium text-white"
                      style={{ backgroundColor: "#AA7E3D" }}
                    >
                      Move to Cart
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  )
}