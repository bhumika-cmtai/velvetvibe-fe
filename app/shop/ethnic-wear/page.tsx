// src/app/ethnic-wear/page.tsx
"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Frown } from "lucide-react"

// --- Redux Imports (Naye imports) ---
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchProducts } from "@/lib/redux/slices/productSlice"

// --- Component Imports ---
import Navbar  from "@/components/Navbar"
import Footer  from "@/components/Footer"
import ProductCard  from "@/components/ProductCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton" // Loading state ke liye

// --- Ethnic Collection Header (Isme koi change nahi) ---
const CollectionHeader = () => (
    <div className="relative h-[250px] md:h-[350px] w-full bg-[#FFF8F0]">
        <div className="absolute top-0 right-0 h-full w-1/3 hidden md:block">
            <Image 
                src="/ethenicmodel.png"
                alt="Ethnic Wear Banner"
                fill
                className="object-contain object-right-bottom" // Changed to contain for better image fit
            />
        </div>
        <div className="relative z-10 flex flex-col items-center md:items-start justify-center h-full text-center md:text-left container mx-auto px-4 sm:px-6 lg:px-8">
            <p className="font-semibold tracking-widest text-sm uppercase text-amber-700">TIMELESS ELEGANCE</p>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 mt-2">Ethnic Collection</h1>
            <p className="mt-4 max-w-md text-gray-600">Discover traditional wear reimagined for the modern wardrobe.</p>
        </div>
    </div>
);

// --- Main Page Component (Isme major changes hain) ---
export default function EthnicWearPage() {
  const dispatch = useDispatch<AppDispatch>();

  // --- Redux se state la rahe hain ---
  const { items: ethnicProducts, loading, error } = useSelector((state: RootState) => state.product);
  
  // --- Local state UI control ke liye ---
  const [sortOption, setSortOption] = useState('featured');
  const [genderFilter, setGenderFilter] = useState('all');

  // --- Data Fetching Effect ---
  // Yeh effect component load hone par aur gender filter change hone par chalega
  useEffect(() => {
    const queryParams: { tags: string, gender?: string } = {
        tags: 'Ethnic' // Hamesha 'Ethnic' tag wale products fetch karo
        // Note: Agar aapke backend mein tag 'Ethnic Wear' hai to yahan 'Ethnic Wear' likhein
    };

    if (genderFilter !== 'all') {
        queryParams.gender = genderFilter;
    }

    dispatch(fetchProducts(queryParams));
  }, [dispatch, genderFilter]);

  // --- Client-side sorting ke liye useMemo ---
  const sortedProducts = useMemo(() => {
    const sorted = [...ethnicProducts]; // Redux se aaye products ki copy banayein
    switch (sortOption) {
      case 'price-asc':
        sorted.sort((a, b) => (a.sale_price ?? a.price) - (b.sale_price ?? b.price));
        break;
      case 'price-desc':
        sorted.sort((a, b) => (b.sale_price ?? b.price) - (a.sale_price ?? a.price));
        break;
      case 'newest':
        sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      default: // 'featured'
        break;
    }
    return sorted;
  }, [sortOption, ethnicProducts]);

  // ProductCard ke liye data map karein
  const mappedProducts = useMemo(() => sortedProducts.map(p => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    images: p.images,
    tags: p.tags,
    price: p.sale_price ?? p.price,
    base_price: p.sale_price ? p.price : undefined,
    originalProduct: p,
  })), [sortedProducts]);

  return (
    <div className="bg-white">
      <Navbar />
      <CollectionHeader />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* --- Filter & Toolbar --- */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b">
          <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">For:</span>
              <div className="flex gap-1 bg-gray-100 p-1 rounded-full">
                  <button onClick={() => setGenderFilter('all')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${genderFilter === 'all' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-600'}`}>All</button>
                  <button onClick={() => setGenderFilter('women')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${genderFilter === 'women' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-600'}`}>Women</button>
                  <button onClick={() => setGenderFilter('men')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${genderFilter === 'men' ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-600'}`}>Men</button>
              </div>
          </div>
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

        {/* --- Product Grid with Loading/Error/Empty States --- */}
        {loading ? (
            <ProductGridSkeleton count={8} />
        ) : error ? (
            <div className="text-center py-20 text-red-500">Failed to load products.</div>
        ) : mappedProducts.length > 0 ? (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
          >
            {mappedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20 border-2 border-dashed rounded-2xl">
              <Frown className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-semibold">No Ethnic Wear Found</h3>
              <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later!</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  )
}