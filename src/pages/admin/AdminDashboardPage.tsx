import { useState, useEffect } from "react";
import { dashboardMetrics } from "@/data/adminMockData";
import { DollarSign, ShoppingBag, AlertTriangle, Users, TrendingUp, UserPlus, RefreshCw, Wallet } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const fmt = (n: number) => "Rs. " + n.toLocaleString("en-PK");
const cards = [
  { label: "GMV Today", value: fmt(dashboardMetrics.totalGMVToday), icon: DollarSign, sub: `This Month: ${fmt(dashboardMetrics.totalGMVMonth)}` },
  { label: "Commission Today", value: fmt(dashboardMetrics.commissionToday), icon: TrendingUp, sub: `This Month: ${fmt(dashboardMetrics.commissionMonth)}` },
  { label: "Settlement Balance", value: fmt(dashboardMetrics.settlementBalance), icon: Wallet, sub: "Current balance" },
  { label: "Active Orders", value: dashboardMetrics.activeOrders.toString(), icon: ShoppingBag, sub: "Right now" },
  { label: "Open Disputes", value: dashboardMetrics.openDisputes.toString(), icon: AlertTriangle, sub: "Needs attention" },
  { label: "Pending Suppliers", value: dashboardMetrics.pendingSupplierApps.toString(), icon: Users, sub: "Awaiting approval" },
  { label: "New Buyers Today", value: dashboardMetrics.newBuyerSignups.toString(), icon: UserPlus, sub: "Signups today" },
  { label: "Repeat Buyer Rate", value: dashboardMetrics.repeatBuyerRate + "%", icon: RefreshCw, sub: "This month" },
];

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string | null;
}

export default function AdminDashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
      if (data) setProfiles(data);
      setLoadingProfiles(false);
    };
    fetchProfiles();
  }, []);

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
            <p className="text-2xl font-bold text-white">{c.value}</p>
            <p className="text-xs text-gray-500 mt-1">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* All Users Section */}
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Users className="h-5 w-5" style={{ color: "#00b894" }} />
        All Users
      </h2>
      <div className="rounded-xl border overflow-hidden" style={{ background: "#111a35", borderColor: "#1a2340" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1a2340" }}>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Full Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Role</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loadingProfiles ? (
                <tr><td colSpan={4} className="text-center py-6 text-gray-500">Loading...</td></tr>
              ) : profiles.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-6 text-gray-500">No users found</td></tr>
              ) : profiles.map(p => (
                <tr key={p.id} className="border-b hover:bg-white/5 transition" style={{ borderColor: "#1a234060" }}>
                  <td className="px-4 py-3 text-white font-medium">{p.full_name || "—"}</td>
                  <td className="px-4 py-3 text-gray-300">{p.email || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded font-semibold capitalize" style={{
                      background: p.role === "admin" ? "#00b89420" : p.role === "seller" ? "#6c5ce720" : "#3b82f620",
                      color: p.role === "admin" ? "#00b894" : p.role === "seller" ? "#6c5ce7" : "#3b82f6"
                    }}>
                      {p.role || "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-400">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
