import { Search, ShoppingCart, PackageCheck } from "lucide-react";

const steps = [
  { icon: Search, step: "Step 1", title: "Browse Products", desc: "Find what you need from verified suppliers" },
  { icon: ShoppingCart, step: "Step 2", title: "Add to Cart", desc: "Select quantities and add items to your cart" },
  { icon: PackageCheck, step: "Step 3", title: "Checkout & Delivered", desc: "Place your order and get it delivered fast" },
];

const HowItWorks = () => (
  <section className="bg-muted/50 py-4 border-b border-border">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-3 gap-4 max-w-3xl mx-auto">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center text-center gap-1.5">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xs font-semibold text-primary">{s.step}</span>
            <h3 className="font-display font-bold text-foreground text-sm">{s.title}</h3>
            <p className="text-muted-foreground text-xs leading-snug hidden sm:block">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
