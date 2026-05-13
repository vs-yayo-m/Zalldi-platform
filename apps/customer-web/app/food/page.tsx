import { Metadata } from "next";
import { createClient } from "@zalldi/auth/server";
import { getRestaurants } from "@zalldi/database";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RestaurantGrid from "@/components/food/RestaurantGrid";

export const metadata: Metadata = {
  title: "Food Delivery",
  description: "Order from your favourite restaurants — delivered fast.",
};

export default async function FoodPage() {
  const supabase = await createClient();
  const [{ data: { user } }, restaurantsResult] = await Promise.all([
    supabase.auth.getUser(),
    getRestaurants(supabase, { limit: 20 }).catch(() => ({ data: [], count: 0, page: 1, limit: 20, has_more: false })),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        {/* Food Hero */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-10">
          <div className="container-app">
            <h1 className="text-3xl font-bold mb-1">🍕 Food Delivery</h1>
            <p className="text-orange-100">Hundreds of restaurants, delivered to your door</p>
          </div>
        </div>

        <div className="container-app py-8">
          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {["All", "Pure Veg", "Biryani", "Pizza", "Burger", "Chinese", "Desserts", "Fast Food", "South Indian"].map((filter) => (
              <button
                key={filter}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  filter === "All"
                    ? "bg-orange-500 text-white border-orange-500"
                    : "bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-500"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          <RestaurantGrid restaurants={restaurantsResult.data} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
