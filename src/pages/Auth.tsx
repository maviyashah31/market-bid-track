import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft, ShoppingCart, Factory, Loader2 } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { passwordSchema, getPasswordStrength } from "@/lib/validation";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const navigate = useNavigate();
  // Redirect if already logged in — tries user_roles first, falls back to profiles.role
  useEffect(() => {
    let cancelled = false;
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session || cancelled) return;

      // Try user_roles table first (new schema)
      const { data: userRoles, error: rolesError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id);

      if (cancelled) return;

      let roles: string[] = [];
      if (!rolesError && userRoles && userRoles.length > 0) {
        roles = userRoles.map(r => r.role);
      } else {
        // Fallback to profiles.role (old schema / before migration)
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();
        if (cancelled) return;
        if (profile?.role) roles = [profile.role];
      }

      if (roles.includes("admin")) navigate("/admin", { replace: true });
      else if (roles.includes("seller")) navigate("/seller/dashboard", { replace: true });
      else if (roles.includes("buyer")) navigate("/buyer/dashboard", { replace: true });
    };
    checkSession();
    return () => { cancelled = true; };
  }, [navigate]);

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Reset email sent!", { description: "Check your inbox for a password reset link." });
      setShowForgotPassword(false);
    } catch (error: unknown) {
      if (import.meta.env.DEV) console.error("Forgot password error:", error);
      toast.error("Error", { description: "Unable to send reset email. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Validate password strength on signup
    if (!isLogin) {
      const result = passwordSchema.safeParse(password);
      if (!result.success) {
        toast.error("Weak password", { description: result.error.errors[0].message });
        setLoading(false);
        return;
      }
    }

    try {
      if (isLogin) {
        const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        // Check if user has the selected role
        if (authData.user) {
          // Try to check/add role in user_roles; silently skip if table doesn't exist yet
          try {
            const { data: userRoles } = await supabase
              .from("user_roles")
              .select("role")
              .eq("user_id", authData.user.id);

            const hasSelectedRole = userRoles?.some(r => r.role === role);
            if (!hasSelectedRole) {
              await supabase
                .from("user_roles")
                .insert({ user_id: authData.user.id, role });
            }
          } catch {
            // user_roles table may not exist yet — continue with login
          }

          if (role === "seller") navigate("/seller/dashboard");
          else navigate("/buyer/dashboard");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName, role },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;

        toast.success("Account created!", { description: "Please check your email to verify your account." });
        if (role === "seller") navigate("/seller/onboarding");
        else navigate("/buyer/dashboard");
      }
    } catch (error: unknown) {
      if (import.meta.env.DEV) console.error("Auth error:", error);
      toast.error(isLogin ? "Sign in failed" : "Sign up failed", {
        description: isLogin
          ? "Invalid email or password. Please try again."
          : "Unable to create account. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { key: "buyer" as const, label: "Buyer", icon: ShoppingCart, color: "text-primary" },
    { key: "seller" as const, label: "Seller", icon: Factory, color: "text-verified" },
  ];

  // Forgot password form
  if (showForgotPassword) {
    return (
      <AnimatedPage>
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <button onClick={() => setShowForgotPassword(false)} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8 font-body">
              <ArrowLeft className="h-4 w-4" /> Back to login
            </button>
            <h2 className="font-display font-bold text-2xl text-foreground mb-2">Forgot Password?</h2>
            <p className="text-muted-foreground mb-6 font-body">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <Label className="font-body">Email</Label>
                <Input type="email" placeholder="you@company.com" className="mt-1.5 font-body" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground font-display font-semibold h-11" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : "Send Reset Link"}
              </Button>
            </form>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-background flex">
        {/* Left panel */}
        <div className="hidden lg:flex flex-1 bg-gradient-hero items-center justify-center p-12">
          <div className="max-w-md text-primary-foreground">
            <h1 className="font-display font-extrabold text-4xl mb-4">
              <span className="text-primary-foreground">Bulk</span>ur
            </h1>
            <p className="text-xl font-display font-semibold mb-6">Pakistan's #1 B2B Wholesale Marketplace</p>
            <ul className="space-y-4 font-body text-primary-foreground/90">
              <li className="flex items-start gap-3">
                <span className="bg-primary-foreground/20 rounded-full p-1 mt-0.5">✓</span>
                Access 12,000+ verified suppliers
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary-foreground/20 rounded-full p-1 mt-0.5">✓</span>
                Secure escrow payments
              </li>
              <li className="flex items-start gap-3">
                <span className="bg-primary-foreground/20 rounded-full p-1 mt-0.5">✓</span>
                Post RFQs and get competitive bids
              </li>
            </ul>
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-md">
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-8 font-body">
              <ArrowLeft className="h-4 w-4" /> Back to home
            </Link>

            <h2 className="font-display font-bold text-2xl text-foreground mb-1">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-muted-foreground mb-6 font-body">
              {isLogin ? "Sign in to your Bulkur account" : "Join thousands of businesses on Bulkur"}
            </p>

            {/* Role selection */}
            <div className="mb-6">
              <Label className="text-sm font-medium text-foreground mb-2 block">Select Role</Label>
              <div className="grid grid-cols-2 gap-2">
                {roleOptions.map(({ key, label, icon: Icon, color }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRole(key)}
                    className={`flex flex-col items-center gap-2 py-3 px-2 rounded-lg border-2 font-display font-semibold text-xs transition-all ${
                      role === key
                        ? "border-primary bg-accent text-accent-foreground"
                        : "border-border text-muted-foreground hover:border-primary/30"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${role === key ? color : ""}`} />
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div>
                  <Label className="font-body">Full Name</Label>
                  <Input placeholder="Muhammad Ahmed" className="mt-1.5 font-body" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                </div>
              )}
              <div>
                <Label className="font-body">Email</Label>
                <Input type="email" placeholder="you@company.com" className="mt-1.5 font-body" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label className="font-body">Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pr-10 font-body"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {!isLogin && password.length > 0 && (() => {
                  const strength = getPasswordStrength(password);
                  return (
                    <div className="mt-2">
                      <div className="flex gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.score ? strength.color : "bg-muted"}`} />
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">{strength.label}</p>
                    </div>
                  );
                })()}
              </div>

              {isLogin && (
                <button type="button" onClick={() => setShowForgotPassword(true)} className="text-sm text-primary hover:underline font-body">
                  Forgot Password?
                </button>
              )}

              <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold h-11" disabled={loading}>
                {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...</> : isLogin ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <p className="text-center mt-6 text-sm text-muted-foreground font-body">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-primary font-semibold hover:underline">
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default Auth;
