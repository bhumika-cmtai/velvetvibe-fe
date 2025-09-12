// src/app/decorative/DecorativePageClient.tsx
"use client"

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/lib/data';
import { Product } from '@/lib/types/product';
import { DecorFiltersSidebar } from '@/components/DecorFiltersSidebar'; // Using the specific sidebar
import ProductCard from '@/components/ProductCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Define the structure for filter groups
const decorFilterGroups = [
    {
        id: 'sub_category',
        label: 'Category',
        options: [
            { id: 'Vases', label: 'Vases' },
            { id: 'Wall Art', label: 'Wall Art' },
            { id: 'Lamps', label: 'Lamps' },
            { id: 'Sculptures', label: 'Sculptures' },
            { id: 'Mirrors', label: 'Mirrors' },
        ],
    },
    {
        id: 'brand',
        label: 'Brand',
        options: [
            { id: 'Artisan Home', label: 'Artisan Home' },
            { id: 'Modern Canvas', label: 'Modern Canvas' },
            { id: 'Lumina', label: 'Lumina' },
            { id: 'Reflections Co.', label: 'Reflections Co.' },
        ],
    },
    {
        id: 'tags',
        label: 'Tags',
        options: [
            { id: 'New', label: 'New' },
            { id: 'Best Seller', label: 'Best Seller' },
            { id: 'Sale', label: 'Sale' },
        ],
    },
];

export default function DecorativePageClient() {
    const searchParams = useSearchParams();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});
    const [sortOption, setSortOption] = useState('newest');

    // Filter only decorative products from the main data source
    const decorativeProducts = useMemo(() => products.filter(p => p.category === 'Decor'), []);

    useEffect(() => {
        // Initialize filters from URL search params
        const initialFilters: Record<string, string[]> = {};
        const category = searchParams.get('category');
        if (category) {
            initialFilters['sub_category'] = [category];
        }
        setSelectedFilters(initialFilters);
    }, [searchParams]);

    useEffect(() => {
        let items = [...decorativeProducts];

        // Apply filters
        const activeFilterGroups = Object.keys(selectedFilters).filter(key => selectedFilters[key].length > 0);

        if (activeFilterGroups.length > 0) {
            items = items.filter(product => {
                return activeFilterGroups.every(groupId => {
                    const selectedValues = selectedFilters[groupId];
                    const productValue = product[groupId as keyof Product];

                    if (Array.isArray(productValue)) {
                        // For array fields like 'tags'
                        return selectedValues.some(v => productValue.includes(v));
                    }
                    // For string fields like 'sub_category' or 'brand'
                    return selectedValues.includes(productValue as string);
                });
            });
        }

        // Apply sorting
        switch (sortOption) {
            case 'price-asc':
                items.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                items.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                 // Assuming products are already somewhat sorted or don't have a date field
                 // For a real app, you'd sort by a `createdAt` date
                break;
        }

        setFilteredProducts(items);

    }, [selectedFilters, sortOption, decorativeProducts]);

    const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
        setSelectedFilters(prev => {
            const newGroup = prev[groupId] ? [...prev[groupId]] : [];
            if (checked) {
                if (!newGroup.includes(optionId)) newGroup.push(optionId);
            } else {
                const index = newGroup.indexOf(optionId);
                if (index > -1) newGroup.splice(index, 1);
            }
            return { ...prev, [groupId]: newGroup };
        });
    };

    const handleClearFilters = () => {
        setSelectedFilters({});
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Page Header */}
            <div className="bg-[var(--base-50)] rounded-2xl p-8 text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif text-[var(--primary-text-theme)]">
                    Home Decor Collection
                </h1>
                <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                    Find the perfect pieces to style your space, from elegant vases to stunning wall art.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <DecorFiltersSidebar
                    filters={decorFilterGroups}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-sm text-gray-600">
                            Showing <span className="font-semibold">{filteredProducts.length}</span> results
                        </p>
                        <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="newest">Newest</SelectItem>
                                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border-2 border-dashed rounded-lg">
                            <h3 className="text-xl font-semibold text-gray-700">No products found</h3>
                            <p className="mt-2 text-gray-500">Try adjusting your filters to find what you're looking for.</p>
                            <Button onClick={handleClearFilters} className="mt-4">Clear Filters</Button>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}