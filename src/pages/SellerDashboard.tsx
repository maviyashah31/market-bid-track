import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { products as initialProducts, disputes, disputeReasons, type Dispute, type Product } from "@/data/mockData";
import { rfqDetails, type RFQDetail } from "@/data/rfqData";
import {
  Package, DollarSign, TrendingUp, ShoppingCart, FileText, MessageSquare,
  Star, Wallet, BarChart3, ArrowUpRight, ArrowDownRight, Plus, Eye, Edit, Trash2,
  AlertTriangle, Send, Search, Filter, Clock, Users, MapPin, SlidersHorizontal
} from "lucide-react";
import ProductFormDialog from "@/components/ProductFormDialog";
import SubmitBidForm from "@/components/SubmitBidForm";
import RFQDetailDialog from "@/components/RFQDetailDialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  
  // Product management
  const sellerProducts = initialProducts.filter(p => p.sellerName === "Lahore Textile Mills" || p.sellerName === "Faisalabad Fabric House");
  const [myProducts, setMyProducts] = useState<Product[]>(sellerProducts);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // RFQ
  const [bidFormOpen, setBidFormOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<RFQDetail | null>(null);
  const [rfqDetailOpen, setRfqDetailOpen] = useState(false);
  const [detailRFQ, setDetailRFQ] = useState<RFQDetail | null>(null);
  const [rfqSearch, setRfqSearch] = useState("");
  const [rfqCategoryFilter, setRfqCategoryFilter] = useState("all");
  const [rfqSortBy, setRfqSortBy] = useState("newest");

  const filteredRFQs = useMemo(() => {
    let result = [...rfqDetails];
    if (rfqSearch) {
      const q = rfqSearch.toLowerCase();
      result = result.filter(r => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.buyer.toLowerCase().includes(q));
    }
    if (rfqCategoryFilter !== "all") {
      result = result.filter(r => r.category === rfqCategoryFilter);
    }
    if (rfqSortBy === "newest") result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else if (rfqSortBy === "deadline") result.sort((a, b) => a.daysLeft - b.daysLeft);
    else if (rfqSortBy === "budget_high") result.sort((a, b) => b.budgetMax - a.budgetMax);
    else if (rfqSortBy === "bids_low") result.sort((a, b) => a.bidsCount - b.bidsCount);
    return result;
  }, [rfqSearch, rfqCategoryFilter, rfqSortBy]);

  const rfqCategories = [...new Set(rfqDetails.map(r => r.category))];

  const handleSaveProduct = (data: Partial<Product>) => {
    if (editingProduct) {
      setMyProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...data } : p));
    } else {
      const newProduct: Product = {
        id: String(Date.now()),
        sellerName: "Lahore Textile Mills",
        sellerVerified: true,
        sellerRating: 4.8,
        sellerLocation: "Lahore",
        responseTime: "< 2 hours",
        ordersCompleted: 0,
        ...data,
      } as Product;
      setMyProducts(prev => [...prev, newProduct]);
    }
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    setMyProducts(prev => prev.filter(p => p.id !== id));
  };

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
                <h2 className="font-display font-bold text-xl text-foreground">My Products ({myProducts.length})</h2>
                <Button onClick={() => { setEditingProduct(null); setProductFormOpen(true); }} className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2 font-body"><Plus className="h-4 w-4" /> Add Product</Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myProducts.map((product) => (
                  <div key={product.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
                    <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg mb-3" />
                    <h3 className="font-display font-semibold text-sm text-foreground">{product.name}</h3>
                    <p className="text-primary font-display font-bold text-sm mt-1">PKR {product.minPrice} - {product.maxPrice}</p>
                    <p className="text-xs text-muted-foreground font-body">MOQ: {product.moq} {product.unit}</p>
                    <div className="flex gap-2 mt-3">
                      <Link to={`/product/${product.id}`}>
                        <Button variant="outline" size="sm" className="gap-1 font-body"><Eye className="h-3 w-3" /> View</Button>
                      </Link>
                      <Button variant="outline" size="sm" className="gap-1 font-body" onClick={() => { setEditingProduct(product); setProductFormOpen(true); }}><Edit className="h-3 w-3" /> Edit</Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDeleteProduct(product.id)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <ProductFormDialog open={productFormOpen} onOpenChange={setProductFormOpen} product={editingProduct} onSave={handleSaveProduct} />
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

          {/* RFQ Marketplace */}
          <TabsContent value="rfqs">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="font-display font-bold text-xl text-foreground">RFQ Marketplace ({filteredRFQs.length})</h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={rfqSearch}
                      onChange={(e) => setRfqSearch(e.target.value)}
                      placeholder="Search RFQs..."
                      className="pl-9 w-48"
                    />
                  </div>
                  <Select value={rfqCategoryFilter} onValueChange={setRfqCategoryFilter}>
                    <SelectTrigger className="w-44">
                      <Filter className="h-3.5 w-3.5 mr-1" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {rfqCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={rfqSortBy} onValueChange={setRfqSortBy}>
                    <SelectTrigger className="w-40">
                      <SlidersHorizontal className="h-3.5 w-3.5 mr-1" />
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="deadline">Deadline (Urgent)</SelectItem>
                      <SelectItem value="budget_high">Budget (High)</SelectItem>
                      <SelectItem value="bids_low">Fewest Bids</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredRFQs.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-body">No RFQs match your filters</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredRFQs.map((rfq) => (
                    <div
                      key={rfq.id}
                      className="border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer group"
                      onClick={() => { setDetailRFQ(rfq); setRfqDetailOpen(true); }}
                    >
                      {/* Image preview */}
                      {rfq.images.length > 0 && (
                        <div className="mb-3 rounded-lg overflow-hidden">
                          <img src={rfq.images[0].url} alt={rfq.title} className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary" className="font-body text-xs">{rfq.category}</Badge>
                        <Badge className="bg-success/10 text-success border border-success/20 font-body text-xs">Active</Badge>
                        <span className="ml-auto text-xs text-muted-foreground font-body">{rfq.daysLeft}d left</span>
                      </div>
                      <h3 className="font-display font-semibold text-foreground group-hover:text-primary transition-colors">{rfq.title}</h3>
                      <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-2">{rfq.description}</p>
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-border">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground font-body">Quantity</p>
                          <p className="font-display font-bold text-xs text-foreground">{rfq.quantity.toLocaleString()} {rfq.unit}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground font-body">Budget</p>
                          <p className="font-display font-bold text-xs text-foreground">PKR {(rfq.budgetMax / 1000000).toFixed(1)}M</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground font-body">Bids</p>
                          <p className="font-display font-bold text-xs text-primary">{rfq.bidsCount}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border">
                        <p className="text-xs text-muted-foreground font-body flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {rfq.buyerLocation}
                        </p>
                        <Button
                          size="sm"
                          className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body text-xs gap-1"
                          onClick={(e) => { e.stopPropagation(); setSelectedRFQ(rfq); setBidFormOpen(true); }}
                        >
                          Submit Bid
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <SubmitBidForm open={bidFormOpen} onOpenChange={setBidFormOpen} rfq={selectedRFQ} />
            <RFQDetailDialog
              open={rfqDetailOpen}
              onOpenChange={setRfqDetailOpen}
              rfq={detailRFQ}
              mode="seller"
              onSubmitBid={() => { setRfqDetailOpen(false); setSelectedRFQ(detailRFQ); setBidFormOpen(true); }}
            />
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

          {/* Disputes */}
          <TabsContent value="disputes">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-foreground">Disputes Against You</h2>
                {activeDisputeCount > 0 && (
                  <Badge variant="destructive" className="font-body">{activeDisputeCount} needs response</Badge>
                )}
              </div>
              {sellerDisputes.length === 0 ? (
                <div className="text-center py-12">
                  <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground font-body">No disputes raised against you. Keep up the great work!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sellerDisputes.map((dispute) => (
                    <div key={dispute.id} className="border border-border rounded-lg p-5 hover:shadow-md transition">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-display font-bold text-foreground">{dispute.id}</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${disputeStatusColors[dispute.status]}`}>
                              {dispute.status.replace("_", " ")}
                            </span>
                            {dispute.status === "escalated" && (
                              <Badge variant="destructive" className="text-[10px] font-body">Escalated to Admin</Badge>
                            )}
                          </div>
                          <h3 className="font-display font-semibold text-foreground">{dispute.orderName}</h3>
                          <p className="text-sm text-muted-foreground font-body mt-1">
                            Order: {dispute.orderId} • Reason: {getReasonLabel(dispute.reason)}
                          </p>
                          <p className="text-sm text-muted-foreground font-body mt-1">{dispute.description}</p>
                          <p className="text-xs text-muted-foreground font-body mt-2">
                            Opened: {dispute.createdAt} • Updated: {dispute.updatedAt}
                          </p>
                          {dispute.resolution && (
                            <div className="mt-3 p-3 bg-success/10 rounded-lg border border-success/20">
                              <p className="text-sm font-body text-success font-medium">Resolution: {dispute.resolution}</p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/dispute/${dispute.id}`}>
                            <Button variant="outline" size="sm" className="font-body gap-1">
                              <Eye className="h-3 w-3" /> View Chat
                            </Button>
                          </Link>
                          {dispute.status !== "resolved" && dispute.status !== "closed" && (
                            <Button
                              size="sm"
                              className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body gap-1"
                              onClick={() => { setSelectedDispute(dispute); setRespondDialogOpen(true); }}
                            >
                              <Send className="h-3 w-3" /> Respond
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Respond Dialog */}
            <Dialog open={respondDialogOpen} onOpenChange={setRespondDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display">Respond to Dispute {selectedDispute?.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-body text-muted-foreground mb-1">Order: {selectedDispute?.orderName}</p>
                    <p className="text-sm font-body text-muted-foreground">Reason: {selectedDispute ? getReasonLabel(selectedDispute.reason) : ""}</p>
                    <p className="text-sm font-body text-muted-foreground mt-2 italic">"{selectedDispute?.description}"</p>
                  </div>
                  <Textarea
                    placeholder="Write your response to the buyer... (e.g., offer a resolution, request more details)"
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    rows={4}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRespondDialogOpen(false)} className="font-body">Cancel</Button>
                  <Button onClick={handleRespond} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body gap-1">
                    <Send className="h-4 w-4" /> Send Response
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
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