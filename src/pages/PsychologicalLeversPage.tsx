import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Activity, 
  Compass, 
  Heart, 
  Zap, 
  Droplets, 
  Mountain, 
  Crown,
  Users,
  BookOpen,
  Gift,
  Target,
  Repeat
} from "lucide-react";
import { usePsychologicalLevers } from "@/hooks/usePsychologicalLevers";
import { useUserProgression } from "@/hooks/useUserProgression";
import { toast } from "@/hooks/use-toast";
import PersonalRhythmReports from "@/components/psychological-levers/PersonalRhythmReports";
import DoshaKoshaMapping from "@/components/psychological-levers/DoshaKoshaMapping";
import Quests from "@/components/psychological-levers/Quests";
import KarmaBalance from "@/components/psychological-levers/KarmaBalance";

const PsychologicalLeversPage = () => {
  const navigate = useNavigate();
  const { psychologicalProfile, userTier, earnedBadges, getProgressToNextLevel } = usePsychologicalLevers();
  const { progression, addExperience, addSpiritualPoints } = useUserProgression();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Psychological Levers</h1>
            <p className="text-muted-foreground">
              Your comprehensive spiritual growth dashboard
            </p>
          </div>
          <Button onClick={() => navigate("/profile")}>
            Back to Profile
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full md:w-auto">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Insights
            </TabsTrigger>
            <TabsTrigger value="quests" className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Quests
            </TabsTrigger>
            <TabsTrigger value="karma" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Karma
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Level</p>
                      <p className="text-2xl font-bold">{psychologicalProfile.level}</p>
                      <p className="text-xs text-muted-foreground">{userTier.title}</p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-500/20">
                      <TrendingUp className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-background/70 border border-blue-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Experience</p>
                      <p className="text-2xl font-bold">{psychologicalProfile.xp}</p>
                      <p className="text-xs text-muted-foreground">
                        {getProgressToNextLevel().toFixed(1)}% to next level
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-500/20">
                      <Zap className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-background/70 border border-green-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Streak</p>
                      <p className="text-2xl font-bold">{psychologicalProfile.streak.currentStreak}</p>
                      <p className="text-xs text-muted-foreground">days</p>
                    </div>
                    <div className="p-3 rounded-full bg-green-500/20">
                      <Activity className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-background/70 border border-amber-500/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Karma Balance</p>
                      <p className="text-2xl font-bold">{psychologicalProfile.karmaBalance.total}</p>
                      <p className="text-xs text-muted-foreground">points</p>
                    </div>
                    <div className="p-3 rounded-full bg-amber-500/20">
                      <Heart className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Compass className="h-5 w-5" />
                    Your Spiritual Path
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
                      <h3 className="font-medium">Initiated Deity</h3>
                      <p className="text-lg">
                        {psychologicalProfile.initiatedDeity || "Not set"}
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                      <h3 className="font-medium">Sacred Sankalpa</h3>
                      <p className="italic">
                        "{psychologicalProfile.sankalpa || "Take your sankalpa to begin your journey"}"
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h3 className="font-medium">User Title</h3>
                      <p>
                        {psychologicalProfile.titles.honorific || "Spiritual Seeker"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-background/70 border border-amber-500/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Practice Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                      <p className="text-2xl font-bold">{psychologicalProfile.practiceStats.meditationMinutes}</p>
                      <p className="text-sm text-muted-foreground">Meditation Minutes</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
                      <p className="text-2xl font-bold">{psychologicalProfile.practiceStats.mantrasRecited}</p>
                      <p className="text-sm text-muted-foreground">Mantras Recited</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <p className="text-2xl font-bold">{psychologicalProfile.practiceStats.ritualsPerformed}</p>
                      <p className="text-sm text-muted-foreground">Rituals Performed</p>
                    </div>
                    
                    <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                      <p className="text-2xl font-bold">{psychologicalProfile.practiceStats.sevaActs}</p>
                      <p className="text-sm text-muted-foreground">Seva Acts</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PersonalRhythmReports />
              <DoshaKoshaMapping />
            </div>
          </TabsContent>

          <TabsContent value="quests">
            <Quests />
          </TabsContent>

          <TabsContent value="karma">
            <KarmaBalance />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Earned Badges
                </CardTitle>
              </CardHeader>
              <CardContent>
                {earnedBadges.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {earnedBadges.map((badge) => (
                      <div 
                        key={badge.id} 
                        className="flex flex-col items-center p-4 rounded-lg border border-purple-500/20 bg-gradient-to-b from-purple-500/10 to-fuchsia-500/10"
                      >
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <h3 className="font-medium text-center text-sm">{badge.title}</h3>
                        <p className="text-xs text-muted-foreground text-center mt-1">{badge.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Badges Yet</h3>
                    <p className="text-muted-foreground">
                      Complete quests and achieve milestones to earn badges!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default PsychologicalLeversPage;