import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import CreatorDashboard from "@/pages/creator-dashboard";
import AmbassadorDashboard from "@/pages/ambassador-dashboard";
import Leaderboard from "@/pages/leaderboard";
import CreatorKit from "@/pages/creator-kit";
import Resources from "@/pages/resources";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/creator-kit" component={CreatorKit} />
          <Route path="/resources" component={Resources} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/dashboard/creator" component={CreatorDashboard} />
          <Route path="/dashboard/ambassador" component={AmbassadorDashboard} />
          <Route path="/leaderboard" component={Leaderboard} />
          <Route path="/creator-kit" component={CreatorKit} />
          <Route path="/resources" component={Resources} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
