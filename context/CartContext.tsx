"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product,Variant } from "@/lib/types/product" // Updated Product type import karein

// CartItem ab Product se _id inherit karega
interface CartItem extends Product {
  quantity: number
}

export interface LocalCartItem {
  productId: string;
  sku_variant: string; 
  quantity: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  attributes: Record<string, string>; 
}



interface CartContextType {
  items: LocalCartItem[];
  // CHANGE: `addToCart` ab product ke saath variant bhi lega
  addToCart: (product: Product, variant: Variant, quantity?: number) => void;
  removeFromCart: (sku_variant: string) => void;
  updateQuantity: (sku_variant: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<LocalCartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("velvetvibe-cart");
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  useEffect(() => {
    localStorage.setItem("velvetvibe-cart", JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, variant: Variant, quantity = 1) => {
    setItems((prev) => {
      // Check for item using sku_variant
      const existingItem = prev.find((item) => item.sku_variant === variant.sku_variant);
      if (existingItem) {
        return prev.map((item) => (item.sku_variant === variant.sku_variant ? { ...item, quantity: item.quantity + quantity } : item));
      }
      
      // Create a new local cart item
      const newItem: LocalCartItem = {
        productId: product._id,
        sku_variant: variant.sku_variant,
        quantity,
        name: product.name,
        slug: product.slug,
        image: variant.images?.[0] || product.images[0],
        price: variant.sale_price || variant.price,
        attributes: {
          size: variant.size,
          color: variant.color,
        },
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (sku_variant: string) => {
    setItems((prev) => prev.filter((item) => item.sku_variant !== sku_variant));
  };

  const updateQuantity = (sku_variant: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(sku_variant);
      return;
    }
    setItems((prev) => prev.map((item) => (item.sku_variant === sku_variant ? { ...item, quantity } : item)));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error("useCart must be used within a CartProvider");
  return context;
}