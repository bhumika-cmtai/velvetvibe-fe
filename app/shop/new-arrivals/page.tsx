// src/app/new-arrivals/page.tsx
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
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductGridSkeleton from "@/components/skeleton/ProductGridSkeleton" // Loading state ke liye

// --- Collection Header Component (Isme koi change nahi) ---
const CollectionHeader = () => (
    <div className="relative h-[200px] md:h-[300px] w-full bg-gray-200">
        <Image
            src="https://i.pinimg.com/1200x/ce/fa/bb/cefabbcebea8d7e10f383ba5fd81ec98.jpg"
            alt="Shop Banner"
            fill
            className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl font-serif font-bold">New Arrivals</h1>
            <p className="mt-2 text-xs md:text-sm">Explore the latest additions to our collection.</p>
        </div>
    </div>
);

// --- Main Page Component (Iska naam NewArrivalsPage ho sakta hai, par abhi ke liye same rakhte hain) ---
export default function NewArrivalsPage() {
    const dispatch = useDispatch<AppDispatch>();

    // --- Redux se state la rahe hain ---
    const { items: newArrivalProducts, loading, error } = useSelector((state: RootState) => state.product);

    // --- Local state UI control ke liye ---
    const [sortOption, setSortOption] = useState('newest'); // Default sort newest rakhte hain
    const [categoryFilter, setCategoryFilter] = useState('all');

    // --- Data Fetching Effect ---
    // Component load hone par hamesha 'New' tag wale products fetch karo
    useEffect(() => {
        dispatch(fetchProducts({ tags: 'New' }));
    }, [dispatch]);

    // --- Client-side filtering and sorting ---
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = newArrivalProducts;

        // Category Filtering (Yeh client-side par ho raha hai)
        if (categoryFilter !== 'all') {
            // NOTE: Agar aapke product model mein 'sub_category' field hai, to yeh kaam karega.
            // Agar backend 'type' field use karta hai, to aapko 'p.type.toLowerCase()' use karna hoga.
            filtered = newArrivalProducts.filter(p => p.type && p.type.toLowerCase() === categoryFilter);
        }

        // Sorting
        const sorted = [...filtered];
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
            default: // featured
                break;
        }
        return sorted;
    }, [sortOption, categoryFilter, newArrivalProducts]);

    // ProductCard ke liye data map karein
    const mappedProducts = useMemo(() => filteredAndSortedProducts.map(p => ({
        _id: p._id,
        name: p.name,
        slug: p.slug,
        images: p.images,
        tags: p.tags,
        price: p.sale_price ?? p.price,
        base_price: p.sale_price ? p.price : undefined,
        originalProduct: p,
    })), [filteredAndSortedProducts]);

    return (
        <div className="bg-gray-50">
            <Navbar />
            <CollectionHeader />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* --- Filter & Toolbar --- */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b">
                    {/* Category Filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">Filter:</span>
                        <div className="flex gap-1 bg-gray-200 p-1 rounded-full">
                            <button onClick={() => setCategoryFilter('all')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${categoryFilter === 'all' ? 'bg-black shadow-sm text-white font-semibold' : 'text-gray-600'}`}>All</button>
                            <button onClick={() => setCategoryFilter('clothing')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${categoryFilter === 'clothing' ? 'bg-black shadow-sm text-white font-semibold' : 'text-gray-600'}`}>Clothing</button>
                            <button onClick={() => setCategoryFilter('decorative')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${categoryFilter === 'decorative' ? 'bg-black shadow-sm text-white font-semibold' : 'text-gray-600'}`}>Decorative</button>
                        </div>
                    </div>

                    {/* Sorting */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">Sort By:</span>
                        <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-[160px] h-9 text-sm">
                                <SelectValue placeholder="Sorting" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="featured">Featured</SelectItem>
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
                    <div className="text-center py-20 text-red-500">Failed to load new arrivals.</div>
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
                        <h3 className="mt-2 text-lg font-semibold">No New Arrivals Found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters or check back later!</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}