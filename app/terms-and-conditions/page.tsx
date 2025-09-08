"use client"; // Required for using components with hooks or event handlers if you add them later

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { 
  BookText, 
  UserCircle2, 
  Gem, 
  ShoppingCart, 
  Copyright, 
  ShieldAlert, 
  Landmark, 
  Mail 
} from "lucide-react";
import { ReactNode } from "react";

// Reusable component for each policy section to keep the code clean
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

export default function TermsAndConditionsPage() {
  const sections = [
    { id: "introduction", title: "Introduction" },
    { id: "user-account", title: "User Account" },
    { id: "products-pricing", title: "Products and Pricing" },
    { id: "orders-payment", title: "Orders and Payment" },
    { id: "intellectual-property", title: "Intellectual Property" },
    { id: "liability", title: "Limitation of Liability" },
    { id: "governing-law", title: "Governing Law" },
    { id: "contact", title: "Contact Information" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#A77C38] md:text-5xl font-serif">
            Terms and Conditions
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your guide to using our services and website.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: 8 September 2025
          </p>
        </div>

        {/* Summary and Navigation Grid */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Left Column: Navigation */}
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

          {/* Right Column: Content */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm md:p-12">
              
              <PolicySection id="introduction" icon={BookText} title="1. Introduction">
                <p>
                  Welcome to Gullnaaz. These Terms and Conditions ("Terms") govern your use of our website and the purchase of our products. By accessing or using our website, you agree to be bound by these Terms and our Privacy Policy. If you do not agree with any part of these terms, you must not use our website.
                </p>
              </PolicySection>

              <PolicySection id="user-account" icon={UserCircle2} title="2. User Account">
                <p>
                  To place an order, you may be required to create an account. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer. You agree to accept responsibility for all activities that occur under your account or password.
                </p>
              </PolicySection>
              
              <PolicySection id="products-pricing" icon={Gem} title="3. Products and Pricing">
                <p>
                  We strive to display our products, including colors and details, as accurately as possible. However, we cannot guarantee that your computer monitor's display of any color will be completely accurate.
                </p>
                <p>
                  All product descriptions and prices are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time.
                </p>
              </PolicySection>

              <PolicySection id="orders-payment" icon={ShoppingCart} title="4. Orders and Payment">
                <p>
                  We reserve the right to refuse or cancel any order for any reason. By placing an order, you agree to provide current, complete, and accurate purchase and account information so that we can complete your transactions and contact you as needed.
                </p>
              </PolicySection>

              <PolicySection id="intellectual-property" icon={Copyright} title="5. Intellectual Property">
                <p>
                  This website contains material which is owned by or licensed to us. This material includes, but is not limited to, the design, layout, logo, images, and graphics. Reproduction is strictly prohibited.
                </p>
              </PolicySection>

              <PolicySection id="liability" icon={ShieldAlert} title="6. Limitation of Liability">
                <p>
                  In no case shall Gullnaaz, our directors, employees, or affiliates be liable for any injury, loss, claim, or any damages of any kind arising from your use of the website or any products procured using the service.
                </p>
              </PolicySection>

              <PolicySection id="governing-law" icon={Landmark} title="7. Governing Law">
                <p>
                  These Terms and Conditions shall be governed by and construed in accordance with the laws of India and the jurisdiction of the courts of Delhi.
                </p>
              </PolicySection>

              <PolicySection id="contact" icon={Mail} title="8. Contact Information">
                <p>
                  Questions about the Terms and Conditions should be sent to us at <a href="mailto:gullnaaz2025@gmail.com" className="text-[#A77C38] underline">gullnaaz2025@gmail.com</a>.
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