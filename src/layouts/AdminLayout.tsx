import { useState, useEffect } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Users, ShoppingBag, AlertTriangle, Wallet,
  BarChart3, Bell, Menu, X, LogOut, ChevronDown, Package
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { adminNotifications } from "@/data/adminMockData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AuthGuard from "@/components/AuthGuard";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { label: "Product Management", icon: Package, path: "/admin/products" },
  { label: "Supplier Management", icon: Package, path: "/admin/suppliers" },
  { label: "Buyer Management", icon: Users, path: "/admin/buyers" },
  { label: "Order Management", icon: ShoppingBag, path: "/admin/orders" },
  { label: "Dispute Management", icon: AlertTriangle, path: "/admin/disputes" },
  { label: "Settlement & Finance", icon: Wallet, path: "/admin/settlement" },
  { label: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  { label: "Notifications", icon: Bell, path: "/admin/notifications" },
];

function AdminLayoutInner() {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = adminNotifications.filter(n => !n.read).length;
  const isActive = (path: string) => {
    if (path === "/admin") return location.pathname === "/admin";
    return location.pathname.startsWith(path);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/admin-login");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0f1e" }}>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 flex flex-col border-r transition-transform duration-200 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        style={{ background: "#0d1225", borderColor: "#1a2340" }}>
        <div className="h-16 flex items-center justify-between px-5 border-b" style={{ borderColor: "#1a2340" }}>
          <Link to="/admin" className="flex items-center gap-2">
            <span className="font-extrabold text-xl text-white">BULK<span style={{ color: "#00b894" }}>UR</span></span>
            <span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: "#00b894", color: "#0a0f1e" }}>ADMIN</span>
          </Link>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <ScrollArea className="flex-1 py-4">
          <nav className="space-y-1 px-3">
            {navItems.map(item => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path) ? "text-white" : "text-gray-400 hover:text-gray-200"
                }`}
                style={isActive(item.path) ? { background: "#00b89420", color: "#00b894" } : {}}
              >
                <item.icon className="h-4.5 w-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
                {item.label}
                {item.label === "Notifications" && unreadCount > 0 && (
                  <span className="ml-auto text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center" style={{ background: "#00b894", color: "#0a0f1e" }}>
                    {unreadCount}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </ScrollArea>

        <div className="p-3 border-t" style={{ borderColor: "#1a2340" }}>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 w-full transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 border-b" style={{ background: "#0d1225", borderColor: "#1a2340" }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-white font-semibold text-lg hidden sm:block">
              {navItems.find(n => isActive(n.path))?.label || "Admin Panel"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: "#00b894", color: "#0a0f1e" }}>
                    {unreadCount}
                  </span>
                )}
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-lg border shadow-xl z-50" style={{ background: "#111a35", borderColor: "#1a2340" }}>
                  <div className="p-3 border-b font-semibold text-white text-sm" style={{ borderColor: "#1a2340" }}>Notifications</div>
                  <ScrollArea className="max-h-72">
                    {adminNotifications.slice(0, 6).map(n => (
                      <Link key={n.id} to={n.link} onClick={() => setNotifOpen(false)} className="block p-3 border-b hover:bg-white/5 transition" style={{ borderColor: "#1a234060" }}>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-white font-medium">{n.title}</p>
                          {!n.read && <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ background: "#00b894" }} />}
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{n.description}</p>
                        <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                      </Link>
                    ))}
                  </ScrollArea>
                  <Link to="/admin/notifications" onClick={() => setNotifOpen(false)} className="block text-center p-2 text-xs font-semibold" style={{ color: "#00b894" }}>
                    View All Notifications
                  </Link>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: "#00b894", color: "#0a0f1e" }}>A</div>
              <span className="text-sm text-gray-300 hidden sm:block">Admin</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  return (
    <AuthGuard requiredRole="admin">
      <AdminLayoutInner />
    </AuthGuard>
  );
}
