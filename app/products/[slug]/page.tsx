"use client"
import { useEffect, useMemo, useState, useRef } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Heart, Minus, Plus, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import Link from "next/link"
// --- REDUX IMPORTS ---
import { useDispatch, useSelector } from "react-redux"
import { fetchProductBySlug } from "@/lib/redux/slices/productSlice"
import { addToCart, fetchCart } from "@/lib/redux/slices/cartSlice"
import { RootState } from "@/lib/redux/store"

export default function WomenProductPage() {
  const params = useParams()
  const slug = params.slug as string
  const dispatch = useDispatch<any>()
  
  const { selectedProduct: product, productDetailsLoading, productDetailsError } = useSelector(
    (state: RootState) => state.product
  )
  const { loading: cartLoading } = useSelector((state: RootState) => state.cart)

  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0)
  const [isBuyingNow, setIsBuyingNow] = useState(false)

  // State for magnifier zoom effect
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageContainerRef = useRef<HTMLDivElement>(null)

  const { toast } = useToast()

  // Combine product images and video, with video appearing last
  const media = useMemo(() => {
    const mediaItems = []
    // Add images first
    if (product?.images && product.images.length > 0) {
      mediaItems.push(...product.images.map((url: string) => ({ type: "image", url })))
    } else if (product?.mainImage) {
      // Fallback to mainImage if no images array
      mediaItems.push({ type: "image", url: product.mainImage })
    }
    // Add video last if it exists
    if (product?.video) {
      mediaItems.push({ type: "video", url: product.video })
    }
    return mediaItems
  }, [product])

  // Fetch product by slug and cart data
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug))
      dispatch(fetchCart())
    }
  }, [slug, dispatch])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (imageContainerRef.current) {
        const rect = imageContainerRef.current.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        setMousePosition({ x, y })
    }
  }

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

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap()
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Failed to add to cart",
        variant: "destructive",
      })
    }
  }

  const handleBuyNow = async () => {
    if (product.stock < quantity) {
        toast({ title: "Not enough stock available.", variant: "destructive" })
        return
    }
    setIsBuyingNow(true)
    try {
      await dispatch(addToCart({ productId: product._id, quantity })).unwrap()
      window.location.href = '/checkout'
    } catch (error: any) {
      toast({
        title: "Error",
        description: error || "Could not proceed to checkout.",
        variant: "destructive",
      })
      setIsBuyingNow(false)
    }
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    })
  }

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1)
    } else {
      toast({
        title: "Stock limit reached",
        description: `Only ${product.stock} items available in stock.`,
        variant: "destructive",
      })
    }
  }
  
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  const selectedMedia = media[selectedMediaIndex]
  const MAGNIFIER_SIZE = 150
  const ZOOM_LEVEL = 2.5

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Product Media */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex space-x-4"
          >
            {/* Thumbnails */}
            {media && media.length > 1 && (
              <div className="flex flex-col space-y-2">
                {media.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedMediaIndex(idx)}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 ${
                      idx === selectedMediaIndex ? "border-orange-500" : "border-gray-200"
                    }`}
                  >
                    {item.type === 'image' ? (
                      <Image src={item.url || "/placeholder.svg"} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                    ) : (
                      <div className="relative w-full h-full bg-black">
                        <video src={item.url} muted className="object-cover w-full h-full" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                          <Video className="h-6 w-6 text-white" />
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Main media view */}
            <div 
              ref={imageContainerRef}
              className="relative aspect-square w-full overflow-hidden rounded-2xl"
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              onMouseMove={handleMouseMove}
            >
              {selectedMedia?.type === 'video' ? (
                 <video
                    key={selectedMedia.url}
                    src={selectedMedia.url}
                    autoPlay muted loop playsInline controls
                    className="object-cover w-full h-full"
                 />
              ) : (
                <>
                  <Image
                    src={selectedMedia?.url || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300"
                  />
                  {/* Magnifier glass effect */}
                  {isHovering && imageContainerRef.current && (
                      <div
                          style={{
                              position: 'absolute',
                              left: `${mousePosition.x - MAGNIFIER_SIZE / 2}px`,
                              top: `${mousePosition.y - MAGNIFIER_SIZE / 2}px`,
                              pointerEvents: 'none',
                              height: `${MAGNIFIER_SIZE}px`,
                              width: `${MAGNIFIER_SIZE}px`,
                              overflow: 'hidden',
                              border: '2px solid white',
                              boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                              borderRadius: '0.25rem',
                              zIndex: 10,
                          }}
                      >
                          <div
                              style={{
                                  position: 'relative',
                                  width: `${imageContainerRef.current.clientWidth * ZOOM_LEVEL}px`,
                                  height: `${imageContainerRef.current.clientHeight * ZOOM_LEVEL}px`,
                                  transform: `translate(-${mousePosition.x * ZOOM_LEVEL - MAGNIFIER_SIZE / 2}px, -${mousePosition.y * ZOOM_LEVEL - MAGNIFIER_SIZE / 2}px)`,
                              }}
                          >
                              <Image
                                  src={selectedMedia?.url || "/placeholder.svg"}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                              />
                          </div>
                      </div>
                  )}
                </>
              )}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">
                {product.name}
              </h1>
              {product.stock <= 0 && (
                <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg mb-4">
                  Out of Stock
                </div>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <div className="bg-yellow-100 border border-yellow-300 text-yellow-700 px-4 py-2 rounded-lg mb-4">
                  Only {product.stock} left in stock!
                </div>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold" style={{ color: "var(--theme-primary)" }}>
                ₹{product.price.toLocaleString()}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice.toLocaleString()}</span>
              )}
              {product.originalPrice && product.originalPrice > product.price && (
                <span
                  className="px-2 py-1 rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: "var(--theme-primary)" }}
                >
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
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
                <span className="text-sm text-gray-500">({product.stock} available)</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0 || cartLoading || isBuyingNow}
                  className="w-full py-3 rounded-xl font-medium"
                >
                  {cartLoading ? "Adding..." : "Add to Cart"}
                </Button>
                <Button
                  onClick={handleBuyNow}
                  disabled={product.stock <= 0 || cartLoading || isBuyingNow}
                  variant="outline"
                  className="w-full py-3 rounded-xl font-medium"
                >
                  {isBuyingNow ? "Processing..." : "Buy Now"}
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlist}
                className="rounded-full h-12 w-12 flex-shrink-0"
              >
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600"}`} />
              </Button>
            </div>
            <div className="text-center mt-3">
              <Link href={`/bulk-order/${product.slug}`} passHref>
                  <p className="text-sm text-gray-600 underline hover:text-theme-primary transition-colors">
                      Want to order in bulk? Inquire for special pricing.
                  </p>
              </Link>
            </div>

            {/* --- CORRECTED PRODUCT DETAILS SECTION --- */}
            <div className="border-t pt-6">
                <div className="mx-auto max-w-md space-y-4">
                    {product.type && (
                        <div className="grid grid-cols-2 items-start gap-4">
                            <span className="font-medium text-gray-700 text-left">Type:</span>
                            <span className="text-gray-900 text-right">{product.type}</span>
                        </div>
                    )}

                    {product.gender && (
                        <div className="grid grid-cols-2 items-start gap-4">
                            <span className="font-medium text-gray-700 text-left">Gender:</span>
                            <span className="text-gray-900 text-right">{product.gender}</span>
                        </div>
                    )}
                    
                    {product.tags && product.tags.length > 0 && (
                        <div className="grid grid-cols-2 items-start gap-4">
                            <span className="font-medium text-gray-700 text-left">Tags:</span>
                            <div className="flex flex-wrap justify-end gap-2">
                                {product.tags.map((tag: string, idx: number) => (
                                <span
                                    key={idx}
                                    className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.material && (
                         <div className="grid grid-cols-2 items-start gap-4">
                            <span className="font-medium text-gray-700 text-left">Material:</span>
                            <span className="text-gray-900 text-right">{product.material}</span>
                        </div>
                    )}

                    {product.color && product.color.length > 0 && (
                        <div className="grid grid-cols-2 items-start gap-4">
                            <span className="font-medium text-gray-700 text-left">Color:</span>
                            <div className="flex flex-wrap justify-end gap-2">
                                {product.color.map((c: string, idx: number) => (
                                    <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-sm">{c}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {product.stones && product.stones.length > 0 && (
                        <div className="grid grid-cols-2 items-start gap-4">
                            <span className="font-medium text-gray-700 text-left">Stones:</span>
                            <div className="flex flex-wrap justify-end gap-2">
                                {product.stones.map((s: string, idx: number) => (
                                <span key={idx} className="px-2 py-1 bg-gray-100 rounded-full text-sm">{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {product.jewelleryCategory && (
                         <div className="grid grid-cols-2 items-start gap-4">
                            <span className="font-medium text-gray-700 text-left">Jewellery Category:</span>
                            <span className="text-gray-900 text-right">{product.jewelleryCategory}</span>
                        </div>
                    )}
                    
                    {product.materialType && (
                        <div className="grid grid-cols-2 items-start gap-4">
                            <span className="font-medium text-gray-700 text-left">Material Type:</span>
                            <span className="text-gray-900 text-right">{product.materialType}</span>
                        </div>
                    )}
                </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  )
}