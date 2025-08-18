"use client"

import { useState, useMemo, useEffect } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SectionTitle } from "@/components/SectionTitle"
import { ProductCard } from "@/components/ProductCard"
import { Product, womenProducts } from "@/lib/data"
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

// Helper to get unique sub-categories from product names for artificial jewellery
const getSubCategories = (products: Product[]) => {
  const subCategories = new Set<string>()
  products.forEach((product) => {
    if (product.name.toLowerCase().includes("choker")) subCategories.add("Choker")
    if (product.name.toLowerCase().includes("necklace")) subCategories.add("Necklace")
    if (product.name.toLowerCase().includes("earrings")) subCategories.add("Earrings")
    if (product.name.toLowerCase().includes("maang tikka")) subCategories.add("Maang Tikka")
    if (product.name.toLowerCase().includes("bracelet")) subCategories.add("Bracelet")
  })
  return ["All", ...Array.from(subCategories)]
}

export default function ArtificialJewelleryPage() {
  // 1. Filter for ARTIFICIAL products
  const artificialProducts = useMemo(() => womenProducts.filter((p) => p.category === "artificial"), [])

  const [activeSubCategory, setActiveSubCategory] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 5000])
  
  const subCategories = useMemo(() => getSubCategories(artificialProducts), [artificialProducts])
  const maxPrice = useMemo(() => {
    return Math.ceil(Math.max(...artificialProducts.map(p => p.priceDiscounted), 0) / 100) * 100
  }, [artificialProducts])

  useEffect(() => {
    setPriceRange([0, maxPrice]);
  }, [maxPrice]);

  const filteredProducts = useMemo(() => {
    return artificialProducts
      .filter((p) => {
        if (activeSubCategory === "All") return true
        return p.name.toLowerCase().includes(activeSubCategory.toLowerCase())
      })
      .filter((p) => {
        return p.priceDiscounted >= priceRange[0] && p.priceDiscounted <= priceRange[1]
      })
  }, [artificialProducts, activeSubCategory, priceRange])
  
  const resetFilters = () => {
    setActiveSubCategory("All");
    setPriceRange([0, maxPrice]);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Link href="/" className="mb-8 inline-block">
            <Button variant="ghost" className="space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Button>
          </Link>
          {/* 2. Updated Section Title */}
          <SectionTitle
            title="Modern Glamour"
            subtitle="Discover stunning and affordable artificial jewellery for every occasion."
            className="mb-12"
          />
        </motion.div>

        {/* Filter Section */}
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

          {/* Price Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-[240px] text-left font-normal justify-start">
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
                onValueChange={setPriceRange}
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
          <Button variant="ghost" onClick={resetFilters} className="space-x-2 text-muted-foreground">
            <X className="h-4 w-4" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Products Found</h2>
            <p className="text-gray-500">
              Try adjusting your filters or use the 'Reset' button to see all items.
            </p>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}