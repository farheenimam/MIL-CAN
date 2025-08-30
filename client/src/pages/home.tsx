import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();

  const handleDashboardRedirect = () => {
    if (user?.role === 'creator') {
      setLocation('/dashboard/creator');
    } else if (user?.role === 'ambassador') {
      setLocation('/dashboard/ambassador');
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="bg-card/80 glass-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
                <i className="fas fa-graduation-cap text-white text-lg"></i>
              </div>
              <div>
                <span className="text-xl font-heading font-bold text-accent">MIL-CAN</span>
                <span className="text-xs text-muted-foreground ml-2">LITERACY</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-accent transition-colors"
                data-testid="button-resources"
              >
                <i className="fas fa-book mr-2"></i>
                Resources
              </Button>
              <Button 
                variant="ghost" 
                className="text-muted-foreground hover:text-accent transition-colors"
                onClick={() => setLocation('/leaderboard')}
                data-testid="button-leaderboard"
              >
                <i className="fas fa-trophy mr-2"></i>
                Leaderboard
              </Button>
              <Button 
                className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-gold-glow"
                data-testid="button-creator-kit"
              >
                <i className="fas fa-tools mr-2"></i>
                Creator Kit
              </Button>
              
              <span className="text-muted-foreground">
                Welcome, <span className="text-accent font-semibold">{user?.firstName || 'User'}!</span>
              </span>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="bg-secondary hover:bg-secondary/80"
                data-testid="button-theme-toggle"
              >
                <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"} text-accent`}></i>
              </Button>

              <Button
                variant="ghost"
                onClick={() => window.location.href = '/api/logout'}
                className="bg-red-500/20 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-all"
                data-testid="button-logout"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-accent mb-4">
            Welcome to MIL-CAN
          </h1>
          <p className="text-lg text-muted-foreground">
            Ready to make an impact in media literacy education?
          </p>
        </div>

        <div className="bg-card glass-card p-8 rounded-2xl mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <i className={`fas ${user?.role === 'creator' ? 'fa-video' : 'fa-graduation-cap'} text-accent text-2xl`}></i>
            <h2 className="text-2xl font-heading font-bold text-foreground">
              {user?.role === 'creator' ? 'Creator Dashboard' : 'Ambassador Dashboard'}
            </h2>
          </div>

          <p className="text-muted-foreground mb-8">
            {user?.role === 'creator' 
              ? 'Create engaging content, track your impact, and earn badges for your contributions to media literacy education.'
              : 'Mentor creators, organize events, and lead community initiatives to advance digital literacy.'}
          </p>

          <Button
            onClick={handleDashboardRedirect}
            className="bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-glow"
            data-testid="button-go-to-dashboard"
          >
            <i className="fas fa-arrow-right mr-2"></i>
            Go to Dashboard
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-card glass-card p-6 rounded-xl text-center">
            <i className="fas fa-plus text-primary text-2xl mb-4"></i>
            <h3 className="font-semibold text-foreground mb-2">Create Content</h3>
            <p className="text-sm text-muted-foreground">Start creating educational materials</p>
          </div>

          <div className="bg-card glass-card p-6 rounded-xl text-center">
            <i className="fas fa-users text-accent text-2xl mb-4"></i>
            <h3 className="font-semibold text-foreground mb-2">Join Community</h3>
            <p className="text-sm text-muted-foreground">Connect with other educators</p>
          </div>

          <div className="bg-card glass-card p-6 rounded-xl text-center">
            <i className="fas fa-chart-line text-green-400 text-2xl mb-4"></i>
            <h3 className="font-semibold text-foreground mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">Monitor your impact and growth</p>
          </div>
        </div>
      </div>
    </div>
  );
}
