// src/app/tops-tshirts/page.tsx
"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Navbar  from "@/components/Navbar"
import Footer  from "@/components/Footer"
import ProductCard  from "@/components/ProductCard"
import { products } from "@/lib/data" // Static data
import { Product } from "@/lib/types/product"
import { motion } from "framer-motion"
import { LayoutGrid, Rows3, SlidersHorizontal, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- Collection Header Component ---
const CollectionHeader = () => (
    <div className="relative h-[300px] w-full bg-gray-200">
        <Image 
            src="https://i.pinimg.com/1200x/ce/fa/bb/cefabbcebea8d7e10f383ba5fd81ec98.jpg"
            alt="Shop Banner"
            fill
            className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white">
            <h1 className="text-5xl font-serif font-bold">Shop</h1>
            <p className="mt-2 text-sm">Homepage &gt; Shop</p>
            <div className="mt-6 flex items-center space-x-6 text-sm font-semibold tracking-wider">
                {/* <a href="#" className="hover:text-gray-200">T-SHIRT</a>
                <a href="#" className="hover:text-gray-200">DRESS</a>
                <a href="#" className="hover:text-gray-200">TOP</a>
                <a href="#" className="hover:text-gray-200">SWIMWEAR</a>
                <a href="#" className="hover:text-gray-200">SHIRT</a> */}
            </div>
        </div>
    </div>
);

// --- Main Page Component ---
export default function TopsAndTshirtsPage() {
  
  // State Management
  const [sortOption, setSortOption] = useState('featured');
  const [genderFilter, setGenderFilter] = useState('all');
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [gridCols, setGridCols] = useState(4); // 2, 3, or 4

  // Filtering and Sorting Logic
  const filteredAndSortedProducts = useMemo(() => {
    // 1. Initial filter for the page's category
    let filtered = products.filter(p => p.sub_category === 'Tops' || p.sub_category === 'Shirts');

    // 2. Filter by Gender
    if (genderFilter !== 'all') {
      filtered = filtered.filter(p => p.gender && p.gender.toLowerCase() === genderFilter);
    }
    
    // 3. Filter by Sale
    if (onSaleOnly) {
      filtered = filtered.filter(p => p.tags?.includes('Sale'));
    }

    // 4. Sort the results
    switch (sortOption) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        // Assuming higher ID means newer for static data
        filtered.sort((a, b) => b._id.localeCompare(a._id));
        break;
      default: // 'featured'
        // No specific sorting, original order
        break;
    }
    
    return filtered;
  }, [sortOption, genderFilter, onSaleOnly]);

  return (
    <div className="bg-white">
      <Navbar />
      <CollectionHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* --- Filter & Toolbar Section --- */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-4 mb-8 pb-4 border-b">
          {/* Left Side: Filters & View */}
          {/* <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 font-medium text-sm">
              <SlidersHorizontal size={20} /> Filters
            </button>
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
                <button onClick={() => setGridCols(3)} className={`p-1 rounded ${gridCols === 3 ? 'bg-white shadow-sm' : ''}`}><Rows3 size={20} /></button>
                <button onClick={() => setGridCols(4)} className={`p-1 rounded ${gridCols === 4 ? 'bg-white shadow-sm' : ''}`}><LayoutGrid size={20} /></button>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sale-only" checked={onSaleOnly} onCheckedChange={(checked) => setOnSaleOnly(checked as boolean)} />
              <label htmlFor="sale-only" className="text-sm font-medium text-gray-700">Show only products on sale</label>
            </div>
          </div> */}

          {/* Right Side: Product Count, Gender & Sorting */}
          <div className="flex items-center  gap-6">
            <p className="text-sm text-gray-600">{filteredAndSortedProducts.length} Products Found</p>
            
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Gender:</span>
                <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
                    <button onClick={() => setGenderFilter('all')} className={`px-3 py-1 text-sm rounded ${genderFilter === 'all' ? 'bg-white shadow-sm' : ''}`}>All</button>
                    <button onClick={() => setGenderFilter('women')} className={`px-3 py-1 text-sm rounded ${genderFilter === 'women' ? 'bg-white shadow-sm' : ''}`}>Women</button>
                    <button onClick={() => setGenderFilter('men')} className={`px-3 py-1 text-sm rounded ${genderFilter === 'men' ? 'bg-white shadow-sm' : ''}`}>Men</button>
                </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Sort By:</span>
              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
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
        </div>

        {/* --- Product Grid --- */}
        {filteredAndSortedProducts.length > 0 ? (
          <motion.div 
            layout
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${gridCols} gap-x-4 gap-y-8`}
          >
            {filteredAndSortedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}