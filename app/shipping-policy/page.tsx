"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Clock, 
  Truck, 
  IndianRupee, 
  PackageSearch, 
  ShieldAlert, 
  Home,
  Globe, // New Icon for International Shipping
} from "lucide-react";
import { ReactNode } from "react";

// Reusable component for each policy section (Themed)
const PolicySection = ({
  id,
  icon: Icon,
  title,
  children,
}: {
  id: string;
  icon: React.ElementType;
  title: string;
  children: ReactNode;
}) => (
  <section id={id} className="mb-12 scroll-mt-24">
    <div className="flex items-center">
      <Icon className="h-8 w-8 flex-shrink-0 text-primary" /> {/* Using theme color */}
      <h2 className="ml-4 text-2xl font-semibold text-[var(--pallete-300)]">{title}</h2>
    </div>
    <hr className="my-4 border-gray-200" />
    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">{children}</div>
  </section>
);

export default function ShippingPolicyPage() {
  const sections = [
    { id: "processing-time", title: "Order Processing Time" },
    { id: "shipping-timelines", title: "Shipping Timelines & Costs" },
    { id: "order-tracking", title: "Tracking Your Vibe" },
    { id: "international-shipping", title: "International Shipping" },
    { id: "damaged-lost", title: "Damaged or Lost Packages" },
    { id: "address-accuracy", title: "Address Accuracy" },
  ];

  return (
    // --- FIX: Using --base-10 for the background ---
    <div className="min-h-screen bg-[var(--base-10)]">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
        
        {/* --- Header rewritten for Velvet Vibe brand --- */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[var(--pallete-500)] md:text-5xl font-serif">
            Shipping Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Getting your Velvet Vibe treasures from our home to yours.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* --- Sticky navigation (themed) --- */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">Quick Navigation</h3>
              <ul className="mt-4 space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-gray-600 transition-colors hover:text-primary hover:underline"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* --- Main content area with updated policies --- */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm md:p-12">
              
              <PolicySection id="processing-time" icon={Clock} title="1. Order Processing Time">
                <p>We are thrilled you've chosen Velvet Vibe! We lovingly prepare and pack every order with care. Our processing times are as follows:</p>
                <ul>
                  <li><strong>In-Stock Clothing & Decor:</strong> Your order will be dispatched from our studio within <strong>2-3 business days</strong>.</li>
                  <li>Orders are processed Monday through Friday, excluding public holidays.</li>
                </ul>
              </PolicySection>

              <PolicySection id="shipping-timelines" icon={Truck} title="2. Shipping Timelines & Costs">
                <p>Once dispatched, you can expect your package to arrive based on the following timelines:</p>
                <ul>
                  <li><strong>Standard Shipping:</strong> We offer complimentary standard shipping on all orders over ₹1,999. Estimated delivery is <strong>5-7 business days</strong> after dispatch.</li>
                  <li><strong>Standard Shipping (below ₹1,999):</strong> A flat fee of <strong>₹99</strong> will be applied.</li>
                  <li><strong>Express Shipping:</strong> Need your items sooner? Express shipping is available for a fee calculated at checkout, with an estimated delivery of <strong>2-4 business days</strong> post-dispatch.</li>
                </ul>
              </PolicySection>

              <PolicySection id="order-tracking" icon={PackageSearch} title="3. Tracking Your Vibe">
                <p>The moment your order leaves our studio, we'll send you a shipping confirmation email and/or SMS containing your tracking number. You can use this to follow your package's journey to your doorstep.</p>
              </PolicySection>
              
              <PolicySection id="international-shipping" icon={Globe} title="4. International Shipping">
                <p>Currently, Velvet Vibe ships exclusively within India. We are working on bringing our collections to a global audience, so please stay tuned for updates!</p>
              </PolicySection>

              <PolicySection id="damaged-lost" icon={ShieldAlert} title="5. Damaged or Lost Packages">
                <p>We pack every item securely to ensure it arrives in perfect condition. In the rare event that your order arrives damaged, please contact us within <strong>48 hours</strong> of delivery at <a href="mailto:support@velvetvibe.com" className="text-primary underline">support@velvetvibe.com</a> with your Order ID and photos of the damage. We will assist you promptly. For packages lost in transit, we will coordinate directly with our courier partners to resolve the issue.</p>
              </PolicySection>

              <PolicySection id="address-accuracy" icon={Home} title="6. Address Accuracy">
                <p>To ensure a smooth delivery, please double-check that your shipping address is complete and correct at checkout. Velvet Vibe is not responsible for shipping delays or lost packages resulting from an incorrect or incomplete address provided by the customer.</p>
              </PolicySection>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}