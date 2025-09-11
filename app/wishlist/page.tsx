"use client"
import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Trash2, Heart, ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar  from "@/components/Navbar"
import Footer  from "@/components/Footer"
import { motion, AnimatePresence } from "framer-motion"
import { useToast } from "@/hooks/use-toast"

// --- STATIC MOCK DATA IMPORT ---
import { mockWishlistItems, WishlistItem } from "@/lib/data"

// --- UI Components for the New Layout ---
const WishlistItemCard = ({ item, onRemove, onAddToCart, loading }: { item: WishlistItem, onRemove: Function, onAddToCart: Function, loading: boolean }) => {
  const discount = item.base_price && item.base_price > item.price
    ? Math.round(((item.base_price - item.price) / item.base_price) * 100)
    : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="bg-white rounded-md shadow-sm overflow-hidden group flex flex-col"
    >
      <div className="relative w-full aspect-[3/4] bg-gray-50">
        <Link href={`/products/${item.slug}`}>
          <Image
            src={item.images[0] || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        {discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">-{discount}%</span>
        )}
        <button 
          onClick={() => onRemove(item._id, item.name)} 
          className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove from wishlist"
        >
          <Trash2 size={16} className="text-red-500" />
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link href={`/products/${item.slug}`} className="text-sm font-semibold text-gray-800 line-clamp-2 hover:text-[var(--theme-accent)] transition-colors">
            {item.name}
          </Link>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-lg font-bold text-gray-900">₹{(item.price / 100).toLocaleString()}</span>
            {item.base_price && <span className="text-sm text-gray-500 line-through">₹{(item.base_price / 100).toLocaleString()}</span>}
          </div>
        </div>
        <Button 
          onClick={() => onAddToCart(item)}
          className="w-full mt-4 bg-black text-white hover:bg-gray-800 rounded-md h-11 font-semibold"
          disabled={item.stock === 0}
        >
          {item.stock === 0 ? "Out of Stock" : "Move to Bag"}
        </Button>
      </div>
    </motion.div>
  );
};

export default function WishlistPage() {
  const { toast } = useToast()
  
  // --- USESTATE FOR STATIC DATA MANAGEMENT ---
  const [wishlistItems, setWishlistItems] = useState(mockWishlistItems);
  const [loading, setLoading] = useState(false);

  const handleRemoveFromWishlist = (itemId: string, itemName: string) => {
    setWishlistItems(currentItems => currentItems.filter(item => item._id !== itemId));
    toast({
      title: "Removed from Wishlist",
      description: `${itemName} has been removed from your wishlist.`,
    });
  };

  const handleMoveToCart = (item: WishlistItem) => {
    // Simulate adding to cart and removing from wishlist
    setWishlistItems(currentItems => currentItems.filter(i => i._id !== item._id));
    toast({
      title: "Moved to Bag",
      description: `${item.name} has been moved to your bag.`,
    });
  };

  // Empty Wishlist State
  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--theme-background)]">
        <Navbar />
        <main className="container mx-auto px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Heart className="h-20 w-20 mx-auto mb-6 text-gray-300" />
            <h1 className="text-3xl font-serif font-bold text-gray-800 mb-2">Your Wishlist is Empty</h1>
            <p className="text-gray-500 mb-8 max-w-sm mx-auto">Looks like you haven’t saved anything yet. Tap the heart on products you love!</p>
            <Link href="/">
              <Button className="bg-[var(--theme-accent)] text-white hover:bg-opacity-90 px-8 py-6 rounded-full font-semibold">Discover Products</Button>
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
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-serif font-bold text-gray-800">My Wishlist</h1>
            <p className="text-gray-500 mt-1">{wishlistItems.length} items saved</p>
          </div>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          <AnimatePresence>
            {wishlistItems.map((item) => (
              <WishlistItemCard
                key={item._id}
                item={item}
                onRemove={handleRemoveFromWishlist}
                onAddToCart={handleMoveToCart}
                loading={loading}
              />
            ))}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  )
}