import { useState } from "react";
import Navbar from "@/components/Navbar";
import { adminUsers, adminProducts } from "@/data/mockData";
import {
  Users, Package, ShoppingCart, TrendingUp, Shield, AlertTriangle,
  CheckCircle2, XCircle, Clock, BarChart3, Eye, Ban, ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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

  const filteredUsers = adminUsers.filter(
    (u) => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = adminProducts.filter(
    (p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.seller.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground">Admin Dashboard</h1>
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
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="users" className="gap-1.5 font-display"><Users className="h-4 w-4" /> Users</TabsTrigger>
            <TabsTrigger value="products" className="gap-1.5 font-display"><Package className="h-4 w-4" /> Products</TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5 font-display"><ShoppingCart className="h-4 w-4" /> Orders</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-1.5 font-display"><BarChart3 className="h-4 w-4" /> Analytics</TabsTrigger>
          </TabsList>

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
    </div>
  );
};

export default AdminDashboard;