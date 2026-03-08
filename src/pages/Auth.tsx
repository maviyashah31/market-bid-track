import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import AnimatedPage from "@/components/AnimatedPage";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(role === "seller" ? "/seller/dashboard" : "/buyer/dashboard");
  };

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
      <div className="flex-1 flex items-center justify-center p-8">
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

          {!isLogin && (
            <div className="flex gap-3 mb-6">
              {(["buyer", "seller"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 py-3 px-4 rounded-lg border-2 font-display font-semibold text-sm transition-all ${
                    role === r
                      ? "border-primary bg-accent text-accent-foreground"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                >
                  {r === "buyer" ? "🛒 I'm a Buyer" : "🏭 I'm a Seller"}
                </button>
              ))}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <Label className="font-body">Full Name</Label>
                <Input placeholder="Muhammad Ahmed" className="mt-1.5 font-body" />
              </div>
            )}
            <div>
              <Label className="font-body">Email</Label>
              <Input type="email" placeholder="you@company.com" className="mt-1.5 font-body" />
            </div>
            <div>
              <Label className="font-body">Password</Label>
              <div className="relative mt-1.5">
                <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="pr-10 font-body" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-gradient-hero text-primary-foreground hover:opacity-90 font-display font-semibold h-11">
              {isLogin ? "Sign In" : "Create Account"}
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