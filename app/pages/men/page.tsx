"use client"

import { Navbar } from "@/components/Navbar"
import { HeroCarousel } from "@/components/HeroCarousel"
import { SectionTitle } from "@/components/SectionTitle"
import { ProductCard } from "@/components/ProductCard"
import { CategoryCards } from "@/components/CategoryCards"
import { Testimonials } from "@/components/Testimonials"
import { ContactForm } from "@/components/ContactForm"
import { Footer } from "@/components/Footer"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gem } from "lucide-react"
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts } from '@/lib/redux/slices/productSlice'
import type { AppDispatch, RootState } from '@/lib/redux/store'

const heroSlides = [
  {
    id: 1,
    image: "/GULLNAAZ-BANNER-FOR-MAN-1.png",
    title: "Distinguished Men's Collection",
    subtitle: "Elevate your style with our premium collection of men's jewelry and accessories",
    cta: "Shop Men's Collection",
    ctaLink: "/collections/men",
  },
  {
    id: 2,
    image: "/GULLNAAZ-BANNER-FOR-MAN-2.png",
    title: "Modern Sophistication",
    subtitle: "From sleek watches to elegant chains, discover pieces that define contemporary masculinity",
    cta: "Explore Watches",
    ctaLink: "/collections/men",
  },
  {
    id: 3,
    image: "/GULLNAAZ-BANNER-FOR-MAN-3.png",
    title: "Silver Excellence",
    subtitle: "Crafted with precision, our silver collection embodies strength and refinement",
    cta: "View Silver Collection",
    ctaLink: "/collections/men",
  },
]

