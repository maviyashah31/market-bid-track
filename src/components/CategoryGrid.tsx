import { Search, ShoppingCart, CreditCard, PackageCheck } from "lucide-react";

const steps = [
  { icon: Search, step: "1", title: "Search Products", desc: "Browse thousands of products from verified suppliers" },
  { icon: ShoppingCart, step: "2", title: "Add to Cart", desc: "Select items and quantities that fit your needs" },
  { icon: CreditCard, step: "3", title: "Place Order", desc: "Secure checkout with escrow-protected payments" },
  { icon: PackageCheck, step: "4", title: "Get Delivered", desc: "Fast & reliable delivery across Pakistan" },
];

const CategoryGrid = () => (
  <section className="py-4 sm:py-5 bg-[hsl(220,30%,15%)]">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {steps.map((s) => (
          <div key={s.step} className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 transition-all">
            <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center mb-2">
              <s.icon className="h-4 w-4 text-white" />
            </div>
            <span className="text-[10px] font-bold text-white uppercase tracking-wider mb-0.5">Step {s.step}</span>
            <h3 className="font-display font-bold text-sm text-white mb-0.5">{s.title}</h3>
            <p className="text-[11px] text-white/90 font-body leading-snug">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryGrid;
