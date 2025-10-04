import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Edit,
  Settings,
  Flame,
  Calendar,
  MapPin,
  Target,
  Award,
  TrendingUp,
  Trophy,
  Zap,
  Heart,
  Star,
  Activity,
  Compass,
  Brain
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import EditProfileModal from "@/components/EditProfileModal";
import { useProfileData } from "@/hooks/useProfileData";
import { useUserProgression } from "@/hooks/useUserProgression";
import { useBadges } from "@/hooks/useBadges";
import { usePsychologicalLevers } from "@/hooks/usePsychologicalLevers";
import { useAuth } from '@/lib/auth-context';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import PracticeTrendsChart from '@/components/analytics/PracticeTrendsChart';
import PersonalRhythmReports from "@/components/psychological-levers/PersonalRhythmReports";
import DoshaKoshaMapping from "@/components/psychological-levers/DoshaKoshaMapping";
import Quests from "@/components/psychological-levers/Quests";
import KarmaBalance from "@/components/psychological-levers/KarmaBalance";
import InitiationModal from "@/components/psychological-levers/InitiationModal";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isInitiationModalOpen, setIsInitiationModalOpen] = useState(false);
  const { profile } = useProfileData();
  const { progression } = useUserProgression();
  const { user } = useAuth();
  const { practiceTrends, fetchPracticeTrends, loading: analyticsLoading, error: analyticsError } = useUserAnalytics(user?.id || '');

  // Load quick analytics preview on mount (last 7 days)
  useEffect(() => {
    if (!user?.id) return;
    // best-effort fetch, ignore errors here (UI shows fallback)
    fetchPracticeTrends('7d').catch(() => {});
  }, [user?.id, fetchPracticeTrends]);
  const { earnedBadges, earnedCount, totalBadges, unearnedBadges } = useBadges();
  const { 
    psychologicalProfile, 
    userTier, 
    earnedBadges: psychologicalEarnedBadges,
    getProgressToNextLevel,
    getComparativeStats
  } = usePsychologicalLevers();
  
  // Mock data for user activities
  const recentActivities = [
    { id: 1, title: "Morning Meditation", date: "2023-06-15", duration: "20 min", xp: 50 },
    { id: 2, title: "Evening Pranayama", date: "2023-06-14", duration: "15 min", xp: 40 },
    { id: 3, title: "Scripture Study", date: "2023-06-14", duration: "30 min", xp: 75 },
    { id: 4, title: "Yoga Asanas", date: "2023-06-13", duration: "45 min", xp: 90 },
  ];

  const achievements = [
    { id: 1, title: "7-Day Streak", description: "Maintained daily practice for a week", date: "2023-06-10" },
    { id: 2, title: "First Completion", description: "Completed your first sadhana", date: "2023-06-01" },
    { id: 3, title: "Consistent Practitioner", description: "Practiced for 30 days", date: "2023-05-15" },
  ];

  const comparativeStats = getComparativeStats();

  return (
    <Layout>
      {/* Edit Profile Modal */}
      <EditProfileModal open={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} />
      
      {/* Initiation Modal */}
      <InitiationModal open={isInitiationModalOpen} onClose={() => setIsInitiationModalOpen(false)} />
      
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    {psychologicalProfile.titles.honorific ? 
                      `${profile.name}, ${psychologicalProfile.titles.honorific} of ${psychologicalProfile.initiatedDeity}` : 
                      profile.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    <Badge className="flex items-center gap-1">
                      <Flame className="h-3 w-3" />
                      {progression.totalPracticeDays || 0} day streak
                    </Badge>
                    <Badge variant="outline">
                      Level {progression.level} {userTier.title}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {psychologicalProfile.karmaBalance.total} Karma
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate("/psychological-levers")}
                >
                  <Brain className="h-4 w-4 mr-2" />
                  Levers
                </Button>
                <Button 
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                  onClick={() => setIsEditModalOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Info and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 backdrop-blur-sm bg-background/70 border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>Rishikesh, India</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since January 2023</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Target className="h-4 w-4" />
                <span>Seeking inner peace and self-realization</span>
              </div>
              {psychologicalProfile.sankalpa ? (
                <div className="pt-2">
                  <h4 className="font-medium text-sm mb-1">Sacred Vow (Sankalpa)</h4>
                  <p className="text-sm text-muted-foreground italic">"{psychologicalProfile.sankalpa}"</p>
                </div>
              ) : (
                <div className="pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setIsInitiationModalOpen(true)}
                    className="text-xs"
                  >
                    Set Initiation & Sankalpa
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="md:col-span-2 backdrop-blur-sm bg-background/70 border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Progress Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-lg bg-gradient-to-br from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 text-center">
                  <p className="text-2xl font-bold">{progression.level}</p>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="text-xs text-muted-foreground mt-1">{userTier.title}</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-center">
                  <p className="text-2xl font-bold">{progression.spiritualPoints}</p>
                  <p className="text-sm text-muted-foreground">Spiritual Points</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center">
                  <p className="text-2xl font-bold">{psychologicalProfile.xp}</p>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                    <div 
                      className="bg-green-500 h-1 rounded-full" 
                      style={{ width: `${getProgressToNextLevel()}%` }}
                    ></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 text-center">
                  <p className="text-2xl font-bold">{progression.totalPracticeDays || 0}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </div>
              
              {/* Comparative Stats */}
              <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
                {comparativeStats.inTop10Percent && (
                  <p className="text-sm">
                    <Star className="inline h-4 w-4 text-yellow-500 mr-1" />
                    You are in the top 10% of sādhakas globally maintaining daily discipline.
                  </p>
                )}
                {comparativeStats.inTop7Percent && (
                  <p className="text-sm mt-1">
                    <Zap className="inline h-4 w-4 text-blue-500 mr-1" />
                    Only 7% have gone beyond {comparativeStats.tapasTop7Percent} days of tapas. You are among them!
                  </p>
                )}
                {!comparativeStats.inTop10Percent && !comparativeStats.inTop7Percent && (
                  <p className="text-sm">
                    Keep practicing to join the top practitioners! Your dedication is building something beautiful.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Psychological Levers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <KarmaBalance />
          <Quests />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PersonalRhythmReports />
          <DoshaKoshaMapping />
        </div>

        {/* Badges Section */}
        <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Spiritual Badges
              <Badge variant="secondary" className="ml-2">
                {earnedCount}/{totalBadges} Earned
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {earnedBadges.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {earnedBadges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className="flex flex-col items-center p-4 rounded-lg border border-purple-500/20 bg-gradient-to-b from-purple-500/10 to-fuchsia-500/10 hover:from-purple-500/20 hover:to-fuchsia-500/20 transition-all duration-300"
                  >
                    <div className="text-3xl mb-2">{badge.icon}</div>
                    <h3 className="font-medium text-center text-sm">{badge.title}</h3>
                    <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium mb-2">No Badges Yet</h3>
                <p className="text-muted-foreground">
                  Complete sadhanas and achieve milestones to earn badges!
                </p>
              </div>
            )}
            
            {earnedBadges.length > 0 && earnedBadges.length < totalBadges && (
              <div className="mt-6 pt-6 border-t border-purple-500/10">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Locked Badges
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {/* Show a few unearned badges as examples */}
                  {earnedBadges.length < 3 && unearnedBadges.length > 0 && (
                    unearnedBadges.slice(0, Math.min(3, unearnedBadges.length)).map((badge) => (
                      <div 
                        key={badge.id} 
                        className="flex flex-col items-center p-4 rounded-lg border border-gray-500/20 bg-gradient-to-b from-gray-500/10 to-gray-700/10 opacity-60"
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h3 className="font-medium text-center text-sm">{badge.title}</h3>
                        <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>
                      </div>
                    ))
                  )}
                  {unearnedBadges.length > 3 && (
                    <div className="flex flex-col items-center justify-center p-4 rounded-lg border border-gray-500/20 bg-gradient-to-b from-gray-500/10 to-gray-700/10 opacity-60">
                      <div className="text-3xl mb-2">+{unearnedBadges.length - 3}</div>
                      <h3 className="font-medium text-center text-sm">More Badges</h3>
                      <p className="text-xs text-muted-foreground text-center mt-1">Unlock by achieving milestones</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Activities and Achievements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activities */}
          <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Recent Activities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg border border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                    <div>
                      <h3 className="font-medium">{activity.title}</h3>
                      <p className="text-sm text-muted-foreground">{activity.date} • {activity.duration}</p>
                    </div>
                    <Badge variant="secondary">+{activity.xp} XP</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 rounded-lg border border-purple-500/10 hover:bg-purple-500/5 transition-colors">
                    <div className="mt-1 w-2 h-2 rounded-full bg-purple-500"></div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Preview */}
        <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
          <CardHeader>
            <CardTitle>Quick Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsLoading ? (
                <div className="text-center text-sm text-muted-foreground py-6">Loading analytics...</div>
              ) : analyticsError ? (
                <div className="text-center text-sm text-destructive py-6">Unable to load analytics</div>
              ) : (
                <PracticeTrendsChart data={practiceTrends?.trends?.slice(-7) || []} />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProfilePage;