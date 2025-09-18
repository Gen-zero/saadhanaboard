import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Waves, 
  Flame, 
  Leaf, 
  Bone, 
  Heart, 
  Brain, 
  Crown, 
  Wind,
  Activity,
  Target
} from "lucide-react";
import { usePsychologicalLevers } from "@/hooks/usePsychologicalLevers";

const DOSHA_ICONS = {
  vata: <Wind className="h-4 w-4" />,
  pitta: <Flame className="h-4 w-4" />,
  kapha: <Leaf className="h-4 w-4" />
};

const DOSHA_COLORS = {
  vata: "from-gray-500 to-slate-500",
  pitta: "from-red-500 to-orange-500",
  kapha: "from-green-500 to-emerald-500"
};

const KOSHA_ICONS = {
  annamaya: <Bone className="h-4 w-4" />,
  pranamaya: <Wind className="h-4 w-4" />,
  manomaya: <Brain className="h-4 w-4" />,
  vijnanamaya: <Heart className="h-4 w-4" />,
  anandamaya: <Crown className="h-4 w-4" />
};

const KOSHA_COLORS = {
  annamaya: "from-amber-500 to-orange-500",
  pranamaya: "from-blue-500 to-cyan-500",
  manomaya: "from-purple-500 to-fuchsia-500",
  vijnanamaya: "from-green-500 to-emerald-500",
  anandamaya: "from-yellow-500 to-amber-500"
};

const DoshaKoshaMapping = () => {
  const { psychologicalProfile } = usePsychologicalLevers();
  
  // Calculate percentages for visualization
  const getMaxDoshaValue = () => {
    return Math.max(
      psychologicalProfile.doshaBalance.vata,
      psychologicalProfile.doshaBalance.pitta,
      psychologicalProfile.doshaBalance.kapha
    ) || 1; // Avoid division by zero
  };
  
  const getMaxKoshaValue = () => {
    return Math.max(
      psychologicalProfile.koshaMapping.annamaya,
      psychologicalProfile.koshaMapping.pranamaya,
      psychologicalProfile.koshaMapping.manomaya,
      psychologicalProfile.koshaMapping.vijnanamaya,
      psychologicalProfile.koshaMapping.anandamaya
    ) || 1; // Avoid division by zero
  };
  
  const maxDosha = getMaxDoshaValue();
  const maxKosha = getMaxKoshaValue();

  return (
    <Card className="backdrop-blur-sm bg-background/70 border border-purple-500/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Dosha & Kosha Mapping
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <Flame className="h-4 w-4" />
              Dosha Balance
            </h3>
            <Badge variant="outline">Constitutional Energies</Badge>
          </div>
          
          <div className="space-y-4">
            {Object.entries(psychologicalProfile.doshaBalance).map(([dosha, value]) => (
              <div key={dosha}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {DOSHA_ICONS[dosha as keyof typeof DOSHA_ICONS]}
                    <span className="capitalize font-medium">{dosha}</span>
                  </div>
                  <span className="text-sm font-medium">{value}</span>
                </div>
                <Progress 
                  value={(value / maxDosha) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
            <p className="text-sm">
              Your dominant dosha is{' '}
              <span className="font-medium">
                {psychologicalProfile.doshaBalance.vata > psychologicalProfile.doshaBalance.pitta && 
                 psychologicalProfile.doshaBalance.vata > psychologicalProfile.doshaBalance.kapha
                  ? 'Vata (Air/Ether)'
                  : psychologicalProfile.doshaBalance.pitta > psychologicalProfile.doshaBalance.kapha
                  ? 'Pitta (Fire/Water)'
                  : 'Kapha (Earth/Water)'}
              </span>
              . Focus on balancing practices that complement this energy.
            </p>
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium flex items-center gap-2">
              <Crown className="h-4 w-4" />
              Kosha Development
            </h3>
            <Badge variant="outline">Layers of Being</Badge>
          </div>
          
          <div className="space-y-4">
            {Object.entries(psychologicalProfile.koshaMapping).map(([kosha, value]) => (
              <div key={kosha}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    {KOSHA_ICONS[kosha as keyof typeof KOSHA_ICONS]}
                    <span className="capitalize font-medium">
                      {kosha.replace('maya', 'maya')}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{value}</span>
                </div>
                <Progress 
                  value={(value / maxKosha) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
            <p className="text-sm">
              Your most developed kosha is{' '}
              <span className="font-medium">
                {Object.entries(psychologicalProfile.koshaMapping).reduce((a, b) => 
                  psychologicalProfile.koshaMapping[a[0] as keyof typeof psychologicalProfile.koshaMapping] > 
                  psychologicalProfile.koshaMapping[b[0] as keyof typeof psychologicalProfile.koshaMapping] ? a : b
                )[0].replace('maya', 'maya')}
              </span>
              . Continue nurturing this aspect while exploring others.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoshaKoshaMapping;