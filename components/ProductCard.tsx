// src/components/ProductCard.tsx
"use client";

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag, Minus, Plus, Check } from 'lucide-react';

// --- UI Components & Hooks ---
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogFooter,
    DialogDescription
} from "@/components/ui/dialog";
import { Product, Variant } from '@/lib/types/product'; 

// --- REDUX & CONTEXT IMPORTS ---
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import { addToCart as addCartToDb } from '@/lib/redux/slices/cartSlice';
import { useCart as useLocalCart } from '@/context/CartContext';

// --- WISHLIST IMPORTS ---
import { 
  addToWishlist as addWishlistToDb, 
  removeFromWishlist as removeWishlistFromDb 
} from '@/lib/redux/slices/wishlistSlice';
import { useWishlist } from '@/context/WishlistContext';

// --- Prop Interfaces ---
interface MappedProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  tags?: string[];
  price: number;
  base_price?: number;
  originalProduct: Product; // Poora product object
}

interface ProductCardProps {
  product: MappedProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, slug, price, base_price, images, tags, originalProduct } = product;
  const variants = originalProduct.variants || [];

  // --- HOOKS & SELECTORS ---
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // --- CONTEXTS ---
  const { addToCart: addCartToLocal } = useLocalCart();
  const { 
    addToWishlist: addWishlistToLocal, 
    removeFromWishlist: removeWishlistFromLocal, 
    isAddedToWishlist 
  } = useWishlist();

  // --- LOCAL STATE FOR DIALOG ---
  const [isVariantSelectorOpen, setIsVariantSelectorOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishlistSuccess, setIsWishlistSuccess] = useState(false);

  // --- MEMOIZED VALUES ---
  const isWishlisted = useMemo(() => {
    if (variants && variants.length > 0) {
      // For products with variants, check if the first variant is in wishlist
      const firstVariant = variants[0];
      return isAddedToWishlist(originalProduct._id, firstVariant.sku_variant);
    }
    return isAddedToWishlist(originalProduct._id);
  }, [isAddedToWishlist, originalProduct._id, variants]);
  const discount = base_price && base_price > price ? Math.round(((base_price - price) / base_price) * 100) : 0;
  
  // --- HANDLER FUNCTIONS ---

  // Jab card par "Add to Cart" click hota hai
  const handlePrimaryAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Link par navigate hone se rokein

    // Agar variants hain to dialog kholo, warna seedhe add karo
    if (variants && variants.length > 0) {
      setSelectedVariant(null); // Purana selection reset karo
      setQuantity(1); // Quantity reset karo
      setIsVariantSelectorOpen(true);
    } else {
      // Simple product (bina variant ke)
      if (isAuthenticated) {
        // Logged-in user ke liye, simple product ke liye default SKU use karein
        dispatch(addCartToDb({ productId: originalProduct._id, sku_variant: 'default', quantity: 1 }));
      } else {
        addCartToLocal(originalProduct);
      }
      setIsAddedToCart(true);
      setTimeout(() => setIsAddedToCart(false), 2000);
      toast({ 
        title: "✅ Added to Cart!", 
        description: `${name} has been added to your cart.`,
        duration: 3000,
        className: "bg-green-50 border-green-200 text-green-800"
      });
    }
  };

  // Jab dialog ke andar se "Add to Cart" click hota hai
  const handleConfirmAddToCart = () => {
    if (!selectedVariant) {
      toast({ title: "Please select a size", variant: "destructive" });
      return;
    }

    if (isAuthenticated) {
      // Logged-in user ke liye backend call
      dispatch(addCartToDb({ 
        productId: originalProduct._id, 
        quantity, 
        sku_variant: selectedVariant.sku_variant // <-- YEH SABSE ZAROORI HAI
      }));
    } else {
      // Guest user ke liye new CartContext interface use karein
      addCartToLocal(originalProduct, selectedVariant, quantity);
    }
    
    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
    toast({ 
      title: "✅ Added to Cart!", 
      description: `${quantity} x ${name} (${selectedVariant.size}) has been added to your cart.`,
      duration: 3000,
      className: "bg-green-50 border-green-200 text-green-800"
    });
    setIsVariantSelectorOpen(false);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const productId = originalProduct._id;

    // For products with variants, we need to handle this differently
    if (variants && variants.length > 0) {
      // For wishlist, we can add even out-of-stock items (users might want to save for later)
      // Use the first variant (available or not) for wishlist
      const firstVariant = variants[0];
      
      // Debug logging to see what variant is being used
       ('ProductCard adding to wishlist:', {
        productName: name,
        firstVariant: firstVariant,
        variantStock: firstVariant?.stock_quantity,
        productStock: originalProduct.stock_quantity || originalProduct.stock_quantity
      });
      
      if (isAuthenticated) {
        // For authenticated users, we still use the simple product ID approach
        // The backend will handle variant selection
        isWishlisted ? dispatch(removeWishlistFromDb(productId)) : dispatch(addWishlistToDb(productId));
      } else {
        // For guest users, we can store the variant information
        const skuVariant = firstVariant.sku_variant;
        isWishlisted ? removeWishlistFromLocal(productId, skuVariant) : addWishlistToLocal(originalProduct, firstVariant);
      }
    } else {
      // Simple product without variants
      if (isAuthenticated) {
        isWishlisted ? dispatch(removeWishlistFromDb(productId)) : dispatch(addWishlistToDb(productId));
      } else {
        isWishlisted ? removeWishlistFromLocal(productId) : addWishlistToLocal(originalProduct);
      }
    }

    setIsWishlistSuccess(true);
    setTimeout(() => setIsWishlistSuccess(false), 2000);

    toast({
      title: isWishlisted ? "❤️ Removed from Wishlist" : "❤️ Added to Wishlist",
      description: `${name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
      duration: 3000,
      className: isWishlisted ? "bg-red-50 border-red-200 text-red-800" : "bg-pink-50 border-pink-200 text-pink-800"
    });
  };

  return (
    <>
      <Link href={`/product/${slug || '#'}`} className="group block">
        <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[3/4]">
          <div className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105">
              <Image 
                src={images[0] || '/placeholder.svg'} 
                alt={name} 
                fill 
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover w-full h-full transition-opacity duration-500 ease-in-out group-hover:opacity-0" 
              />
              {images[1] && 
                <Image 
                  src={images[1]} 
                  alt={`${name} hover view`} 
                  fill 
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  className="object-cover w-full h-full opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100" 
                />
              }
          </div>
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {tags?.includes('Sale') && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">SALE</span>}
            {tags?.includes('New') && <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-in-out z-20">
            <Button 
              onClick={handlePrimaryAddToCartClick} 
              className={`flex-1 shadow-lg rounded-lg font-semibold h-11 transition-all duration-300 delay-100 ${
                isAddedToCart 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isAddedToCart ? (
                <>
                  <Check size={18} className="mr-2"/> Added!
                </>
              ) : (
                <>
                  <ShoppingBag size={18} className="mr-2"/> Add to Cart
                </>
              )}
            </Button>
            <Button 
              onClick={handleToggleWishlist} 
              variant="ghost" 
              size="icon" 
              className={`shadow-lg rounded-lg h-11 w-11 flex-shrink-0 transition-all duration-200 delay-100 ${
                isWishlistSuccess 
                  ? 'bg-pink-500 hover:bg-pink-600' 
                  : 'bg-white hover:bg-gray-200'
              }`}
            >
              <Heart 
                size={18} 
                className={
                  isWishlistSuccess 
                    ? "fill-white text-white" 
                    : isWishlisted 
                      ? "fill-red-500 text-red-500" 
                      : ""
                } 
              />
            </Button>
          </div>
        </div>
        <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors line-clamp-2">{name}</h3>
            <div className="flex items-center gap-2 mt-1">
                <p className="text-base font-bold text-gray-900">₹{price.toFixed(2)}</p>
                {base_price && <p className="text-sm text-gray-500 line-through">₹{base_price.toFixed(2)}</p>}
                {discount > 0 && <p className="text-xs font-bold text-red-500">({discount}% off)</p>}
            </div>
        </div>
      </Link>

      {/* --- Variant Selection Dialog --- */}
      <Dialog open={isVariantSelectorOpen} onOpenChange={setIsVariantSelectorOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-serif text-gray-800">Select Options</DialogTitle>
            <DialogDescription>{name}</DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-6">
            <div>
              <label className="text-sm font-semibold text-gray-700">Size:</label>
              <div className="flex flex-wrap gap-3 mt-2">
                {variants.map((variant) => (
                  <Button 
                    key={variant.sku_variant}
                    variant={selectedVariant?.sku_variant === variant.sku_variant ? "default" : "outline"}
                    onClick={() => setSelectedVariant(variant)}
                    disabled={variant.stock_quantity === 0}
                    className="disabled:opacity-40 disabled:cursor-not-allowed relative"
                  >
                    {variant.size}
                    {variant.stock_quantity === 0 && (
                      <span className="absolute h-full w-full bg-white/60 flex items-center justify-center text-xs font-bold text-gray-500">OUT</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">Quantity:</label>
              <div className="flex items-center border rounded-lg w-fit mt-2">
                  <Button variant="ghost" size="icon" className="h-10 w-10 rounded-r-none" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus className="h-4 w-4" /></Button>
                  <span className="px-4 font-bold text-lg w-16 text-center">{quantity}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-l-none"
                    onClick={() => setQuantity(q => Math.min(selectedVariant?.stock_quantity || 1, q + 1))}
                    disabled={!selectedVariant || quantity >= selectedVariant.stock_quantity}
                  ><Plus className="h-4 w-4" /></Button>
              </div>
               {selectedVariant && <p className="text-xs text-gray-500 mt-1">{selectedVariant.stock_quantity} pieces available</p>}
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button 
              type="button" 
              className="w-full bg-black text-white hover:bg-gray-800 h-12 text-base font-bold rounded-lg"
              onClick={handleConfirmAddToCart}
              disabled={!selectedVariant}
            >
              Add to Cart - ₹{(selectedVariant ? (selectedVariant.sale_price || selectedVariant.price) * quantity : price * quantity).toLocaleString()}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductCard;