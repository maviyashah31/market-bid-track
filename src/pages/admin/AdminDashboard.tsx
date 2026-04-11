import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { adminUsers, adminProducts, disputes, disputeReasons } from "@/data/mockData";
import {
  Users, Package, ShoppingCart, TrendingUp, Shield, AlertTriangle,
  CheckCircle2, XCircle, Clock, BarChart3, Eye, Ban, ArrowUpRight,
  Gavel, MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import AnimatedPage from "@/components/AnimatedPage";

const stats = [
  { icon: Users, label: "Total Users", value: "8,542", change: "+245", color: "text-primary" },
  { icon: Package, label: "Products", value: "12,890", change: "+89", color: "text-verified" },
  { icon: ShoppingCart, label: "Orders", value: "3,456", change: "+156", color: "text-warning" },
  { icon: TrendingUp, label: "Revenue", value: "PKR 45.2M", change: "+12.5%", color: "text-success" },
];

const userStatusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  suspended: "bg-destructive/10 text-destructive",
  pending: "bg-warning/10 text-warning",
};

const productStatusColors: Record<string, string> = {
  active: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  rejected: "bg-destructive/10 text-destructive",
};

const disputeStatusColors: Record<string, string> = {
  open: "bg-warning/10 text-warning",
  negotiating: "bg-primary/10 text-primary",
  escalated: "bg-destructive/10 text-destructive",
  resolved: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
};

const recentOrders = [
  { id: "ORD-7001", buyer: "Muhammad Ahmed", seller: "Lahore Textile Mills", total: "PKR 175,000", status: "processing", date: "2026-03-07" },
  { id: "ORD-7002", buyer: "Sara Khan", seller: "Punjab Agro Exports", total: "PKR 320,000", status: "delivered", date: "2026-03-06" },
  { id: "ORD-7003", buyer: "Ali Hassan", seller: "Sialkot Sports Co.", total: "PKR 85,000", status: "disputed", date: "2026-03-05" },
  { id: "ORD-7004", buyer: "Zain Malik", seller: "Faisalabad Fabric House", total: "PKR 450,000", status: "shipped", date: "2026-03-04" },
];

const orderStatusColors: Record<string, string> = {
  processing: "bg-warning/10 text-warning",
  delivered: "bg-success/10 text-success",
  disputed: "bg-destructive/10 text-destructive",
  shipped: "bg-primary/10 text-primary",
};

