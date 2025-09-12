"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/data";

import {
  Phone,
  Package,
  BadgeCheck,
  Truck,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import HomePageSkeleton from "@/components/skeleton/HomePageSkeleton";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [activeMensFilter, setActiveMensFilter] = useState("Shirt");
  const [activeWomensFilter, setActiveWomensFilter] = useState("Tops");

  const trendingScrollContainer = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const mensProducts = products.filter((p) => p.gender === "Men").slice(0, 3);
  const womensProducts = products
    .filter((p) => p.gender === "Women")
    .slice(0, 3);
  const newArrivals = products.slice(1, 5);
  const trendingProducts = products.slice(0, 4);
  const featuredProducts = products.slice(2, 6);
  
  // Decorative products (assuming you'll add these to your `products` data)
  const decorativeProducts = products.filter(p => p.category === 'Decor').slice(0, 3);

  const mensCategories = ["T-Shirt", "Shirt", "Sweater", "Outerwear"];
  const womensCategories = ["Dresses", "Tops", "Jeans", "Outerwear"];

  const brands = [
    { name: "Brand 1", logoUrl: "/calvin-klein.png" },
    {
      name: "Brand 2",
      logoUrl: "https://cdn.worldvectorlogo.com/logos/zara-2.svg",
    },
    { name: "Brand 3", logoUrl: "/Levis-Logo.png" },
    {
      name: "Brand 4",
      logoUrl: "https://cdn.worldvectorlogo.com/logos/gucci.svg",
    },
    {
      name: "Brand 5",
      logoUrl: "https://cdn.worldvectorlogo.com/logos/chanel-2.svg",
    },
  ];

  const featureItems = [
    {
      icon: <Phone size={40} className="mx-auto text-gray-700" />,
      title: "24/7 Customer Service",
      description:
        "We're here to help you with any questions or concerns you have, 24/7.",
    },
    {
      icon: <Package size={40} className="mx-auto text-gray-700" />,
      title: "14-Day Money Back",
      description:
        "If you're not satisfied with your purchase, simply return it within 14 days for a refund.",
    },
    {
      icon: <BadgeCheck size={40} className="mx-auto text-gray-700" />,
      title: "Our Guarantee",
      description:
        "We stand behind our products and services and guarantee your satisfaction.",
    },
    {
      icon: <Truck size={40} className="mx-auto text-gray-700" />,
      title: "Shipping Worldwide",
      description:
        "We ship our products worldwide, making them accessible to customers everywhere.",
    },
  ];

  const trendingCategories = [
    {
      name: "T-Shirts",
      count: 12,
      image:
        "https://i.pinimg.com/1200x/59/3e/92/593e92a347c026b2880ddfce72747c92.jpg",
    },
    {
      name: "Sweaters",
      count: 12,
      image:
        "https://i.pinimg.com/1200x/e5/6c/19/e56c19c8f2d51ec86872c4e3096128ff.jpg",
    },
    {
      name: "Tops",
      count: 12,
      image:
        "https://i.pinimg.com/1200x/b5/a3/c1/b5a3c1bb951ce6e369409033e0f3d557.jpg",
    },
    {
      name: "Dresses",
      count: 12,
      image:
        "https://i.pinimg.com/736x/00/40/25/004025b789cf04180dc015fe538f480b.jpg",
    },
    {
      name: "Swimwear",
      count: 12,
      image:
        "https://i.pinimg.com/1200x/4a/43/b2/4a43b2574dbbb633fae70026ff501dd2.jpg",
    },
    {
      name: "Jeans",
      count: 8,
      image:
        "https://i.pinimg.com/1200x/f5/dd/a8/f5dda8b7f0024a272723ee4c3bfa9e57.jpg",
    },
    {
      name: "Outwear",
      count: 8,
      image:
        "https://i.pinimg.com/736x/4e/5a/b7/4e5ab764881c204a726dc7e85fab6f78.jpg",
    },
  ];

    // New data for decorative categories
    const decorCategories = [
        { name: 'Vases & Pots', image: 'https://i.pinimg.com/736x/da/2e/4c/da2e4c8a2ea912ab7a01bb476bff6aa1.jpg' },
        { name: 'Wall Art', image: 'https://i.pinimg.com/1200x/f7/ea/d0/f7ead02fe6955e841c431fba560bf439.jpg' },
        { name: 'Lamps', image: 'https://i.pinimg.com/1200x/58/35/ae/5835ae5dfcf985c2edbc10a504194036.jpg' },
        { name: 'Rugs', image: 'https://i.pinimg.com/736x/cf/62/7b/cf627b0e8ec6937aff3f4235218af714.jpg' },
        { name: 'Sculptures', image: 'https://i.pinimg.com/736x/37/17/28/371728a2e5519521e764def31992a810.jpg' },
        { name: 'Mirrors', image: 'https://i.pinimg.com/736x/d7/3a/6b/d73a6bd9f4cd776c86a6d2f991d0a455.jpg' },
    ];

  const handleScroll = (direction: "left" | "right") => {
    if (trendingScrollContainer.current) {
      trendingScrollContainer.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const container = trendingScrollContainer.current;
    const handleScrollProgress = () => {
      if (container) {
        const { scrollLeft, scrollWidth, clientWidth } = container;
        if (scrollWidth === clientWidth) {
          setScrollProgress(100);
          return;
        }
        setScrollProgress((scrollLeft / (scrollWidth - clientWidth)) * 100);
      }
    };
    container?.addEventListener("scroll", handleScrollProgress);
    return () => container?.removeEventListener("scroll", handleScrollProgress);
  }, []);


  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100); // Show skeleton for simulate loading

    return () => clearTimeout(timer);
  }, []);

  // --- RENDER THE SKELETON WHEN isLoading IS TRUE ---
  if (isLoading) {
    // Note: Your layout.tsx will wrap this with Header, Navbar, and Footer
    return (
        <>
            <Header />
            <Navbar />
            <HomePageSkeleton />
        </>
    );
  }

  return (
    <div className="bg-[var(--base-50)]/30">
      <Header />
      <Navbar />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* --- Hero Section --- */}
        <section className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8">
          <div className="w-full lg:w-2/3 relative bg-[var(--base-100)] rounded-xl flex  p-6 md:p-12 min-h-[400px] lg:min-h-0">
            <div className="flex-1 z-10">
              <p className="text-sm font-semibold text-[var(--pallete-100)] tracking-widest">
                FRESH AND TASTY
              </p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif text-black mt-4 leading-tight">
                New Season <br /> Women's Style
              </h2>
              <p className="mt-4 text-gray-600 max-w-md">
                Discover the beauty of fashion living
              </p>
              <button className="mt-8 px-8 py-3 rounded-md font-semibold bg-[var(--primary-button-theme)] hover:bg-[var(--secondary-button-theme)] text-[var(--primary-button-text)] hover:text-[var(--secondary-button-text)] transition-colors">
                <a href="/shop">
                SHOP NOW
                </a>
              </button>
            </div>
            <div className="flex-1 hidden md:block absolute right-0 bottom-0 top-0 w-1/2">
              <Image
                src="https://i.pinimg.com/1200x/56/95/e9/5695e9fbe54af61de6387af503be7766.jpg"
                alt="Woman in a blue suit"
                fill
                className="object-cover rounded-r-xl"
              />
            </div>
          </div>
          <div className="w-full lg:w-1/3 flex flex-col gap-6 md:gap-8">
          <Link href="/shop/sale" className="block">
            <div className="bg-[var(--base-100)] p-6 sm:p-8 rounded-xl flex-1 relative overflow-hidden" >
              <span className="absolute md:top-2 top-[2px] left-4 bg-red-400 text-white text-xs px-2 py-1 rounded">
                SAVE ₹10
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold">
                Dive Into Savings <br /> On Swimwear
              </h3>
              <p className="text-base sm:text-lg mt-2 text-gray-700">
                Starting at{" "}
                <span className="text-red-400 font-bold">₹59.99</span>
              </p>
              <div className="absolute -right-8 -bottom-8">
                <Image
                  src="https://i.pinimg.com/1200x/08/de/e7/08dee7d9318b38087eaf7ab667a14450.jpg"
                  alt="Swimwear model"
                  width={180}
                  height={230}
                />
              </div>
            </div>
            </Link>
          <Link href="/shop/sale"  className="block">
            <div className="bg-[var(--base-100)] p-6 sm:p-8 rounded-xl flex-1 relative overflow-hidden">
              <span className="absolute md:top-2 top-[2px] left-4 bg-red-400 text-white text-xs px-2 py-1 rounded">
                SAVE ₹10
              </span>
              <h3 className="text-xl sm:text-2xl font-serif font-semibold">
                20% Off <br /> Accessories
              </h3>
              <p className="text-base sm:text-lg mt-2 text-gray-700">
                Starting at{" "}
                <span className="text-red-500 font-bold">₹59.99</span>
              </p>
              <div className="absolute right-4 bottom-4 sm:right-8 sm:bottom-8">
                <Image
                  src="https://i.pinimg.com/1200x/d8/0e/90/d80e90c940fd042619f579ff45df2189.jpg"
                  alt="Sunglasses"
                  width={120}
                  height={120}
                />
              </div>
            </div>
            </Link>
          </div>
        </section>

        {/* 1. New Arrivals Section */}
        <section className="my-12 md:my-20">
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--primary-text-theme)] text-center mb-12">
            New Arrivals
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* 2. Shop By Category Section */}
        <section className="my-12 md:my-16">
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--primary-text-theme)] text-center mb-12">
            Shop By Category
          </h2>
          <div className="relative">
            <button
              onClick={() => handleScroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hidden lg:block"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => handleScroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all hidden lg:block"
            >
              <ChevronRight size={24} />
            </button>
            <div
              ref={trendingScrollContainer}
              className="flex items-center space-x-4 lg:space-x-8 overflow-x-auto pb-4 hide-scrollbar"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              {trendingCategories.map((category) => (
                <Link key={category.name} href={`/shop?category=₹{category.name}`} className="flex flex-col items-center flex-shrink-0">
                <div
                  key={category.name}
                  className="flex flex-col items-center flex-shrink-0"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden shadow-sm">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 text-base font-semibold text-gray-800">
                    {category.name}{" "}
                  </p>
                </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 3. Trending Products Section */}
        <section className="my-12 md:my-20">
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--primary-text-theme)] text-center mb-12">
            Trending Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trendingProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* --- NEW DECORATIVE SECTION 1 --- */}
        <section className="my-12 md:my-16">
            <div className="flex flex-col md:flex-row-reverse md:justify-between md:items-center gap-4 mb-8">
                <h2 className="text-3xl md:text-4xl font-serif text-[var(--secondary-text-theme)] text-center md:text-left">
                    Discover Our Decor Collection
                </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {decorativeProducts.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
                <div
                    className="rounded-2xl p-8 flex items-center justify-center text-center bg-cover bg-center aspect-[3/4]"
                    style={{
                        backgroundImage:
                        "url('https://i.pinimg.com/736x/66/2c/42/662c427c00e1c721bcc75992805cf59d.jpg')",
                    }}
                >
                    <h3 className="text-3xl font-bold text-white bg-opacity-30 px-4 py-2 rounded">
                        Art for Your Home
                    </h3>
                </div>
            </div>
        </section>

        {/* 4. Limited time offer */}
        <section className="my-12 md:my-20 bg-[var(--base-500)] rounded-2xl text-white overflow-hidden">
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 p-8 md:p-16 text-center md:text-left z-10">
              <p className="text-[var(--pallete-50)] font-semibold  tracking-widest opacity-80">
                LIMITED TIME OFFER
              </p>
              <h2 className="text-4xl md:text-6xl font-serif mt-4">
                End of Season Sale
              </h2>
              <p className="mt-4 max-w-md mx-auto md:mx-0 opacity-90">
                Get up to 50% off on selected items. Don't miss out on these
                amazing deals.
              </p>
              <button className="mt-8 bg-[var(--primary-button-theme)] hover:bg-[var(--secondary-button-theme)] text-[var(--primary-button-text)] hover:text-[var(--secondary-button-text)] px-10 py-3 rounded-md font-semibold transition-colors">
                <Link href="/shop/sale">
                  Explore Deals
                </Link>
              </button>
            </div>

            <div className="w-full md:w-1/2 self-end  md:h-[450px] relative">
              {/* <Image
                    src="/modelposter.png" // Aapki image ka path
                    alt="Sale promotion model"
                    fill
                    className="object-contain object-right-bottom" // Yeh classes image ko right-bottom mein align karti hain
                /> */}
            </div>
          </div>
        </section>
        
        {/* --- NEW DECORATIVE SECTION 2 --- */}
        <section className="my-12 md:my-16">
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--primary-text-theme)] text-center mb-12">
                Style Your Space
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                {decorCategories.map((category) => (
                    <Link key={category.name} href={`/shop/decoratives?category=₹{category.name}`} className="group">
                        <div className="relative aspect-square w-full rounded-full overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <p className="mt-4 text-center text-base font-semibold text-[var(--secondary-text-theme)] group-hover:text-[var(--primary-text-theme)]">
                            {category.name}
                        </p>
                    </Link>
                ))}
            </div>
        </section>

        {/* 6. Shop By Brand Section */}
        <section className="my-12 md:my-20">
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--primary-text-theme)] text-center mb-12">
            Shop By Brand
          </h2>
          <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-6 md:gap-x-16">
            {brands.map((brand) => (
              <a href="#" key={brand.name} className="relative h-12 w-24">
                <Image
                  src={brand.logoUrl}
                  alt={`₹{brand.name} logo`}
                  fill
                  className="object-contain filter grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
                />
              </a>
            ))}
          </div>
        </section>

        {/* 7. Women's Fashion Section */}
        <section className="my-12 md:my-16">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--secondary-text-theme)] text-center md:text-left">
              Women's Fashion
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {womensCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveWomensFilter(cat)}
                  className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-full shadow-lg transition-colors ₹{
                    activeWomensFilter === cat
                      ? "bg-[var(--blue-light-300)] text-white"
                      : "bg-[var(--base-10)] text-gray-700 hover:bg-[var(--base-10)]"
                  }`}
                >
                  {cat.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div
              className="rounded-2xl p-8 flex items-center justify-center text-center bg-cover bg-center aspect-[3/4] hover:underline text-white hover:cursor-pointer "
              style={{
                backgroundImage:
                  "url('https://i.pinimg.com/1200x/34/7d/b4/347db4a304386cce2aca75efc3903cdb.jpg')",
              }}
            >
              <h3 className="text-3xl font-bold text-white  bg-opacity-30 px-4 py-2 bg-inherit rounded  ">
                Fashion For Women
              </h3>
            </div>
            {womensProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* 8. Timeless Elegance (Ethnic Collection) Section */}
        <section className="my-12 md:my-20 bg-[var(--pallete-50)]/30 rounded-2xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <p className="text-lg font-semibold text-[var(--gold-dark)] tracking-widest">
              TIMELESS ELEGANCE
            </p>
            <h2 className="text-4xl md:text-5xl font-serif text-gray-800 mt-4 leading-tight">
              The Ethnic Collection
            </h2>
            <p className="mt-4 text-gray-600 max-w-md">
              Discover traditional wear reimagined for the modern wardrobe.
              Perfect for festive seasons and special occasions.
            </p>
            <button className="mt-8 bg-[var(--primary-button-theme)] hover:bg-[var(--secondary-button-theme)] text-[var(--primary-button-text)] hover:text-[var(--secondary-button-text)]  px-10 py-3 rounded-md font-semibold  transition-colors">
              <Link href="/shop/ethnic-wear">
                Shop Ethnic Wear
              </Link>
            </button>
          </div>
          <div className="md:w-1/2 h-80 relative rounded-xl overflow-hidden w-full">
            <Image
              src="/ethenicmodel.png"
              alt="Ethnic Wear"
              fill
              className="object-cover"
            />
          </div>
        </section>

        {/* 9. Featured Products Section */}
        <section className="my-12 md:my-20">
          <h2 className="text-3xl md:text-4xl font-serif text-[var(--primary-text-theme)] text-center mb-12">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>

        {/* 10. Services (Features/Guarantee) Section */}
        <section className="my-12 md:my-16 bg-[var(--base-10)] rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {featureItems.map((item) => (
              <div key={item.title} className="text-center">
                {item.icon}
                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 11. contact */}
        <section className="my-12 md:my-20 bg-[var(--base-10)] rounded-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            {/* Left Side: Form and Text */}
            <div className="p-8 md:p-12">
              <p className="font-semibold tracking-widest text-sm uppercase text-gray-500">
                HAVE A QUESTION?
              </p>
              <h2 className="text-4xl md:text-5xl font-serif text-[var(--primary-text-theme)] mt-2">
                Get In Touch
              </h2>
              <p className="mt-4 text-gray-600 max-w-md">
                We'd love to hear from you. Whether it's a question about our
                products, an order, or just a hello, feel free to reach out.
              </p>

              {/* Contact Form */}
              <form className="mt-8 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black transition"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black transition"
                  />
                </div>
                <div>
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full p-3 rounded-md border border-gray-300 focus:ring-1 focus:ring-black transition resize-none"
                  ></textarea>
                </div>
                <Button className="w-full h-12 rounded-md font-bold text-base bg-[var(--primary-button-theme)] hover:bg-[var(--secondary-button-theme)] text-[var(--primary-button-text)] hover:text-[var(--secondary-button-text)]">
                  Send Message
                </Button>
              </form>
            </div>

            {/* Right Side: Image and Details */}
            <div className="relative h-80 md:h-full w-full min-h-[400px]">
              <Image
                src="https://i.pinimg.com/736x/16/c6/b2/16c6b2a7922b069f8628e7dd0a3f62e4.jpg"
                alt="Customer Support"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                      <Mail size={20} />
                      <span>hi.florawear@example.com</span>
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                      <Phone size={20} />
                      <span>1-333-345-6868</span>
                  </div>
                  <div className="flex items-center gap-3">
                      <MapPin size={20} />
                      <span>abcd street, Noida, India</span>
                  </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;