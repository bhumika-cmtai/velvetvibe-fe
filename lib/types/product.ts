// src/types/product.ts (Updated for Simpler Price Model)
export interface Variant {
  size: string;
  color: string;
  price: number; // MRP for this variant
  sale_price?: number; // Optional selling price for this variant
  stock_quantity: number; 
  sku_variant: string;
  images?: string[];
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  
  price: number;
  sale_price?: number;

  stock_quantity?: number;
  
  variants?: Variant[];

  images: string[];
  video?: string;
  category: 'Clothing' | 'Decorative' | string;
  sub_category: string;
  brand: string;
  gender?: 'Men' | 'Women' | 'Unisex';
  tags?: string[];
  
  fit?: string;
  careInstructions?: string;
  sleeveLength?: string;
  neckType?: string;
  pattern?: string;
  
  createdAt: string;
  updatedAt: string;
}