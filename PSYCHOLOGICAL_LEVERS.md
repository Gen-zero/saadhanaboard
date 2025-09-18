# Psychological Levers System

This document explains the implementation of the Psychological Levers system for the SaadhanaBoard application.

## Overview

The Psychological Levers system is designed to enhance user engagement through gamification, recognition, subtle ego boosting, and curiosity/self-discovery mechanisms. It includes:

1. **Gamification** - XP, Streaks, Karma Balances
2. **Recognition** - Badges, Titles, Digital Mandalas
3. **Subtle Ego Boost** - Comparative statistics and gentle encouragement
4. **Curiosity/Self-Discovery** - Personal insights and quests

## Implementation Details

### Core Components

#### 1. Data Structures
- `PsychologicalProfile` - Main user data structure
- `TieredProgression` - User level system (Seeker → Sādhaka → Tapasvi → Yogi → Jnani)
- `AdvancedBadge` - Enhanced badge system with categories

#### 2. Hooks
- `usePsychologicalLevers` - Main hook managing all psychological lever state

#### 3. UI Components
- `PersonalRhythmReports` - Energy analysis and recommendations
- `DoshaKoshaMapping` - Constitutional and spiritual layer mapping
- `Quests` - Interactive spiritual challenges
- `KarmaBalance` - Karma point management
- `InitiationModal` - User initiation setup

#### 4. Pages
- `PsychologicalLeversPage` - Dedicated dashboard for all psychological lever features

### Features

#### Gamification
- **XP System**: Earned for practices, tracked through tiered progression
- **Streaks**: Daily practice tracking with visual indicators
- **Karma Balance**: Spiritual currency earned through consistency and seva

#### Recognition
- **Advanced Badges**: Specialized achievements beyond basic badges
- **User Titles**: Honorifics based on progress and initiation
- **Initiation System**: Deity selection and sacred sankalpa (vow)

#### Subtle Ego Boost
- **Comparative Statistics**: Non-toxic ranking information
- **Progress Reflection**: Weekly reports in divine language
- **Mentorship Invitation**: Unlockable guru-sevak model

#### Curiosity/Self-Discovery
- **Personal Rhythm Reports**: AI-like analysis of practice patterns
- **Dosha/Kosha Mapping**: Energy and spiritual layer analysis
- **Quests**: Interactive spiritual paths and challenges

## File Structure

```
src/
├── components/
│   └── psychological-levers/
│       ├── PersonalRhythmReports.tsx
│       ├── DoshaKoshaMapping.tsx
│       ├── Quests.tsx
│       ├── KarmaBalance.tsx
│       └── InitiationModal.tsx
├── data/
│   └── deities.ts
├── hooks/
│   └── usePsychologicalLevers.ts
├── pages/
│   ├── PsychologicalLeversPage.tsx
│   └── ProfilePage.tsx (updated)
├── types/
│   └── psychologicalLevers.ts
└── PSYCHOLOGICAL_LEVERS.md (this file)
```

## Usage

Users can access the Psychological Levers system through:
1. The "Levers" button on their Profile page
2. Direct navigation to `/psychological-levers`

The system automatically tracks user progress and provides insights based on their practice patterns.

## Future Enhancements

Planned improvements include:
- Integration with AI for deeper personal insights
- Community features for karma donations
- Advanced quest system with branching paths
- Digital mandala visualization for badges