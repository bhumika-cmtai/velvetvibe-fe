"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  RefreshCw, 
  Banknote, 
  Percent, 
  HelpCircle 
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

export default function RefundPolicyPage() {
  const sections = [
    { id: "processing", title: "Refund Processing" },
    { id: "timelines-method", title: "Refund Timelines & Method" },
    { id: "deductions", title: "Deductions" },
    { id: "late-missing", title: "Late or Missing Refunds" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#A77C38] md:text-5xl font-serif">
            Refund Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Our process for quick and easy refunds.
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
              <PolicySection id="processing" icon={RefreshCw} title="1. Refund Processing">
                <p>
                  Once your return is received and inspected, we will notify you of its approval. If approved, your refund will be processed immediately.
                </p>
              </PolicySection>

              <PolicySection id="timelines-method" icon={Banknote} title="2. Refund Timelines & Method">
                <ul>
                  <li><strong>Prepaid Orders:</strong> Your refund will be credited to your original payment method within <strong>7-10 business days</strong>.</li>
                  <li><strong>Cash on Delivery (COD):</strong> We will process your refund via bank transfer within <strong>7-10 business days</strong> after receiving your bank details.</li>
                </ul>
              </PolicySection>

              <PolicySection id="deductions" icon={Percent} title="3. Deductions">
                <p>
                  Please note that original shipping fees and any applicable COD charges are non-refundable. Any reverse pickup fees will also be deducted.
                </p>
              </PolicySection>
              
              <PolicySection id="late-missing" icon={HelpCircle} title="4. Late or Missing Refunds">
                <p>
                  If you haven't received a refund within the specified time, please check with your bank first. If you still need assistance, contact us at <a href="mailto:gullnaaz2025@gmail.com" className="text-[#A77C38] underline">gullnaaz2025@gmail.com</a>.
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