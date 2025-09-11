//wishlistContext.tsx
"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product } from "@/lib/types/product"

// Wishlist items are just products, no quantity needed.
type WishlistItem = Product

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isAddedToWishlist: (productId: string) => boolean
  clearWishlist: () => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    // Load saved wishlist from localStorage on initial render
    const savedWishlist = localStorage.getItem("luv-kush-wishlist")
    if (savedWishlist) {
      setItems(JSON.parse(savedWishlist))
    }
  }, [])

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem("luv-kush-wishlist", JSON.stringify(items))
  }, [items])

  const addToWishlist = (product: Product) => {
    setItems((prev) => {
      // Prevent adding duplicate items
      const existingItem = prev.find((item) => item._id === product._id)
      if (existingItem) {
        return prev // If item already exists, do nothing
      }
      return [...prev, product]
    })
  }

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => prev.filter((item) => item._id !== productId))
  }

  const isAddedToWishlist = (productId: string) => {
    return items.some((item) => item._id === productId)
  }

  const clearWishlist = () => {
    setItems([])
  }

  const totalItems = items.length

  return (
    <WishlistContext.Provider
      value={{
        items,
        addToWishlist,
        removeFromWishlist,
        isAddedToWishlist,
        clearWishlist,
        totalItems,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}