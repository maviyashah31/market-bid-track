import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { buyerOrders } from "@/data/mockData";
import { Package, CheckCircle2, Truck, Clock, MapPin, ArrowLeft, Box, ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AnimatedPage from "@/components/AnimatedPage";

const allSteps = [
  { key: "placed", label: "Order Placed", icon: ClipboardCheck, desc: "Your order has been placed successfully" },
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
  const order = buyerOrders.find((o) => o.id === orderId) || buyerOrders[0];
  const currentIdx = statusIndex[order.status] ?? 0;

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
              <h1 className="font-display font-bold text-2xl text-foreground">Order {order.id}</h1>
              <p className="text-muted-foreground font-body text-sm mt-1">{order.productName} • Qty: {order.quantity}</p>
            </div>
            <div className="mt-3 sm:mt-0 text-right">
              <div className="font-display font-bold text-xl text-primary">PKR {order.total.toLocaleString()}</div>
              <Badge variant="secondary" className="font-body mt-1">{order.sellerName}</Badge>
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
                      <p className="text-xs text-muted-foreground font-body mt-1">{order.date}</p>
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
  );
};

export default OrderTracking;