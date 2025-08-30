import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface ProfileSectionProps {
  className?: string;
}

export function ProfileSection({ className }: ProfileSectionProps) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      // Here you would typically upload to your server
      // For now, we'll just simulate the upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update user profile with new image URL
      console.log("Profile picture uploaded successfully");
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  return (
    <div className={`bg-card glass-card p-6 rounded-xl ${className}`} data-testid="profile-section">
      <div className="flex items-center space-x-3 mb-6">
        <i className="fas fa-user-circle text-accent text-xl"></i>
        <h2 className="text-xl font-heading font-bold text-accent">Profile Portfolio</h2>
      </div>

      {/* Current Profile */}
      <div className="flex items-start space-x-6 mb-8">
        <div className="flex-shrink-0">
          <img 
            src={previewUrl || user?.profileImageUrl || `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`}
            alt={`${user?.firstName} ${user?.lastName}` || "Profile"}
            className="w-24 h-24 rounded-full object-cover border-4 border-accent/30 shadow-lg"
            data-testid="profile-picture"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {user?.firstName} {user?.lastName}
          </h3>
          <p className="text-accent font-medium capitalize mb-2">{user?.role}</p>
          <p className="text-sm text-muted-foreground mb-3">{user?.email}</p>
          {user?.institution && (
            <p className="text-sm text-muted-foreground">
              <i className="fas fa-university mr-1"></i>
              {user.institution}
            </p>
          )}
          <div className="mt-3 flex items-center space-x-4">
            <div className="flex items-center">
              <i className="fas fa-star text-accent mr-1"></i>
              <span className="text-sm font-semibold text-foreground">{user?.points || 0} pts</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Picture Upload */}
      <div className="border-t border-border pt-6">
        <h4 className="font-semibold text-foreground mb-4">Update Profile Picture</h4>
        
        {!selectedFile ? (
          <div className="text-center">
            <label htmlFor="profile-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-accent/30 rounded-xl p-8 hover:border-accent/50 transition-colors">
                <i className="fas fa-camera text-3xl text-accent mb-3 block"></i>
                <p className="text-muted-foreground mb-2">Click to upload a new profile picture</p>
                <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                data-testid="file-upload-input"
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden border-2 border-accent/30">
                <img 
                  src={previewUrl || ''}
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  data-testid="preview-image"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(selectedFile.size / 1024)}KB
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={handleUpload}
                disabled={isUploading}
                className="bg-accent text-accent-foreground hover:bg-accent/90 flex-1"
                data-testid="button-upload"
              >
                {isUploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Uploading...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload mr-2"></i>
                    Upload Picture
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                onClick={handleCancel}
                disabled={isUploading}
                className="border border-border"
                data-testid="button-cancel-upload"
              >
                <i className="fas fa-times mr-2"></i>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}