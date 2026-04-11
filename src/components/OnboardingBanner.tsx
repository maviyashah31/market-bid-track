import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import { useState } from "react";

interface OnboardingBannerProps {
  completedSteps: number;
  totalSteps: number;
}

const OnboardingBanner = ({ completedSteps, totalSteps }: OnboardingBannerProps) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed || completedSteps >= totalSteps) return null;

  const percent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-display font-semibold text-amber-900 dark:text-amber-100 text-sm">
              Complete your seller setup ({completedSteps}/{totalSteps} steps done)
            </h3>
            <button onClick={() => setDismissed(true)} className="text-amber-500 hover:text-amber-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <Progress value={percent} className="h-1.5 mt-2 mb-2" />
          <p className="text-xs text-amber-700 dark:text-amber-300 font-body mb-2">
            Some features are locked until you complete onboarding. Finish setup to unlock orders, wallet, and more.
          </p>
          <Button asChild size="sm" className="bg-amber-600 hover:bg-amber-700 text-white font-display font-semibold gap-1 h-8 text-xs">
            <Link to="/seller/onboarding">
              Resume Setup <ArrowRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingBanner;
