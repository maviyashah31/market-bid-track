import { categories } from "@/data/mockData";
import { Link } from "react-router-dom";

const CategoryGrid = () => (
  <section className="py-12 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-2">Browse by Category</h2>
        <p className="text-muted-foreground font-body text-sm sm:text-base">Explore 500+ categories from verified Pakistani suppliers</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => (
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
