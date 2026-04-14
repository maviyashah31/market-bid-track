import { DollarSign, ShoppingBag, AlertTriangle, Users, TrendingUp, UserPlus, Package, Loader2 } from "lucide-react";
import { useAdminStats, useAdminUsers } from "@/hooks/admin/useAdminData";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: allUsers = [], isLoading: usersLoading } = useAdminUsers();

  const cards = [
    { label: "Total Revenue", value: stats ? `PKR ${stats.totalRevenue.toLocaleString()}` : "—", icon: DollarSign, sub: "From delivered orders" },
    { label: "Total Orders", value: stats?.totalOrders.toString() || "0", icon: ShoppingBag, sub: `${stats?.pendingOrders || 0} pending` },
    { label: "Total Products", value: stats?.totalProducts.toString() || "0", icon: Package, sub: "Active listings" },
    { label: "Open Disputes", value: stats?.totalDisputes.toString() || "0", icon: AlertTriangle, sub: "Needs attention" },
    { label: "Total Users", value: stats?.totalUsers.toString() || "0", icon: Users, sub: "Registered users" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="rounded-xl border p-5" style={{ background: "#111a35", borderColor: "#1a2340" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-400 font-medium">{c.label}</span>
              <c.icon className="h-4 w-4" style={{ color: "#00b894" }} />
            </div>
            <p className="text-2xl font-bold text-white">{statsLoading ? "..." : c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Users className="h-5 w-5" style={{ color: "#00b894" }} />
        All Users
      </h2>
      <div className="rounded-xl border overflow-hidden" style={{ background: "#111a35", borderColor: "#1a2340" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #1a2340" }}>
                <th className="text-left p-3 text-gray-400 font-medium">Name</th>
                <th className="text-left p-3 text-gray-400 font-medium">Email</th>
                <th className="text-left p-3 text-gray-400 font-medium">Role</th>
                <th className="text-left p-3 text-gray-400 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {usersLoading && (
                <tr><td colSpan={4} className="p-6 text-center"><Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-500" /></td></tr>
              )}
              {!usersLoading && allUsers.length === 0 && (
                <tr><td colSpan={4} className="p-6 text-center text-gray-500">No users found</td></tr>
              )}
              {allUsers.map((user: any) => (
                <tr key={user.id} style={{ borderBottom: "1px solid #1a2340" }} className="hover:bg-white/5">
                  <td className="p-3 text-white">{user.full_name || "—"}</td>
                  <td className="p-3 text-gray-400">{user.email || "—"}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded text-xs" style={{ background: "#00b89420", color: "#00b894" }}>
                      {user.user_roles?.map((r: any) => r.role).join(", ") || user.role || "—"}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">{user.created_at ? new Date(user.created_at).toLocaleDateString("en-PK") : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
