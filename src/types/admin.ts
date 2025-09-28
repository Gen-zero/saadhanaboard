import type { DashboardSnapshot, WeeklyEntry } from './admin-dashboard';

export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export interface AdminMessage {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  created_at: string;
  is_read: boolean;
}

export interface UserAnalytics {
  recentLogins: Array<{ day: string; count: number }>;
  recentSessions: Array<{ day: string; sessions: number }>;
}

export interface UserProgress {
  totalSadhanas: number;
  completedSadhanas: number;
  averageSessionMinutes: number;
  recentPracticeDays: number;
}

export interface ProfileSummary {
  experience_level?: ExperienceLevel | null;
  traditions?: string[] | null;
  favorite_deity?: string | null;
  onboarding_completed?: boolean | null;
}

export interface EnhancedUser {
  id: number;
  email: string;
  display_name: string;
  is_admin: boolean;
  active: boolean;
  created_at?: string;
  last_login?: string;
  login_attempts?: number;
  profile?: ProfileSummary | null;
  progress?: UserProgress | null;
  analytics?: UserAnalytics | null;
  unreadMessages?: number;
}

export interface UserSegmentationFilters {
  experience_level?: ExperienceLevel;
  traditions?: string[];
  favorite_deity?: string;
  onboarding_completed?: boolean;
}

export { };
