"use client";

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { User, Heart, ShoppingCart, ChevronDown, Menu, Loader2, Search } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from './ui/dropdown-menu';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/useDebounce';
import { useOnClickOutside } from '@/hooks/useOnClickOutside';

// --- CONTEXT IMPORTS (For Guest Users) ---
import { useCart as useLocalCart } from '@/context/CartContext';
import { useWishlist as useLocalWishlist } from '@/context/WishlistContext';

// --- REDUX IMPORTS (For Logged-in Users) ---
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/lib/redux/store';
import { selectIsAuthenticated, selectCurrentUser, logout } from '@/lib/redux/slices/authSlice';
import { fetchSearchResults, clearSearchResults } from '@/lib/redux/slices/productSlice';
import { fetchCart } from '@/lib/redux/slices/cartSlice';
import { fetchWishlist, selectTotalWishlistItems } from '@/lib/redux/slices/wishlistSlice';
import { fetchCategories } from '@/lib/redux/slices/adminSlice';

// --- Static Data ---
const navLinks = [
    { name: "New Arrivals", href: "/shop/new-arrivals" },
    { name: "Best Sellers", href: "/shop/best-sellers" },
    { name: "Sale", href: "/shop/sale" },
    { name: "Clothing", href: "/shop" },
    { name: "Decorative Items", href: "/decoratives" },
];

const megaMenuData = {
    westernWear: {
        title: "Western Wear",
        items: [
            { name: "Dresses", href: "/shop?sub_category=Dresses" },
            { name: "Tops & T-Shirts", href: "/shop?sub_category=Tops%20%26%20T-shirts" },
            { name: "Co-ords", href: "/shop?sub_category=Co-ords" },
        ],
    },
    indianWear: {
        title: "Indian Wear",
        items: [
            { name: "Kurtas & Suits", href: "/shop?sub_category=Kurta,Suit" },
            { name: "Sarees", href: "/shop?sub_category=Saree" },
        ],
    },
    decoratives: {
        title: "Decoratives",
        items: [
            { name: "Flower Pots & Vases", href: "/decoratives?sub_category=Flower%20Pots,Vases" },
            { name: "Wall Paintings", href: "/decoratives?sub_category=Wall Paintings" },
        ],
    },
};

const Navbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);

    // --- Redux State for Authenticated User ---
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const currentUser = useSelector(selectCurrentUser);
    const { searchResults, searchLoading } = useSelector((state: RootState) => state.product);
    const dbTotalCartItems = useSelector((state: RootState) => state.cart.totalItems);
    const dbTotalWishlistItems = useSelector(selectTotalWishlistItems);

    // --- Context State for Guest User ---
    const { totalItems: localTotalCartItems } = useLocalCart();
    const { totalItems: localTotalWishlistItems } = useLocalWishlist();

    // --- Local Component State ---
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
    const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);

    const { categories } = useSelector((state: RootState) => state.admin);

    // Check if user is admin
    const isAdmin = currentUser?.role === 'admin';

    // For non-admin users, show cart/wishlist counts
    const totalItems = isAuthenticated && !isAdmin ? dbTotalCartItems : localTotalCartItems;
    const totalWishlistItems = isAuthenticated && !isAdmin ? dbTotalWishlistItems : localTotalWishlistItems;

    const debouncedSearchQuery = useDebounce(searchQuery, 300);
    useOnClickOutside(searchRef, () => setIsDropdownOpen(false));

    const dynamicCategories = useMemo(() => {
        const hardcodedNames = ["Clothing", "Decorative Items"];
        return categories.filter(cat => !hardcodedNames.includes(cat.name));
    }, [categories]);

    useEffect(() => {
        dispatch(fetchCategories());
        if (isAuthenticated && !isAdmin) {
            // Only fetch cart and wishlist for non-admin authenticated users
            console.log("Navbar: User is authenticated (non-admin). Fetching global data...");
            dispatch(fetchCart());
            dispatch(fetchWishlist());
        }
    }, [isAuthenticated, isAdmin, dispatch]);

    // Effect for handling scroll behavior with throttling to prevent glitches
    useEffect(() => {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollTop = window.scrollY;
                    const shouldBeScrolled = scrollTop > 20; // Increased threshold for stability
                    
                    setIsScrolled(prev => {
                        // Only update if the state actually needs to change
                        if (prev !== shouldBeScrolled) {
                            return shouldBeScrolled;
                        }
                        return prev;
                    });
                    ticking = false;
                });
                ticking = true;
            }
        };

        // Add passive listener for better performance
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Effect for handling debounced search
    useEffect(() => {
        if (debouncedSearchQuery.length > 2) {
            dispatch(fetchSearchResults({ search: debouncedSearchQuery, limit: 5 }));
            setIsDropdownOpen(true);
        } else {
            dispatch(clearSearchResults());
            setIsDropdownOpen(false);
        }
    }, [debouncedSearchQuery, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("You have been logged out.");
        // Redirect admin to home page after logout
        if (isAdmin) {
            router.push('/');
        }
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsDropdownOpen(false);
        router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    };
    
    const UserNav = () => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700 hover:text-black" aria-label="Account">
                    <User size={24} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
                {isAuthenticated && currentUser ? (
                    <>
                        <DropdownMenuLabel>
                            {isAdmin ? "Admin Account" : "My Account"}
                            <p className="text-xs font-normal text-gray-500">{currentUser.email}</p>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {isAdmin ? (
                            // Admin menu items
                            <DropdownMenuItem asChild>
                                <Link href="/account/admin">Admin Dashboard</Link>
                            </DropdownMenuItem>
                        ) : (
                            // Regular user menu items
                            <>
                                <DropdownMenuItem asChild>
                                    <Link href="/account/user">My Profile</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/account/user/order-history">My Orders</Link>
                                </DropdownMenuItem>
                            </>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                            Sign Out
                        </DropdownMenuItem>
                    </>
                ) : (
                    <>
                        <DropdownMenuLabel>Welcome!</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild><Link href="/login">Login</Link></DropdownMenuItem>
                        <DropdownMenuItem asChild><Link href="/signup">Sign Up</Link></DropdownMenuItem>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );

    const megaMenuVariants: Variants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white'}`}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center py-4">
                    <Link href="/" className="text-3xl font-serif font-bold text-gray-800">
                        <Image src="/LOGO-JPG1.png" width={112} height={50} alt='logo' className='w-28' />
                    </Link>

                    <div ref={searchRef} className="relative flex-1 max-w-xl mx-8 hidden lg:block">
                        <form onSubmit={handleSearchSubmit}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => { if (searchQuery.length > 2) setIsDropdownOpen(true); }}
                                    placeholder="Search for products..." 
                                    className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black" 
                                />
                                <Button type="submit" className="absolute right-1 top-1 h-8 px-6 bg-black text-white rounded hover:bg-gray-800">Search</Button>
                            </div>
                        </form>
                        
                        <AnimatePresence>
                            {isDropdownOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full mt-2 w-full bg-white border rounded-md shadow-lg z-50 overflow-hidden"
                                >
                                    {searchLoading && (
                                        <div className="flex items-center justify-center p-4 text-gray-500"><Loader2 className="h-5 w-5 animate-spin mr-2" /> Searching...</div>
                                    )}
                                    {!searchLoading && searchResults.length > 0 && (
                                        <ul>
                                            {searchResults.map((product: any) => (
                                                <li key={product._id}>
                                                    <Link 
                                                        href={`/product/${product.slug}`} 
                                                        onClick={() => setIsDropdownOpen(false)} 
                                                        className="flex items-center p-3 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <Image src={product.images[0]} alt={product.name} width={40} height={40} className="object-cover rounded-md" />
                                                        <div className='ml-3'>
                                                            <p className="font-semibold text-sm">{product.name}</p>
                                                            <p className="text-sm font-bold">₹{(product.sale_price ?? product.price).toLocaleString()}</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                            <li className="border-t">
                                                <Link href={`/shop?search=${encodeURIComponent(searchQuery.trim())}`} onClick={() => setIsDropdownOpen(false)} className="block w-full text-center p-3 font-semibold text-sm text-black hover:bg-gray-100">View all results</Link>
                                            </li>
                                        </ul>
                                    )}
                                    {!searchLoading && searchResults.length === 0 && debouncedSearchQuery.length > 2 && (
                                        <div className="p-4 text-center text-gray-500 text-sm">No products found for "{debouncedSearchQuery}".</div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-5">
                        <UserNav />
                        
                        {/* Only show wishlist and cart for non-admin users */}
                        {!isAdmin && (
                            <>
                                <div className="relative">
                                    <Link href="/wishlist" className="text-gray-700 hover:text-black" aria-label="Wishlist">
                                        <Heart size={24} />
                                    </Link>
                                    <AnimatePresence>
                                        {totalWishlistItems > 0 && (
                                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
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
                                            <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                                                {totalItems}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </>
                        )}
                        
                        <div className="lg:hidden">
                            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                                <SheetTrigger asChild><Button variant="ghost" size="icon"><Menu size={26} /></Button></SheetTrigger>
                                <SheetContent side="right" className="w-full max-w-sm px-6">
                                    <SheetTitle className="text-2xl font-serif mb-8">Menu</SheetTitle>
                                    <div className="flex flex-col space-y-2">
                                        {!isAdmin && (
                                            <>
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
                                            </>
                                        )}
                                        {isAdmin && (
                                            <Link href="/account/admin" className="text-lg text-gray-700 hover:text-black py-2" onClick={() => setIsMobileMenuOpen(false)}>
                                                Admin Dashboard
                                            </Link>
                                        )}
                                        {/* <div className="sm:hidden mt-4">
                                            <UserNav />
                                        </div> */}
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>

                {/* Only show bottom navigation for non-admin users */}
                {!isAdmin && (
                    <div className={`hidden lg:flex justify-between items-center text-sm font-medium border-t border-gray-200 transition-all duration-500 ease-in-out ${isScrolled ? 'h-0 py-0 opacity-0 pointer-events-none' : 'h-12 py-3 opacity-100'}`}>
                        <div className="flex items-center space-x-8">
                            <div onMouseEnter={() => setIsMegaMenuOpen(true)} onMouseLeave={() => setIsMegaMenuOpen(false)}>
                                <button className="bg-black text-white px-5 py-2 hover:bg-gray-800 transition-colors flex items-center gap-1">SHOP BY CATEGORY <ChevronDown /></button>
                                <AnimatePresence>
                                    {isMegaMenuOpen && !isScrolled && (
                                        <motion.div variants={megaMenuVariants} initial="hidden" animate="visible" exit="exit" className="absolute top-full left-0 mt-[-1px] w-full bg-white shadow-lg border-t z-50">
                                            <div className="container mx-auto px-8 py-6 grid grid-cols-5 gap-8">
                                                {Object.values(megaMenuData).map(section => (
                                                    <div key={section.title}>
                                                        <h3 className="font-semibold text-gray-800 mb-4">{section.title}</h3>
                                                        <ul className="space-y-2">
                                                            {section.items.map(item => <li key={item.name}><Link key={item.name} href={item.href} className="text-gray-600 hover:text-black">{item.name}</Link></li>)}
                                                        </ul>
                                                    </div>
                                                ))}
                                                {dynamicCategories.length > 0 && (
                                                    <div>
                                                        <h3 className="font-semibold text-gray-800 mb-4">More Categories</h3>
                                                        <ul className="space-y-2">
                                                            {dynamicCategories.map(cat => (
                                                                <li key={cat._id}>
                                                                    <Link 
                                                                        href={`/shop?category=${encodeURIComponent(cat.name)}`} 
                                                                        className="text-gray-600 hover:text-black"
                                                                    >
                                                                        {cat.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                                <div className="bg-gray-50 rounded-lg p-6 flex flex-col justify-center bg-[url('https://i.pinimg.com/736x/4b/b9/0b/4bb90b8d41a2c50ddebf86425e5c8072.jpg')] bg-cover bg-center">
                                                    <h3 className="font-semibold text-lg text-white">The Wedding Edit</h3>
                                                    <p className="text-sm text-white mt-1">Stunning outfits for the wedding season.</p>
                                                    <Link href="/shop?tags=Wedding" className="text-sm font-bold text-black mt-3 hover:underline">Shop Now &rarr;</Link>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                            {navLinks.map(link => (<Link key={link.name} href={link.href} className="text-gray-600 hover:text-black">{link.name}</Link>))}
                        </div>
                        <div><span className="text-gray-600">Free Shipping on Orders Over ₹499</span></div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;