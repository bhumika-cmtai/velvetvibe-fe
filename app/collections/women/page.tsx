"use client"

import { useState, useEffect,useLayoutEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchProducts } from "@/lib/redux/slices/productSlice"

import { Navbar } from "@/components/Navbar"
import { ProductCard } from "@/components/ProductCard"
import { FiltersSidebar } from "@/components/FiltersSidebar"
import { Footer } from "@/components/Footer"

// Example filter config
const filterGroups = [
  {
    id: "jewelleryCategory",
    label: "Category",
    options: [
      { id: "Earrings", label: "Earrings" },
      { id: "Bangles", label: "Bangles" },
      { id: "Necklaces", label: "Necklaces" },
    ],
  },
  {
    id: "price",
    label: "Price Range",
    options: [
      { id: "under-1000", label: "Under ₹1,000" },
      { id: "1000-2000", label: "₹1,000 - ₹2,000" },
      { id: "2000-3000", label: "₹2,000 - ₹3,000" },
      { id: "above-3000", label: "Above ₹3,000" },
    ],
  },
  {
    id: "metal",
    label: "Metal",
    options: [
      { id: "gold", label: "Gold" },
      { id: "silver", label: "Silver" },
      { id: "brass", label: "Brass" },
      { id: "alloy", label: "Alloy" },
    ],
  },
  {
    id: "color",
    label: "Color",
    options: [
      { id: "Gold", label: "Gold" },
      { id: "Silver", label: "Silver" },
      { id: "Rose-gold", label: "Rose Gold" },
      { id: "White", label: "White" },
    ],
  },
]

export default function WomenCollectionPage() {
  const dispatch = useDispatch<AppDispatch>()
  const searchParams = useSearchParams()

  const { items: products, loading, error, totalProducts } = useSelector(
    (state: RootState) => state.product
  )

  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 12

  const categoryParam = searchParams.get("category")
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const initial: Record<string, string[]> = {}
    if (categoryParam) {
      initial.jewelleryCategory = [categoryParam]
    }
    return initial
  })

  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev }
      if (!newFilters[groupId]) newFilters[groupId] = []

      if (checked) {
        newFilters[groupId] = [...newFilters[groupId], optionId]
      } else {
        newFilters[groupId] = newFilters[groupId].filter((id) => id !== optionId)
        if (newFilters[groupId].length === 0) delete newFilters[groupId]
      }
      return newFilters
    })
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSelectedFilters({})
    setCurrentPage(1)
  }

  const buildQueryParams = () => {
    const params: Record<string, string> = {
      gender: "Female",
      page: String(currentPage),
      limit: String(productsPerPage),
    }
    if (selectedFilters.jewelleryCategory?.length) {
      params.jewelleryCategory = selectedFilters.jewelleryCategory.join(",")
    }
    if (selectedFilters.metal?.length) {
      params.materialType = selectedFilters.metal.join(",")
    }
    if (selectedFilters.color?.length) {
      params.color = selectedFilters.color.join(",")
    }
    return params
  }

  // Fetch products whenever filters or page change
  useEffect(() => {
    const queryParams = buildQueryParams()
    dispatch(fetchProducts(queryParams))
  }, [dispatch, selectedFilters, currentPage])

  // Scroll to top whenever currentPage changes
  useLayoutEffect(() => {
    // Scroll the **window** to top smoothly
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [currentPage])

  const filteredProducts = products.filter((product) => {
    if (!selectedFilters.price?.length) return true
    return selectedFilters.price.some((range) => {
      const price = product.priceDiscounted || product.price || 0
      switch (range) {
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

  const totalPages = Math.ceil(totalProducts / productsPerPage)

  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        <section id="products" className="container mx-auto px-4 py-20">
          <div className="flex gap-8">
            <FiltersSidebar
              filters={filterGroups}
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />

            <div className="flex-1">
              <div className="flex items-center justify-between mb-6">
                <h1
                  className="text-2xl font-serif font-bold"
                  style={{ color: "var(--theme-primary)" }}
                >
                  Women's Jewelry ({totalProducts} items)
                </h1>
              </div>

              {loading ? (
                <p className="text-gray-500">Loading products...</p>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProducts.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center mt-10 gap-2">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => p - 1)}
                      className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                    >
                      Prev
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`px-4 py-2 rounded ${
                          currentPage === i + 1 ? "bg-black text-white" : "bg-gray-200"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => p + 1)}
                      className="px-4 py-2 rounded bg-gray-200 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </>
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

