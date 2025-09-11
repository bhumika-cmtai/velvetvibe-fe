// src/components/Header.tsx
import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[var(--accent-primary)] text-white text-xs py-2">
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Left Side */}
        <div className="flex items-center space-x-4">
          {/* <span>English ▼</span>
          <span>USD ▼</span> */}
        </div>
        {/* Center */}
        <div>
          <span>NEW CUSTOMERS SAVE 10% WITH THE CODE GET10</span>
        </div>
        {/* Right Side */}
        <div className="flex items-center space-x-4">
          <a href="#" aria-label="Facebook" className="hover:opacity-75"><Facebook size={16} /></a>
          <a href="#" aria-label="Instagram" className="hover:opacity-75"><Instagram size={16} /></a>
          <a href="#" aria-label="Twitter" className="hover:opacity-75"><Twitter size={16} /></a>
          {/* <a href="#" aria-label="Pinterest" className="hover:opacity-75"><Pinterest size={16} /></a> */}
        </div>
      </div>
    </header>
  );
};

export default Header;