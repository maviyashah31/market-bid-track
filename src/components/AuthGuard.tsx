import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "buyer" | "seller" | "admin";
}

const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted.current) return;

        if (!session) {
          navigate(requiredRole === "admin" ? "/admin/login" : "/auth", { replace: true });
          return;
        }

        if (requiredRole) {
          // Try user_roles first, fall back to profiles.role
          const { data: roles, error: rolesError } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", session.user.id);

          if (!mounted.current) return;

          let hasRole = false;
          if (!rolesError && roles && roles.length > 0) {
            hasRole = roles.some(r => r.role === requiredRole);
          } else {
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", session.user.id)
              .single();
            if (!mounted.current) return;
            hasRole = profile?.role === requiredRole;
          }

          if (!hasRole) {
            navigate("/auth", { replace: true });
            return;
          }
        }

        if (mounted.current) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch {
        if (mounted.current) {
          navigate("/auth", { replace: true });
        }
      }
    };

    checkAuth();

    // Only redirect on sign-out events — token refresh should NOT re-trigger role checks
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!mounted.current) return;
      if (event === "SIGNED_OUT" || !session) {
        setAuthorized(false);
        setLoading(true);
        navigate(requiredRole === "admin" ? "/admin/login" : "/auth", { replace: true });
      }
    });

    return () => {
      mounted.current = false;
      subscription.unsubscribe();
    };
  }, [navigate, requiredRole]);

  if (loading && !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
};

export default AuthGuard;
