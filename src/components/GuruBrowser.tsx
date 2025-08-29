import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Calendar, Users, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GuruProfile {
  id: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  experience_level?: string;
  traditions?: string[];
  location?: string;
  available_for_guidance: boolean;
}

const GuruBrowser = () => {
  const [gurus, setGurus] = useState<GuruProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchGurus();
  }, []);

  const fetchGurus = async () => {
    try {
      // First get all guru user IDs
      const { data: guruRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'guru');

      if (roleError) {
        console.error('Error fetching guru roles:', roleError);
        return;
      }

      if (!guruRoles || guruRoles.length === 0) {
        setGurus([]);
        setIsLoading(false);
        return;
      }

      // Get guru profiles that are available for guidance
      const guruIds = guruRoles.map(role => role.user_id);
      const { data: guruProfiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .in('id', guruIds)
        .eq('available_for_guidance', true);

      if (profileError) {
        console.error('Error fetching guru profiles:', profileError);
        return;
      }

      setGurus(guruProfiles || []);
    } catch (error) {
      console.error('Error fetching gurus:', error);
      toast({
        title: "Error",
        description: "Failed to load gurus. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const requestMentorship = async (guruId: string, guruName: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to request mentorship.",
          variant: "destructive"
        });
        return;
      }

      // Check if request already exists
      const { data: existingRequest } = await supabase
        .from('mentorship_relationships')
        .select('id, status')
        .eq('guru_id', guruId)
        .eq('shishya_id', user.id)
        .single();

      if (existingRequest) {
        toast({
          title: "Request Already Sent",
          description: `You already have a ${existingRequest.status} mentorship request with ${guruName}.`,
          variant: "default"
        });
        return;
      }

      // Create new mentorship request
      const { error } = await supabase
        .from('mentorship_relationships')
        .insert({
          guru_id: guruId,
          shishya_id: user.id,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating mentorship request:', error);
        toast({
          title: "Error",
          description: "Failed to send mentorship request. Please try again.",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Request Sent",
        description: `Your mentorship request has been sent to ${guruName}.`,
      });

    } catch (error) {
      console.error('Error requesting mentorship:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Find Your Guru</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-muted rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded w-full"></div>
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (gurus.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No Gurus Available</h3>
        <p className="text-muted-foreground">
          There are currently no gurus available for guidance. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Find Your Guru</h2>
        <p className="text-muted-foreground">
          Connect with experienced spiritual guides to enhance your journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gurus.map((guru) => (
          <Card key={guru.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={guru.avatar_url} alt={guru.display_name} />
                  <AvatarFallback className="text-lg">
                    {guru.display_name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{guru.display_name}</CardTitle>
                  {guru.experience_level && (
                    <Badge variant="secondary" className="text-xs">
                      {guru.experience_level}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {guru.bio && (
                <CardDescription className="line-clamp-3">
                  {guru.bio}
                </CardDescription>
              )}
              
              {guru.location && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{guru.location}</span>
                </div>
              )}

              {guru.traditions && guru.traditions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {guru.traditions.map((tradition, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tradition}
                    </Badge>
                  ))}
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <Button 
                  onClick={() => requestMentorship(guru.id, guru.display_name)}
                  className="w-full"
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Request Mentorship
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GuruBrowser;