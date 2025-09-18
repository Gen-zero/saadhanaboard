export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt?: string;
  criteria: string;
}

export interface UserBadges {
  badges: Badge[];
  earnedBadges: string[]; // Array of badge IDs that the user has earned
}

// Define all possible badges in the system
export const ALL_BADGES: Badge[] = [
  {
    id: 'first-sadhana',
    title: 'First Steps',
    description: 'Complete your first sadhana',
    icon: '👣',
    criteria: 'completedSadhanas >= 1'
  },
  {
    id: 'five-sadhanas',
    title: 'Dedicated Practitioner',
    description: 'Complete 5 sadhanas',
    icon: '🧘',
    criteria: 'completedSadhanas >= 5'
  },
  {
    id: 'ten-sadhanas',
    title: 'Spiritual Journey',
    description: 'Complete 10 sadhanas',
    icon: '🕉️',
    criteria: 'completedSadhanas >= 10'
  },
  {
    id: 'twenty-sadhanas',
    title: 'Devoted Seeker',
    description: 'Complete 20 sadhanas',
    icon: '🔥',
    criteria: 'completedSadhanas >= 20'
  },
  {
    id: 'fifty-sadhanas',
    title: 'Spiritual Master',
    description: 'Complete 50 sadhanas',
    icon: '🌟',
    criteria: 'completedSadhanas >= 50'
  },
  {
    id: 'seven-day-streak',
    title: 'Week of Discipline',
    description: 'Maintain a 7-day practice streak',
    icon: '📅',
    criteria: 'totalPracticeDays >= 7'
  },
  {
    id: 'thirty-day-streak',
    title: 'Month of Dedication',
    description: 'Maintain a 30-day practice streak',
    icon: '🌙',
    criteria: 'totalPracticeDays >= 30'
  },
  {
    id: 'hundred-day-streak',
    title: 'Centurion of Spirit',
    description: 'Maintain a 100-day practice streak',
    icon: '💯',
    criteria: 'totalPracticeDays >= 100'
  },
  {
    id: 'level-5',
    title: 'Awakening',
    description: 'Reach level 5 in spiritual progression',
    icon: '⭐',
    criteria: 'level >= 5'
  },
  {
    id: 'level-10',
    title: 'Illumination',
    description: 'Reach level 10 in spiritual progression',
    icon: '✨',
    criteria: 'level >= 10'
  },
  {
    id: 'level-20',
    title: 'Transcendence',
    description: 'Reach level 20 in spiritual progression',
    icon: '🔮',
    criteria: 'level >= 20'
  },
  {
    id: 'meditation-master',
    title: 'Meditation Master',
    description: 'Complete 5 meditation sadhanas',
    icon: '🧘‍♂️',
    criteria: 'completedMeditationSadhanas >= 5'
  },
  {
    id: 'yoga-practitioner',
    title: 'Yoga Practitioner',
    description: 'Complete 5 yoga sadhanas',
    icon: '🧘‍♀️',
    criteria: 'completedYogaSadhanas >= 5'
  },
  {
    id: 'mantra-devotee',
    title: 'Mantra Devotee',
    description: 'Complete 5 mantra sadhanas',
    icon: '📿',
    criteria: 'completedMantraSadhanas >= 5'
  },
  {
    id: 'study-scholar',
    title: 'Study Scholar',
    description: 'Complete 5 study sadhanas',
    icon: '📚',
    criteria: 'completedStudySadhanas >= 5'
  },
  {
    id: 'devotion-follower',
    title: 'Devotion Follower',
    description: 'Complete 5 devotion sadhanas',
    icon: '❤️',
    criteria: 'completedDevotionSadhanas >= 5'
  }
];