import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CheckCircle2, Package, ArrowRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedPage from "@/components/AnimatedPage";

const OrderConfirmation = () => {
  const orderId = "ORD-2024-004";

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <div className="bg-card rounded-2xl border border-border p-8 sm:p-12">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>

            <h1 className="font-display font-bold text-3xl text-foreground mb-2">Order Placed Successfully!</h1>
            <p className="text-muted-foreground font-body mb-6">
              Thank you for your order. Your order ID is{" "}
              <span className="font-display font-bold text-primary">{orderId}</span>
            </p>

            <div className="bg-accent/50 rounded-xl p-6 mb-8 text-left space-y-3">
              <h3 className="font-display font-semibold text-foreground">What happens next?</h3>
              <div className="space-y-2 text-sm font-body text-muted-foreground">
                <p className="flex items-start gap-2"><span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">1</span> Sellers will confirm your order within 24 hours</p>
                <p className="flex items-start gap-2"><span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">2</span> Your payment is held securely in escrow</p>
                <p className="flex items-start gap-2"><span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">3</span> You'll receive tracking updates via notifications</p>
                <p className="flex items-start gap-2"><span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold shrink-0">4</span> Confirm delivery to release payment to seller</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link to={`/order/${orderId}`}>
                <Button className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold gap-2 w-full">
                  <Package className="h-4 w-4" /> Track Order
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="outline" className="font-body gap-2 w-full">
                  <MessageSquare className="h-4 w-4" /> Message Seller
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="font-body gap-2 w-full">
                  Continue Shopping <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default OrderConfirmation;
