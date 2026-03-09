import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { buyerOrders, products, disputes, disputeReasons } from "@/data/mockData";
import { rfqDetails } from "@/data/rfqData";
import {
  Package, FileText, MessageSquare, Star, Heart, ShoppingCart,
  ArrowRight, Clock, Eye, MapPin, AlertTriangle, Users, Image as ImageIcon,
  Menu, ChevronLeft, LayoutDashboard
} from "lucide-react";
import PostRFQForm from "@/components/PostRFQForm";
import RFQDetailDialog from "@/components/RFQDetailDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AnimatedPage from "@/components/AnimatedPage";
import DisputeForm from "@/components/DisputeForm";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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

const disputeStatusColors: Record<string, string> = {
  open: "bg-warning/10 text-warning",
  negotiating: "bg-primary/10 text-primary",
  escalated: "bg-destructive/10 text-destructive",
  resolved: "bg-success/10 text-success",
  closed: "bg-muted text-muted-foreground",
};

const sidebarItems = [
  { icon: LayoutDashboard, label: "Overview", value: "overview" },
  { icon: Package, label: "Orders", value: "orders", count: 3 },
  { icon: FileText, label: "My RFQs", value: "rfqs" },
  { icon: AlertTriangle, label: "Disputes", value: "disputes", count: disputes.length },
  { icon: MessageSquare, label: "Messages", value: "messages", count: 5 },
  { icon: Star, label: "Reviews", value: "reviews" },
  { icon: Heart, label: "Wishlist", value: "wishlist", count: 12 },
  { icon: ShoppingCart, label: "Cart", value: "cart", href: "/cart" },
];

const wishlistItems = products.slice(0, 4);

