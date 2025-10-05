import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Flame,
  Target,
  BookOpen,
  Clock,
  Award,
  Plus,
  TrendingUp,
  Star,
  ChevronRight,
  Coins,
  ShoppingCart
} from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProfileData } from "@/hooks/useProfileData";
import { useSadhanaData } from "@/hooks/useSadhanaData";
import { useSaadhanas } from "@/hooks/useSaadhanas";
import { useUserProgression } from "@/hooks/useUserProgression";
import { useAuth } from '@/lib/auth-context';
import { useUserAnalytics } from '@/hooks/useUserAnalytics';
import PracticeTrendsChart from '@/components/analytics/PracticeTrendsChart';
import DailyQuest from "@/components/DailyQuest";
import MoodCheckin from "@/components/MoodCheckin";

const DashboardPage = () => {
  const navigate = useNavigate();
  const { profile, stats, currentPractice } = useProfileData();
  const { sadhanaState, sadhanaData, daysCompleted, daysRemaining, progress } = useSadhanaData();
  const { groupedSaadhanas } = useSaadhanas();
  const { progression } = useUserProgression();
  const { user } = useAuth();
  const { practiceTrends, fetchPracticeTrends, loading: analyticsLoading, error: analyticsError } = useUserAnalytics(user?.id || '');

  // Fetch a short-range practice trend for the dashboard preview (last 14 days)
  useEffect(() => {
    if (!user?.id) return;
    fetchPracticeTrends('14d').catch(() => {});
  }, [user?.id, fetchPracticeTrends]);

  // Get today's date in a readable format
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  
  // Use real user data for stats
  const userStats = {
    streak: stats.completedSadhanas, // Using completed sadhanas as streak for now
    todayProgress: groupedSaadhanas.today.filter(s => s.completed).length > 0 ? 
      Math.round((groupedSaadhanas.today.filter(s => s.completed).length / groupedSaadhanas.today.length) * 100) : 0,
    weeklyGoal: stats.successRate,
    totalHours: stats.totalPracticeDays * 2 // Estimating 2 hours per day
  };

  // Use real user data for today's sadhana
  const todaySadhana = groupedSaadhanas.today;

  // Weekly progress data (mocked for now)
  const weeklyProgress = [
    { day: "Mon", progress: 100 },
    { day: "Tue", progress: 100 },
    { day: "Wed", progress: 100 },
    { day: "Thu", progress: 75 },
    { day: "Fri", progress: 0 },
    { day: "Sat", progress: 0 },
    { day: "Sun", progress: 0 },
  ];

  // Use real user data for achievements
  const achievements = [
    { id: 1, name: "First Sadhana Completed", icon: Award, date: "2023-12-15" },
    { id: 2, name: "5-Day Streak", icon: Star, date: "2024-01-30" },
    { id: 3, name: "Meditation Master", icon: TrendingUp, date: "2024-03-22" },
  ];

  // Function to handle card hover effects with enhanced animations
  const handleCardHover = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.classList.add('scale-[1.02]', 'shadow-xl', 'z-10');
    e.currentTarget.classList.remove('shadow-lg');
  };

  const handleCardLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.classList.remove('scale-[1.02]', 'shadow-xl', 'z-10');
    e.currentTarget.classList.add('shadow-lg');
  };

  const handleBuySP = () => {
    navigate("/store");
  };

  return (
    <Layout>
      <div className="space-y-6 bg-transparent">
        {/* Welcome Section */}
        <div 
          className="backdrop-blur-sm bg-background/30 p-6 rounded-lg border border-purple-500/20 transition-all duration-300 hover:shadow-lg"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold cosmic-text">Welcome back, {profile.name}</h1>
              <p className="text-muted-foreground">{today}</p>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
              <span className="font-bold text-lg">{userStats.streak} day streak</span>
            </div>
          </div>
          
          {/* Mood Check-in */}
          <div className="mt-4">
            <MoodCheckin />
          </div>
        </div>

        {/* SP Balance Card */}
        <Card 
          className="border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 transition-all duration-300 hover:shadow-lg cursor-pointer"
          onMouseEnter={handleCardHover}
          onMouseLeave={handleCardLeave}
          onClick={handleBuySP}
        >
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-amber-500" />
                Spiritual Points
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600"
                onClick={(e) => {
                  e.stopPropagation();
                  handleBuySP();
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Buy More
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-300">{progression.spiritualPoints}</p>
                <p className="text-muted-foreground">Available to spend</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Level {progression.level}</p>
                <p className="text-sm text-muted-foreground">Unlock premium content</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Practice Section */}
        {sadhanaState.hasStarted && sadhanaData && (
          <Card 
            className="border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 transition-all duration-300 hover:shadow-lg"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-500 yantra-rotate" />
                Current Practice
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">{sadhanaData.deity} Sadhana</h3>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 cosmic-pulse">
                  Day {daysCompleted} of {sadhanaData.durationDays}
                </Badge>
              </div>
              <p className="text-muted-foreground">{sadhanaData.purpose}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => navigate("/sadhana")}
                  className="interactive"
                >
                  View Practice
                </Button>
                {daysRemaining === 0 && (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => navigate("/sadhana")}
                    className="shimmer"
                  >
                    Complete Practice
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Daily Quest */}
        <DailyQuest />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card 
            className="transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Progress</p>
                  <p className="text-2xl font-bold">{userStats.todayProgress}%</p>
                </div>
                <Target className="h-8 w-8 text-purple-500 cosmic-pulse" />
              </div>
              <Progress value={userStats.todayProgress} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card 
            className="transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Weekly Goal</p>
                  <p className="text-2xl font-bold">{userStats.weeklyGoal}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500 cosmic-pulse" />
              </div>
              <Progress value={userStats.weeklyGoal} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card 
            className="transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Hours</p>
                  <p className="text-2xl font-bold">{userStats.totalHours}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500 cosmic-pulse" />
              </div>
            </CardContent>
          </Card>
          
          <Card 
            className="transition-all duration-300 hover:shadow-xl cursor-pointer transform hover:-translate-y-1"
            onMouseEnter={handleCardHover}
            onMouseLeave={handleCardLeave}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Streak</p>
                  <p className="text-2xl font-bold">{userStats.streak} days</p>
                </div>
                <Flame className="h-8 w-8 text-orange-500 cosmic-pulse animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Sadhana */}
          <div className="lg:col-span-2 space-y-6">
            <Card 
              className="transition-all duration-300 hover:shadow-lg"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Today's Sadhana
                </CardTitle>
                <Button 
                  size="sm" 
                  onClick={() => navigate("/saadhanas")}
                  className="interactive"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </CardHeader>
              <CardContent className="space-y-3">
                {todaySadhana.length > 0 ? (
                  todaySadhana.map((sadhana) => (
                    <div 
                      key={sadhana.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 hover:shadow-lg cursor-pointer transform hover:scale-[1.02] ${
                        sadhana.completed 
                          ? "bg-green-500/10 border-green-500/30" 
                          : "bg-muted/20 border-muted hover:border-purple-500/30"
                      }`}
                      onClick={() => navigate(`/saadhanas/${sadhana.id}`)}
                      onMouseEnter={(e) => {
                        e.currentTarget.classList.add('scale-[1.01]', 'shadow-lg');
                        e.currentTarget.classList.remove('hover:shadow-lg');
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.classList.remove('scale-[1.01]', 'shadow-lg');
                        e.currentTarget.classList.add('hover:shadow-lg');
                      }}
                    >
                      <div>
                        <p className="font-medium">{sadhana.title}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {sadhana.time || "Any time"} • {sadhana.category}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {sadhana.completed ? (
                          <Badge variant="default" className="bg-green-500 cosmic-pulse animate-pulse">
                            Completed
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline" className="floating hover:scale-105 transition-transform">
                            Start
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground backdrop-blur-sm bg-background/10 rounded-lg">
                    <BookOpen className="h-12 w-12 mx-auto mb-3 text-purple-500/20" />
                    <p className="mb-2">No practices scheduled for today</p>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/saadhanas")}
                      className="interactive"
                    >
                      Add a practice
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weekly Progress */}
            <Card 
              className="transition-all duration-300 hover:shadow-lg"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end justify-between h-32">
                  {weeklyProgress.map((day, index) => (
                    <div 
                      key={index} 
                      className="flex flex-col items-center gap-2"
                      onMouseEnter={(e) => {
                        const bar = e.currentTarget.querySelector('.progress-bar') as HTMLElement;
                        if (bar) {
                          bar.classList.add('glow-primary');
                        }
                      }}
                      onMouseLeave={(e) => {
                        const bar = e.currentTarget.querySelector('.progress-bar') as HTMLElement;
                        if (bar) {
                          bar.classList.remove('glow-primary');
                        }
                      }}
                    >
                      <div className="text-xs text-muted-foreground">{day.day}</div>
                      <div 
                        className="w-8 bg-gradient-to-t from-purple-500 to-fuchsia-500 rounded-t-sm transition-all duration-300 progress-bar"
                        style={{ height: `${day.progress}%` }}
                      ></div>
                      <div className="text-xs font-medium">{day.progress}%</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <div className="space-y-6">
            <Card 
              className="transition-all duration-300 hover:shadow-lg"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement) => {
                  const IconComponent = achievement.icon;
                  return (
                    <div 
                      key={achievement.id} 
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-all duration-300 cursor-pointer floating transform hover:scale-[1.02] hover:shadow-lg"
                      onClick={() => navigate("/profile")}
                      onMouseEnter={(e) => {
                        e.currentTarget.classList.add('bg-muted/30', 'scale-[1.02]', 'shadow-lg');
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.classList.remove('bg-muted/30', 'scale-[1.02]', 'shadow-lg');
                      }}
                    >
                      <div className="p-2 rounded-full bg-purple-500/20 cosmic-glow transition-all duration-300 hover:scale-110">
                        <IconComponent className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{achievement.name}</p>
                        <p className="text-sm text-muted-foreground">{achievement.date}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card 
              className="transition-all duration-300 hover:shadow-lg"
              onMouseEnter={handleCardHover}
              onMouseLeave={handleCardLeave}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-purple-500" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start interactive hover:scale-105 transition-transform" 
                  variant="outline"
                  onClick={() => navigate("/sadhana")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start New Sadhana
                </Button>
                <Button 
                  className="w-full justify-start interactive hover:scale-105 transition-transform" 
                  variant="outline"
                  onClick={() => navigate("/library")}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Library
                </Button>
                <Button 
                  className="w-full justify-start interactive hover:scale-105 transition-transform" 
                  variant="outline"
                  onClick={() => navigate("/settings")}
                >
                  <Target className="h-4 w-4 mr-2" />
                  Set Daily Goals
                </Button>
                <Button 
                  className="w-full justify-start interactive hover:scale-105 transition-transform" 
                  variant="outline"
                  onClick={() => navigate("/store")}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Spiritual Points
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Preview Card */}
        <Card>
          <CardHeader>
            <CardTitle>Your Recent Practice (Preview)</CardTitle>
          </CardHeader>
          <CardContent>
            {analyticsLoading ? (
              <div className="text-center text-sm text-muted-foreground py-6">Loading analytics...</div>
            ) : analyticsError ? (
              <div className="text-center text-sm text-destructive py-6">Unable to load analytics</div>
            ) : (
              <PracticeTrendsChart data={practiceTrends?.trends?.slice(-14) || []} />
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;