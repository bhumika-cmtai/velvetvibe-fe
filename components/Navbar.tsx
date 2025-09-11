"use client"; // Client component directive for using hooks

import React, { useState, useEffect } from 'react';
import { User, Heart, ShoppingCart, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from 'framer-motion'; // <-- YAHAN VARIANTS IMPORT KAREIN
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext'; 

// --- Data for Navigation and Dropdowns ---

const navLinks = [
  { name: "New Arrivals", href: "/shop/new-arrivals" },
  { name: "Best Sellers", href: "/shop/best-sellers" },
  { name: "Sale", href: "/shop/sale" },
  { name: "Shop", href: "/shop" },
];

const megaMenuData = {
  women: {
    title: "For Women",
    items: [
      { name: "Dresses", href: "/shop?category=Dresses" },
      { name: "Tops & T-Shirts", href: "/shop?category=Tops" },
      { name: "Jeans & Trousers", href: "/shop?category=Jeans" },
      { name: "Skirts & Shorts", href: "/shop?category=Skirts" },
      { name: "Outerwear", href: "/shop?category=Outerwear" },
    ],
  },
  men: {
    title: "For Men",
    items: [
      { name: "Shirts", href: "/shop?category=Shirts" },
      { name: "T-Shirts & Polos", href: "/shop?category=T-Shirts" },
      { name: "Pants & Chinos", href: "/shop?category=Pants" },
      { name: "Jackets & Coats", href: "/shop?category=Jackets" },
      { name: "Shorts", href: "/shop?category=Shorts" },
    ],
  },
  accessories: {
    title: "Accessories",
    items: [
      { name: "Bags & Backpacks", href: "/shop?category=Bags" },
      { name: "Hats & Scarves", href: "/shop?category=Hats" },
      { name: "Belts", href: "/shop?category=Belts" },
      { name: "Jewellery", href: "/shop?category=Jewellery" },
    ],
  },
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  
  
  const { totalItems: totalWishlistItems } = useWishlist(); // Get wishlist count
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) setIsScrolled(true);
      else setIsScrolled(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // --- THE FIX IS HERE: Explicitly assign the Variants type ---
  const megaMenuVariants: Variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-[var(--background-main)] shadow-none'}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top part of Navbar */}
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="text-3xl md:text-4xl font-serif font-bold text-gray-800">Florawear</Link>
          
          <div className="flex-1 max-w-xl mx-8 hidden lg:flex">
            <div className="flex w-full border border-gray-200 rounded-md"><input type="text" placeholder="What are you looking for today?" className="w-full p-2 focus:outline-none rounded-l-md"/><button className="bg-black text-white px-8 py-2 rounded-r-md hover:bg-gray-800 transition-colors">SEARCH</button></div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-5">
            <a href="/account" className="text-gray-700 hover:text-black hidden sm:block" aria-label="Account"><User size={24} /></a>
            <div className="relative">
              <Link href="/wishlist" className="text-gray-700 hover:text-black" aria-label="Wishlist">
                <Heart size={24} />
              </Link>
              <AnimatePresence>
                {totalWishlistItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalWishlistItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="relative">
              <Link href="/cart" className="text-gray-700 hover:text-black" aria-label="Shopping Cart">
                <ShoppingCart size={24} />
              </Link>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0, y: -10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 20 }}
                    className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            {/* Hamburger Menu */}
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu size={26} /><span className="sr-only">Open menu</span></Button></SheetTrigger>
                <SheetContent side="right" className="w-full max-w-sm px-6">
                  <SheetTitle className="text-2xl font-serif mb-8">Menu</SheetTitle>
                  <div className="flex flex-col space-y-2">
                     <button onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)} className="bg-black text-white px-5 py-3 text-left text-base font-semibold rounded-md hover:bg-gray-800 transition-colors">
                        <span className='flex justify-between items-center'>SHOP BY CATEGORY <ChevronDown className={`transition-transform ${isMobileCategoryOpen ? 'rotate-180' : ''}`} /></span>
                    </button>
                    {isMobileCategoryOpen && (
                      <div className="pl-4 border-l-2 ml-4">
                        {Object.values(megaMenuData).map(section => (
                           <div key={section.title} className="py-2">
                             <h4 className="font-semibold text-gray-800 mb-2">{section.title}</h4>
                             {section.items.map(item => <Link key={item.name} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="block py-1.5 text-gray-600 hover:text-black">{item.name}</Link>)}
                           </div>
                        ))}
                      </div>
                    )}
                    {navLinks.map((link) => (<Link key={link.name} href={link.href} className="text-lg text-gray-700 hover:text-black py-2" onClick={() => setIsMobileMenuOpen(false)}>{link.name}</Link>))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* Bottom part of Navbar - Hidden on mobile */}
        <div className={`hidden lg:flex justify-between items-center text-sm font-medium border-t border-gray-200 transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 py-0 opacity-0 border-transparent' : 'h-auto py-3 opacity-100'}`}>
            <div className="flex items-center space-x-8">
                {/* Mega Menu Button */}
                <div onMouseEnter={() => setIsMegaMenuOpen(true)} onMouseLeave={() => setIsMegaMenuOpen(false)}>
                  <button className="bg-black text-white px-5 py-2 hover:bg-gray-800 transition-colors">
                      <span className='flex items-center gap-1'>SHOP BY CATEGORY <ChevronDown /></span>
                  </button>
                  <AnimatePresence>
                    {isMegaMenuOpen && (
                      <motion.div variants={megaMenuVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 mt-[-1px] w-full bg-white shadow-lg border-t z-50">
                        <div className="container mx-auto px-8 py-6 grid grid-cols-4 gap-8">
                          {Object.values(megaMenuData).map(section => (
                            <div key={section.title}>
                              <h3 className="font-semibold text-gray-800 mb-4">{section.title}</h3>
                              <ul className="space-y-2">
                                {section.items.map(item => <li key={item.name}><a href={item.href} className="text-gray-600 hover:text-black">{item.name}</a></li>)}
                              </ul>
                            </div>
                          ))}
                          <div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center">
                              <h3 className="font-semibold text-lg">Mid-Season Sale</h3>
                              <p className="text-sm text-gray-600 mt-1">Up to 40% off. Don't miss out!</p>
                              <a href="/shop/sale" className="text-sm font-bold text-black mt-3">Shop Now &rarr;</a>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                {navLinks.map(link => (<a key={link.name} href={link.href} className="text-gray-600 hover:text-black">{link.name}</a>))}
            </div>
            <div><span className="text-gray-600">Hotline: +01 1234 567890</span></div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;