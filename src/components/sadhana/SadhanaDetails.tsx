
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';

interface SadhanaDetailsProps {
  sadhanaData: {
    purpose: string;
    goal: string;
    deity: string;
    message: string;
    offerings: string[];
  };
}

const SadhanaDetails = ({ sadhanaData }: SadhanaDetailsProps) => {
  const [offerings, setOfferings] = useState([...sadhanaData.offerings]);

  const handleAddOffering = () => {
    setOfferings([...offerings, '']);
  };

  const handleRemoveOffering = (index: number) => {
    const newOfferings = [...offerings];
    newOfferings.splice(index, 1);
    setOfferings(newOfferings);
  };

  const handleOfferingChange = (index: number, value: string) => {
    const newOfferings = [...offerings];
    newOfferings[index] = value;
    setOfferings(newOfferings);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Purpose & Goal</CardTitle>
            <CardDescription>Why you're on this spiritual journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Textarea 
                id="purpose" 
                defaultValue={sadhanaData.purpose} 
                placeholder="What is the purpose of your spiritual practice?"
                className="min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal">Goal</Label>
              <Textarea 
                id="goal" 
                defaultValue={sadhanaData.goal} 
                placeholder="What is your specific spiritual goal?"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Divine Connection</span>
            </CardTitle>
            <CardDescription>Your chosen deity or spiritual focus</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deity">Deity or Spiritual Focus</Label>
              <Input 
                id="deity" 
                defaultValue={sadhanaData.deity} 
                placeholder="Who or what is your spiritual focus?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea 
                id="message" 
                defaultValue={sadhanaData.message} 
                placeholder="What message would you like to share with your deity?"
                className="min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offerings & Practices</CardTitle>
          <CardDescription>What you'll be doing or offering for your spiritual practice</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {offerings.map((offering, index) => (
              <div key={index} className="flex gap-2">
                <Input 
                  value={offering} 
                  onChange={(e) => handleOfferingChange(index, e.target.value)}
                  placeholder={`Offering or practice ${index + 1}`}
                />
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="shrink-0"
                  onClick={() => handleRemoveOffering(index)}
                >
                  ×
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2" onClick={handleAddOffering}>
              + Add New Offering
            </Button>
          </div>
          <Button className="w-full mt-6">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SadhanaDetails;
