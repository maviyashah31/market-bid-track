import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ScrollToTop } from "@/components/ScrollToTop";
import AuthGuard from "@/components/AuthGuard";
import ErrorBoundary from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import BuyerDashboard from "./pages/buyer/BuyerDashboard";
import SellerDashboard from "./pages/seller/SellerDashboard";
import SellerOrders from "./pages/seller/SellerOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Cart from "./pages/Cart";
import Messages from "./pages/Messages";
import OrderTracking from "./pages/OrderTracking";
import DisputeDetail from "./pages/DisputeDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import NotFound from "./pages/NotFound";
import SellerProfile from "./pages/seller/SellerProfile";
import BuyerProfile from "./pages/buyer/BuyerProfile";
import ResetPassword from "./pages/ResetPassword";
import SupplierOnboarding from "./components/SupplierOnboarding";

// Admin Panel
import AdminLayout from "./layouts/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import SupplierManagement from "./pages/admin/SupplierManagement";
import BuyerManagement from "./pages/admin/BuyerManagement";
import OrderManagement from "./pages/admin/OrderManagement";
import DisputeManagement from "./pages/admin/DisputeManagement";
import SettlementFinance from "./pages/admin/SettlementFinance";
import AnalyticsPage from "./pages/admin/AnalyticsPage";
import NotificationsPage from "./pages/admin/NotificationsPage";
import ProductManagement from "./pages/admin/ProductManagement";

const queryClient = new QueryClient();

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/buyer/dashboard" element={<AuthGuard requiredRole="buyer"><BuyerDashboard /></AuthGuard>} />
        <Route path="/seller/onboarding" element={<AuthGuard requiredRole="seller"><SupplierOnboarding /></AuthGuard>} />
        <Route path="/seller/dashboard" element={<AuthGuard requiredRole="seller"><SellerDashboard /></AuthGuard>} />
        <Route path="/seller/orders" element={<AuthGuard requiredRole="seller"><SellerOrders /></AuthGuard>} />
        <Route path="/admin/dashboard" element={<AuthGuard requiredRole="admin"><AdminDashboard /></AuthGuard>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/order/:orderId" element={<OrderTracking />} />
        <Route path="/dispute/:disputeId" element={<DisputeDetail />} />
        <Route path="/seller/:sellerId" element={<AuthGuard requiredRole="seller"><SellerProfile /></AuthGuard>} />
        <Route path="/buyer/:buyerId" element={<AuthGuard requiredRole="buyer"><BuyerProfile /></AuthGuard>} />

        {/* Admin Panel */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AuthGuard requiredRole="admin"><AdminLayout /></AuthGuard>}>
          <Route index element={<AdminDashboardPage />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="suppliers" element={<SupplierManagement />} />
          <Route path="buyers" element={<BuyerManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="disputes" element={<DisputeManagement />} />
          <Route path="settlement" element={<SettlementFinance />} />
          <Route path="analytics" element={<AnalyticsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <ErrorBoundary>
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
