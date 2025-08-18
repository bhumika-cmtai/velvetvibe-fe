import { Navbar } from "@/components/Navbar"
import { HeroCarousel } from "@/components/HeroCarousel"
import { SectionTitle } from "@/components/SectionTitle"
import { ProductCard } from "@/components/ProductCard"
import { CategoryCards } from "@/components/CategoryCards"
import { Testimonials } from "@/components/Testimonials"
import { ContactForm } from "@/components/ContactForm"
import { Footer } from "@/components/Footer"
import { womenProducts } from "@/lib/data"

const heroSlides = [
  {
    id: 1,
    image: "/slider1.jpg",
    title: "Exquisite Jewelry Collection",
    subtitle: "Discover our stunning range of handcrafted jewelry pieces designed for the modern woman",
    cta: "Shop Women's Collection",
    ctaLink: "/collections/women",
  },
  {
    id: 2,
    image: "/slider2.jpg",
    title: "Timeless Elegance",
    subtitle: "From classic designs to contemporary styles, find the perfect piece for every occasion",
    cta: "Explore Earrings",
    ctaLink: "/collections/women?category=earrings",
  },
  {
    id: 3,
    image: "/slider3.jpg",
    title: "Silver Sophistication",
    subtitle: "Premium sterling silver jewelry that combines tradition with modern aesthetics",
    cta: "View Silver Collection",
    ctaLink: "/collections/women?category=silver",
  },
]

export default function WomenHomePage() {
  const newArrivals = womenProducts.slice(0, 4)

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="space-y-20">
        {/* Hero Section - Now Full Width */}
        <section>
          <HeroCarousel slides={heroSlides} />
        </section>

        {/* New Arrivals */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="New Arrivals"
            subtitle="Discover our latest collection of exquisite jewelry pieces"
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
            subtitle="Explore our curated collections designed for every style and occasion"
            className="mb-12"
          />
          <CategoryCards gender="women" />
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4">
          <Testimonials />
        </section>

        {/* Contact Form */}
        <section id="contact" className="container mx-auto px-4">
          <SectionTitle
            title="Get in Touch"
            subtitle="Have a custom design in mind? We'd love to bring your vision to life"
            className="mb-12"
          />
          <ContactForm />
        </section>
      </main>

      <Footer />
    </div>
  )
}