"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { User } from "@supabase/supabase-js";
import { Avatar } from "@zalldi/ui";

const NAV_ITEMS = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/orders", icon: "📦", label: "Orders" },
  { href: "/products", icon: "🏷️", label: "Products" },
  { href: "/sellers", icon: "🏪", label: "Sellers" },
  { href: "/darkstores", icon: "🏭", label: "Darkstores" },
  { href: "/customers", icon: "👥", label: "Customers" },
  { href: "/analytics", icon: "📈", label: "Analytics" },
];

export default function AdminShell({ children, user }: { children: React.ReactNode; user: User }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${collapsed ? "w-16" : "w-56"} flex flex-col bg-gray-900 transition-all duration-200 shrink-0`}>
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-800">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">Z</span>
          </div>
          {!collapsed && (
            <div>
              <div className="text-white font-bold text-sm leading-none">Zalldi</div>
              <div className="text-gray-400 text-xs">Admin</div>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto text-gray-500 hover:text-gray-300 text-xs"
          >
            {collapsed ? "›" : "‹"}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2 flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={`admin-sidebar-item ${
                  active
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className={`p-3 border-t border-gray-800 flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
          <Avatar name={user.email} size="sm" />
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-300 truncate">{user.email}</p>
              <Link href="/logout" className="text-xs text-red-400 hover:text-red-300">Sign out</Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto flex flex-col">
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}
