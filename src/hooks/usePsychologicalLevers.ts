import { useState, useEffect } from 'react';
import { useUserProgression } from './useUserProgression';
import { useProfileData } from './useProfileData';
import { 
  PsychologicalProfile, 
  KarmaBalance, 
  StreakData, 
  PracticeStats, 
  KoshaMapping, 
  DoshaBalance, 
  EnergyAnalysis,
  TIERED_PROGRESSION,
  ADVANCED_BADGES,
  AdvancedBadge
} from '@/types/psychologicalLevers';

const PSYCHOLOGICAL_PROFILE_STORAGE_KEY = 'psychological-profile';

const getInitialPsychologicalProfile = (): PsychologicalProfile => {
  try {
    const stored = localStorage.getItem(PSYCHOLOGICAL_PROFILE_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.log('Could not load psychological profile from localStorage');
  }
  
  return {
    xp: 0,
    level: 1,
    karmaBalance: {
      total: 0,
      earnedToday: 0,
      lastEarnedDate: new Date().toISOString().split('T')[0],
      donated: 0
    },
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastPracticeDate: ''
    },
    titles: {
      honorific: '',
      deityAffiliation: '',
      spiritualPath: ''
    },
    practiceStats: {
      meditationMinutes: 0,
      mantrasRecited: 0,
      ritualsPerformed: 0,
      sevaActs: 0
    },
    koshaMapping: {
      annamaya: 0,
      pranamaya: 0,
      manomaya: 0,
      vijnanamaya: 0,
      anandamaya: 0
    },
    doshaBalance: {
      vata: 0,
      pitta: 0,
      kapha: 0
    },
    energyAnalysis: {
      primaryElement: 'Fire',
      peakDays: [],
      recommendedPractices: []
    },
    initiatedDeity: '',
    sankalpa: ''
  };
};