const myReviews = [
  { id: "1", product: "Premium Cotton T-Shirts", seller: "Lahore Textile Mills", rating: 5, comment: "Great quality cotton, delivered on time!", date: "2026-03-02" },
  { id: "2", product: "Basmati Rice Super Kernel", seller: "Punjab Agro Exports", rating: 4, comment: "Good quality but packaging could be better.", date: "2026-02-22" },
];

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const isMobile = useIsMobile();
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [showRFQForm, setShowRFQForm] = useState(false);
  const [rfqDetailOpen, setRfqDetailOpen] = useState(false);
  const [selectedRFQ, setSelectedRFQ] = useState<(typeof rfqDetails)[0] | null>(null);

  const myRFQs = rfqDetails.filter(r => r.buyer === "AcmeCo");
  const collapsed = isMobile ? !sidebarOpen : !sidebarOpen;

  const handleDisputeSubmit = (data: { orderId: string; reason: string; description: string }) => {
    console.log("Dispute submitted:", data);
  };

  const handleNavClick = (value: string, href?: string) => {
    if (href) {
      window.location.href = href;
      return;
    }
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
                <div className="fixed inset-0 bg-black/50 z-[60]" onClick={() => setSidebarOpen(false)} />
              )}
              <aside className={cn(
                "bg-card border-r border-border flex flex-col shrink-0 transition-all duration-300 overflow-y-auto",
                isMobile ? "fixed left-0 top-0 h-full w-64 z-[70]" : "sticky top-0 h-screen z-40 pt-0",
                !isMobile && collapsed ? "w-16" : "w-64"
              )}>
                {/* Buyer info */}
                <div className={cn("p-4 border-b border-border", collapsed && !isMobile && "px-2")}>
                  {(!collapsed || isMobile) ? (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="font-display font-bold text-primary">MA</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-display font-bold text-sm text-foreground truncate">Muhammad Ahmed</p>
                        <p className="text-xs text-muted-foreground font-body">Buyer Account</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto shrink-0 h-8 w-8 p-0" onClick={() => setSidebarOpen(false)}>
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="font-display font-bold text-primary text-sm">MA</span>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {/* Nav items */}
                <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
                  {sidebarItems.map(({ icon: Icon, label, value, count, href }) => (
                    <button
                      key={value}
                      onClick={() => handleNavClick(value, href)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors",
                        activeTab === value
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-muted-foreground hover:bg-accent hover:text-foreground",
                        collapsed && !isMobile && "justify-center px-0"
                      )}
                    >
                      <Icon className={cn("h-5 w-5 shrink-0", value === "disputes" && disputes.length > 0 && "text-warning")} />
                      {(!collapsed || isMobile) && (
                        <>
                          <span className="truncate">{label}</span>
                          {count && count > 0 && (
                            <span className="ml-auto bg-muted text-muted-foreground text-[10px] font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center shrink-0">
                              {count}
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
                    <h1 className="font-display font-bold text-xl text-foreground">Buyer Dashboard</h1>
                    <p className="text-xs text-muted-foreground font-body">Welcome back, Muhammad Ahmed!</p>
                  </div>
                </div>
              )}
              {!isMobile && collapsed && (
                <div className="flex items-center gap-3 mb-6">
                  <Button variant="outline" size="sm" className="h-9 w-9 p-0" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-5 w-5" />
                  </Button>
                  <h1 className="font-display font-bold text-xl text-foreground">Buyer Dashboard</h1>
                </div>
              )}
              {!isMobile && !collapsed && (
                <div className="mb-6">
                  <h1 className="font-display font-bold text-2xl text-foreground">Buyer Dashboard</h1>
                  <p className="text-muted-foreground font-body mt-1">Welcome back, Muhammad Ahmed!</p>
                </div>
              )}

              {/* Overview */}
              {activeTab === "overview" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-xl text-foreground">Recent Orders</h2>
                    <Button variant="outline" size="sm" className="gap-1 font-body" onClick={() => setActiveTab("orders")}>
                      View All <ArrowRight className="h-4 w-4" />
                    </Button>
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
                        <div className="mt-2 sm:mt-0 flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-display font-bold text-foreground">PKR {order.total.toLocaleString()}</div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-body justify-end">
                              <Clock className="h-3 w-3" /> {order.date}
                            </div>
                          </div>
                          <Link to={`/order/${order.id}`}>
                            <Button variant="outline" size="sm" className="gap-1 font-body"><MapPin className="h-3 w-3" /> Track</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Orders */}
              {activeTab === "orders" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-6">All Orders</h2>
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
                        <div className="mt-2 sm:mt-0 flex items-center gap-3">
                          <div className="text-right">
                            <div className="font-display font-bold text-foreground">PKR {order.total.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground font-body">{order.date}</div>
                          </div>
                          <Link to={`/order/${order.id}`}>
                            <Button variant="outline" size="sm" className="gap-1 font-body"><MapPin className="h-3 w-3" /> Track</Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RFQs */}
              {activeTab === "rfqs" && (
                <>
                  <div className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display font-bold text-xl text-foreground">My RFQs ({myRFQs.length})</h2>
                      <Button onClick={() => setShowRFQForm(true)} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body gap-2">
                        <FileText className="h-4 w-4" /> Post New RFQ
                      </Button>
                    </div>
                    {myRFQs.length === 0 ? (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                        <h3 className="font-display font-semibold text-foreground mb-2">No RFQs Yet</h3>
                        <p className="text-muted-foreground font-body mb-4">Post your first RFQ and let sellers compete for your business</p>
                        <Button onClick={() => setShowRFQForm(true)} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">Post Your First RFQ</Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {myRFQs.map((rfq) => (
                          <div
                            key={rfq.id}
                            className="border border-border rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer"
                            onClick={() => { setSelectedRFQ(rfq); setRfqDetailOpen(true); }}
                          >
                            <div className="flex items-start gap-4">
                              {rfq.images.length > 0 && (
                                <img src={rfq.images[0].url} alt={rfq.title} className="w-20 h-20 rounded-lg object-cover shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <Badge variant="secondary" className="font-body text-xs">{rfq.category}</Badge>
                                  <Badge className="bg-success/10 text-success border border-success/20 font-body text-xs">
                                    {rfq.status.charAt(0).toUpperCase() + rfq.status.slice(1)}
                                  </Badge>
                                  {rfq.images.length > 0 && (
                                    <span className="text-xs text-muted-foreground font-body flex items-center gap-0.5">
                                      <ImageIcon className="h-3 w-3" /> {rfq.images.length}
                                    </span>
                                  )}
                                </div>
                                <h3 className="font-display font-semibold text-foreground">{rfq.title}</h3>
                                <p className="text-sm text-muted-foreground font-body mt-1 line-clamp-1">{rfq.description}</p>
                                <p className="text-sm text-muted-foreground font-body mt-1">
                                  Qty: {rfq.quantity.toLocaleString()} {rfq.unit} • Budget: PKR {(rfq.budgetMin / 1000000).toFixed(1)}M - {(rfq.budgetMax / 1000000).toFixed(1)}M
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                                  <Clock className="h-3 w-3" /> {rfq.deadline} left
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                                  {rfq.certifications.length > 0 && rfq.certifications.slice(0, 2).join(", ")}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-xs text-primary font-semibold font-body">
                                  <Users className="h-3 w-3" /> {rfq.bidsCount} bids
                                </div>
                                <Button variant="outline" size="sm" className="font-body text-xs gap-1" onClick={(e) => { e.stopPropagation(); setSelectedRFQ(rfq); setRfqDetailOpen(true); }}>
                                  <Eye className="h-3 w-3" /> View Bids
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <PostRFQForm open={showRFQForm} onOpenChange={setShowRFQForm} />
                  <RFQDetailDialog
                    open={rfqDetailOpen}
                    onOpenChange={setRfqDetailOpen}
                    rfq={selectedRFQ}
                    mode="buyer"
                  />
                </>
              )}

              {/* Disputes */}
              {activeTab === "disputes" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-bold text-xl text-foreground">My Disputes</h2>
                    <Button 
                      onClick={() => setShowDisputeForm(true)}
                      className="bg-warning text-warning-foreground hover:bg-warning/90 font-body gap-2"
                    >
                      <AlertTriangle className="h-4 w-4" />
                      Raise Dispute
                    </Button>
                  </div>

                  {disputes.length === 0 ? (
                    <div className="text-center py-12">
                      <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-display font-semibold text-foreground mb-2">No Disputes</h3>
                      <p className="text-muted-foreground font-body">You haven't raised any disputes yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {disputes.map((dispute) => {
                        const reasonLabel = disputeReasons.find(r => r.value === dispute.reason)?.label;
                        return (
                          <div key={dispute.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <span className="font-display font-bold text-foreground">{dispute.id}</span>
                                <Badge className={disputeStatusColors[dispute.status]}>
                                  {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground font-body">{dispute.createdAt}</span>
                            </div>
                            <h3 className="font-display font-semibold text-foreground">{dispute.orderName}</h3>
                            <p className="text-sm text-muted-foreground font-body mt-1">
                              {dispute.sellerName} • {reasonLabel}
                            </p>
                            <p className="text-sm text-muted-foreground font-body mt-2 line-clamp-2">
                              {dispute.description}
                            </p>
                            {dispute.resolution && (
                              <p className="text-sm text-success font-body mt-2 bg-success/10 rounded p-2">
                                ✓ {dispute.resolution}
                              </p>
                            )}
                            <div className="flex justify-end mt-4">
                              <Link to={`/dispute/${dispute.id}`}>
                                <Button variant="outline" size="sm" className="gap-1 font-body">
                                  <Eye className="h-3 w-3" /> View Details
                                </Button>
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Reviews */}
              {activeTab === "reviews" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-6">My Reviews</h2>
                  <div className="space-y-4">
                    {myReviews.map((review) => (
                      <div key={review.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <span className="font-display font-semibold text-foreground">{review.product}</span>
                            <span className="text-xs text-muted-foreground font-body ml-2">• {review.seller}</span>
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

              {/* Wishlist */}
              {activeTab === "wishlist" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-6">My Wishlist</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {wishlistItems.map((product) => (
                      <div key={product.id} className="border border-border rounded-lg overflow-hidden hover:shadow-md transition">
                        <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                        <div className="p-3">
                          <h3 className="font-display font-semibold text-sm text-foreground line-clamp-2">{product.name}</h3>
                          <p className="text-primary font-display font-bold text-sm mt-1">PKR {product.minPrice} - {product.maxPrice}</p>
                          <div className="flex gap-2 mt-2">
                            <Link to={`/product/${product.id}`} className="flex-1">
                              <Button variant="outline" size="sm" className="w-full gap-1 font-body"><Eye className="h-3 w-3" /> View</Button>
                            </Link>
                            <Link to="/cart">
                              <Button size="sm" className="bg-gradient-hero text-primary-foreground hover:opacity-90"><ShoppingCart className="h-3 w-3" /></Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Dispute Form Modal */}
        <DisputeForm
          open={showDisputeForm}
          onOpenChange={setShowDisputeForm}
          onSubmit={handleDisputeSubmit}
        />
      </div>
    </AnimatedPage>
  );
};

export default BuyerDashboard;
