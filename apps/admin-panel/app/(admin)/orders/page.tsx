import { Metadata } from "next";
import { createClient } from "@zalldi/auth/server";
import { getFoodOrders, getGroceryOrders } from "@zalldi/database";
import { OrderStatusBadge } from "@zalldi/ui";

export const metadata: Metadata = { title: "Orders" };

export default async function OrdersPage() {
  const supabase = await createClient();

  const [foodOrders, groceryOrders] = await Promise.all([
    getFoodOrders(supabase, { limit: 50 }).catch(() => ({ data: [], count: 0, page: 1, limit: 50, has_more: false })),
    getGroceryOrders(supabase, { limit: 50 }).catch(() => ({ data: [], count: 0, page: 1, limit: 50, has_more: false })),
  ]);

  const allOrders = [
    ...foodOrders.data.map((o) => ({ ...o, type: "food" as const })),
    ...groceryOrders.data.map((o) => ({ ...o, type: "grocery" as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500 mt-0.5">{allOrders.length} total orders</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Payment</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No orders found</td>
                </tr>
              ) : allOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-mono text-gray-700">#{order.id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.type === "food" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                      {order.type === "food" ? "🍕 Food" : "🛒 Grocery"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900">₹{order.total.toFixed(0)}</td>
                  <td className="px-6 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.payment_status === "paid" ? "bg-green-100 text-green-700" :
                      order.payment_status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>{order.payment_status}</span>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
