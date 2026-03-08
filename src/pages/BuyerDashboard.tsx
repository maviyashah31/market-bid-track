import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { buyerOrders, products, rfqs } from "@/data/mockData";
import {
  Package, FileText, MessageSquare, Star, Heart, ShoppingCart,
  ArrowRight, Clock, Eye, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnimatedPage from "@/components/AnimatedPage";

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
  { icon: Package, label: "My Orders", count: 3, tab: "orders" },
  { icon: FileText, label: "My RFQs", count: 2, tab: "rfqs" },
  { icon: MessageSquare, label: "Messages", count: 5, href: "/messages" },
  { icon: Star, label: "Reviews", count: 8, tab: "reviews" },
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
                <Icon className="h-6 w-6 text-primary" />
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
                <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">Post New RFQ</Button>
              </div>
              <div className="space-y-4">
                {rfqs.slice(0, 2).map((rfq) => (
                  <div key={rfq.id} className="border border-border rounded-lg p-4 hover:shadow-md transition">
                    <Badge variant="secondary" className="mb-2 font-body">{rfq.category}</Badge>
                    <h3 className="font-display font-semibold text-foreground">{rfq.title}</h3>
                    <p className="text-sm text-muted-foreground font-body mt-1">
                      Qty: {rfq.quantity.toLocaleString()} {rfq.unit} • Budget: {rfq.budget}
                    </p>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                      <span className="text-xs text-muted-foreground font-body">{rfq.deadline} left</span>
                      <Badge className="bg-primary/10 text-primary font-body">{rfq.bidsCount} bids received</Badge>
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
    </AnimatedPage>
  );
};

export default BuyerDashboard;