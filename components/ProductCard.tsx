// src/components/ProductCard.tsx
import React, { useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

// --- UI Components & Hooks ---
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { Product } from '@/lib/types/product';

// --- REDUX & CONTEXT IMPORTS ---
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import { addToCart as addCartToDb } from '@/lib/redux/slices/cartSlice';
import { useCart as useLocalCart } from '@/context/CartContext';

// --- WISHLIST IMPORTS (Redux and Context) ---
import { 
  addToWishlist as addWishlistToDb, 
  removeFromWishlist as removeWishlistFromDb 
} from '@/lib/redux/slices/wishlistSlice';
import { useWishlist } from '@/context/WishlistContext';

// Prop Interface
interface MappedProduct {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  tags?: string[];
  price: number;
  base_price?: number;
  originalProduct: Product;
}

interface ProductCardProps {
  product: MappedProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { name, slug, price, base_price, images, tags, originalProduct } = product;

  // --- HOOKS & SELECTORS ---
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // --- CONTEXTS with ALIASES ---
  const { addToCart: addCartToLocal } = useLocalCart();
  
  // --- YEH LINE THEEK KAR DI GAYI HAI (THIS LINE IS FIXED) ---
  const { 
    addToWishlist: addWishlistToLocal, 
    removeFromWishlist: removeWishlistFromLocal, 
    isAddedToWishlist 
  } = useWishlist();

  const isWishlisted = useMemo(() => isAddedToWishlist(originalProduct._id), [isAddedToWishlist, originalProduct._id]);

  const discount = base_price && base_price > price 
    ? Math.round(((base_price - price) / base_price) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    if (isAuthenticated) {
      dispatch(addCartToDb({ productId: originalProduct._id, quantity: 1 }));
    } else {
      addCartToLocal(originalProduct);
    }
    toast({
      title: "Added to Cart",
      description: `${name} has been added to your cart.`,
    });
  };

  // --- YEH FUNCTION AB AUTHENTICATION CHECK KAREGA (THIS FUNCTION NOW CHECKS AUTH) ---
  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault(); 
    const productId = originalProduct._id;

    if (isAuthenticated) {
      // --- LOGGED-IN USER LOGIC ---
      if (isWishlisted) {
        dispatch(removeWishlistFromDb(productId));
      } else {
        dispatch(addWishlistToDb(productId));
      }
    } else {
      // --- GUEST USER LOGIC ---
      if (isWishlisted) {
        removeWishlistFromLocal(productId);
      } else {
        addWishlistToLocal(originalProduct);
      }
    }

    toast({
      title: isWishlisted ? "Removed from Wishlist" : "Added to Wishlist",
      description: `${name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
    });
  };

  // --- RENDER LOGIC (No changes below this line) ---
  return (
    <Link href={`/product/${slug || '#'}`} className="group block">
      <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[3/4]">
        <div className="absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105">
            <Image 
              src={images[0] || '/placeholder.svg'} 
              alt={name} 
              fill 
              className="object-cover w-full h-full transition-opacity duration-500 ease-in-out group-hover:opacity-0" 
            />
            {images[1] && 
              <Image 
                src={images[1]} 
                alt={`${name} hover view`} 
                fill 
                className="object-cover w-full h-full opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100" 
              />
            }
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-in-out z-10"></div>
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
          {tags?.includes('Sale') && <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">SALE</span>}
          {tags?.includes('New') && <span className="bg-blue-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">NEW</span>}
        </div>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 ease-in-out z-20">
          <Button onClick={handleAddToCart} className="flex-1 bg-white text-black hover:bg-gray-200 shadow-lg rounded-lg font-semibold h-11 transition-all duration-300 delay-100">
            <ShoppingBag size={18} className="mr-2"/> Add to Cart
          </Button>
          <Button onClick={handleToggleWishlist} variant="ghost" size="icon" className="bg-white hover:bg-gray-200 shadow-lg rounded-lg h-11 w-11 flex-shrink-0 transition-all duration-200 delay-100">
            <Heart size={18} className={isWishlisted ? "fill-red-500 text-red-500" : ""} />
          </Button>
        </div>
      </div>
      <div className="mt-4">
          <h3 className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
              <p className="text-base font-bold text-gray-900">₹{price.toFixed(2)}</p>
              {base_price && <p className="text-sm text-gray-500 line-through">₹{base_price.toFixed(2)}</p>}
              {discount > 0 && <p className="text-xs font-bold text-red-500">({discount}% off)</p>}
          </div>
      </div>
    </Link>
  );
};

export default ProductCard;