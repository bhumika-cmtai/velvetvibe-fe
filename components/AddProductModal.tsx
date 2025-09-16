"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Trash2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface VariantState {
  size: string;
  color: string;
  price: number;
  sale_price?: number;
  stock_quantity: number;
  sku_variant: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => Promise<void>;
}

const MAX_IMAGES = 5;

export function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
  const [activeCategory, setActiveCategory] = useState<'Clothing' | 'Decorative'>('Clothing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [variants, setVariants] = useState<VariantState[]>([
    { size: '', color: '', price: 0, sale_price: 0, stock_quantity: 0, sku_variant: '' }
  ]);
  
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(new Array(MAX_IMAGES).fill(null));
  const [imagePreviews, setImagePreviews] = useState<(string | null)[]>(new Array(MAX_IMAGES).fill(null));
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);

  const handleVariantChange = (index: number, field: keyof VariantState, value: string | number) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = value;
    setVariants(newVariants);
  };
  
  const addVariant = () => {
    setVariants([...variants, { size: '', color: '', price: 0, sale_price: 0, stock_quantity: 0, sku_variant: '' }]);
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index));
    } else {
      toast.info("A clothing item must have at least one variant.");
    }
  };

  const handleSingleImageChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];

    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]!);
    }

    if (file) {
      newFiles[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
    } else {
      newFiles[index] = null;
      newPreviews[index] = null;
    }
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const removeImage = (index: number) => {
    const newFiles = [...imageFiles];
    const newPreviews = [...imagePreviews];
    if (newPreviews[index]) {
      URL.revokeObjectURL(newPreviews[index]!);
    }
    newFiles[index] = null;
    newPreviews[index] = null;
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
  };
  
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      if (videoFile && videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
    }
  };
  
  const removeVideo = () => {
      setVideoFile(null);
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
  };

  const resetForm = () => {
      setActiveCategory('Clothing');
      setVariants([{ size: '', color: '', price: 0, sale_price: 0, stock_quantity: 0, sku_variant: '' }]);
      imagePreviews.forEach(url => { if (url) URL.revokeObjectURL(url); });
      setImageFiles(new Array(MAX_IMAGES).fill(null));
      setImagePreviews(new Array(MAX_IMAGES).fill(null));
      if (videoPreview) URL.revokeObjectURL(videoPreview);
      setVideoFile(null);
      setVideoPreview(null);
      setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFiles.some(file => file !== null)) {
        toast.error("Please upload at least one product image.");
        return;
    }
    setIsSubmitting(true);
    
    const form = e.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    data.append('category', activeCategory);

    if (activeCategory === 'Clothing') {
      data.delete('stock_quantity'); // Remove simple stock field for clothing
      for (const variant of variants) {
          if (!variant.size || !variant.color || !variant.sku_variant || variant.stock_quantity < 0 || variant.price <= 0) {
              toast.error("For variants: Size, Color, SKU, Price (>0), and Stock (>=0) are required.");
              setIsSubmitting(false);
              return;
          }
      }
      data.append('variants', JSON.stringify(variants));
    } else {
      // For decorative items, remove clothing-specific fields
      data.delete('gender');
      data.delete('fit');
      data.delete('sleeveLength');
      data.delete('neckType');
      data.delete('pattern');
      data.delete('careInstructions');
    }

    imageFiles.forEach(file => {
      if (file) {
        data.append('images', file);
      }
    });
    if (videoFile) data.append('video', videoFile);
    
    try {
        await onSave(data);
        resetForm();
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) { resetForm(); onClose(); } }}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>Select the category and fill in the details. * indicates required fields.</DialogDescription>
        </DialogHeader>

        <Tabs value={activeCategory} onValueChange={(v) => setActiveCategory(v as 'Clothing' | 'Decorative')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="Clothing">Clothing</TabsTrigger>
            <TabsTrigger value="Decorative">Decorative Item</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit}>
            <div className="py-4 max-h-[70vh] overflow-y-auto pr-4 space-y-4">
              
              <div className="space-y-2"><Label>Product Name *</Label><Input name="name" required /></div>
              <div className="space-y-2"><Label>Description *</Label><Textarea name="description" required /></div>
              <div className="space-y-2"><Label>Brand *</Label><Input name="brand" required /></div>
              <div className="space-y-2"><Label>Tags (comma-separated)</Label><Input name="tags" placeholder="e.g., casual, wedding" /></div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div><Label>Price (MRP) *</Label><Input name="price" type="number" step="0.01" required /></div>
                <div><Label>Sale Price</Label><Input name="sale_price" type="number" step="0.01" /></div>
              </div>

              <TabsContent value="Clothing" className="space-y-4 border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Gender *</Label><Select name="gender" required><SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger><SelectContent><SelectItem value="Men">Men</SelectItem><SelectItem value="Women">Women</SelectItem><SelectItem value="Unisex">Unisex</SelectItem></SelectContent></Select></div>
                    <div><Label>Fit</Label><Select name="fit"><SelectTrigger><SelectValue placeholder="Select Fit" /></SelectTrigger><SelectContent><SelectItem value="Regular Fit">Regular Fit</SelectItem><SelectItem value="Slim Fit">Slim Fit</SelectItem><SelectItem value="Oversized Fit">Oversized Fit</SelectItem></SelectContent></Select></div>
                    <div><Label>Sleeve Length</Label><Select name="sleeveLength"><SelectTrigger><SelectValue placeholder="Select Sleeves" /></SelectTrigger><SelectContent><SelectItem value="Half Sleeves">Half Sleeves</SelectItem><SelectItem value="Full Sleeves">Full Sleeves</SelectItem><SelectItem value="Sleeveless">Sleeveless</SelectItem></SelectContent></Select></div>
                    <div><Label>Neck Type</Label><Select name="neckType"><SelectTrigger><SelectValue placeholder="Select Neck Type" /></SelectTrigger><SelectContent><SelectItem value="Round Neck">Round Neck</SelectItem><SelectItem value="V-Neck">V-Neck</SelectItem><SelectItem value="Polo">Polo</SelectItem></SelectContent></Select></div>
                    <div><Label>Pattern</Label><Select name="pattern"><SelectTrigger><SelectValue placeholder="Select Pattern" /></SelectTrigger><SelectContent><SelectItem value="Solid">Solid</SelectItem><SelectItem value="Printed">Printed</SelectItem><SelectItem value="Striped">Striped</SelectItem></SelectContent></Select></div>
                    <div className="col-span-2"><Label>Care Instructions</Label><Textarea name="careInstructions" placeholder="e.g., Machine wash cold..." /></div>
                </div>
                
                <div className="space-y-2 pt-4 border-t">
                  <Label>Variants *</Label>
                  <div className="space-y-3">
                    {variants.map((variant, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 p-2 border rounded-md">
                        <div className="col-span-6 md:col-span-3"><Label className="text-xs">Size*</Label><Input value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} required /></div>
                        <div className="col-span-6 md:col-span-3"><Label className="text-xs">Color*</Label><Input value={variant.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} required /></div>
                        <div className="col-span-6 md:col-span-3"><Label className="text-xs">Variant Price (MRP)*</Label><Input type="number" value={variant.price || ''} onChange={e => handleVariantChange(index, 'price', parseFloat(e.target.value) || 0)} required /></div>
                        <div className="col-span-6 md:col-span-3"><Label className="text-xs">Variant Sale Price</Label><Input type="number" value={variant.sale_price || ''} onChange={e => handleVariantChange(index, 'sale_price', parseFloat(e.target.value) || 0)} /></div>
                        <div className="col-span-6 md:col-span-4"><Label className="text-xs">Stock*</Label><Input type="number" value={variant.stock_quantity} onChange={e => handleVariantChange(index, 'stock_quantity', parseInt(e.target.value) || 0)} required /></div>
                        <div className="col-span-6 md:col-span-7"><Label className="text-xs">SKU*</Label><Input value={variant.sku_variant} onChange={e => handleVariantChange(index, 'sku_variant', e.target.value)} required /></div>
                        <div className="col-span-12 md:col-span-1 flex items-end justify-end"><Button type="button" variant="ghost" size="icon" onClick={() => removeVariant(index)}><Trash2 className="h-4 w-4 text-red-500" /></Button></div>
                      </div>
                    ))}
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addVariant} className="mt-2">Add Variant</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="Decorative" className="space-y-4 border-t pt-4">
                  <div className="col-span-2"><Label>Stock Quantity *</Label><Input name="stock_quantity" type="number" required /></div>
              </TabsContent>

              <div className="space-y-4 border-t pt-4">
                <div className="space-y-2">
                  <Label>Product Images (up to 5) *</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {[...Array(MAX_IMAGES)].map((_, index) => (
                      <div key={index} className="space-y-1">
                        <Label htmlFor={`image-${index}`} className="text-xs text-muted-foreground">Image {index + 1}</Label>
                        <Input 
                          id={`image-${index}`}
                          type="file" 
                          accept="image/*" 
                          onChange={(e) => handleSingleImageChange(index, e)}
                          className="text-xs"
                        />
                        {imagePreviews[index] && (
                          <div className="relative mt-2 w-20 h-20">
                            <Image src={imagePreviews[index]!} alt={`preview ${index}`} layout="fill" className="object-cover rounded-md" />
                            <button type="button" onClick={() => removeImage(index)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                              <XCircle size={16} />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="video">Product Video (optional)</Label>
                  <Input id="video" name="video" type="file" accept="video/*" onChange={handleVideoChange} />
                  {videoPreview && (
                      <div className="relative w-full aspect-video mt-2">
                          <video src={videoPreview} controls className="w-full h-full object-cover rounded-md" />
                           <button type="button" onClick={removeVideo} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                            <XCircle size={16} />
                          </button>
                      </div>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter className="pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => { resetForm(); onClose(); }}>Cancel</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...</> : "Create Product"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}