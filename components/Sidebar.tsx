"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Users,
  Gem,
  MessageSquare,
  TicketPercent,
  Package2,
  MessageCircleCode,
  Mail,
} from "lucide-react";

const navLinks = [
  { href: "/account/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/account/admin/orders", label: "Orders", icon: Package },
  { href: "/account/admin/users", label: "Users", icon: Users },
  { href: "/account/admin/products", label: "Products", icon: Gem },
  { href: "/account/admin/contacts", label: "Contacts", icon: MessageSquare },
  { href: "/account/admin/coupon", label: "Manage Coupon", icon: TicketPercent },
  {href: "/account/admin/notification", label: "Notification", icon: Mail},
  {href: "/account/admin/bulk-order", label: "Bulk Order", icon: Package2},

];

export function Sidebar() {
  const pathname = usePathname();

  return (
    // --- FIX START: Added classes to make the sidebar fixed ---
    <aside className="fixed top-0 left-0 z-40 h-full w-64 flex-shrink-0 bg-white shadow-md">
    {/* --- FIX END --- */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
      </div>
      <nav className="flex flex-col p-4">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`flex items-center rounded-md px-4 py-3 text-gray-700 transition-colors hover:bg-gray-200 ${
                isActive ? "bg-gray-300 font-semibold" : ""
              }`}
            >
              <link.icon className="mr-3 h-5 w-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}