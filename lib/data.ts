// src/lib/data.ts
import { Product } from '@/lib/types/product';

export const products: Product[] = [
  // Men's Fashion
  {
    _id: 'men-shirt-01',
    name: 'Men\'s Casual Short Sleeve Shirt',
    slug: 'mens-casual-short-sleeve-shirt',
    description: 'A comfortable and stylish casual shirt for men, perfect for summer days. Made from a lightweight cotton blend, it features a classic button-down collar and a relaxed fit for all-day comfort.',
    price: 19.00,
    base_price: 27.00,
    images: [
      'https://i.pinimg.com/736x/34/3a/c8/343ac8d11dbad8e57bdeef4a16656337.jpg', // Main Pink
      'https://i.pinimg.com/736x/85/85/e1/8585e176f83aebfacb7db58ca9717526.jpg', // Main Blue
      'https://i.pinimg.com/736x/01/a0/03/01a0032a1b405520e58852e3f5397397.jpg'  // Main Green
    ],
    category: 'Clothing',
    sub_category: 'Shirts',
    brand: 'Urban Threads',
    gender: 'Men',
    stock_quantity: 0, // Main stock is 0 when variants exist
    tags: ['Sale', 'Hot Sale'],
    attributes: { material: "Cotton Blend", fit: "Relaxed" },
    variants: [
      { color: 'Pink', size: 'S', stock: 10, images: ['https://i.pinimg.com/736x/34/3a/c8/343ac8d11dbad8e57bdeef4a16656337.jpg'] },
      { color: 'Pink', size: 'M', stock: 15, images: ['https://i.pinimg.com/736x/34/3a/c8/343ac8d11dbad8e57bdeef4a16656337.jpg'] },
      { color: 'Pink', size: 'L', stock: 0, images: ['https://i.pinimg.com/736x/34/3a/c8/343ac8d11dbad8e57bdeef4a16656337.jpg'] },
      { color: 'Blue', size: 'M', stock: 5, images: ['https://i.pinimg.com/736x/85/85/e1/8585e176f83aebfacb7db58ca9717526.jpg'] },
      { color: 'Blue', size: 'L', stock: 8, images: ['https://i.pinimg.com/736x/85/85/e1/8585e176f83aebfacb7db58ca9717526.jpg'] },
      { color: 'Green', size: 'S', stock: 12, images: ['https://i.pinimg.com/736x/01/a0/03/01a0032a1b405520e58852e3f5397397.jpg'] },
      { color: 'Green', size: 'L', stock: 3, images: ['https://i.pinimg.com/736x/01/a0/03/01a0032a1b405520e58852e3f5397397.jpg'] },
    ]
  },
  {
    _id: 'men-shirt-02',
    name: 'Men\'s Striped Oxford Shirt',
    slug: 'mens-striped-oxford-shirt',
    description: 'Classic striped oxford shirt made from premium cotton.',
    price: 22.00,
    base_price: 30.00,
    images: ['https://i.pinimg.com/1200x/c0/35/c2/c035c2634612ab00326b95486857a730.jpg', 'https://i.pinimg.com/736x/13/60/37/136037d8ceaf7bcee08a2c50bec62c9a.jpg'],
    category: 'Clothing',
    sub_category: 'Shirts',
    brand: 'Gentlemen Co.',
    gender: 'Men',
    stock_quantity: 80,
    tags: ['Sale'],
  },
  {
    _id: 'men-shirt-03',
    name: 'Men\'s Linen Camp Collar Shirt',
    slug: 'mens-linen-camp-collar-shirt',
    description: 'Breathable linen shirt with a relaxed camp collar.',
    price: 25.00,
    base_price: 35.00,
    images: ['https://i.pinimg.com/1200x/8d/ed/bc/8dedbcc733e506d259690e69c6e329c8.jpg', 'https://i.pinimg.com/1200x/b3/e8/83/b3e883b35875bb9f5478057852acbf83.jpg'],
    category: 'Clothing',
    sub_category: 'Shirts',
    brand: 'Summer Ease',
    gender: 'Men',
    stock_quantity: 120,
    tags: ['Sale'],
  },
  // Women's Fashion
  {
    _id: 'women-top-01',
    name: 'Women\'s Raglan Sleeve T-Shirt',
    slug: 'womens-raglan-sleeve-t-shirt',
    description: 'A soft and versatile t-shirt with stylish raglan sleeves.',
    price: 28.00,
    base_price: 36.00,
    images: ['https://afends.com/cdn/shop/files/W234001-MRL_1740.png?v=1750389636&width=1080', 'https://afends.com/cdn/shop/files/W234001-MRL_1747.png?v=1750389636&width=1080'],
    category: 'Clothing',
    sub_category: 'Tops',
    brand: 'Chic Wear',
    gender: 'Women',
    stock_quantity: 200,
    tags: ['New'],
  },
  {
    _id: 'women-top-02',
    name: 'Elegant Kimono Sleeve Top',
    slug: 'elegant-kimono-sleeve-top',
    description: 'Flowy and elegant top with beautiful kimono sleeves.',
    price: 24.00,
    base_price: 32.00,
    images: ['https://i.pinimg.com/736x/bd/43/09/bd43096e2457346ceae6520b1bb5eaac.jpg', 'https://i.pinimg.com/736x/bd/43/09/bd43096e2457346ceae6520b1bb5eaac.jpg'],
    category: 'Clothing',
    sub_category: 'Tops',
    brand: 'Bella Grace',
    gender: 'Women',
    stock_quantity: 95,
    tags: ['Sale', 'Hot Sale'],
  },
  {
    _id: 'women-top-03',
    name: 'Casual Mesh Panel Shirt',
    slug: 'casual-mesh-panel-shirt',
    description: 'A trendy white shirt with unique mesh panel details on the sleeves.',
    price: 35.00,
    base_price: 45.00,
    images: ['https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=1887', 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?q=80&w=2070'],
    category: 'Clothing',
    sub_category: 'Tops',
    brand: 'Modern Muse',
    gender: 'Women',
    stock_quantity: 110,
    tags: ['New'],
  },
  //ethnic
  {
    _id: 'ethnic-wear-01',
    name: 'Embroidered Silk Saree',
    slug: 'embroidered-silk-saree',
    description: 'A beautifully crafted silk saree with intricate golden embroidery, perfect for weddings and festive occasions.',
    price: 150.00,
    base_price: 200.00,
    images: ['https://i.pinimg.com/1200x/ee/90/2f/ee902f3f3958e1ad2bb8f6d4e61505bd.jpg', 'https://i.pinimg.com/1200x/78/39/0d/78390dd2ce5ddd5d67376746c5832866.jpg'],
    category: 'Clothing',
    sub_category: 'Ethnic Wear',
    brand: 'Desi Weaves',
    gender: 'Women',
    stock_quantity: 20,
    tags: ['Sale', 'Ethnic'],
  },
  {
    _id: 'ethnic-wear-02',
    name: 'Classic Men\'s Kurta Set',
    slug: 'classic-mens-kurta-set',
    description: 'An elegant and comfortable cotton kurta set for men, ideal for traditional events.',
    price: 80.00,
    images: ['https://i.pinimg.com/1200x/1f/58/08/1f5808784b4bdf9986ce120f21b7caff.jpg', 'https://i.pinimg.com/1200x/ff/5f/ec/ff5feccf8e6aed72c6cda2e07858fd8c.jpg'],
    category: 'Clothing',
    sub_category: 'Ethnic Wear',
    brand: 'Rajwada Styles',
    gender: 'Men',
    stock_quantity: 40,
    tags: ['New', 'Ethnic'],
  },
  {
    _id: 'ethnic-wear-03',
    name: 'Royal Blue Anarkali Suit',
    slug: 'royal-blue-anarkali-suit',
    description: 'A stunning royal blue Anarkali suit with delicate lacework, perfect for making a grand entrance.',
    price: 120.00,
    base_price: 160.00,
    images: ['https://i.pinimg.com/1200x/1c/f4/2e/1cf42ee6a9f1e7ebadd10b91e707ef7a.jpg', 'https://i.pinimg.com/1200x/ee/88/98/ee88983d713f38ff89a7d54c211d0e41.jpg'],
    category: 'Clothing',
    sub_category: 'Ethnic Wear',
    brand: 'Desi Weaves',
    gender: 'Women',
    stock_quantity: 15,
    tags: ['Sale', 'Ethnic'],
  }
];

export const mockCartItems = [
  {
    _id: "cart_item_1",
    product: {
      _id: "product_1",
      name: "Men's Casual Short Sleeve Shirt",
      slug: "mens-casual-short-sleeve-shirt",
      images: ['https://i.pinimg.com/736x/34/3a/c8/343ac8d11dbad8e57bdeef4a16656337.jpg'],
      price: 1900, // Price in paise or lowest currency unit
      stock: 10
    },
    quantity: 2,
    price: 3800, // quantity * product.price
    color: "Pink",
    size: "M"
  },
  {
    _id: "cart_item_2",
    product: {
      _id: "product_2",
      name: "Elegant Kimono Sleeve Top",
      slug: "elegant-kimono-sleeve-top",
      images: ['https://i.pinimg.com/736x/bd/43/09/bd43096e2457346ceae6520b1bb5eaac.jpg'],
      price: 2400,
      stock: 5
    },
    quantity: 1,
    price: 2400,
    color: "White",
    size: "S"
  },
  {
    _id: "cart_item_3",
    product: {
      _id: "product_3",
      name: "Casual Mesh Panel Shirt",
      slug: "casual-mesh-panel-shirt",
      images: ['https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=1887'],
      price: 3500,
      stock: 15
    },
    quantity: 3,
    price: 10500,
    color: "Blue",
    size: "L"
  },
  
];

export const mockSubTotal = mockCartItems.reduce((acc, item) => acc + item.price, 0);

export interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  base_price?: number;
  stock: number;
}

