"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/data"
import { motion } from "framer-motion"

interface ProductCardProps {
  product: Product
  index?: number
}


export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  // Check if there is a valid discount to display
  const hasDiscount = product.priceDiscounted && product.priceDiscounted < product.priceOriginal

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: (index || 0) * 0.1 }}
      viewport={{ once: true }}
      className="flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white border[1px]"
    >
      <Link href={`/collections/${product.gender}/${product.slug}`} className="flex flex-grow flex-col p-4">
        {/* Image Container */}
        <div className="relative mb-4 aspect-square">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Details Container */}
        <div className="flex flex-grow flex-col text-left">
          <p className="mb-1 text-sm text-gray-500">{product.category || "Category"}</p>
          <h3 className="mb-2 text-base font-bold text-gray-900 truncate">{product.name}</h3>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col items-start">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.priceDiscounted.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                  ₹{product.priceOriginal.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.priceOriginal.toLocaleString()}
                </span>
              )}
            </div>
            {/* --- FIX START: Added motion wrapper for button animation --- */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                size="icon"
                className="h-10 w-10 rounded-full flex-shrink-0 hover:cursor-pointer"
                style={{ backgroundColor: '#5B7F81' }}
                onClick={handleAddToCart}
              >
                <ShoppingBag className="h-5 w-5 text-white" />
              </Button>
            </motion.div>
            {/* --- FIX END --- */}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}