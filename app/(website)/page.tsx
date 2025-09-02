"use client"

import { Navbar } from "@/components/Navbar"
import { HeroCarousel } from "@/components/HeroCarousel"
import { SectionTitle } from "@/components/SectionTitle"
import { ProductCard } from "@/components/ProductCard"
import { CategoryCards } from "@/components/CategoryCards"
import { Testimonials } from "@/components/Testimonials"
import { ContactForm } from "@/components/ContactForm"
import { Footer } from "@/components/Footer"
import { reelsData } from "@/lib/data"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Gem, MapPin } from "lucide-react"
import Image from "next/image"
import ReelCard from "@/components/ReelCard"
import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProducts,fetchProductsWithVideos } from '@/lib/redux/slices/productSlice'
import type { AppDispatch, RootState } from '@/lib/redux/store'

const heroSlides = [
  {
    id: 1,
    image: "/GULLNAAZ-BANNER-FOR-WOMAN-3.png",
    title: "Exquisite Jewelry Collection",
    subtitle: "Discover our stunning range of handcrafted jewelry pieces designed for the modern woman",
    cta: "Shop Women's Collection",
    ctaLink: "/collections/women",
  },
  {
    id: 2,
    image: "/GULLNAAZ-BANNER-FOR-WOMAN-1.png",
    title: "Timeless Elegance",
    subtitle: "From classic designs to contemporary styles, find the perfect piece for every occasion",
    cta: "Explore Earrings",
    ctaLink: "/collections/women",
  },
  {
    id: 3,
    image: "/GULLNAAZ-BANNER-FOR-WOMAN-2.png",
    title: "Silver Sophistication",
    subtitle: "Premium sterling silver jewelry that combines tradition with modern aesthetics",
    cta: "View Silver Collection",
    ctaLink: "/collections/women",
  },
]

const customDesigns = [
  {
    id: 1,
    image: "/custom1.jpg",
    title: "The Maharani's Statement Gold Kada",
    description: "Embrace unparalleled grandeur with our Maharani's Statement Gold Kada"
  },
  {
    id: 2,
    image: "/custom2.jpg",
    title: "Traditional Layered Gold Haar Necklace",
    description: "Adorn your neckline with the divine elegance of the Empress's Gold Haar."
  },
  {
    id: 3,
    image: "/custom3.jpg",
    title: "Enchanting Sterling Silver Payal",
    description: "Let every step you take sing a song of grace with our Melody of the Ghungroo Silver Payal."
  },
  {
    id: 4,
    image: "/custom4.jpg",
    title: "Majestic Royal Gold Jhumkas",
    description: "One of Masterfully designed in brilliant gold for traditional royal look."
  }
];

const staticReelsData = [
  { id: 1, src: "/jewel-reel.mp4", poster: "/custom1.jpg" },
  { id: 2, src: "/jewel-reel.mp4", poster: "/custom2.jpg" },
  { id: 3, src: "/jewel-reel.mp4", poster: "/custom3.jpg" },
  { id: 4, src: "/jewel-reel.mp4", poster: "/custom4.jpg" },
  // Alternative: Use a working sample video URL for testing
  // { id: 1, src: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", poster: "/custom1.jpg" },
];


function CustomDesignCard({ image, title, description }: { image: string, title: string, description: string }) {
  return (
    <div className="group overflow-hidden rounded-lg border bg-white text-center shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-square w-full">
        <Image 
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      </div>
    </div>
  );
}


