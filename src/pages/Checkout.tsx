import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Shield, CreditCard, Building2, Wallet, Truck, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import AnimatedPage from "@/components/AnimatedPage";
import { toast } from "sonner";

const cartItems = [
  { id: "1", name: "Premium Cotton T-Shirts - Bulk", price: 220, quantity: 500, unit: "pcs", seller: "Lahore Textile Mills" },
  { id: "3", name: "Leather Football - Match Quality", price: 550, quantity: 200, unit: "pcs", seller: "Sialkot Sports Co." },
  { id: "6", name: "Genuine Leather Wallet - Premium", price: 850, quantity: 100, unit: "pcs", seller: "Multan Leather Works" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"shipping" | "payment" | "review">("shipping");
  const [paymentMethod, setPaymentMethod] = useState("escrow");
  const [shipping, setShipping] = useState({
    fullName: "", company: "", phone: "", email: "",
    address: "", city: "", state: "", zip: "", notes: "",
  });

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shippingCost = 15000;
  const total = subtotal + shippingCost;

  const updateShipping = (field: string, value: string) =>
    setShipping((prev) => ({ ...prev, [field]: value }));

  const canProceedShipping = shipping.fullName && shipping.phone && shipping.address && shipping.city;

  const handlePlaceOrder = () => {
    toast.success("Order placed successfully! Order ID: ORD-2024-004");
    navigate("/order-confirmation");
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Link to="/cart" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6 font-body">
            <ArrowLeft className="h-4 w-4" /> Back to Cart
          </Link>

          <h1 className="font-display font-bold text-3xl text-foreground mb-8">Checkout</h1>

          {/* Steps indicator */}
          <div className="flex items-center gap-2 mb-8">
            {[
              { key: "shipping", label: "Shipping", icon: Truck },
              { key: "payment", label: "Payment", icon: CreditCard },
              { key: "review", label: "Review", icon: CheckCircle2 },
            ].map(({ key, label, icon: Icon }, idx) => (
              <div key={key} className="flex items-center gap-2">
                {idx > 0 && <div className={`h-px w-8 sm:w-16 ${["shipping", "payment", "review"].indexOf(step) >= idx ? "bg-primary" : "bg-border"}`} />}
                <button
                  onClick={() => {
                    const steps = ["shipping", "payment", "review"];
                    if (steps.indexOf(key) <= steps.indexOf(step)) setStep(key as typeof step);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-display font-semibold transition ${
                    step === key ? "bg-primary text-primary-foreground" : ["shipping", "payment", "review"].indexOf(step) > idx ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </button>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Shipping */}
              {step === "shipping" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" /> Shipping Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="font-body text-sm">Full Name *</Label>
                      <Input value={shipping.fullName} onChange={(e) => updateShipping("fullName", e.target.value)} placeholder="Muhammad Ahmed" className="mt-1" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">Company Name</Label>
                      <Input value={shipping.company} onChange={(e) => updateShipping("company", e.target.value)} placeholder="AcmeCo Pakistan" className="mt-1" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">Phone *</Label>
                      <Input value={shipping.phone} onChange={(e) => updateShipping("phone", e.target.value)} placeholder="+92 300 1234567" className="mt-1" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">Email</Label>
                      <Input value={shipping.email} onChange={(e) => updateShipping("email", e.target.value)} placeholder="ahmed@company.com" className="mt-1" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="font-body text-sm">Street Address *</Label>
                      <Input value={shipping.address} onChange={(e) => updateShipping("address", e.target.value)} placeholder="123 Main Street, Block B" className="mt-1" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">City *</Label>
                      <Input value={shipping.city} onChange={(e) => updateShipping("city", e.target.value)} placeholder="Lahore" className="mt-1" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">Province / State</Label>
                      <Input value={shipping.state} onChange={(e) => updateShipping("state", e.target.value)} placeholder="Punjab" className="mt-1" />
                    </div>
                    <div>
                      <Label className="font-body text-sm">ZIP / Postal Code</Label>
                      <Input value={shipping.zip} onChange={(e) => updateShipping("zip", e.target.value)} placeholder="54000" className="mt-1" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="font-body text-sm">Delivery Notes</Label>
                      <Textarea value={shipping.notes} onChange={(e) => updateShipping("notes", e.target.value)} placeholder="Special instructions for delivery..." className="mt-1" />
                    </div>
                  </div>
                  <Button
                    onClick={() => setStep("payment")}
                    disabled={!canProceedShipping}
                    className="mt-6 bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold"
                  >
                    Continue to Payment
                  </Button>
                </div>
              )}

              {/* Payment */}
              {step === "payment" && (
                <div className="bg-card rounded-xl border border-border p-6">
                  <h2 className="font-display font-bold text-xl text-foreground mb-6 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" /> Payment Method
                  </h2>
                  <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                    {[
                      { value: "escrow", label: "Escrow Payment", desc: "Secure payment held until you confirm delivery", icon: Shield },
                      { value: "bank", label: "Bank Transfer", desc: "Direct bank transfer with order confirmation", icon: Building2 },
                      { value: "cod", label: "Cash on Delivery", desc: "Pay when you receive the goods (extra charges apply)", icon: Wallet },
                    ].map(({ value, label, desc, icon: Icon }) => (
                      <label
                        key={value}
                        className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition ${
                          paymentMethod === value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                        }`}
                      >
                        <RadioGroupItem value={value} className="mt-1" />
                        <Icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <span className="font-display font-semibold text-foreground">{label}</span>
                          <p className="text-sm text-muted-foreground font-body">{desc}</p>
                        </div>
                      </label>
                    ))}
                  </RadioGroup>

                  {paymentMethod === "escrow" && (
                    <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h3 className="font-display font-semibold text-foreground mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-primary" /> How Escrow Works
                      </h3>
                      <ol className="text-sm text-muted-foreground font-body space-y-1 list-decimal list-inside">
                        <li>You place the order and funds are held securely</li>
                        <li>Seller ships the goods with tracking</li>
                        <li>You inspect and confirm delivery</li>
                        <li>Funds are released to the seller</li>
                      </ol>
                    </div>
                  )}

                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={() => setStep("shipping")} className="font-body">Back</Button>
                    <Button onClick={() => setStep("review")} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold">
                      Review Order
                    </Button>
                  </div>
                </div>
              )}

              {/* Review */}
              {step === "review" && (
                <div className="space-y-6">
                  <div className="bg-card rounded-xl border border-border p-6">
                    <h2 className="font-display font-bold text-xl text-foreground mb-4">Order Review</h2>
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                          <div>
                            <p className="font-display font-semibold text-foreground text-sm">{item.name}</p>
                            <p className="text-xs text-muted-foreground font-body">{item.seller} • {item.quantity} {item.unit} × PKR {item.price}</p>
                          </div>
                          <span className="font-display font-bold text-foreground">PKR {(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="font-display font-semibold text-foreground mb-3">Shipping To</h3>
                    <p className="text-sm text-muted-foreground font-body">
                      {shipping.fullName}{shipping.company && ` • ${shipping.company}`}<br />
                      {shipping.address}, {shipping.city}{shipping.state && `, ${shipping.state}`} {shipping.zip}<br />
                      {shipping.phone}{shipping.email && ` • ${shipping.email}`}
                    </p>
                  </div>

                  <div className="bg-card rounded-xl border border-border p-6">
                    <h3 className="font-display font-semibold text-foreground mb-3">Payment</h3>
                    <p className="text-sm text-muted-foreground font-body capitalize">{paymentMethod === "cod" ? "Cash on Delivery" : paymentMethod === "bank" ? "Bank Transfer" : "Escrow Payment"}</p>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep("payment")} className="font-body">Back</Button>
                    <Button onClick={handlePlaceOrder} className="bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold h-12 px-8">
                      Place Order — PKR {total.toLocaleString()}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-card rounded-xl border border-border p-6 h-fit sticky top-32">
              <h2 className="font-display font-bold text-lg text-foreground mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm font-body">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground truncate mr-2">{item.name}</span>
                    <span className="text-foreground font-medium whitespace-nowrap">PKR {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">PKR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground font-medium">PKR {shippingCost.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-display font-bold text-foreground">Total</span>
                  <span className="font-display font-bold text-xl text-primary">PKR {total.toLocaleString()}</span>
                </div>
              </div>
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

export default Checkout;
