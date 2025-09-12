// src/types/product.ts

export interface Variant {
  color: string;
  size: string;
  stock: number;
  images?: string[];
}

export interface Product {
  _id: string; // Mock data ke liye unique ID
  name: string;
  slug: string;
  description: string;
  price: number;
  base_price?: number; // Original price
  images: string[];
  category: 'Clothing' | 'Decor' | 'Accessories' | 'Shoes';
  sub_category?: string;
  brand: string;
  gender?: 'Men' | 'Women' | 'Unisex';
  stock_quantity?: number; // Products without variants ke liye
  tags?: ('New' | 'Sale' | 'Hot Sale' | 'Ethnic' | 'Best Seller' | 'Decor')[];
  attributes?: Record<string, any>;
  variants?: Variant[];
}