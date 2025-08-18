"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext" // 1. Import useWishlist
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/data"
import { motion } from "framer-motion"

interface ProductCardProps {
  product: Product
  index?: number
}

// A simple star rating component to mimic the design
const StarRating = ({ reviews }: { reviews: number }) => (
  <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-purple-400 text-purple-400" />
      ))}
    </div>
    <span>{reviews} reviews</span>
  </div>
)

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  // 2. Remove local state and get everything from the contexts
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isAddedToWishlist } = useWishlist()
  const { toast } = useToast()

  // 3. Check if the product is in the wishlist using the context function
  const isInWishlist = isAddedToWishlist(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent link navigation when clicking the button
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  // 4. Update handleWishlist to use context functions
  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent link navigation

    if (isInWishlist) {
      removeFromWishlist(product.id)
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      })
    } else {
      addToWishlist(product)
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist.`,
      })
    }
  }

  const hasDiscount = product.priceOriginal > product.priceDiscounted

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index || 0) * 0.1 }}
      viewport={{ once: true }}
      className="group relative flex h-full flex-col overflow-hidden rounded-md border bg-white"
    >
      <Link href={`/collections/${product.gender}/${product.slug}`} className="flex flex-grow flex-col">
        <div className="relative aspect-square overflow-hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <Image
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </motion.div>

          <Button
            size="icon"
            variant="secondary"
            className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 shadow-md backdrop-blur-sm transition-all hover:bg-white"
            onClick={handleWishlist}
          >
            {/* 5. The heart icon's style is now driven by the global state */}
            <Heart
              className={`h-5 w-5 transition-all ${
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </Button>
        </div>

        <div className="flex flex-grow flex-col p-4 text-center">
          <h3 className="mb-2 text-lg font-medium text-gray-800 line-clamp-2">{product.name}</h3>

          <div className="mt-auto flex items-baseline justify-center space-x-2">
            {hasDiscount ? (
              <>
                <span className="text-lg font-bold text-gray-900">
                  Rs. {product.priceDiscounted.toLocaleString()}
                </span>
                <span className="text-md text-gray-400 line-through">
                  Rs. {product.priceOriginal.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-lg font-bold text-gray-900">
                Rs. {product.priceOriginal.toLocaleString()}
              </span>
            )}
          </div>
        </div>
      </Link>

      <div className="p-1 md:p-2  pt-0">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Button
            size="lg"
            className="w-full md:h-12 text-sm md:text-md font-semibold hover:cursor-pointer"
            style={{ backgroundColor: "var(--theme-primary, #8A2BE2)" }}
            onClick={handleAddToCart}
          >
            ADD TO CART
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}