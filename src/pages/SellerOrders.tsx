import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AnimatedPage from "@/components/AnimatedPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  ShoppingCart, Search, Filter, Eye, Truck, Package, CheckCircle, Clock,
  ArrowLeft, ChevronRight, MapPin, User, Phone, Mail, FileText, MessageSquare
} from "lucide-react";

const allOrders = [
  { id: "ORD-5001", product: "Cotton T-Shirts x500", buyer: "Metro Wholesale", buyerEmail: "orders@metrowholesale.pk", buyerPhone: "+92 321 1234567", total: "PKR 175,000", status: "pending", date: "2026-03-08", address: "Shop #45, Bolton Market, Karachi", paymentStatus: "escrow" },
  { id: "ORD-5002", product: "Polo Shirts x200", buyer: "Style Hub", buyerEmail: "buy@stylehub.pk", buyerPhone: "+92 300 9876543", total: "PKR 96,000", status: "processing", date: "2026-03-07", address: "Mall Road, Lahore", paymentStatus: "escrow" },
  { id: "ORD-5003", product: "Denim Jeans x300", buyer: "Fashion Point", buyerEmail: "procurement@fashionpoint.pk", buyerPhone: "+92 333 5556677", total: "PKR 285,000", status: "shipped", date: "2026-03-05", address: "Blue Area, Islamabad", paymentStatus: "escrow" },
  { id: "ORD-5004", product: "Cotton Fabric 1000m", buyer: "AL Textiles", buyerEmail: "info@altextiles.pk", buyerPhone: "+92 312 7778899", total: "PKR 450,000", status: "delivered", date: "2026-03-01", address: "Faisalabad Road, Faisalabad", paymentStatus: "released" },
  { id: "ORD-5005", product: "Silk Scarves x150", buyer: "Karachi Traders", buyerEmail: "buy@karachitraders.pk", buyerPhone: "+92 345 1112233", total: "PKR 67,500", status: "pending", date: "2026-03-08", address: "Tariq Road, Karachi", paymentStatus: "escrow" },
  { id: "ORD-5006", product: "Leather Jackets x50", buyer: "Premium Wear", buyerEmail: "orders@premiumwear.pk", buyerPhone: "+92 301 4445566", total: "PKR 375,000", status: "processing", date: "2026-03-06", address: "Liberty Market, Lahore", paymentStatus: "escrow" },
  { id: "ORD-5007", product: "Sports Kits x400", buyer: "AllSports PK", buyerEmail: "bulk@allsportspk.com", buyerPhone: "+92 322 8889900", total: "PKR 520,000", status: "delivered", date: "2026-02-25", address: "Sialkot Export Zone", paymentStatus: "released" },
  { id: "ORD-5008", product: "Bedsheets x600", buyer: "HomeDecor Plus", buyerEmail: "supply@homedecorplus.pk", buyerPhone: "+92 311 3334455", total: "PKR 210,000", status: "shipped", date: "2026-03-04", address: "GT Road, Gujranwala", paymentStatus: "escrow" },
];

const statusColors: Record<string, string> = {
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-verified/10 text-verified border-verified/20",
  shipped: "bg-primary/10 text-primary border-primary/20",
  delivered: "bg-success/10 text-success border-success/20",
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
};

const nextStatus: Record<string, string> = {
  pending: "processing",
  processing: "shipped",
  shipped: "delivered",
};

const nextStatusLabel: Record<string, string> = {
  pending: "Accept & Process",
  processing: "Mark as Shipped",
  shipped: "Mark as Delivered",
};

