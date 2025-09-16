// // src/app/women/page.tsx
// "use client"
// import { useState, useMemo } from "react"
// import Image from "next/image"
// import Navbar  from "@/components/Navbar"
// import Footer  from "@/components/Footer"
// import ProductCard  from "@/components/ProductCard"
// import { products } from "@/lib/data" // Static data
// import { Product } from "@/lib/types/product"
// import { motion } from "framer-motion"
// import { Frown, SlidersHorizontal } from "lucide-react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// // --- Naya Women's Collection Header ---
// const CollectionHeader = () => (
//     <div className="bg-[#F8F5F1]"> {/* Soft, elegant background color */}
//         <div className="container mx-auto grid md:grid-cols-2 items-center">
//             {/* Left: Image */}
//             <div className="relative h-64 md:h-[400px] w-full order-last md:order-first">
//                 <Image 
//                     src="https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=1964"
//                     alt="Women's Fashion Banner"
//                     fill
//                     className="object-cover"
//                 />
//             </div>
//             {/* Right: Text Content */}
//             <div className="text-center md:text-left p-8 md:p-12">
//                 <p className="font-semibold tracking-widest text-sm uppercase text-gray-500">ELEGANCE REDEFINED</p>
//                 <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-800 mt-2">Women's Collection</h1>
//                 <p className="mt-4 max-w-md text-gray-600 mx-auto md:mx-0">
//                     Explore curated styles that blend modern trends with timeless grace.
//                 </p>
//             </div>
//         </div>
//     </div>
// );

// // --- Main Page Component ---
// export default function WomenPage() {
  
//   const [sortOption, setSortOption] = useState('featured');
//   const [subCategoryFilter, setSubCategoryFilter] = useState('all');

//   // Women's specific categories for filtering
//   const womensSubCategories = ['All', 'Tops', 'Dresses', 'Swimwear', 'Ethnic Wear', 'Jeans'];

//   const filteredAndSortedProducts = useMemo(() => {
//     // 1. Initial filter for Women's products
//     let filtered = products.filter(p => p.gender === 'Women' || p.gender === 'Unisex');

//     // 2. Filter by Sub-Category
//     if (subCategoryFilter !== 'all') {
//       filtered = filtered.filter(p => p.sub_category === subCategoryFilter);
//     }
    
//     // 3. Sort the results
//     switch (sortOption) {
//       case 'price-asc': filtered.sort((a, b) => a.price - b.price); break;
//       case 'price-desc': filtered.sort((a, b) => b.price - a.price); break;
//       case 'newest': filtered.sort((a, b) => b._id.localeCompare(a._id)); break;
//       default: break;
//     }
    
//     return filtered;
//   }, [sortOption, subCategoryFilter]);

//   return (
//     <div className="bg-white">
//       <Navbar />
//       <CollectionHeader />
      
//       <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         {/* --- Filter & Toolbar Section --- */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-4 border-b">
//           {/* Left Side: Category Filter */}
//           <div className="flex items-center gap-2 flex-wrap justify-center">
//               <span className="text-sm font-semibold mr-2">Category:</span>
//               <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
//                   {womensSubCategories.map(cat => (
//                       <button 
//                         key={cat} 
//                         onClick={() => setSubCategoryFilter(cat === 'All' ? 'all' : cat)} 
//                         className={`px-4 py-1.5 text-sm rounded-full transition-colors ${subCategoryFilter === (cat === 'All' ? 'all' : cat) ? 'bg-white shadow-sm text-black font-semibold' : 'text-gray-600'}`}>
//                           {cat}
//                       </button>
//                   ))}
//               </div>
//           </div>

//           {/* Right Side: Sorting */}
//           <div className="flex items-center gap-2">
//             <span className="text-sm font-semibold">Sort By:</span>
//             <Select value={sortOption} onValueChange={setSortOption}>
//               <SelectTrigger className="w-[160px] h-9 text-sm">
//                 <SelectValue placeholder="Sorting" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="featured">Featured</SelectItem>
//                 <SelectItem value="newest">Newest</SelectItem>
//                 <SelectItem value="price-asc">Price: Low to High</SelectItem>
//                 <SelectItem value="price-desc">Price: High to Low</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </div>

//         {/* --- Product Grid --- */}
//         {filteredAndSortedProducts.length > 0 ? (
//           <motion.div 
//             layout
//             className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
//           >
//             {filteredAndSortedProducts.map((product) => (
//               <ProductCard key={product._id} product={product} />
//             ))}
//           </motion.div>
//         ) : (
//           <div className="text-center py-20 border-2 border-dashed rounded-2xl">
//               <Frown className="mx-auto h-12 w-12 text-gray-400" />
//               <h3 className="mt-2 text-lg font-semibold">No Products Found</h3>
//               <p className="mt-1 text-sm text-gray-500">Try adjusting your filters to find what you're looking for.</p>
//           </div>
//         )}
//       </main>
      
//       <Footer />
//     </div>
//   )
// }

import React from 'react'

const page = () => {
  return (
    <div>
      women
    </div>
  )
}

export default page
