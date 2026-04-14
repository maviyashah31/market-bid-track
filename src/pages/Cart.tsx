import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Minus, Plus, Trash2, ArrowLeft, Shield, Loader2, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import AnimatedPage from "@/components/AnimatedPage";
import { useCart, useUpdateCartItem, useRemoveCartItem } from "@/hooks/useCart";
import { toast } from "sonner";

const Cart = () => {
  const { data: cartItems = [], isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const updateQty = (id: string, currentQty: number, moq: number, delta: number) => {
    const newQty = Math.max(moq, currentQty + delta);
    updateItem.mutate({ id, quantity: newQty });
  };

  const handleRemove = (id: string) => {
    removeItem.mutate(id, {
      onSuccess: () => toast.success("Item removed from cart"),
    });
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.min_price || 0) * item.quantity,
    0
  );

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 font-body">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">Shopping Cart ({cartItems.length})</h1>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display font-bold text-xl text-foreground mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground font-body mb-6">Browse products and add them to your cart.</p>
            <Link to="/products">
              <Button className="bg-gradient-hero text-primary-foreground">Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const product = item.product;
                if (!product) return null;
                const image = product.images?.[0] || "/placeholder.svg";
                const sellerName = product.profiles?.full_name || "Unknown Seller";

                return (
                  <div key={item.id} className="bg-card rounded-xl border border-border p-3 sm:p-4 flex gap-3 sm:gap-4">
                    <img src={image} alt={product.name} className="w-16 h-16 sm:w-24 sm:h-24 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display font-semibold text-foreground text-sm sm:text-base truncate">{product.name}</h3>
                      <p className="text-xs text-muted-foreground font-body">{sellerName}</p>
                      <p className="font-display font-bold text-primary mt-1 text-sm sm:text-base">PKR {product.min_price}/{product.unit}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-border rounded-lg">
                          <button onClick={() => updateQty(item.id, item.quantity, product.moq, -50)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-1 text-sm font-body font-medium text-foreground border-x border-border">{item.quantity}</span>
                          <button onClick={() => updateQty(item.id, item.quantity, product.moq, 50)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button onClick={() => handleRemove(item.id)} className="text-destructive hover:text-destructive/80">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-right font-display font-bold text-foreground text-sm sm:text-base hidden sm:block">
                      PKR {(product.min_price * item.quantity).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="bg-card rounded-xl border border-border p-6 h-fit sticky top-32">
              <h2 className="font-display font-bold text-xl text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-body">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-success font-medium">Calculated at checkout</span>
                </div>
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-display font-bold text-foreground">Total</span>
                  <span className="font-display font-bold text-xl text-primary">PKR {subtotal.toLocaleString()}</span>
                </div>
              </div>
              <Link to="/checkout">
                <Button className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-12 font-display font-semibold">
                  Proceed to Checkout
                </Button>
              </Link>
              <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground font-body justify-center">
                <Shield className="h-4 w-4 text-primary" /> Secure escrow payment
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
    </AnimatedPage>
  );
};

export default Cart;
