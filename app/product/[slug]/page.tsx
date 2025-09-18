"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Heart, Minus, Plus, Check } from "lucide-react";
import { motion } from "framer-motion";

// --- UI Components ---
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Separator } from "@/components/ui/separator";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import ProductDetailsSkeleton from "@/components/skeleton/ProductPageSkeleton";
import { useToast } from "@/hooks/use-toast";

// --- Redux & Context Integration ---
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/lib/redux/store";
import { fetchProductBySlug, clearSelectedProduct } from "@/lib/redux/slices/productSlice";
import { selectIsAuthenticated } from "@/lib/redux/slices/authSlice";
import { addToCart as addCartToDb } from "@/lib/redux/slices/cartSlice";
import { useCart as useLocalCart } from "@/context/CartContext";
import { Product, Variant } from "@/lib/types/product";
import { ProductReviews } from "@/components/ProductReviews"; 

// Wishlist imports (Redux and Context)
import { useWishlist } from "@/context/WishlistContext";
import { 
  addToWishlist as addWishlistToDb, 
  removeFromWishlist as removeWishlistFromDb 
} from "@/lib/redux/slices/wishlistSlice";
import { RecommendedProducts } from "@/components/RecommendProducts";

const ProductDetailsPage = () => {
  const params = useParams();
  const slug = params.slug as string;
  const { toast } = useToast();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  // --- Redux State ---
  const { 
    selectedProduct: product, 
    productDetailsLoading: loading, 
    productDetailsError: error 
  } = useSelector((state: RootState) => state.product);
  
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // --- Context Hooks ---
  const { addToCart: addCartToLocal } = useLocalCart(); 
  
  // --- YEH LINE THEEK KAR DI GAYI HAI (THIS LINE IS FIXED) ---
  const { 
    addToWishlist: addWishlistToLocal, 
    removeFromWishlist: removeWishlistFromLocal, 
    isAddedToWishlist 
  } = useWishlist();

  // --- Component State ---
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isWishlistSuccess, setIsWishlistSuccess] = useState(false);

  // --- BAAKI KA SAARA CODE SAME RAHEGA (REST OF THE CODE REMAINS THE SAME) ---

  // Fetch product data on slug change
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [slug, dispatch]);

  // Set default variant selections when product data loads
  useEffect(() => {
    const variants = product?.variants ?? [];
    if (variants.length > 0) {
      const firstVariant = variants[0];
      setSelectedColor(firstVariant.color);
      const firstSizeForColor = variants.find((v: Variant) => v.color === firstVariant.color);
      if (firstSizeForColor) {
        setSelectedSize(firstSizeForColor.size);
      }
    } else {
      setSelectedColor(null);
      setSelectedSize(null);
    }
    setSelectedImage(0);
    setQuantity(1);
  }, [product]);

  // Memoized calculation for available variants
  const { availableColors, availableSizes, selectedVariant } = useMemo<{
    availableColors: string[];
    availableSizes: { size: string; stock: number }[];
    selectedVariant: Variant | null;
  }>(() => {
    if (!product || !product.variants || product.variants.length === 0) {
      return { availableColors: [], availableSizes: [], selectedVariant: null };
    }
    const colors: string[] = [...new Set<string>(product.variants.map((v: Variant) => v.color))];

    const sizesForSelectedColor = product.variants
      .filter((v: Variant) => v.color === selectedColor)
      .map((v: Variant) => ({ size: v.size, stock: v.stock_quantity }));
    const variant = product.variants.find((v: Variant) => v.color === selectedColor && v.size === selectedSize) || null;
    return { availableColors: colors, availableSizes: sizesForSelectedColor, selectedVariant: variant };
  }, [product, selectedColor, selectedSize]);

  const isWishlisted = useMemo(() => product ? isAddedToWishlist(product._id) : false, [isAddedToWishlist, product]);
  
  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.variants && product.variants.length > 0) {
      if (!selectedVariant) {
        toast({ title: "Selection needed", description: "Please select an available color and size.", variant: "destructive" });
        return;
      }
      if (selectedVariant.stock_quantity < 1) {
        toast({ title: "Out of Stock", description: "This variant is currently unavailable.", variant: "destructive" });
        return;
      }
    } else {
        if (!product.stock_quantity || product.stock_quantity < 1) {
             toast({ title: "Out of Stock", description: "This product is currently unavailable.", variant: "destructive" });
             return;
        }
    }

    if (isAuthenticated) {
      if (product.variants && product.variants.length > 0 && selectedVariant) {
        dispatch(addCartToDb({ 
          productId: product._id, 
          sku_variant: selectedVariant.sku_variant, 
          quantity 
        }));
      } else {
        dispatch(addCartToDb({ 
          productId: product._id, 
          sku_variant: 'default', 
          quantity 
        }));
      }
    } else {
      if (product.variants && product.variants.length > 0 && selectedVariant) {
        addCartToLocal(product, selectedVariant, quantity);
      } else {
        addCartToLocal(product, undefined, quantity);
      }
    }

    setIsAddedToCart(true);
    setTimeout(() => setIsAddedToCart(false), 2000);
    
    const variantInfo = selectedVariant ? ` (${selectedVariant.size})` : '';
    toast({ 
      title: "✅ Added to Cart!", 
      description: `${quantity} x ${product.name}${variantInfo} has been added to your cart.`,
      duration: 3000,
      className: "bg-green-50 border-green-200 text-green-800"
    });
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    const productId = product._id;
    
    // Handle variants for wishlist
    if (product.variants && product.variants.length > 0) {
      // For wishlist, we can add even out-of-stock items (users might want to save for later)
      // Use the selected variant or first variant
      const variantToUse = selectedVariant || product.variants[0];
      
      const skuVariant = variantToUse.sku_variant;
      const isCurrentlyWishlisted = isAddedToWishlist(productId, skuVariant);

      if (isAuthenticated) {
        if (isCurrentlyWishlisted) {
          dispatch(removeWishlistFromDb(productId));
        } else {
          dispatch(addWishlistToDb(productId));
        }
      } else {
        if (isCurrentlyWishlisted) {
          removeWishlistFromLocal(productId, skuVariant);
        } else {
          addWishlistToLocal(product, variantToUse);
        }
      }
    } else {
      // Simple product without variants
      const isCurrentlyWishlisted = isAddedToWishlist(productId);

      if (isAuthenticated) {
        if (isCurrentlyWishlisted) {
          dispatch(removeWishlistFromDb(productId));
        } else {
          dispatch(addWishlistToDb(productId));
        }
      } else {
        if (isCurrentlyWishlisted) {
          removeWishlistFromLocal(productId);
        } else {
          addWishlistToLocal(product);
        }
      }
    }
    
    setIsWishlistSuccess(true);
    setTimeout(() => setIsWishlistSuccess(false), 2000);
    
    // Get the current wishlist status for toast message
    const isCurrentlyWishlisted = product.variants && product.variants.length > 0 
      ? isAddedToWishlist(productId, selectedVariant?.sku_variant || product.variants[0]?.sku_variant)
      : isAddedToWishlist(productId);
    
    toast({
        title: isCurrentlyWishlisted ? "❤️ Removed from Wishlist" : "❤️ Added to Wishlist",
        description: `${product.name} has been ${isCurrentlyWishlisted ? 'removed from' : 'added to'} your wishlist.`,
        duration: 3000,
        className: isCurrentlyWishlisted ? "bg-red-50 border-red-200 text-red-800" : "bg-pink-50 border-pink-200 text-pink-800"
    });
  };
  
  const incrementQuantity = () => {
    const maxStock = selectedVariant?.stock_quantity ?? product?.stock_quantity ?? 1;
    setQuantity(q => Math.min(q + 1, maxStock));
  };
  const decrementQuantity = () => setQuantity(q => Math.max(1, q - 1));

  if (loading) {
    return (
      <div className="bg-gray-50">
        <Navbar />
        <ProductDetailsSkeleton />
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
        <div className="bg-gray-50">
            <Navbar/>
            <div className="container mx-auto text-center py-20">
                <h2 className="text-2xl font-bold text-red-600">Failed to load product</h2>
                <p className="text-gray-600 mt-2">{error}</p>
                <Button onClick={() => router.push('/shop')} className="mt-4">Go to Shop</Button>
            </div>
            <Footer/>
        </div>
    );
  }

  if (!product) {
    return (
        <div className="bg-gray-50">
            <Navbar/>
            <div className="container mx-auto text-center py-20">
                <h2 className="text-2xl font-bold">Product Not Found</h2>
                <p className="text-gray-600 mt-2">The product you are looking for does not exist.</p>
                <Button onClick={() => router.push('/shop')} className="mt-4">Go to Shop</Button>
            </div>
            <Footer/>
        </div>
    );
  }

  const displayPrice = product.sale_price ?? product.price;
  const originalPrice = product.price;
  const hasSale = !!product.sale_price && product.sale_price < originalPrice;
  const discount = hasSale ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) : 0;
  
  return (
    <div className="bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* LEFT: MEDIA GALLERY */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col-reverse md:flex-row gap-4">
            <div className="flex md:flex-col gap-3 md:overflow-y-auto pb-2 md:pb-0 md:pr-2">
              {product.images.map((img:string, idx:number) => (
                <button key={idx} onClick={() => setSelectedImage(idx)} className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${selectedImage === idx ? 'border-primary' : 'border-transparent'}`}>
                  <Image src={img} alt={`${product.name} thumbnail ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-gray-100">
              <Image src={product.images[selectedImage]} alt={product.name} fill className="object-cover" />
            </div>
          </motion.div>

          {/* RIGHT: PRODUCT DETAILS & ACTIONS */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <p className="font-semibold text-primary">{product.brand}</p>
            <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-800 my-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl font-bold text-gray-900">₹{displayPrice.toLocaleString()}</span>
              {hasSale && <span className="text-xl text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>}
              {hasSale && <span className="bg-red-100 text-red-600 text-sm font-semibold px-2.5 py-1 rounded-full">{discount}% OFF</span>}
            </div>

            {product.variants && product.variants.length > 0 && (
              <>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Color: <span className="font-bold">{selectedColor}</span></h3>
                  <div className="flex gap-2">
                    {availableColors.map(color => (
                      <button key={color} onClick={() => setSelectedColor(color)} className={`w-8 h-8 rounded-full border-2 transition-all ${selectedColor === color ? 'border-black scale-110' : 'border-gray-200'}`} style={{ backgroundColor: color.toLowerCase() }} title={color}/>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableSizes.map(({ size, stock }) => (
                      <button key={size} onClick={() => setSelectedSize(size)} disabled={stock < 1} className={`px-4 py-2 border rounded-lg text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${selectedSize === size ? 'bg-black text-white' : 'bg-white text-black hover:bg-gray-100'}`}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center border rounded-full font-semibold">
                <Button variant="ghost" size="icon" onClick={decrementQuantity} className="h-11 w-11 rounded-full"><Minus size={16} /></Button>
                <span className="w-10 text-center">{quantity}</span>
                <Button variant="ghost" size="icon" onClick={incrementQuantity} className="h-11 w-11 rounded-full"><Plus size={16} /></Button>
              </div>
              <Button 
                onClick={handleAddToCart} 
                className={`flex-1 h-12 rounded-full text-base font-bold transition-all duration-300 ${
                  isAddedToCart 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isAddedToCart ? (
                  <>
                    <Check size={18} className="mr-2"/> Added!
                  </>
                ) : (
                  'Add to Bag'
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleToggleWishlist} 
                className={`h-12 w-12 rounded-full flex-shrink-0 transition-all duration-300 ${
                  isWishlistSuccess 
                    ? 'bg-pink-500 border-pink-500 hover:bg-pink-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <Heart 
                  className={`transition-colors ${
                    isWishlistSuccess 
                      ? 'fill-white text-white' 
                      : isWishlisted 
                        ? 'fill-red-500 text-red-500' 
                        : ''
                  }`} 
                />
              </Button>
            </div>
            
            <div className="h-6 mb-4">
                {product.variants && product.variants.length > 0 && selectedVariant && (
                    selectedVariant.stock_quantity > 0 && selectedVariant.stock_quantity <= 5 
                    ? <p className="text-sm text-center text-red-600">Hurry! Only {selectedVariant.stock_quantity} left in stock.</p>
                    : selectedVariant.stock_quantity < 1 
                    ? <p className="text-sm text-center text-gray-500">This size is currently out of stock.</p>
                    : null
                )}
                 {!product.variants || product.variants.length === 0 && product.stock_quantity && product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                     <p className="text-sm text-center text-red-600">Hurry! Only {product.stock_quantity} left in stock.</p>
                 )}
            </div>
            
            <Separator className="my-6"/>

            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
                    <div className="prose text-gray-600 max-w-none" dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>
                
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Details</h3>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-700">
                        <p><span className="font-semibold">Category:</span> {product.category}</p>
                        {product.gender && <p><span className="font-semibold">For:</span> {product.gender}</p>}
                        {product.fit && <p><span className="font-semibold">Fit:</span> {product.fit}</p>}
                        {product.careInstructions && <p><span className="font-semibold">Care:</span> {product.careInstructions}</p>}
                    </div>
                </div>
            </div>

            <Separator className="my-6"/>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-gray-600 prose-sm max-w-none">
                  <p>Free standard shipping on all orders over ₹1,999.</p>
                  <p>We accept returns within 14 days of delivery. Please visit our <Link href="/return-policy" className="text-primary underline">Return Policy</Link> page for more details.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </div>
        <ProductReviews product={product} />
        <RecommendedProducts currentProduct={product} />
      </main>
      <Footer />
    </div>
  )
}

export default ProductDetailsPage;