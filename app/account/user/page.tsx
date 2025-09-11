"use client";

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import type { RootState, AppDispatch } from '@/lib/redux/store';
import { fetchUserProfile } from '@/lib/redux/slices/userSlice';
import {
  UserCircle,
  Package,
  Heart,
  ShoppingCart,
  MapPin,
  ChevronRight
} from 'lucide-react';
import Navbar  from '@/components/Navbar';
import Footer  from '@/components/Footer';

// A reusable link component for the profile page
const ProfileLink = ({ href, icon: Icon, title, subtitle }: { href: string, icon: React.ElementType, title: string, subtitle: string }) => (
  <Link href={href} className="block">
    <div className="flex items-center p-6 transition-colors duration-200 hover:bg-gray-50">
      <div className="mr-5 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-600">
        <Icon size={24} />
      </div>
      <div className="flex-grow">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
      <ChevronRight size={20} className="text-gray-400" />
    </div>
  </Link>
);

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  // --- CORRECTED: Select state from the appropriate slices ---

  // Get ONLY the authentication status from authSlice.
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  // Get the profile data, loading status, and error from userSlice.
  const { user, status: userStatus, error } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // The authSlice is loaded from localStorage, so its state is available immediately.
    if (isAuthenticated) {
      // If the user is logged in, dispatch the action to fetch their detailed profile.
      // This will update the userSlice.
      dispatch(fetchUserProfile());
    } else {
      // If not authenticated at all, redirect to the login page.
      router.push('/login');
    }
  }, [isAuthenticated, dispatch, router]);

  // Use the status from userSlice to show a loading screen while fetching data.
  if (userStatus === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading your profile...</p>
      </div>
    );
  }

  // Handle fetch error from userSlice.
  if (userStatus === 'failed') {
      return (
          <div className="flex min-h-screen items-center justify-center text-center">
              <div>
                  <h2 className="text-xl text-red-600">Failed to load profile</h2>
                  <p className="text-gray-500">{error || 'An unexpected error occurred.'}</p>
                  <Link href="/">
                     <span className="mt-4 inline-block text-[#D09D13] hover:underline">Go to Homepage</span>
                  </Link>
              </div>
          </div>
      );
  }

  // Render the page only if authenticated and the user data has been successfully fetched.
  if (!isAuthenticated || !user) {
    return null; // This prevents a flicker while redirecting.
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-12 sm:py-16">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* User Info Section */}
          <div className="flex items-center p-6">
            <div className="flex-grow">
              {/* Display data from the userSlice */}
              <h1 className="text-3xl font-bold font-serif text-gray-900">{user.fullName}</h1>
              <p className="mt-1 text-gray-600">{user.email}</p>
            </div>
            <div className="ml-6 flex flex-col items-center text-center">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt="User Avatar"
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <UserCircle size={64} className="text-gray-300" strokeWidth={1} />
              )}
              <Link href="/account/user/edit-profile" className="mt-2 block">
                <span className="text-sm font-medium text-[#D09D13] transition-colors hover:text-[#b48a10]">
                  Edit Profile
                </span>
              </Link>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Navigation Links */}
          <div className="divide-y divide-gray-200">
            <ProfileLink
              href="/account/user/order-history"
              icon={Package}
              title="My Orders"
              subtitle="Track, cancel, or return your orders"
            />
            <ProfileLink
              href="/wishlist"
              icon={Heart}
              title="My Wishlist"
              subtitle="Your collection of favorite products"
            />
            <ProfileLink
              href="/cart"
              icon={ShoppingCart}
              title="My Cart"
              subtitle="View and manage items in your cart"
            />
            <ProfileLink
              href="/account/user/addresses"
              icon={MapPin}
              title="My Addresses"
              subtitle="Manage your shipping and billing addresses"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}