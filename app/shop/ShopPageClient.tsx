// shop/ShopPageClient.tsx
"use client";

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

// --- Redux Imports ---
import { AppDispatch, RootState } from '@/lib/redux/store';
import { fetchProducts } from '@/lib/redux/slices/productSlice';

// --- Component Imports ---
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FiltersSidebar } from '@/components/FiltersSidebar';
import ProductCard from '@/components/ProductCard'; // Make sure this path is correct
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ProductGridSkeleton from '@/components/skeleton/ProductGridSkeleton'; // A skeleton for the product grid

// --- Data for Filters (Aap ise API se bhi fetch kar sakte hain) ---
const filterGroups = [
  {
    id: 'category',
    label: 'Category',
    options: [
      { id: 'Clothing', label: 'Clothing' },
      { id: 'Decorative', label: 'Decorative' },
    ],
  },
  {
    id: 'gender',
    label: 'Gender',
    options: [
      { id: 'Men', label: 'Men' },
      { id: 'Women', label: 'Women' },
      { id: 'Unisex', label: 'Unisex' },
    ],
  },
  {
    id: 'tags',
    label: 'Tags',
    options: [
      { id: 'New', label: 'New Arrival' },
      { id: 'Sale', label: 'On Sale' },
      { id: 'Bestseller', label: 'Bestseller' },
    ],
  },
];


export default function ShopPageClient() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- Redux State ---
  const { 
    items: products, 
    loading, 
    error,
    currentPage,
    totalPages,
    totalProducts
  } = useSelector((state: RootState) => state.product);

  // --- Local State for Filters ---
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

  // --- Data Fetching Effect ---
  // Yeh effect tab-tab chalega jab filters ya page number change hoga
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    
    // selectedFilters state se query params banayein
    Object.entries(selectedFilters).forEach(([key, values]) => {
        if (values.length > 0) {
            params.set(key, values.join(','));
        } else {
            params.delete(key);
        }
    });

    // Update the URL without reloading the page
    router.replace(`${pathname}?${params.toString()}`);
    
    // Redux action ko dispatch karein
    dispatch(fetchProducts(Object.fromEntries(params)));

  }, [selectedFilters, searchParams, dispatch, pathname, router]);


  // --- Filter Handlers ---
  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const newGroupFilters = prev[groupId] ? [...prev[groupId]] : [];
      if (checked) {
        if (!newGroupFilters.includes(optionId)) {
          newGroupFilters.push(optionId);
        }
      } else {
        const index = newGroupFilters.indexOf(optionId);
        if (index > -1) {
          newGroupFilters.splice(index, 1);
        }
      }
      return { ...prev, [groupId]: newGroupFilters };
    });
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
  };
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  // Memoize mapped products to prevent re-renders
  const mappedProducts = useMemo(() => products.map(p => ({
    _id: p._id,
    name: p.name,
    slug: p.slug,
    images: p.images,
    tags: p.tags,
    price: p.sale_price ?? p.price,
    base_price: p.sale_price ? p.price : undefined,
    originalProduct: p,
  })), [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* --- Header --- */}
        <div className="bg-gray-100 rounded-2xl p-8 text-center mb-12">
          <h1 className="text-4xl font-serif font-bold">Shop Collection</h1>
          <p className="text-gray-600 mt-2">Discover our curated selection of clothing and decorative items.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* --- Filters --- */}
          <FiltersSidebar 
            filters={filterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          
          {/* --- Product Grid & Results --- */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Showing <span className='font-bold'>{products.length}</span> of <span className='font-bold'>{totalProducts}</span> products</p>
              {/* Add sorting dropdown here if needed */}
            </div>

            {loading && products.length === 0 ? (
              <ProductGridSkeleton count={8} />
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg">Failed to load products. Please try again.</p>
                <p className="text-sm text-gray-500">{error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-700 text-lg font-semibold">No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters to find what you're looking for.</p>
                <Button onClick={handleClearFilters} variant="link" className='mt-2'>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
                {mappedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
            
            {/* --- Pagination --- */}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                    
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handlePageChange(currentPage + 1); }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}