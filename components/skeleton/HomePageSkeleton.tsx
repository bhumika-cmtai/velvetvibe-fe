"use client"
import React from 'react';

// A reusable helper component for product card skeletons
const SkeletonCard = () => (
    <div className="space-y-3">
        <div className="aspect-[3/4] w-full bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
    </div>
);

// The main skeleton component for the entire homepage
const HomePageSkeleton = () => {
    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
            {/* Hero Section Skeleton */}
            <section className="flex flex-col lg:flex-row items-center justify-center gap-6 md:gap-8 animate-pulse">
                <div className="w-full lg:w-2/3 bg-gray-200 rounded-xl min-h-[400px]"></div>
                <div className="w-full lg:w-1/3 flex flex-col gap-6 md:gap-8">
                    <div className="bg-gray-200 rounded-xl h-[188px]"></div>
                    <div className="bg-gray-200 rounded-xl h-[188px]"></div>
                </div>
            </section>

            {/* Section Skeletons (Title + Grid) */}
            {[...Array(3)].map((_, i) => (
                <section key={i} className="my-12 md:my-20">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-12 animate-pulse"></div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {[...Array(4)].map((_, j) => (
                            <SkeletonCard key={j} />
                        ))}
                    </div>
                </section>
            ))}

            {/* Limited Time Offer Skeleton */}
            <section className="my-12 md:my-20 bg-gray-200 rounded-2xl h-[400px] animate-pulse"></section>

            {/* Style Your Space Skeleton */}
            <section className="my-12 md:my-16">
                <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-12 animate-pulse"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-6">
                    {[...Array(6)].map((_, j) => (
                        <div key={j} className="flex flex-col items-center gap-4">
                            <div className="aspect-square w-full bg-gray-200 rounded-full animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Services Section Skeleton */}
            <section className="my-12 md:my-16 bg-gray-100 rounded-2xl p-8 md:p-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 animate-pulse">
                    {[...Array(4)].map((_, j) => (
                        <div key={j} className="text-center space-y-4">
                            <div className="h-10 w-10 bg-gray-200 rounded-full mx-auto"></div>
                            <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section Skeleton */}
            <section className="my-12 md:my-20 bg-gray-100 rounded-2xl overflow-hidden animate-pulse">
                <div className="grid md:grid-cols-2 items-center min-h-[500px]">
                    <div className="p-8 md:p-12 h-full bg-gray-100"></div>
                    <div className="h-80 md:h-full w-full bg-gray-200"></div>
                </div>
            </section>
        </main>
    );
};

export default HomePageSkeleton;