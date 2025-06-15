
export type SettingsType = {
  theme: string;
  language: string;
  startPage: string;
  notifications: {
    enabled: boolean;
    ritualReminders: boolean;
    goalProgress: boolean;
    motivationalMessages: boolean;
  };
  reminders: {
    morning: string;
    midday: string;
    evening: string;
  };
  appearance: {
    fontSize: number;
    animationsEnabled: boolean;
    highContrastMode: boolean;
    colorScheme: string;
  };
  privacy: {
    storeDataLocally: boolean;
    analyticsConsent: boolean;
    biometricLogin: boolean;
  };
  meditation: {
    backgroundSounds: boolean;
    timerDuration: number;
    intervalBell: boolean;
  };
  accessibility: {
    screenReader: boolean;
    largeText: boolean;
    reducedMotion: boolean;
  };
};