export default function MenHomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.product)

  const [newArrivals, setNewArrivals] = useState<any[]>([])
  const [silverJewellery, setSilverJewellery] = useState<any[]>([])
  const [artificialJewellery, setArtificialJewellery] = useState<any[]>([])
  const [trendingProducts, setTrendingProducts] = useState<any[]>([])
  const [giftsForHim, setGiftsForHim] = useState<any[]>([])

  const [sectionsLoading, setSectionsLoading] = useState({
    newArrivals: false,
    silver: false,
    artificial: false,
    trending: false,
    gifts: false,
  })

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        // Fetch New Arrivals (latest men's jewellery products)
        setSectionsLoading(prev => ({ ...prev, newArrivals: true }))
        const newArrivalsResult = await dispatch(fetchProducts({
          type: 'jewellery',
          gender: 'Male',
          limit: 4,
        })).unwrap()
        setNewArrivals(newArrivalsResult.products || [])
        setSectionsLoading(prev => ({ ...prev, newArrivals: false }))

        // Fetch Silver Jewellery
        setSectionsLoading(prev => ({ ...prev, silver: true }))
        const silverResult = await dispatch(fetchProducts({
          type: 'jewellery',
          gender: 'Male',
          materialType: 'silver',
          limit: 4
        })).unwrap()
        setSilverJewellery(silverResult.products || [])
        setSectionsLoading(prev => ({ ...prev, silver: false }))

        // Fetch Trending Products (e.g., tagged as 'statement')
        setSectionsLoading(prev => ({ ...prev, trending: true }))
        const trendingResult = await dispatch(fetchProducts({
          type: 'jewellery',
          gender: 'Male',
          tags: 'statement', // Assuming 'statement' tag for trending men's items
          limit: 4
        })).unwrap()
        setTrendingProducts(trendingResult.products || [])
        setSectionsLoading(prev => ({ ...prev, trending: false }))

        // Fetch Artificial Jewellery
        setSectionsLoading(prev => ({ ...prev, artificial: true }))
        const artificialResult = await dispatch(fetchProducts({
          type: 'jewellery',
          gender: 'Male',
          materialType: 'artificial',
          limit: 4
        })).unwrap()
        setArtificialJewellery(artificialResult.products || [])
        setSectionsLoading(prev => ({ ...prev, artificial: false }))

        // Fetch Gifts for Him (e.g., tagged as 'gift')
        setSectionsLoading(prev => ({ ...prev, gifts: true }))
        const giftsResult = await dispatch(fetchProducts({
          type: 'jewellery', // Or other types if men's gifts include non-jewellery
          gender: 'Male',
          tags: 'gift',
          limit: 4
        })).unwrap()
        setGiftsForHim(giftsResult.products || [])
        setSectionsLoading(prev => ({ ...prev, gifts: false }))

      } catch (error) {
        console.error('Error fetching products:', error)
        setSectionsLoading({
          newArrivals: false,
          silver: false,
          artificial: false,
          trending: false,
          gifts: false,
        })
      }
    }

    fetchProductCategories()
  }, [dispatch])

  // Loading component for product sections
  const ProductSectionLoading = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[...Array(4)].map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  )

  return (
    // <div className="min-h-screen bg-gradient-to-r from-[#052E38] to-[#5F5F5F]]">
      <div className="min-h-screen bg-[linear-gradient(to_right,_#052E38_-59%,_#5F5F5F_100%)]">

      <Navbar />

      <main className="space-y-20">
        <section>
          <HeroCarousel slides={heroSlides} />
        </section>

        {/* New Arrivals */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="New Arrivals"
            subtitle="Discover our latest collection of sophisticated men's accessories"
            className="mb-8 text-[#D09D13]"
          />
          {sectionsLoading.newArrivals ? (
            <ProductSectionLoading />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {newArrivals.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href="/collections/men">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base border-black text-[#D09D13] bg-[#fcf1ce] hover:bg-[#D09D13] hover:text-white transition-colors">
                    View All New Arrivals
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Silver Excellence */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Silver Excellence"
            subtitle="Refined sterling silver accessories for a sharp, polished look"
            className="mb-8 text-[#D09D13]"
          />
          {sectionsLoading.silver ? (
            <ProductSectionLoading />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {silverJewellery.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href="/collections/men?category=silver">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base border-black text-black hover:bg-black hover:text-white transition-colors">
                    View All Silver Products
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Trending Now */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Trending Now"
            subtitle="Explore the pieces that are currently defining men's style"
            className="mb-8 text-[#D09D13]"
          />
          {sectionsLoading.trending ? (
            <ProductSectionLoading />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {trendingProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href="/collections/men?tag=statement">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base border-black text-black hover:bg-black hover:text-white transition-colors">
                    View All Trending Products
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Modern Statements (Artificial Jewellery) */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Modern Statements"
            subtitle="Bold and contemporary pieces to express your unique style"
            className="mb-8 text-[#D09D13]"
          />
          {sectionsLoading.artificial ? (
            <ProductSectionLoading />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {artificialJewellery.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href="/collections/men?category=artificial">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base border-black text-black hover:bg-black hover:text-white transition-colors">
                    View All Artificial Products
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Shop by Category */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Shop by Category"
            subtitle="Explore our curated collections designed for the modern gentleman"
            className="mb-8 text-[#D09D13]"
          />
          <CategoryCards gender="men" />
        </section>

        {/* Gifts for Him */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Gifts for Him"
            subtitle="Find the perfect gift to celebrate any occasion"
            className="mb-8 text-[#D09D13]"
          />
          {sectionsLoading.gifts ? (
            <ProductSectionLoading />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {giftsForHim.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="mt-12 text-center">
                <Link href="/collections/men?tag=gift">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base border-black text-black hover:bg-black hover:text-white transition-colors">
                    View All Gifts
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* <section className="container mx-auto px-4">
          <Testimonials />
        </section> */}

        {/* Bespoke Creations (Contact Section) */}
        <section id="contact" className="container mx-auto px-4">
          <SectionTitle
            title="Bespoke Creations"
            subtitle="Commission a one-of-a-kind piece, crafted exclusively for you"
            className="mb-8 text-[#D09D13]"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-4 text-center bg-gray-300 p-12 rounded-2xl border border-neutral-200 shadow-md">
              <div className="flex justify-center mb-4">
                <Gem className="h-12 w-12" style={{ color: "#689B8A" }} strokeWidth={1.5} />
              </div>
              <h3 className="text-4xl font-bold font-serif" style={{ color: "#052E38" }}>
                Commission Your Masterpiece
              </h3>
              <p className="text-lg leading-relaxed text-neutral-800 max-w-md mx-auto">
                From a simple sketch to a cherished idea, our artisans will bring your unique vision to life.
              </p>
              <p className="text-lg font-semibold text-black pt-2">
                Describe your ideal piece in the form to begin.
              </p>
            </div>
            <div>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}