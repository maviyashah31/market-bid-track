import { dashboardMetrics } from "@/data/adminMockData";
import { DollarSign, ShoppingBag, AlertTriangle, Users, TrendingUp, UserPlus, RefreshCw, Wallet } from "lucide-react";

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

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
