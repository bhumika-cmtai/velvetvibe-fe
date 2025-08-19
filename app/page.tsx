import { Navbar } from "@/components/Navbar"
import { HeroCarousel } from "@/components/HeroCarousel"
import { SectionTitle } from "@/components/SectionTitle"
import { ProductCard } from "@/components/ProductCard"
import { CategoryCards } from "@/components/CategoryCards"
import { Testimonials } from "@/components/Testimonials"
import { ContactForm } from "@/components/ContactForm"
import { Footer } from "@/components/Footer"
// --- FIX START: Imported allProducts and reelsData ---
import { womenProducts, allProducts, reelsData } from "@/lib/data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gem } from "lucide-react"
import Image from "next/image"
import type { Product } from "@/lib/data"
import ReelCard from "@/components/ReelCard"
// --- FIX END ---

// --- FIX START: Created the new ReelCard component ---

// function ReelCard({ product, reelImage }: ReelCardProps) {
//   const hasDiscount = product.priceDiscounted < product.priceOriginal;

//   return (
//     <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl">
//       <Link href={`/collections/women/${product.slug}`} className="block">
//         <div className="relative">
//           <div className="aspect-[9/16] w-full overflow-hidden">
//             <Image
//               src={reelImage}
//               alt={`Reel showcasing ${product.name}`}
//               fill
//               className="object-cover transition-transform duration-300 group-hover:scale-105"
//             />
//           </div>
//           <div className="absolute -bottom-8 left-1/2 z-10 h-20 w-20 -translate-x-1/2 overflow-hidden rounded-md border-2 border-white bg-white shadow-lg">
//             <Image
//               src={product.images[0]}
//               alt={product.name}
//               fill
//               className="object-cover"
//             />
//           </div>
//         </div>
//         <div className="p-4 pt-12 text-center">
//           <h3 className="mb-2 font-medium text-gray-800 truncate">{product.name}</h3>
//           <div className="flex items-baseline justify-center space-x-2">
//             {hasDiscount ? (
//               <>
//                 <span className="font-bold text-gray-900">
//                   ₹{product.priceDiscounted.toLocaleString()}
//                 </span>
//                 <span className="text-sm text-gray-400 line-through">
//                   ₹{product.priceOriginal.toLocaleString()}
//                 </span>
//               </>
//             ) : (
//               <span className="font-bold text-gray-900">
//                 ₹{product.priceOriginal.toLocaleString()}
//               </span>
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   );
// }
// --- FIX END ---

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
  const silverJewellery = womenProducts.filter((p) => p.category === "silver").slice(0, 4)
  const artificialJewellery = womenProducts.filter((p) => p.category === "artificial").slice(0, 4)
  const festivePicks = womenProducts.filter((p) => p.tags?.includes("festive")).slice(0, 4)
  const handbags = womenProducts.filter((p) => p.category === "bag").slice(0, 4)
  const giftItems = womenProducts.filter((p) => p.tags?.includes("gift")).slice(0, 4)

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="space-y-20">
        <section>
          <HeroCarousel slides={heroSlides} />
        </section>

        <section className="container mx-auto px-4">
          <SectionTitle
            title="New Arrivals"
            subtitle="Discover our latest collection of exquisite jewelry pieces"
            className="mb-12 text-[#A77C38]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {newArrivals.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/collections/women">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                View All New Arrivals
              </Button>
            </Link>
          </div>
        </section>

        {/* --- FIX START: Added "As Seen On You" section --- */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="As Seen On You"
            subtitle="Explore how our community styles their favorite Gullnaaz pieces"
            className="mb-12 text-[#A77C38]"
          />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {reelsData.map((reel) => {
              const product = allProducts.find((p) => p.id === reel.productId);
              if (!product) return null;
              return <ReelCard key={reel.reelId} reelVideo={reel.reelVideo} product={product} />;
            })}
          </div>
          <div className="mt-8 text-center">
            <Link href="/reels">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                View All Reels
              </Button>
            </Link>
          </div>
        </section>
        {/* --- FIX END --- */}

        <section className="container mx-auto px-4">
          <SectionTitle
            title="Festive Favourites"
            subtitle="Dazzle this season with our specially curated festive collection"
            className="mb-8 text-[#A77C38]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {festivePicks.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/collections/women?tag=festive">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                View All Festive Favourites
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <SectionTitle
            title="Shop by Category"
            subtitle="Explore our curated collections designed for every style and occasion"
            className="mb-8 text-[#A77C38]"
          />
          <CategoryCards gender="women" />
        </section>

        <section className="container mx-auto px-4">
          <SectionTitle
            title="Shine in Silver"
            subtitle="Elegant and timeless silver pieces for a sophisticated look"
            className="mb-8 text-[#A77C38]"
            isSparkling={true}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {silverJewellery.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/collections/silver-jewellery">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                View All Silver Jewellery
              </Button>
            </Link>
          </div>
        </section>
        
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Modern Glamour"
            subtitle="Stunning and affordable artificial jewellery for every occasion"
            className="mb-8 text-[#a77c38]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {artificialJewellery.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/collections/women?category=artificial">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                View All Artificial Jewellery
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <SectionTitle
            title="Chic Handbags"
            subtitle="Complete your look with our stylish collection of handbags"
            className="mb-8 text-[#A77C38]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {handbags.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/collections/women?category=bag">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                View All Handbags
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <SectionTitle
            title="Gifts for Her"
            subtitle="Find the perfect gift for every special occasion"
            className="mb-8 text-[#A77C38]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {giftItems.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/collections/women?tag=gift">
              <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                View All Gifts
              </Button>
            </Link>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <Testimonials />
        </section>

        <section id="contact" className="container mx-auto px-4">
          <SectionTitle
            title="Bespoke Creations"
            subtitle="Commission a one-of-a-kind piece, crafted exclusively for you"
            className="mb-8 text-[#A77C38]"
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-4 text-center bg-gray-50 p-12 rounded-2xl border border-gray-200 shadow-sm">
              <div className="flex justify-center mb-4">
                <Gem className="h-12 w-12" style={{ color: "var(--theme-primary)" }} strokeWidth={1.5} />
              </div>
              <h3 className="text-4xl font-bold font-serif" style={{ color: "var(--theme-primary)" }}>
                Commission Your Masterpiece
              </h3>
              <p className="text-lg leading-relaxed text-gray-600 max-w-md mx-auto">
                From a simple sketch to a cherished idea, our artisans will bring your unique vision to life.
              </p>
              <p className="text-lg font-medium text-gray-800 pt-2">
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