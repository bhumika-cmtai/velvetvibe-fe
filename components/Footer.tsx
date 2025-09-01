"use client"

import Link from "next/link"
import { Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"
import { useTheme } from "@/components/ThemeProvider"
// import  InstagramIcon  from "@/components/InstagramIcon" // Your custom icon
import InstagramIcon from "./InstagramIcon"
import  AmazonIcon  from "@/components/AmazonIcon"     // Your custom icon

export function Footer() {
  const { theme } = useTheme();

  // Define theme-based classes for a consistent look
  const isDarkTheme = theme === 'men';
  const bgColor = isDarkTheme ? 'bg-[#1C1C1C]' : 'bg-gray-50';
  const textColor = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const headingColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const linkHoverColor = isDarkTheme ? 'hover:text-[#D09D13]' : 'hover:text-gray-900';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200';

  return (
    <footer className={`${bgColor} border-t ${borderColor} mt-20`}>
      <div className="container mx-auto px-4 py-16">
        {/* --- THIS IS THE LINE THAT WAS CHANGED --- */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-serif font-bold" style={{ color: "var(--theme-primary)" }}>
              Luv Kush
            </h3>
            <p className={textColor}>
              Premium jewelry collection for men and women. Crafted with love and attention to detail.
            </p>
            {/* --- UPDATED SOCIAL LINKS --- */}
            <div className="flex space-x-6 items-center">
              <a 
                href="https://www.instagram.com/gullnaaz925?igsh=NDk5ZzdqYWJ2b3Jx" // Replace with your Instagram URL
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Instagram"
                className={`${textColor} ${linkHoverColor} transition-colors`}
              >
                <InstagramIcon  />
              </a>
              <a 
                href="https://www.amazon.in/stores/Gullnaaz/page/A2F2D9A7-DC20-44FE-BDDF-06709004F467?is_byline_deeplink=true&deeplink=A2F2D9A7-DC20-44FE-BDDF-06709004F467&redirect_store_id=A2F2D9A7-DC20-44FE-BDDF-06709004F467&lp_asin=B0FBK948XZ&ref_=ast_bln" // Replace with your Amazon URL
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Amazon"
                className={`${textColor} ${linkHoverColor} transition-colors`}
              >
                <AmazonIcon  />
              </a>
            </div>
          </motion.div>

          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className={`font-semibold ${headingColor}`}>Categories</h4>
            <div className="space-y-2">
              <Link href="/collections?category=earrings" className={`block ${textColor} ${linkHoverColor}`}>
                Earrings
              </Link>
              <Link href="/collections?category=bangles" className={`block ${textColor} ${linkHoverColor}`}>
                Bangles
              </Link>
              <Link href="/collections/women/silver-jewellery" className={`block ${textColor} ${linkHoverColor}`}>
                Silver Jewellery
              </Link>
              <Link href="/collections/women/artificial-jewellery" className={`block ${textColor} ${linkHoverColor}`}>
                Artificial Jewellery
              </Link>
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className={`font-semibold ${headingColor}`}>Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className={`block ${textColor} ${linkHoverColor}`}>
                Women
              </Link>
              <Link href="/pages/men" className={`block ${textColor} ${linkHoverColor}`}>
                Men
              </Link>
              <Link href="/cart" className={`block ${textColor} ${linkHoverColor}`}>
                Cart
              </Link>
              <Link href="#contact" className={`block ${textColor} ${linkHoverColor}`}>
                Contact
              </Link>
            </div>
          </motion.div>

          {/* Newsletter */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className={`font-semibold ${headingColor}`}>Sign up for updates</h4>
            <p className={`${textColor} text-sm`}>Get the latest news about our collections and exclusive offers.</p>
            <div className="flex space-x-2">
              <Input placeholder="Enter your email" className="rounded-xl" />
              <Button size="icon" className="rounded-xl" style={{ backgroundColor: "var(--theme-primary)" }}>
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </motion.div> */}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className={`border-t ${borderColor} pt-8 mt-12 text-center ${textColor}`}
        >
          <p>&copy; {new Date().getFullYear()} Luv Kush. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}