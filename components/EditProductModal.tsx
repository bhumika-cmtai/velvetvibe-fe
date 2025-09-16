"use client";

import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, Variant } from '@/lib/types/product';
import { Loader2, Trash2, UploadCloud } from 'lucide-react';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (formData: FormData) => Promise<void>; // Expects a function that handles FormData
}

export function EditProductModal({ isOpen, onClose, product, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [variants, setVariants] = useState<Partial<Variant>[]>([]);
  const [tagsString, setTagsString] = useState("");
  
  const [imagePreviews, setImagePreviews] = useState<(string | File)[]>([]);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);

  const imageReplaceRefs = useRef<Array<HTMLInputElement | null>>([]);
  const imageAddRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({ ...product });
      setTagsString(product.tags?.join(', ') || "");
      setVariants(product.category === 'Clothing' ? product.variants || [] : []);
      setImagePreviews(product.images || []);
      setNewVideoFile(null);
    }
  }, [product]);

  if (!product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: keyof Product, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (index: number, field: keyof Variant, value: string | number) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };

  const addVariant = () => setVariants([...variants, { size: '', color: '', price: 0, sale_price: 0, stock_quantity: 0, sku_variant: '' }]);
  const removeVariant = (index: number) => setVariants(variants.filter((_, i) => i !== index));

  const handleReplaceImage = (index: number, file: File) => {
    const newPreviews = [...imagePreviews];
    newPreviews[index] = file;
    setImagePreviews(newPreviews);
  };

  const handleAddNewImages = (files: FileList) => {
    if (files) {
      const newFiles = Array.from(files);
      setImagePreviews(prev => [...prev, ...newFiles]);
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const finalFormData = new FormData();
    
    Object.entries(formData).forEach(([key, value]) => {
      if (!['images', 'variants', 'tags', '_id', 'createdAt', 'updatedAt', '__v'].includes(key) && value != null) {
        finalFormData.append(key, String(value));
      }
    });

    finalFormData.append('tags', tagsString.split(',').map(tag => tag.trim()).filter(Boolean).join(','));

    if (formData.category === 'Clothing') {
      finalFormData.append('variants', JSON.stringify(variants));
    }
    
    const finalImageOrder: string[] = [];
    const newImageFiles: File[] = [];

    imagePreviews.forEach(img => {
      if (typeof img === 'string') {
        finalImageOrder.push(img);
      } else {
        newImageFiles.push(img);
        finalImageOrder.push('NEW_FILE_PLACEHOLDER');
      }
    });

    newImageFiles.forEach(file => {
      finalFormData.append('images', file);
    });

    finalFormData.append('imageOrder', JSON.stringify(finalImageOrder));

    if (newVideoFile) {
      finalFormData.append('video', newVideoFile);
    }
    
    try {
      await onSave(finalFormData);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Edit Product: {product.name}</DialogTitle>
          <DialogDescription>
            Make changes to your product. The category is set to <span className="font-semibold">{formData.category}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
           <div className="py-4 max-h-[70vh] overflow-y-auto pr-4 space-y-4">
            
            <div><Label htmlFor="name">Name</Label><Input id="name" name="name" value={formData.name || ''} onChange={handleChange} /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} /></div>
            <div><Label htmlFor="brand">Brand</Label><Input id="brand" name="brand" value={formData.brand || ''} onChange={handleChange} /></div>
            <div><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" value={tagsString} onChange={(e) => setTagsString(e.target.value)} /></div>

            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div><Label htmlFor="price">Price (MRP)</Label><Input id="price" name="price" type="number" value={formData.price || ''} onChange={handleChange} /></div>
              <div><Label htmlFor="sale_price">Sale Price</Label><Input id="sale_price" name="sale_price" type="number" value={formData.sale_price || ''} onChange={handleChange} /></div>
            </div>

            {formData.category === 'Clothing' ? (
              <div className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Gender</Label><Select name="gender" value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Men">Men</SelectItem><SelectItem value="Women">Women</SelectItem><SelectItem value="Unisex">Unisex</SelectItem></SelectContent></Select></div>
                  <div><Label>Fit</Label><Select name="fit" value={formData.fit} onValueChange={(v) => handleSelectChange('fit', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Regular Fit">Regular Fit</SelectItem><SelectItem value="Slim Fit">Slim Fit</SelectItem><SelectItem value="Oversized Fit">Oversized Fit</SelectItem></SelectContent></Select></div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <Label>Variants</Label>
                  <div className="space-y-3">
                    {variants.map((variant, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 p-2 border rounded-md">
                        <div className="col-span-6 md:col-span-3"><Label className="text-xs">Size</Label><Input value={variant.size || ''} onChange={e => handleVariantChange(index, 'size', e.target.value)} /></div>
                        <div className="col-span-6 md:col-span-3"><Label className="text-xs">Color</Label><Input value={variant.color || ''} onChange={e => handleVariantChange(index, 'color', e.target.value)} /></div>
                        <div className="col-span-6 md:col-span-3"><Label className="text-xs">Variant Price</Label><Input type="number" value={variant.price || ''} onChange={e => handleVariantChange(index, 'price', parseFloat(e.target.value))} /></div>
                        <div className="col-span-6 md:col-span-3"><Label className="text-xs">Sale Price</Label><Input type="number" value={variant.sale_price || ''} onChange={e => handleVariantChange(index, 'sale_price', parseFloat(e.target.value))} /></div>
                        <div className="col-span-6 md:col-span-4"><Label className="text-xs">Stock</Label><Input type="number" value={variant.stock_quantity || 0} onChange={e => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value))} /></div>
                        <div className="col-span-6 md:col-span-7"><Label className="text-xs">SKU</Label><Input value={variant.sku_variant || ''} onChange={e => handleVariantChange(index, 'sku_variant', e.target.value)} /></div>
                        <div className="col-span-12 md:col-span-1 flex items-end justify-end"><Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant} className="mt-2">Add Variant</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 border-t pt-4">
                  <div><Label htmlFor="stock_quantity">Stock Quantity</Label><Input id="stock_quantity" name="stock_quantity" type="number" value={formData.stock_quantity || 0} onChange={handleChange} /></div>
              </div>
            )}
            
            <div className="space-y-4 border-t pt-4">
              <Label>Product Images</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {imagePreviews.map((img, index) => (
                  <div key={index} className="relative group aspect-square border rounded-md">
                    <img
                      src={typeof img === 'string' ? img : URL.createObjectURL(img)}
                      alt={`Product image ${index + 1}`}
                      className="object-cover w-full h-full rounded-md"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2">
                       <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-8 w-8"
                        onClick={() => imageReplaceRefs.current[index]?.click()}
                        title="Replace Image"
                      >
                        <UploadCloud className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 h-8 w-8"
                        onClick={() => handleRemoveImage(index)}
                        title="Delete Image"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                     <input
                      type="file"
                      accept="image/*"
                      // THIS IS THE CORRECTED LINE
                      ref={el => { imageReplaceRefs.current[index] = el; }}
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleReplaceImage(index, e.target.files[0])}
                    />
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  className="aspect-square flex flex-col items-center justify-center border-dashed hover:border-primary"
                  onClick={() => imageAddRef.current?.click()}
                >
                  <UploadCloud className="h-6 w-6 mb-2 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add Image</span>
                </Button>
                 <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={imageAddRef}
                  className="hidden"
                  onChange={(e) => e.target.files && handleAddNewImages(e.target.files)}
                />
              </div>
            </div>
            
            <div className="space-y-2 border-t pt-4">
              <Label htmlFor='video'>New Video (optional, replaces old one)</Label>
              <Input id="video" type="file" accept="video/*" onChange={(e) => setNewVideoFile(e.target.files?.[0] || null)} />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}