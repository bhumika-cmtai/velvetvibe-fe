"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation" // Import useRouter
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Navbar  from "@/components/Navbar"
import  Footer  from "@/components/Footer"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"

// --- REDUX IMPORTS ---
import { useDispatch, useSelector } from "react-redux"
import { fetchProductBySlug } from "@/lib/redux/slices/productSlice"
import { RootState, AppDispatch } from "@/lib/redux/store"
// --- FIX 1: Import the new Redux action ---
import { createBulkOrderInquiry } from "@/lib/redux/slices/bulkOrderSlice"

export default function BulkOrderPage() {
  const params = useParams()
  const router = useRouter() // Initialize router for redirection
  const slug = params.slug as string
  const dispatch = useDispatch<AppDispatch>()
  const { toast } = useToast()

  const { selectedProduct: product, productDetailsLoading, productDetailsError } = useSelector(
    (state: RootState) => state.product
  )
  const { user } = useSelector((state: RootState) => state.user)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    quantity: 10,
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug))
    }
  }, [slug, dispatch])

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.fullName || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Ensure quantity doesn't go below 1, even if the user types it
    if (name === 'quantity') {
      setFormData(prev => ({ ...prev, [name]: Math.max(1, Number(value)) }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  // --- FIX 2: Update handleSubmit to dispatch the Redux action ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.quantity < 10) {
      toast({ title: "Minimum quantity for bulk orders is 10.", variant: "destructive" });
      return;
    }
    if (!product) {
        toast({ title: "Product data is not available. Please try again.", variant: "destructive" });
        return;
    }
    
    setIsSubmitting(true)

    // Construct the payload required by the async thunk
    const inquiryPayload = {
      productId: product._id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      quantity: Number(formData.quantity),
      message: formData.message,
    }

    try {
      //  (inquiryPayload)
      // Dispatch the action and wait for it to complete
      await dispatch(createBulkOrderInquiry(inquiryPayload)).unwrap();
      
      toast({
        title: "Inquiry Submitted!",
        description: "Thank you. Our team will contact you shortly regarding your request.",
      });

      // Redirect to the home page on success
      router.push('/');

    } catch (error: any) {
      // The .unwrap() will throw an error if the thunk is rejected
      toast({
        title: "Submission Failed",
        description: String(error), // The error message comes from rejectWithValue
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false)
    }
  }

  if (productDetailsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading product information...</div>
  }
  if (productDetailsError || !product) {
    return <div className="min-h-screen flex items-center justify-center text-center"><div><h1 className="text-2xl font-bold">Product Not Found</h1><p>{productDetailsError}</p></div></div>
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-serif font-bold text-center mb-4">Bulk Order Inquiry</h1>
          <p className="text-center text-gray-600 mb-10">Interested in a large quantity? Fill out the form below and we'll get in touch.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border shadow-sm sticky top-24">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl mb-6">
                <Image
                  src={product.images?.[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h2 className="text-2xl font-bold">{product.name}</h2>
              <p className="text-2xl font-semibold mt-2" style={{ color: "var(--theme-primary)" }}>
                ₹{product.price.toLocaleString()}
                <span className="text-sm text-gray-500 font-normal"> / unit</span>
              </p>
              <p className="mt-4 text-sm text-gray-600">
                Provide your details in the form, and our team will contact you to discuss your bulk order needs, including special pricing and logistics.
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border shadow-sm space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (Min: 10)</Label>
                  <Input id="quantity" name="quantity" type="number" min="10" value={formData.quantity} onChange={handleInputChange} required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea id="message" name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us about any specific requirements..." />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full py-3 text-lg">
                {isSubmitting ? "Submitting..." : "Submit Inquiry"}
              </Button>
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}