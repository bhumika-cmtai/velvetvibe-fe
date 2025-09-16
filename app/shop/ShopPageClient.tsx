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
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import ProductGridSkeleton from '@/components/skeleton/ProductGridSkeleton';

// --- POORE FILTERS KA DATA ---
const allFilterGroups = [
  {
    id: 'category',
    label: 'Category',
    options: [
      { id: 'Clothing', label: 'Clothing' },
      { id: 'Decorative', label: 'Decorative' },
    ],
  },
  {
    id: 'sub_category',
    label: 'Sub-Category',
    isClothing: true, // Yeh flag batata hai ki yeh sirf clothing ke liye hai
    options: [
      { id: "Tops & T-shirts", label: "Tops & T-shirts" }, { id: "Dresses", label: "Dresses" }, 
      { id: "Jeans & Trousers", label: "Jeans & Trousers" }, { id: "Kurta", label: "Kurta" },
      { id: "Saree", label: "Saree" }, { id: "Lehenga Choli", label: "Lehenga Choli" },
    ],
  },
  {
    id: 'gender',
    label: 'Gender',
    options: [ { id: 'Men', label: 'Men' }, { id: 'Women', label: 'Women' }, { id: 'Unisex', label: 'Unisex' } ],
  },
  {
    id: 'fit',
    label: 'Fit',
    isClothing: true,
    options: [ { id: 'Slim Fit', label: 'Slim Fit' }, { id: 'Regular Fit', label: 'Regular Fit' }, { id: 'Oversized Fit', label: 'Oversized Fit' } ],
  },
  {
    id: 'pattern',
    label: 'Pattern',
    isClothing: true,
    options: [ { id: 'Solid', label: 'Solid' }, { id: 'Printed', label: 'Printed' }, { id: 'Striped', label: 'Striped' }, { id: 'Checked', label: 'Checked' } ],
  },
  {
    id: 'sleeveLength',
    label: 'Sleeve Length',
    isClothing: true,
    options: [ { id: 'Full Sleeves', label: 'Full Sleeves' }, { id: 'Half Sleeves', label: 'Half Sleeves' }, { id: 'Sleeveless', label: 'Sleeveless' } ],
  },
  {
    id: 'neckType',
    label: 'Neck Type',
    isClothing: true,
    options: [ { id: 'Round Neck', label: 'Round Neck' }, { id: 'V-Neck', label: 'V-Neck' }, { id: 'Polo', label: 'Polo' } ],
  },
  {
    id: 'tags',
    label: 'Tags',
    options: [ { id: 'New', label: 'New Arrival' }, { id: 'Sale', label: 'On Sale' }, { id: 'Ethnic', label: 'Ethnic' }, { id: 'Hot', label: 'Best Seller' } ],
  },
];


export default function ShopPageClient() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { items: products, loading, error, currentPage, totalPages, totalProducts } = useSelector((state: RootState) => state.product);
  
  // State ko URL se initialize karein
  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>(() => {
    const filters: Record<string, string[]> = {};
    searchParams.forEach((value, key) => {
      if (key !== 'page') filters[key] = value.split(',');
    });
    return filters;
  });
  // Smart filter logic: Sirf relevant filters dikhayein
  const displayedFilterGroups = useMemo(() => {
    const selectedCategory = selectedFilters.category || [];
    if (selectedCategory.includes('Decorative') && !selectedCategory.includes('Clothing')) {
      return allFilterGroups.filter(group => !group.isClothing);
    }
    return allFilterGroups;
  }, [selectedFilters.category]);


  // --- INFINITE LOOP FIX: useEffect ko do alag hisso mein toda gaya hai ---

  // HOOK 1: Sirf data fetch karega jab URL (`searchParams`) badlega.
  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(fetchProducts(params));
  }, [searchParams, dispatch]);


  // HOOK 2: Sirf URL ko update karega jab user filters (`selectedFilters`) ko badlega.
  useEffect(() => {
    // searchParams (jo read-only hai) se ek naya, modifiable object banayein
    const params = new URLSearchParams(searchParams.toString());

    // Saare filter keys jo humare paas hain (e.g., 'category', 'sub_category')
    const allFilterKeys = allFilterGroups.map(g => g.id);

    // Pehle purane saare filter keys hata do taaki hum fresh start kar sakein
    allFilterKeys.forEach(key => params.delete(key));

    // Ab, `selectedFilters` state se nayi values daalo
    Object.entries(selectedFilters).forEach(([key, values]) => {
        if (values.length > 0) {
            params.set(key, values.join(','));
        }
    });

    // Hamesha page 1 par jao jab filter change ho
    params.set('page', '1');
    
    // Router ko naye parameters ke saath update karo
    router.replace(`${pathname}?${params.toString()}`);

// eslint-disable-next-line react-hooks/exhaustive-deps
}, [selectedFilters, pathname, router]); // Dependency array ko same rakhein



  // --- Filter Handlers ---
  const handleFilterChange = (groupId: string, optionId: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const newGroupFilters = prev[groupId] ? [...prev[groupId]] : [];
      if (checked) {
        if (!newGroupFilters.includes(optionId)) newGroupFilters.push(optionId);
      } else {
        const index = newGroupFilters.indexOf(optionId);
        if (index > -1) newGroupFilters.splice(index, 1);
      }
      
      const updatedFilters = { ...prev, [groupId]: newGroupFilters };

      // Jab category change ho, to clothing-specific filters ko reset kar do
      if (groupId === 'category') {
          allFilterGroups.forEach(group => {
              if (group.isClothing) delete updatedFilters[group.id];
          });
      }
      return updatedFilters;
    });
  };

  const handleClearFilters = () => setSelectedFilters({});
  
  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', page.toString());
    router.push(`${pathname}?${params.toString()}`);
  }

  // Mapped products for ProductCard
  const mappedProducts = useMemo(() => products.map(p => ({
    _id: p._id, name: p.name, slug: p.slug, images: p.images, tags: p.tags,
    price: p.sale_price ?? p.price,
    base_price: p.sale_price ? p.price : undefined,
    originalProduct: p,
  })), [products]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gray-100 rounded-2xl p-8 text-center mb-12">
          <h1 className="text-4xl font-serif font-bold">Shop Collection</h1>
          <p className="text-gray-600 mt-2">Discover our curated selection of clothing and decorative items.</p>
        </div>
        <div className="flex flex-col lg:flex-row gap-8">
          <FiltersSidebar 
            filters={displayedFilterGroups}
            selectedFilters={selectedFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600">Showing <span className='font-bold'>{products.length}</span> of <span className='font-bold'>{totalProducts}</span> products</p>
            </div>
            {loading && products.length === 0 ? (
              <ProductGridSkeleton count={9} />
            ) : error ? (
              <div className="text-center py-20 text-red-500">Failed to load products. Please try again.</div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-700 text-lg font-semibold">No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters.</p>
                <Button onClick={handleClearFilters} variant="link" className='mt-2'>Clear Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-8">
                {mappedProducts.map(product => <ProductCard key={product._id} product={product} />)}
              </div>
            )}
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" onClick={(e) => { e.preventDefault(); if (currentPage > 1) handlePageChange(currentPage - 1); }} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink href="#" onClick={(e) => { e.preventDefault(); handlePageChange(i + 1); }} isActive={currentPage === i + 1}>{i + 1}</PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext href="#" onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) handlePageChange(currentPage + 1); }} className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} />
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