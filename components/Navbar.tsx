"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation" 
import { Search, User, Heart, ShoppingBag, Menu, X, Gem, Star, Shield, Circle, VenetianMask, Shell, Link2, GitBranch, Diamond, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { useTheme } from "@/components/ThemeProvider"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "@/lib/redux/slices/authSlice"
import type { RootState } from "@/lib/redux/store"

const navLinks = [
  { name: "Silver Jewellery", href: "/collections/women/silver-jewellery" },
  { name: "Artificial Jewellery", href: "/collections/women/artificial-jewellery" },
  { name: "Collections", href: "/collections/women" },
  { name: "Bags", href: "/collections/women/bags" },
  { name: "Gifts", href: "/collections/women/gifts" },
  { name: "Women", href: "/" },
  { name: "Men", href: "/pages/men" },
]

const categoryItems = [
  { name: "Rings", icon: <Circle size={20} /> },
  { name: "Necklace", icon: <GitBranch size={20} /> },
  { name: "Earring", icon: <VenetianMask size={20} /> },
  { name: "Bracelet", icon: <Shield size={20} /> },
  { name: "Pearls", icon: <Shell size={20} /> },
  { name: "Platinum", icon: <Star size={20} /> },
  { name: "Chain", icon: <Link2 size={20} /> },
];

const accountMenuItems = [
  { name: "My Account", href: "/account/user/profile" },
  { name: "My Orders", href: "/account/user/order-history" },
  { name: "Settings", href: "/account/user/settings" },
  { name: "Sign Out", href: "#" }, 
];

const guestMenuItems = [
  { name: "Login", href: "/login" },
  { name: "Sign Up", href: "/signup" },
];

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isCategoryOpen, setIsCategoryOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();

  const { totalItems: totalCartItems } = useCart()
  const { totalItems: totalWishlistItems } = useWishlist()
  const { theme } = useTheme()

  const isWomenActive = pathname === "/" || pathname.startsWith("/collections/women")
  const isMenActive = pathname.startsWith("/pages/men") || pathname.startsWith("/collections/men")

  const logoSrc = theme === "men" ? "/GULLNAAZ-LOGO-PNG.png" : "/GULLNAAZ-BLACK-LOGO-PNG.png";
  const iconButtonHoverClass = theme === "men" ? "hover:bg-transparent focus-visible:bg-transparent hover:opacity-80" : "";
  
  const handleLogout = () => {
    dispatch(logout());
    setIsAccountOpen(false);
    setIsMobileMenuOpen(false); // Close mobile menu on logout
    router.push('/'); 
  };

  return (
    <motion.header
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full backdrop-blur-lg"
      style={{
        backgroundColor: `${theme === "women" ? "#FFFDF6" : theme === "men" ? "#1C1C1C" : "rgba(249, 250, 251, 0.85)"}`,
        borderColor: "var(--theme-border)",
        ...(theme === "men" && { '--theme-text': 'white' })
      } as React.CSSProperties}
    >
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Image
                src={logoSrc}
                alt="Gullnaaz Logo"
                width={160}
                height={45}
                priority
                className="w-28 h-auto rounded-sm"
              />
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center space-x-10">
            {navLinks.slice(0, 5).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium transition-colors text-[var(--theme-text)] hover:text-[#D09D13]"
              >
                {item.name}
              </Link>
            ))}

            <motion.div
              onHoverStart={() => setIsCategoryOpen(true)}
              onHoverEnd={() => setIsCategoryOpen(false)}
              className="relative"
            >
              <Button variant="ghost" className="text-base font-medium transition-colors text-[var(--theme-text)] hover:text-[#D09D13] p-0">
                Categories
              </Button>
              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-white rounded-md shadow-lg p-4 z-50"
                  >
                    <ul className="space-y-1">
                      {categoryItems.map((item) => (
                        <li key={item.name}>
                          <Link href="#" className="flex items-center p-3 text-gray-800 hover:bg-[#FFFDF6] rounded-md transition-colors duration-200">
                            <span className="mr-4" style={{ color: "var(--theme-primary)" }}>{item.icon}</span>
                            <span className="font-medium">{item.name}</span>
                            <ChevronRight size={16} className="ml-auto text-gray-400" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {navLinks.slice(5).map((item) => {
              const isActive = (item.name === "Women" && isWomenActive) || (item.name === "Men" && isMenActive);
              const activeColor = (item.name === "Women" && theme === "women") || (item.name === "Men" && theme === "men");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative text-base font-medium transition-colors ${isActive ? "font-semibold" : ""}`}
                  style={{ color: isActive && activeColor ? "#D09D13" : "var(--theme-text)" }}
                >
                  {item.name}
                  {isActive && activeColor && (
                    <motion.div
                      layoutId={`activeNav-${item.name}`}
                      className="absolute -bottom-2 left-0 right-0 h-0.5"
                      style={{ backgroundColor: "#D09D13" }}
                    />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center space-x-5">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)} className={`hidden md:flex ${iconButtonHoverClass}`}>
              <Search className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
            </Button>
            
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className={`hidden md:flex relative ${iconButtonHoverClass}`}>
                <Heart className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
                {totalWishlistItems > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-medium flex items-center justify-center text-black" style={{ backgroundColor: "#D09D13" }}>
                    {totalWishlistItems}
                  </motion.span>
                )}
              </Button>
            </Link>
            
            <Link href="/cart">
              <Button variant="ghost" size="icon" className={`relative ${iconButtonHoverClass}`}>
                <ShoppingBag className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
                {totalCartItems > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-medium flex items-center justify-center text-black" style={{ backgroundColor: "#D09D13" }}>
                    {totalCartItems}
                  </motion.span>
                )}
              </Button>
            </Link>

            <motion.div
              onHoverStart={() => setIsAccountOpen(true)}
              onHoverEnd={() => setIsAccountOpen(false)}
              className="relative"
            >
              <Button variant="ghost" size="icon" className={`hidden md:flex ${iconButtonHoverClass}`}>
                <User className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
              </Button>
              <AnimatePresence>
                {isAccountOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md shadow-lg p-2 z-50"
                  >
                    <ul className="space-y-1">
                      {(isAuthenticated ? accountMenuItems : guestMenuItems).map((item) => (
                        <li key={item.name}>
                          {item.name === "Sign Out" ? (
                            <button
                              onClick={handleLogout}
                              className="flex w-full items-center p-3 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200 text-left"
                            >
                              {item.name}
                            </button>
                          ) : (
                            <Link href={item.href} className="flex w-full items-center p-3 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200">
                              {item.name}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-full flex-col p-8 sm:w-96 [&_button:focus-visible]:ring-0">
                <div>
                  <SheetTitle className="text-2xl font-serif font-bold" style={{ color: "var(--theme-primary)" }}>
                    Gullnaaz
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Mobile navigation menu
                  </SheetDescription>
                </div>
                <div className="mt-8 flex-1 overflow-y-auto pr-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <div className="flex flex-col space-y-6">
                    {navLinks.map((item) => (
                      <Link key={item.name} href={item.href} className="text-xl font-medium py-2 transition-colors hover:text-[#D09D13]" onClick={() => setIsMobileMenuOpen(false)}>
                        {item.name}
                      </Link>
                    ))}
                    <div>
                      <h3 className="text-xl font-medium py-2 ">Categories</h3>
                      <ul className="pl-4">
                        {categoryItems.map((item) => (
                          <li key={item.name}>
                            <Link href="#" className="flex items-center py-2 text-gray-700 hover:text-[#D09D13] hover:bg-[#FFFDF6]" onClick={() => setIsMobileMenuOpen(false)}>
                              <span className="mr-3" style={{ color: "var(--theme-primary)"}}>{item.icon}</span>
                              <span>{item.name}</span>
                              <ChevronRight size={20} className="ml-auto text-gray-400" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {/* --- FIX START: Added conditional sign-out button for mobile --- */}
                    <div className="border-t pt-6">
                      {isAuthenticated ? (
                        <button
                          onClick={handleLogout}
                          className="w-full text-left text-xl font-medium py-2 transition-colors hover:text-red-500"
                        >
                          Sign Out
                        </button>
                      ) : (
                        <div className="space-y-4">
                           <Link href="/login" className="block text-xl font-medium py-2 transition-colors hover:text-[#D09D13]" onClick={() => setIsMobileMenuOpen(false)}>
                            Login
                          </Link>
                           <Link href="/signup" className="block text-xl font-medium py-2 transition-colors hover:text-[#D09D13]" onClick={() => setIsMobileMenuOpen(false)}>
                            Sign Up
                          </Link>
                        </div>
                      )}
                    </div>
                    {/* --- FIX END --- */}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="pb-5"
            >
              <Input
                placeholder="Search for beautiful jewelry..."
                className="w-full max-w-lg mx-auto h-12 text-base"
                autoFocus
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}