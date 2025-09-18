import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Zap, 
  Droplets, 
  Mountain, 
  Wind, 
  Sun, 
  Moon,
  Calendar,
  TrendingUp
} from "lucide-react";
import { usePsychologicalLevers } from "@/hooks/usePsychologicalLevers";

const ELEMENT_ICONS = {
  Fire: <Zap className="h-4 w-4" />,
  Water: <Droplets className="h-4 w-4" />,
  Earth: <Mountain className="h-4 w-4" />,
  Air: <Wind className="h-4 w-4" />,
  Ether: <Sun className="h-4 w-4" />
};

const ELEMENT_COLORS = {
  Fire: "from-red-500 to-orange-500",
  Water: "from-blue-500 to-cyan-500",
  Earth: "from-green-500 to-emerald-500",
  Air: "from-gray-500 to-slate-500",
  Ether: "from-purple-500 to-fuchsia-500"
};

const PersonalRhythmReports = () => {
  const { psychologicalProfile } = usePsychologicalLevers();

  // Get recommendations based on energy analysis
  const getRecommendations = () => {
    const { primaryElement, recommendedPractices } = psychologicalProfile.energyAnalysis;
    
    switch (primaryElement) {
      case 'Fire':
        return [
          "Your strongest energy is Fire (Agni). To balance, try Water-based sādhanās like Chandra Gayatri.",
          "Consider cooling practices like moon salutations or gentle restorative yoga.",
          "Focus on devotion and surrender practices to balance your fiery nature."
        ];
      case 'Water':
        return [
          "Your energy flows like Water. To balance, try Fire-based sādhanās like Surya Gayatri.",
          "Incorporate more structured practices to channel your fluid energy.",
          "Practice grounding techniques to enhance stability."
        ];
      case 'Earth':
        return [
          "Your grounding energy is Earth-like. To balance, try Air-based practices.",
          "Incorporate more movement and breathwork to energize your practice.",
          "Try meditation practices that focus on expansion and lightness."
        ];
      case 'Air':
        return [
          "Your energy is Air-like. To balance, try Earth-based grounding practices.",
          "Focus on longer-held postures and mindful movement.",
          "Incorporate more devotional practices to deepen your connection."
        ];
      case 'Ether':
        return [
          "Your energy resonates with Ether. To balance, try Earth-based grounding practices.",
          "Focus on embodied practices that connect you to the physical realm.",
          "Incorporate more structured rituals to anchor your expansive nature."
        ];
      default:
        return recommendedPractices;
    }
  };

  const recommendations = getRecommendations();

  return (
    <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Personal Rhythm Report
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
          <div>
            <h3 className="font-medium">Primary Energy Element</h3>
            <p className="text-sm text-muted-foreground">
              Based on your practice patterns
            </p>
          </div>
          <Badge 
            className={`flex items-center gap-2 bg-gradient-to-r ${ELEMENT_COLORS[psychologicalProfile.energyAnalysis.primaryElement as keyof typeof ELEMENT_COLORS]}`}
          >
            {ELEMENT_ICONS[psychologicalProfile.energyAnalysis.primaryElement as keyof typeof ELEMENT_ICONS]}
            {psychologicalProfile.energyAnalysis.primaryElement}
          </Badge>
        </div>

        <div>
          <h3 className="font-medium mb-3">Energy Insights</h3>
          <div className="space-y-3">
            <div className="p-3 rounded-lg border border-blue-500/20 bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
              <p className="text-sm">
                <strong>Peak Practice Days:</strong> {psychologicalProfile.energyAnalysis.peakDays.join(', ')}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                These are your most energetically favorable days for spiritual practice
              </p>
            </div>
            
            <div className="p-3 rounded-lg border border-green-500/20 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
              <p className="text-sm">
                Your practice peaks on {psychologicalProfile.energyAnalysis.peakDays[0]?.toLowerCase() || 'certain'} days. 
                Want to explore {psychologicalProfile.energyAnalysis.primaryElement}-based sādhanās?
              </p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Personalized Recommendations</h3>
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div 
                key={index} 
                className="p-3 rounded-lg border border-amber-500/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10"
              >
                <p className="text-sm">{recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalRhythmReports;