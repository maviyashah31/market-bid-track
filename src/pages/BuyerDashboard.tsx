import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { buyerOrders, products, disputes, disputeReasons } from "@/data/mockData";
import { rfqDetails } from "@/data/rfqData";
import {
  Package, FileText, MessageSquare, Star, Heart, ShoppingCart,
  ArrowRight, Clock, Eye, MapPin, AlertTriangle, Users, Image as ImageIcon
} from "lucide-react";
import PostRFQForm from "@/components/PostRFQForm";
import RFQDetailDialog from "@/components/RFQDetailDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedPage from "@/components/AnimatedPage";
import DisputeForm from "@/components/DisputeForm";

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

const quickLinks = [
  { icon: Package, label: "My Orders", count: 3, tab: "orders" },
  { icon: FileText, label: "My RFQs", count: rfqDetails.filter(r => r.buyer === "AcmeCo").length, tab: "rfqs" },
  { icon: AlertTriangle, label: "Disputes", count: disputes.length, tab: "disputes" },
  { icon: MessageSquare, label: "Messages", count: 5, href: "/messages" },
  { icon: Heart, label: "Wishlist", count: 12, tab: "wishlist" },
  { icon: ShoppingCart, label: "Cart", count: 3, href: "/cart" },
];

const wishlistItems = products.slice(0, 4);

const myReviews = [
  { id: "1", product: "Premium Cotton T-Shirts", seller: "Lahore Textile Mills", rating: 5, comment: "Great quality cotton, delivered on time!", date: "2026-03-02" },
  { id: "2", product: "Basmati Rice Super Kernel", seller: "Punjab Agro Exports", rating: 4, comment: "Good quality but packaging could be better.", date: "2026-02-22" },
];

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showDisputeForm, setShowDisputeForm] = useState(false);
  const [showRFQForm, setShowRFQForm] = useState(false);

  const handleDisputeSubmit = (data: { orderId: string; reason: string; description: string }) => {
    console.log("Dispute submitted:", data);
    // In a real app, this would call an API
  };

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-foreground">Buyer Dashboard</h1>
          <p className="text-muted-foreground font-body mt-1">Welcome back, Muhammad Ahmed!</p>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {quickLinks.map(({ icon: Icon, label, count, tab, href }) => (
            href ? (
              <Link
                key={label}
                to={href}
                className="bg-card rounded-xl border border-border p-4 flex flex-col items-center gap-2 hover:border-primary hover:shadow-md transition-all"
              >
                <Icon className="h-6 w-6 text-primary" />
                <span className="font-display font-semibold text-sm text-foreground">{label}</span>
                <Badge variant="secondary" className="font-body">{count}</Badge>
              </Link>
            ) : (
              <button
                key={label}
                onClick={() => setActiveTab(tab!)}
                className="bg-card rounded-xl border border-border p-4 flex flex-col items-center gap-2 hover:border-primary hover:shadow-md transition-all"
              >
                <Icon className={`h-6 w-6 ${label === "Disputes" ? "text-warning" : "text-primary"}`} />
                <span className="font-display font-semibold text-sm text-foreground">{label}</span>
                <Badge variant="secondary" className="font-body">{count}</Badge>
              </button>
            )
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-card border border-border flex-wrap h-auto gap-1">
            <TabsTrigger value="overview" className="font-display">Overview</TabsTrigger>
            <TabsTrigger value="orders" className="font-display">Orders</TabsTrigger>
            <TabsTrigger value="rfqs" className="font-display">My RFQs</TabsTrigger>
            <TabsTrigger value="disputes" className="font-display">Disputes</TabsTrigger>
            <TabsTrigger value="reviews" className="font-display">Reviews</TabsTrigger>
            <TabsTrigger value="wishlist" className="font-display">Wishlist</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview">
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
          </TabsContent>

          {/* Orders */}
          <TabsContent value="orders">
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
          </TabsContent>

          {/* RFQs */}
          <TabsContent value="rfqs">
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-xl text-foreground">My RFQs</h2>
                <Button onClick={() => setShowRFQForm(true)} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body gap-2">
                  <FileText className="h-4 w-4" /> Post New RFQ
                </Button>
              </div>
              <div className="space-y-4">
                {rfqs.slice(0, 2).map((rfq) => (
                  <div key={rfq.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start justify-between">
                      <Badge variant="secondary" className="mb-2 font-body">{rfq.category}</Badge>
                      <Badge className="bg-success/10 text-success font-body">Active</Badge>
                    </div>
                    <h3 className="font-display font-semibold text-foreground">{rfq.title}</h3>
                    <p className="text-sm text-muted-foreground font-body mt-1">
                      Qty: {rfq.quantity.toLocaleString()} {rfq.unit} • Budget: {rfq.budget}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                        <Clock className="h-3 w-3" /> {rfq.deadline} left
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-xs text-primary font-semibold font-body">
                          <Users className="h-3 w-3" /> {rfq.bidsCount} bids
                        </div>
                        <Button variant="outline" size="sm" className="font-body text-xs gap-1">
                          <Eye className="h-3 w-3" /> View Bids
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <PostRFQForm open={showRFQForm} onOpenChange={setShowRFQForm} />
          </TabsContent>

          {/* Disputes */}
          <TabsContent value="disputes">
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
                  <p className="text-muted-foreground font-body">
                    You haven't raised any disputes yet.
                  </p>
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
          </TabsContent>

          {/* Reviews */}
          <TabsContent value="reviews">
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
          </TabsContent>

          {/* Wishlist */}
          <TabsContent value="wishlist">
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="font-display font-bold text-xl text-foreground mb-6">My Wishlist</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
          </TabsContent>
        </Tabs>
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
