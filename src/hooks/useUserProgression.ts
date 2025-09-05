import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export interface UserProgression {
  level: number;
  experience: number;
  spiritualPoints: number;
  completedSadhanas: string[];
  unlockedGenres: string[];
  unlockedStoreSadhanas: string[]; // IDs of purchased/unlocked store sadhanas
  totalPracticeDays: number;
  longestStreak: number;
}

export const useUserProgression = () => {
  const { user } = useAuth();
  const [progression, setProgression] = useState<UserProgression>({
    level: 5, // Temporarily increased for testing
    experience: 500, // Enough XP for level 5
    spiritualPoints: 100,
    completedSadhanas: [],
    unlockedGenres: ['meditation', 'yoga', 'mantra', 'study', 'devotion'],
    unlockedStoreSadhanas: ['meditation-basics', 'surya-namaskara'], // Start with basic meditation and sun salutation
    totalPracticeDays: 0,
    longestStreak: 0
  });

  useEffect(() => {
    // Always load progression data, with or without user
    const userId = user?.id || 'guest';
    // Temporarily clear localStorage to test new level settings
    localStorage.removeItem(`user_progression_${userId}`);
    
    const savedProgression = localStorage.getItem(`user_progression_${userId}`);
    
    if (savedProgression) {
      try {
        const parsed = JSON.parse(savedProgression);
        setProgression(parsed);
      } catch (error) {
        console.error('Error loading user progression:', error);
        // If parsing fails, reset to initial state
        const initialProgression = {
          level: 5, // Temporarily increased for testing
          experience: 500,
          spiritualPoints: 100,
          completedSadhanas: [],
          unlockedGenres: ['meditation', 'yoga', 'mantra', 'study', 'devotion'],
          unlockedStoreSadhanas: ['meditation-basics', 'surya-namaskara'],
          totalPracticeDays: 0,
          longestStreak: 0
        };
        setProgression(initialProgression);
        localStorage.setItem(`user_progression_${userId}`, JSON.stringify(initialProgression));
      }
    } else {
      // Initialize new user with some starting resources
      const initialProgression = {
        level: 5, // Temporarily increased for testing
        experience: 500,
        spiritualPoints: 100,
        completedSadhanas: [],
        unlockedGenres: ['meditation', 'yoga', 'mantra', 'study', 'devotion'],
        unlockedStoreSadhanas: ['meditation-basics', 'surya-namaskara'], // Start with basic meditation and sun salutation
        totalPracticeDays: 0,
        longestStreak: 0
      };
      setProgression(initialProgression);
      localStorage.setItem(`user_progression_${userId}`, JSON.stringify(initialProgression));
    }
  }, [user]);

  const calculateLevel = (experience: number): number => {
    // Each level requires 100 more experience than the previous
    // Level 1: 0-99 XP, Level 2: 100-299 XP, Level 3: 300-599 XP, etc.
    return Math.floor(Math.sqrt(experience / 100)) + 1;
  };

  const getExperienceForNextLevel = (currentLevel: number): number => {
    return Math.pow(currentLevel, 2) * 100;
  };

  const addExperience = (amount: number) => {
    setProgression(prev => {
      const newExperience = prev.experience + amount;
      const newLevel = calculateLevel(newExperience);
      const leveledUp = newLevel > prev.level;
      
      const updated = {
        ...prev,
        experience: newExperience,
        level: newLevel,
        spiritualPoints: prev.spiritualPoints + (leveledUp ? newLevel * 10 : 5) // Bonus for leveling up
      };

      // Unlock new genres based on level
      const unlockedGenres = ['meditation', 'yoga'];
      if (newLevel >= 3) unlockedGenres.push('mantra');
      if (newLevel >= 4) unlockedGenres.push('study');
      if (newLevel >= 5) unlockedGenres.push('devotion');
      if (newLevel >= 6) unlockedGenres.push('service');
      if (newLevel >= 10) unlockedGenres.push('advanced');
      
      updated.unlockedGenres = unlockedGenres;

      if (user) {
        localStorage.setItem(`user_progression_${user?.id || 'guest'}`, JSON.stringify(updated));
      }

      return updated;
    });
  };

  const spendSpiritualPoints = (amount: number): boolean => {
    if (progression.spiritualPoints >= amount) {
      setProgression(prev => {
        const updated = {
          ...prev,
          spiritualPoints: prev.spiritualPoints - amount
        };
        
        if (user) {
          localStorage.setItem(`user_progression_${user?.id || 'guest'}`, JSON.stringify(updated));
        }
        
        return updated;
      });
      return true;
    }
    return false;
  };

  const completeSadhana = (sadhanaId: string, durationDays: number) => {
    setProgression(prev => {
      const experienceGained = durationDays * 10; // 10 XP per day
      const newExperience = prev.experience + experienceGained;
      const newLevel = calculateLevel(newExperience);
      const leveledUp = newLevel > prev.level;
      
      const updated = {
        ...prev,
        experience: newExperience,
        level: newLevel,
        spiritualPoints: prev.spiritualPoints + (durationDays * 5) + (leveledUp ? newLevel * 20 : 0),
        completedSadhanas: [...prev.completedSadhanas, sadhanaId],
        totalPracticeDays: prev.totalPracticeDays + durationDays,
        longestStreak: Math.max(prev.longestStreak, durationDays)
      };

      // Unlock new genres based on level
      const unlockedGenres = ['meditation', 'yoga'];
      if (newLevel >= 3) unlockedGenres.push('mantra');
      if (newLevel >= 4) unlockedGenres.push('study');
      if (newLevel >= 5) unlockedGenres.push('devotion');
      if (newLevel >= 6) unlockedGenres.push('service');
      if (newLevel >= 10) unlockedGenres.push('advanced');
      
      updated.unlockedGenres = unlockedGenres;

      if (user) {
        localStorage.setItem(`user_progression_${user?.id || 'guest'}`, JSON.stringify(updated));
      }

      return updated;
    });
  };

  const unlockStoreSadhana = (sadhanaId: string) => {
    setProgression(prev => {
      if (prev.unlockedStoreSadhanas.includes(sadhanaId)) {
        return prev; // Already unlocked
      }
      
      const updated = {
        ...prev,
        unlockedStoreSadhanas: [...prev.unlockedStoreSadhanas, sadhanaId]
      };

      if (user) {
        localStorage.setItem(`user_progression_${user?.id || 'guest'}`, JSON.stringify(updated));
      }

      return updated;
    });
  };

  const getProgressToNextLevel = () => {
    const currentLevelXP = Math.pow(progression.level - 1, 2) * 100;
    const nextLevelXP = getExperienceForNextLevel(progression.level);
    const progressXP = progression.experience - currentLevelXP;
    const requiredXP = nextLevelXP - currentLevelXP;
    
    return {
      current: progressXP,
      required: requiredXP,
      percentage: Math.min((progressXP / requiredXP) * 100, 100)
    };
  };

  return {
    progression,
    addExperience,
    spendSpiritualPoints,
    completeSadhana,
    unlockStoreSadhana,
    getProgressToNextLevel,
    calculateLevel,
    getExperienceForNextLevel
  };
};