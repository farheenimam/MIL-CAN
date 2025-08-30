import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface CreatorSignupModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreatorSignupModal({ open, onClose }: CreatorSignupModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Redirect to Replit Auth for creator signup
    const params = new URLSearchParams({
      role: 'creator',
      firstName: formData.firstName,
      lastName: formData.lastName,
      institution: formData.institution,
    });
    
    window.location.href = `/api/login?${params.toString()}`;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card glass-card rounded-2xl max-w-lg shadow-glow">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-6">
            <i className="fas fa-video text-accent text-xl"></i>
            <DialogTitle className="text-xl font-heading font-bold text-accent">Join as Creator</DialogTitle>
          </div>
        </DialogHeader>

        <div className="mb-6">
          <div className="w-full bg-secondary rounded-full h-2 mb-4">
            <div className="bg-accent h-2 rounded-full w-1/3"></div>
          </div>
          <p className="text-sm text-muted-foreground">Step 1 of 3 • Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <h4 className="text-lg font-semibold text-accent border-b border-accent pb-2">Personal Information</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-foreground mb-2">First Name *</Label>
              <Input
                type="text"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="bg-input border-border text-foreground"
                required
                data-testid="input-first-name"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-foreground mb-2">Last Name *</Label>
              <Input
                type="text"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="bg-input border-border text-foreground"
                required
                data-testid="input-last-name"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2">Email Address *</Label>
            <div className="relative">
              <Input
                type="email"
                placeholder="creator@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-input border-border text-foreground pr-10"
                required
                data-testid="input-email"
              />
              <i className="fas fa-envelope absolute right-3 top-1/2 transform -translate-y-1/2 text-accent"></i>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2">Institution/Organization (Optional)</Label>
            <Input
              type="text"
              placeholder="University, School, or Organization"
              value={formData.institution}
              onChange={(e) => handleInputChange('institution', e.target.value)}
              className="bg-input border-border text-foreground"
              data-testid="input-institution"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-semibold hover:bg-accent/90 transition-all duration-200 shadow-gold-glow"
            data-testid="button-next-step"
          >
            Next Step →
          </Button>

          <div className="text-xs text-muted-foreground text-center bg-secondary/50 p-3 rounded-lg">
            <i className="fas fa-info-circle text-accent mr-1"></i>
            Welcome to MIL-CAN! Join thousands of creators making a difference in media literacy education.
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
