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
  <>
    {/* Steps Section */}
    <section className="py-5 sm:py-6 bg-[hsl(30,95%,55%)]">
      <div className="container mx-auto px-4">
        <h2 className="font-display font-bold text-lg sm:text-xl text-white text-center mb-4">How to Buy</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {steps.map((s) => (
            <div key={s.step} className="flex flex-col items-center text-center p-3 sm:p-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 hover:bg-white/25 transition-all">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mb-2">
                <s.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-[9px] font-bold text-white/80 uppercase tracking-wider mb-0.5">Step {s.step}</span>
              <h3 className="font-display font-bold text-xs text-white mb-0.5">{s.title}</h3>
              <p className="text-[10px] text-white/70 font-body leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Categories */}
    <section className="py-6 bg-card">
      <div className="container mx-auto px-4">
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
  </>
);

export default CategoryGrid;
