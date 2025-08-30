import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface JoinModalProps {
  open: boolean;
  onClose: () => void;
  onCreatorSelected: () => void;
  onAmbassadorSelected: () => void;
}

export function JoinModal({ open, onClose, onCreatorSelected, onAmbassadorSelected }: JoinModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card glass-card rounded-2xl max-w-md shadow-glow">
        <DialogHeader>
          <div className="flex items-center space-x-3 mb-6">
            <i className="fas fa-rocket text-accent text-xl"></i>
            <DialogTitle className="text-xl font-heading font-bold text-accent">Join MIL-CAN</DialogTitle>
          </div>
        </DialogHeader>

        <p className="text-muted-foreground mb-8 text-center">Choose your role in our mission to combat misinformation</p>

        <div className="space-y-4">
          <Button
            onClick={onCreatorSelected}
            className="w-full bg-accent text-accent-foreground p-4 rounded-xl font-semibold hover:bg-accent/90 transition-all duration-200 shadow-gold-glow flex items-center justify-center space-x-3"
            data-testid="button-join-as-creator"
          >
            <i className="fas fa-video"></i>
            <span>Sign Up as Creator</span>
          </Button>
          
          <Button
            onClick={onAmbassadorSelected}
            className="w-full bg-primary text-primary-foreground p-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-glow flex items-center justify-center space-x-3"
            data-testid="button-join-as-ambassador"
          >
            <i className="fas fa-graduation-cap"></i>
            <span>Sign In as Ambassador</span>
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground mb-3">
            New Creator? Sign up above • Ambassador? Sign in above
          </p>
          <div className="border-t border-border pt-3">
            <p className="text-xs text-muted-foreground">
              Already have an account? <button className="text-accent hover:text-accent/80 underline">Sign In</button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
