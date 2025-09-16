"use client";

import React, { useState, useEffect } from 'react';
import { User, Heart, ShoppingCart, ChevronDown, Menu } from 'lucide-react';
import Link from 'next/link';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import Image from 'next/image';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { selectIsAuthenticated, selectCurrentUser, logout } from '@/lib/redux/slices/authSlice';
import { DropdownMenu, DropdownMenuTrigger,DropdownMenuContent,DropdownMenuLabel,DropdownMenuSeparator,DropdownMenuItem } from './ui/dropdown-menu';
import { toast } from 'sonner';

// --- UPDATED DATA AS PER YOUR REQUEST ---

const navLinks = [
    { name: "New Arrivals", href: "/shop/new-arrivals" },
    { name: "Best Sellers", href: "/shop/best-sellers" },
    { name: "Sale", href: "/shop/sale" },
    { name: "Clothing", href: "/shop" }, // Renamed "Shop" to "Clothing"
    { name: "Decorative Items", href: "/decoratives" }, // Added new nav item
  ];

  const megaMenuData = {
    westernWear: {
        title: "Western Wear",
        items: [
            // Example: ?category=Dresses ko ?sub_category=Dresses se badla gaya
            { name: "Dresses", href: "/shop?sub_category=Dresses" },
            { name: "Tops & T-Shirts", href: "/shop?sub_category=Tops%20%26%20T-shirts" }, // Backend se match karein
            { name: "Co-ords", href: "/shop?sub_category=Co-ords" },
            { name: "Jumpsuits", href: "/shop?sub_category=Jumpsuits" },
            { name: "Jeans & Trousers", href: "/shop?sub_category=Jeans%20%26%20Trousers" },
            { name: "Skirts & Shorts", href: "/shop?sub_category=Skirts" }, // Aap combine kar sakte hain
            { name: "Outerwear & Jackets", href: "/shop?sub_category=Outerwear" },
            { name: "Activewear", href: "/shop?sub_category=Activewear" },
        ],
    },
    indianWear: {
        title: "Indian Wear",
        items: [
            { name: "Kurtas & Suits", href: "/shop?sub_category=Kurta,Suit" }, // Multiple values
            { name: "Kurtis, Tunics & Tops", href: "/shop?sub_category=Kurti,Tunic" },
            { name: "Sarees", href: "/shop?sub_category=Saree" },
            { name: "Lehenga Cholis", href: "/shop?sub_category=Lehenga Choli" },
            { name: "Ethnic Wear Sets", href: "/shop?tags=Ethnic" }, // Yeh tag se filter karega
            { name: "Leggings, Salwars & Plazzos", href: "/shop?sub_category=Leggings,Salwars,Plazzos" },
        ],
    },
    decoratives: {
        title: "Decoratives",
        items: [
            { name: "Flower Pots & Vases", href: "/decorative?sub_category=Vases" }, // Yeh /decorative page par jaayega
            { name: "Wall Paintings", href: "/decorative?sub_category=Wall Paintings" },
            { name: "Figurines & Sculptures", href: "/decorative?sub_category=Sculptures" },
            { name: "Lamps & Lighting", href: "/decorative?sub_category=Lamps%20%26%20Lighting" },
            { name: "Rugs & Carpets", href: "/decorative?sub_category=Rugs%20%26%20Carpets" },
        ],
    },
};



const Navbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);


   

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

    const { totalItems: totalWishlistItems } = useWishlist();
    const { totalItems } = useCart();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 10) setIsScrolled(true);
            else setIsScrolled(false);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const megaMenuVariants: Variants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    const handleLogout = () => {
        dispatch(logout());
        // Optional: You can add a toast notification here
        toast.success("You have been logged out.");
    };


    const UserNav = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-black " aria-label="Account">
                <User size={24} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                {isAuthenticated && currentUser ? (
                    <>
                        <DropdownMenuLabel>
                            My Account
                            <p className="text-xs font-normal text-gray-500">{currentUser.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/account/profile">My Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/account/orders">My Orders</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                            Sign Out
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuLabel>Welcome!</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/login">Login</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/signup">Sign Up</Link>
                        </DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );


    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[var(--base-10)] shadow-md' : 'bg-[var(--base-10)] shadow-none'}`}
        >
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Top part of Navbar */}
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="text-3xl md:text-4xl font-serif font-bold text-gray-800">
                    <Image
                        src="/LOGO-JPG1.png"
                        width={200}
                        height={200}
                        alt='logo'
                        className='w-28'
                    />
                        </Link>

                    <div className="flex-1 max-w-xl mx-8 hidden lg:flex">
                        <div className="flex w-full border border-gray-300 rounded-md"><input type="text" placeholder="Search for kurtas, dresses, sarees..." className="w-full p-2 focus:outline-none rounded-l-md" /><button className="bg-black text-white px-8 py-2 rounded-r-md hover:bg-gray-800 transition-colors">SEARCH</button></div>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-5">
                        {/* <a href="/account/user" className="text-gray-700 hover:text-black hidden sm:block" aria-label="Account"><User size={24} />
                        </a> */}
                        <div className="hidden sm:block">
                            <UserNav />
                        </div>
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
                <div className={`hidden lg:flex justify-between items-center text-sm font-medium  border-t border-gray-300 transition-all duration-300 overflow-hidden ${isScrolled ? 'h-0 py-0 opacity-0 border-transparent' : 'h-auto py-3 opacity-100'}`}>
                    <div className="flex items-center space-x-8 bg-[var(--base-50)]">
                        {/* Mega Menu Button */}
                        <div onMouseEnter={() => setIsMegaMenuOpen(true)} onMouseLeave={() => setIsMegaMenuOpen(false)}>
                            <button className="bg-black text-white px-5 py-2 hover:bg-gray-800 transition-colors">
                                <span className='flex items-center gap-1'>SHOP BY CATEGORY <ChevronDown /></span>
                            </button>
                            <AnimatePresence>
                                {isMegaMenuOpen && (
                                    <motion.div variants={megaMenuVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 mt-[-1px] w-full bg-white shadow-lg border-t z-50">
                                        <div className="container mx-auto px-8 py-6 grid grid-cols-4 gap-8 bg-[var(--base-10)]">
                                            {Object.values(megaMenuData).map(section => (
                                                <div key={section.title}>
                                                    <h3 className="font-semibold text-gray-800 mb-4">{section.title}</h3>
                                                    <ul className="space-y-2">
                                                        {section.items.map(item => <li key={item.name}><a href={item.href} className="text-gray-600 hover:text-black">{item.name}</a></li>)}
                                                    </ul>
                                                </div>
                                            ))}
                                            <div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center bg-[url('https://i.pinimg.com/736x/4b/b9/0b/4bb90b8d41a2c50ddebf86425e5c8072.jpg')] bg-cover bg-center">
                                                <h3 className="font-semibold text-lg text-white">The Wedding Edit</h3>
                                                <p className="text-sm text-white mt-1">Stunning outfits for the wedding season.</p>
                                                <a href="/shop?tag=Wedding" className="text-sm font-bold text-black mt-3 hover:underline">Shop Now &rarr;</a>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        {navLinks.map(link => (<a key={link.name} href={link.href} className="text-gray-600 hover:text-black">{link.name}</a>))}
                    </div>
                    <div><span className="text-gray-600">Free Shipping on Orders Over ₹499</span></div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;