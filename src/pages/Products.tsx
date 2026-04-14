import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useProducts } from "@/hooks/useProducts";
import { useCategories } from "@/hooks/useCategories";
import { toProductCardData } from "@/types/database";
import { SlidersHorizontal, Grid3X3, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import AnimatedPage from "@/components/AnimatedPage";

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const categoryFilter = searchParams.get("category") || "";
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { data: categories = [], isLoading: catsLoading } = useCategories();
  const { data: products = [], isLoading } = useProducts({
    search: searchQuery || undefined,
    categoryName: categoryFilter || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
  });

  const toggleCategory = (catName: string) => {
    const params = new URLSearchParams(searchParams);
    if (categoryFilter === catName) {
      params.delete("category");
    } else {
      params.set("category", catName);
    }
    setSearchParams(params);
  };

  const applyPriceFilter = () => {
    // Triggers re-fetch via the hook filters
    // Price state is already set; the hook reads them
  };

  return (
    <AnimatedPage>
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar filters */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-32 space-y-6">
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </h3>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-display font-semibold text-sm text-foreground mb-2">Category</h4>
                    <div className="space-y-2">
                      {(catsLoading ? [] : categories).slice(0, 8).map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 text-sm font-body text-muted-foreground cursor-pointer hover:text-foreground">
                          <Checkbox
                            checked={categoryFilter === cat.name}
                            onCheckedChange={() => toggleCategory(cat.name)}
                          />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display font-semibold text-sm text-foreground mb-2">Price Range (PKR)</h4>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Min"
                        className="font-body text-sm"
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                      <Input
                        placeholder="Max"
                        className="font-body text-sm"
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <Button
                    className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 font-body"
                    onClick={applyPriceFilter}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display font-bold text-xl sm:text-2xl text-foreground">
                  {searchQuery ? `Results for "${searchQuery}"` : categoryFilter ? categoryFilter : "All Products"}
                </h1>
                <p className="text-sm text-muted-foreground font-body">{products.length} products found</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-gradient-hero text-primary-foreground" : ""}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-gradient-hero text-primary-foreground" : ""}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : products.length > 0 ? (
              <div className={viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
                : "space-y-4"
              }>
                {products.map((product) => (
                  <ProductCard key={product.id} product={toProductCardData(product)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground font-body text-lg mb-2">No products found</p>
                <p className="text-muted-foreground font-body text-sm">
                  {searchQuery || categoryFilter
                    ? "Try adjusting your search or filters."
                    : "Products will appear here once sellers start listing."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </AnimatedPage>
  );
};

export default Products;
