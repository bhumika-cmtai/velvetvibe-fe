"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Clock, 
  Truck, 
  IndianRupee, 
  PackageSearch, 
  ShieldAlert, 
  Home 
} from "lucide-react";
import { ReactNode } from "react";

// Reusable component for each policy section
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
  <section id={id} className="mb-12 scroll-mt-20">
    <div className="flex items-center">
      <Icon className="h-8 w-8 flex-shrink-0 text-[#A77C38]" />
      <h2 className="ml-4 text-2xl font-semibold text-gray-800">{title}</h2>
    </div>
    <hr className="my-4 border-gray-200" />
    <div className="prose prose-lg max-w-none text-gray-700">{children}</div>
  </section>
);

export default function ShippingPolicyPage() {
  const sections = [
    { id: "processing-time", title: "Order Processing Time" },
    { id: "methods-timelines", title: "Shipping Methods & Timelines" },
    { id: "shipping-costs", title: "Shipping Costs" },
    { id: "order-tracking", title: "Order Tracking" },
    { id: "damaged-lost", title: "Damaged or Lost Packages" },
    { id: "address-accuracy", title: "Address Accuracy" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#A77C38] md:text-5xl font-serif">
            Shipping Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            How we deliver your Gullnaaz treasures to you.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-gray-800">Quick Navigation</h3>
              <ul className="mt-4 space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="text-gray-600 transition-colors hover:text-[#A77C38] hover:underline"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm md:p-12">
              <PolicySection id="processing-time" icon={Clock} title="1. Order Processing Time">
                <ul>
                  <li><strong>In-Stock Items:</strong> Dispatched within <strong>2-3 business days</strong>.</li>
                  <li><strong>Made-to-Order & Custom Jewellery:</strong> Crafted and dispatched within <strong>10-15 business days</strong>.</li>
                  <li>Orders are not shipped on weekends or public holidays.</li>
                </ul>
              </PolicySection>

              <PolicySection id="methods-timelines" icon={Truck} title="2. Shipping Methods & Timelines">
                <ul>
                  <li><strong>Standard Shipping:</strong> Free on orders over ₹1,999. Estimated delivery in <strong>5-7 business days</strong> post-dispatch.</li>
                  <li><strong>Express Shipping:</strong> Available at checkout. Estimated delivery in <strong>2-4 business days</strong> post-dispatch.</li>
                </ul>
              </PolicySection>

              <PolicySection id="shipping-costs" icon={IndianRupee} title="3. Shipping Costs">
                <ul>
                  <li>A flat rate of <strong>₹99</strong> is charged for standard shipping on orders below ₹1,999.</li>
                  <li>Express shipping costs are calculated at checkout.</li>
                </ul>
              </PolicySection>
              
              <PolicySection id="order-tracking" icon={PackageSearch} title="4. Order Tracking">
                <p>
                  Once dispatched, you will receive an email and/or SMS with your tracking number and a link to track your shipment in real-time.
                </p>
              </PolicySection>

              <PolicySection id="damaged-lost" icon={ShieldAlert} title="5. Damaged or Lost Packages">
                <p>
                  In the rare event your item arrives damaged, please contact us at <a href="mailto:gullnaaz2025@gmail.com" className="text-[#A77C38] underline">gullnaaz2025@gmail.com</a> within <strong>48 hours</strong> with your Order ID and photos. We will resolve any issues with lost packages directly with the courier.
                </p>
              </PolicySection>

              <PolicySection id="address-accuracy" icon={Home} title="6. Address Accuracy">
                <p>
                  Please ensure your shipping address is complete and correct. Gullnaaz is not responsible for delays or failures due to an incorrect address.
                </p>
              </PolicySection>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}