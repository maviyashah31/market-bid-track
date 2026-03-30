import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SignOutButtonProps {
  variant?: "default" | "ghost" | "outline";
  className?: string;
}

const SignOutButton = ({ variant = "ghost", className }: SignOutButtonProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/auth");
  };

  return (
    <Button variant={variant} onClick={handleSignOut} className={className}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  );
};

export default SignOutButton;