export const mockWishlistItems: WishlistItem[] = [
  {
      _id: "product_1",
      name: "Men's Casual Short Sleeve Shirt",
      slug: "mens-casual-short-sleeve-shirt",
      images: ['https://i.pinimg.com/736x/34/3a/c8/343ac8d11dbad8e57bdeef4a16656337.jpg'],
      price: 1900,
      base_price: 2700,
      stock: 10
  },
  {
      _id: "product_2",
      name: "Elegant Kimono Sleeve Top",
      slug: "elegant-kimono-sleeve-top",
      images: ['https://i.pinimg.com/736x/bd/43/09/bd43096e2457346ceae6520b1bb5eaac.jpg'],
      price: 2400,
      stock: 5
  },
  {
      _id: "product_3",
      name: "Casual Mesh Panel Shirt",
      slug: "casual-mesh-panel-shirt",
      images: ['https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=1887'],
      price: 3500,
      base_price: 4500,
      stock: 0, // Out of stock example
  },
  {
      _id: "product_4",
      name: "Men's Striped Oxford Shirt",
      slug: "mens-striped-oxford-shirt",
      images: ['https://i.pinimg.com/1200x/c0/35/c2/c035c2634612ab00326b95486857a730.jpg'],
      price: 2200,
      stock: 8,
  }
];