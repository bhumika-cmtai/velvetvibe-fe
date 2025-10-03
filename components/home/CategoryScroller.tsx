"use client";

import React, { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- FIX 1: Data structure updated to include an 'href' field for each item ---
// This makes the link destination for each category explicit and easier to manage.
const trendingCategories = [
    { 
        name: "Tops & T-Shirts", 
        image: "https://i.pinimg.com/1200x/59/3e/92/593e92a347c026b2880ddfce72747c92.jpg",
        href: "/shop?sub_category=Tops%20%26%20T-shirts"
    },
    { 
        name: "Sweaters", 
        image: "https://i.pinimg.com/1200x/e5/6c/19/e56c19c8f2d51ec86872c4e3096128ff.jpg",
        href: "/shop?sub_category=Sweaters"
    },
    { 
        name: "Tops", 
        image: "https://i.pinimg.com/1200x/b5/a3/c1/b5a3c1bb951ce6e369409033e0f3d557.jpg",
        href: "/shop?sub_category=Tops"
    },
    { 
        name: "Dresses", 
        image: "https://i.pinimg.com/736x/00/40/25/004025b789cf04180dc015fe538f480b.jpg",
        href: "/shop?sub_category=Dresses"
    },
    { 
        name: "Swimwear", 
        image: "https://i.pinimg.com/1200x/4a/43/b2/4a43b2574dbbb633fae70026ff501dd2.jpg",
        href: "/shop?sub_category=Swimwear"
    },
    { 
        name: "Jeans & Trousers", 
        image: "https://i.pinimg.com/1200x/f5/dd/a8/f5dda8b7f0024a272723ee4c3bfa9e57.jpg",
        href: "/shop?sub_category=Jeans%20%26%20Trousers"
    },
    { 
        name: "Outwear", 
        image: "https://i.pinimg.com/736x/4e/5a/b7/4e5ab764881c204a726dc7e85fab6f78.jpg",
        href: "/shop?sub_category=Outwear"
    },
];

export function CategoryScroller() {
    const scrollContainer = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: "left" | "right") => {
        if (scrollContainer.current) {
            scrollContainer.current.scrollBy({
                left: direction === "left" ? -300 : 300,
                behavior: "smooth",
            });
        }
    };

    return (
        <section className="my-12 md:my-16 overflow-hidden">
            {/* Custom CSS to hide scrollbar */}
            <style jsx>{`
                .hide-scrollbar {
                    -ms-overflow-style: none;  /* IE and Edge */
                    scrollbar-width: none;  /* Firefox */
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;  /* Chrome, Safari, Opera */
                }
            `}</style>
            
            <h2 className="text-3xl md:text-4xl font-serif text-[var(--primary-text-theme)] text-center mb-12">
                Shop By Category
            </h2>
            <div className="relative overflow-hidden ">
                <Button
                    onClick={() => handleScroll("left")}
                    variant="outline"
                    size="icon"
                    className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md hidden lg:flex"
                >
                    <ChevronLeft size={24} />
                </Button>
                <div
                    ref={scrollContainer}
                    className="flex items-center space-x-4 lg:space-x-8 overflow-x-auto pb-4 hide-scrollbar"
                >
                    {trendingCategories.map((category) => (
                        // --- FIX 2: The Link now directly uses the 'href' property from the data object ---
                        <Link key={category.name} href={category.href} className="flex-shrink-0 group">
                            <div className="flex flex-col items-center w-32 md:w-40">
                                <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-full overflow-hidden shadow-sm group-hover:shadow-lg transition-shadow">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <p className="mt-4 text-base font-semibold text-gray-800">{category.name}</p>
                            </div>
                        </Link>
                    ))}
                </div>
                <Button
                    onClick={() => handleScroll("right")}
                    variant="outline"
                    size="icon"
                    className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 rounded-full shadow-md hidden lg:flex"
                >
                    <ChevronRight size={24} />
                </Button>
            </div>
        </section>
    );
}