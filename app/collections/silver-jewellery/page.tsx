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

// Sub-categories ki fixed list
const subCategories = ["All", "Rings", "Earrings", "Necklaces", "Bracelets", "Anklet", "Jhumkas"];
// 1. Gender filter ke liye options
const genderOptions = ["All Genders", "Women", "Men"];


export default function SilverJewelleryPage() {
  const dispatch = useDispatch()
  const { items: fetchedProducts, loading, error } = useSelector(
    (state: RootState) => state.product
  )

  const productsToFilter = fetchedProducts as Product[]

  const minPrice = 100
  const maxPrice = 10000

  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice])
  const [activeSubCategory, setActiveSubCategory] = useState("All")
  // 2. Gender filter ke liye naya state
  const [activeGender, setActiveGender] = useState("All Genders");

  // useEffect ab category aur gender, dono par depend karega
  useEffect(() => {
    const apiParams: { 
      type: string;
      materialType: string; 
      limit: number; 
      jewelleryCategory?: string;
      gender?: string; // Gender parameter add kiya
    } = {
      type: "jewellery",
      materialType: "silver",
      limit: 100,
    };
    
    // Category filter logic
    if (activeSubCategory !== "All") {
      apiParams.jewelleryCategory = activeSubCategory;
    }
    
    // 3. Gender filter logic
    if (activeGender !== "All Genders") {
      // "Women" ko "Female" aur "Men" ko "Male" mein convert karke bhejenge
      apiParams.gender = activeGender === 'Women' ? 'Female' : 'Male';
    }
    
    dispatch(fetchProducts(apiParams) as any)
  }, [dispatch, activeSubCategory, activeGender]) // Dependency mein activeGender add kiya

  // Client-side filtering sirf price ke liye hogi
  const filteredProducts = useMemo(() => {
    return productsToFilter.filter((p) => {
      return p.price >= priceRange[0] && p.price <= priceRange[1]
    })
  }, [productsToFilter, priceRange])

  // Reset filters
  const resetFilters = useCallback(() => {
    setActiveSubCategory("All")
    setActiveGender("All Genders"); // 4. Gender filter ko bhi reset karenge
    setPriceRange([minPrice, maxPrice])
  }, [])

  // Handle slider change
  const handlePriceRangeChange = (newRange: number[]) => {
    if (
      newRange.length === 2 &&
      typeof newRange[0] === "number" &&
      typeof newRange[1] === "number"
    ) {
      setPriceRange(newRange as [number, number])
    }
  }

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
            title="Silver Jewellery Collection"
            subtitle="Discover the timeless elegance of our handcrafted sterling silver pieces, perfect for every occasion."
            isSparkling={true}
            className="mb-12"
          />
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-12">
          {/* Category Dropdown */}
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
          
          {/* 5. GENDER FILTER DROPDOWN UI */}
          <Select value={activeGender} onValueChange={setActiveGender}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map((gender) => (
                <SelectItem key={gender} value={gender}>
                  {gender}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

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
              Loading Products...
            </h2>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-600">
            <h2 className="text-2xl font-semibold mb-4">Error: {error}</h2>
            <p className="text-gray-500">Please try again later.</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
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