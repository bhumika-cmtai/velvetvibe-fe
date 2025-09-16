"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function PromoBanner() {
    return (
        <section className="my-12 md:my-20 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl text-white overflow-hidden">
            <div className="flex flex-col md:flex-row items-center">
                <div className="w-full md:w-1/2 p-8 md:p-16 text-center md:text-left z-10">
                    <p className="font-semibold tracking-widest opacity-80">
                        LIMITED TIME OFFER
                    </p>
                    <h2 className="text-4xl md:text-6xl font-serif mt-4">
                        End of Season Sale
                    </h2>
                    <p className="mt-4 max-w-md mx-auto md:mx-0 opacity-90">
                        Get up to 50% off on selected items. Don't miss out on these amazing deals.
                    </p>
                    <Button asChild className="mt-8 px-10 py-3 h-auto rounded-md font-semibold transition-colors">
                        <Link href="/shop?tags=sale">
                            Explore Deals
                        </Link>
                    </Button>
                </div>
                <div className="w-full md:w-1/2 h-80 md:h-[450px] relative">
                    <Image
                        src="/modelposter.png" // Your image path
                        alt="Sale promotion model"
                        fill
                        className="object-contain object-right-bottom"
                    />
                </div>
            </div>
        </section>
    );
}