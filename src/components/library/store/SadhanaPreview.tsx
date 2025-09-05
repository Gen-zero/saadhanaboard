import React from 'react';
import { StoreSadhana } from '@/types/store';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, Clock, Users, Calendar, Target, Heart, Book } from 'lucide-react';

interface SadhanaPreviewProps {
  sadhana: StoreSadhana | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (sadhana: StoreSadhana) => void;
  userLevel: number;
  spiritualPoints: number;
}

const SadhanaPreview: React.FC<SadhanaPreviewProps> = ({
  sadhana,
  isOpen,
  onClose,
  onPurchase,
  userLevel,
  spiritualPoints
}) => {
  if (!sadhana) return null;

  const isLocked = userLevel < sadhana.unlockLevel;
  const canAfford = spiritualPoints >= sadhana.price;
  const isOwned = sadhana.isUnlocked;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'advanced': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      default: return 'bg-gray-500/20 text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="text-4xl">{sadhana.genre.icon}</div>
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{sadhana.title}</DialogTitle>
              <DialogDescription className="text-base">
                {sadhana.description}
              </DialogDescription>
              
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="secondary" className={getDifficultyColor(sadhana.difficulty)}>
                  {sadhana.difficulty}
                </Badge>
                <Badge variant="outline">{sadhana.genre.name}</Badge>
                {sadhana.deity && (
                  <Badge variant="outline">{sadhana.deity}</Badge>
                )}
                {sadhana.tradition && (
                  <Badge variant="outline">{sadhana.tradition}</Badge>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{sadhana.duration} Days</p>
                <p className="text-xs text-muted-foreground">Duration</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{sadhana.completedBy}</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-400 fill-current" />
              <div>
                <p className="text-sm font-medium">{sadhana.rating}/5</p>
                <p className="text-xs text-muted-foreground">Rating</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">Level {sadhana.unlockLevel}</p>
                <p className="text-xs text-muted-foreground">Required</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Practices */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Practices
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sadhana.practices.map((practice, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-secondary/20 rounded">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="text-sm">{practice}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5" />
              Spiritual Benefits
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sadhana.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-green-500/10 rounded">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Book className="h-5 w-5" />
              Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {sadhana.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>

          {/* Purchase Section */}
          <div className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
            <div className="flex flex-col">
              {sadhana.price === 0 ? (
                <span className="text-2xl font-bold text-green-600">Free</span>
              ) : (
                <span className="text-2xl font-bold text-purple-600">
                  {sadhana.price} Spiritual Points
                </span>
              )}
              {isLocked && (
                <span className="text-sm text-muted-foreground">
                  Requires Level {sadhana.unlockLevel} (You are Level {userLevel})
                </span>
              )}
              {!canAfford && sadhana.price > 0 && !isLocked && (
                <span className="text-sm text-red-500">
                  Insufficient Spiritual Points (You have {spiritualPoints})
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              {isOwned ? (
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Start Practice
                </Button>
              ) : (
                <Button
                  size="lg"
                  onClick={() => onPurchase(sadhana)}
                  disabled={isLocked || (!canAfford && sadhana.price > 0)}
                  className={`${
                    sadhana.price === 0
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  }`}
                >
                  {sadhana.price === 0 ? 'Add to Library' : 'Purchase'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SadhanaPreview;