"use client"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import type { Product,Variant } from "@/lib/types/product" // Updated Product type import karein

// CartItem ab Product se _id inherit karega
interface CartItem extends Product {
  quantity: number
}

export interface LocalCartItem {
  productId: string;
  sku_variant?: string; // Optional for simple products without variants
  quantity: number;
  name: string;
  slug: string;
  image: string;
  price: number;
  attributes?: Record<string, string>; // Optional for simple products
  selectedVariant?: Variant; // Store the full variant object for reference
}



interface CartContextType {
  items: LocalCartItem[];
  // Support both simple products and products with variants
  addToCart: (product: Product, variant?: Variant, quantity?: number) => void;
  removeFromCart: (productId: string, sku_variant?: string) => void;
  updateQuantity: (productId: string, sku_variant: string | undefined, quantity: number) => void;
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

  const addToCart = (product: Product, variant?: Variant, quantity = 1) => {
    setItems((prev) => {
      // For products with variants, use sku_variant as unique identifier
      // For simple products, use productId as unique identifier
      const uniqueKey = variant ? variant.sku_variant : product._id;
      const existingItem = prev.find((item) => 
        variant ? item.sku_variant === variant.sku_variant : item.productId === product._id && !item.sku_variant
      );
      
      if (existingItem) {
        return prev.map((item) => 
          variant 
            ? (item.sku_variant === variant.sku_variant ? { ...item, quantity: item.quantity + quantity } : item)
            : (item.productId === product._id && !item.sku_variant ? { ...item, quantity: item.quantity + quantity } : item)
        );
      }
      
      // Create a new local cart item
      const newItem: LocalCartItem = {
        productId: product._id,
        sku_variant: variant?.sku_variant,
        quantity,
        name: product.name,
        slug: product.slug,
        image: variant?.images?.[0] || product.images[0],
        price: variant ? (variant.sale_price || variant.price) : (product.sale_price || product.price),
        attributes: variant ? {
          size: variant.size,
          color: variant.color,
        } : undefined,
        selectedVariant: variant,
      };
      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string, sku_variant?: string) => {
    setItems((prev) => prev.filter((item) => 
      sku_variant 
        ? item.sku_variant !== sku_variant 
        : item.productId !== productId || item.sku_variant !== undefined
    ));
  };

  const updateQuantity = (productId: string, sku_variant: string | undefined, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId, sku_variant);
      return;
    }
    setItems((prev) => prev.map((item) => 
      sku_variant 
        ? (item.sku_variant === sku_variant ? { ...item, quantity } : item)
        : (item.productId === productId && !item.sku_variant ? { ...item, quantity } : item)
    ));
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