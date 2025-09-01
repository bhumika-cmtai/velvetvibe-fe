"use client"
import { useState, useMemo, useEffect, useCallback } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SectionTitle } from "@/components/SectionTitle"
import { ProductCard } from "@/components/ProductCard"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, X } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// --- REDUX IMPORTS ---
import { useDispatch, useSelector } from "react-redux"
import { fetchProducts } from "@/lib/redux/slices/productSlice"
import { RootState } from "@/lib/redux/store"

import type { Product } from "@/lib/data"

const subCategories = ["All", "Rings", "Earrings", "Necklaces", "Bracelets"];

export default function WomenSilverJewelleryPage() {
  const dispatch = useDispatch()
  
  // Redux store se totalPages bhi nikalenge
  const { items: fetchedProducts, loading, error, totalPages } = useSelector(
    (state: RootState) => state.product
  )

  const productsToFilter = fetchedProducts as Product[]

  const minPrice = 100
  const maxPrice = 10000

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [activeSubCategory, setActiveSubCategory] = useState("All")
  // 1. Current page ke liye ek naya state banayenge
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const apiParams: { 
      materialType: string; 
      limit: number; 
      gender: string; 
      jewelleryCategory?: string;
      page?: number; // Page number bhi API request mein jayega
    } = {
      materialType: "silver",
      limit: 12, // Page par 12 products dikhayenge, aap isse badal sakte hain
      gender: "Female",
      page: currentPage, // Current page ka state yahan use hoga
    };
    
    if (activeSubCategory !== "All") {
      apiParams.jewelleryCategory = activeSubCategory;
    }
    
    dispatch(fetchProducts(apiParams) as any)
  }, [dispatch, activeSubCategory, currentPage]) // Dependency mein currentPage add kiya hai

  // 2. Jab bhi category change hogi, page number ko 1 par reset kar denge
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubCategory]);


  const filteredProducts = useMemo(() => {
    return productsToFilter.filter((p) => {
      return p.price >= priceRange[0] && p.price <= priceRange[1]
    })
  }, [productsToFilter, priceRange])

  const resetFilters = useCallback(() => {
    setActiveSubCategory("All") 
    setPriceRange([minPrice, maxPrice])
    setCurrentPage(1); // Reset par bhi page 1 kar denge
  }, [])

  const handlePriceRangeChange = (newRange: number[]) => {
    if (
      newRange.length === 2 &&
      typeof newRange[0] === "number" &&
      typeof newRange[1] === "number"
    ) {
      setPriceRange(newRange as [number, number])
    }
  }

  // 3. Page change karne ke liye handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link href="/" className="mb-8 inline-block">
            <Button variant="ghost" className="space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <SectionTitle
            title="Women's Silver Jewellery"
            subtitle="Explore our exquisite collection of handcrafted silver jewellery, designed for the modern woman."
            isSparkling={true}
            className="mb-12"
          />
        </motion.div>

        {/* Filters Section */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {/* Baki ke filters waise hi rahenge */}
          <Select value={activeSubCategory} onValueChange={setActiveSubCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {subCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-[240px] text-left font-normal justify-start"
              >
                <span>
                  {`Price: ₹${priceRange[0].toLocaleString()} - ₹${priceRange[1].toLocaleString()}`}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-64 p-4"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <DropdownMenuLabel>Price Range</DropdownMenuLabel>
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                min={minPrice}
                max={maxPrice}
                step={100}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant="ghost"
            onClick={resetFilters}
            className="space-x-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Product Grid Section */}
        {loading ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Loading Products...
            </h2>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">
            <h2 className="text-2xl font-semibold mb-4">Error: {error}</h2>
            <p className="text-gray-500">Please try again later.</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
            
            {/* 4. PAGINATION UI YAHAN ADD KIYA HAI */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center space-x-4">
                <Button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                  variant="outline"
                >
                  Previous
                </Button>
                <span className="text-lg font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  variant="outline"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-20"
          >
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              No Products Found
            </h2>
            <p className="text-gray-500">
              Try adjusting your filters or use the 'Reset' button to see all
              items.
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}