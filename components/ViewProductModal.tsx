"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from '@/lib/data';
import Image from "next/image";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Helper component for displaying a detail row
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  // Only render the row if the value is meaningful (not null, undefined, or an empty array)
  value && (!Array.isArray(value) || value.length > 0) ? (
    <div className="grid grid-cols-3 gap-4 py-3 border-b last:border-b-0">
      <dt className="font-semibold text-gray-600 break-words">{label}</dt>
      <dd className="col-span-2 text-gray-800">{value}</dd>
    </div>
  ) : null
);

export function ViewProductModal({ isOpen, onClose, product, status }: ViewProductModalProps) {
  const renderContent = () => {
    // --- ENHANCED SKELETON LOADER ---
    if (status === 'loading') {
      return (
        <div className="space-y-4">
          <Skeleton className="h-40 w-40 mx-auto rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      );
    }
    if (status === 'failed' || !product) {
      return <div className="text-center text-red-500 py-10">Failed to load product details. Please try again.</div>;
    }

    const priceString = `₹${product.price.toLocaleString()}` +
      (product.originalPrice && product.originalPrice > product.price 
        ? ` (Original: ₹${product.originalPrice.toLocaleString()})` 
        : '');

    return (
      <dl>
        {/* --- MAIN IMAGE (UNCHANGED) --- */}
        <div className="flex justify-center mb-4">
            <Image 
                src={product.images[0] || '/placeholder.svg'} 
                alt={product.name} 
                width={150} 
                height={150} 
                className="object-cover rounded-lg border bg-gray-50"
            />
        </div>

        {/* ================================================================= */}
        {/* --- CHANGE START: DISPLAY ALL IMAGES --- */}
        {/* ================================================================= */}
        <DetailRow 
          label="All Images" 
          value={
            <div className="flex overflow-x-auto space-x-2 p-2 bg-gray-100 rounded-md">
              {Array.isArray(product.images) && product.images.map((url, index) => (
                <Image 
                  key={index}
                  src={url}
                  alt={`${product.name} - image ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover rounded-md flex-shrink-0 border"
                />
              ))}
            </div>
          }
        />
        {/* ================================================================= */}
        {/* --- CHANGE END --- */}
        {/* ================================================================= */}
        
        <DetailRow label="Name" value={product.name} />
        <DetailRow label="Description" value={<p className="whitespace-pre-wrap">{product.description}</p>} />
        
        {/* ================================================================= */}
        {/* --- CHANGE START: DISPLAY VIDEO --- */}
        {/* ================================================================= */}
        <DetailRow
          label="Product Video"
          value={
            product.video && product.video[0] && (
              <video 
                src={product.video[0]} 
                controls 
                className="w-full rounded-lg border bg-black"
              >
                Your browser does not support the video tag.
              </video>
            )
          }
        />
        {/* ================================================================= */}
        {/* --- CHANGE END --- */}
        {/* ================================================================= */}

        <DetailRow label="Price" value={priceString} />
        <DetailRow label="Stock" value={product.stock} />
        <DetailRow label="Type" value={<Badge variant="outline" className="capitalize">{product.type}</Badge>} />
        <DetailRow label="Gender" value={product.gender} />
        <DetailRow label="Material" value={product.material} />
        
        <DetailRow 
          label="Tags" 
          value={
            <div className="flex flex-wrap gap-1">
              {Array.isArray(product.tags) && product.tags.map((t: string) => <Badge key={t}>{t}</Badge>)}
            </div>
          } 
        />
        <DetailRow 
          label="Colors" 
          value={
            <div className="flex flex-wrap gap-1">
              {Array.isArray(product.color) && product.color.map((c: string) => <Badge key={c} variant="secondary">{c}</Badge>)}
            </div>
          } 
        />

        {product.type === 'jewellery' && (
            <>
                <DetailRow label="Jewellery Category" value={product.jewelleryCategory} />
                <DetailRow label="Material Type" value={product.materialType} />
                <DetailRow label="Stones" value={Array.isArray(product.stones) ? product.stones.join(', ') : product.stones} />
            </>
        )}
         {product.type === 'bag' && (
            <DetailRow label="Sizes" value={Array.isArray(product.size) ? product.size.join(', ') : product.size} />
        )}
      </dl>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{status === 'loading' ? 'Loading Details...' : product?.name || 'Product Details'}</DialogTitle>
          <DialogDescription>
            A read-only view of the product's details from the database.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 max-h-[70vh] overflow-y-auto pr-4">
          {renderContent()}
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}