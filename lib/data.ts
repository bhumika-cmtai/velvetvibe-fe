// src/lib/data.ts
import { Product } from '@/lib/types/product';

export const products: Product[] = [
  // --- Tops & T-Shirts ---
  {
    _id: 'women-top-01',
    name: 'Women\'s Raglan Sleeve T-Shirt',
    slug: 'womens-raglan-sleeve-t-shirt',
    description: 'A soft and versatile t-shirt with stylish raglan sleeves.',
    price: 28.00,
    base_price: 36.00,
    images: ['https://afends.com/cdn/shop/files/W234001-MRL_1740.png?v=1750389636&width=1080', 'https://afends.com/cdn/shop/files/W234001-MRL_1747.png?v=1750389636&width=1080'],
    category: 'Clothing',
    sub_category: 'T-Shirts',
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
    name: 'Casual Mesh Panel Top',
    slug: 'casual-mesh-panel-top',
    description: 'A trendy white top with unique mesh panel details on the sleeves.',
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
  {
    _id: 'women-tshirt-01',
    name: 'V-Neck Basic Cotton T-Shirt',
    slug: 'v-neck-basic-cotton-t-shirt',
    description: 'An essential v-neck t-shirt made from pure, soft cotton. A versatile piece for any wardrobe.',
    price: 25.00,
    base_price: 30.00,
    images: ['https://i.pinimg.com/736x/5d/97/ed/5d97ededa83fb5e2c730ef07b1953eca.jpg', 'https://i.pinimg.com/1200x/95/b3/ee/95b3eecbbff8cf004eb519f6dd5cc73f.jpg'],
    category: 'Clothing',
    sub_category: 'T-Shirts',
    brand: 'Chic Wear',
    gender: 'Women',
    stock_quantity: 150,
    tags: ['Sale'],
  },
  
  // --- Sweaters ---
  {
    _id: 'women-sweater-01',
    name: 'Oversized Knit Cardigan',
    slug: 'oversized-knit-cardigan',
    description: 'A cozy and stylish oversized cardigan with a chunky knit texture. Perfect for layering.',
    price: 70.00,
    base_price: 90.00,
    images: ['https://i.pinimg.com/1200x/c4/c2/87/c4c287b6789a00ce1770873ab53f7de4.jpg', 'https://i.pinimg.com/1200x/bc/ea/a7/bceaa777018b239a7e3e09b631e73e34.jpg'],
    category: 'Clothing',
    sub_category: 'Sweaters',
    brand: 'Bella Grace',
    gender: 'Women',
    stock_quantity: 55,
    tags: ['Sale', 'Hot Sale'],
  },

  // --- Dresses ---
  {
    _id: 'women-dress-01',
    name: 'Floral Summer Midi Dress',
    slug: 'floral-summer-midi-dress',
    description: 'A light and airy midi dress with a beautiful floral pattern, perfect for sunny days.',
    price: 55.00,
    images: ['https://i.pinimg.com/1200x/1a/c5/fd/1ac5fd8e19241ef9b2594dfbf4a55ccf.jpg', 'https://i.pinimg.com/736x/df/7d/52/df7d524073f862164c9bc75ab6acf3ca.jpg'],
    category: 'Clothing',
    sub_category: 'Dresses',
    brand: 'Bella Grace',
    gender: 'Women',
    stock_quantity: 60,
    tags: ['New'],
  },
  {
    _id: 'women-dress-02',
    name: 'Classic Black Evening Dress',
    slug: 'classic-black-evening-dress',
    description: 'An elegant and timeless black dress, perfect for any formal occasion.',
    price: 95.00,
    base_price: 120.00,
    images: ['https://i.pinimg.com/736x/11/77/8b/11778b85fe0b0bc4ad66e01f39aaa7d8.jpg', 'https://i.pinimg.com/736x/f9/dd/09/f9dd0953cfd337978d222274731eccef.jpg'],
    category: 'Clothing',
    sub_category: 'Dresses',
    brand: 'Atelier Luxe',
    gender: 'Women',
    stock_quantity: 30,
    tags: ['Sale'],
  },

  // --- Jeans ---
  {
    _id: 'women-jeans-01',
    name: 'High-Waist Skinny Jeans',
    slug: 'high-waist-skinny-jeans',
    description: 'Flattering high-waist skinny jeans with a comfortable stretch, designed for a perfect fit.',
    price: 80.00,
    images: ['https://i.pinimg.com/1200x/50/21/b9/5021b9c39e824e1935f8b4bf24b3c315.jpg', 'https://i.pinimg.com/736x/0c/2f/21/0c2f211260f580169e275aeb614dac3a.jpg'],
    category: 'Clothing',
    sub_category: 'Jeans',
    brand: 'Denim Co.',
    gender: 'Women',
    stock_quantity: 120,
    tags: ['Best Seller', 'Hot Sale'],
  },

  // --- Swimwear ---
  {
    _id: 'women-swim-01',
    name: 'One-Piece Halter Swimsuit',
    slug: 'one-piece-halter-swimsuit',
    description: 'A stylish and flattering one-piece halter swimsuit with a vibrant tropical print.',
    price: 45.00,
    base_price: 60.00,
    images: ['https://i.pinimg.com/1200x/9e/9e/68/9e9e68a5f2d75c5f90cc36364aac980e.jpg', 'https://i.pinimg.com/1200x/9e/9e/68/9e9e68a5f2d75c5f90cc36364aac980e.jpg'],
    category: 'Clothing',
    sub_category: 'Swimwear',
    brand: 'Summer Ease',
    gender: 'Women',
    stock_quantity: 70,
    tags: ['Sale', 'New'],
  },

  // --- Outerwear ---
  {
    _id: 'women-outerwear-01',
    name: 'Classic Beige Trench Coat',
    slug: 'womens-classic-trench-coat',
    description: 'A timeless and elegant trench coat for women, perfect for layering.',
    price: 190.00,
    images: ['https://i.pinimg.com/736x/49/e8/6a/49e86a99eff894882f506ec4c5b1ac4c.jpg', 'https://i.pinimg.com/736x/74/31/3e/74313eaa71486839c2541450547c6470.jpg'],
    category: 'Clothing',
    sub_category: 'Outerwear',
    brand: 'Atelier Luxe',
    gender: 'Women',
    stock_quantity: 35,
    tags: ['New', 'Hot Sale'],
  },
  
  // --- Ethnic Wear ---
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
  },

  //decor items
  {
    _id: 'decor-item-01',
    name: 'Minimalist Ceramic Vase',
    slug: 'minimalist-ceramic-vase',
    description: 'A beautifully simple and elegant ceramic vase, perfect for modern home decor. Its clean lines and matte finish complement any space.',
    price: 45.00,
    base_price: 60.00,
    images: ['https://i.pinimg.com/1200x/66/2c/42/662c427c00e1c721bcc75992805cf59d.jpg', 'https://i.etsystatic.com/11738683/r/il/796706/6753473629/il_1588xN.6753473629_dwpk.jpg'],
    category: 'Decor',
    sub_category: 'Vases',
    brand: 'Artisan Home',
    gender: 'Unisex',
    stock_quantity: 80,
    tags: ['New', 'Best Seller'],
  },
  {
    _id: 'decor-item-02',
    name: 'Abstract Canvas Wall Art',
    slug: 'abstract-canvas-wall-art',
    description: 'Vibrant and expressive abstract painting on high-quality canvas. Adds a pop of color and sophistication to any room.',
    price: 120.00,
    images: ['https://i.pinimg.com/736x/0a/40/14/0a40146f6d4467ac4baf39b78d7b3b48.jpg', 'https://i.pinimg.com/1200x/86/e5/69/86e569f58ff459d7141f7c063e566534.jpg'],
    category: 'Decor',
    sub_category: 'Wall Art',
    brand: 'Modern Canvas',
    gender: 'Unisex',
    stock_quantity: 40,
    tags: ['Hot Sale'],
  },
  {
    _id: 'decor-item-03',
    name: 'Modern Nordic Table Lamp',
    slug: 'modern-nordic-table-lamp',
    description: 'Sleek and functional, this Nordic-style table lamp features a minimalist design with a metal base and a soft-glow bulb.',
    price: 75.00,
    base_price: 90.00,
    images: ['https://i.pinimg.com/1200x/1a/6b/71/1a6b718dbca7fb3c8d2887b09c7bde78.jpg', 'https://i.pinimg.com/736x/93/af/05/93af0566e1b285392083d499dec299cc.jpg'],
    category: 'Decor',
    sub_category: 'Lamps',
    brand: 'Lumina',
    gender: 'Unisex',
    stock_quantity: 65,
    tags: ['Sale'],
  },
  {
    _id: 'decor-item-04',
    name: 'Golden Geometric Figurine',
    slug: 'golden-geometric-figurine',
    description: 'An eye-catching golden figurine with sharp geometric angles. This decorative piece adds a touch of modern luxury to shelves or tables.',
    price: 35.00,
    images: ['https://i.pinimg.com/736x/5a/2a/3a/5a2a3a1f3c3d52d4a6f8a8fa3624f1b8.jpg', 'https://i.pinimg.com/736x/3d/3d/3d/3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d3d.jpg'],
    category: 'Decor',
    sub_category: 'Sculptures',
    brand: 'Artisan Home',
    gender: 'Unisex',
    stock_quantity: 110,
    tags: ['New'],
  },
  {
    _id: 'decor-item-05',
    name: 'Ornate Gold Wall Mirror',
    slug: 'ornate-gold-wall-mirror',
    description: 'A stunning wall mirror featuring an intricately designed ornate gold frame. Perfect as a statement piece for an entryway or living room.',
    price: 150.00,
    base_price: 180.00,
    images: ['https://i.pinimg.com/1200x/3f/f2/19/3ff219a0e6f2e1c32d160a9a73b3d723.jpg', 'https://i.pinimg.com/736x/c8/67/44/c86744cb3ac2979245105e556866f9dd.jpg'],
    category: 'Decor',
    sub_category: 'Mirrors',
    brand: 'Reflections Co.',
    gender: 'Unisex',
    stock_quantity: 25,
    tags: ['Sale', 'Hot Sale'],
  }
];

