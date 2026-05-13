import { Metadata } from "next";
import { createClient } from "@zalldi/auth/server";
import { getFoodOrders, getGroceryOrders, getAllUsers, getProducts } from "@zalldi/database";
import DashboardMetrics from "@/components/dashboard/DashboardMetrics";
import RecentOrders from "@/components/dashboard/RecentOrders";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const supabase = await createClient();

  const [foodOrders, groceryOrders, users, products] = await Promise.all([
    getFoodOrders(supabase, { limit: 5 }).catch(() => ({ data: [], count: 0, page: 1, limit: 5, has_more: false })),
    getGroceryOrders(supabase, { limit: 5 }).catch(() => ({ data: [], count: 0, page: 1, limit: 5, has_more: false })),
    getAllUsers(supabase, { limit: 1 }).catch(() => ({ data: [], count: 0 })),
    getProducts(supabase, { limit: 1 }).catch(() => ({ data: [], count: 0, page: 1, limit: 1, has_more: false })),
  ]);

  const totalRevenue =
    [...foodOrders.data, ...groceryOrders.data]
      .filter((o) => o.payment_status === "paid")
      .reduce((sum, o) => sum + o.total, 0);

  const metrics = {
    totalOrders: foodOrders.count + groceryOrders.count,
    totalRevenue,
    totalUsers: users.count,
    totalProducts: products.count,
    pendingFoodOrders: foodOrders.data.filter((o) => o.status === "pending").length,
    pendingGroceryOrders: groceryOrders.data.filter((o) => o.status === "pending").length,
  };

  const recentOrders = [
    ...foodOrders.data.map((o) => ({ ...o, type: "food" as const })),
    ...groceryOrders.data.map((o) => ({ ...o, type: "grocery" as const })),
  ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Platform overview — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</p>
      </div>

      <DashboardMetrics metrics={metrics} />
      <RecentOrders orders={recentOrders} />
    </div>
  );
}
