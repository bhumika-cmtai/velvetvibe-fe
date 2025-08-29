"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from '@/lib/data';
import { Loader2 } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: FormData) => void;
}

export function AddProductModal({ isOpen, onClose, onSave }: AddProductModalProps) {
  const [activeTab, setActiveTab] = useState('jewellery');
  const [formData, setFormData] = useState<Partial<Product>>({ type: 'jewellery' });
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([null, null, null, null, null]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const data = new FormData();

    // Append all text/select fields
    Object.keys(formData).forEach(key => {
        const value = formData[key as keyof Product];
        if (value !== undefined && value !== null) {
            data.append(key, String(value));
        }
    });

    // Append files
    imageFiles.forEach(file => { if (file) data.append('images', file); });
    if (videoFile) data.append('video', videoFile);
    
    // Append hardcoded admin details (replace with form inputs if needed)
    data.append('adminPackagingWeight', '0.5');
    data.append('adminPackagingDimension[length]', '10');
    data.append('adminPackagingDimension[breadth]', '10');
    data.append('adminPackagingDimension[height]', '5');

    onSave(data);
    // onClose();
  };

  return (
    <Dialog open={isOpen} 
       onOpenChange={(open) => {
      if (!open) {
          // Reset state when closing the dialog
          setIsSubmitting(false);
          onClose();
      }
  }}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader><DialogTitle>Add New Product</DialogTitle><DialogDescription>Select type and fill details.</DialogDescription></DialogHeader>
        <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setFormData({ type: v }); }} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="jewellery">Jewellery</TabsTrigger>
            <TabsTrigger value="bag">Bag</TabsTrigger>
            <TabsTrigger value="gift">Gift</TabsTrigger>
          </TabsList>
          <form onSubmit={handleSubmit}>
            <div className="py-4 max-h-[70vh] overflow-y-auto pr-4">
              {/* Core Fields for all types */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="col-span-2"><Label htmlFor="name">Name</Label><Input id="name" onChange={handleChange} required /></div>
                  <div className="col-span-1"><Label>Original Price</Label><Input id="originalPrice" type="number" step="0.01" onChange={handleChange} required /></div>
                  <div className="col-span-1"><Label>Selling Price</Label><Input id="price" type="number" step="0.01" onChange={handleChange} required /></div>
                  <div className="col-span-1"><Label>Stock</Label><Input id="stock" type="number" onChange={handleChange} required /></div>
                  <div className="col-span-1"><Label>Material</Label><Input id="material" onChange={handleChange} /></div>
                  <div className="col-span-2"><Label>Description</Label><Textarea id="description" onChange={handleChange} required /></div>
                  <div className="col-span-2"><Label>Tags (comma-separated)</Label><Input id="tags" onChange={handleChange} placeholder="festive, wedding, casual" /></div>
              </div>
              
              <TabsContent value="jewellery">
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="col-span-1"><Label>Gender</Label><Select onValueChange={(v) => handleSelectChange('gender', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Female">Female</SelectItem><SelectItem value="Male">Male</SelectItem><SelectItem value="Unisex">Unisex</SelectItem></SelectContent></Select></div>
                    <div className="col-span-1"><Label>Category</Label><Select onValueChange={(v) => handleSelectChange('jewelleryCategory', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Rings">Rings</SelectItem><SelectItem value="Earrings">Earrings</SelectItem><SelectItem value="Necklaces">Necklaces</SelectItem><SelectItem value="Bracelet">Bracelet</SelectItem><SelectItem value="Chain">Chain</SelectItem></SelectContent></Select></div>
                    <div className="col-span-1"><Label>Material Type</Label><Select onValueChange={(v) => handleSelectChange('materialType', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="artificial">Artificial</SelectItem><SelectItem value="gold">Gold</SelectItem><SelectItem value="silver">Silver</SelectItem><SelectItem value="platinum">Platinum</SelectItem><SelectItem value="pearl">Pearls</SelectItem></SelectContent></Select></div>
                    <div className="col-span-1"><Label>Stones (comma-separated)</Label><Input id="stones" onChange={handleChange} /></div>
                </div>
              </TabsContent>
              <TabsContent value="bag">
                <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="col-span-1"><Label>Size (comma-separated)</Label><Input id="size" onChange={handleChange} placeholder="sm, medium, lg" /></div>
                </div>
              </TabsContent>
              <TabsContent value="gift" />
              
              {/* File Uploads */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4 mt-4">
                  {[...Array(5)].map((_, i) => (
                      <div key={i}><Label htmlFor={`image-${i}`}>Image {i + 1}</Label><Input id={`image-${i}`} type="file" accept="image/*" onChange={(e) => handleFileChange(i, e.target.files?.[0] || null)} /></div>
                  ))}
                  <div className="col-span-2"><Label htmlFor="video">Video</Label><Input id="video" type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} /></div>
              </div>
            </div>
            <DialogFooter className="pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Product"
              )}
            </Button>

            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}