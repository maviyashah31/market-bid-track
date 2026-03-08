import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Minus, Plus, Trash2, ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AnimatedPage from "@/components/AnimatedPage";

interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  moq: number;
  unit: string;
  seller: string;
}

const initialItems: CartItem[] = [
  { id: "1", name: "Premium Cotton T-Shirts - Bulk", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200", price: 220, quantity: 500, moq: 500, unit: "pcs", seller: "Lahore Textile Mills" },
  { id: "3", name: "Leather Football - Match Quality", image: "https://images.unsplash.com/photo-1614632537197-38a17061c2bd?w=200", price: 550, quantity: 200, moq: 200, unit: "pcs", seller: "Sialkot Sports Co." },
  { id: "6", name: "Genuine Leather Wallet - Premium", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=200", price: 850, quantity: 100, moq: 50, unit: "pcs", seller: "Multan Leather Works" },
];

const Cart = () => {
  const [items, setItems] = useState(initialItems);

  const updateQty = (id: string, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(item.moq, item.quantity + delta) } : item
      )
    );
  };

  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 font-body">
          <ArrowLeft className="h-4 w-4" /> Continue Shopping
        </Link>

        <h1 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">Shopping Cart ({items.length})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-card rounded-xl border border-border p-4 flex gap-4">
                <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
                <div className="flex-1">
                  <h3 className="font-display font-semibold text-foreground">{item.name}</h3>
                  <p className="text-xs text-muted-foreground font-body">{item.seller}</p>
                  <p className="font-display font-bold text-primary mt-1">PKR {item.price}/{item.unit}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => updateQty(item.id, -50)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-3 py-1 text-sm font-body font-medium text-foreground border-x border-border">{item.quantity}</span>
                      <button onClick={() => updateQty(item.id, 50)} className="px-2 py-1 text-muted-foreground hover:text-foreground">
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="text-right font-display font-bold text-foreground">
                  PKR {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
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
      </div>
      <Footer />
    </div>
    </AnimatedPage>
  );
};

export default Cart;
