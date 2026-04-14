import { useMemo } from "react";
import { useAdminStats, useAdminOrders, useAdminProducts, useAdminUsers } from "@/hooks/admin/useAdminData";
import { Loader2, TrendingUp, ShoppingBag, Package, Users, DollarSign, AlertTriangle } from "lucide-react";
import { fmt } from "@/lib/formatters";

const chartStyle = { background: "#111a35", borderColor: "#1a2340" };

export default function AnalyticsPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: orders = [], isLoading: ordersLoading } = useAdminOrders();
  const { data: products = [] } = useAdminProducts();
  const { data: users = [] } = useAdminUsers();

  const isLoading = statsLoading || ordersLoading;

  const ordersByStatus = useMemo(() => {
    const map: Record<string, number> = {};
    orders.forEach((o: any) => { map[o.status] = (map[o.status] || 0) + 1; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [orders]);

  const recentOrders = useMemo(() => {
    return orders.slice(0, 10);
  }, [orders]);

  const topSellers = useMemo(() => {
    const map: Record<string, { name: string; total: number; count: number }> = {};
    orders.forEach((o: any) => {
      const id = o.seller_id;
      if (!id) return;
      if (!map[id]) map[id] = { name: o.seller?.full_name || "Unknown", total: 0, count: 0 };
      map[id].total += o.total_amount || 0;
      map[id].count += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [orders]);

  const topBuyers = useMemo(() => {
    const map: Record<string, { name: string; total: number; count: number }> = {};
    orders.forEach((o: any) => {
      const id = o.buyer_id;
      if (!id) return;
      if (!map[id]) map[id] = { name: o.buyer?.full_name || "Unknown", total: 0, count: 0 };
      map[id].total += o.total_amount || 0;
      map[id].count += 1;
    });
    return Object.values(map).sort((a, b) => b.total - a.total).slice(0, 10);
  }, [orders]);

  const avgOrderValue = useMemo(() => {
    if (orders.length === 0) return 0;
    const total = orders.reduce((s: number, o: any) => s + (o.total_amount || 0), 0);
    return total / orders.length;
  }, [orders]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Analytics</h1>

      {/* Key metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { label: "Total Revenue", value: fmt(stats?.totalRevenue || 0), icon: DollarSign, color: "#00b894" },
          { label: "Total Orders", value: String(stats?.totalOrders || 0), icon: ShoppingBag, color: "#74b9ff" },
          { label: "Avg Order Value", value: fmt(Math.round(avgOrderValue)), icon: TrendingUp, color: "#fdcb6e" },
          { label: "Products", value: String(stats?.totalProducts || 0), icon: Package, color: "#00b894" },
          { label: "Users", value: String(stats?.totalUsers || 0), icon: Users, color: "#74b9ff" },
          { label: "Disputes", value: String(stats?.totalDisputes || 0), icon: AlertTriangle, color: "#d63031" },
        ].map(m => (
          <div key={m.label} className="rounded-xl border p-4" style={chartStyle}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-gray-400 font-medium uppercase">{m.label}</span>
              <m.icon className="h-4 w-4" style={{ color: m.color }} />
            </div>
            <p className="text-lg font-bold text-white">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Orders by Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Orders by Status</h3>
          {ordersByStatus.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No order data</p>
          ) : (
            <div className="space-y-3">
              {ordersByStatus.map(([status, count]) => {
                const pct = orders.length > 0 ? (count / orders.length) * 100 : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-300 capitalize">{status.replace("_", " ")}</span>
                      <span className="text-xs text-white font-medium">{count} ({pct.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 rounded-full" style={{ background: "#1a2340" }}>
                      <div className="h-2 rounded-full" style={{ width: `${pct}%`, background: "#00b894" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Recent Orders</h3>
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-2">
              {recentOrders.map((o: any) => (
                <div key={o.id} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#1a234030" }}>
                  <div>
                    <p className="text-xs text-white font-medium">{o.order_number || o.id?.slice(0, 8)}</p>
                    <p className="text-[10px] text-gray-500">{o.buyer?.full_name || "—"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white font-medium">{fmt(o.total_amount || 0)}</p>
                    <p className="text-[10px] text-gray-500 capitalize">{(o.status || "").replace("_", " ")}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Top Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Top Sellers by Volume</h3>
          {topSellers.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No seller data</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                  <th className="text-left pb-2 text-xs text-gray-400">#</th>
                  <th className="text-left pb-2 text-xs text-gray-400">Seller</th>
                  <th className="text-right pb-2 text-xs text-gray-400">Orders</th>
                  <th className="text-right pb-2 text-xs text-gray-400">Volume</th>
                </tr>
              </thead>
              <tbody>
                {topSellers.map((s, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: "#1a234030" }}>
                    <td className="py-2 text-gray-500">{i + 1}</td>
                    <td className="py-2 text-gray-200">{s.name}</td>
                    <td className="py-2 text-right text-gray-300">{s.count}</td>
                    <td className="py-2 text-right text-white font-medium">{fmt(s.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl border p-5" style={chartStyle}>
          <h3 className="text-sm font-semibold text-white mb-4">Top Buyers by Spend</h3>
          {topBuyers.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-8">No buyer data</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                  <th className="text-left pb-2 text-xs text-gray-400">#</th>
                  <th className="text-left pb-2 text-xs text-gray-400">Buyer</th>
                  <th className="text-right pb-2 text-xs text-gray-400">Orders</th>
                  <th className="text-right pb-2 text-xs text-gray-400">Spend</th>
                </tr>
              </thead>
              <tbody>
                {topBuyers.map((b, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: "#1a234030" }}>
                    <td className="py-2 text-gray-500">{i + 1}</td>
                    <td className="py-2 text-gray-200">{b.name}</td>
                    <td className="py-2 text-right text-gray-300">{b.count}</td>
                    <td className="py-2 text-right text-white font-medium">{fmt(b.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
