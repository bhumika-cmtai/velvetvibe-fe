"use client";

import Navbar  from "@/components/Navbar";
import Footer  from "@/components/Footer";
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

export default function PrivacyPolicyPage() {
  const sections = [
    { id: "info-collected", title: "Information We Collect" },
    { id: "info-use", title: "How We Use Your Information" },
    { id: "info-disclosure", title: "Disclosure of Your Information" },
    { id: "info-security", title: "Security of Your Information" },
    { id: "cookies", title: "Cookies" },
    { id: "your-rights", title: "Your Rights" },
    { id: "policy-changes", title: "Changes to This Policy" },
    { id: "contact-us", title: "Contact Us" },
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF6]">
      <Navbar />
      <main className="container mx-auto max-w-5xl px-4 py-12 md:py-20">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-[#A77C38] md:text-5xl font-serif">
            Privacy Policy
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Our commitment to protecting your personal information.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Last Updated: 8 September 2025
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
              <PolicySection id="info-collected" icon={ClipboardList} title="1. Information We Collect">
                <p>We collect information you provide directly to us, such as your name, email, shipping address, and phone number when you create an account or place an order. We do not store payment card details.</p>
              </PolicySection>

              <PolicySection id="info-use" icon={Settings} title="2. How We Use Your Information">
                <p>Your information is used to create your account, process and fulfill your orders, communicate with you about your purchases, and, with your consent, send you promotional materials.</p>
              </PolicySection>

              <PolicySection id="info-disclosure" icon={Share2} title="3. Disclosure of Your Information">
                <p>We do not sell or trade your personal information. We only share it with trusted third parties necessary to complete your order, such as payment processors and courier services.</p>
              </PolicySection>
              
              <PolicySection id="info-security" icon={Shield} title="4. Security of Your Information">
                <p>We use administrative and technical security measures like SSL encryption to help protect your data. While we take strong precautions, no system is perfectly secure.</p>
              </PolicySection>

              <PolicySection id="cookies" icon={Cookie} title="5. Cookies">
                <p>Our website uses cookies to enhance your experience by remembering your preferences and keeping items in your shopping cart. You can disable cookies in your browser, but it may affect site functionality.</p>
              </PolicySection>

              <PolicySection id="your-rights" icon={UserCheck} title="6. Your Rights">
                <p>You have the right to access the personal information we hold about you, request corrections, and opt-out of marketing communications at any time.</p>
              </PolicySection>

              <PolicySection id="policy-changes" icon={FileClock} title="7. Changes to This Policy">
                <p>We may update this policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date.</p>
              </PolicySection>
              
              <PolicySection id="contact-us" icon={Mail} title="8. Contact Us">
                <p>
                  If you have any questions or concerns about this Privacy Policy, please contact us at <a href="mailto:gullnaaz2025@gmail.com" className="text-[#A77C38] underline">gullnaaz2025@gmail.com</a>.
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