export const usePsychologicalLevers = () => {
  const { progression } = useUserProgression();
  const { history, stats } = useProfileData();
  const [psychologicalProfile, setPsychologicalProfile] = useState<PsychologicalProfile>(getInitialPsychologicalProfile());

  // Save psychological profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(PSYCHOLOGICAL_PROFILE_STORAGE_KEY, JSON.stringify(psychologicalProfile));
    } catch (error) {
      console.log('Could not save psychological profile to localStorage');
    }
  }, [psychologicalProfile]);

  // Update psychological profile based on user progression and history
  useEffect(() => {
    // Update XP and level based on progression
    const currentXP = progression.experience;
    const currentLevel = progression.level;
    
    // Update streak data
    const today = new Date().toISOString().split('T')[0];
    const lastPracticeDate = psychologicalProfile.streak.lastPracticeDate;
    let currentStreak = psychologicalProfile.streak.currentStreak;
    let longestStreak = psychologicalProfile.streak.longestStreak;
    
    // If user practiced today, maintain or increment streak
    if (lastPracticeDate === today) {
      // Already counted for today
    } else if (lastPracticeDate) {
      const lastPractice = new Date(lastPracticeDate);
      const todayDate = new Date(today);
      const yesterday = new Date(todayDate);
      yesterday.setDate(yesterday.getDate() - 1);
      
      // If practiced yesterday, increment streak
      if (lastPractice.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0]) {
        currentStreak += 1;
      } else {
        // Break streak if not practiced yesterday
        currentStreak = 1;
      }
    } else {
      // First practice
      currentStreak = 1;
    }
    
    // Update longest streak
    longestStreak = Math.max(longestStreak, currentStreak);
    
    // Update karma balance
    const karmaBalance: KarmaBalance = {
      total: psychologicalProfile.karmaBalance.total + (currentStreak > 0 ? 10 : 0),
      earnedToday: psychologicalProfile.karmaBalance.earnedToday + (currentStreak > 0 && lastPracticeDate !== today ? 10 : 0),
      lastEarnedDate: today,
      donated: psychologicalProfile.karmaBalance.donated
    };
    
    // Update practice stats
    const practiceStats: PracticeStats = {
      meditationMinutes: psychologicalProfile.practiceStats.meditationMinutes + 
        (history.filter(h => h.title.toLowerCase().includes('meditation')).length * 20),
      mantrasRecited: psychologicalProfile.practiceStats.mantrasRecited + 
        (history.filter(h => h.title.toLowerCase().includes('mantra')).length * 50),
      ritualsPerformed: psychologicalProfile.practiceStats.ritualsPerformed + 
        (history.filter(h => h.title.toLowerCase().includes('ritual') || h.title.toLowerCase().includes('puja')).length),
      sevaActs: psychologicalProfile.practiceStats.sevaActs
    };
    
    // Update kosha mapping based on practice types
    const koshaMapping: KoshaMapping = {
      annamaya: psychologicalProfile.koshaMapping.annamaya + 
        (history.filter(h => h.title.toLowerCase().includes('yoga') || h.title.toLowerCase().includes('asana')).length * 2),
      pranamaya: psychologicalProfile.koshaMapping.pranamaya + 
        (history.filter(h => h.title.toLowerCase().includes('pranayama') || h.title.toLowerCase().includes('breath')).length * 2),
      manomaya: psychologicalProfile.koshaMapping.manomaya + 
        (history.filter(h => h.title.toLowerCase().includes('meditation') || h.title.toLowerCase().includes('mind')).length * 2),
      vijnanamaya: psychologicalProfile.koshaMapping.vijnanamaya + 
        (history.filter(h => h.title.toLowerCase().includes('study') || h.title.toLowerCase().includes('scripture')).length * 2),
      anandamaya: psychologicalProfile.koshaMapping.anandamaya + 
        (history.filter(h => h.title.toLowerCase().includes('devotion') || h.title.toLowerCase().includes('bhakti')).length * 2)
    };
    
    // Update dosha balance (simplified calculation)
    const doshaBalance: DoshaBalance = {
      vata: psychologicalProfile.doshaBalance.vata + 
        (history.filter(h => h.title.toLowerCase().includes('movement') || h.title.toLowerCase().includes('creative')).length),
      pitta: psychologicalProfile.doshaBalance.pitta + 
        (history.filter(h => h.title.toLowerCase().includes('fire') || h.title.toLowerCase().includes('intense')).length),
      kapha: psychologicalProfile.doshaBalance.kapha + 
        (history.filter(h => h.title.toLowerCase().includes('grounding') || h.title.toLowerCase().includes('calm')).length)
    };
    
    // Energy analysis (simplified)
    let primaryElement: 'Fire' | 'Water' | 'Earth' | 'Air' | 'Ether' = 'Fire';
    const maxDosha = Math.max(doshaBalance.vata, doshaBalance.pitta, doshaBalance.kapha);
    if (maxDosha === doshaBalance.vata) primaryElement = 'Air';
    else if (maxDosha === doshaBalance.pitta) primaryElement = 'Fire';
    else if (maxDosha === doshaBalance.kapha) primaryElement = 'Water';
    else primaryElement = 'Earth'; // Default fallback
    
    const energyAnalysis: EnergyAnalysis = {
      primaryElement,
      peakDays: ['Monday', 'Thursday'], // Simplified
      recommendedPractices: primaryElement === 'Fire' ? 
        ['Water-based sadhanas', 'Chandra Gayatri'] : 
        primaryElement === 'Water' ? 
        ['Fire-based sadhanas', 'Surya Gayatri'] : 
        ['Balancing practices']
    };
    
    setPsychologicalProfile(prev => ({
      ...prev,
      xp: currentXP,
      level: currentLevel,
      karmaBalance,
      streak: {
        currentStreak,
        longestStreak,
        lastPracticeDate: today
      },
      practiceStats,
      koshaMapping,
      doshaBalance,
      energyAnalysis
    }));
  }, [progression, history]);

  const getUserTier = () => {
    return TIERED_PROGRESSION.find(tier => 
      psychologicalProfile.xp >= tier.minXP && psychologicalProfile.xp < tier.maxXP
    ) || TIERED_PROGRESSION[0];
  };

  const getEarnedBadges = (): AdvancedBadge[] => {
    return ADVANCED_BADGES.filter(badge => {
      switch (badge.criteria.type) {
        case 'xp':
          return psychologicalProfile.xp >= badge.criteria.value;
        case 'streak':
          return psychologicalProfile.streak.currentStreak >= badge.criteria.value;
        case 'practiceCount':
          if (badge.criteria.practiceType === 'meditation') {
            return psychologicalProfile.practiceStats.meditationMinutes >= badge.criteria.value * 20;
          } else if (badge.criteria.practiceType === 'japa') {
            return psychologicalProfile.practiceStats.mantrasRecited >= badge.criteria.value * 108;
          }
          return false;
        case 'seva':
          return psychologicalProfile.practiceStats.sevaActs >= badge.criteria.value;
        default:
          return false;
      }
    });
  };

  const getUnearnedBadges = (): AdvancedBadge[] => {
    return ADVANCED_BADGES.filter(badge => {
      switch (badge.criteria.type) {
        case 'xp':
          return psychologicalProfile.xp < badge.criteria.value;
        case 'streak':
          return psychologicalProfile.streak.currentStreak < badge.criteria.value;
        case 'practiceCount':
          if (badge.criteria.practiceType === 'meditation') {
            return psychologicalProfile.practiceStats.meditationMinutes < badge.criteria.value * 20;
          } else if (badge.criteria.practiceType === 'japa') {
            return psychologicalProfile.practiceStats.mantrasRecited < badge.criteria.value * 108;
          }
          return true;
        case 'seva':
          return psychologicalProfile.practiceStats.sevaActs < badge.criteria.value;
        default:
          return true;
      }
    });
  };

  const addKarmaPoints = (points: number) => {
    setPsychologicalProfile(prev => ({
      ...prev,
      karmaBalance: {
        ...prev.karmaBalance,
        total: prev.karmaBalance.total + points,
        earnedToday: prev.karmaBalance.earnedToday + points
      }
    }));
  };

  const donateKarmaPoints = (points: number) => {
    if (psychologicalProfile.karmaBalance.total >= points) {
      setPsychologicalProfile(prev => ({
        ...prev,
        karmaBalance: {
          ...prev.karmaBalance,
          total: prev.karmaBalance.total - points,
          donated: prev.karmaBalance.donated + points
        }
      }));
      return true;
    }
    return false;
  };

  const convertKarmaToSpiritualPoints = (points: number, conversionRate: number = 5) => {
    // Check if user has enough karma points
    if (psychologicalProfile.karmaBalance.total < points) {
      return { success: false, message: "Insufficient karma points" };
    }
    
    // Calculate spiritual points to be earned
    const spiritualPointsEarned = points * conversionRate;
    
    // Update karma balance (deduct karma points)
    setPsychologicalProfile(prev => ({
      ...prev,
      karmaBalance: {
        ...prev.karmaBalance,
        total: prev.karmaBalance.total - points,
        // Don't update earnedToday or lastEarnedDate for conversions
      }
    }));
    
    // Return the spiritual points earned for the component to handle
    return { success: true, spiritualPoints: spiritualPointsEarned };
  };

  const setInitiation = (deity: string, sankalpa: string) => {
    setPsychologicalProfile(prev => ({
      ...prev,
      initiatedDeity: deity,
      sankalpa: sankalpa,
      titles: {
        ...prev.titles,
        deityAffiliation: deity,
        honorific: `${deity} Devotee`
      }
    }));
  };

  const getProgressToNextLevel = () => {
    const currentTier = getUserTier();
    const nextTierIndex = TIERED_PROGRESSION.findIndex(t => t.title === currentTier.title) + 1;
    if (nextTierIndex >= TIERED_PROGRESSION.length) return 100;
    
    const nextTier = TIERED_PROGRESSION[nextTierIndex];
    if (nextTier.maxXP === Infinity) return 100;
    
    const progress = psychologicalProfile.xp - currentTier.minXP;
    const required = nextTier.minXP - currentTier.minXP;
    
    return Math.min(100, (progress / required) * 100);
  };

  const getComparativeStats = () => {
    // Simplified comparative stats - in a real implementation, this would come from a database
    const globalStats = {
      totalUsers: 10000,
      streakTop10Percent: 21,
      tapasTop7Percent: 21
    };
    
    return {
      inTop10Percent: psychologicalProfile.streak.currentStreak >= globalStats.streakTop10Percent,
      inTop7Percent: psychologicalProfile.streak.currentStreak >= globalStats.tapasTop7Percent,
      streakTop10Percent: globalStats.streakTop10Percent,
      tapasTop7Percent: globalStats.tapasTop7Percent
    };
  };

  return {
    psychologicalProfile,
    userTier: getUserTier(),
    earnedBadges: getEarnedBadges(),
    unearnedBadges: getUnearnedBadges(),
    totalBadges: ADVANCED_BADGES.length,
    earnedBadgeCount: getEarnedBadges().length,
    addKarmaPoints,
    donateKarmaPoints,
    convertKarmaToSpiritualPoints,
    setInitiation,
    getProgressToNextLevel,
    getComparativeStats
  };
};

export default usePsychologicalLevers;
