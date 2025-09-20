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
  X, // Import the close icon
  LogOut,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
    { href: "/account/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/account/admin/orders", label: "Orders", icon: Package },
    { href: "/account/admin/users", label: "Users", icon: Users },
    { href: "/account/admin/products", label: "Products", icon: Gem },
    { href: "/account/admin/contacts", label: "Contacts", icon: MessageSquare },
    { href: "/account/admin/coupon", label: "Manage Coupon", icon: TicketPercent },
    { href: "/account/admin/setting", label: "Settings", icon: Percent },
    { href: "/logout", label: "Logout", icon: LogOut },
];

// Define props to control the sidebar's state from the parent layout
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    // The sidebar's visibility is controlled by transform classes.
    // On 'lg' screens and larger, it is always visible.
    <aside
      className={`fixed top-0 left-0 z-40 h-full w-64 bg-white shadow-md transition-transform duration-300 ease-in-out 
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0`}
    >
      <div className="flex items-center justify-between p-6">
        <h1 className="text-2xl font-bold text-gray-800">Admin Panel</h1>
        {/* Close button for mobile, hidden on large screens */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </Button>
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
              onClick={onClose} // Close sidebar on link click in mobile view
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