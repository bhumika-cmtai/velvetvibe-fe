"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

import { loginUserApi } from '@/lib/api/auth';
import { loginSuccess } from '@/lib/redux/slices/authSlice';
import { mergeCarts, fetchCart } from '@/lib/redux/slices/cartSlice';
import { AppDispatch } from '@/lib/redux/store';

import { useCart } from "@/context/CartContext";
import { useWishlist as useLocalWishlist } from "@/context/WishlistContext";
import { mergeWishlist, fetchWishlist } from "@/lib/redux/slices/wishlistSlice";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { items: localCartItems, clearCart: clearLocalCart } = useCart();
  const { items: localWishlistItems, clearWishlist: clearLocalWishlist } = useLocalWishlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await loginUserApi({ email, password });
      const { user, accessToken } = response.data;
      
      // First dispatch login success
      dispatch(loginSuccess({ user, accessToken }));
      
      // Set cookie for middleware (important for live server)
      document.cookie = `accessToken=${accessToken}; path=/; secure; SameSite=strict; max-age=${7 * 24 * 60 * 60}`;
      
      toast.success('Logged in successfully');
      
      // Handle cart merging
      if (localCartItems && localCartItems.length > 0) {
        toast.info("Syncing your cart...");
        const itemsToMerge = localCartItems.map(item => ({ 
          productId: item.productId,
          sku_variant: item.sku_variant || 'default',
          quantity: item.quantity 
        }));
        
        await dispatch(mergeCarts(itemsToMerge));
        await dispatch(fetchCart());
        clearLocalCart();
        toast.success("Cart synced successfully!");
      }

      // Handle wishlist merging
      if (localWishlistItems && localWishlistItems.length > 0) {
        toast.info("Syncing your wishlist...");
        const productIdsToMerge = localWishlistItems.map(item => item._id);
        
        await dispatch(mergeWishlist(productIdsToMerge));
        await dispatch(fetchWishlist());
        clearLocalWishlist();
        toast.success("Wishlist synced successfully!");
      }

      console.log("----user----", user);
      console.log("----user role----", user.role);
      
      // Add a small delay to ensure cookie is set
      setTimeout(() => {
        if (user.role === 'admin') {
          console.log("---------Redirecting to admin dashboard---------");
          // Use window.location for more reliable redirect on live server
          window.location.href = '/account/admin';
        } else {
          console.log("---------Redirecting to home---------");
          window.location.href = '/';
        }
      }, 500);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'An unknown error occurred.';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl border bg-white p-10 shadow-sm">
        <div>
          <h2 className="text-center text-3xl font-bold">Sign in to your account</h2>
           <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link href="/signup" className="font-medium text-[#D09D13] hover:text-[#b48a10]">
              create a new account
            </Link>
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Button type="submit" className="w-full bg-[var(--primary-button-theme)] hover:bg-[var(--secondary-button-theme)] text-[var(--primary-button-text)] hover:text-[var(--secondary-button-text)]" disabled={isLoading}>
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}