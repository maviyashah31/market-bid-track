import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// ── Admin Stats ──

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  totalDisputes: number;
  pendingOrders: number;
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, orders, products, disputes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("disputes").select("*", { count: "exact", head: true }),
      ]);

      const { data: revenueData } = await supabase.from("orders").select("total_amount").eq("status", "delivered");
      const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

      const { count: pendingCount } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending");

      return {
        totalUsers: users.count || 0,
        totalOrders: orders.count || 0,
        totalProducts: products.count || 0,
        totalRevenue,
        totalDisputes: disputes.count || 0,
        pendingOrders: pendingCount || 0,
      };
    },
    staleTime: 30_000,
  });
}

// ── Admin Orders ──

export function useAdminOrders() {
  return useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*), buyer:profiles!buyer_id(full_name, email), seller:profiles!seller_id(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });
}

// ── Admin Products ──

export function useAdminProducts() {
  return useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories:categories!category_id(name), profiles:profiles!seller_id(full_name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAdminUpdateProductStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ productId, status }: { productId: string; status: string }) => {
      const { error } = await supabase.from("products").update({ status }).eq("id", productId);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-products"] }); },
  });
}

// ── Admin Users (Suppliers / Buyers) ──

export function useAdminUsers(role?: string) {
  return useQuery({
    queryKey: ["admin-users", role],
    queryFn: async () => {
      let query = supabase.from("profiles").select("*, user_roles(role)").order("created_at", { ascending: false }).limit(100);
      const { data, error } = await query;
      if (error) throw error;
      if (role && data) {
        return data.filter((u: any) => u.user_roles?.some((r: any) => r.role === role));
      }
      return data || [];
    },
  });
}

// ── Admin Disputes ──

export function useAdminDisputes() {
  return useQuery({
    queryKey: ["admin-disputes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disputes")
        .select("*, order:orders!order_id(order_number), buyer:profiles!buyer_id(full_name, email), seller:profiles!seller_id(full_name, email)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAdminUpdateDisputeStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ disputeId, status, resolution }: { disputeId: string; status: string; resolution?: string }) => {
      const { error } = await supabase.from("disputes").update({ status, resolution: resolution || null }).eq("id", disputeId);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-disputes"] }); },
  });
}

// ── Admin Payments ──

export function useAdminPayments() {
  return useQuery({
    queryKey: ["admin-payments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("payment_transactions")
        .select("*, buyer:profiles!buyer_id(full_name), seller:profiles!seller_id(full_name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });
}

// ── Admin Notifications ──

export function useAdminNotifications() {
  return useQuery({
    queryKey: ["admin-notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*, user:profiles!user_id(full_name)")
        .order("created_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAdminMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-notifications"] }); },
  });
}

export function useAdminSendNotification() {
  return useMutation({
    mutationFn: async (input: { user_id: string; type: string; title: string; body?: string; link?: string }) => {
      const { error } = await supabase.from("notifications").insert(input);
      if (error) throw error;
    },
  });
}
