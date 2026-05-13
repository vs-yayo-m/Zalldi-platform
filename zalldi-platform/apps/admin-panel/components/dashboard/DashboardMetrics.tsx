interface Metrics {
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalProducts: number;
  pendingFoodOrders: number;
  pendingGroceryOrders: number;
}

function MetricCard({ icon, label, value, sub, color }: {
  icon: string; label: string; value: string; sub?: string; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

export default function DashboardMetrics({ metrics }: { metrics: Metrics }) {
  const pendingTotal = metrics.pendingFoodOrders + metrics.pendingGroceryOrders;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <MetricCard
        icon="📦"
        label="Total Orders"
        value={metrics.totalOrders.toLocaleString()}
        sub={pendingTotal > 0 ? `${pendingTotal} pending` : "All fulfilled"}
        color="text-gray-900"
      />
      <MetricCard
        icon="💰"
        label="Total Revenue"
        value={`₹${(metrics.totalRevenue / 100).toLocaleString("en-IN", { minimumFractionDigits: 0 })}`}
        sub="Paid orders only"
        color="text-green-600"
      />
      <MetricCard
        icon="👥"
        label="Total Users"
        value={metrics.totalUsers.toLocaleString()}
        color="text-blue-600"
      />
      <MetricCard
        icon="🏷️"
        label="Products"
        value={metrics.totalProducts.toLocaleString()}
        sub="Across all darkstores"
        color="text-purple-600"
      />
    </div>
  );
}
