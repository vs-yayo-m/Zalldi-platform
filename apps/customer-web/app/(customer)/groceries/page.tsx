import { Metadata } from "next";
import { createClient } from "@zalldi/auth/server";
import { getCategories } from "@zalldi/database";
import { getProducts } from "@zalldi/database";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryScroll from "@/components/groceries/CategoryScroll";
import ProductGrid from "@/components/groceries/ProductGrid";

export const metadata: Metadata = {
  title: "Groceries",
  description: "Fresh groceries delivered in minutes.",
};

export default async function GroceriesPage() {
  const supabase = await createClient();
  const [{ data: { user } }, categories, productsResult] = await Promise.all([
    supabase.auth.getUser(),
    getCategories(supabase, { parent_id: null }).catch(() => []),
    getProducts(supabase, { limit: 24 }).catch(() => ({ data: [], count: 0, page: 1, limit: 24, has_more: false })),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <main className="flex-1">
        {/* Groceries Hero */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-10">
          <div className="container-app">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full animate-pulse" />
                10-20 min delivery
              </span>
            </div>
            <h1 className="text-3xl font-bold mb-1">🛒 Grocery Delivery</h1>
            <p className="text-green-100">Fresh produce, dairy, snacks & essentials — at your door</p>
          </div>
        </div>

        <div className="container-app py-8">
          {categories.length > 0 && <CategoryScroll categories={categories} />}
          <ProductGrid products={productsResult.data} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
