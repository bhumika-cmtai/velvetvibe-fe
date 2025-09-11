"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CalendarDays, 
  CheckCircle2, 
  XCircle, 
  CornerUpLeft, 
  Search 
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

export default function ReturnPolicyPage() {
  const sections = [
    { id: "return-window", title: "Return Window" },
    { id: "eligibility", title: "Eligibility for Returns" },
    { id: "non-returnable", title: "Non-Returnable Items" },
    { id: "initiate-return", title: "How to Initiate a Return" },
    { id: "inspection", title: "Inspection Process" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#A77C38] md:text-5xl font-serif">
            Return Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Our commitment to your satisfaction.
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
              <PolicySection id="return-window" icon={CalendarDays} title="1. Return Window">
                <p>
                  You have <strong>7 days</strong> from the date of delivery to request a return for any eligible items purchased from Gullnaaz.
                </p>
              </PolicySection>

              <PolicySection id="eligibility" icon={CheckCircle2} title="2. Eligibility for Returns">
                <p>To be eligible, your item must be in its original, unused, and unaltered condition, accompanied by all original packaging.</p>
              </PolicySection>

              <PolicySection id="non-returnable" icon={XCircle} title="3. Non-Returnable Items">
                <p>Due to their nature, we cannot accept returns for custom-made jewellery, earrings (for hygiene reasons), or items purchased during a sale.</p>
              </PolicySection>
              
              <PolicySection id="initiate-return" icon={CornerUpLeft} title="4. How to Initiate a Return">
                <p>
                  To start a return, please email us at <a href="mailto:gullnaaz2025@gmail.com" className="text-[#A77C38] underline">gullnaaz2025@gmail.com</a> with your Order ID. We will guide you through the process and arrange a reverse pickup.
                </p>
              </PolicySection>

              <PolicySection id="inspection" icon={Search} title="5. Inspection Process">
                <p>
                  All returned items undergo a quality check. We reserve the right to reject a return if it does not meet our quality standards.
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