import { Metadata } from "next";
import { createClient } from "@zalldi/auth/server";
import { getGroceryOrders } from "@zalldi/database";
import Link from "next/link";

export const metadata: Metadata = { title: "Picking Queue" };

export default async function PickingPage() {
  const supabase = await createClient();

  const [pending, picking] = await Promise.all([
    getGroceryOrders(supabase, { status: "pending", limit: 20 }).catch(() => ({
      data: [], count: 0, page: 1, limit: 20, has_more: false,
    })),
    getGroceryOrders(supabase, { status: "picking", limit: 20 }).catch(() => ({
      data: [], count: 0, page: 1, limit: 20, has_more: false,
    })),
  ]);

  const allActive = [
    ...picking.data.map((o) => ({ ...o, priority: "in_progress" as const })),
    ...pending.data.map((o) => ({ ...o, priority: "queued" as const })),
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Picking Queue</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {picking.count} in progress · {pending.count} queued
        </p>
      </div>

      {allActive.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 py-20 text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">All clear!</h2>
          <p className="text-gray-500 text-sm">No orders to pick right now.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {allActive.map((order) => {
            const ageMs = Date.now() - new Date(order.created_at).getTime();
            const ageMins = Math.floor(ageMs / 60000);
            const isUrgent = ageMins > 10;

            return (
              <div
                key={order.id}
                className={`bg-white rounded-xl border-2 ${
                  order.priority === "in_progress"
                    ? "border-blue-300"
                    : isUrgent
                    ? "border-red-300"
                    : "border-gray-200"
                } p-5 flex items-center justify-between gap-4`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${
                      order.priority === "in_progress"
                        ? "bg-blue-100"
                        : isUrgent
                        ? "bg-red-100"
                        : "bg-orange-100"
                    }`}
                  >
                    {order.priority === "in_progress" ? "🗂️" : isUrgent ? "🔥" : "📦"}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900 text-lg">
                        #{order.id.slice(-8).toUpperCase()}
                      </span>
                      {order.priority === "in_progress" && (
                        <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                          IN PROGRESS
                        </span>
                      )}
                      {isUrgent && order.priority === "queued" && (
                        <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                          URGENT
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} ·{" "}
                      ₹{order.total.toFixed(0)} · {ageMins}m ago
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {order.items.slice(0, 4).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                        >
                          {item.name} ×{item.quantity}
                        </span>
                      ))}
                      {order.items.length > 4 && (
                        <span className="text-xs text-gray-400">
                          +{order.items.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <Link
                  href={`/picking/${order.id}`}
                  className={`shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors ${
                    order.priority === "in_progress"
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {order.priority === "in_progress" ? "Continue →" : "Start Pick →"}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
