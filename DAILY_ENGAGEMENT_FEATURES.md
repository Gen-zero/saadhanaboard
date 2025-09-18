# Daily Engagement Features Documentation

## Overview
This document explains the implementation of two new daily engagement features for the SaadhanaBoard dashboard:
1. Daily Quest Card
2. Mood Check-in Feature

These features aim to make the daily landing page more dynamic, interactive, and rewarding for users.

## Feature 1: Daily Quest Card

### Purpose
The Daily Quest Card provides users with a simple, achievable task each day that rewards them with Spiritual Points (SP) upon completion.

### Implementation Details
- **Component**: `src/components/DailyQuest.tsx`
- **Hook**: `src/hooks/useSpiritualPoints.ts`
- **Location**: Appears on the dashboard below the welcome section

### Features
- Random daily quest selection from a pool of spiritual practices
- Reward system with Spiritual Points (SP)
- Visual feedback for completed quests
- Daily reset to ensure one quest per day
- Points tracking and display

### Quest Examples
1. "10-Minute Meditation" (+15 SP)
2. "Sacred Chanting" (+20 SP)
3. "Gratitude Practice" (+10 SP)
4. "Breath Awareness" (+12 SP)
5. "Scripture Study" (+18 SP)

### Technical Implementation
- Uses localStorage to track daily quest completion
- Implements a points system with persistence
- Random quest selection algorithm
- Toast notifications for completion feedback

## Feature 2: Mood Check-in

### Purpose
The Mood Check-in feature provides a simple, unobtrusive way for users to express their current emotional state and receive personalized practice suggestions.

### Implementation Details
- **Component**: `src/components/MoodCheckin.tsx`
- **Location**: Integrated into the welcome section of the dashboard

### Features
- Emoji-based mood selection interface
- 6 mood options with personalized suggestions
- Contextual practice recommendations
- Toast notifications with practice suggestions
- Visual feedback for selected mood

### Mood Options
1. 😊 Joyful - "Maintain your positive energy with a gratitude practice"
2. 🧘 Peaceful - "Deepen your inner calm with mindful breathing"
3. 😔 Low Energy - "Gently uplift your spirit with energizing practices"
4. 🙏 Seeking Guidance - "Connect with the divine through prayer or chanting"
5. 😤 Frustrated - "Release tension and find balance through calming techniques"
6. 😴 Tired - "Recharge with restorative practices"

### Technical Implementation
- Simple click-based selection interface
- Toast notifications for immediate feedback
- Predefined mood-to-practice mapping
- Visual highlighting of selected mood

## Integration with Dashboard

### Location on Dashboard
1. **Mood Check-in**: Integrated into the welcome section
2. **Daily Quest**: Appears as a dedicated card below the welcome section

### User Flow
1. User logs in and lands on the dashboard
2. Sees welcome message and current streak
3. Can immediately check in their mood using emojis
4. Views their daily quest with point reward
5. Can complete the quest to earn SP
6. Continues with their regular dashboard activities

## Technical Architecture

### New Files Created
1. `src/components/DailyQuest.tsx` - Daily quest UI component
2. `src/components/MoodCheckin.tsx` - Mood check-in UI component
3. `src/hooks/useSpiritualPoints.ts` - Spiritual points management hook

### Modified Files
1. `src/pages/DashboardPage.tsx` - Integrated new components

### Data Management
- Uses localStorage for persistence of:
  - Daily quest completion status
  - Spiritual points tracking
  - Daily quest selection

### Points System
- Simple point-based reward system
- Points accumulate in user's total balance
- Daily quests provide small but meaningful rewards
- Points serve as a gamification element to encourage daily engagement

## User Experience Benefits

### Engagement
- Encourages daily app interaction
- Provides achievable goals for users of all experience levels
- Offers personalized suggestions based on emotional state

### Gamification
- Spiritual Points provide a sense of progression
- Daily quests create a routine and sense of accomplishment
- Visual feedback reinforces positive behaviors

### Personalization
- Mood-based practice suggestions
- Random quest selection prevents monotony
- Contextual recommendations based on user state

### Simplicity
- One-click mood check-in
- Clear quest completion flow
- Minimal interface that doesn't overwhelm

## Future Enhancements

### Points System Expansion
- Introduce point-based rewards or achievements
- Add point multipliers for streaks
- Create a points leaderboard or social features

### Quest System Improvements
- User-generated quests
- Quest difficulty levels
- Quest categories based on user preferences

### Mood Check-in Enhancements
- Mood tracking over time
- Integration with practice recommendations
- Personalized mood-based sadhana suggestions

### Analytics
- Track quest completion rates
- Monitor mood trends
- Analyze correlation between mood and practice completion