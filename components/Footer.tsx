"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="container mx-auto px-4 py-16">
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
            <p className="text-gray-600">
              Premium jewelry collection for men and women. Crafted with love and attention to detail.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
              </Button>
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
            <h4 className="font-semibold text-gray-900">Categories</h4>
            <div className="space-y-2">
              <Link href="/collections/women?category=earrings" className="block text-gray-600 hover:text-gray-900">
                Earrings
              </Link>
              <Link href="/collections/women?category=bangles" className="block text-gray-600 hover:text-gray-900">
                Bangles
              </Link>
              <Link href="/collections/women?category=silver" className="block text-gray-600 hover:text-gray-900">
                Silver Jewellery
              </Link>
              <Link href="/collections/women?category=artificial" className="block text-gray-600 hover:text-gray-900">
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
            <h4 className="font-semibold text-gray-900">Quick Links</h4>
            <div className="space-y-2">
              <Link href="/" className="block text-gray-600 hover:text-gray-900">
                Women
              </Link>
              <Link href="/pages/men" className="block text-gray-600 hover:text-gray-900">
                Men
              </Link>
              <Link href="/cart" className="block text-gray-600 hover:text-gray-900">
                Cart
              </Link>
              <Link href="#contact" className="block text-gray-600 hover:text-gray-900">
                Contact
              </Link>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="font-semibold text-gray-900">Sign up for updates</h4>
            <p className="text-gray-600 text-sm">Get the latest news about our collections and exclusive offers.</p>
            <div className="flex space-x-2">
              <Input placeholder="Enter your email" className="rounded-xl" />
              <Button size="icon" className="rounded-xl" style={{ backgroundColor: "var(--theme-primary)" }}>
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t pt-8 mt-12 text-center text-gray-600"
        >
          <p>&copy; 2024 Luv Kush. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}
