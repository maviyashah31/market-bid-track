import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { products as initialProducts, disputes, disputeReasons, type Dispute, type Product } from "@/data/mockData";
import { rfqDetails, type RFQDetail } from "@/data/rfqData";
import {
  Package, DollarSign, TrendingUp, ShoppingCart, FileText, MessageSquare,
  Star, Wallet, BarChart3, ArrowUpRight, ArrowDownRight, Plus, Eye, Edit, Trash2,
  AlertTriangle, Send, Search, Filter, Clock, Users, MapPin, SlidersHorizontal,
  Menu, ChevronLeft, Truck, CheckCircle, Phone, Mail, User
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
import AnimatedPage from "@/components/AnimatedPage";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const stats = [
  { icon: DollarSign, label: "Revenue", value: "PKR 2.45M", change: "+12.5%", up: true },
  { icon: ShoppingCart, label: "Orders", value: "156", change: "+8.2%", up: true },
  { icon: Package, label: "Products", value: "45", change: "+3", up: true },
  { icon: Star, label: "Rating", value: "4.8/5", change: "+0.2", up: true },
];

const recentOrders = [
  { id: "ORD-5001", product: "Cotton T-Shirts x500", buyer: "Metro Wholesale", buyerEmail: "orders@metrowholesale.pk", buyerPhone: "+92 321 1234567", total: "PKR 175,000", status: "pending", date: "2026-03-08", address: "Shop #45, Bolton Market, Karachi", paymentStatus: "escrow" },
  { id: "ORD-5002", product: "Polo Shirts x200", buyer: "Style Hub", buyerEmail: "buy@stylehub.pk", buyerPhone: "+92 300 9876543", total: "PKR 96,000", status: "processing", date: "2026-03-07", address: "Mall Road, Lahore", paymentStatus: "escrow" },
  { id: "ORD-5003", product: "Denim Jeans x300", buyer: "Fashion Point", buyerEmail: "procurement@fashionpoint.pk", buyerPhone: "+92 333 5556677", total: "PKR 285,000", status: "shipped", date: "2026-03-05", address: "Blue Area, Islamabad", paymentStatus: "escrow" },
  { id: "ORD-5004", product: "Cotton Fabric 1000m", buyer: "AL Textiles", buyerEmail: "info@altextiles.pk", buyerPhone: "+92 312 7778899", total: "PKR 450,000", status: "delivered", date: "2026-03-01", address: "Faisalabad Road, Faisalabad", paymentStatus: "released" },
  { id: "ORD-5005", product: "Silk Scarves x150", buyer: "Karachi Traders", buyerEmail: "buy@karachitraders.pk", buyerPhone: "+92 345 1112233", total: "PKR 67,500", status: "pending", date: "2026-03-08", address: "Tariq Road, Karachi", paymentStatus: "escrow" },
  { id: "ORD-5006", product: "Leather Jackets x50", buyer: "Premium Wear", buyerEmail: "orders@premiumwear.pk", buyerPhone: "+92 301 4445566", total: "PKR 375,000", status: "processing", date: "2026-03-06", address: "Liberty Market, Lahore", paymentStatus: "escrow" },
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

const sidebarItems = [
  { icon: BarChart3, label: "Overview", value: "overview" },
  { icon: Package, label: "Products", value: "products" },
  { icon: ShoppingCart, label: "Orders", value: "orders" },
  { icon: FileText, label: "RFQs", value: "rfqs" },
  { icon: MessageSquare, label: "Messages", value: "messages" },
  { icon: AlertTriangle, label: "Disputes", value: "disputes" },
  { icon: Star, label: "Reviews", value: "reviews" },
  { icon: Wallet, label: "Wallet", value: "wallet" },
];

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [responseText, setResponseText] = useState("");
  const [respondDialogOpen, setRespondDialogOpen] = useState(false);
  
  const sellerProducts = initialProducts.filter(p => p.sellerName === "Lahore Textile Mills" || p.sellerName === "Faisalabad Fabric House");
  const [myProducts, setMyProducts] = useState<Product[]>(sellerProducts);
  const [productFormOpen, setProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [orderDetailOpen, setOrderDetailOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<typeof recentOrders[0] | null>(null);

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

  const collapsed = isMobile ? !sidebarOpen : !sidebarOpen;

  const handleNavClick = (value: string) => {
    setActiveTab(value);
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex">
          {/* Sidebar */}
          {(isMobile ? sidebarOpen : true) && (
            <>
              {isMobile && sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setSidebarOpen(false)} />
              )}
              <aside className={cn(
                "bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300 z-50",
                isMobile ? "fixed left-0 top-0 h-full w-64 pt-16" : "sticky top-0 h-screen",
                !isMobile && collapsed ? "w-16" : "w-64"
              )}>
                {/* Seller info */}
                <div className={cn("p-4 border-b border-border", collapsed && !isMobile && "px-2")}>
                  {(!collapsed || isMobile) ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm text-foreground truncate">Lahore Textile Mills</p>
                        <p className="text-xs text-muted-foreground font-body">Verified Seller ✅</p>
                      </div>
                      {!isMobile && (
                        <Button variant="ghost" size="sm" className="ml-auto shrink-0 h-8 w-8 p-0" onClick={() => setSidebarOpen(false)}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                  {sidebarItems.map(({ icon: Icon, label, value }) => (
                    <button
                      key={value}
                      onClick={() => handleNavClick(value)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors",
                        activeTab === value
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        collapsed && !isMobile && "justify-center px-0"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", value === "disputes" && activeDisputeCount > 0 && "text-destructive")} />
                      {(!collapsed || isMobile) && (
                        <>
                          <span className="truncate">{label}</span>
                          {value === "disputes" && activeDisputeCount > 0 && (
                            <span className="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center shrink-0">
                              {activeDisputeCount}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  ))}
                </nav>
              </aside>
            </>
          )}

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <div className="p-4 sm:p-6 lg:p-8">
              {/* Mobile header */}
              {isMobile && (
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-5 w-5" />
                  </Button>
                  <div>
                    <h1 className="font-display font-bold text-xl text-foreground">Seller Dashboard</h1>
                    <p className="text-xs text-muted-foreground font-body">Lahore Textile Mills</p>
                  </div>
                </div>
              )}
              {!isMobile && collapsed && (
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-5 w-5" />
                  </Button>
                  <h1 className="font-display font-bold text-xl text-foreground">Seller Dashboard</h1>
                </div>
              )}
              {!isMobile && !collapsed && (
                <div className="mb-6">
                  <h1 className="font-display font-bold text-2xl text-foreground">Seller Dashboard</h1>
                </div>
              )}

              {/* Overview */}
              {activeTab === "overview" && (
                <>
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
                      <Link to="/seller/orders"><Button variant="outline" size="sm" className="font-body">View All</Button></Link>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Order ID</th>
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Product</th>
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground hidden sm:table-cell">Buyer</th>
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Total</th>
                            <th className="text-left py-3 px-2 font-display font-semibold text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                              <td className="py-3 px-2 font-body font-medium text-foreground">{order.id}</td>
                              <td className="py-3 px-2 font-body text-foreground">{order.product}</td>
                              <td className="py-3 px-2 font-body text-muted-foreground hidden sm:table-cell">{order.buyer}</td>
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
                </>
              )}

              {/* Products */}
              {activeTab === "products" && (
                <>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <h2 className="font-display font-bold text-xl text-foreground">My Products ({myProducts.length})</h2>
                      <Button onClick={() => { setEditingProduct(null); setProductFormOpen(true); }} className="bg-gradient-hero text-primary-foreground hover:opacity-90 gap-2 font-body w-full sm:w-auto"><Plus className="h-4 w-4" /> Add Product</Button>
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
                </>
              )}

              {/* Orders */}
              {activeTab === "orders" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-6">All Orders</h2>
                  <div className="space-y-3">
                    {recentOrders.map((order) => {
                      const icons: Record<string, typeof Clock> = { pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle };
                      const StatusIcon = icons[order.status] || Clock;
                      return (
                        <div
                          key={order.id}
                          onClick={() => { setSelectedOrder(order); setOrderDetailOpen(true); }}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-border hover:bg-accent/30 hover:shadow-sm transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`p-2 rounded-lg shrink-0 ${statusColors[order.status]}`}>
                              <StatusIcon className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-display font-bold text-sm text-foreground">{order.id}</span>
                                <Badge className={`text-[10px] capitalize border ${statusColors[order.status]}`} variant="outline">{order.status}</Badge>
                              </div>
                              <p className="font-body text-sm text-foreground truncate">{order.product}</p>
                              <p className="text-xs text-muted-foreground font-body">{order.buyer} • {order.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-display font-bold text-sm text-foreground">{order.total}</span>
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Order Detail Dialog */}
              <Dialog open={orderDetailOpen} onOpenChange={setOrderDetailOpen}>
                <DialogContent className="max-w-lg">
                  {selectedOrder && (
                    <>
                      <DialogHeader>
                        <DialogTitle className="font-display flex items-center gap-2">
                          {selectedOrder.id}
                          <Badge variant="outline" className={`text-[10px] capitalize ${statusColors[selectedOrder.status]}`}>{selectedOrder.status}</Badge>
                        </DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="bg-accent/30 rounded-lg p-4">
                          <p className="text-xs text-muted-foreground font-body mb-1">Product</p>
                          <p className="font-body font-semibold text-foreground text-sm">{selectedOrder.product}</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-display font-bold text-foreground">{selectedOrder.total}</span>
                            <Badge variant="outline" className="text-[10px] capitalize">{selectedOrder.paymentStatus} payment</Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Buyer Details</p>
                          <div className="grid gap-2 text-sm font-body">
                            <div className="flex items-center gap-2 text-foreground"><User className="h-3.5 w-3.5 text-muted-foreground" />{selectedOrder.buyer}</div>
                            <div className="flex items-center gap-2 text-foreground"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{selectedOrder.buyerEmail}</div>
                            <div className="flex items-center gap-2 text-foreground"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{selectedOrder.buyerPhone}</div>
                            <div className="flex items-center gap-2 text-foreground"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{selectedOrder.address}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Order Timeline</p>
                          <div className="space-y-3 pl-3 border-l-2 border-border">
                            {(["pending", "processing", "shipped", "delivered"] as const).map((step, i) => {
                              const steps = ["pending", "processing", "shipped", "delivered"];
                              const currentIdx = steps.indexOf(selectedOrder.status);
                              const done = i <= currentIdx;
                              const icons: Record<string, typeof Clock> = { pending: Clock, processing: Package, shipped: Truck, delivered: CheckCircle };
                              const StepIcon = icons[step];
                              return (
                                <div key={step} className="flex items-center gap-3 relative">
                                  <div className={`absolute -left-[19px] w-3 h-3 rounded-full border-2 ${done ? "bg-primary border-primary" : "bg-card border-border"}`} />
                                  <StepIcon className={`h-4 w-4 ${done ? "text-primary" : "text-muted-foreground/40"}`} />
                                  <span className={`text-sm font-body capitalize ${done ? "text-foreground font-medium" : "text-muted-foreground"}`}>{step}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Link to="/messages">
                          <Button variant="outline" className="gap-2 font-body"><MessageSquare className="h-4 w-4" />Message Buyer</Button>
                        </Link>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>

              {/* RFQ Marketplace */}
              {activeTab === "rfqs" && (
                <>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <h2 className="font-display font-bold text-xl text-foreground">RFQ Marketplace ({filteredRFQs.length})</h2>
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="relative w-full sm:w-48">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input value={rfqSearch} onChange={(e) => setRfqSearch(e.target.value)} placeholder="Search RFQs..." className="pl-9 w-full" />
                        </div>
                        <Select value={rfqCategoryFilter} onValueChange={setRfqCategoryFilter}>
                          <SelectTrigger className="w-full sm:w-44">
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
                          <SelectTrigger className="w-full sm:w-40">
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
                </>
              )}

              {/* Messages */}
              {activeTab === "messages" && (
                <div className="bg-card rounded-xl border border-border p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <h2 className="font-display font-bold text-xl text-foreground mb-2">Messages</h2>
                  <p className="text-muted-foreground font-body mb-4">View and manage your buyer conversations</p>
                  <Link to="/messages">
                    <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">Open Messages</Button>
                  </Link>
                </div>
              )}

              {/* Disputes */}
              {activeTab === "disputes" && (
                <>
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
                          placeholder="Write your response to the buyer..."
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
                </>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
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
              )}

              {/* Wallet */}
              {activeTab === "wallet" && (
                <>
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
                </>
              )}
            </div>
          </main>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default SellerDashboard;
