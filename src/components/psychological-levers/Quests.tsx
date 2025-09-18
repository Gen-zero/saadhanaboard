import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Compass, 
  Target, 
  Moon, 
  Shield, 
  Eye, 
  Sparkles,
  CheckCircle,
  Lock
} from "lucide-react";
import { usePsychologicalLevers } from "@/hooks/usePsychologicalLevers";

interface Quest {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  difficulty: "beginner" | "intermediate" | "advanced";
  xpReward: number;
  karmaReward: number;
  requirements: string[];
  isActive: boolean;
  isCompleted: boolean;
}

const QUESTS: Quest[] = [
  {
    id: "kali-mantra-21",
    title: "Kali Mantra Challenge",
    description: "Complete 21 nights of Kali mantra before Amavasya",
    icon: <Moon className="h-5 w-5" />,
    difficulty: "intermediate",
    xpReward: 500,
    karmaReward: 100,
    requirements: ["Level 3+", "Dedicated to Kali"],
    isActive: true,
    isCompleted: false
  },
  {
    id: "mauna-vrata",
    title: "Silence Vow",
    description: "Balance your tapas with a day of silence (mauna vrata)",
    icon: <Eye className="h-5 w-5" />,
    difficulty: "beginner",
    xpReward: 200,
    karmaReward: 50,
    requirements: ["7-day streak"],
    isActive: true,
    isCompleted: false
  },
  {
    id: "kosha-balance",
    title: "Kosha Balance Quest",
    description: "Practice all five koshas in one week",
    icon: <Sparkles className="h-5 w-5" />,
    difficulty: "advanced",
    xpReward: 1000,
    karmaReward: 200,
    requirements: ["Level 5+", "Kosha Master Badge"],
    isActive: false,
    isCompleted: false
  },
  {
    id: "elemental-journey",
    title: "Elemental Journey",
    description: "Complete practices representing all five elements",
    icon: <Compass className="h-5 w-5" />,
    difficulty: "intermediate",
    xpReward: 750,
    karmaReward: 150,
    requirements: ["Level 4+"],
    isActive: true,
    isCompleted: true
  }
];

const Quests = () => {
  const { psychologicalProfile, addKarmaPoints } = usePsychologicalLevers();
  const [activeQuests, setActiveQuests] = useState<Quest[]>(QUESTS);

  const startQuest = (questId: string) => {
    setActiveQuests(prev => prev.map(quest => 
      quest.id === questId ? { ...quest, isActive: true } : quest
    ));
  };

  const completeQuest = (questId: string) => {
    const quest = activeQuests.find(q => q.id === questId);
    if (quest) {
      // Add rewards
      addKarmaPoints(quest.karmaReward);
      
      // Update quest status
      setActiveQuests(prev => prev.map(q => 
        q.id === questId ? { ...q, isCompleted: true, isActive: false } : q
      ));
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner": return "bg-green-500/20 text-green-500 border-green-500/30";
      case "intermediate": return "bg-amber-500/20 text-amber-500 border-amber-500/30";
      case "advanced": return "bg-red-500/20 text-red-500 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

  return (
    <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Compass className="h-5 w-5" />
          Spiritual Quests
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Embark on interactive spiritual paths to deepen your practice and earn rewards.
        </p>
        
        <div className="space-y-4">
          {activeQuests.map((quest) => (
            <div 
              key={quest.id} 
              className={`p-4 rounded-lg border ${
                quest.isCompleted 
                  ? "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30" 
                  : quest.isActive
                  ? "bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border-purple-500/30"
                  : "bg-gradient-to-r from-gray-500/10 to-slate-500/10 border-gray-500/30"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    quest.isCompleted 
                      ? "bg-green-500/20 text-green-500" 
                      : quest.isActive
                      ? "bg-purple-500/20 text-purple-500"
                      : "bg-gray-500/20 text-gray-500"
                  }`}>
                    {quest.isCompleted ? <CheckCircle className="h-5 w-5" /> : quest.icon}
                  </div>
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {quest.title}
                      {quest.isCompleted && (
                        <Badge variant="secondary" className="text-xs">
                          Completed
                        </Badge>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quest.description}
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getDifficultyColor(quest.difficulty)}`}
                      >
                        {quest.difficulty}
                      </Badge>
                      
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {quest.xpReward} XP
                      </Badge>
                      
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        {quest.karmaReward} Karma
                      </Badge>
                    </div>
                    
                    {!quest.isCompleted && quest.requirements.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs text-muted-foreground">
                          Requirements:
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {quest.requirements.map((req, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {!quest.isCompleted && (
                  <div>
                    {quest.isActive ? (
                      <Button 
                        size="sm" 
                        onClick={() => completeQuest(quest.id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                      >
                        Complete
                      </Button>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => startQuest(quest.id)}
                        disabled={!psychologicalProfile.initiatedDeity && quest.id === "kali-mantra-21"}
                      >
                        {psychologicalProfile.initiatedDeity || quest.id !== "kali-mantra-21" ? "Start Quest" : <Lock className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="pt-4 border-t border-purple-500/10">
          <p className="text-xs text-muted-foreground">
            New quests unlock as you progress on your spiritual journey. 
            Complete quests to earn XP and Karma rewards.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Quests;