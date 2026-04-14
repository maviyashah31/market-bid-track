import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProduct, useProductPricingTiers } from "@/hooks/useProducts";
import { useAddToCart } from "@/hooks/useCart";
import { BadgeCheck, Star, Clock, ShoppingCart, MessageSquare, Shield, Truck, ArrowLeft, Minus, Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import AnimatedPage from "@/components/AnimatedPage";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: product, isLoading } = useProduct(id);
  const { data: pricingTiers = [] } = useProductPricingTiers(id);
  const addToCart = useAddToCart();
  const [quantity, setQuantity] = useState(1);

  // Set initial quantity to MOQ once product loads
  const moq = product?.moq || 1;
  if (product && quantity < moq && quantity === 1) {
    setQuantity(moq);
  }

  const getCurrentPrice = () => {
    if (!product) return 0;
    if (pricingTiers.length === 0) return product.min_price;

    // Find the applicable tier based on quantity
    const tier = [...pricingTiers]
      .sort((a, b) => b.min_quantity - a.min_quantity)
      .find(t => quantity >= t.min_quantity);

    return tier?.price_per_unit || product.min_price;
  };

  const subtotal = quantity * getCurrentPrice();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display font-bold text-2xl text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground font-body mb-6">This product may have been removed or is no longer available.</p>
          <Link to="/products">
            <Button>Browse Products</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const sellerName = product.profiles?.full_name || "Unknown Seller";
  const categoryName = product.categories?.name || "Uncategorized";
  const productImage = product.images?.[0] || "/placeholder.svg";

  // Build pricing tiers display
  const tiersDisplay = pricingTiers.length > 0
    ? pricingTiers.map(t => ({
        range: t.max_quantity ? `${t.min_quantity} - ${t.max_quantity}` : `${t.min_quantity}+`,
        price: t.price_per_unit.toLocaleString(),
      }))
    : [{ range: `${product.moq}+`, price: product.min_price.toLocaleString() }];

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 font-body">
          <ArrowLeft className="h-4 w-4" /> Back to Products
        </Link>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Image gallery */}
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden border border-border bg-card">
              <img src={productImage} alt={product.name} className="w-full aspect-square object-cover" />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-border bg-card aspect-square">
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <Badge variant="secondary" className="mb-3 font-body">{categoryName}</Badge>
            <h1 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-4">{product.name}</h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-6">
              <Link to={`/seller/${product.seller_id}`} className="flex items-center gap-1 hover:text-primary transition-colors">
                <BadgeCheck className="h-5 w-5 text-verified" />
                <span className="font-display font-semibold text-foreground hover:text-primary transition-colors underline-offset-2 hover:underline">{sellerName}</span>
              </Link>
              <div className="flex items-center gap-1 text-sm text-muted-foreground font-body">
                <Star className="h-4 w-4 fill-warning text-warning" />
                0 reviews
              </div>
            </div>

            {product.description && (
              <p className="text-muted-foreground font-body mb-6">{product.description}</p>
            )}

            <div className="bg-accent rounded-xl p-6 mb-6">
              <div className="font-display font-extrabold text-3xl text-primary mb-1">
                PKR {product.min_price.toLocaleString()}
                {product.max_price && product.max_price !== product.min_price && ` - ${product.max_price.toLocaleString()}`}
                <span className="text-base font-normal text-muted-foreground"> / {product.unit}</span>
              </div>
              <p className="text-sm text-muted-foreground font-body">MOQ: {product.moq} {product.unit}</p>
            </div>

            {tiersDisplay.length > 0 && (
              <div className="mb-6">
                <h3 className="font-display font-semibold text-foreground mb-3">Pricing Tiers</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {tiersDisplay.map((tier) => (
                    <div key={tier.range} className="text-center p-2 sm:p-3 rounded-lg border border-border bg-card">
                      <div className="text-xs text-muted-foreground font-body mb-1">{tier.range}</div>
                      <div className="font-display font-bold text-sm sm:text-base text-foreground">PKR {tier.price}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-display font-semibold text-foreground mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-10 w-10"
                  onClick={() => setQuantity(Math.max(1, quantity - (moq >= 100 ? 100 : 10)))}
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
                  onClick={() => setQuantity(quantity + (moq >= 100 ? 100 : 10))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground font-body">{product.unit}</span>
              </div>
              {quantity < moq && (
                <p className="text-xs text-destructive font-body mt-2">Minimum order quantity is {moq} {product.unit}</p>
              )}
              <div className="mt-3 flex items-center justify-between p-3 rounded-lg bg-accent border border-border">
                <span className="text-sm text-muted-foreground font-body">Subtotal ({quantity} × PKR {getCurrentPrice().toLocaleString()})</span>
                <span className="font-display font-bold text-primary text-lg">PKR {subtotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-3 mb-6">
              <Button
                className="flex-1 bg-gradient-hero text-primary-foreground hover:opacity-90 h-12 gap-2 font-display font-semibold"
                disabled={addToCart.isPending || quantity < moq}
                onClick={() => {
                  if (!product) return;
                  addToCart.mutate(
                    { productId: product.id, quantity },
                    {
                      onSuccess: () => {
                        toast.success("Added to cart!", { description: `${quantity} ${product.unit} of ${product.name}` });
                        navigate("/cart");
                      },
                      onError: () => toast.error("Failed to add to cart. Please sign in first."),
                    }
                  );
                }}
              >
                {addToCart.isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <ShoppingCart className="h-5 w-5" />}
                Add to Cart
              </Button>
              <Link to="/messages">
                <Button variant="outline" className="h-12 gap-2 font-body">
                  <MessageSquare className="h-5 w-5" /> Contact Seller
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { icon: Shield, text: "Escrow Payment" },
                { icon: Truck, text: "Pan-PK Delivery" },
                { icon: Clock, text: "< 24 hours" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1 sm:gap-1.5 p-2 sm:p-3 rounded-lg bg-card border border-border text-center">
                  <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span className="text-[10px] sm:text-xs font-body text-muted-foreground">{text}</span>
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
