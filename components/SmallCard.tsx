"use client"

import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Star, ShoppingBag, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import type { Product } from "@/lib/data"
import { motion } from "framer-motion"

// Redux imports
import { useDispatch, useSelector } from 'react-redux';
import {
  addToWishlist,
  removeFromWishlist,
  selectIsAddedToWishlist,
  addWishlistOptimistic,
  removeWishlistOptimistic
} from '@/lib/redux/slices/wishlistSlice'; // Adjust the path to your wishlistSlice

import type { AppDispatch } from '@/lib/redux/store'; // <--- Import AppDispatch from your store

interface ProductCardProps {
  product: Product & { _id: string };
  index?: number;
}

export function SmallCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const dispatch = useDispatch<AppDispatch>(); // <--- Use AppDispatch here

  // Check if the product is in the wishlist
  const isAddedToWishlist = useSelector(selectIsAddedToWishlist(product._id));

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product)
    console.log(`${product.name} added to cart`)
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAddedToWishlist) {
      // Optimistic update: Remove from local state immediately
      dispatch(removeWishlistOptimistic(product._id));
      // Dispatch the async thunk
      dispatch(removeFromWishlist(product._id)) // <--- Now this should work correctly
        .unwrap()
        .then(() => {
          toast({
            title: "Removed from Wishlist",
            description: `${product.name} has been removed from your wishlist.`,
          });
        })
        .catch((error) => {
          toast({
            title: "Failed to remove from Wishlist",
            description: error,
            variant: "destructive",
          });
        });
    } else {
      // Optimistic update: Add to local state immediately
      dispatch(addWishlistOptimistic({
        _id: product._id,
        name: product.name,
        price: product.price,
        images: product.images || "/placeholder.svg",
        stock: product.stock || 1,
      }));
      // Dispatch the async thunk
      dispatch(addToWishlist(product._id)) // <--- And this too
        .unwrap()
        .then(() => {
          toast({
            title: "Added to Wishlist",
            description: `${product.name} has been added to your wishlist.`,
          });
        })
        .catch((error) => {
          toast({
            title: "Failed to add to Wishlist",
            description: error,
            variant: "destructive",
          });
        });
    }
  };

  const hasDiscount = product.price && product.originalPrice && product.price < product.originalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut", delay: (index || 0) * 0.1 }}
      viewport={{ once: true }}
      className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white border[1px]"
    >
      <Link href={`/products/${product.slug}`} className="flex flex-grow flex-col p-4">
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

        {/* Wishlist Button (positioned absolutely on top of the image) */}
        <motion.div
          className="absolute right-4 top-4 z-10"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Button
            size="icon"
            variant="ghost"
            className={`h-9 w-9 rounded-full bg-white/70 backdrop-blur-sm shadow-md hover:bg-white
              ${isAddedToWishlist ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'}
            `}
            onClick={handleToggleWishlist}
            aria-label={isAddedToWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className="h-5 w-5 fill-current" />
          </Button>
        </motion.div>


        {/* Details Container */}
        <div className="flex flex-grow flex-col text-left">
          <p className="mb-1 text-sm text-gray-500">{product.materialType || "Category"}</p>
          <h3 className="mb-2 text-base font-bold text-gray-900 truncate">{product.name}</h3>

          <div className="mt-auto flex items-center justify-between">
            <div className="flex flex-col items-start">
              {hasDiscount ? (
                <>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
              )}
            </div>
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
          </div>
        </div>
      </Link>
    </motion.div>
  )
}