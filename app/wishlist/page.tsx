// wishlistPage.tsx
"use client"

import Image from "next/image"
import Link from "next/link"
import { Trash2, Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"
import { Product } from "@/lib/data" // Ensure this Product type has an '_id' field

// REDUX IMPORTS
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchWishlist,
  removeFromWishlist,
  selectWishlistItems,
  selectWishlistStatus,
  selectTotalWishlistItems,
  selectWishlistError,
  removeWishlistOptimistic, // For optimistic UI
} from '@/lib/redux/slices/wishlistSlice' // Adjust path to your wishlistSlice
import { addToCart } from '@/lib/redux/slices/cartSlice'; // Assuming you have a cartSlice with addToCart
import { AppDispatch } from '@/lib/redux/store' // Adjust path to your Redux store type
import { useEffect } from "react"


export default function WishlistPage() {
  const dispatch: AppDispatch = useDispatch()
  const items = useSelector(selectWishlistItems)
  const totalItems = useSelector(selectTotalWishlistItems)
  const wishlistStatus = useSelector(selectWishlistStatus)
  const wishlistError = useSelector(selectWishlistError)
  const { toast } = useToast()

  useEffect(() => {
    // Fetch wishlist when the component mounts
    if (wishlistStatus === 'idle') {
      dispatch(fetchWishlist());
    }
  }, [dispatch, wishlistStatus]);

  const handleRemoveFromWishlist = async (productId: string, productName: string) => {
    // Optimistic update
    dispatch(removeWishlistOptimistic(productId));
    try {
      await dispatch(removeFromWishlist(productId)).unwrap();
      toast({
        title: "Removed from Wishlist",
        description: `${productName} has been removed from your wishlist.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to remove item from wishlist.",
        variant: "destructive",
      });
      // Revert optimistic update if API call fails (you might need to refetch or re-add)
      dispatch(fetchWishlist()); // Simplistic way to revert: refetch
    }
  };


  const handleMoveToCart = async (item: Product) => {
    // Assuming addToCart is also an async thunk from a cartSlice
    try {
      // Optimistically remove from wishlist first
      dispatch(removeWishlistOptimistic(item.id)); // Use item._id
      // Add to cart (assuming this is an async thunk that returns the updated cart or item)
      await dispatch(addToCart({ productId: item.id, quantity: 1 })).unwrap(); // Assuming addToCart takes { productId, quantity }

      toast({
        title: "Moved to Cart",
        description: `${item.name} has been moved to your cart.`,
      });

      // After successful move to cart, remove from wishlist on backend
      // We already optimistically removed it, so just ensure backend is updated
      await dispatch(removeFromWishlist(item.id)).unwrap(); // Use item._id
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to move item to cart or remove from wishlist.",
        variant: "destructive",
      });
      // If any step fails, refetch both cart and wishlist to ensure consistency
      dispatch(fetchWishlist());
      // Optionally, dispatch a fetchCart if you have one
    }
  };


  // Handle loading and error states
  if (wishlistStatus === 'loading' && items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (wishlistStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500">Error loading wishlist: {wishlistError}</p>
      </div>
    );
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
            <h1 className="text-2xl font-bold" style={{ color: "black" }}>
              My Wishlist ({totalItems} items)
            </h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {items.map((item, index) => (
              <motion.div
                key={item._id} // Use item._id for key
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="bg-white rounded-2xl border border-gray-200 shadow-md flex flex-col group overflow-hidden"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square">
                  {/* Ensure item.mainImage is available from backend or adjust */}
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
                        ₹{item.price.toLocaleString()} {/* Use item.price from backend */}
                      </span>
                      {/* If your backend item includes original/discounted price, adjust here */}
                      {/* {item.priceOriginal > item.priceDiscounted && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.priceOriginal.toLocaleString()}
                        </span>
                      )} */}
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
                      // Pass item._id and name to the handler
                      onClick={() => handleRemoveFromWishlist(item._id, item.name)}
                      className="h-10 w-10 flex-shrink-0 rounded-md"
                    >
                      <Trash2 className="h-5 w-5 text-gray-600" />
                    </Button>
                    <Button
                      onClick={() => handleMoveToCart(item as Product)} // Ensure type compatibility
                      className="flex-1 h-10 rounded-md font-medium text-white"
                      style={{ backgroundColor: "#AA7E3D" }}
                      disabled={item.stock === 0} // Disable if out of stock
                    >
                      {item.stock === 0 ? "Out of Stock" : "Move to Cart"}
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