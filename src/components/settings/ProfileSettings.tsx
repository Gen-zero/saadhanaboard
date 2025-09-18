import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Calendar, Clock, BarChartHorizontal, Save, User as UserIcon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileData, type HistoricalSadhana } from '@/hooks/useProfileData';
import { useAuth } from '@/lib/auth-context';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { SettingsType } from './SettingsTypes';

interface ProfileSettingsProps {
  settings: SettingsType;
  updateSettings: (path: (string | number)[], value: any) => void;
}

const ProfileSettings = ({ settings, updateSettings }: ProfileSettingsProps) => {
  const { profile, history, stats, currentPractice, addToHistory, updateProfile } = useProfileData();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    display_name: profile.name,
    bio: '',
    location: '',
    experience_level: 'beginner',
    favorite_deity: '',
  });

  // Listen for sadhana completion/break events
  useEffect(() => {
    const handleSadhanaCompleted = (event: CustomEvent) => {
      addToHistory(event.detail as HistoricalSadhana);
    };

    const handleSadhanaBroken = (event: CustomEvent) => {
      addToHistory(event.detail as HistoricalSadhana);
    };

    window.addEventListener('sadhana-completed', handleSadhanaCompleted as EventListener);
    window.addEventListener('sadhana-broken', handleSadhanaBroken as EventListener);

    return () => {
      window.removeEventListener('sadhana-completed', handleSadhanaCompleted as EventListener);
      window.removeEventListener('sadhana-broken', handleSadhanaBroken as EventListener);
    };
  }, [addToHistory]);

  // Load profile data from backend when component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        if (user?.id) {
          const data = await api.getProfile();
          setEditedProfile({
            display_name: data.profile.display_name || profile.name,
            bio: data.profile.bio || '',
            location: data.profile.location || '',
            experience_level: data.profile.experience_level || 'beginner',
            favorite_deity: data.profile.favorite_deity || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
      }
    };

    loadProfileData();
  }, [user, profile.name]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getJoinedDate = () => {
    return new Date(profile.joinDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  const handleSaveProfile = async () => {
    try {
      await api.updateProfile({
        display_name: editedProfile.display_name,
        bio: editedProfile.bio,
        location: editedProfile.location,
        experience_level: editedProfile.experience_level,
        favorite_deity: editedProfile.favorite_deity,
      });

      // Update local profile data
      updateProfile({ name: editedProfile.display_name });
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-3xl">
              <UserIcon className="h-12 w-12" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="display_name">Name</Label>
                  <Input
                    id="display_name"
                    value={editedProfile.display_name}
                    onChange={(e) => setEditedProfile({...editedProfile, display_name: e.target.value})}
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
                <div className="flex gap-2">
                  <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                <CardTitle className="text-3xl">{profile.name}</CardTitle>
                <CardDescription className="mt-2 flex items-center gap-1.5 text-base">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {getJoinedDate()}</span>
                </CardDescription>
                <p className="mt-2 text-muted-foreground">{profile.email}</p>
                <Button variant="outline" className="mt-4" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      {isEditing && (
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={editedProfile.bio}
                onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                placeholder="Tell us about your spiritual journey..."
                rows={4}
              />
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={editedProfile.location}
                  onChange={(e) => setEditedProfile({...editedProfile, location: e.target.value})}
                  placeholder="Where are you from?"
                />
              </div>
              <div>
                <Label htmlFor="experience_level">Experience Level</Label>
                <select
                  id="experience_level"
                  className="w-full p-2 rounded-md border border-input bg-background"
                  value={editedProfile.experience_level}
                  onChange={(e) => setEditedProfile({...editedProfile, experience_level: e.target.value})}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                  <option value="master">Master</option>
                </select>
              </div>
              <div>
                <Label htmlFor="favorite_deity">Favorite Deity</Label>
                <Input
                  id="favorite_deity"
                  value={editedProfile.favorite_deity}
                  onChange={(e) => setEditedProfile({...editedProfile, favorite_deity: e.target.value})}
                  placeholder="Which deity do you connect with most?"
                />
              </div>
            </div>
          </div>
        </CardContent>
      )}
      
      <CardContent className="space-y-8 pt-6">
        {currentPractice ? (
          <div>
            <h3 className="text-xl font-semibold mb-1">Current Practice</h3>
            <p className="text-sm text-muted-foreground mb-4">Your active sadhana journey.</p>
            <div className="bg-secondary/40 p-4 rounded-lg">
              <h4 className="font-medium">{currentPractice.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Day {currentPractice.currentDay} of {currentPractice.totalDays} • {currentPractice.deity}
              </p>
              <div className="w-full bg-secondary h-2 rounded-full mt-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${currentPractice.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(currentPractice.progress)}% complete
              </p>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-1">Current Practice</h3>
            <p className="text-sm text-muted-foreground mb-4">No active sadhana at the moment.</p>
            <div className="bg-secondary/20 p-4 rounded-lg border-2 border-dashed border-secondary">
              <p className="text-muted-foreground text-center">
                Start a new sadhana to begin your spiritual journey
              </p>
            </div>
          </div>
        )}
        
        <Separator />

        <div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-1">
              <BarChartHorizontal className="h-5 w-5 text-primary" />
              <span>Spiritual Statistics</span>
            </h3>
            <p className="text-sm text-muted-foreground">Your journey in numbers.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-primary">{stats.completedSadhanas}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Completed Sadhanas
              </p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-primary">{stats.totalPracticeDays}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Total Practice Days
              </p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-primary">{stats.successRate}%</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Success Rate
              </p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-primary">{stats.uniqueDeities}</h3>
              <p className="text-sm text-muted-foreground mt-1">Deities Connected</p>
            </div>
          </div>
        </div>

        <Separator />

        <div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold flex items-center gap-2 mb-1">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Previous Sadhanas</span>
            </h3>
            <p className="text-sm text-muted-foreground">Your spiritual journey history.</p>
          </div>
          
          {history.length > 0 ? (
            <div className="space-y-6">
              {history.slice(0, 3).map((sadhana, index) => (
                <div key={sadhana.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-medium text-lg">{sadhana.title}</h4>
                      <p className="text-sm text-muted-foreground">{sadhana.deity}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${
                        sadhana.status === 'completed' 
                          ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                          : 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
                      }`}>
                        <Clock className="h-4 w-4" />
                        <span>{sadhana.actualDuration} Days {sadhana.status === 'completed' ? 'Completed' : 'Practiced'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <h5 className="text-xs font-medium text-muted-foreground">GOAL</h5>
                      <p className="mt-1 text-sm">{sadhana.goal}</p>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <h5 className="text-xs font-medium text-muted-foreground">
                        TIME PERIOD
                      </h5>
                      <p className="mt-1 text-sm">
                        {formatDate(sadhana.startDate)} - {
                          sadhana.status === 'completed' 
                            ? formatDate(sadhana.endDate)
                            : formatDate(sadhana.brokenAt || sadhana.endDate)
                        }
                      </p>
                    </div>
                  </div>
                  {index < Math.min(history.length - 1, 2) && <Separator className="my-6" />}
                </div>
              ))}
              
              {history.length > 3 && (
                <div className="text-center pt-2">
                  <Button variant="ghost">View All Spiritual History ({history.length} total)</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-secondary/20 p-6 rounded-lg border-2 border-dashed border-secondary text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No previous sadhanas yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your first sadhana to see your spiritual journey history
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSettings;