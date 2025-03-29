
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { WandSparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManifestationFormProps {
  onClose: () => void;
}

const ManifestationForm = ({ onClose }: ManifestationFormProps) => {
  const [manifestationIntent, setManifestationIntent] = useState("");
  const { toast } = useToast();

  const handleSubmitManifestation = () => {
    // In a real app, this would save to a database
    toast({
      title: "Intention Manifested",
      description: "Your intention has been sent to the divine realm",
    });
    onClose();
  };

  return (
    <Card className="border-primary/20 bg-background/95 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WandSparkles className="h-5 w-5 text-primary" />
          <span>Manifest Your Intention</span>
        </CardTitle>
        <CardDescription>Communicate your intention to your deity for manifestation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="manifestation">Your Sacred Intention</Label>
          <Textarea 
            id="manifestation" 
            value={manifestationIntent}
            onChange={(e) => setManifestationIntent(e.target.value)}
            placeholder="Write your intention with clarity and devotion..."
            className="min-h-[150px]"
          />
          <p className="text-xs text-muted-foreground italic">
            Write with pure intention. Your deity will receive this message and help manifest it into reality.
          </p>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmitManifestation}>Send to Divine Realm</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManifestationForm;
