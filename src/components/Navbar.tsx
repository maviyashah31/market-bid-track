import { Search, ShoppingCart, User, Menu, X, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  "Textiles & Garments",
  "Electronics",
  "Agriculture",
  "Machinery",
  "Chemicals",
  "Sports Goods",
  "Surgical Instruments",
  "Leather Products",
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-hero">
        <div className="container mx-auto flex items-center justify-between px-4 py-2 text-primary-foreground text-sm">
          <span className="font-display font-semibold">🇵🇰 Pakistan's #1 B2B Wholesale Marketplace</span>
          <div className="hidden md:flex items-center gap-4">
            <Link to="/seller/dashboard" className="hover:underline">Sell on Bulkur</Link>
            <Link to="/help" className="hover:underline">Help</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-display font-extrabold text-2xl">
              <span className="text-gradient-hero">Bulk</span>
              <span className="text-foreground">ur</span>
            </h1>
          </Link>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-2xl">
            <div className="flex w-full rounded-lg overflow-hidden border-2 border-primary focus-within:shadow-glow transition-shadow">
              <Input
                placeholder="Search products, suppliers, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-0 rounded-none focus-visible:ring-0 font-body"
              />
              <button className="bg-gradient-hero px-6 text-primary-foreground hover:opacity-90 transition-opacity">
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="gap-2 font-body">
                <User className="h-4 w-4" />
                Sign In
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">3</span>
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Categories bar */}
      <div className="hidden md:block border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 py-2 overflow-x-auto text-sm font-body">
            <button className="flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition whitespace-nowrap">
              <Menu className="h-4 w-4" />
              All Categories
              <ChevronDown className="h-3 w-3" />
            </button>
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${encodeURIComponent(cat)}`}
                className="text-muted-foreground hover:text-primary transition whitespace-nowrap"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3">
          <div className="flex rounded-lg overflow-hidden border border-border">
            <Input placeholder="Search..." className="border-0 rounded-none" />
            <button className="bg-primary px-4 text-primary-foreground">
              <Search className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="block py-1 text-sm text-muted-foreground hover:text-primary">
                {cat}
              </Link>
            ))}
          </div>
          <div className="flex gap-2 pt-2 border-t border-border">
            <Link to="/auth" className="flex-1">
              <Button className="w-full" size="sm">Sign In</Button>
            </Link>
            <Link to="/cart">
              <Button variant="outline" size="sm"><ShoppingCart className="h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;