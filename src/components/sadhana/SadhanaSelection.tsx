import React, { useState } from 'react';
import { StoreSadhana } from '@/types/store';
import { storeSadhanas } from '@/data/storeSadhanas';
import { useUserProgression } from '@/hooks/useUserProgression';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { 
  Sparkles, 
  Plus, 
  Star, 
  Clock, 
  Users, 
  Lock, 
  Crown,
  BookOpen,
  Heart,
  Library,
  Wand2
} from 'lucide-react';
import SadhanaPreview from '../library/store/SadhanaPreview';

interface SadhanaSelectionProps {
  onSelectStoreSadhana: (sadhana: StoreSadhana) => void;
  onCreateCustomSadhana: () => void;
  onCancel: () => void;
}

const SadhanaSelection: React.FC<SadhanaSelectionProps> = ({
  onSelectStoreSadhana,
  onCreateCustomSadhana,
  onCancel
}) => {
  const { toast } = useToast();
  const { progression, spendSpiritualPoints, unlockStoreSadhana } = useUserProgression();
  const { level: userLevel, spiritualPoints } = progression;
  
  const [selectedSadhana, setSelectedSadhana] = useState<StoreSadhana | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('browse');

  // Filter available sadhanas (unlocked by level and some free/beginner options)
  const availableSadhanas = storeSadhanas.filter(sadhana => 
    userLevel >= sadhana.unlockLevel
  ).slice(0, 6); // Show top 6 available sadhanas

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'advanced': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  const handlePurchaseAndStart = (sadhana: StoreSadhana) => {
    const isOwned = progression.unlockedStoreSadhanas.includes(sadhana.id);
    
    if (!isOwned) {
      // Need to purchase first
      if (sadhana.price > 0 && spiritualPoints < sadhana.price) {
        toast({
          title: "Insufficient Spiritual Points",
          description: `You need ${sadhana.price} spiritual points. Complete more practices to earn points.`,
          variant: "destructive"
        });
        return;
      }

      // Handle purchase
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
      
      toast({
        title: "Sadhana Purchased!",
        description: `${sadhana.title} has been added to your library.`,
      });
    }

    // Start the sadhana
    onSelectStoreSadhana(sadhana);
  };

  const handlePreview = (sadhana: StoreSadhana) => {
    setSelectedSadhana(sadhana);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedSadhana(null);
  };

  return (
    <div className="cosmic-nebula-bg rounded-lg p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
            Choose Your Sacred Path
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select from our curated spiritual practices or create your own personalized sadhana journey.
          </p>
        </div>

        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/50 backdrop-blur-sm border border-purple-500/20">
            <TabsTrigger 
              value="browse" 
              className="flex items-center gap-2 data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-700 dark:data-[state=active]:text-purple-300"
            >
              <Library className="h-4 w-4" />
              Browse Available Sadhanas
            </TabsTrigger>
            <TabsTrigger 
              value="create" 
              className="flex items-center gap-2 data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-700 dark:data-[state=active]:text-fuchsia-300"
            >
              <Wand2 className="h-4 w-4" />
              Create Custom Sadhana
            </TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6 mt-6">
            {/* Available Sadhanas */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="h-6 w-6 text-purple-500" />
                <h3 className="text-xl font-semibold">Available Spiritual Practices</h3>
                <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 dark:text-purple-300">
                  {availableSadhanas.length} practices available
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availableSadhanas.map((sadhana) => {
                  const isOwned = progression.unlockedStoreSadhanas.includes(sadhana.id);
                  const canAfford = spiritualPoints >= sadhana.price;

                  return (
                    <Card 
                      key={sadhana.id} 
                      className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-purple-500/20 relative"
                    >
                      {sadhana.isPremium && (
                        <div className="absolute top-2 right-2 z-10">
                          <Crown className="h-5 w-5 text-yellow-500" />
                        </div>
                      )}
                      
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg">{sadhana.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {sadhana.description}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <div className="text-2xl">{sadhana.genre.icon}</div>
                          <Badge variant="secondary" className={getDifficultyColor(sadhana.difficulty)}>
                            {sadhana.difficulty}
                          </Badge>
                          {sadhana.deity && (
                            <Badge variant="outline" className="text-xs">
                              {sadhana.deity}
                            </Badge>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="space-y-4">
                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{sadhana.duration} days</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{sadhana.completedBy}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span>{sadhana.rating}</span>
                            </div>
                          </div>

                          {/* Benefits Preview */}
                          <div>
                            <h4 className="text-sm font-medium mb-1">Key Benefits:</h4>
                            <div className="flex flex-wrap gap-1">
                              {sadhana.benefits.slice(0, 2).map((benefit, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                              {sadhana.benefits.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{sadhana.benefits.length - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Price and Actions */}
                          <div className="flex items-center justify-between pt-2 border-t">
                            <div className="flex flex-col">
                              {sadhana.price === 0 ? (
                                <span className="text-lg font-bold text-green-600">Free</span>
                              ) : (
                                <span className="text-lg font-bold text-purple-600">
                                  {sadhana.price} SP
                                </span>
                              )}
                              {!canAfford && sadhana.price > 0 && (
                                <span className="text-xs text-red-500">
                                  Need {sadhana.price - spiritualPoints} more SP
                                </span>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePreview(sadhana)}
                              >
                                Preview
                              </Button>
                              
                              <Button
                                size="sm"
                                onClick={() => handlePurchaseAndStart(sadhana)}
                                disabled={!canAfford && sadhana.price > 0}
                                className={`${
                                  isOwned
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : sadhana.price === 0
                                    ? 'bg-green-600 hover:bg-green-700'
                                    : 'bg-purple-600 hover:bg-purple-700'
                                }`}
                              >
                                {isOwned ? 'Start Practice' : sadhana.price === 0 ? 'Start Free' : 'Buy & Start'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6 mt-6">
            {/* Custom Sadhana Creation */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-fuchsia-500" />
                <h3 className="text-xl font-semibold">Create Your Own Path</h3>
              </div>

              <div className="grid gap-6">
                {/* Main Custom Sadhana Card */}
                <Card className="border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-500/10 via-purple-500/10 to-fuchsia-500/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-2xl">
                      <Heart className="h-6 w-6 text-fuchsia-500" />
                      Custom Sadhana Creation
                    </CardTitle>
                    <p className="text-muted-foreground text-lg">
                      Design a personalized spiritual practice tailored to your unique journey, goals, and preferences.
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Features Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <h4 className="font-semibold text-fuchsia-700 dark:text-fuchsia-300">Personalization Options</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-fuchsia-500" />
                            <span className="text-sm">Choose your spiritual purpose & goals</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-fuchsia-500" />
                            <span className="text-sm">Select your deity or divine focus</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-fuchsia-500" />
                            <span className="text-sm">Set flexible practice duration</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h4 className="font-semibold text-fuchsia-700 dark:text-fuchsia-300">Practice Elements</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-fuchsia-500" />
                            <span className="text-sm">Custom daily offerings & rituals</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Wand2 className="h-4 w-4 text-fuchsia-500" />
                            <span className="text-sm">Personal intention messages</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star className="h-4 w-4 text-fuchsia-500" />
                            <span className="text-sm">Sacred paper visualization</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Call to Action */}
                    <div className="text-center pt-4 border-t border-fuchsia-500/20">
                      <Button 
                        onClick={onCreateCustomSadhana}
                        size="lg"
                        className="bg-gradient-to-r from-fuchsia-500 to-purple-500 hover:from-fuchsia-600 hover:to-purple-600 text-white px-8 py-3 text-lg"
                      >
                        <Plus className="mr-2 h-5 w-5" />
                        Start Creating Your Sadhana
                      </Button>
                      <p className="text-sm text-muted-foreground mt-2">
                        Express your unique spiritual path through personalized practice
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Benefits of Custom Creation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-fuchsia-500/20">
                    <CardContent className="pt-6 text-center">
                      <Sparkles className="h-8 w-8 text-fuchsia-500 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">Completely Yours</h4>
                      <p className="text-sm text-muted-foreground">
                        Every aspect reflects your personal spiritual journey and goals
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-fuchsia-500/20">
                    <CardContent className="pt-6 text-center">
                      <Heart className="h-8 w-8 text-fuchsia-500 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">Intuitive Flow</h4>
                      <p className="text-sm text-muted-foreground">
                        Follow your inner guidance to create meaningful practices
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-fuchsia-500/20">
                    <CardContent className="pt-6 text-center">
                      <Wand2 className="h-8 w-8 text-fuchsia-500 mx-auto mb-2" />
                      <h4 className="font-semibold mb-1">Flexible Design</h4>
                      <p className="text-sm text-muted-foreground">
                        Adapt duration, practices, and focus to fit your lifestyle
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex justify-center pt-6">
          <Button variant="outline" onClick={onCancel}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      {/* Preview Modal */}
      {selectedSadhana && (
        <SadhanaPreview
          sadhana={selectedSadhana}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          onPurchase={handlePurchaseAndStart}
          userLevel={userLevel}
          spiritualPoints={spiritualPoints}
        />
      )}
    </div>
  );
};

export default SadhanaSelection;