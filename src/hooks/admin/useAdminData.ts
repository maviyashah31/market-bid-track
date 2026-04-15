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
  pendingProducts: number;
  pendingSuppliers: number;
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const [users, orders, products, disputes] = await Promise.all([
        supabase.from("profiles").select("*", { count: "exact", head: true }),
        supabase.from("orders").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
        (supabase as any).from("disputes").select("*", { count: "exact", head: true }),
      ]);

      const { data: revenueData } = await supabase.from("orders").select("total_amount").eq("status", "delivered");
      const totalRevenue = revenueData?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0;

      const { count: pendingCount } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending");
      const { count: pendingProducts } = await supabase.from("products").select("*", { count: "exact", head: true }).eq("status", "pending_review");
      const { count: pendingSuppliers } = await (supabase as any).from("supplier_onboarding").select("*", { count: "exact", head: true }).eq("profile_status", "pending");

      return {
        totalUsers: users.count || 0,
        totalOrders: orders.count || 0,
        totalProducts: products.count || 0,
        totalRevenue,
        totalDisputes: disputes.count || 0,
        pendingOrders: pendingCount || 0,
        pendingProducts: pendingProducts || 0,
        pendingSuppliers: pendingSuppliers || 0,
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
    mutationFn: async ({ productId, status, rejectionReason }: { productId: string; status: string; rejectionReason?: string }) => {
      const updates: any = { status };
      if (rejectionReason !== undefined) updates.rejection_reason = rejectionReason;
      if (status === "active") updates.rejection_reason = null;
      const { error } = await supabase.from("products").update(updates).eq("id", productId);
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
      const query = supabase
        .from("profiles")
        .select("*, user_roles(role), supplier_onboarding!user_id(*)")
        .order("created_at", { ascending: false })
        .limit(100);
      const { data, error } = await query;
      if (error) throw error;
      if (role && data) {
        return data.filter((u: any) =>
          u.user_roles?.some((r: any) => r.role === role) || u.role === role
        );
      }
      return data || [];
    },
  });
}

export function useAdminUpdateSupplierOnboardingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ onboardingId, profile_status }: { onboardingId: string; profile_status: "approved" | "rejected" | "pending" | "draft" }) => {
      const { error } = await (supabase as any)
        .from("supplier_onboarding")
        .update({ profile_status, profile_reviewed_at: new Date().toISOString() })
        .eq("id", onboardingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users", "seller"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

export function useAdminVerifySeller() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, isVerified }: { userId: string; isVerified: boolean }) => {
      const { error } = await supabase
        .from("profiles")
        .update({ is_verified: isVerified } as any)
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users", "seller"] });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
}

// ── Admin Disputes ──

export function useAdminDisputes() {
  return useQuery({
    queryKey: ["admin-disputes"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
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
      const { error } = await (supabase as any).from("disputes").update({ status, resolution: resolution || null }).eq("id", disputeId);
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
      const { data, error } = await (supabase as any)
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
      const { data, error } = await (supabase as any)
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
      const { error } = await (supabase as any).from("notifications").update({ is_read: true }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["admin-notifications"] }); },
  });
}

export function useAdminSendNotification() {
  return useMutation({
    mutationFn: async (input: { user_id: string; type: string; title: string; body?: string; link?: string }) => {
      const { error } = await (supabase as any).from("notifications").insert(input);
      if (error) throw error;
    },
  });
}
