import { Metadata } from "next";
import { createClient } from "@zalldi/auth/server";
import { getGroceryOrders, getProducts } from "@zalldi/database";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DstoreDashboardPage() {
  const supabase = await createClient();

  const [ordersResult, productsResult, pendingOrders, inProgressOrders] = await Promise.all([
    getGroceryOrders(supabase, { limit: 1 }).catch(() => ({ data: [], count: 0, page: 1, limit: 1, has_more: false })),
    getProducts(supabase, { limit: 1 }).catch(() => ({ data: [], count: 0, page: 1, limit: 1, has_more: false })),
    getGroceryOrders(supabase, { status: "pending", limit: 8 }).catch(() => ({ data: [], count: 0, page: 1, limit: 8, has_more: false })),
    getGroceryOrders(supabase, { status: "picking", limit: 8 }).catch(() => ({ data: [], count: 0, page: 1, limit: 8, has_more: false })),
  ]);

  const metrics = [
    { icon: "📦", label: "Total Orders", value: ordersResult.count, color: "text-gray-900", bg: "bg-white" },
    { icon: "⏳", label: "Pending", value: pendingOrders.count, color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
    { icon: "🗂️", label: "Being Picked", value: inProgressOrders.count, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
    { icon: "🏷️", label: "Products", value: productsResult.count, color: "text-gray-900", bg: "bg-white" },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Darkstore Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Live operations —{" "}
          {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`${m.bg ?? "bg-white"} rounded-xl border ${m.border ?? "border-gray-200"} p-5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{m.label}</p>
                <p className={`text-3xl font-black mt-1 ${m.color}`}>{m.value}</p>
              </div>
              <span className="text-2xl">{m.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pending orders queue */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-gray-900">
            Pending Orders
            {pendingOrders.count > 0 && (
              <span className="ml-2 bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {pendingOrders.count}
              </span>
            )}
          </h2>
          <a href="/orders" className="text-sm text-orange-500 hover:underline font-medium">
            View all
          </a>
        </div>
        {pendingOrders.data.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-2">✅</div>
            <p className="text-gray-500 text-sm">No pending orders — you&apos;re caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {pendingOrders.data.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm">📦</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} · ₹{order.total.toFixed(0)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(order.created_at).toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  <a
                    href={`/orders/${order.id}`}
                    className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
                  >
                    Pick Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* In-progress picks */}
      {inProgressOrders.data.length > 0 && (
        <div className="bg-white rounded-xl border border-blue-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-blue-100 bg-blue-50">
            <h2 className="font-semibold text-blue-800">
              🗂️ Currently Being Picked ({inProgressOrders.count})
            </h2>
          </div>
          <div className="divide-y divide-gray-50">
            {inProgressOrders.data.map((order) => (
              <div key={order.id} className="flex items-center justify-between px-6 py-3">
                <p className="text-sm font-mono text-gray-700">#{order.id.slice(-8).toUpperCase()}</p>
                <span className="text-xs bg-blue-100 text-blue-700 font-medium px-2 py-0.5 rounded-full">
                  picking
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
