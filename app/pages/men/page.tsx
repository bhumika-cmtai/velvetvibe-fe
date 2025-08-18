import { Navbar } from "@/components/Navbar"
import { HeroCarousel } from "@/components/HeroCarousel"
import { SectionTitle } from "@/components/SectionTitle"
import { ProductCard } from "@/components/ProductCard"
import { CategoryCards } from "@/components/CategoryCards"
import { Testimonials } from "@/components/Testimonials"
import { ContactForm } from "@/components/ContactForm"
import { Footer } from "@/components/Footer"
import { menProducts } from "@/lib/data"
import Link from "next/link" // Import Link
import { Button } from "@/components/ui/button" // Import Button

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
  // --- MODIFICATION START: Filtered data for new sections ---
  const newArrivals = menProducts.slice(0, 4)
  const silverJewellery = menProducts.filter((p) => p.category === "silver").slice(0, 4)
  const artificialJewellery = menProducts.filter((p) => p.category === "artificial").slice(0, 4)
  // --- MODIFICATION END ---

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="space-y-20">
        {/* Hero Section */}
        <section>
          <HeroCarousel slides={heroSlides} />
        </section>

        {/* New Arrivals */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="New Arrivals"
            subtitle="Discover our latest collection of sophisticated men's accessories"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/collections/men">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base">
                View All New Arrivals
              </Button>
            </Link>
          </div>
        </section>
        
        {/* --- NEW SECTION: Silver Jewellery --- */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Silver Excellence"
            subtitle="Refined sterling silver accessories for a sharp, polished look"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {silverJewellery.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/collections/men?category=silver">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base">
                View All Silver Products
              </Button>
            </Link>
          </div>
        </section>

        {/* --- NEW SECTION: Artificial Jewellery --- */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Modern Statements"
            subtitle="Bold and contemporary pieces to express your unique style"
            className="mb-12"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {artificialJewellery.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Link href="/collections/men?category=artificial">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base">
                View All Artificial Products
              </Button>
            </Link>
          </div>
        </section>

        {/* Shop by Category */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Shop by Category"
            subtitle="Explore our curated collections designed for the modern gentleman"
            className="mb-12"
          />
          <CategoryCards gender="men" />
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4">
          <Testimonials />
        </section>

        {/* Contact Form */}
        <section id="contact" className="container mx-auto px-4">
          <SectionTitle
            title="Get in Touch"
            subtitle="Looking for something unique? Let us create the perfect piece for you"
            className="mb-12"
          />
          <ContactForm />
        </section>
      </main>

      <Footer />
    </div>
  )
}