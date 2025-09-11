// src/app/sale/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import Navbar  from "@/components/Navbar"
import Footer  from "@/components/Footer"
import ProductCard  from "@/components/ProductCard"
import { products } from "@/lib/data" // Static data
import { Product } from "@/lib/types/product"
import { motion } from "framer-motion"
import { Frown, SlidersHorizontal } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

// --- Countdown Timer Component (Responsive) ---
const CountdownTimer = () => {
    const calculateTimeLeft = () => {
        const difference = +new Date("2025-12-31T23:59:59") - +new Date();
        let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };
        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft;
    };
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearTimeout(timer);
    });
    return (
        <div className="flex space-x-4 md:space-x-6">
            {Object.entries(timeLeft).map(([interval, value]) => (
                <div key={interval} className="flex flex-col items-center">
                    <span className="text-2xl md:text-4xl font-mono font-bold">{String(value).padStart(2, '0')}</span>
                    <span className="text-xs uppercase tracking-widest">{interval}</span>
                </div>
            ))}
        </div>
    );
};

// --- Sale Header Component ---
const SaleHeader = () => (
    <div className="relative w-full bg-black">
        <div className="absolute inset-0 opacity-20"><Image src="https://images.unsplash.com/photo-1508056830983- unvexb21d582?q=80&w=2070" alt="Abstract background" fill className="object-cover"/></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4 py-12 md:py-16">
            <p className="font-semibold tracking-widest text-xs md:text-sm uppercase text-red-400">LIMITED TIME OFFER</p>
            <h1 className="text-4xl md:text-7xl font-serif font-bold my-3 md:my-4">Mid-Season Sale</h1>
            <p className="mt-2 max-w-xl text-sm md:text-base text-gray-300">Grab your favorites at unbeatable prices. Up to 50% off on selected items!</p>
            <div className="mt-8"><CountdownTimer /></div>
        </div>
    </div>
);

// --- Main Page Component ---
export default function SalePage() {
  
  const [sortOption, setSortOption] = useState('featured');
  const [genderFilter, setGenderFilter] = useState('all');
  
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => p.tags?.includes('Sale'));
    if (genderFilter !== 'all') {
      filtered = filtered.filter(p => p.gender && p.gender.toLowerCase() === genderFilter);
    }
    switch (sortOption) {
      case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
      case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
      case 'newest': filtered.sort((a, b) => b._id.localeCompare(a._id)); break;
      default: break;
    }
    return filtered;
  }, [sortOption, genderFilter]);

  return (
    <div className="bg-white">
      <Navbar />
      <SaleHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* --- Responsive Filter & Toolbar Section --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b">
          {/* Left Side: Gender Filter */}
          <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">For:</span>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
                  <button onClick={() => setGenderFilter('all')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${genderFilter === 'all' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-600'}`}>All</button>
                  <button onClick={() => setGenderFilter('women')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${genderFilter === 'women' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-600'}`}>Women</button>
                  <button onClick={() => setGenderFilter('men')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${genderFilter === 'men' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-600'}`}>Men</button>
              </div>
          </div>

          {/* Right Side: Sorting */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Sort By:</span>
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[160px] h-9 text-sm">
                <SelectValue placeholder="Sorting" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- Product Grid --- */}
        {filteredAndSortedProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
          >
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
              <Frown className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold">No Sale Products Found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later!</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}