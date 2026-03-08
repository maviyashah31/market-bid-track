import { products } from "@/data/mockData";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FeaturedProducts = () => (
  <section className="py-12">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display font-bold text-3xl text-foreground mb-1">Featured Products</h2>
          <p className="text-muted-foreground font-body">Trending wholesale deals from verified suppliers</p>
        </div>
        <Link to="/products">
          <Button variant="outline" className="gap-2 font-body">
            View All <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedProducts;
