// src/components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, ArrowRight } from 'lucide-react';

// --- UPDATED Data for footer links based on your file structure ---
const infoLinks = [
  { name: 'My Account', href: '/user/account' },
  { name: 'Order History', href: '/user/account/orders' }, // Assuming this route exists under account
  // { name: 'Bulk Orders', href: '/bulk-order' },
  // { name: 'Contact Us', href: '/#contactus' }, // Assuming a contact page
];

const quickShopLinks = [
  { name: 'New Arrivals', href: '/shop/new-arrivals' },
  { name: 'Best Sellers', href: '/shop/best-sellers' },
  { name: 'Sale', href: '/shop/sale' },
  { name: 'All Products', href: '/shop' },
  { name: 'Decoratives', href: '/decoratives' },
];

const customerServiceLinks = [
  { name: 'Shipping Policy', href: '/shipping-policy' },
  { name: 'Return Policy', href: '/return-policy' },
  { name: 'Refund Policy', href: '/refund-policy' },
  { name: 'Privacy Policy', href: '/privacy-policy' },
  { name: 'Terms & Conditions', href: '/terms-and-conditions' },
];

// Payment Icons Component
const PaymentIcons = () => (
  <div className="flex items-center space-x-2">
    <img src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Old_Visa_Logo.svg" alt="Visa" className="h-6" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/MasterCard_Logo.svg/2560px-MasterCard_Logo.svg.png" alt="Mastercard" className="h-6" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/American_Express_logo_%282018%29.svg/2560px-American_Express_logo_%282018%29.svg.png" alt="Amex" className="h-6" />
    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/2560px-PayPal.svg.png" alt="PayPal" className="h-5" />
    {/* <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Discover_Card_logo.svg/2560px-Discover_Card_logo.svg.png" alt="Discover" className="h-4" /> */}
  </div>
);

const Footer = () => {
  return (
    <footer className="bg-[var(--base-100)] text-gray-800 border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h2 className="text-3xl font-serif font-bold mb-4">Velvetvibe</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p><span className="font-semibold text-gray-800">Mail:</span> hi.Velvetvibe@example.com</p>
              <p><span className="font-semibold text-gray-800">Phone:</span> 1-333-345-6868</p>
              <p><span className="font-semibold text-gray-800">Address:</span> abcd street, Noida, India</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4 tracking-wider">INFORMATION</h3>
            <ul className="space-y-3">
              {infoLinks.map(link => (
                <li key={link.name}><Link href={link.href} className="text-gray-600 hover:text-black transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4 tracking-wider">QUICK SHOP</h3>
            <ul className="space-y-3">
              {quickShopLinks.map(link => (
                <li key={link.name}><Link href={link.href} className="text-gray-600 hover:text-black transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-800 mb-4 tracking-wider">CUSTOMER SERVICES</h3>
            <ul className="space-y-3">
              {customerServiceLinks.map(link => (
                <li key={link.name}><Link href={link.href} className="text-gray-600 hover:text-black transition-colors">{link.name}</Link></li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4 tracking-wider">NEWSLETTER</h3>
            <p className="text-gray-600 mb-4 text-sm">Sign up for our newsletter and get 10% off your first purchase</p>
            <form className="flex items-center">
              <input type="email" placeholder="Enter your e-mail" className="w-full text-sm bg-white border border-gray-300 rounded-l-md p-3 focus:outline-none focus:ring-1 focus:ring-black" />
              <button type="submit" aria-label="Subscribe to newsletter" className="bg-black text-white p-3 rounded-r-md hover:bg-gray-800 transition-colors">
                <ArrowRight size={20} />
              </button>
            </form>
            <div className="flex items-center space-x-4 mt-6">
              <a href="#" aria-label="Facebook"><Facebook size={20} className="text-gray-600 hover:text-black"/></a>
              <a href="#" aria-label="Instagram"><Instagram size={20} className="text-gray-600 hover:text-black"/></a>
              <a href="#" aria-label="Twitter"><Twitter size={20} className="text-gray-600 hover:text-black"/></a>
              <a href="#" aria-label="Youtube"><Youtube size={20} className="text-gray-600 hover:text-black"/></a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600 gap-4">
            <p className="text-center md:text-left">© {new Date().getFullYear()} Velvetvibe. All Rights Reserved.</p>
            <div className="flex items-center space-x-4">
              {/* <button>English ▼</button>
              <button>USD ▼</button> */}
            </div>
            <div className="flex items-center space-x-2">
              <span>Payment:</span>
              <PaymentIcons />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;