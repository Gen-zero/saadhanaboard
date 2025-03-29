
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Edit, Heart } from 'lucide-react';
import { useState } from 'react';

const SaadhanaBoard = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data for sadhana board
  const sadhanaData = {
    purpose: "To deepen my connection with the divine and cultivate inner peace.",
    goal: "Complete a 40-day meditation practice focusing on gratitude and compassion.",
    deity: "Universal Divine Consciousness",
    message: "I offer my practice with devotion and seek guidance on this spiritual journey.",
    offerings: [
      "Daily meditation for 30 minutes",
      "Weekly reading of sacred texts",
      "Acts of service in my community",
      "Abstaining from negative speech",
      "Practice of gratitude"
    ]
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <span>Saadhana Board</span>
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4" />
            {isEditing ? 'View Mode' : 'Edit Details'}
          </Button>
        </div>
        <p className="text-muted-foreground">
          Your spiritual intentions, goals, and devotional practice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Purpose & Goal</CardTitle>
              <CardDescription>Why you're on this spiritual journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="bg-secondary/40 p-4 rounded-lg">
                    <h3 className="font-medium">Purpose</h3>
                    <p className="mt-2 text-muted-foreground">
                      {sadhanaData.purpose}
                    </p>
                  </div>
                  <div className="bg-secondary/40 p-4 rounded-lg">
                    <h3 className="font-medium">Goal</h3>
                    <p className="mt-2 text-muted-foreground">
                      {sadhanaData.goal}
                    </p>
                  </div>
                </>
              )}
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
              {isEditing ? (
                <>
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
                </>
              ) : (
                <>
                  <div className="bg-accent/40 p-4 rounded-lg text-center">
                    <h3 className="font-medium text-lg">{sadhanaData.deity}</h3>
                  </div>
                  <div className="bg-secondary/40 p-4 rounded-lg italic">
                    <p className="text-muted-foreground">
                      "{sadhanaData.message}"
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Offerings & Practices</CardTitle>
            <CardDescription>What you'll be doing or offering for your spiritual practice</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-4">
                {sadhanaData.offerings.map((offering, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      defaultValue={offering} 
                      placeholder={`Offering or practice ${index + 1}`}
                    />
                    <Button variant="ghost" size="icon" className="shrink-0">×</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">+ Add New Offering</Button>
              </div>
            ) : (
              <div className="bg-secondary/30 p-6 rounded-lg space-y-4">
                <ul className="space-y-3">
                  {sadhanaData.offerings.map((offering, index) => (
                    <li key={index} className="flex items-start gap-3 hover-lift">
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <p>{offering}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {isEditing && (
              <Button className="w-full mt-6">Save Changes</Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SaadhanaBoard;
