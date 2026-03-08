import { categories } from "@/data/mockData";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, CreditCard, PackageCheck } from "lucide-react";

const steps = [
  { icon: Search, step: "1", title: "Search Products", desc: "Browse thousands of products from verified suppliers" },
  { icon: ShoppingCart, step: "2", title: "Add to Cart", desc: "Select items and quantities that fit your needs" },
  { icon: CreditCard, step: "3", title: "Place Order", desc: "Secure checkout with escrow-protected payments" },
  { icon: PackageCheck, step: "4", title: "Get Delivered", desc: "Fast & reliable delivery across Pakistan" },
];

const CategoryGrid = () => (
  <section className="py-10 bg-card">
    <div className="container mx-auto px-4">
      {/* Steps to Buy */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">How to Buy</h2>
        <p className="text-muted-foreground font-body text-sm sm:text-base">Get started in 4 simple steps</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {steps.map((s) => (
          <div key={s.step} className="relative flex flex-col items-center text-center p-4 sm:p-6 rounded-xl border border-border bg-background">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wide mb-1">Step {s.step}</span>
            <h3 className="font-display font-bold text-sm text-foreground mb-1">{s.title}</h3>
            <p className="text-xs text-muted-foreground font-body leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {categories.slice(0, 4).map((cat) => (
          <Link
            key={cat.id}
            to={`/products?category=${encodeURIComponent(cat.name)}`}
            className="group flex flex-col items-center p-3 sm:p-5 rounded-xl border border-border bg-background hover:border-primary hover:shadow-md transition-all"
          >
            <span className="text-2xl sm:text-3xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform">{cat.icon}</span>
            <span className="font-display font-semibold text-xs sm:text-sm text-center text-foreground">{cat.name}</span>
            <span className="text-xs text-muted-foreground mt-1">{cat.productCount.toLocaleString()} products</span>
          </Link>
        ))}
      </div>
    </div>
  </section>
);

export default CategoryGrid;
