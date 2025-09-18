import { useState, useEffect } from 'react';
import { useUserProgression } from './useUserProgression';
import { useProfileData } from './useProfileData';
import { ALL_BADGES, Badge, UserBadges } from '@/types/badges';

const BADGES_STORAGE_KEY = 'user-badges';

const getInitialBadges = (): UserBadges => {
  try {
    const stored = localStorage.getItem(BADGES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.log('Could not load user badges from localStorage');
  }
  
  return {
    badges: ALL_BADGES,
    earnedBadges: []
  };
};

export const useBadges = () => {
  const { progression } = useUserProgression();
  const { history } = useProfileData();
  const [userBadges, setUserBadges] = useState<UserBadges>(getInitialBadges());

  // Save badges to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(BADGES_STORAGE_KEY, JSON.stringify(userBadges));
    } catch (error) {
      console.log('Could not save user badges to localStorage');
    }
  }, [userBadges]);

  // Check for earned badges based on user progression and history
  useEffect(() => {
    const earnedBadges = new Set(userBadges.earnedBadges);
    let newBadgesEarned = false;

    // Count sadhanas by genre
    const sadhanaCounts: Record<string, number> = {};
    history.forEach(sadhana => {
      // For now, we'll use a simple approach to determine genre
      // In a real implementation, this would be based on the actual sadhana data
      if (sadhana.title.toLowerCase().includes('meditation')) {
        sadhanaCounts['meditation'] = (sadhanaCounts['meditation'] || 0) + 1;
      } else if (sadhana.title.toLowerCase().includes('yoga')) {
        sadhanaCounts['yoga'] = (sadhanaCounts['yoga'] || 0) + 1;
      } else if (sadhana.title.toLowerCase().includes('mantra')) {
        sadhanaCounts['mantra'] = (sadhanaCounts['mantra'] || 0) + 1;
      } else if (sadhana.title.toLowerCase().includes('study')) {
        sadhanaCounts['study'] = (sadhanaCounts['study'] || 0) + 1;
      } else if (sadhana.title.toLowerCase().includes('devotion')) {
        sadhanaCounts['devotion'] = (sadhanaCounts['devotion'] || 0) + 1;
      }
    });

    // Check each badge criteria
    ALL_BADGES.forEach(badge => {
      if (earnedBadges.has(badge.id)) return; // Already earned

      let shouldEarn = false;

      switch (badge.id) {
        case 'first-sadhana':
          shouldEarn = progression.completedSadhanas.length >= 1;
          break;
        case 'five-sadhanas':
          shouldEarn = progression.completedSadhanas.length >= 5;
          break;
        case 'ten-sadhanas':
          shouldEarn = progression.completedSadhanas.length >= 10;
          break;
        case 'twenty-sadhanas':
          shouldEarn = progression.completedSadhanas.length >= 20;
          break;
        case 'fifty-sadhanas':
          shouldEarn = progression.completedSadhanas.length >= 50;
          break;
        case 'seven-day-streak':
          shouldEarn = progression.totalPracticeDays >= 7;
          break;
        case 'thirty-day-streak':
          shouldEarn = progression.totalPracticeDays >= 30;
          break;
        case 'hundred-day-streak':
          shouldEarn = progression.totalPracticeDays >= 100;
          break;
        case 'level-5':
          shouldEarn = progression.level >= 5;
          break;
        case 'level-10':
          shouldEarn = progression.level >= 10;
          break;
        case 'level-20':
          shouldEarn = progression.level >= 20;
          break;
        case 'meditation-master':
          shouldEarn = (sadhanaCounts['meditation'] || 0) >= 5;
          break;
        case 'yoga-practitioner':
          shouldEarn = (sadhanaCounts['yoga'] || 0) >= 5;
          break;
        case 'mantra-devotee':
          shouldEarn = (sadhanaCounts['mantra'] || 0) >= 5;
          break;
        case 'study-scholar':
          shouldEarn = (sadhanaCounts['study'] || 0) >= 5;
          break;
        case 'devotion-follower':
          shouldEarn = (sadhanaCounts['devotion'] || 0) >= 5;
          break;
      }

      if (shouldEarn) {
        earnedBadges.add(badge.id);
        newBadgesEarned = true;
      }
    });

    if (newBadgesEarned) {
      setUserBadges(prev => ({
        ...prev,
        earnedBadges: Array.from(earnedBadges)
      }));
    }
  }, [progression, history, userBadges.earnedBadges]);

  const getEarnedBadges = (): Badge[] => {
    return userBadges.badges.filter(badge => 
      userBadges.earnedBadges.includes(badge.id)
    );
  };

  const getUnearnedBadges = (): Badge[] => {
    return userBadges.badges.filter(badge => 
      !userBadges.earnedBadges.includes(badge.id)
    );
  };

  return {
    allBadges: userBadges.badges,
    earnedBadges: getEarnedBadges(),
    unearnedBadges: getUnearnedBadges(),
    totalBadges: userBadges.badges.length,
    earnedCount: userBadges.earnedBadges.length
  };
};