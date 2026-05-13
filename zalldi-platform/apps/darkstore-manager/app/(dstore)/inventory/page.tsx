import { Metadata } from "next";
import { createClient } from "@zalldi/auth/server";
import { getProducts } from "@zalldi/database";

export const metadata: Metadata = { title: "Inventory" };

export default async function InventoryPage() {
  const supabase = await createClient();

  const [allProducts, lowStock] = await Promise.all([
    getProducts(supabase, { limit: 100 }).catch(() => ({
      data: [], count: 0, page: 1, limit: 100, has_more: false,
    })),
    getProducts(supabase, { limit: 20 }).catch(() => ({
      data: [], count: 0, page: 1, limit: 20, has_more: false,
    })),
  ]);

  const outOfStock = allProducts.data.filter((p) => p.stock_quantity === 0);
  const criticalStock = allProducts.data.filter(
    (p) => p.stock_quantity > 0 && p.stock_quantity <= p.low_stock_threshold
  );
  const healthy = allProducts.data.filter(
    (p) => p.stock_quantity > p.low_stock_threshold
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="text-sm text-gray-500 mt-0.5">{allProducts.count} products tracked</p>
      </div>

      {/* Stock health summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-red-600">{outOfStock.length}</p>
          <p className="text-sm font-medium text-red-700 mt-0.5">Out of Stock</p>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-orange-600">{criticalStock.length}</p>
          <p className="text-sm font-medium text-orange-700 mt-0.5">Low Stock</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <p className="text-3xl font-black text-green-600">{healthy.length}</p>
          <p className="text-sm font-medium text-green-700 mt-0.5">Healthy</p>
        </div>
      </div>

      {/* Out of stock alert */}
      {outOfStock.length > 0 && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="font-semibold text-red-800 mb-2">🚨 Out of Stock</h3>
          <div className="flex flex-wrap gap-2">
            {outOfStock.map((p) => (
              <span key={p.id} className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-medium">
                {p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Full inventory table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">All Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-3 text-left">Product</th>
                <th className="px-6 py-3 text-left">SKU</th>
                <th className="px-6 py-3 text-right">Stock</th>
                <th className="px-6 py-3 text-right">Threshold</th>
                <th className="px-6 py-3 text-left">Health</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allProducts.data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                    No products found
                  </td>
                </tr>
              ) : (
                allProducts.data.map((p) => {
                  const isOut = p.stock_quantity === 0;
                  const isLow = !isOut && p.stock_quantity <= p.low_stock_threshold;
                  return (
                    <tr key={p.id} className={`transition-colors ${isOut ? "bg-red-50 hover:bg-red-100" : isLow ? "bg-orange-50 hover:bg-orange-100" : "hover:bg-gray-50"}`}>
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                            {p.image_urls[0] ? (
                              <img src={p.image_urls[0]} alt={p.name} className="w-full h-full object-contain" />
                            ) : (
                              <span className="text-sm">📦</span>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 line-clamp-1">{p.name}</p>
                            {p.brand && <p className="text-xs text-gray-400">{p.brand}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm font-mono text-gray-500">{p.sku}</td>
                      <td className="px-6 py-3 text-right">
                        <span className={`text-sm font-bold ${isOut ? "text-red-600" : isLow ? "text-orange-600" : "text-gray-900"}`}>
                          {p.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-right text-sm text-gray-500">
                        {p.low_stock_threshold}
                      </td>
                      <td className="px-6 py-3">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          isOut ? "bg-red-100 text-red-700" :
                          isLow ? "bg-orange-100 text-orange-700" :
                          "bg-green-100 text-green-700"
                        }`}>
                          {isOut ? "Out of stock" : isLow ? "Low stock" : "OK"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
