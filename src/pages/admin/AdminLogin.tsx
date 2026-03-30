import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in as admin
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (profile?.role === "admin") navigate("/admin");
      }
    };
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      if (authData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", authData.user.id)
          .single();

        if (profile?.role !== "admin") {
          await supabase.auth.signOut();
          toast({ title: "Access denied", description: "This login is for administrators only.", variant: "destructive" });
          setLoading(false);
          return;
        }

        navigate("/admin");
      }
    } catch (error: any) {
      toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#0a0f1e" }}>
      <div className="w-full max-w-sm rounded-xl border p-8" style={{ background: "#0d1225", borderColor: "#1a2340" }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-extrabold text-white mb-1">BULK<span style={{ color: "#00b894" }}>UR</span></h1>
          <span className="text-xs px-3 py-1 rounded font-semibold" style={{ background: "#00b89420", color: "#00b894" }}>ADMIN PANEL</span>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Email</label>
            <Input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@bulkur.pk"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Password</label>
            <Input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white/5 border-white/10 text-white placeholder:text-gray-500"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full font-semibold text-sm" style={{ background: "#00b894", color: "#0a0f1e" }}>
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
}
