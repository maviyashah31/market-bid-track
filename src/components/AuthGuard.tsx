import { useEffect, useState } from "react";
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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate(requiredRole === "admin" ? "/admin/login" : "/auth");
        return;
      }

      if (requiredRole) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id);

        const hasRole = roles?.some(r => r.role === requiredRole);
        if (!hasRole) {
          navigate("/auth");
          return;
        }
      }

      setAuthorized(true);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate(requiredRole === "admin" ? "/admin/login" : "/auth");
      }
    });

    return () => subscription.unsubscribe();
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
