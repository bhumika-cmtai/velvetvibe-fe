"use client"

import { useState, useMemo } from "react"
import { useSearchParams } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { HeroCarousel } from "@/components/HeroCarousel"
import { ProductCard } from "@/components/ProductCard"
import { FiltersSidebar } from "@/components/FiltersSidebar"
import { Footer } from "@/components/Footer"
import { womenProducts } from "@/lib/data"

const heroSlides = [
  {
    id: 1,
    image: "/slider1.jpg",
    title: "Women's Collection",
    subtitle: "Discover our complete range of exquisite jewelry for women",
    cta: "Shop Now",
    ctaLink: "#products",
  },
]

const filterGroups = [
  {
    id: "category",
    label: "Category",
    options: [
      { id: "earrings", label: "Earrings", count: 2 },
      { id: "bangles", label: "Bangles", count: 1 },
      { id: "silver", label: "Silver Jewellery", count: 2 },
      { id: "artificial", label: "Artificial Jewellery", count: 1 },
    ],
  },
  {
    id: "price",
    label: "Price Range",
    options: [
      { id: "under-1000", label: "Under ₹1,000", count: 1 },
      { id: "1000-2000", label: "₹1,000 - ₹2,000", count: 2 },
      { id: "2000-3000", label: "₹2,000 - ₹3,000", count: 2 },
      { id: "above-3000", label: "Above ₹3,000", count: 1 },
    ],
  },
  {
    id: "metal",
    label: "Metal",
    options: [
      { id: "gold", label: "Gold", count: 1 },
      { id: "silver", label: "Silver", count: 2 },
      { id: "brass", label: "Brass", count: 2 },
      { id: "alloy", label: "Alloy", count: 1 },
    ],
  },
  {
    id: "color",
    label: "Color",
    options: [
      { id: "gold", label: "Gold", count: 2 },
      { id: "silver", label: "Silver", count: 2 },
      { id: "rose-gold", label: "Rose Gold", count: 1 },
      { id: "white", label: "White", count: 1 },
    ],
  },
]

export default function WomenCollectionPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {}
    if (categoryParam) {
      initial.category = [categoryParam]
    }
    return initial
  })

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }
      if (!newFilters[groupId]) {
        newFilters[groupId] = []
      }

      if (checked) {
        newFilters[groupId] = [...newFilters[groupId], optionId]
      } else {
        newFilters[groupId] = newFilters[groupId].filter((id) => id !== optionId)
        if (newFilters[groupId].length === 0) {
          delete newFilters[groupId]
        }
      }

      return newFilters
    })
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
  }

  const filteredProducts = useMemo(() => {
    let filtered = [...womenProducts]

    // Apply category filter
    if (selectedFilters.category?.length) {
      filtered = filtered.filter((product) => selectedFilters.category.includes(product.category))
    }

    // Apply price filter
    if (selectedFilters.price?.length) {
      filtered = filtered.filter((product) => {
        const price = product.priceDiscounted
        return selectedFilters.price.some((priceRange) => {
          switch (priceRange) {
            case "under-1000":
              return price < 1000
            case "1000-2000":
              return price >= 1000 && price < 2000
            case "2000-3000":
              return price >= 2000 && price < 3000
            case "above-3000":
              return price >= 3000
            default:
              return true
          }
        })
      })
    }

    // Apply metal filter
    if (selectedFilters.metal?.length) {
      filtered = filtered.filter((product) =>
        selectedFilters.metal.some((metal) => product.metal.toLowerCase().includes(metal)),
      )
    }

    // Apply color filter
    if (selectedFilters.color?.length) {
      filtered = filtered.filter((product) => {
        // First, make sure the product actually has a color array.
        // If product.color is missing or not an array, it cannot match.
        if (!Array.isArray(product.color)) {
          return false
        }
    
        // Now, check if any selected filter color matches any of the product's colors.
        // This is a "many-to-many" comparison.
        return selectedFilters.color.some((filterColor) => {
          const formattedFilterColor = filterColor.replace("-", " ") // Turns "rose-gold" into "rose gold"
          // Check if any of the product's colors includes the formatted filter color
          return (
            product.color?.some((productColor) =>
              productColor.toLowerCase().includes(formattedFilterColor),
            ) ?? false
          )
        })
      })
    }
    return filtered
  }, [selectedFilters])

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Hero Section */}
        {/* <section className=" mx-auto  pt-8 mb-12">
          <HeroCarousel slides={heroSlides} autoPlay={false} />
        </section> */}

        {/* Products Section */}
        <section id="products" className="container mx-auto px-4 py-20 ">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            <FiltersSidebar
              filters={filterGroups}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-serif font-bold" style={{ color: "var(--theme-primary)" }}>
                  Women's Jewelry ({filteredProducts.length} items)
                </h1>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProducts.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                  <button
                    onClick={handleClearFilters}
                    className="mt-4 text-sm underline"
                    style={{ color: "var(--theme-primary)" }}
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
