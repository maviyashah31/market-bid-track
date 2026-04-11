import { Component, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="text-center max-w-md">
            <h1 className="font-display font-bold text-2xl text-foreground mb-2">
              Something went wrong
            </h1>
            <p className="text-muted-foreground font-body mb-6">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <Button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = "/";
              }}
              className="bg-gradient-hero text-primary-foreground font-display font-semibold"
            >
              Go to Home
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
