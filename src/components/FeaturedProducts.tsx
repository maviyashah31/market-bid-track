import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/hooks/useProducts";
import { toProductCardData } from "@/types/database";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useProducts({ featured: true, limit: 8 });

  // Fallback: if no featured products, show latest
  const { data: latestProducts } = useProducts({ limit: 8 });
  const displayProducts = products?.length ? products : latestProducts;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 sm:mb-8">
          <div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-foreground mb-1">Featured Products</h2>
            <p className="text-muted-foreground font-body text-sm sm:text-base">Trending wholesale deals from verified suppliers</p>
          </div>
          <Link to="/products">
            <Button variant="outline" className="gap-2 font-body w-full sm:w-auto">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : displayProducts?.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={toProductCardData(product)} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground font-body">
            <p>No products available yet. Be the first seller to list!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;
