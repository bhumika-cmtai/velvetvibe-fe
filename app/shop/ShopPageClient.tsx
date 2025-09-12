// /shop/ShopPageClient.tsx
"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import ProductCard from "@/components/ProductCard"
import { FiltersSidebar } from "@/components/FiltersSidebar"
import { products } from "@/lib/data"
import { Product } from "@/lib/types/product"
import { motion } from "framer-motion"
import { Frown, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"

// --- UPDATED FILTER CONFIGURATION ---
const filterGroups = [
  // { 
  //   id: "gender", 
  //   label: "Gender", 
  //   options: [ 
  //     { id: "Men", label: "Men" }, 
  //     { id: "Women", label: "Women" }, 
  //     { id: "Unisex", label: "Unisex" } 
  //   ] 
  // },
  { 
    id: "sub_category", 
    label: "Category", 
    options: [ 
      { id: "Shirts", label: "Shirts" }, 
      { id: "T-Shirts", label: "T-Shirts" }, // ADDED
      { id: "Tops", label: "Tops" },
      { id: "Sweaters", label: "Sweaters" }, // ADDED
      { id: "Dresses", label: "Dresses" },   // ADDED
      { id: "Outerwear", label: "Outerwear" }, // ADDED
      { id: "Jeans", label: "Jeans" },
      { id: "Swimwear", label: "Swimwear" },
      { id: "Ethnic Wear", label: "Ethnic Wear" } 
    ] 
  },
  { 
    id: "price", 
    label: "Price Range", 
    options: [ 
      { id: "0-20", label: "Under ₹20" }, 
      { id: "20-40", label: "₹20 - ₹40" }, 
      { id: "40-100", label: "₹40 - ₹100" }, 
      { id: "100+", label: "Above ₹100" } 
    ] 
  },
  { 
    id: "brand", 
    label: "Brand", 
    options: [ 
      { id: "Urban Threads", label: "Urban Threads" }, 
      { id: "Gentlemen Co.", label: "Gentlemen Co." }, 
      { id: "Summer Ease", label: "Summer Ease" }, 
      { id: "Chic Wear", label: "Chic Wear" }, 
      { id: "Bella Grace", label: "Bella Grace" },
      { id: "Modern Muse", label: "Modern Muse" } 
    ] 
  },
]

export default function ShopPageClient() {
  const searchParams = useSearchParams()
  
  const allProducts: Product[] = products;
  const loading = false;
  const error = null;

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const initialFilters: Record<string, string[]> = {};
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      initialFilters.sub_category = [categoryParam];
    }
    return initialFilters;
  });

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const newGroupFilters = prev[groupId] ? [...prev[groupId]] : [];
      if (checked) {
        if (!newGroupFilters.includes(optionId)) newGroupFilters.push(optionId);
      } else {
        const index = newGroupFilters.indexOf(optionId);
        if (index > -1) newGroupFilters.splice(index, 1);
      }
      if (newGroupFilters.length === 0) {
        const { [groupId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [groupId]: newGroupFilters };
    });
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedFilters({})
    setCurrentPage(1)
  };

  const filteredProducts = allProducts.filter(product => {
    return Object.entries(selectedFilters).every(([groupId, selectedOptions]) => {
      if (selectedOptions.length === 0) return true;
      if (groupId === 'price') {
        return selectedOptions.some(range => {
          const [min, max] = range.split('-').map(Number);
          const price = product.price;
          if (range.endsWith('+')) return price >= min;
          return price >= min && price <= max;
        });
      }
      const productValue = (product as any)[groupId];
      if (Array.isArray(productValue)) {
        return productValue.some(val => selectedOptions.includes(val));
      }
      return selectedOptions.includes(productValue);
    });
  });

  const totalProducts = filteredProducts.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * productsPerPage, currentPage * productsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--base-100)] rounded-2xl p-8 text-center mb-12">
            <h1 className="text-4xl font-serif font-bold text-[var(--text-primary)]">All Products</h1>
            <p className="mt-2 text-[var(--text-secondary)] max-w-lg mx-auto">Discover our curated collection of fashion essentials. Quality pieces for your modern wardrobe.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <FiltersSidebar filters={filterGroups} selectedFilters={selectedFilters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters}/>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
              <p className="text-sm text-[var(--text-secondary)]">Showing <span className="font-semibold text-[var(--text-primary)]">{paginatedProducts.length}</span> of <span className="font-semibold text-[var(--text-primary)]">{totalProducts}</span> products</p>
              <div className="flex items-center gap-2">
                 <span className="text-sm font-medium">Sort by:</span>
                 <Button variant="ghost" className="h-auto py-1 px-3">Featured <ChevronDown size={14} className="ml-1" /></Button>
              </div>
            </div>
            {loading ? ( <p>Loading...</p> ) 
             : error ? ( <p className="text-red-500">Error: {error}</p> ) 
             : paginatedProducts.length > 0 ? (
                <>
                  <motion.div layout className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {paginatedProducts.map((product) => (
                      <ProductCard key={product._id} product={product} />
                    ))}
                  </motion.div>
                  <div className="flex justify-center items-center mt-10 gap-2 flex-wrap">
                    <Button variant="outline" disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</Button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Button key={i + 1} onClick={() => setCurrentPage(i + 1)} variant={currentPage === i + 1 ? 'default' : 'outline'}>{i + 1}</Button>
                    ))}
                    <Button variant="outline" disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-20 border-2 border-dashed rounded-2xl">
                  <Frown className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-semibold">No products found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                  <Button onClick={handleClearFilters} variant="link" className="mt-4">Clear all filters</Button>
                </div>
              )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}