// Updated StaticReelCard Component with proper autoplay
function VideoProductCard({ product }: { product: any }) {
  // Agar product mein video nahi hai to kuch bhi render na karein
  if (!product.video || product.video.length === 0) {
    return null;
  }

  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasError, setHasError] = useState(false);

  // useEffect se autoplay ko ensure karein
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => {
        console.error("Video autoplay was prevented:", error);
        // Autoplay block hone par user click karke chala sakta hai
      });
    }
  }, []);

  // Agar video URL aane mein error ho to fallback ke taur par image dikhayein
  if (hasError) {
    return (
      <Link href={`/products/${product.slug}`} className="group block overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
        <div className="relative aspect-square w-full">
          <Image
            src={product.images?.[0] || '/custom1.jpg'} // Fallback image
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.slug}`} className="group block overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[9/16] w-full">
        <video
          ref={videoRef}
          src={product.video[0]} 
          autoPlay
          loop
          muted
          playsInline
          poster={product.images?.[0]} 
          onError={() => setHasError(true)} 
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Hover par dikhne wala Overlay */}
        <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex flex-col justify-end p-4">
          {/* Hover par neeche se aane wala text */}
          <div className="transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 text-white">
            <h3 className="font-semibold text-lg leading-tight">{product.name}</h3>
            <p className="text-base font-medium">₹{product.price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}





export default function WomenHomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { loading, error } = useSelector((state: RootState) => state.product)
  
  // State to store different product categories
  const [newArrivals, setNewArrivals] = useState<any[]>([])
  const [festivePicks, setFestivePicks] = useState<any[]>([])
  const [silverJewellery, setSilverJewellery] = useState<any[]>([])
  const [artificialJewellery, setArtificialJewellery] = useState<any[]>([])
  const [handbags, setHandbags] = useState<any[]>([])
  const [giftItems, setGiftItems] = useState<any[]>([])
  const [videoProducts, setVideoProducts] = useState<any[]>([])
  
  // Loading states for each section
  const [sectionsLoading, setSectionsLoading] = useState({
    newArrivals: false,
    festive: false,
    silver: false,
    artificial: false,
    videos: false,
    bags: false,
    gifts: false
  })

  // Fetch different product categories
  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        // Fetch New Arrivals (latest jewellery products)
        setSectionsLoading(prev => ({ ...prev, newArrivals: true }))
        const newArrivalsResult = await dispatch(fetchProducts({ 
          gender: 'Female',
          type: 'jewellery', 
          limit: 4,
          // You might want to add a sort parameter for latest products
        })).unwrap()
        setNewArrivals(newArrivalsResult.products || [])
        setSectionsLoading(prev => ({ ...prev, newArrivals: false }))

        // Fetch Festive Products
        setSectionsLoading(prev => ({ ...prev, festive: true }))
        const festiveResult = await dispatch(fetchProducts({ 
          type: 'jewellery',
          tags: 'festive',
          limit: 4 
        })).unwrap()
        setFestivePicks(festiveResult.products || [])
        setSectionsLoading(prev => ({ ...prev, festive: false }))

        // Fetch Silver Jewellery
        setSectionsLoading(prev => ({ ...prev, silver: true }))
        const silverResult = await dispatch(fetchProducts({ 
          type: 'jewellery',
          materialType: 'silver',
          limit: 4 
        })).unwrap()
        setSilverJewellery(silverResult.products || [])
        setSectionsLoading(prev => ({ ...prev, silver: false }))

        
        // Fetch Artificial Jewellery
        setSectionsLoading(prev => ({ ...prev, artificial: true }))
        const artificialResult = await dispatch(fetchProducts({ 
          type: 'jewellery',
          materialType: 'artificial',
          limit: 4 
        })).unwrap()
        setArtificialJewellery(artificialResult.products || [])
        setSectionsLoading(prev => ({ ...prev, artificial: false }))

        // Fetch Bags
        setSectionsLoading(prev => ({ ...prev, bags: true }))
        const bagsResult = await dispatch(fetchProducts({ 
          type: 'bag',
          limit: 4 
        })).unwrap()
        setHandbags(bagsResult.products || [])
        setSectionsLoading(prev => ({ ...prev, bags: false }))

        // Fetch Gifts
        setSectionsLoading(prev => ({ ...prev, gifts: true }))
        const giftsResult = await dispatch(fetchProducts({ 
          type: 'gift',
          limit: 4 
        })).unwrap()
        setGiftItems(giftsResult.products || [])
        setSectionsLoading(prev => ({ ...prev, gifts: false }))

        //Fetch Products with Videos 
        setSectionsLoading(prev => ({ ...prev, videos: true }))
        
        const videoResult = await dispatch(fetchProductsWithVideos({
          type: 'jewellery',
          limit: 4
        })).unwrap();
        setVideoProducts(videoResult || [])
        setSectionsLoading(prev => ({ ...prev, videos: false }))
      } catch (error) {
        console.error('Error fetching products:', error)
        // Set loading states to false on error
        setSectionsLoading({
          newArrivals: false,
          festive: false,
          silver: false,
          videos: false,
          artificial: false,
          bags: false,
          gifts: false
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
    <div className="min-h-screen">
      <Navbar />

      <main className="space-y-20">
        <section>
          <HeroCarousel slides={heroSlides} />
        </section>

        {/* New Arrivals */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="New Arrivals"
            subtitle="Discover our latest collection of exquisite jewelry pieces"
            className="mb-12 text-[#A77C38]"
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
              <div className="mt-8 text-center">
                <Link href="/collections/">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                    View All New Arrivals
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* As Seen On You section */}
        {/* <section className="container mx-auto px-4">
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
        </section> */}

        {/* Festive Favourites */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Festive Favourites"
            subtitle="Dazzle this season with our specially curated festive collection"
            className="mb-8 text-[#A77C38]"
          />
          {sectionsLoading.festive ? (
            <ProductSectionLoading />
          ) : (
            <>
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
            </>
          )}
        </section>

        {/* Shop by Category */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Shop by Category"
            subtitle="Explore our curated collections designed for every style and occasion"
            className="mb-8 text-[#A77C38]"
          />
          <CategoryCards gender="women" />
        </section>

        {/* Shine in Silver */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Shine in Silver"
            subtitle="Elegant and timeless silver pieces for a sophisticated look"
            className="mb-8 text-[#A77C38]"
            isSparkling={true}
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
              <div className="mt-8 text-center">
                <Link href="/collections/women/silver-jewellery">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                    View All Silver Jewellery
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>


          {/* Products with Videos Section */}
          <section className="container mx-auto px-4">
            <SectionTitle
              title="Our Collection in Motion"
              subtitle="See our stunning jewelry come to life"
              className="mb-8 text-[#A77C38]"
            />
            {/* Loading state jo pehle se hai, bilkul sahi hai */}
            {sectionsLoading.videos ? (
              <ProductSectionLoading />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {/* Ab hum 'videoProducts' state par map karenge */}
                  {videoProducts.map((product) => (
                    <VideoProductCard key={product._id} product={product} />
                  ))}
                </div>
                <div className="mt-8 text-center">
                  <Link href="/collections">
                    <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                      View All Collections
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </section>
        
        {/* Modern Glamour */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Modern Glamour"
            subtitle="Stunning and affordable artificial jewellery for every occasion"
            className="mb-8 text-[#a77c38]"
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
              <div className="mt-8 text-center">
                <Link href="/collections/women/artificial-jewellery">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                    View All Artificial Jewellery
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Chic Handbags */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Chic Handbags"
            subtitle="Complete your look with our stylish collection of handbags"
            className="mb-8 text-[#A77C38]"
          />
          {sectionsLoading.bags ? (
            <ProductSectionLoading />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {handbags.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/collections/bags">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                    View All Handbags
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Gifts for Her */}
        <section className="container mx-auto px-4">
          <SectionTitle
            title="Gifts for Her"
            subtitle="Find the perfect gift for every special occasion"
            className="mb-8 text-[#A77C38]"
          />
          {sectionsLoading.gifts ? (
            <ProductSectionLoading />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {giftItems.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/collections/gifts">
                  <Button variant="outline" size="lg" className="px-8 py-6 text-base hover:bg-[#FFFDF6] hover:cursor-pointer">
                    View All Gifts
                  </Button>
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Testimonials */}
        <section className="container mx-auto px-4">
          <Testimonials />
        </section>

        {/* Custom Jewelry Section */}
        <section id="contact" className="container mx-auto px-4">
          <SectionTitle
            title="Create Your Own Jewelry"
            subtitle="Have a unique idea? We can craft a one-of-a-kind piece, made just for you. Explore some of our past custom designs for inspiration."
            className="mb-12 text-[#A77C38]"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {customDesigns.map((design) => (
              <Link href="/customize-for-you" key={design.id}>
                <CustomDesignCard 
                  image={design.image}
                  title={design.title}
                  description={design.description}
                />
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/customize-for-you">
              <Button size="lg" className="bg-[#A77C38] px-10 py-7 text-lg hover:bg-[#966b2a]">
                Start Your Custom Design
              </Button>
            </Link>
          </div>
        </section>

        {/* Address Section */}
        <div className="mt-10">
          <div className="max-w-3xl mx-auto space-y-4 text-center bg-gray-50 p-12 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex justify-center mb-4">
              <MapPin className="h-12 w-12 text-[#A77C38]" strokeWidth={1.5} />
            </div>
            <h3 className="text-4xl font-bold font-serif text-[#A77C38]">
              Visit Our Showroom
            </h3>
            <p className="text-xl leading-relaxed text-gray-700">
              Shop No. 12, MC NO.181/225, Shri Ram Market, Gali Kunjas,<br />
              Dariba Kalan, Chandni Chowk, Delhi - 110006
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}