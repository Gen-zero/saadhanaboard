import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserRole, useUserRole } from '@/hooks/useUserRole';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth-context';
import { Loader2, Crown, BookOpen } from 'lucide-react';

interface RoleSelectionProps {
  onRoleSelected: (role: UserRole) => void;
}

export const RoleSelection: React.FC<RoleSelectionProps> = ({ onRoleSelected }) => {
  const { setUserRole } = useUserRole();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'guru' | 'shishya' | null>(null);

  const handleRoleSelect = async (role: 'guru' | 'shishya') => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to select a role.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      setSelectedRole(role);
      
      const { error } = await setUserRole(role);
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to set your role. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Role Selected",
        description: `You are now registered as a ${role === 'guru' ? 'Guru' : 'Shishya'}.`,
      });

      onRoleSelected(role);
    } catch (error) {
      console.error('Error setting role:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setSelectedRole(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/80 to-primary/5 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-4">
            Choose Your Spiritual Journey
          </h1>
          <p className="text-muted-foreground text-lg">
            Select your role in the spiritual community to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Guru Role */}
          <Card className="relative group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                  <Crown className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                Guru
                <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                  Teacher
                </Badge>
              </CardTitle>
              <CardDescription className="text-lg">
                Guide others on their spiritual path
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">As a Guru, you can:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Accept and guide multiple Shishyas</li>
                  <li>• Assign spiritual practices (Sadhanas)</li>
                  <li>• Monitor progress and provide guidance</li>
                  <li>• Share wisdom and teachings</li>
                  <li>• Create personalized spiritual journeys</li>
                </ul>
              </div>
              <Button
                onClick={() => handleRoleSelect('guru')}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                size="lg"
              >
                {isLoading && selectedRole === 'guru' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up your Guru profile...
                  </>
                ) : (
                  'Become a Guru'
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Shishya Role */}
          <Card className="relative group hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer border-2 hover:border-primary/50">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                Shishya
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Student
                </Badge>
              </CardTitle>
              <CardDescription className="text-lg">
                Learn and grow under spiritual guidance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">As a Shishya, you can:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Connect with an experienced Guru</li>
                  <li>• Receive personalized spiritual practices</li>
                  <li>• Track your spiritual progress</li>
                  <li>• Get guidance and feedback</li>
                  <li>• Join a supportive spiritual community</li>
                </ul>
              </div>
              <Button
                onClick={() => handleRoleSelect('shishya')}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                size="lg"
              >
                {isLoading && selectedRole === 'shishya' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up your Shishya profile...
                  </>
                ) : (
                  'Become a Shishya'
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            You can change your role later in your profile settings
          </p>
        </div>
      </div>
    </div>
  );
};