"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useTheme } from "@/components/ThemeProvider"
import InstagramIcon from "./InstagramIcon" // Your custom icon
import AmazonIcon from "@/components/AmazonIcon" // Your custom icon

export function Footer() {
  const { theme } = useTheme();

  // Define theme-based classes for a consistent look
  const isDarkTheme = theme === 'men';
  const bgColor = isDarkTheme ? 'bg-[#1C1C1C]' : 'bg-gray-50';
  const textColor = isDarkTheme ? 'text-gray-300' : 'text-gray-600';
  const headingColor = isDarkTheme ? 'text-white' : 'text-gray-900';
  const linkHoverColor = isDarkTheme ? 'hover:text-[#A77C38]' : 'hover:text-[#A77C38]';
  const borderColor = isDarkTheme ? 'border-gray-700' : 'border-gray-200';

  return (
    <footer className={`${bgColor} border-t ${borderColor} mt-20`}>
      <div className="container mx-auto px-4 py-16">
        {/* --- THIS IS THE LINE THAT WAS CHANGED --- */}
        <div className="grid md:grid-cols-4 gap-8">
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
            <div className="flex space-x-6 items-center">
              <a
                href="https://www.instagram.com/gullnaaz925?igsh=NDk5ZzdqYWJ2b3Jx" // Replace with your Instagram URL
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className={`${textColor} ${linkHoverColor} transition-colors`}
              >
                <InstagramIcon />
              </a>
              <a
                href="https://www.amazon.in/stores/Gullnaaz/page/A2F2D9A7-DC20-44FE-BDDF-06709004F467?is_byline_deeplink=true&deeplink=A2F2D9A7-DC20-44FE-BDDF-06709004F467&redirect_store_id=A2F2D9A7-DC20-44FE-BDDF-06709004F467&lp_asin=B0FBK948XZ&ref_=ast_bln" // Replace with your Amazon URL
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Amazon"
                className={`${textColor} ${linkHoverColor} transition-colors`}
              >
                <AmazonIcon />
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

          {/* --- NEW COLUMN ADDED HERE --- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className={`font-semibold ${headingColor}`}>Our Policies</h4>
            <div className="space-y-2">
              <Link href="/privacy-policy" className={`block ${textColor} ${linkHoverColor}`}>
                Privacy Policy
              </Link>
              <Link href="/refund-policy" className={`block ${textColor} ${linkHoverColor}`}>
                Refund Policy
              </Link>
              <Link href="/return-policy" className={`block ${textColor} ${linkHoverColor}`}>
                Return Policy
              </Link>
              <Link href="/shipping-policy" className={`block ${textColor} ${linkHoverColor}`}>
                Shipping Policy
              </Link>
              <Link href="/terms-and-conditions" className={`block ${textColor} ${linkHoverColor}`}>
                Terms & Conditions
              </Link>
            </div>
          </motion.div>

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