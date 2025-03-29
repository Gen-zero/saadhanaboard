
import { MoonStar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const GuidedMeditation = () => {
  return (
    <div className="text-center p-10 space-y-6">
      <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center">
        <MoonStar className="h-10 w-10 text-purple-500 animate-pulse" />
      </div>
      <h3 className="text-xl font-medium">Guided Meditation with Your Deity</h3>
      <p className="text-muted-foreground">
        Close your eyes and connect with your higher self. 
        Visualize your deity before you, embodying both your shadow and perfect aspects in harmony.
      </p>
      <div className="flex justify-center">
        <Button 
          className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700"
        >
          Begin Guided Meditation
        </Button>
      </div>
    </div>
  );
};

export default GuidedMeditation;
