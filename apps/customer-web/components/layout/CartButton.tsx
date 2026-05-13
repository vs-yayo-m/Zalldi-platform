"use client";

import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

export default function CartButton() {
  const { foodItems, groceryItems } = useCartStore();
  const totalItems = foodItems.reduce((s, i) => s + i.quantity, 0) +
    groceryItems.reduce((s, i) => s + i.quantity, 0);

  return (
    <Link
      href="/food/cart"
      className="relative flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    >
      <span className="text-lg">🛒</span>
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center px-1">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </Link>
  );
}
