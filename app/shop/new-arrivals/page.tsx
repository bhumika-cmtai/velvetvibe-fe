// src/app/new-arrivals/page.tsx
"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import { products } from "@/lib/data" // Static data
import { Product } from "@/lib/types/product"
import { motion } from "framer-motion"
import { Frown } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// --- Collection Header Component (Responsive) ---
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
            <p className="mt-2 text-xs md:text-sm">Homepage &gt; new arrivals</p>
        </div>
    </div>
);

// --- Main Page Component ---
export default function TopsAndTshirtsPage() {

    // State Management
    const [sortOption, setSortOption] = useState('featured');
    const [categoryFilter, setCategoryFilter] = useState('all');

    // Filtering and Sorting Logic
    const filteredAndSortedProducts = useMemo(() => {
        let filtered = products;

        // Category Filtering
        if (categoryFilter !== 'all') {
            filtered = products.filter(p => p.sub_category && p.sub_category.toLowerCase() === categoryFilter);
        }

        // Sorting
        // Create a new array to avoid mutating the original filtered list
        const sorted = [...filtered];
        switch (sortOption) {
            case 'price-asc':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                sorted.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                sorted.sort((a, b) => b._id.localeCompare(a._id));
                break;
            default:
                break;
        }
        return sorted;
    }, [sortOption, categoryFilter]);

    return (
        <div className="bg-[var(--base-10)]/40">
            <Navbar />
            <CollectionHeader />

            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* --- Responsive Filter & Toolbar Section --- */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b">
                    {/* Left Side: Category Filter */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold">Filter:</span>
                        <div className="flex gap-1 bg-[var(--base-10)] p-1 rounded-full">
                            <button onClick={() => setCategoryFilter('all')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${categoryFilter === 'all' ? 'bg-[var(--pallete-100)] shadow-sm text-white font-semibold' : 'text-gray-600'}`}>All</button>
                            <button onClick={() => setCategoryFilter('tops')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${categoryFilter === 'tops' ? 'bg-[var(--pallete-100)] shadow-sm text-white font-semibold' : 'text-gray-600'}`}>Tops</button>
                            <button onClick={() => setCategoryFilter('shirts')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${categoryFilter === 'shirts' ? 'bg-[var(--pallete-100)] shadow-sm text-white font-semibold' : 'text-gray-600'}`}>Shirts</button>
                            <button onClick={() => setCategoryFilter('jeans')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${categoryFilter === 'jeans' ? 'bg-[var(--pallete-100)] shadow-sm text-white font-semibold' : 'text-gray-600'}`}>Jeans</button>
                            <button onClick={() => setCategoryFilter('dresses')} className={`px-4 py-1.5 text-sm rounded-full transition-colors ${categoryFilter === 'dresses' ? 'bg-[var(--pallete-100)] shadow-sm text-white font-semibold' : 'text-gray-600'}`}>Dress</button>
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
                        <h3 className="mt-2 text-lg font-semibold">No Products Found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}