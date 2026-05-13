"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { Avatar } from "@zalldi/ui";

const NAV = [
  { href: "/dashboard", icon: "📊", label: "Dashboard" },
  { href: "/orders", icon: "📦", label: "Orders" },
  { href: "/picking", icon: "🗂️", label: "Picking" },
  { href: "/inventory", icon: "📋", label: "Inventory" },
];

export default function DstoreShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-950">
      {/* Sidebar — dark ops theme */}
      <aside className="w-52 flex flex-col bg-gray-900 border-r border-gray-800 shrink-0">
        <div className="flex items-center gap-2 px-4 h-16 border-b border-gray-800">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center shrink-0">
            <span className="text-white font-black text-sm">Z</span>
          </div>
          <div>
            <div className="font-bold text-sm text-white leading-none">Darkstore</div>
            <div className="text-xs text-gray-500">Operations</div>
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
                  active
                    ? "bg-orange-500/20 text-orange-400"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-gray-800 flex items-center gap-2">
          <Avatar name={user.email} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-400 truncate">{user.email}</p>
            <Link href="/logout" className="text-xs text-red-400 hover:text-red-300">
              Sign out
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
