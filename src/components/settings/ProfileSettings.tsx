
import { useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Calendar, Clock, BarChartHorizontal } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useProfileData, type HistoricalSadhana } from '@/hooks/useProfileData';

const ProfileSettings = () => {
  const { profile, history, stats, currentPractice, addToHistory, updateProfile } = useProfileData();

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

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start gap-6">
          <Avatar className="h-24 w-24">
            <AvatarImage src={profile.avatar} />
            <AvatarFallback className="bg-primary/10 text-primary text-3xl">
              {profile.name
                .split(' ')
                .map((n) => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-3xl">{profile.name}</CardTitle>
            <CardDescription className="mt-2 flex items-center gap-1.5 text-base">
              <Calendar className="h-4 w-4" />
              <span>Joined {getJoinedDate()}</span>
            </CardDescription>
            <p className="mt-2 text-muted-foreground">{profile.email}</p>
            <Button variant="outline" className="mt-4" onClick={() => {
              const newName = prompt('Enter your name:', profile.name);
              if (newName && newName.trim()) {
                updateProfile({ name: newName.trim() });
              }
            }}>
              Edit Profile
            </Button>
          </div>
        </div>
      </CardHeader>
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
