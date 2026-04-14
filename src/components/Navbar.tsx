import { ShoppingCart, User, Bell, Search, Package, FileText, LayoutDashboard, Store, HelpCircle, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useUserRoles } from "@/hooks/useUserRoles";
import { useCategories } from "@/hooks/useCategories";
import { useNotifications, useUnreadCount, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/useNotifications";
import { toast } from "sonner";

const typeColors: Record<string, string> = {
  order: "bg-primary/10 text-primary",
  message: "bg-verified/10 text-verified",
  rfq: "bg-warning/10 text-warning",
  dispute: "bg-destructive/10 text-destructive",
  review: "bg-success/10 text-success",
  system: "bg-muted text-muted-foreground",
};

const typeLabels: Record<string, string> = {
  order: "Order",
  message: "Message",
  rfq: "RFQ",
  dispute: "Dispute",
  review: "Review",
  system: "System",
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

const announcementItems = [
  "🛡️ Buyer Protection on Every Order",
  "🚚 Next-Day Delivery Across Pakistan",
  "✅ 5,000+ Verified Suppliers",
  "📋 Post RFQs & Get Competitive Bids",
  "💰 Secure Escrow Payments",
  "🌍 Serving 15+ Countries",
  "📦 Bulk Discounts on All Categories",
  "⭐ Trusted by 10,000+ Businesses",
];

const topBarTextByVariant: Record<NavVariant, string[]> = {
  default: announcementItems,
  buyer: ["🛒 Buyer Dashboard — Source products from verified Pakistani suppliers", ...announcementItems],
  seller: ["📦 Seller Dashboard — Manage your store and grow your business", ...announcementItems],
  admin: ["🔒 Admin Panel — BULKUR Platform Management"],
};

function detectVariant(pathname: string): NavVariant {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/seller/dashboard")) return "seller";
  if (pathname.startsWith("/buyer/dashboard")) return "buyer";
  return "default";
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const variant = detectVariant(location.pathname);
  const { data: dbCategories = [] } = useCategories();
  const categories = dbCategories.map(c => c.name);

  const [notifOpen, setNotifOpen] = useState(false);
  const { data: notifications = [] } = useNotifications();
  const { data: unreadNotifCount = 0 } = useUnreadCount();
  const markNotifRead = useMarkNotificationRead();
  const markAllNotifsRead = useMarkAllNotificationsRead();
  const [navSearch, setNavSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const { hasRole, addRole } = useUserRoles();

  const unreadCount = unreadNotifCount;
  const links = navLinksByVariant[variant];
  const showCart = variant === "default" || variant === "buyer";
  const showCategories = variant === "default";
  const showSearch = variant === "default" || variant === "buyer" || variant === "seller";

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setIsLoggedIn(!!session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setIsLoggedIn(!!session));
    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleNavSearch = () => {
    const params = new URLSearchParams();
    if (navSearch.trim()) {
      params.set("search", navSearch.trim());
    }
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    navigate(`/products?${params.toString()}`);
    setNavSearch("");
  };

  const markAllRead = () => { markAllNotifsRead.mutate(); };
  const markRead = (id: string) => { markNotifRead.mutate(id); };

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
    <header className="sticky top-0 z-50 bg-gradient-hero border-b border-primary/20 shadow-sm">
      {/* Top bar — continuous marquee */}
      <div className="bg-gradient-hero overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1 overflow-hidden py-1.5 sm:py-2">
            <div className="flex animate-marquee whitespace-nowrap">
              {[...topBarTextByVariant[variant], ...topBarTextByVariant[variant]].map((text, i) => (
                <span key={i} className="inline-flex items-center text-primary-foreground text-xs sm:text-sm font-display font-semibold mx-6 sm:mx-8">
                  {text}
                  <span className="mx-6 sm:mx-8 text-primary-foreground/40">•</span>
                </span>
              ))}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-4 px-4 text-primary-foreground text-xs sm:text-sm shrink-0">
            {variant === "default" && (
              <Link to="/auth" className="hover:underline">Sell on Bulkur</Link>
            )}
            {variant === "buyer" && (
              <button
                disabled={switchingRole}
                onClick={async () => {
                  setSwitchingRole(true);
                  try {
                    if (!hasRole("seller")) {
                      await addRole("seller");
                      toast.success("Seller role added to your account");
                    }
                    navigate("/seller/dashboard");
                  } catch {
                    toast.error("Failed to switch role. Please try again.");
                  } finally {
                    setSwitchingRole(false);
                  }
                }}
                className="hover:underline disabled:opacity-50"
              >
                {switchingRole ? "Switching..." : "Switch to Seller"}
              </button>
            )}
            {variant === "seller" && (
              <button
                disabled={switchingRole}
                onClick={async () => {
                  setSwitchingRole(true);
                  try {
                    if (!hasRole("buyer")) {
                      await addRole("buyer");
                      toast.success("Buyer role added to your account");
                    }
                    navigate("/buyer/dashboard");
                  } catch {
                    toast.error("Failed to switch role. Please try again.");
                  } finally {
                    setSwitchingRole(false);
                  }
                }}
                className="hover:underline disabled:opacity-50"
              >
                {switchingRole ? "Switching..." : "Switch to Buyer"}
              </button>
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
              <span className="text-primary-foreground">Bulk</span>
              <span className="text-primary-foreground/80">ur</span>
            </h1>
          </Link>

          {/* Search Bar in Header */}
          {showSearch && (
            <div className="hidden md:flex items-center flex-1">
              <div className="flex w-full rounded-lg overflow-hidden border border-border bg-white focus-within:ring-2 focus-within:ring-primary-foreground/30 transition-all">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="border-0 rounded-none bg-transparent h-8 w-32 text-sm focus:ring-0">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="w-px bg-border"></div>
                <div className="flex items-center pl-2.5 text-muted-foreground">
                  <Search className="h-3.5 w-3.5" />
                </div>
                <Input
                  placeholder="What are you looking for?"
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleNavSearch()}
                  className="border-0 rounded-none focus-visible:ring-0 font-body bg-transparent h-8 text-sm text-foreground placeholder:text-muted-foreground flex-1"
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="hidden md:flex items-center gap-1 ml-auto">
            <ThemeToggle />
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <Button
                variant="ghost"
                size="sm"
                className="relative text-primary-foreground hover:bg-primary-foreground/10"
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
                    {notifications.length === 0 && (
                      <p className="text-muted-foreground font-body text-sm text-center py-6">No notifications</p>
                    )}
                    {notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        to={notif.link || "#"}
                        onClick={() => { markRead(notif.id); setNotifOpen(false); }}
                        className={`flex gap-3 p-4 border-b border-border hover:bg-accent/50 transition ${
                          !notif.is_read ? "bg-accent/30" : ""
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${typeColors[notif.type] || "bg-muted text-muted-foreground"}`}>
                              {typeLabels[notif.type] || notif.type}
                            </span>
                            {!notif.is_read && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />}
                          </div>
                          <p className="font-display font-semibold text-sm text-foreground truncate">{notif.title}</p>
                          <p className="text-xs text-muted-foreground font-body truncate mt-0.5">{notif.body}</p>
                          <p className="text-[10px] text-muted-foreground font-body mt-1">{new Date(notif.created_at).toLocaleDateString("en-PK")}</p>
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

            {variant !== "admin" && !isLoggedIn && (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="gap-2 font-body text-primary-foreground hover:bg-primary-foreground/10">
                  <User className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
            )}
            {isLoggedIn && (
              <Button variant="ghost" size="sm" onClick={handleSignOut} className="gap-2 font-body text-primary-foreground hover:bg-primary-foreground/10">
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            )}
            {showCart && (
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative text-primary-foreground hover:bg-primary-foreground/10">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary-foreground text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">3</span>
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile actions */}
          <div className="flex md:hidden items-center gap-1 ml-auto">
            {showCart && (
              <Link to="/cart">
                <Button variant="ghost" size="sm" className="relative text-primary-foreground hover:bg-primary-foreground/10 p-1">
                  <ShoppingCart className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-primary-foreground text-primary text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold text-[10px]">3</span>
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile search bar */}
        {showSearch && (
          <div className="md:hidden px-4 pb-3">
            <div className="flex w-full rounded-lg overflow-hidden border border-border bg-white focus-within:ring-2 focus-within:ring-primary-foreground/30 transition-all">
              <div className="flex items-center pl-2.5 text-muted-foreground">
                <Search className="h-3.5 w-3.5" />
              </div>
              <Input
                placeholder="Search products..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleNavSearch()}
                className="border-0 rounded-none focus-visible:ring-0 font-body bg-transparent h-8 text-sm text-foreground placeholder:text-muted-foreground flex-1"
              />
            </div>
          </div>
        )}
      </div>

      {/* Links bar below header */}
      <nav className="border-t border-border bg-card">
        <div className="container mx-auto px-4">
          {/* Desktop links */}
          <div className="hidden md:flex items-center justify-center gap-8 py-1.5">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="text-sm font-body font-semibold text-foreground hover:text-primary transition"
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Mobile links */}
          <div className="flex md:hidden items-center justify-center gap-6 py-1.5">
            <Link
              to="/buyer/dashboard"
              className="text-sm font-body font-semibold text-foreground hover:text-primary transition"
            >
              Post RFQ
            </Link>
            <Link
              to="/auth"
              className="text-sm font-body font-semibold text-foreground hover:text-primary transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>



    </header>
  );
};

export default Navbar;
