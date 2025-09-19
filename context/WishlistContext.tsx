//wishlistContext.tsx
"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product, Variant } from "@/lib/types/product"

// Wishlist items include product and selected variant information
interface WishlistItem {
  product: Product;
  selectedVariant?: Variant;
  sku_variant?: string; // For unique identification
}

interface WishlistContextType {
  items: WishlistItem[]
  addToWishlist: (product: Product, selectedVariant?: Variant) => void
  removeFromWishlist: (productId: string, skuVariant?: string) => void
  isAddedToWishlist: (productId: string, skuVariant?: string) => boolean
  clearWishlist: () => void
  totalItems: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])

  useEffect(() => {
    // Load saved wishlist from localStorage on initial render
    const savedWishlist = localStorage.getItem("velvetvibe-wishlist")
    if (savedWishlist) {
      setItems(JSON.parse(savedWishlist))
    }
  }, [])

  useEffect(() => {
    // Save wishlist to localStorage whenever it changes
    localStorage.setItem("velvetvibe-wishlist", JSON.stringify(items))
  }, [items])

  const addToWishlist = (product: Product, selectedVariant?: Variant) => {
    setItems((prev) => {
      const skuVariant = selectedVariant?.sku_variant || 'default';
      
      // Prevent adding duplicate items (check by product ID and variant)
      const existingItem = prev.find((item) => 
        item.product._id === product._id && item.sku_variant === skuVariant
      )
      if (existingItem) {
        return prev // If item already exists, do nothing
      }
      
      // Create a snapshot of the product with current stock information
      const productSnapshot = {
        ...product,
        // Ensure we have the current stock information
        stock_quantity: selectedVariant ? selectedVariant.stock_quantity : (product.stock_quantity || product.stock || 0)
      };
      
      // Create a snapshot of the variant with current stock information
      const variantSnapshot = selectedVariant ? {
        ...selectedVariant,
        // Ensure we have the current stock information
        stock_quantity: selectedVariant.stock_quantity || 0
      } : undefined;
      
      // Debug logging to see what's being saved
      //  ('Adding to wishlist:', {
      //   productName: product.name,
      //   selectedVariant: selectedVariant,
      //   productStock: product.stock_quantity || product.stock,
      //   variantStock: selectedVariant?.stock_quantity,
      //   finalProductStock: productSnapshot.stock_quantity,
      //   finalVariantStock: variantSnapshot?.stock_quantity
      // });
      
      return [...prev, {
        product: productSnapshot,
        selectedVariant: variantSnapshot,
        sku_variant: skuVariant
      }]
    })
  }

  const removeFromWishlist = (productId: string, skuVariant?: string) => {
    setItems((prev) => prev.filter((item) => {
      if (skuVariant) {
        return !(item.product._id === productId && item.sku_variant === skuVariant);
      }
      return item.product._id !== productId;
    }))
  }

  const isAddedToWishlist = (productId: string, skuVariant?: string) => {
    return items.some((item) => {
      if (skuVariant) {
        return item.product._id === productId && item.sku_variant === skuVariant;
      }
      return item.product._id === productId;
    })
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