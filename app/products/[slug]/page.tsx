"use client"
import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Heart, Minus, Plus, ShieldCheck, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/Navbar"
import Footer from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { RecommendedProducts } from "@/components/RecommendProducts"

// STATIC DATA IMPORT (Redux ke badle)
import { products } from "@/lib/data"
import { Product } from "@/lib/types/product" // Product type import karein

const ProductDetailsPage = () => {
  const params = useParams()
  const slug = params.slug as string
  const { toast } = useToast()

  // Redux ke badle, hum static data se product find karenge
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const foundProduct = products.find(p => p.slug === slug);
    setProduct(foundProduct || null);
    setLoading(false);
  }, [slug]);

  // State for user selections
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)

  // Initialize selected color and size on product load
  useEffect(() => {
    if (product?.variants && product.variants.length > 0) {
      setSelectedColor(product.variants[0].color);
      setSelectedSize(product.variants[0].size);
    }
  }, [product]);

  // --- Derived State using useMemo for efficiency ---
  const { availableColors, availableSizes, selectedVariant } = useMemo(() => {
    if (!product?.variants) return { availableColors: [], availableSizes: [], selectedVariant: null };

    const colors = [...new Set(product.variants.map(v => v.color))];
    const sizesForSelectedColor = product.variants
      .filter(v => v.color === selectedColor)
      .map(v => ({ size: v.size, stock: v.stock }));
    
    const variant = product.variants.find(v => v.color === selectedColor && v.size === selectedSize) || null;
    
    return {
      availableColors: colors,
      availableSizes: sizesForSelectedColor,
      selectedVariant: variant
    };
  }, [product, selectedColor, selectedSize]);

  // --- Handlers ---
  const handleAddToCart = () => {
    if (!selectedVariant || selectedVariant.stock < 1) {
      toast({ title: "Unavailable", description: "Please select an available size and color.", variant: "destructive" });
      return;
    }
    toast({ title: "Added to Bag", description: `${quantity} x ${product?.name} (${selectedColor}, ${selectedSize})` });
  };
  const handleWishlist = () => setIsWishlisted(!isWishlisted);
  const incrementQuantity = () => setQuantity(q => Math.min(q + 1, selectedVariant?.stock || 1));
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  if (loading) return <div>Loading...</div>
  if (!product) return <div>Product not found!</div>

  const discount = product.base_price && product.price < product.base_price ? Math.round(((product.base_price - product.price) / product.base_price) * 100) : 0;

  return (
    <div className="bg-white">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* --- LEFT: MEDIA GALLERY --- */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col-reverse md:flex-row overflow-hidden  gap-4">
            <div className="flex md:flex-col gap-3  md:overflow-y-auto pb-2 md:pb-0 md:pr-2 overflow-hidden">
              {product.images.map((img, idx) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImage === idx ? 'border-[var(--theme-accent)]' : 'border-transparent'}`}>
                  <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100">
              <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" />
            </div>
          </motion.div>

          {/* --- RIGHT: PRODUCT DETAILS & ACTIONS --- */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p className="font-semibold text-[var(--accent-primary)]">{product.brand}</p>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-800 my-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
              {discount > 0 && <span className="text-xl text-gray-400 line-through">₹{product.base_price?.toFixed(2)}</span>}
              {discount > 0 && <span className="bg-red-100 text-red-600 text-sm font-semibold px-2.5 py-1 rounded-full">{discount}% OFF</span>}
            </div>

            {/* Color Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Color: <span className="font-bold">{selectedColor}</span></h3>
              <div className="flex gap-2">
                {availableColors.map(color => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-black scale-110' : 'border-gray-200'}`} style={{ backgroundColor: color.toLowerCase() }} />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Size: <span className="font-bold">{selectedSize}</span></h3>
              <div className="flex flex-wrap gap-2">
                {availableSizes.map(({ size, stock }) => (
                  <button key={size} onClick={() => setSelectedSize(size)} disabled={stock < 1} className={`px-4 py-2 border rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-full font-semibold">
                <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-11 w-11 rounded-full"><Minus size={16} /></Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-11 w-11 rounded-full"><Plus size={16} /></Button>
              </div>
              <Button onClick={handleAddToCart} className="flex-1 h-12 rounded-full text-base font-bold bg-[var(--accent-primary)] text-white hover:bg-opacity-90">Add to Bag</Button>
              <Button variant="outline" size="icon" onClick={handleWishlist} className="h-12 w-12 rounded-full flex-shrink-0"><Heart className={`transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} /></Button>
            </div>
            
            {/* Stock Message */}
            {selectedVariant && (
                selectedVariant.stock > 0 && selectedVariant.stock <= 5 
                ? <p className="text-sm text-center text-red-600 mb-6">Hurry! Only {selectedVariant.stock} left in stock.</p>
                : selectedVariant.stock < 1 
                ? <p className="text-sm text-center text-gray-500 mb-6">This size is currently out of stock.</p>
                : null
            )}

            {/* Accordion for Details */}
            <Accordion type="single" collapsible defaultValue="description" className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent className="text-gray-600 prose">{product.description}</AccordionContent>
              </AccordionItem>
              <AccordionItem value="details">
                <AccordionTrigger>Product Details</AccordionTrigger>
                <AccordionContent className="space-y-2 text-sm">
                   <p><span className="font-semibold">Category:</span> {product.category} &gt; {product.sub_category}</p>
                   <p><span className="font-semibold">Gender:</span> {product.gender}</p>
                   {product.tags && <p><span className="font-semibold">Tags:</span> {product.tags.join(', ')}</p>}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-gray-600 prose-sm">
                  <p>Free standard shipping on all orders. Express shipping available at checkout.</p>
                  <p>We accept returns within 14 days of delivery. Please visit our returns policy page for more details.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>

        {/* <RecommendedProducts cartItems={[]} /> */}
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetailsPage;