"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  ClipboardList, 
  Settings, 
  Share2, 
  Shield, 
  Cookie, 
  UserCheck, 
  FileClock, 
  Mail 
} from "lucide-react";
import { ReactNode } from "react";

// Reusable component for each policy section
// Applying the same color scheme as the refund policy page for consistency
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

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "info-collected", title: "Information We Collect" },
    { id: "info-use", title: "How We Use Your Information" },
    { id: "info-sharing", title: "Sharing Your Information" },
    { id: "info-security", title: "Data Security" },
    { id: "cookies", title: "Cookies & Pixels" },
    { id: "your-rights", title: "Your Control & Rights" },
    { id: "policy-changes", title: "Policy Updates" },
    { id: "contact-us", title: "Contact Us" },
  ];

  return (
    // --- FIX: Using --base-10 for the background ---
    <div className="min-h-screen bg-[var(--base-10)]">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
        
        {/* --- Header rewritten for Velvet Vibe brand --- */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[var(--pallete-500)] md:text-5xl font-serif">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your trust is our most cherished asset. Here's how we protect your privacy.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: 16 September 2025
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* --- Sticky navigation (themed) --- */}
          <aside className="lg-col-span-1 lg:sticky lg:top-24 h-fit">
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
              
              <PolicySection id="info-collected" icon={ClipboardList} title="1. Information We Collect">
                <p>To provide you with a seamless shopping experience at Velvet Vibe, we collect information when you interact with our site. This includes:</p>
                <ul>
                  <li><strong>Personal Details:</strong> Your name, email address, shipping address, and phone number when you create an account or place an order.</li>
                  <li><strong>Order Information:</strong> Details about the products you purchase, your sizing preferences, and billing information.</li>
                  <li><strong>Browsing Data:</strong> Information about how you navigate our site, which products you view, and items you add to your wishlist.</li>
                </ul>
                <p><strong>Important:</strong> Your payment details are processed securely by our trusted payment partners (like Stripe or Razorpay) and are never stored on our servers.</p>
              </PolicySection>

              <PolicySection id="info-use" icon={Settings} title="2. How We Use Your Information">
                <p>We use your information to enhance your experience and operate our business effectively. This includes:</p>
                <ul>
                    <li><strong>Fulfilling Your Orders:</strong> Processing payments, arranging for shipping, and providing you with invoices and order confirmations.</li>
                    <li><strong>Personalizing Your Vibe:</strong> Recommending clothing and decor items we think you'll love.</li>
                    <li><strong>Communication:</strong> Sending you updates about your order and, if you opt-in, sharing news about new collections and exclusive offers.</li>
                    <li><strong>Customer Support:</strong> Assisting you with any inquiries or issues you may have.</li>
                </ul>
              </PolicySection>

              <PolicySection id="info-sharing" icon={Share2} title="3. Sharing Your Information">
                <p><strong>Your privacy is not for sale.</strong> We do not sell, trade, or rent your personal information to third parties. We only share data with essential partners who help us run our store, such as:</p>
                <ul>
                    <li>Our courier partners to deliver your orders.</li>
                    <li>Our secure payment gateways to process your payments.</li>
                </ul>
                <p>These partners are bound by confidentiality agreements and are only permitted to use your information for the specific services they provide to us.</p>
              </PolicySection>
              
              <PolicySection id="info-security" icon={Shield} title="4. Data Security">
                <p>We treat your data with the utmost care. We implement a variety of security measures, including SSL encryption, to maintain the safety of your personal information when you place an order or access your account.</p>
              </PolicySection>

              <PolicySection id="cookies" icon={Cookie} title="5. Cookies & Pixels">
                <p>Like most online boutiques, we use cookies—little digital notes—to help our site function. They help us remember what's in your shopping bag, understand your preferences for future visits, and gather aggregate data about site traffic so we can offer better experiences.</p>
              </PolicySection>

              <PolicySection id="your-rights" icon={UserCheck} title="6. Your Control & Rights">
                <p>You are in control of your information. You have the right to:</p>
                <ul>
                    <li>Access the personal information we hold about you.</li>
                    <li>Request corrections to any inaccurate data.</li>
                    <li>Opt-out of our marketing emails at any time by clicking the "unsubscribe" link at the bottom of any email.</li>
                </ul>
              </PolicySection>

              <PolicySection id="policy-changes" icon={FileClock} title="7. Policy Updates">
                <p>Our policy may evolve over time as we grow and add new features. We will post any changes on this page and update the "Last Updated" date at the top. We encourage you to review it periodically.</p>
              </PolicySection>
              
              <PolicySection id="contact-us" icon={Mail} title="8. Contact Us">
                <p>If you have any questions or concerns about this Privacy Policy, our team is here to help. Please feel free to reach out to us.</p>
                <p><strong>Email:</strong> <a href="mailto:privacy@velvetvibe.com" className="text-primary underline">privacy@velvetvibe.com</a></p>
              </PolicySection>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}