// --- MOCK CART ITEMS (Women's Products Only) ---
export const mockCartItems = [
  {
    _id: "cart_item_2",
    product: {
      _id: "women-top-02",
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
      _id: "women-dress-01",
      name: "Floral Summer Midi Dress",
      slug: "floral-summer-midi-dress",
      images: ['https://i.pinimg.com/1200x/1a/c5/fd/1ac5fd8e19241ef9b2594dfbf4a55ccf.jpg'],
      price: 5500,
      stock: 15
    },
    quantity: 1,
    price: 5500,
    color: "Floral",
    size: "M"
  }
];

export const mockSubTotal = mockCartItems.reduce((acc, item) => acc + item.price, 0);

// --- MOCK WISHLIST ITEMS (Women's Products Only) ---
export interface WishlistItem {
  _id: string;
  name: string;
  slug: string;
  images: string[];
  price: number;
  base_price?: number;
  stock_quantity: number; // Corrected from stock to stock_quantity
}

export const mockWishlistItems: WishlistItem[] = [
  {
      _id: "women-top-01",
      name: "Women's Raglan Sleeve T-Shirt",
      slug: "womens-raglan-sleeve-t-shirt",
      images: ['https://afends.com/cdn/shop/files/W234001-MRL_1740.png?v=1750389636&width=1080'],
      price: 2800,
      base_price: 3600,
      stock_quantity: 10
  },
  {
      _id: "women-dress-02",
      name: "Classic Black Evening Dress",
      slug: "classic-black-evening-dress",
      images: ['https://i.pinimg.com/736x/11/77/8b/11778b85fe0b0bc4ad66e01f39aaa7d8.jpg'],
      price: 9500,
      stock_quantity: 5
  },
  {
      _id: "ethnic-wear-01",
      name: "Embroidered Silk Saree",
      slug: "embroidered-silk-saree",
      images: ['https://i.pinimg.com/1200x/ee/90/2f/ee902f3f3958e1ad2bb8f6d4e61505bd.jpg'],
      price: 15000,
      base_price: 20000,
      stock_quantity: 0, // Out of stock example
  }
];