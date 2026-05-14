import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import type { UserProfile, FoodOrder, GroceryOrder } from "@zalldi/types";
import { Avatar, OrderStatusBadge } from "@zalldi/ui";

interface Props {
  user: User;
  profile: UserProfile | null;
  recentFoodOrders: FoodOrder[];
  recentGroceryOrders: GroceryOrder[];
}

function OrderRow({ id, total, status, createdAt, type }: {
  id: string; total: number; status: string; createdAt: string; type: "food" | "grocery";
}) {
  return (
    <Link
      href={`/${type === "food" ? "food" : "groceries"}/order/${id}`}
      className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{type === "food" ? "🍕" : "🛒"}</span>
        <div>
          <p className="text-sm font-medium text-gray-900">Order #{id.slice(-8).toUpperCase()}</p>
          <p className="text-xs text-gray-500">{new Date(createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <OrderStatusBadge status={status} />
        <span className="text-sm font-semibold text-gray-900">₹{total.toFixed(0)}</span>
        <span className="text-gray-400">›</span>
      </div>
    </Link>
  );
}

export default function AccountDashboard({ user, profile, recentFoodOrders, recentGroceryOrders }: Props) {
  const name = profile?.display_name ?? user.email?.split("@")[0] ?? "User";
  const allOrders = [
    ...recentFoodOrders.map((o) => ({ ...o, type: "food" as const })),
    ...recentGroceryOrders.map((o) => ({ ...o, type: "grocery" as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex items-center gap-4">
        <Avatar name={name} size="lg" />
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900">{name}</h1>
          <p className="text-sm text-gray-500">{user.email}</p>
          {profile?.phone_number && <p className="text-sm text-gray-500">{profile.phone_number}</p>}
        </div>
        <Link href="/account/profile" className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
          Edit Profile
        </Link>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { href: "/account/orders", icon: "📦", label: "My Orders" },
          { href: "/account/addresses", icon: "📍", label: "Addresses" },
          { href: "/account/wishlist", icon: "❤️", label: "Wishlist" },
          { href: "/account/notifications", icon: "🔔", label: "Notifications" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:shadow-md hover:border-orange-300 transition-all group"
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-xs font-medium text-gray-700 group-hover:text-orange-500 transition-colors">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link href="/account/orders" className="text-sm text-orange-500 font-medium hover:underline">
            View all
          </Link>
        </div>

        {allOrders.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-gray-500 text-sm">No orders yet. Start ordering!</p>
            <div className="flex justify-center gap-3 mt-4">
              <Link href="/food" className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600">
                Order Food
              </Link>
              <Link href="/groceries" className="px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600">
                Shop Groceries
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {allOrders.map((order) => (
              <OrderRow
                key={order.id}
                id={order.id}
                total={order.total}
                status={order.status}
                createdAt={order.created_at}
                type={order.type}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
