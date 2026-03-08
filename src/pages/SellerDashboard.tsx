import Navbar from "@/components/Navbar";
import { Package, DollarSign, TrendingUp, ShoppingCart, FileText, MessageSquare, Star, Wallet, BarChart3, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const stats = [
  { icon: DollarSign, label: "Revenue", value: "PKR 2.45M", change: "+12.5%", up: true },
  { icon: ShoppingCart, label: "Orders", value: "156", change: "+8.2%", up: true },
  { icon: Package, label: "Products", value: "45", change: "+3", up: true },
  { icon: Star, label: "Rating", value: "4.8/5", change: "+0.2", up: true },
];

const recentOrders = [
  { id: "ORD-5001", product: "Cotton T-Shirts x500", buyer: "Metro Wholesale", total: "PKR 175,000", status: "pending" },
  { id: "ORD-5002", product: "Polo Shirts x200", buyer: "Style Hub", total: "PKR 96,000", status: "processing" },
  { id: "ORD-5003", product: "Denim Jeans x300", buyer: "Fashion Point", total: "PKR 285,000", status: "shipped" },
  { id: "ORD-5004", product: "Cotton Fabric 1000m", buyer: "AL Textiles", total: "PKR 450,000", status: "delivered" },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning",
  processing: "bg-verified/10 text-verified",
  shipped: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
};

const sidebarItems = [
  { icon: BarChart3, label: "Overview", active: true },
  { icon: Package, label: "Products" },
  { icon: ShoppingCart, label: "Orders" },
  { icon: FileText, label: "RFQ Bids" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Star, label: "Reviews" },
  { icon: Wallet, label: "Wallet" },
];

const SellerDashboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="flex">
      {/* Sidebar */}
      <aside className="hidden lg:block w-64 border-r border-border bg-card min-h-[calc(100vh-120px)] p-4">
        <div className="space-y-1">
          {sidebarItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body transition ${
                active ? "bg-accent text-accent-foreground font-semibold" : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground">Seller Dashboard</h1>
          <p className="text-muted-foreground font-body mt-1">Lahore Textile Mills • Verified Seller ✅</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, change, up }) => (
            <div key={label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-accent">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-success" : "text-destructive"}`}>
                  {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {change}
                </span>
              </div>
              <div className="font-display font-bold text-xl text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground font-body">{label}</div>
            </div>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-foreground">Recent Orders</h2>
            <Button variant="outline" size="sm" className="font-body">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Order ID</th>
                  <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Product</th>
                  <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Buyer</th>
                  <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Total</th>
                  <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                    <td className="py-3 px-2 font-body font-medium text-foreground">{order.id}</td>
                    <td className="py-3 px-2 font-body text-foreground">{order.product}</td>
                    <td className="py-3 px-2 font-body text-muted-foreground">{order.buyer}</td>
                    <td className="py-3 px-2 font-display font-semibold text-foreground">{order.total}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
);

export default SellerDashboard;
