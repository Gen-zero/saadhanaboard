import React, { useRef } from 'react';
import { SadhanaGenre, StoreSadhana } from '@/types/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import SadhanaCard from './SadhanaCard';

interface GenreSliderProps {
  genre: SadhanaGenre;
  sadhanas: StoreSadhana[];
  userLevel: number;
  spiritualPoints: number;
  onPurchase: (sadhana: StoreSadhana) => void;
  onPreview: (sadhana: StoreSadhana) => void;
}

const GenreSlider: React.FC<GenreSliderProps> = ({
  genre,
  sadhanas,
  userLevel,
  spiritualPoints,
  onPurchase,
  onPreview
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isGenreUnlocked = userLevel >= genre.unlockLevel;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300;
      const newScrollPosition = direction === 'left'
        ? scrollContainerRef.current.scrollLeft - scrollAmount
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth'
      });
    }
  };

  if (sadhanas.length === 0) return null;

  return (
    <Card className={`mb-6 ${!isGenreUnlocked ? 'opacity-60' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{genre.icon}</div>
            <div>
              <CardTitle className="flex items-center gap-2">
                {genre.name}
                {!isGenreUnlocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {genre.description}
                {!isGenreUnlocked && ` • Unlocks at Level ${genre.unlockLevel}`}
              </p>
            </div>
          </div>
          
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="h-8 w-8"
              disabled={!isGenreUnlocked}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="h-8 w-8"
              disabled={!isGenreUnlocked}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {sadhanas.map((sadhana) => (
            <div key={sadhana.id} className="flex-shrink-0 w-80">
              <SadhanaCard
                sadhana={sadhana}
                userLevel={isGenreUnlocked ? userLevel : 0}
                spiritualPoints={spiritualPoints}
                onPurchase={onPurchase}
                onPreview={onPreview}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GenreSlider;