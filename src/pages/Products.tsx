import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { products, categories } from "@/data/mockData";
import { SlidersHorizontal, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import AnimatedPage from "@/components/AnimatedPage";

const Products = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
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
                      {categories.slice(0, 8).map((cat) => (
                        <label key={cat.id} className="flex items-center gap-2 text-sm font-body text-muted-foreground cursor-pointer hover:text-foreground">
                          <Checkbox />
                          {cat.name}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display font-semibold text-sm text-foreground mb-2">Price Range (PKR)</h4>
                    <div className="flex gap-2">
                      <Input placeholder="Min" className="font-body text-sm" />
                      <Input placeholder="Max" className="font-body text-sm" />
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display font-semibold text-sm text-foreground mb-2">Supplier</h4>
                    <label className="flex items-center gap-2 text-sm font-body text-muted-foreground cursor-pointer">
                      <Checkbox /> Verified Only
                    </label>
                  </div>

                  <Button className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 font-body">Apply Filters</Button>
                </div>
              </div>
            </div>
          </aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="font-display font-bold text-2xl text-foreground">All Products</h1>
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

            <div className={viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }>
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Products;
