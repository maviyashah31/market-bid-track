import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/mockData";
import { BadgeCheck, Star, MapPin, Clock, ShoppingCart, MessageSquare, Shield, Truck, ArrowLeft, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AnimatedPage from "@/components/AnimatedPage";

const moqTiers = [
  { range: "1 - 99", price: "350" },
  { range: "100 - 499", price: "280" },
  { range: "500 - 999", price: "220" },
  { range: "1000+", price: "180" },
];

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === id) || products[0];
  const [quantity, setQuantity] = useState(product.moq);

  const getCurrentPrice = () => {
    if (quantity >= 1000) return 180;
    if (quantity >= 500) return 220;
    if (quantity >= 100) return 280;
    return 350;
  };

  const subtotal = quantity * getCurrentPrice();

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 font-body">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="rounded-xl overflow-hidden border border-border bg-card">
            <img src={product.image} alt={product.name} className="w-full aspect-square object-cover" />
          </div>

          <div>
            <Badge variant="secondary" className="mb-3 font-body">{product.category}</Badge>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-4">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1">
                {product.sellerVerified && <BadgeCheck className="h-5 w-5 text-verified" />}
                <span className="font-display font-semibold text-foreground">{product.sellerName}</span>
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground font-body">
                <Star className="h-4 w-4 fill-warning text-warning" />
                {product.sellerRating} ({product.ordersCompleted} orders)
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground font-body">
                <MapPin className="h-4 w-4" />
                {product.sellerLocation}
              </div>
            </div>

            <div className="bg-accent rounded-xl p-6 mb-6">
              <div className="font-display font-extrabold text-3xl text-primary mb-1">
                PKR {product.minPrice} - {product.maxPrice}
                <span className="text-base font-normal text-muted-foreground"> / {product.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground font-body">MOQ: {product.moq} {product.unit}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-display font-semibold text-foreground mb-3">Pricing Tiers</h3>
              <div className="grid grid-cols-4 gap-2">
                {moqTiers.map((tier) => (
                  <div key={tier.range} className="text-center p-3 rounded-lg border border-border bg-card">
                    <div className="text-xs text-muted-foreground font-body mb-1">{tier.range}</div>
                    <div className="font-display font-bold text-foreground">PKR {tier.price}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-display font-semibold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - (product.moq >= 100 ? 100 : 10)))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-28 text-center font-display font-bold text-lg"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(quantity + (product.moq >= 100 ? 100 : 10))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground font-body">{product.unit}</span>
              </div>
              {quantity < product.moq && (
                <p className="text-xs text-destructive font-body mt-2">Minimum order quantity is {product.moq} {product.unit}</p>
              )}
              <div className="mt-3 flex items-center justify-between p-3 rounded-lg bg-accent border border-border">
                <span className="text-sm text-muted-foreground font-body">Subtotal ({quantity} × PKR {getCurrentPrice()})</span>
                <span className="font-display font-bold text-primary text-lg">PKR {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Link to="/cart" className="flex-1">
                <Button className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 h-12 gap-2 font-display font-semibold">
                  <ShoppingCart className="h-5 w-5" /> Add to Cart
                </Button>
              </Link>
              <Link to="/messages">
                <Button variant="outline" className="h-12 gap-2 font-body">
                  <MessageSquare className="h-5 w-5" /> Contact Seller
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Shield, text: "Escrow Payment" },
                { icon: Truck, text: "Pan-PK Delivery" },
                { icon: Clock, text: product.responseTime },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-lg bg-card border border-border text-center">
                  <Icon className="h-5 w-5 text-primary" />
                  <span className="text-xs font-body text-muted-foreground">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </AnimatedPage>
  );
};

export default ProductDetail;