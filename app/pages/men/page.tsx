import { Navbar } from "@/components/Navbar"
import { HeroCarousel } from "@/components/HeroCarousel"
import { SectionTitle } from "@/components/SectionTitle"
import { ProductCard } from "@/components/ProductCard"
import { CategoryCards } from "@/components/CategoryCards"
import { Testimonials } from "@/components/Testimonials"
import { ContactForm } from "@/components/ContactForm"
import { Footer } from "@/components/Footer"
import { menProducts } from "@/lib/data"

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

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="space-y-20">
        {/* --- MODIFICATION START --- */}
        {/* Hero Section - Removed container classes to make it full width */}
        <section>
          <HeroCarousel slides={heroSlides} />
        </section>
        {/* --- MODIFICATION END --- */}

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