"use client";

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from '@/lib/data';
import { Loader2 } from 'lucide-react';

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  // The onSave signature is updated to pass back files separately
  onSave: (updatedData: Partial<Product>, newImages: (File | null)[], newVideo: File | null) => void;
}

export function EditProductModal({ isOpen, onClose, product, onSave }: EditProductModalProps) {
  const [formData, setFormData] = useState<Partial<Product>>({});
  // State for newly selected files
  const [imageFiles, setImageFiles] = useState<(File | null)[]>(new Array(5).fill(null));
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData(product);
      // Reset file states each time the modal opens with a new product
      setImageFiles(new Array(5).fill(null));
      setVideoFile(null);
    }
  }, [product]);

  if (!product) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: keyof Product, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  const handleFileChange = (index: number, file: File | null) => {
    const newFiles = [...imageFiles];
    newFiles[index] = file;
    setImageFiles(newFiles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Pass the form data and the new files back to the parent page
    onSave(formData, imageFiles, videoFile);
  };
  
  const productTab = product.type || 'jewellery';
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsSubmitting(false); // Reset submitting state when closing
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader><DialogTitle>Edit: {product.name}</DialogTitle><DialogDescription>Make changes and click save. Uploading new images will replace all old ones.</DialogDescription></DialogHeader>
        <Tabs defaultValue={productTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jewellery">Jewellery</TabsTrigger>
            <TabsTrigger value="bag">Bag</TabsTrigger>
            <TabsTrigger value="gift">Gift</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <div className="py-4 max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="col-span-2"><Label htmlFor="name">Name</Label><Input id="name" value={formData.name || ''} onChange={handleChange} disabled={isSubmitting} /></div>
                    <div className="col-span-1"><Label>Original Price</Label><Input id="originalPrice" type="number" value={formData.originalPrice || ''} onChange={handleChange} disabled={isSubmitting} /></div>
                    <div className="col-span-1"><Label>Selling Price</Label><Input id="price" type="number" value={formData.price || ''} onChange={handleChange} disabled={isSubmitting} /></div>
                    <div className="col-span-1"><Label>Stock</Label><Input id="stock" type="number" value={formData.stock || 0} onChange={handleChange} disabled={isSubmitting} /></div>
                    <div className="col-span-1"><Label>Material</Label><Input id="material" value={formData.material || ''} onChange={handleChange} disabled={isSubmitting} /></div>
                    <div className="col-span-2"><Label>Description</Label><Textarea id="description" value={formData.description || ''} onChange={handleChange} disabled={isSubmitting} /></div>
                    <div className="col-span-2"><Label>Tags (comma-separated)</Label><Input id="tags" value={Array.isArray(formData.tags) ? formData.tags.join(', ') : ''} onChange={handleChange} disabled={isSubmitting} /></div>
                </div>

                <TabsContent value="jewellery">
                    <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="col-span-1"><Label>Gender</Label><Select value={formData.gender} onValueChange={(v) => handleSelectChange('gender', v)} disabled={isSubmitting}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Female">Female</SelectItem><SelectItem value="Male">Male</SelectItem><SelectItem value="Unisex">Unisex</SelectItem></SelectContent></Select></div>
                        <div className="col-span-1"><Label>Category</Label><Select value={formData.jewelleryCategory} onValueChange={(v) => handleSelectChange('jewelleryCategory', v)} disabled={isSubmitting}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Rings">Rings</SelectItem><SelectItem value="Earrings">Earrings</SelectItem><SelectItem value="Necklaces">Necklaces</SelectItem></SelectContent></Select></div>
                        <div className="col-span-1"><Label>Material Type</Label><Select value={formData.materialType} onValueChange={(v) => handleSelectChange('materialType', v)} disabled={isSubmitting}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="artificial">Artificial</SelectItem><SelectItem value="gold">Gold</SelectItem><SelectItem value="silver">Silver</SelectItem></SelectContent></Select></div>
                        <div className="col-span-1"><Label>Stones (comma-separated)</Label><Input id="stones" value={Array.isArray(formData.stones) ? formData.stones.join(', ') : ''} onChange={handleChange} disabled={isSubmitting}/></div>
                    </div>
                </TabsContent>
                <TabsContent value="bag">
                     <div className="grid grid-cols-2 gap-4 border-t pt-4">
                        <div className="col-span-1"><Label>Size (comma-separated)</Label><Input id="size" value={Array.isArray(formData.size) ? formData.size.join(', ') : ''} onChange={handleChange} disabled={isSubmitting}/></div>
                    </div>
                </TabsContent>
                <TabsContent value="gift" />

                <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
                    <p className="col-span-2 text-sm text-muted-foreground">Optionally upload new files to replace the existing ones.</p>
                    {[...Array(5)].map((_, i) => (
                        <div key={i}><Label htmlFor={`image-edit-${i}`}>Image {i + 1}</Label><Input id={`image-edit-${i}`} type="file" accept="image/*" onChange={(e) => handleFileChange(i, e.target.files?.[0] || null)} disabled={isSubmitting}/></div>
                    ))}
                    <div className="col-span-2"><Label htmlFor="video-edit">Video</Label><Input id="video-edit" type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} disabled={isSubmitting}/></div>
                </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}