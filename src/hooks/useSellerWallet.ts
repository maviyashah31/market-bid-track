import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SellerWallet {
  id: string;
  seller_id: string;
  balance: number;
  total_earned: number;
  total_withdrawn: number;
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  order_id: string | null;
  buyer_id: string | null;
  seller_id: string | null;
  type: string;
  amount: number;
  method: string | null;
  status: string;
  description: string | null;
  created_at: string;
}

export function useSellerWallet() {
  return useQuery<SellerWallet | null>({
    queryKey: ["seller-wallet"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;
      const { data, error } = await supabase
        .from("seller_wallets")
        .select("*")
        .eq("seller_id", session.user.id)
        .single();
      if (error) return null;
      return data as unknown as SellerWallet;
    },
  });
}

export function useWalletTransactions() {
  return useQuery<PaymentTransaction[]>({
    queryKey: ["wallet-transactions"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];
      const { data, error } = await supabase
        .from("payment_transactions")
        .select("*")
        .eq("seller_id", session.user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as PaymentTransaction[]) || [];
    },
  });
}
