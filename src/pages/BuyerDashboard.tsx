import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { buyerOrders } from "@/data/mockData";
import { Package, FileText, MessageSquare, Star, Heart, ShoppingCart, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
  placed: "bg-muted text-muted-foreground",
  confirmed: "bg-verified/10 text-verified",
  processing: "bg-warning/10 text-warning",
  packed: "bg-accent text-accent-foreground",
  shipped: "bg-verified/10 text-verified",
  in_transit: "bg-primary/10 text-primary",
  delivered: "bg-success/10 text-success",
  completed: "bg-success/10 text-success",
};

const quickLinks = [
  { icon: Package, label: "My Orders", count: 3, href: "#" },
  { icon: FileText, label: "My RFQs", count: 2, href: "#" },
  { icon: MessageSquare, label: "Messages", count: 5, href: "#" },
  { icon: Star, label: "Reviews", count: 8, href: "#" },
  { icon: Heart, label: "Wishlist", count: 12, href: "#" },
  { icon: ShoppingCart, label: "Cart", count: 3, href: "/cart" },
];

const BuyerDashboard = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-3xl text-foreground">Buyer Dashboard</h1>
        <p className="text-muted-foreground font-body mt-1">Welcome back, Muhammad Ahmed!</p>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {quickLinks.map(({ icon: Icon, label, count, href }) => (
          <Link
            key={label}
            to={href}
            className="bg-card rounded-xl border border-border p-4 flex flex-col items-center gap-2 hover:border-primary hover:shadow-md transition-all"
          >
            <Icon className="h-6 w-6 text-primary" />
            <span className="font-display font-semibold text-sm text-foreground">{label}</span>
            <Badge variant="secondary" className="font-body">{count}</Badge>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-card rounded-xl border border-border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-foreground">Recent Orders</h2>
          <Button variant="outline" size="sm" className="gap-1 font-body">View All <ArrowRight className="h-4 w-4" /></Button>
        </div>
        <div className="space-y-4">
          {buyerOrders.map((order) => (
            <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/50 transition">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-display font-bold text-sm text-foreground">{order.id}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>
                <p className="font-body text-sm text-foreground">{order.productName}</p>
                <p className="text-xs text-muted-foreground font-body">{order.sellerName} • Qty: {order.quantity}</p>
              </div>
              <div className="mt-2 sm:mt-0 text-right">
                <div className="font-display font-bold text-foreground">PKR {order.total.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground font-body justify-end">
                  <Clock className="h-3 w-3" /> {order.date}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default BuyerDashboard;
