import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@zalldi/auth/server";
import { getUserProfile, getFoodOrders, getGroceryOrders } from "@zalldi/database";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AccountDashboard from "@/components/account/AccountDashboard";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/account");

  const [profile, recentFoodOrders, recentGroceryOrders] = await Promise.all([
    getUserProfile(supabase, user.id),
    getFoodOrders(supabase, { customer_id: user.id, limit: 5 }).catch(() => ({ data: [], count: 0, page: 1, limit: 5, has_more: false })),
    getGroceryOrders(supabase, { customer_id: user.id, limit: 5 }).catch(() => ({ data: [], count: 0, page: 1, limit: 5, has_more: false })),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1 container-app py-8">
        <AccountDashboard
          user={user}
          profile={profile}
          recentFoodOrders={recentFoodOrders.data}
          recentGroceryOrders={recentGroceryOrders.data}
        />
      </main>
      <Footer />
    </div>
  );
}
