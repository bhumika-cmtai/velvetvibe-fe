// app/profile/page.tsx

"use client";

// --- FIX START: Imported useState to manage loading state ---
import { useEffect, useState } from 'react';
// --- FIX END ---
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { RootState } from '@/lib/redux/store';
import {
  UserCircle,
  Package,
  Heart,
  ShoppingCart,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const ProfileLink = ({ href, icon: Icon, title, subtitle }: { href: string, icon: React.ElementType, title: string, subtitle: string }) => (
  <Link href={href}>
    <div className="flex items-center p-4 transition-colors hover:bg-gray-50">
      <div className="mr-4 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-600">
        <Icon size={22} />
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
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const router = useRouter();
  // --- FIX START: Added loading state to prevent hydration mismatch ---
  const [isLoading, setIsLoading] = useState(true);
  // --- FIX END ---

  useEffect(() => {
    // If the check has been performed and the user is not authenticated, redirect.
    if (!isAuthenticated) {
      router.push('/login');
    } else {
      // If authenticated, we can stop loading and show the content.
      setIsLoading(false);
    }
  }, [isAuthenticated, router]);

  // --- FIX START: Render a loading state or null until client-side check is complete ---
  if (isLoading) {
    // You can return a full-page loader here for better UX
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }
  // --- FIX END ---

  // At this point, isLoading is false and we are sure the user is authenticated.
  // The user object should also be available.
  if (!user) {
    return null; // Should not happen if isLoading is false, but good for safety
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto max-w-4xl px-4 py-12">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* User Info Section */}
          <div className="flex items-center p-6">
            <div className="flex-grow">
              <h1 className="text-2xl font-bold text-gray-900">{user.fullName}</h1>
              <p className="text-gray-600">{user.phoneNumber}</p>
            </div>
            <div className="ml-6 flex flex-col items-center">
              <UserCircle size={64} className="text-gray-300" strokeWidth={1} />
              <Link href="/profile/edit">
                <span className="mt-2 text-sm font-medium text-[#D09D13] hover:text-[#b48a10]">
                  Edit Profile
                </span>
              </Link>
            </div>
          </div>

          <hr />

          {/* Navigation Links */}
          <div>
            <ProfileLink
              href="/account/orders"
              icon={Package}
              title="My Orders"
              subtitle="Track, cancel, or return your orders"
            />
            <hr />
            <ProfileLink
              href="/wishlist"
              icon={Heart}
              title="My Wishlist"
              subtitle="Your collection of favorite products"
            />
            <hr />
            <ProfileLink
              href="/cart"
              icon={ShoppingCart}
              title="My Cart"
              subtitle="View and manage items in your cart"
            />
            <hr />
            <ProfileLink
              href="/account/addresses"
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