"use client"

import React, { useEffect, useState } from "react"
import { ProductCard } from "./ProductCard"
import type { CartItem } from "@/lib/redux/slices/cartSlice" 
import type { Product } from "@/lib/data"
import useEmblaCarousel from 'embla-carousel-react'
// This import is correct and will work after reinstalling the packages
import Autoplay from 'embla-carousel-autoplay' 
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./ui/button"

import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/lib/redux/store"
import { fetchProducts } from "@/lib/redux/slices/productSlice"
import { SmallCard } from "./SmallCard"

// Use the shared Product type from lib/data

interface RecommendedProductsProps {
  cartItems: CartItem[];
}

export function RecommendedProducts({ cartItems }: RecommendedProductsProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { items: allProducts, loading: productsLoading } = useSelector((state: RootState) => state.product);
  const [recommended, setRecommended] = useState<Product[]>([]);
  
  // This line is correct and will no longer cause a type error
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' }, [Autoplay({ delay: 4000 })]);

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  useEffect(() => {
    dispatch(fetchProducts({ limit: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (cartItems.length === 0 || allProducts.length === 0) {
      setRecommended([]);
      return;
    }

    const cartProductIds = new Set(cartItems.map(item => item.product._id));
    const availableProducts = allProducts.filter(p => !cartProductIds.has(p._id));
    type CartProductLike = Partial<Product> & {
      _id: string;
      name: string;
      price: number;
      images: string[];
      stock: number;
    };
    const cartProducts: CartProductLike[] = cartItems.map(item => item.product as CartProductLike);

    const cartFeatures = {
      genders: new Set(cartProducts.map(p => p.gender).filter(Boolean)),
      types: new Set(cartProducts.map(p => p.type).filter(Boolean)),
      categories: new Set(cartProducts.map(p => p.jewelleryCategory).filter(Boolean)),
      materials: new Set(cartProducts.map(p => p.materialType).filter(Boolean)),
      stones: new Set(cartProducts.flatMap(p => p.stones || []).filter(Boolean)),
    };

    const scoredProducts = availableProducts.map(product => {
      let score = 0;
      if (product.gender && cartFeatures.genders.has(product.gender)) score += 1;
      if (product.type && cartFeatures.types.has(product.type)) score += 2;
      if (product.jewelleryCategory && cartFeatures.categories.has(product.jewelleryCategory)) score += 3;
      if (product.materialType && cartFeatures.materials.has(product.materialType)) score += 2;
      if (product.stones?.some((stone:string) => cartFeatures.stones.has(stone))) score += 1;
      return { ...product, score };
    });

    scoredProducts.sort((a, b) => b.score - a.score);
    
    let finalRecommendations = scoredProducts.filter(p => p.score > 0);

    if (finalRecommendations.length < 10) {
      const unscoredProducts = scoredProducts.filter(p => p.score === 0);
      const needed = 10 - finalRecommendations.length;
      const randomFill = unscoredProducts.sort(() => 0.5 - Math.random()).slice(0, needed);
      finalRecommendations.push(...randomFill);
    }

    setRecommended(finalRecommendations.slice(0, 10));

  }, [cartItems, allProducts]);

  if (productsLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-2xl font-serif font-bold mb-6">Recommended For You</h2>
        <p>Loading recommendations...</p>
      </div>
    );
  }

  if (recommended.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12 border-t">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif font-bold">Recommended For You</h2>
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} aria-label="Previous recommendation">
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} aria-label="Next recommendation">
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
      </div>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {recommended.map(product => (
            <div key={product._id} className="flex-grow-0 flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 pl-4">
              <SmallCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}