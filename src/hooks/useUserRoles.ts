import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRoles() {
  const queryClient = useQueryClient();

  const { data: roles = [], isLoading } = useQuery({
    queryKey: ["user-roles"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (error) {
        if (import.meta.env.DEV) console.error("Failed to fetch roles:", error);
        return [];
      }

      return data.map((r) => r.role);
    },
  });

  const hasRole = (role: string) => roles.includes(role);

  const addRole = async (role: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error("Not authenticated");

    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: session.user.id, role });

    if (error) throw error;

    queryClient.invalidateQueries({ queryKey: ["user-roles"] });
  };

  return { roles, hasRole, addRole, isLoading };
}
