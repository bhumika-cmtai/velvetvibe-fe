"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  RefreshCw, 
  Banknote, 
  Percent, 
  HelpCircle,
  PackageCheck, 
  XCircle,      
  Mail,         
} from "lucide-react";
import { ReactNode } from "react";

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
    <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
        {children}
    </div>
  </section>
);

export default function RefundPolicyPage() {
  const sections = [
    { id: "eligibility", title: "Return Eligibility" },
    { id: "exceptions", title: "Exceptions / Non-Returnable Items" },
    { id: "initiate-return", title: "How to Initiate a Return" },
    { id: "processing", title: "Refund Processing" },
    { id: "timelines-method", title: "Refund Timelines" },
    { id: "deductions", title: "Deductions from Refund" },
    { id: "support", title: "Questions & Support" },
  ];

  return (
    <div className="min-h-screen bg-[var(--base-10)]">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl  font-bold text-[var(--pallete-500)] md:text-5xl font-serif">
            Our Refund Vibe
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            At Velvet Vibe, your satisfaction is our priority. Here's our simple and fair approach to returns and refunds.
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
                      className="text-gray-600 transition-colors hover:text-primary hover:underline"
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
              
              <PolicySection id="eligibility" icon={PackageCheck} title="1. Return Eligibility">
                <p>We want you to adore every piece from Velvet Vibe. If something isn't quite right, you are welcome to return it under the following conditions:</p>
                <ul>
                  <li>The return must be initiated within <strong>14 days</strong> of the delivery date.</li>
                  <li><strong>Clothing:</strong> Items must be unworn, unwashed, and in their original condition with all tags attached.</li>
                  <li><strong>Decorative Items:</strong> Must be returned in their original, undamaged packaging.</li>
                </ul>
              </PolicySection>
              
              <PolicySection id="exceptions" icon={XCircle} title="2. Exceptions / Non-Returnable Items">
                <p>For hygiene and safety reasons, certain items cannot be returned. Please note that the following are final sale:</p>
                <ul>
                  <li>Items marked as "Final Sale".</li>
                  <li>Gift cards.</li>
                  <li>Earrings and other pierced jewelry.</li>
                </ul>
              </PolicySection>
              
              <PolicySection id="initiate-return" icon={Mail} title="3. How to Initiate a Return">
                <p>Starting a return is simple. Please email our friendly customer care team at <a href="mailto:support@velvetvibe.com" className="text-primary underline">support@velvetvibe.com</a> with your order number and the items you wish to return. We will guide you through the next steps for a smooth process.</p>
              </PolicySection>

              <PolicySection id="processing" icon={RefreshCw} title="4. Refund Processing">
                <p>Once we receive your return package, our team will inspect the items to ensure they meet our eligibility criteria. We'll send you an email to notify you of the approval or rejection of your refund. If approved, your refund will be processed immediately.</p>
              </PolicySection>

              <PolicySection id="timelines-method" icon={Banknote} title="5. Refund Timelines">
                <ul>
                  <li><strong>Prepaid Orders:</strong> Your refund will be credited back to your original payment method (Credit/Debit Card, UPI, etc.) within <strong>7-10 business days</strong>.</li>
                  <li><strong>Cash on Delivery (COD):</strong> For COD orders, the refund will be processed via bank transfer. We will contact you for your bank details, and the amount will be credited within <strong>7-10 business days</strong>.</li>
                </ul>
              </PolicySection>

              <PolicySection id="deductions" icon={Percent} title="6. Deductions from Refund">
                <p>Your refund will be for the full value of the returned items. Please note that original shipping fees and any applicable COD handling charges are non-refundable. A nominal reverse pickup fee for the return shipment will also be deducted from the final refund amount.</p>
              </PolicySection>
              
              <PolicySection id="support" icon={HelpCircle} title="7. Questions & Support">
                <p>If you haven't received your refund within the expected timeline, we recommend first checking with your bank or credit card company. If you've done this and still need assistance, please don't hesitate to reach out to us. We're here to help!</p>
                <p><strong>Contact Us:</strong> <a href="mailto:support@velvetvibe.com" className="text-primary underline">support@velvetvibe.com</a></p>
              </PolicySection>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}