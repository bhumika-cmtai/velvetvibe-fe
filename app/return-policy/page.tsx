"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  CornerUpLeft, 
  Search,
  PackageCheck // Re-using a relevant icon
} from "lucide-react";
import { ReactNode } from "react";

// Reusable component for each policy section (Themed)
const PolicySection = ({
  id,
  icon: Icon,
  title,
  children,
}: {
  id:string;
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

export default function ReturnPolicyPage() {
  const sections = [
    { id: "our-promise", title: "Our Promise" },
    { id: "return-window", title: "Return Window" },
    { id: "eligibility", title: "Eligibility for Returns" },
    { id: "non-returnable", title: "Non-Returnable Items" },
    { id: "initiate-return", title: "How to Start a Return" },
    { id: "inspection", title: "Inspection & Approval" },
  ];

  return (
    // --- FIX: Using --base-10 for the background ---
    <div className="min-h-screen bg-[var(--base-10)]">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
        
        {/* --- Header rewritten for Velvet Vibe brand --- */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[var(--pallete-500)] md:text-5xl font-serif">
            Return Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            A simple and seamless process, because we value your satisfaction.
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

              <PolicySection id="our-promise" icon={PackageCheck} title="1. Our Promise to You">
                <p>At Velvet Vibe, we want you to be completely in love with your purchase. If for any reason you are not entirely satisfied, we are happy to assist you with a return, provided the items meet the conditions outlined below.</p>
              </PolicySection>
              
              <PolicySection id="return-window" icon={CalendarDays} title="2. Return Window">
                <p>To ensure a smooth process, please initiate your return request within <strong>14 days</strong> from the date you receive your order. Requests made after this period will unfortunately not be eligible.</p>
              </PolicySection>

              <PolicySection id="eligibility" icon={CheckCircle2} title="3. Eligibility for Returns">
                <p>For a return to be accepted, the item must be in its original, pristine condition. This means:</p>
                <ul>
                  <li><strong>Clothing:</strong> Must be unworn, unwashed, and undamaged, with all original tags and labels attached.</li>
                  <li><strong>Decorative Items:</strong> Must be in their original, intact packaging, free from any signs of use or damage.</li>
                </ul>
              </PolicySection>

              <PolicySection id="non-returnable" icon={XCircle} title="4. Non-Returnable Items">
                <p>Due to hygiene standards and the nature of certain products, we cannot accept returns for the following:</p>
                <ul>
                  <li>Items marked as "Final Sale" or purchased from a clearance section.</li>
                  <li>Earrings and other pierced jewelry.</li>
                  <li>Gift cards.</li>
                </ul>
                <p>Please check the product description carefully before making a purchase.</p>
              </PolicySection>
              
              <PolicySection id="initiate-return" icon={CornerUpLeft} title="5. How to Start a Return">
                <p>Initiating a return is easy. Simply send an email to our customer care team at <a href="mailto:support@velvetvibe.com" className="text-primary underline">support@velvetvibe.com</a> with your Order ID and the name of the item(s) you wish to return. We will reply with detailed instructions and arrange for a reverse pickup from your address.</p>
              </ PolicySection>

              <PolicySection id="inspection" icon={Search} title="6. Inspection & Approval">
                <p>Once your returned item arrives at our studio, it will undergo a quality inspection by our team. We reserve the right to decline a return if the item does not meet our eligibility criteria. Upon successful inspection, we will notify you via email and begin the refund process as outlined in our <a href="/refund-policy" className="text-primary underline">Refund Policy</a>.</p>
              </PolicySection>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}