"use client"

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/lib/redux/store';
import { selectIsAuthenticated } from '@/lib/redux/slices/authSlice';
import { addToCart, fetchCart } from '@/lib/redux/slices/cartSlice';
import { addToWishlist, fetchWishlist } from '@/lib/redux/slices/wishlistSlice';

interface LocalCartItem {
  _id: string;
  quantity: number;
}

interface LocalWishlistItem {
  _id: string;
}

export const AuthHandler = () => {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  const hasMerged = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !hasMerged.current) {
      
      const mergeData = async () => {
        console.log("User logged in. Starting local data merge...");

        const localCart = localStorage.getItem("luv-kush-cart");
        if (localCart) {
          const cartItems: LocalCartItem[] = JSON.parse(localCart);
          if (cartItems.length > 0) {
            console.log(`Merging ${cartItems.length} items to database cart...`);
            await Promise.all(
              cartItems.map(item => 
                dispatch(addToCart({ productId: item._id, quantity: item.quantity }))
              )
            );
            localStorage.removeItem("luv-kush-cart");
            console.log("Local cart cleared.");
          }
        }

        const localWishlist = localStorage.getItem("luv-kush-wishlist");
        if (localWishlist) {
          const wishlistItems: LocalWishlistItem[] = JSON.parse(localWishlist);
          if (wishlistItems.length > 0) {
            console.log(`Merging ${wishlistItems.length} items to database wishlist...`);
            await Promise.all(
              wishlistItems.map(item => 
                dispatch(addToWishlist(item._id))
              )
            );
            localStorage.removeItem("luv-kush-wishlist");
            console.log("Local wishlist cleared.");
          }
        }
        
        console.log("Re-fetching cart and wishlist from server...");
        dispatch(fetchCart());
        dispatch(fetchWishlist());
        
        hasMerged.current = true;
      };

      mergeData();
    }
    
    if (!isAuthenticated) {
      hasMerged.current = false;
    }

  }, [isAuthenticated, dispatch]);

  return null;
};