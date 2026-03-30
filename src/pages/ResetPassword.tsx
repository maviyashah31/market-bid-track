import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import AnimatedPage from "@/components/AnimatedPage";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsRecovery(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast({ title: "Password updated!", description: "You can now sign in with your new password." });
      navigate("/auth");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link to="/auth" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8 font-body">
            <ArrowLeft className="h-4 w-4" /> Back to login
          </Link>
          <h2 className="font-display font-bold text-2xl text-foreground mb-2">Set New Password</h2>
          <p className="text-muted-foreground mb-6 font-body">Enter your new password below.</p>
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <Label className="font-body">New Password</Label>
              <Input
                type="password"
                placeholder="••••••••"
                className="mt-1.5 font-body"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground font-display font-semibold h-11" disabled={loading}>
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default ResetPassword;
