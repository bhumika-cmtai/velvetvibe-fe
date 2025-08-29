"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Heart, Minus, Plus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ProductCard } from "@/components/ProductCard"
import { useCart } from "@/context/CartContext"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// --- REDUX IMPORTS ---
import { useDispatch, useSelector } from "react-redux"
import { fetchProductBySlug } from "@/lib/redux/slices/productSlice"
import { RootState } from "@/lib/redux/store"

export default function WomenProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const dispatch = useDispatch<any>()
  const { selectedProduct: product, productDetailsLoading, productDetailsError } = useSelector(
    (state: RootState) => state.product
  )

  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const { addToCart } = useCart()
  const { toast } = useToast()

  // Fetch product by slug
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug))
    }
  }, [slug, dispatch])

  if (productDetailsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading product details...</p>
      </div>
    )
  }

  if (productDetailsError || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <p className="text-gray-600">{productDetailsError || "The product you're looking for doesn't exist."}</p>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart.`,
    })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  // Recommended products: same category, exclude current product
  const recommendedProducts = useSelector((state: RootState) =>
    state.product.items
      .filter((p) => p.category === product.category && p.id !== product.id && p.gender === "women")
      .slice(0, 4)
  )

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="relative aspect-square overflow-hidden rounded-2xl">
              <Image
                src={product.images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex space-x-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === selectedImageIndex ? "border-orange-500" : "border-gray-200"
                    }`}
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2" style={{ color: "var(--theme-primary)" }}>
                {product.name}
              </h1>
              <div className="flex items-center space-x-2 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <span className="text-sm text-gray-600">(24 reviews)</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold" style={{ color: "var(--theme-primary)" }}>
                ₹{product.priceDiscounted.toLocaleString()}
              </span>
              {product.priceOriginal > product.priceDiscounted && (
                <span className="text-xl text-gray-500 line-through">₹{product.priceOriginal.toLocaleString()}</span>
              )}
              {product.priceOriginal > product.priceDiscounted && (
                <span
                  className="px-2 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  {Math.round(((product.priceOriginal - product.priceDiscounted) / product.priceOriginal) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-10 w-10">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-10 w-10">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 py-3 rounded-xl font-medium"
                style={{ backgroundColor: "var(--theme-primary)", color: "white" }}
              >
                Add to Cart
              </Button>
              <Button
                variant="outline"
                onClick={handleWishlist}
                className="px-6 py-3 rounded-xl bg-transparent"
                style={{ borderColor: "var(--theme-primary)" }}
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            {/* Product Details Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="details">
                <AccordionTrigger>Product Details</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Material:</span>
                      <span>{product.material}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Color:</span>
                      <span>{product.color}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Metal:</span>
                      <span>{product.metal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Stones:</span>
                      <span>{product.stones}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Size:</span>
                      <span>{product.size}</span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-2xl font-serif font-bold mb-8 text-center" style={{ color: "var(--theme-primary)" }}>
              You Might Also Like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {recommendedProducts.map((p, index) => (
                <ProductCard key={p.id} product={p} index={index} />
              ))}
            </div>
          </motion.section>
        )}
      </main>

      <Footer />
    </div>
  )
}
