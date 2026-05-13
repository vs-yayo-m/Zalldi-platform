import { OrderStatusBadge } from "@zalldi/ui";

interface Order {
  id: string;
  customer_id: string;
  total: number;
  status: string;
  payment_status: string;
  created_at: string;
  type: "food" | "grocery";
}

export default function RecentOrders({ orders }: { orders: Order[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Recent Orders</h2>
        <div className="flex gap-2">
          <a href="/orders" className="text-sm text-orange-500 hover:underline font-medium">View all</a>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="py-12 text-center text-gray-400 text-sm">No orders yet</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left">Order ID</th>
                <th className="px-6 py-3 text-left">Type</th>
                <th className="px-6 py-3 text-left">Customer</th>
                <th className="px-6 py-3 text-left">Amount</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Payment</th>
                <th className="px-6 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-mono text-gray-700">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${order.type === "food" ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                      {order.type === "food" ? "🍕 Food" : "🛒 Grocery"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600 font-mono">{order.customer_id.slice(-8)}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900">₹{order.total.toFixed(0)}</td>
                  <td className="px-6 py-3"><OrderStatusBadge status={order.status} /></td>
                  <td className="px-6 py-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                      order.payment_status === "paid" ? "bg-green-100 text-green-700" :
                      order.payment_status === "failed" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs text-gray-500">
                    {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
