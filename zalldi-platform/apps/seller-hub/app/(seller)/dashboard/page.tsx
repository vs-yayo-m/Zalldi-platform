import { Metadata } from "next";
import { createClient } from "@zalldi/auth/server";
import { getProducts, getGroceryOrders } from "@zalldi/database";

export const metadata: Metadata = { title: "Dashboard" };

export default async function SellerDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [products, orders] = await Promise.all([
    getProducts(supabase, { limit: 5 }).catch(() => ({ data: [], count: 0, page: 1, limit: 5, has_more: false })),
    getGroceryOrders(supabase, { limit: 5 }).catch(() => ({ data: [], count: 0, page: 1, limit: 5, has_more: false })),
  ]);

  const revenue = orders.data
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  const lowStock = products.data.filter((p) => p.stock_quantity <= p.low_stock_threshold);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back 👋</h1>
        <p className="text-sm text-gray-500 mt-0.5">Here's your store overview</p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: "📦", label: "Total Orders", value: orders.count.toString(), color: "text-gray-900" },
          { icon: "💰", label: "Revenue", value: `₹${revenue.toFixed(0)}`, color: "text-green-600" },
          { icon: "🏷️", label: "Products", value: products.count.toString(), color: "text-blue-600" },
          { icon: "⚠️", label: "Low Stock", value: lowStock.length.toString(), color: lowStock.length > 0 ? "text-red-600" : "text-gray-400" },
        ].map((m) => (
          <div key={m.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{m.label}</p>
                <p className={`text-2xl font-black mt-1 ${m.color}`}>{m.value}</p>
              </div>
              <span className="text-2xl">{m.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Low stock alert */}
      {lowStock.length > 0 && (
        <div className="mb-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h3 className="font-semibold text-orange-800 text-sm mb-2">⚠️ Low Stock Alert</h3>
          <div className="flex flex-wrap gap-2">
            {lowStock.map((p) => (
              <span key={p.id} className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-medium">
                {p.name} ({p.stock_quantity} left)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Recent Orders</h2>
        </div>
        {orders.data.length === 0 ? (
          <div className="py-12 text-center text-gray-400 text-sm">No orders yet</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left">Order</th>
                <th className="px-6 py-3 text-left">Total</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.data.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-mono text-gray-700">#{o.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900">₹{o.total.toFixed(0)}</td>
                  <td className="px-6 py-3">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">{o.status}</span>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500">{new Date(o.created_at).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
