"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Avatar } from "@zalldi/ui";

const NAV = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/products", icon: "🏷️", label: "Products" },
  { href: "/orders", icon: "📦", label: "Orders" },
  { href: "/inventory", icon: "📋", label: "Inventory" },
  { href: "/analytics", icon: "📈", label: "Analytics" },
];

export default function SellerShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-52 flex flex-col bg-white border-r border-gray-200 shrink-0">
        <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-100">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">Z</span>
          </div>
          <div>
            <div className="font-bold text-sm text-gray-900 leading-none">Seller Hub</div>
            <div className="text-xs text-gray-400">Zalldi</div>
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-100 flex items-center gap-2">
          <Avatar name={user.email} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-700 truncate">{user.email}</p>
            <Link href="/logout" className="text-xs text-red-500 hover:text-red-600">Sign out</Link>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
