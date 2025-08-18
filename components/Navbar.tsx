"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User, Heart, ShoppingBag, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/CartContext"
import { useWishlist } from "@/context/WishlistContext"
import { useTheme } from "@/components/ThemeProvider"
import { motion, AnimatePresence } from "framer-motion"
 
const menuItems = [
  { name: "Silver Jewellery", href: "/collections/women/silver-jewelery" },
  { name: "Artificial Jewellery", href: "/collections/women/artificial-jewelery" },
  { name: "Collections", href: "/collections/women" },
]

export function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems: totalCartItems } = useCart()
  const { totalItems: totalWishlistItems } = useWishlist()
  const { theme } = useTheme()

  const isWomenActive = pathname === "/" || pathname.startsWith("/collections/women")
  const isMenActive = pathname.startsWith("/pages/men") || pathname.startsWith("/collections/men")

  return (
    <motion.header
      initial={{ y: -120 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 w-full border-b backdrop-blur-lg"
      style={{
        backgroundColor: `${theme === "women" ? "rgba(255, 255, 255, 0.85)" : theme === "men" ? "rgba(255, 255, 255, 0.9)" : "rgba(249, 250, 251, 0.85)"}`,
        borderColor: "var(--theme-border)",
      }}
    >
      {/* Top Row */}
      <div className="container mx-auto px-6">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-3xl font-serif font-bold"
              style={{ color: "var(--theme-primary)" }}
            >
              Luv Kush
            </motion.div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center space-x-10">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-base font-medium transition-colors text-[var(--theme-text)] hover:text-[var(--theme-primary)]"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-5">
            {/* Search */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="hidden md:flex"
            >
              <Search className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
            </Button>

            {/* Account */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
            </Button>

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon" className="hidden md:flex relative">
                <Heart className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
                {totalWishlistItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-medium flex items-center justify-center text-white"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  >
                    {totalWishlistItems}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
                {totalCartItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 h-5 w-5 rounded-full text-xs font-medium flex items-center justify-center text-white"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  >
                    {totalCartItems}
                  </motion.span>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" style={{ color: "var(--theme-text)" }} />
                </Button>
              </SheetTrigger>
              {/* --- FIX START: Added className to remove focus ring --- */}
              <SheetContent
                side="right"
                className="w-full sm:w-96 p-8 [&_button:focus-visible]:ring-0"
              >
              {/* --- FIX END --- */}
                <div>
                   <h2 className="text-2xl font-serif font-bold" style={{ color: "var(--theme-primary)" }}>Luv Kush</h2>
                </div>
                <div className="flex flex-col space-y-6 mt-12">
                  {menuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="text-xl font-medium py-2 transition-colors hover:text-[var(--theme-primary)]"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Search Bar */}
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

      {/* Bottom Row - Category Tabs */}
      <div className="border-t" style={{ borderColor: "var(--theme-border)" }}>
        <div className="container mx-auto px-6">
          <div className="flex h-14 items-center justify-center space-x-12">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`relative px-4 py-2 text-base font-medium transition-colors ${
                  isWomenActive ? "font-semibold" : ""
                }`}
                style={{
                  color: isWomenActive && theme === "women" ? "var(--theme-primary)" : "var(--theme-text)",
                }}
              >
                Women
                {isWomenActive && theme === "women" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  />
                )}
              </motion.div>
            </Link>
            <Link href="/pages/men">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className={`relative px-4 py-2 text-base font-medium transition-colors ${
                  isMenActive ? "font-semibold" : ""
                }`}
                style={{
                  color: isMenActive && theme === "men" ? "var(--theme-primary)" : "var(--theme-text)",
                }}
              >
                Men
                {isMenActive && theme === "men" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: "var(--theme-primary)" }}
                  />
                )}
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  )
}