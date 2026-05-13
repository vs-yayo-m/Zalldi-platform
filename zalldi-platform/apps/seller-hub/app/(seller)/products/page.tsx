import { Metadata } from "next";
import { createClient } from "@zalldi/auth/server";
import { getProducts } from "@zalldi/database";
import Link from "next/link";

export const metadata: Metadata = { title: "Products" };

export default async function SellerProductsPage() {
  const supabase = await createClient();
  const products = await getProducts(supabase, { limit: 50 })
    .catch(() => ({ data: [], count: 0, page: 1, limit: 50, has_more: false }));

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">{products.count} products listed</p>
        </div>
        <Link href="/products/new" className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-colors">
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
              <th className="px-6 py-3 text-left">Product</th>
              <th className="px-6 py-3 text-left">SKU</th>
              <th className="px-6 py-3 text-left">Price / MRP</th>
              <th className="px-6 py-3 text-left">Stock</th>
              <th className="px-6 py-3 text-left">Approval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.data.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                  No products yet.{" "}
                  <Link href="/products/new" className="text-orange-500 underline">Add your first product</Link>
                </td>
              </tr>
            ) : products.data.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      {p.image_urls[0] ? (
                        <img src={p.image_urls[0]} alt={p.name} className="w-full h-full object-contain rounded-lg" />
                      ) : <span>📦</span>}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                      {p.brand && <p className="text-xs text-gray-500">{p.brand}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3 text-sm font-mono text-gray-500">{p.sku}</td>
                <td className="px-6 py-3 text-sm">
                  <span className="font-semibold text-gray-900">₹{p.price}</span>
                  {p.mrp > p.price && <span className="text-gray-400 line-through ml-1 text-xs">₹{p.mrp}</span>}
                </td>
                <td className="px-6 py-3">
                  <span className={`text-sm font-medium ${p.stock_quantity <= p.low_stock_threshold ? "text-red-600" : "text-gray-700"}`}>
                    {p.stock_quantity}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.is_approved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {p.is_approved ? "Approved" : "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
