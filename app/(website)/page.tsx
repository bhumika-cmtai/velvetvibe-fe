"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import HomePageSkeleton from "@/components/skeleton/HomePageSkeleton";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductSection } from "@/components/home/ProductSection";
import { CategoryScroller } from "@/components/home/CategoryScroller";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BrandLogos } from "@/components/home/BrandLogos";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { ContactForm } from "@/components/home/ContactForm";
import { StyleYourSpace } from "@/components/home/StyleYourSpace";

const HomePage = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect is now only for the initial page skeleton.
    // Each ProductSection will handle its own loading state.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
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
        
        <HeroSection />

        <ProductSection
          title="New Arrivals"
          queryParams={{ category: "Clothing", limit: 4 }}
        />

        <CategoryScroller />
        
        <ProductSection
          title="Trending Products"
          queryParams={{ tags: "hot", limit: 4 }}
        />

        <ProductSection
          title="Discover Our Decor Collection"
          queryParams={{ category: "Decorative", limit: 4 }}
        />

        <PromoBanner />
        <StyleYourSpace/> 
        
        <BrandLogos />
        
        <ProductSection
            title="Women's Fashion"
            queryParams={{ gender: "Women", category: "Clothing", limit: 4 }}
        />
        
        <ProductSection
          title="Featured Products"
          queryParams={{ tags: "feature",limit: 4 }} // Fetches the 4 latest products of any kind
        />
        
        <FeaturesSection />

        <ContactForm />

      </main>
    </div>
  );
};

export default HomePage;