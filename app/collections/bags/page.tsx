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

// Bags ke liye sub-categories (aap ise apne data ke anusaar badal sakte hain)
const subCategories = ["All", "Handbags", "Clutches", "Totes", "Sling Bags"];

export default function BagsCollectionPage() {
  const dispatch = useDispatch()
  
  // Redux store se pagination ke liye totalPages nikalenge
  const { items: fetchedProducts, loading, error, totalPages } = useSelector(
    (state: RootState) => state.product
  )

  const productsToFilter = fetchedProducts as Product[]

  // Bags ke liye price range
  const minPrice = 500
  const maxPrice = 15000

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [activeSubCategory, setActiveSubCategory] = useState("All")
  const [currentPage, setCurrentPage] = useState(1)

  // Main data fetching logic jo filter change par chalega
  useEffect(() => {
    const apiParams: { 
      type: string; 
      limit: number; 
      page: number;
      category?: string; // Backend 'category' expect karega
    } = {
      type: "bag", // API se 'bag' type ke products fetch kar rahe hain
      limit: 12,
      page: currentPage,
    };
    
    // Category filter
    if (activeSubCategory !== "All") {
      apiParams.category = activeSubCategory;
    }
    
    dispatch(fetchProducts(apiParams) as any)
  }, [dispatch, activeSubCategory, currentPage]) // Jab bhi category ya page badlega, data fetch hoga

  // Jab category badle, to page 1 par aa jao
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSubCategory]);

  // Client-side par ab sirf price filter hoga
  const filteredProducts = useMemo(() => {
    return productsToFilter.filter((p) => {
      return p.price >= priceRange[0] && p.price <= priceRange[1]
    })
  }, [productsToFilter, priceRange])

  // Filters reset karne ka function
  const resetFilters = useCallback(() => {
    setActiveSubCategory("All")
    setPriceRange([minPrice, maxPrice])
    setCurrentPage(1)
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

  // Page change karne ke handlers
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
            title="Bags Collection"
            subtitle="Explore our stylish and elegant collection of bags for every occasion."
            isSparkling={true}
            className="mb-12"
          />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {/* Category Dropdown */}
          {/* <Select value={activeSubCategory} onValueChange={setActiveSubCategory}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {subCategories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent> */}
          {/* </Select> */}

          {/* Price Dropdown */}
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

          {/* Reset Button */}
          <Button
            variant="ghost"
            onClick={resetFilters}
            className="space-x-2 text-muted-foreground"
          >
            <X className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Loading Bags...
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

            {/* PAGINATION UI */}
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
              No Bags Found
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