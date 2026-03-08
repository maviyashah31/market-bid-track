import { ShoppingCart, User, Menu, X, ChevronDown, Bell, Search, Package, FileText, LayoutDashboard, Store, HelpCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ThemeToggle from "@/components/ThemeToggle";

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

interface Notification {
  id: string;
  type: "order" | "message" | "rfq";
  title: string;
  description: string;
  time: string;
  read: boolean;
  link: string;
}

const initialNotifications: Notification[] = [
  { id: "1", type: "order", title: "Order Shipped", description: "ORD-2024-001 has been shipped by Lahore Textile Mills", time: "5 min ago", read: false, link: "/order/ORD-2024-001" },
  { id: "2", type: "message", title: "New Message", description: "Lahore Textile Mills: We can offer 15% discount on bulk orders", time: "10 min ago", read: false, link: "/messages" },
  { id: "3", type: "rfq", title: "New RFQ Bid", description: "You received 3 new bids on your Cotton Polo Shirts RFQ", time: "1 hr ago", read: false, link: "/buyer/dashboard" },
  { id: "4", type: "order", title: "Order Delivered", description: "ORD-2024-002 has been delivered successfully", time: "2 hrs ago", read: true, link: "/order/ORD-2024-002" },
  { id: "5", type: "message", title: "New Message", description: "Sialkot Sports Co.: Please share the custom logo file", time: "3 hrs ago", read: true, link: "/messages" },
  { id: "6", type: "rfq", title: "RFQ Expiring Soon", description: "Your Leather Bags RFQ expires in 2 days", time: "5 hrs ago", read: true, link: "/buyer/dashboard" },
];

const typeColors: Record<string, string> = {
  order: "bg-primary/10 text-primary",
  message: "bg-verified/10 text-verified",
  rfq: "bg-warning/10 text-warning",
};

const typeLabels: Record<string, string> = {
  order: "Order",
  message: "Message",
  rfq: "RFQ",
};

type NavVariant = "default" | "buyer" | "seller" | "admin";

interface NavLinkItem {
  label: string;
  to: string;
  icon?: React.ElementType;
}

const navLinksByVariant: Record<NavVariant, NavLinkItem[]> = {
  default: [
    { label: "Become a Seller", to: "/seller/dashboard", icon: Store },
    { label: "Post RFQ", to: "/buyer/dashboard", icon: FileText },
    { label: "Products", to: "/products", icon: Package },
    { label: "Help", to: "/help", icon: HelpCircle },
  ],
  buyer: [
    { label: "Browse Products", to: "/products", icon: Package },
    { label: "My Orders", to: "/buyer/dashboard", icon: Package },
    { label: "Messages", to: "/messages" },
    { label: "Help", to: "/help", icon: HelpCircle },
  ],
  seller: [
    { label: "My Products", to: "/seller/dashboard", icon: Package },
    { label: "Orders", to: "/seller/dashboard", icon: Package },
    { label: "RFQ Marketplace", to: "/seller/dashboard", icon: FileText },
    { label: "Messages", to: "/messages" },
  ],
  admin: [
    { label: "Dashboard", to: "/admin", icon: LayoutDashboard },
    { label: "Suppliers", to: "/admin/suppliers" },
    { label: "Orders", to: "/admin/orders" },
    { label: "Disputes", to: "/admin/disputes" },
  ],
};

const topBarText: Record<NavVariant, string> = {
  default: "🇵🇰 Pakistan's #1 B2B Wholesale Marketplace",
  buyer: "🛒 Buyer Dashboard — Source products from verified Pakistani suppliers",
  seller: "📦 Seller Dashboard — Manage your store and grow your business",
  admin: "🔒 Admin Panel — BULKUR Platform Management",
};

function detectVariant(pathname: string): NavVariant {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/seller/dashboard")) return "seller";
  if (pathname.startsWith("/buyer/dashboard")) return "buyer";
  return "default";
}

const Navbar = () => {
  const location = useLocation();
  const variant = detectVariant(location.pathname);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const links = navLinksByVariant[variant];
  const showCart = variant === "default" || variant === "buyer";
  const showCategories = variant === "default";

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-hero">
        <div className="container mx-auto flex items-center justify-between px-4 py-1.5 sm:py-2 text-primary-foreground text-xs sm:text-sm">
          <span className="font-display font-semibold truncate">{topBarText[variant]}</span>
          <div className="hidden md:flex items-center gap-4">
            {variant === "default" && (
              <Link to="/seller/dashboard" className="hover:underline">Sell on Bulkur</Link>
            )}
            {variant === "buyer" && (
              <Link to="/seller/dashboard" className="hover:underline">Switch to Seller</Link>
            )}
            {variant === "seller" && (
              <Link to="/buyer/dashboard" className="hover:underline">Switch to Buyer</Link>
            )}
            {variant !== "admin" && (
              <Link to="/help" className="hover:underline">Help</Link>
            )}
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-display font-extrabold text-2xl md:text-3xl">
              <span className="text-gradient-hero">Bulk</span>
              <span className="text-foreground">ur</span>
            </h1>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex flex-1 items-center justify-center gap-6">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-body font-semibold text-foreground hover:text-primary transition"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-1">
            <ThemeToggle />
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="sm"
                className="relative"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {unreadCount}
                  </span>
                )}
              </Button>

              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-96 bg-card rounded-xl border border-border shadow-lg z-50">
                  <div className="flex items-center justify-between p-4 border-b border-border">
                    <h3 className="font-display font-bold text-foreground">Notifications</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllRead} className="text-xs text-primary font-semibold hover:underline font-body">
                        Mark all read
                      </button>
                    )}
                  </div>
                  <ScrollArea className="max-h-96">
                    {notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        to={notif.link}
                        onClick={() => { markRead(notif.id); setNotifOpen(false); }}
                        className={`flex gap-3 p-4 border-b border-border hover:bg-accent/50 transition ${
                          !notif.read ? "bg-accent/30" : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${typeColors[notif.type]}`}>
                              {typeLabels[notif.type]}
                            </span>
                            {!notif.read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                          </div>
                          <p className="font-display font-semibold text-sm text-foreground truncate">{notif.title}</p>
                          <p className="text-xs text-muted-foreground font-body truncate mt-0.5">{notif.description}</p>
                          <p className="text-[10px] text-muted-foreground font-body mt-1">{notif.time}</p>
                        </div>
                      </Link>
                    ))}
                  </ScrollArea>
                  <div className="p-3 border-t border-border text-center">
                    <Link to={variant === "seller" ? "/seller/dashboard" : "/buyer/dashboard"} onClick={() => setNotifOpen(false)} className="text-xs text-primary font-semibold hover:underline font-body">
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {variant !== "admin" && (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2 font-body">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
            {showCart && (
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">3</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden ml-auto" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Categories bar — only on default/public pages */}
      {showCategories && (
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
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card p-4 space-y-3">
          {variant === "default" && (
            <div className="flex rounded-lg overflow-hidden border border-border">
              <Input placeholder="Search..." className="border-0 rounded-none" />
              <button className="bg-primary px-4 text-primary-foreground">
                <Search className="h-4 w-4" />
              </button>
            </div>
          )}
          <div className="space-y-2">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="block py-1 text-sm font-semibold text-foreground hover:text-primary"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
          {showCategories && (
            <div className="space-y-2 pt-2 border-t border-border">
              {categories.map((cat) => (
                <Link key={cat} to={`/products?category=${encodeURIComponent(cat)}`} className="block py-1 text-sm text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>
                  {cat}
                </Link>
              ))}
            </div>
          )}
          <div className="flex gap-2 pt-2 border-t border-border">
            {variant !== "admin" && (
              <Link to="/auth" className="flex-1">
                <Button className="w-full" size="sm">Sign In</Button>
              </Link>
            )}
            <Link to="/messages">
              <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </Link>
            {showCart && (
              <Link to="/cart">
                <Button variant="outline" size="sm"><ShoppingCart className="h-4 w-4" /></Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
