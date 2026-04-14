import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { useOrder } from "@/hooks/useOrders";
import { Package, CheckCircle2, Truck, MapPin, ArrowLeft, Box, ClipboardCheck, Loader2, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnimatedPage from "@/components/AnimatedPage";

const allSteps = [
  { key: "pending", label: "Order Placed", icon: ClipboardCheck, desc: "Your order has been placed successfully" },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2, desc: "Seller has confirmed your order" },
  { key: "processing", label: "Processing", icon: Package, desc: "Order is being prepared" },
  { key: "packed", label: "Packed", icon: Box, desc: "Order has been packed" },
  { key: "shipped", label: "Shipped", icon: Truck, desc: "Order has left the warehouse" },
  { key: "in_transit", label: "In Transit", icon: MapPin, desc: "Order is on its way to you" },
  { key: "delivered", label: "Delivered", icon: CheckCircle2, desc: "Order has been delivered" },
];

const statusIndex: Record<string, number> = {};
allSteps.forEach((s, i) => { statusIndex[s.key] = i; });

const OrderTracking = () => {
  const { orderId } = useParams();
  const { data: order, isLoading } = useOrder(orderId);
  const currentIdx = statusIndex[order?.status || "pending"] ?? 0;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display font-bold text-2xl mb-4">Order Not Found</h1>
          <Link to="/buyer/dashboard"><Button>Go to Dashboard</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/buyer/dashboard" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 font-body">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>

        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <div>
              <h1 className="font-display font-bold text-2xl text-foreground">Order {order.order_number}</h1>
              <p className="text-muted-foreground font-body text-sm mt-1">
                {order.order_items?.map(i => i.product_name_snapshot).join(", ") || "Order"} • {order.order_items?.reduce((sum, i) => sum + i.quantity, 0) || 0} items
              </p>
            </div>
            <div className="mt-3 sm:mt-0 text-right">
              <div className="font-display font-bold text-xl text-primary">PKR {order.total_amount.toLocaleString()}</div>
              <Badge variant="secondary" className="font-body mt-1">{order.seller?.full_name || "Seller"}</Badge>
            </div>
          </div>

          {/* Timeline */}
          <div className="relative">
            {allSteps.map((step, idx) => {
              const Icon = step.icon;
              const isCompleted = idx <= currentIdx;
              const isCurrent = idx === currentIdx;
              const isLast = idx === allSteps.length - 1;

              return (
                <div key={step.key} className="flex gap-4">
                  {/* Line + dot */}
                  <div className="flex flex-col items-center">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                      isCurrent
                        ? "bg-primary text-primary-foreground shadow-glow"
                        : isCompleted
                          ? "bg-success text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 h-12 ${idx < currentIdx ? "bg-success" : "bg-border"}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-2 pb-6">
                    <h3 className={`font-display font-semibold text-sm ${
                      isCompleted ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {step.label}
                      {isCurrent && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs text-primary font-body">
                          <Clock className="h-3 w-3" /> Current
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-muted-foreground font-body mt-0.5">{step.desc}</p>
                    {isCompleted && idx <= currentIdx && (
                      <p className="text-xs text-muted-foreground font-body mt-1">
                        {new Date(order.created_at).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/messages" className="flex-1">
            <Button variant="outline" className="w-full font-body">Contact Seller</Button>
          </Link>
          <Link to="/buyer/dashboard" className="flex-1">
            <Button className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">View All Orders</Button>
          </Link>
        </div>
      </div>
    </div>
    </AnimatedPage>
  );
};

export default OrderTracking;