import { Navbar } from "@/components/Navbar"
import { HeroCarousel } from "@/components/HeroCarousel"
import { SectionTitle } from "@/components/SectionTitle"
import { ProductCard } from "@/components/ProductCard"
import { CategoryCards } from "@/components/CategoryCards"
import { Testimonials } from "@/components/Testimonials"
import { ContactForm } from "@/components/ContactForm"
import { Footer } from "@/components/Footer"
import { menProducts } from "@/lib/data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gem } from "lucide-react"

const heroSlides = [
  {
    id: 1,
    image: "/men-slide1.jpg",
    title: "Distinguished Men's Collection",
    subtitle: "Elevate your style with our premium collection of men's jewelry and accessories",
    cta: "Shop Men's Collection",
    ctaLink: "/collections/men",
  },
  {
    id: 2,
    image: "/men-slide2.jpg",
    title: "Modern Sophistication",
    subtitle: "From sleek watches to elegant chains, discover pieces that define contemporary masculinity",
    cta: "Explore Watches",
    ctaLink: "/collections/men?category=artificial",
  },
  {
    id: 3,
    image: "/men-slide3.jpg",
    title: "Silver Excellence",
    subtitle: "Crafted with precision, our silver collection embodies strength and refinement",
    cta: "View Silver Collection",
    ctaLink: "/collections/men?category=silver",
  },
]

export default function MenHomePage() {
  const newArrivals = menProducts.slice(0, 4)
  const silverJewellery = menProducts.filter((p) => p.category === "silver").slice(0, 4)
  const artificialJewellery = menProducts.filter((p) => p.category === "artificial").slice(0, 4)
  const trendingProducts = menProducts.filter((p) => p.tags?.includes("statement")).slice(0, 4)
  const giftsForHim = menProducts.filter((p) => p.tags?.includes("gift")).slice(0, 4)

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="space-y-20">
        <section>
          <HeroCarousel slides={heroSlides} />
        </section>

        {/* --- FIX START: Updated button styles to use black color scheme --- */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="New Arrivals"
            subtitle="Discover our latest collection of sophisticated men's accessories"
            className="mb-8 "
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/collections/men">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base border-black text-black hover:bg-black hover:text-white transition-colors">
                View All New Arrivals
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <SectionTitle
            title="Silver Excellence"
            subtitle="Refined sterling silver accessories for a sharp, polished look"
            className="mb-8 "
          />
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
        </section>

        <section className="container mx-auto px-4">
          <SectionTitle
            title="Trending Now"
            subtitle="Explore the pieces that are currently defining men's style"
            className="mb-8 "
          />
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
        </section>

        <section className="container mx-auto px-4">
          <SectionTitle
            title="Modern Statements"
            subtitle="Bold and contemporary pieces to express your unique style"
            className="mb-8 "
          />
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
        </section>
        
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Shop by Category"
            subtitle="Explore our curated collections designed for the modern gentleman"
            className="mb-8 "
          />
          <CategoryCards gender="men" />
        </section>
        
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Gifts for Him"
            subtitle="Find the perfect gift to celebrate any occasion"
            className="mb-8 "
          />
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
        </section>
        {/* --- FIX END --- */}

        <section className="container mx-auto px-4">
          <Testimonials />
        </section>
        
        {/* --- FIX START: Redesigned contact section with new color scheme --- */}
        <section id="contact" className="container mx-auto px-4">
          <SectionTitle
            title="Bespoke Creations"
            subtitle="Commission a one-of-a-kind piece, crafted exclusively for you"
            className="mb-8 "
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-4 text-center bg-white p-12 rounded-2xl border border-neutral-200 shadow-md">
              <div className="flex justify-center mb-4">
                <Gem className="h-12 w-12" style={{ color: "#689B8A" }} strokeWidth={1.5} />
              </div>
              <h3 className="text-4xl font-bold font-serif" style={{ color: "#689B8A" }}>
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
        {/* --- FIX END --- */}
      </main>

      <Footer />
    </div>
  )
}