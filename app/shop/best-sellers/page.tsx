// src/app/best-sellers/page.tsx
"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Navbar  from "@/components/Navbar"
import Footer  from "@/components/Footer"
import ProductCard  from "@/components/ProductCard"
import { products } from "@/lib/data" // Static data
import { Product } from "@/lib/types/product"
import { motion } from "framer-motion"
import { Frown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- Collection Header Component (Responsive) ---
const CollectionHeader = () => (
    <div className="relative h-[200px] md:h-[300px] w-full bg-gray-200">
        <Image 
            src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2070"
            alt="Best Sellers Banner"
            fill
            className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">Best Sellers</h1>
            <p className="mt-2 text-xs md:text-sm">Homepage &gt; Best Sellers</p>
            <p className="mt-4 max-w-xl text-sm md:text-base hidden sm:block">Explore our most popular and top-rated styles, loved by our customers.</p>
        </div>
    </div>
);

// --- Main Page Component ---
export default function BestSellersPage() {
  
  // State Management
  const [sortOption, setSortOption] = useState('featured');
  const [genderFilter, setGenderFilter] = useState('all');

  // Filtering and Sorting Logic
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(p => p.tags?.includes('Hot Sale'));
    if (genderFilter !== 'all') {
      filtered = filtered.filter(p => p.gender && p.gender.toLowerCase() === genderFilter);
    }
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b._id.localeCompare(a._id));
        break;
      default:
        break;
    }
    return filtered;
  }, [sortOption, genderFilter]);

  return (
    <div className="bg-white">
      <Navbar />
      <CollectionHeader />
      
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
              <h3 className="mt-2 text-lg font-semibold">No Best Sellers Found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}