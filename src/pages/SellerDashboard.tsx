import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { products, rfqs, disputes, disputeReasons, type Dispute } from "@/data/mockData";
import {
  Package, DollarSign, TrendingUp, ShoppingCart, FileText, MessageSquare,
  Star, Wallet, BarChart3, ArrowUpRight, ArrowDownRight, Plus, Eye, Edit, Trash2,
  AlertTriangle, Send
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedPage from "@/components/AnimatedPage";

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

const reviews = [
  { id: "1", buyer: "Muhammad Ahmed", product: "Cotton T-Shirts", rating: 5, comment: "Excellent quality! Will order again.", date: "2026-03-05" },
  { id: "2", buyer: "Sara Khan", product: "Polo Shirts", rating: 4, comment: "Good quality but delivery was slightly delayed.", date: "2026-03-03" },
  { id: "3", buyer: "Ali Hassan", product: "Denim Jeans", rating: 5, comment: "Perfect stitching and material.", date: "2026-02-28" },
];

const walletTransactions = [
  { id: "T1", type: "credit", desc: "Order ORD-5004 payment", amount: "+PKR 450,000", date: "2026-03-04" },
  { id: "T2", type: "debit", desc: "Platform commission", amount: "-PKR 45,000", date: "2026-03-04" },
  { id: "T3", type: "credit", desc: "Order ORD-5003 payment", amount: "+PKR 285,000", date: "2026-03-02" },
  { id: "T4", type: "debit", desc: "Withdrawal to bank", amount: "-PKR 500,000", date: "2026-03-01" },
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [responseText, setResponseText] = useState("");
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);

  const sellerDisputes = disputes.filter(d => d.sellerName === "Lahore Textile Mills");
  const activeDisputeCount = sellerDisputes.filter(d => d.status !== "resolved" && d.status !== "closed").length;

  const disputeStatusColors: Record<string, string> = {
    open: "bg-destructive/10 text-destructive",
    negotiating: "bg-warning/10 text-warning",
    escalated: "bg-destructive/10 text-destructive",
    resolved: "bg-success/10 text-success",
    closed: "bg-muted text-muted-foreground",
  };

  const getReasonLabel = (reason: string) => disputeReasons.find(r => r.value === reason)?.label || reason;

  const handleRespond = () => {
    if (!responseText.trim()) return;
    setResponseText("");
    setRespondDialogOpen(false);
    setSelectedDispute(null);
  };

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground">Seller Dashboard</h1>
          <p className="text-muted-foreground font-body mt-1">Lahore Textile Mills • Verified Seller ✅</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="gap-1.5 font-display"><BarChart3 className="h-4 w-4" /> Overview</TabsTrigger>
            <TabsTrigger value="products" className="gap-1.5 font-display"><Package className="h-4 w-4" /> Products</TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5 font-display"><ShoppingCart className="h-4 w-4" /> Orders</TabsTrigger>
            <TabsTrigger value="rfqs" className="gap-1.5 font-display"><FileText className="h-4 w-4" /> RFQ Bids</TabsTrigger>
            <TabsTrigger value="messages" className="gap-1.5 font-display"><MessageSquare className="h-4 w-4" /> Messages</TabsTrigger>
            <TabsTrigger value="disputes" className="gap-1.5 font-display relative">
              <AlertTriangle className="h-4 w-4" /> Disputes
              {activeDisputeCount > 0 && (
                <span className="ml-1 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">{activeDisputeCount}</span>
              )}
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-1.5 font-display"><Star className="h-4 w-4" /> Reviews</TabsTrigger>
            <TabsTrigger value="wallet" className="gap-1.5 font-display"><Wallet className="h-4 w-4" /> Wallet</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map(({ icon: Icon, label, value, change, up }) => (
                <div key={label} className="bg-card rounded-xl border border-border p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-accent"><Icon className="h-5 w-5 text-primary" /></div>
                    <span className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-success" : "text-destructive"}`}>
                      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{change}
                    </span>
                  </div>
                  <div className="font-display font-bold text-xl text-foreground">{value}</div>
                  <div className="text-xs text-muted-foreground font-body">{label}</div>
                </div>
              ))}
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-foreground">Recent Orders</h2>
                <Button variant="outline" size="sm" className="font-body" onClick={() => setActiveTab("orders")}>View All</Button>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Products */}
          <TabsContent value="products">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-foreground">My Products</h2>
                <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2 font-body"><Plus className="h-4 w-4" /> Add Product</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.filter(p => p.sellerName === "Lahore Textile Mills" || p.sellerName === "Faisalabad Fabric House").map((product) => (
                  <div key={product.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                    <h3 className="font-display font-semibold text-sm text-foreground">{product.name}</h3>
                    <p className="text-primary font-display font-bold text-sm mt-1">PKR {product.minPrice} - {product.maxPrice}</p>
                    <p className="text-xs text-muted-foreground font-body">MOQ: {product.moq} {product.unit}</p>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="flex-1 gap-1 font-body"><Eye className="h-3 w-3" /> View</Button>
                      <Button variant="outline" size="sm" className="flex-1 gap-1 font-body"><Edit className="h-3 w-3" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive"><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-6">All Orders</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Order ID</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Product</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Buyer</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Actions</th>
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
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${statusColors[order.status]}`}>{order.status}</span>
                        </td>
                        <td className="py-3 px-2">
                          <Button variant="outline" size="sm" className="font-body text-xs">Update Status</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* RFQ Bids */}
          <TabsContent value="rfqs">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-6">Active RFQs</h2>
              <div className="space-y-4">
                {rfqs.map((rfq) => (
                  <div key={rfq.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                      <div>
                        <Badge variant="secondary" className="mb-2 font-body">{rfq.category}</Badge>
                        <h3 className="font-display font-semibold text-foreground">{rfq.title}</h3>
                        <p className="text-sm text-muted-foreground font-body mt-1">
                          Qty: {rfq.quantity.toLocaleString()} {rfq.unit} • Budget: {rfq.budget} • {rfq.deadline} left
                        </p>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">Submit Bid</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Messages */}
          <TabsContent value="messages">
            <div className="bg-card rounded-xl border border-border p-6 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <h2 className="font-display font-bold text-xl text-foreground mb-2">Messages</h2>
              <p className="text-muted-foreground font-body mb-4">View and manage your buyer conversations</p>
              <Link to="/messages">
                <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">Open Messages</Button>
              </Link>
            </div>
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-6">Customer Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-display font-semibold text-foreground">{review.buyer}</span>
                        <span className="text-xs text-muted-foreground font-body ml-2">on {review.product}</span>
                      </div>
                      <span className="text-xs text-muted-foreground font-body">{review.date}</span>
                    </div>
                    <div className="flex gap-0.5 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground font-body">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Wallet */}
          <TabsContent value="wallet">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground font-body mb-1">Available Balance</p>
                <p className="font-display font-bold text-2xl text-primary">PKR 1,245,000</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground font-body mb-1">Pending</p>
                <p className="font-display font-bold text-2xl text-warning">PKR 285,000</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground font-body mb-1">Total Earned</p>
                <p className="font-display font-bold text-2xl text-success">PKR 2,450,000</p>
              </div>
            </div>
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-foreground">Recent Transactions</h2>
                <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">Withdraw</Button>
              </div>
              <div className="space-y-3">
                {walletTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                    <div>
                      <p className="font-body text-sm text-foreground">{tx.desc}</p>
                      <p className="text-xs text-muted-foreground font-body">{tx.date}</p>
                    </div>
                    <span className={`font-display font-bold ${tx.type === "credit" ? "text-success" : "text-destructive"}`}>
                      {tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </AnimatedPage>
  );
};

export default SellerDashboard;