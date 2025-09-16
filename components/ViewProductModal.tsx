"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Product, Variant } from '@/lib/types/product';
import Image from "next/image";

interface ViewProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => {
  const isValuePresent = value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0);
  return isValuePresent ? (
    <div className="grid grid-cols-3 gap-4 py-3 border-b last:border-b-0">
      <dt className="font-semibold text-gray-600 break-words">{label}</dt>
      <dd className="col-span-2 text-gray-800">{value}</dd>
    </div>
  ) : null;
};

export function ViewProductModal({ isOpen, onClose, product, status }: ViewProductModalProps) {
  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="space-y-4">
          <Skeleton className="h-40 w-40 mx-auto rounded-lg" />
          <div className="space-y-2"><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-1/2" /></div>
          <Skeleton className="h-20 w-full" /><Skeleton className="h-32 w-full" />
        </div>
      );
    }
    if (status === 'failed' || !product) {
      return <div className="text-center text-red-500 py-10">Failed to load product details. Please try again.</div>;
    }

    const isVariable = product.variants && product.variants.length > 0;

    return (
      <dl>
        <div className="flex justify-center mb-4">
            <Image 
                src={product.images[0] || '/placeholder.svg'} 
                alt={product.name} 
                width={150} 
                height={150} 
                className="object-cover rounded-lg border bg-gray-50"
            />
        </div>
        
        <DetailRow label="All Images" value={
          <div className="flex overflow-x-auto space-x-2 p-2 bg-gray-100 rounded-md">
            {product.images.map((url, index) => (
              <Image key={index} src={url} alt={`${product.name} - image ${index + 1}`} width={80} height={80} className="object-cover rounded-md flex-shrink-0 border" />
            ))}
          </div>
        }/>
        
        <DetailRow label="Name" value={product.name} />
        <DetailRow label="Description" value={<p className="whitespace-pre-wrap">{product.description}</p>} />
        <DetailRow label="Video" value={ product.video && <video src={product.video} controls className="w-full rounded-lg border bg-black" /> } />
        
        {/* --- SIMPLIFIED PRICE DISPLAY --- */}
        <DetailRow 
            label={isVariable ? "Starting Price" : "Price"}
            value={
                <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-black">₹{product.sale_price?.toLocaleString() ?? product.price.toLocaleString()}</span>
                    {product.sale_price && (
                        <span className="text-sm text-gray-500 line-through">₹{product.price.toLocaleString()}</span>
                    )}
                </div>
            }
        />
        
        {!isVariable && <DetailRow label="Stock" value={product.stock_quantity} />}
        
        <DetailRow label="Category" value={<Badge variant="outline" className="capitalize">{product.category}</Badge>} />
        <DetailRow label="Brand" value={product.brand} />
        
        {product.category === 'Clothing' && (
          <>
            <DetailRow label="Gender" value={product.gender} />
            <DetailRow label="Fit" value={product.fit} />
            <DetailRow label="Sleeve Length" value={product.sleeveLength} />
            <DetailRow label="Neck Type" value={product.neckType} />
            <DetailRow label="Pattern" value={product.pattern} />
            <DetailRow label="Care Instructions" value={<p className="whitespace-pre-wrap">{product.careInstructions}</p>} />
          </>
        )}

        <DetailRow label="Tags" value={
          <div className="flex flex-wrap gap-1">
            {product.tags?.map((t: string) => <Badge key={t}>{t}</Badge>)}
          </div>
        }/>

        {isVariable && (
          <div className="pt-4 mt-4 border-t">
            <h3 className="text-lg font-semibold mb-2">Variants</h3>
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Size</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Price (MRP)</TableHead>
                    <TableHead>Sale Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>SKU</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {product.variants?.map((variant, index) => (
                    <TableRow key={index}>
                      <TableCell>{variant.size}</TableCell>
                      <TableCell>{variant.color}</TableCell>
                      <TableCell className={variant.sale_price ? 'line-through text-gray-500' : ''}>₹{variant.price.toLocaleString()}</TableCell>
                      <TableCell>{variant.sale_price ? `₹${variant.sale_price.toLocaleString()}` : 'N/A'}</TableCell>
                      <TableCell>{variant.stock_quantity}</TableCell>
                      <TableCell>{variant.sku_variant}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
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