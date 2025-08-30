import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface AmbassadorSigninModalProps {
  open: boolean;
  onClose: () => void;
}

export function AmbassadorSigninModal({ open, onClose }: AmbassadorSigninModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Redirect to Replit Auth with ambassador role preference
    window.location.href = '/api/login?role=ambassador';
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card glass-card rounded-2xl max-w-md shadow-glow">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-6">
            <i className="fas fa-graduation-cap text-accent text-xl"></i>
            <DialogTitle className="text-xl font-heading font-bold text-accent">Ambassador Sign In</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-muted-foreground mb-8 text-center">Access your educator dashboard</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label className="text-sm font-medium text-foreground mb-2">Email Address</Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="ambassador@institution.edu"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-input border-border text-foreground pr-10"
                required
                data-testid="input-ambassador-email"
              />
              <i className="fas fa-envelope absolute right-3 top-1/2 transform -translate-y-1/2 text-accent"></i>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2">Password</Label>
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter your secure password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="bg-input border-border text-foreground pr-10"
                required
                data-testid="input-ambassador-password"
              />
              <i className="fas fa-lock absolute right-3 top-1/2 transform -translate-y-1/2 text-accent"></i>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={formData.rememberMe}
                onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                data-testid="checkbox-remember-me"
              />
              <span className="text-muted-foreground">Remember me</span>
            </div>
            <a href="#" className="text-accent hover:text-accent/80">Forgot password?</a>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-glow"
            data-testid="button-sign-in-ambassador"
          >
            <i className="fas fa-sign-in-alt mr-2"></i>
            Sign In as Ambassador
          </Button>

          <div className="text-xs text-muted-foreground text-center bg-secondary/50 p-3 rounded-lg">
            <i className="fas fa-shield-alt text-accent mr-1"></i>
            Ambassador accounts are invitation-only. Contact your administrator if you need access.
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
