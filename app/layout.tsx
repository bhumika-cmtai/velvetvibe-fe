import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Playfair_Display } from "next/font/google"
import "./globals.css"

import { CartProvider } from "@/context/CartContext"
import { ThemeProvider } from "@/components/ThemeProvider"
import { WishlistProvider } from "@/context/WishlistContext"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

export const metadata: Metadata = {
  title: "Luv Kush - Premium Jewelry Collection",
  description:
    "Discover exquisite jewelry collections for men and women. Premium quality, elegant designs.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} antialiased`}
    >
      <body>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider >
            {children}
            </WishlistProvider>
            {/* <Toaster /> */}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
