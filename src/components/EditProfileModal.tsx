import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useProfileData } from '@/hooks/useProfileData';
import api from '@/services/api';
import { Save, X } from 'lucide-react';

interface EditProfileModalProps {
  open: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ open, onClose }: EditProfileModalProps) => {
  const { profile, updateProfile } = useProfileData();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile.name,
    bio: '',
    location: '',
    experience_level: 'beginner',
    favorite_deity: '',
  });

  // Load profile data from backend when modal opens
  useEffect(() => {
    if (open) {
      const loadProfileData = async () => {
        try {
          const data = await api.getProfile();
          setFormData({
            display_name: data.profile.display_name || profile.name,
            bio: data.profile.bio || '',
            location: data.profile.location || '',
            experience_level: data.profile.experience_level || 'beginner',
            favorite_deity: data.profile.favorite_deity || '',
          });
        } catch (error) {
          console.error('Error loading profile data:', error);
        }
      };

      loadProfileData();
    }
  }, [open, profile.name]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await api.updateProfile({
        display_name: formData.display_name,
        bio: formData.bio,
        location: formData.location,
        experience_level: formData.experience_level,
        favorite_deity: formData.favorite_deity,
      });

      // Update local profile data
      updateProfile({ name: formData.display_name });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      onClose();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle>Edit Profile</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="display_name">Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => handleChange('display_name', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                placeholder="Tell us about your spiritual journey..."
                rows={4}
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                placeholder="Where are you from?"
              />
            </div>
            <div>
              <Label htmlFor="experience_level">Experience Level</Label>
              <select
                id="experience_level"
                className="w-full p-2 rounded-md border border-input bg-background"
                value={formData.experience_level}
                onChange={(e) => handleChange('experience_level', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="master">Master</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="favorite_deity">Favorite Deity</Label>
              <Input
                id="favorite_deity"
                value={formData.favorite_deity}
                onChange={(e) => handleChange('favorite_deity', e.target.value)}
                placeholder="Which deity do you connect with most?"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={isLoading} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;