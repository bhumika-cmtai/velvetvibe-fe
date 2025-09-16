"use client";

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/lib/redux/store';
import { fetchProducts } from '@/lib/redux/slices/productSlice';
import { Product } from '@/lib/types/product';
import ProductCard from '@/components/ProductCard'; // Your existing ProductCard
import { Loader2 } from 'lucide-react';

// Props to make the component reusable
interface ProductSectionProps {
  title: string;
  className?: string;
  queryParams: {
    limit?: number;
    category?: string;
    tags?: string;
    gender?: string;
  };
}

export function ProductSection({ title, queryParams, className }: ProductSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchProducts(queryParams))
      .unwrap()
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => {
        setError(err || `Failed to fetch products.`);
      })
      .finally(() => {
        setLoading(false);
      });
    // We stringify the object to prevent re-renders on every component load
  }, [dispatch, JSON.stringify(queryParams)]);

  // IMPORTANT: Map backend data (price, sale_price) to what ProductCard expects (base_price, price)
  const mappedProducts = products.map(p => ({
    // Map the prices
    base_price: p.price,
    price: p.sale_price ?? p.price,
    // Pass the rest of the product data
    _id: p._id,
    name: p.name,
    slug: p.slug,
    images: p.images,
    tags: p.tags,
    // Pass the full original object for cart/wishlist functionality in the card
    originalProduct: p 
  }));

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (error) {
      return <div className="text-center text-red-500 p-10">{error}</div>;
    }

    if (mappedProducts.length === 0) {
      return <div className="text-center text-gray-500 p-10">No products found.</div>;
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
        {mappedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <section className={`my-12 md:my-20 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-serif text-[var(--primary-text-theme)] text-center mb-12">
        {title}
      </h2>
      {renderContent()}
    </section>
  );
}