const AdminDashboard = () => {
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedDispute, setSelectedDispute] = useState<typeof disputes[0] | null>(null);
  const [showResolveDialog, setShowResolveDialog] = useState(false);
  const [resolution, setResolution] = useState("");
  const [resolutionType, setResolutionType] = useState<string>("");
  const filteredUsers = adminUsers.filter(
    (u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = adminProducts.filter(
    (p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.seller.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filter escalated or open disputes for admin attention
  const adminDisputes = disputes.filter(d => d.status === "escalated" || d.status === "negotiating" || d.status === "open");

  const handleResolveDispute = () => {
    if (!resolutionType || !resolution.trim()) {
      toast.error("Missing Information", { description: "Please select a resolution type and provide details." });
      return;
    }

    toast.success("Dispute Resolved", { description: `Dispute ${selectedDispute?.id} has been resolved with ${resolutionType}.` });

    setShowResolveDialog(false);
    setSelectedDispute(null);
    setResolution("");
    setResolutionType("");
  };

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground font-body mt-1">Bulkur Platform Management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map(({ icon: Icon, label, value, change, color }) => (
            <div key={label} className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="p-2 rounded-lg bg-accent">
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <span className="flex items-center gap-0.5 text-xs font-semibold text-success">
                  <ArrowUpRight className="h-3 w-3" />{change}
                </span>
              </div>
              <div className="font-display font-bold text-xl text-foreground">{value}</div>
              <div className="text-xs text-muted-foreground font-body">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="bg-card border border-border flex-nowrap h-auto gap-1 w-max sm:w-full">
              <TabsTrigger value="users" className="gap-1.5 font-display text-xs sm:text-sm"><Users className="h-4 w-4" /> Users</TabsTrigger>
              <TabsTrigger value="products" className="gap-1.5 font-display text-xs sm:text-sm"><Package className="h-4 w-4" /> Products</TabsTrigger>
              <TabsTrigger value="orders" className="gap-1.5 font-display text-xs sm:text-sm"><ShoppingCart className="h-4 w-4" /> Orders</TabsTrigger>
              <TabsTrigger value="disputes" className="gap-1.5 font-display text-xs sm:text-sm">
                <Gavel className="h-4 w-4" /> Disputes
                {adminDisputes.length > 0 && (
                  <Badge className="ml-1 bg-destructive text-destructive-foreground h-5 w-5 p-0 flex items-center justify-center text-xs">
                    {adminDisputes.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-1.5 font-display text-xs sm:text-sm"><BarChart3 className="h-4 w-4" /> Analytics</TabsTrigger>
            </TabsList>
          </div>

          {/* Users */}
          <TabsContent value="users">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <h2 className="font-display font-bold text-xl text-foreground">User Management</h2>
                <Input placeholder="Search users..." value={userSearch} onChange={(e) => setUserSearch(e.target.value)} className="w-full sm:w-64 font-body" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Name</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Email</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Role</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Orders</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                        <td className="py-3 px-2 font-body font-medium text-foreground">{user.name}</td>
                        <td className="py-3 px-2 font-body text-muted-foreground">{user.email}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline" className="capitalize font-body">{user.role}</Badge>
                        </td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${userStatusColors[user.status]}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-body text-foreground">{user.orders}</td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><Ban className="h-3.5 w-3.5" /></Button>
                          </div>
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
                <h2 className="font-display font-bold text-xl text-foreground">Product Moderation</h2>
                <Input placeholder="Search products..." value={productSearch} onChange={(e) => setProductSearch(e.target.value)} className="w-full sm:w-64 font-body" />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Product</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Seller</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Price</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                        <td className="py-3 px-2 font-body font-medium text-foreground">{product.name}</td>
                        <td className="py-3 px-2 font-body text-muted-foreground">{product.seller}</td>
                        <td className="py-3 px-2 font-body text-muted-foreground">{product.category}</td>
                        <td className="py-3 px-2 font-display font-semibold text-foreground">{product.price}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${productStatusColors[product.status]}`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            {product.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-success"><CheckCircle2 className="h-3.5 w-3.5" /></Button>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive"><XCircle className="h-3.5 w-3.5" /></Button>
                              </>
                            )}
                            <Button variant="ghost" size="icon" className="h-7 w-7"><Eye className="h-3.5 w-3.5" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-6">Order Oversight</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Order ID</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Buyer</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Seller</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Total</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                        <td className="py-3 px-2 font-body font-medium text-foreground">{order.id}</td>
                        <td className="py-3 px-2 font-body text-foreground">{order.buyer}</td>
                        <td className="py-3 px-2 font-body text-muted-foreground">{order.seller}</td>
                        <td className="py-3 px-2 font-display font-semibold text-foreground">{order.total}</td>
                        <td className="py-3 px-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${orderStatusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-2 font-body text-muted-foreground">{order.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          {/* Disputes */}
          <TabsContent value="disputes">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">Dispute Management</h2>
                  <p className="text-sm text-muted-foreground font-body mt-1">
                    Review and resolve escalated disputes between buyers and sellers
                  </p>
                </div>
                <Badge variant="outline" className="gap-1 font-body">
                  <AlertTriangle className="h-3 w-3" />
                  {adminDisputes.length} Pending
                </Badge>
              </div>

              {disputes.length === 0 ? (
                <div className="text-center py-12">
                  <Gavel className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-display font-semibold text-foreground mb-2">No Disputes</h3>
                  <p className="text-muted-foreground font-body">
                    There are no disputes requiring attention.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {disputes.map((dispute) => {
                    const reasonLabel = disputeReasons.find(r => r.value === dispute.reason)?.label;
                    return (
                      <div key={dispute.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-display font-bold text-foreground">{dispute.id}</span>
                              <Badge className={disputeStatusColors[dispute.status]}>
                                {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                              </Badge>
                              {dispute.status === "escalated" && (
                                <Badge className="bg-destructive text-destructive-foreground gap-1">
                                  <AlertTriangle className="h-3 w-3" /> Needs Action
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-display font-semibold text-foreground">{dispute.orderName}</h3>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground font-body mt-1">
                              <span>Order: {dispute.orderId}</span>
                              <span>Seller: {dispute.sellerName}</span>
                              <span>Reason: {reasonLabel}</span>
                            </div>
                            <p className="text-sm text-muted-foreground font-body mt-2 line-clamp-2">
                              {dispute.description}
                            </p>
                            {dispute.resolution && (
                              <p className="text-sm text-success font-body mt-2 bg-success/10 rounded p-2">
                                ✓ {dispute.resolution}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 lg:items-end">
                            <span className="text-xs text-muted-foreground font-body">
                              Created: {dispute.createdAt}
                            </span>
                            <div className="flex gap-2">
                              <Link to={`/dispute/${dispute.id}`}>
                                <Button variant="outline" size="sm" className="gap-1 font-body">
                                  <MessageSquare className="h-3 w-3" /> View Chat
                                </Button>
                              </Link>
                              {dispute.status !== "resolved" && dispute.status !== "closed" && (
                                <Button 
                                  size="sm" 
                                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-1"
                                  onClick={() => {
                                    setSelectedDispute(dispute);
                                    setShowResolveDialog(true);
                                  }}
                                >
                                  <Gavel className="h-3 w-3" /> Resolve
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Platform Growth</h3>
                <div className="space-y-4">
                  {[
                    { label: "New Users (This Month)", value: "245", prev: "198" },
                    { label: "New Products Listed", value: "89", prev: "67" },
                    { label: "Completed Orders", value: "156", prev: "134" },
                    { label: "Active RFQs", value: "42", prev: "38" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <span className="font-body text-sm text-foreground">{item.label}</span>
                      <div className="text-right">
                        <span className="font-display font-bold text-foreground">{item.value}</span>
                        <span className="text-xs text-muted-foreground font-body ml-2">vs {item.prev}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Top Categories</h3>
                <div className="space-y-3">
                  {[
                    { name: "Textiles & Garments", orders: 456, pct: 85 },
                    { name: "Agriculture", orders: 312, pct: 68 },
                    { name: "Sports Goods", orders: 198, pct: 52 },
                    { name: "Electronics", orders: 167, pct: 42 },
                    { name: "Leather Products", orders: 134, pct: 35 },
                  ].map((cat) => (
                    <div key={cat.name}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-body text-sm text-foreground">{cat.name}</span>
                        <span className="text-xs text-muted-foreground font-body">{cat.orders} orders</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div className="bg-gradient-hero h-2 rounded-full transition-all" style={{ width: `${cat.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Alerts</h3>
                <div className="space-y-3">
                  {[
                    { icon: AlertTriangle, text: "3 products flagged for review", type: "warning" },
                    { icon: Shield, text: "2 disputed orders need attention", type: "destructive" },
                    { icon: Clock, text: "5 seller verifications pending", type: "warning" },
                    { icon: CheckCircle2, text: "All systems operational", type: "success" },
                  ].map((alert, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-accent/50">
                      <alert.icon className={`h-5 w-5 flex-shrink-0 ${
                        alert.type === "warning" ? "text-warning" : alert.type === "destructive" ? "text-destructive" : "text-success"
                      }`} />
                      <span className="font-body text-sm text-foreground">{alert.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-card rounded-xl border border-border p-6">
                <h3 className="font-display font-bold text-lg text-foreground mb-4">Revenue Breakdown</h3>
                <div className="space-y-4">
                  {[
                    { label: "Commission", value: "PKR 4.5M", pct: "10%" },
                    { label: "Listing Fees", value: "PKR 890K", pct: "2%" },
                    { label: "Premium Plans", value: "PKR 1.2M", pct: "3%" },
                    { label: "Ads Revenue", value: "PKR 650K", pct: "1.4%" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
                      <div>
                        <span className="font-body text-sm text-foreground">{item.label}</span>
                        <span className="text-xs text-muted-foreground font-body ml-2">({item.pct})</span>
                      </div>
                      <span className="font-display font-bold text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Resolve Dispute Dialog */}
      <Dialog open={showResolveDialog} onOpenChange={setShowResolveDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-display">
              <Gavel className="h-5 w-5 text-primary" />
              Resolve Dispute {selectedDispute?.id}
            </DialogTitle>
            <DialogDescription className="font-body">
              Make a final decision on this dispute. Both parties will be notified.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedDispute && (
              <div className="bg-accent/50 rounded-lg p-3 text-sm font-body">
                <p><strong>Order:</strong> {selectedDispute.orderName}</p>
                <p><strong>Seller:</strong> {selectedDispute.sellerName}</p>
                <p><strong>Issue:</strong> {selectedDispute.description}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="font-display text-sm font-medium">Resolution Type *</label>
              <Select value={resolutionType} onValueChange={setResolutionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select resolution type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full_refund">Full Refund to Buyer</SelectItem>
                  <SelectItem value="partial_refund">Partial Refund</SelectItem>
                  <SelectItem value="replacement">Replacement Order</SelectItem>
                  <SelectItem value="favor_seller">Favor Seller (No Action)</SelectItem>
                  <SelectItem value="mutual_agreement">Mutual Agreement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="font-display text-sm font-medium">Resolution Details *</label>
              <Textarea
                placeholder="Describe the resolution decision and any actions to be taken..."
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                rows={4}
                className="font-body"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowResolveDialog(false)} className="font-body">
              Cancel
            </Button>
            <Button onClick={handleResolveDispute} className="bg-primary text-primary-foreground hover:bg-primary/90 font-body gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Confirm Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </AnimatedPage>
  );
};

export default AdminDashboard;
