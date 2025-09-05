import React, { useState, useEffect } from 'react';
import { StoreSadhana } from '@/types/store';
import { sadhanaGenres } from '@/data/storeSadhanas';
import { getStoreSadhanasByGenreWithUnlockStatus } from '@/utils/storeUtils';
import { useUserProgression } from '@/hooks/useUserProgression';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Store, Coins, TrendingUp, Award } from 'lucide-react';
import GenreSlider from './GenreSlider';
import SadhanaPreview from './SadhanaPreview';

const SadhanaStore: React.FC = () => {
  const { toast } = useToast();
  const [selectedSadhana, setSelectedSadhana] = useState<StoreSadhana | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Get user progression
  const { progression, spendSpiritualPoints, addExperience, unlockStoreSadhana, getProgressToNextLevel } = useUserProgression();
  const { level: userLevel, spiritualPoints } = progression;
  const levelProgress = getProgressToNextLevel();

  // Error boundary for data loading
  useEffect(() => {
    try {
      // Test if core data is available
      if (!sadhanaGenres || !Array.isArray(sadhanaGenres)) {
        throw new Error('Sadhana genres data is not available');
      }
      if (!progression) {
        throw new Error('User progression data is not available');
      }
    } catch (err) {
      console.error('Error loading store data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load store data');
    }
  }, [progression]);

  const handlePurchase = (sadhana: StoreSadhana) => {
    if (userLevel < sadhana.unlockLevel) {
      toast({
        title: "Sadhana Locked",
        description: `This practice requires Level ${sadhana.unlockLevel}. Continue your spiritual journey to unlock it.`,
        variant: "destructive"
      });
      return;
    }

    if (sadhana.price > 0 && spiritualPoints < sadhana.price) {
      toast({
        title: "Insufficient Spiritual Points",
        description: `You need ${sadhana.price} spiritual points. Complete more practices to earn points.`,
        variant: "destructive"
      });
      return;
    }

    // Handle purchase logic here
    if (sadhana.price > 0) {
      const success = spendSpiritualPoints(sadhana.price);
      if (!success) {
        toast({
          title: "Purchase Failed",
          description: "Unable to complete the purchase. Please try again.",
          variant: "destructive"
        });
        return;
      }
    }

    // Unlock the sadhana
    unlockStoreSadhana(sadhana.id);

    // Award some experience for unlocking new practices
    addExperience(20);
    
    toast({
      title: "Sadhana Added!",
      description: `${sadhana.title} has been added to your spiritual library.`,
      duration: 3000
    });

    // Close preview if open
    setIsPreviewOpen(false);
  };

  const handlePreview = (sadhana: StoreSadhana) => {
    setSelectedSadhana(sadhana);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedSadhana(null);
  };

  // Error handling
  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Error Loading Store</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => setError(null)}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Store Header */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 border-purple-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-purple-500" />
              <div>
                <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
                  Sadhana Store
                </CardTitle>
                <p className="text-muted-foreground">
                  Discover and unlock spiritual practices for your journey
                </p>
              </div>
            </div>
            
            {/* User Stats */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 bg-secondary/20 px-4 py-3 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-bold text-blue-500">Level {userLevel}</span>
                  </div>
                  <div className="w-24">
                    <Progress value={levelProgress.percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {levelProgress.current}/{levelProgress.required} XP
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-secondary/20 px-3 py-2 rounded-lg">
                <Coins className="h-4 w-4 text-yellow-500" />
                <div className="text-center">
                  <p className="text-sm font-medium">Spiritual Points</p>
                  <p className="text-lg font-bold text-yellow-500">{spiritualPoints}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-secondary/20 px-3 py-2 rounded-lg">
                <Award className="h-4 w-4 text-green-500" />
                <div className="text-center">
                  <p className="text-sm font-medium">Unlocked</p>
                  <p className="text-lg font-bold text-green-500">
                    {progression?.unlockedGenres?.length || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Genre Info */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground mb-4">
            Progress through your spiritual journey to unlock new genres and advanced practices. 
            Each completed sadhana earns you experience and spiritual points.
          </p>
          <div className="flex flex-wrap gap-2">
            {sadhanaGenres && Array.isArray(sadhanaGenres) && sadhanaGenres.map((genre) => (
              <Badge
                key={genre.id}
                variant={progression?.unlockedGenres?.includes(genre.id) ? "default" : "secondary"}
                className={`${
                  progression?.unlockedGenres?.includes(genre.id)
                    ? 'bg-green-500/20 text-green-700 dark:text-green-300' 
                    : 'opacity-50'
                }`}
              >
                {genre.icon} {genre.name}
                {!progression?.unlockedGenres?.includes(genre.id) && ` (Level ${genre.unlockLevel})`}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Genre Sliders */}
      <div className="space-y-4">
        {sadhanaGenres && Array.isArray(sadhanaGenres) && sadhanaGenres.map((genre) => {
          try {
            const genreSadhanas = getStoreSadhanasByGenreWithUnlockStatus(genre.id, progression);
            if (!genreSadhanas || genreSadhanas.length === 0) {
              return null; // Don't render empty genres
            }
            return (
              <GenreSlider
                key={genre.id}
                genre={genre}
                sadhanas={genreSadhanas}
                userLevel={userLevel}
                spiritualPoints={spiritualPoints}
                onPurchase={handlePurchase}
                onPreview={handlePreview}
              />
            );
          } catch (genreError) {
            console.error(`Error loading genre ${genre.id}:`, genreError);
            return (
              <div key={genre.id} className="p-4 border border-red-200 rounded-lg">
                <p className="text-red-600">Error loading {genre.name}</p>
              </div>
            );
          }
        })}
      </div>

      {/* Preview Modal */}
      <SadhanaPreview
        sadhana={selectedSadhana}
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        onPurchase={handlePurchase}
        userLevel={userLevel}
        spiritualPoints={spiritualPoints}
      />
    </div>
  );
};

export default SadhanaStore;