const SellerOrders = () => {
  const [orders, setOrders] = useState(allOrders);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<typeof allOrders[0] | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const filtered = orders.filter((o) => {
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase()) || o.buyer.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    shipped: orders.filter(o => o.status === "shipped").length,
    delivered: orders.filter(o => o.status === "delivered").length,
  };

  const updateStatus = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && nextStatus[o.status]) {
        return { ...o, status: nextStatus[o.status] };
      }
      return o;
    }));
    if (selectedOrder?.id === orderId && nextStatus[selectedOrder.status]) {
      setSelectedOrder(prev => prev ? { ...prev, status: nextStatus[prev.status] } : null);
    }
  };

  const openDetail = (order: typeof allOrders[0]) => {
    setSelectedOrder(order);
    setDetailOpen(true);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Link to="/seller/dashboard">
              <Button variant="outline" size="sm" className="h-9 w-9 p-0">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display font-bold text-xl sm:text-2xl text-foreground">Order Management</h1>
              <p className="text-xs text-muted-foreground font-body">{orders.length} total orders</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {(["all", "pending", "processing", "shipped", "delivered"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-xl border p-3 text-center transition-all ${statusFilter === s ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border bg-card hover:bg-accent/30"}`}
              >
                <p className="font-display font-bold text-lg text-foreground">{counts[s]}</p>
                <p className="text-xs text-muted-foreground font-body capitalize">{s === "all" ? "All Orders" : s}</p>
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by order ID, product, or buyer..." className="pl-9" />
            </div>
          </div>

          {/* Orders List */}
          <div className="space-y-3">
            {filtered.map((order) => {
              const StatusIcon = statusIcons[order.status] || Clock;
              return (
                <div
                  key={order.id}
                  className="bg-card rounded-xl border border-border p-4 sm:p-5 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => openDetail(order)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-lg shrink-0 ${statusColors[order.status]}`}>
                        <StatusIcon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-display font-bold text-sm text-foreground">{order.id}</span>
                          <Badge variant="outline" className={`text-[10px] capitalize ${statusColors[order.status]}`}>{order.status}</Badge>
                        </div>
                        <p className="font-body text-sm text-foreground mt-0.5 truncate">{order.product}</p>
                        <p className="text-xs text-muted-foreground font-body mt-0.5">{order.buyer} • {order.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="font-display font-bold text-sm text-foreground">{order.total}</p>
                        <p className="text-[10px] text-muted-foreground font-body capitalize">{order.paymentStatus}</p>
                      </div>
                      {nextStatus[order.status] && (
                        <Button
                          size="sm"
                          className="text-xs font-body shrink-0"
                          onClick={(e) => { e.stopPropagation(); updateStatus(order.id); }}
                        >
                          {nextStatusLabel[order.status]}
                        </Button>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                    </div>
                  </div>
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="text-center py-16">
                <ShoppingCart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="font-display font-semibold text-foreground">No orders found</p>
                <p className="text-sm text-muted-foreground font-body">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Detail Dialog */}
        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
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
                  {/* Product */}
                  <div className="bg-accent/30 rounded-lg p-4">
                    <p className="text-xs text-muted-foreground font-body mb-1">Product</p>
                    <p className="font-body font-semibold text-foreground text-sm">{selectedOrder.product}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-display font-bold text-foreground">{selectedOrder.total}</span>
                      <Badge variant="outline" className="text-[10px] capitalize">{selectedOrder.paymentStatus} payment</Badge>
                    </div>
                  </div>

                  {/* Buyer Info */}
                  <div className="space-y-2">
                    <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Buyer Details</p>
                    <div className="grid gap-2 text-sm font-body">
                      <div className="flex items-center gap-2 text-foreground"><User className="h-3.5 w-3.5 text-muted-foreground" />{selectedOrder.buyer}</div>
                      <div className="flex items-center gap-2 text-foreground"><Mail className="h-3.5 w-3.5 text-muted-foreground" />{selectedOrder.buyerEmail}</div>
                      <div className="flex items-center gap-2 text-foreground"><Phone className="h-3.5 w-3.5 text-muted-foreground" />{selectedOrder.buyerPhone}</div>
                      <div className="flex items-center gap-2 text-foreground"><MapPin className="h-3.5 w-3.5 text-muted-foreground" />{selectedOrder.address}</div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="space-y-2">
                    <p className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">Order Timeline</p>
                    <div className="space-y-3 pl-3 border-l-2 border-border">
                      {["pending", "processing", "shipped", "delivered"].map((step, i) => {
                        const steps = ["pending", "processing", "shipped", "delivered"];
                        const currentIdx = steps.indexOf(selectedOrder.status);
                        const done = i <= currentIdx;
                        const StepIcon = statusIcons[step];
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

                <DialogFooter className="flex-col sm:flex-row gap-2">
                  <Link to="/messages" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full gap-2 font-body"><MessageSquare className="h-4 w-4" />Message Buyer</Button>
                  </Link>
                  {nextStatus[selectedOrder.status] && (
                    <Button className="w-full sm:w-auto font-body gap-2" onClick={() => updateStatus(selectedOrder.id)}>
                      {nextStatusLabel[selectedOrder.status]}
                    </Button>
                  )}
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AnimatedPage>
  );
};

export default SellerOrders;
