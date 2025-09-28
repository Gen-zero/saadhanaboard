import { useEffect } from 'react';
import { SettingsType } from '@/components/settings/SettingsTypes';
import i18n from '@/lib/i18n';

interface ThemeProviderProps {
  settings: SettingsType;
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ settings, children }) => {
  useEffect(() => {
    // Apply the base theme
    const theme = settings?.theme || 'dark';
    
    // Remove any existing theme classes
    document.body.classList.remove('light', 'dark');
    
    // Apply the new theme class
    document.body.classList.add(theme);
    
    // Apply appearance settings
    const appearance = settings?.appearance;
    
    // Apply font size
    if (appearance?.fontSize) {
      document.documentElement.style.fontSize = `${appearance.fontSize}px`;
    }
    
    // Apply animations setting
    if (appearance?.animationsEnabled !== undefined) {
      if (appearance.animationsEnabled) {
        document.body.classList.remove('reduce-motion');
      } else {
        document.body.classList.add('reduce-motion');
      }
    }
    
    // Apply high contrast mode
    if (appearance?.highContrastMode !== undefined) {
      if (appearance.highContrastMode) {
        document.body.classList.add('high-contrast');
      } else {
        document.body.classList.remove('high-contrast');
      }
    }
    
    // Apply color scheme
    if (appearance?.colorScheme) {
      // Remove any existing color scheme classes
      document.body.classList.remove(
        'color-scheme-default', 
        'color-scheme-earth', 
        'color-scheme-water', 
        'color-scheme-fire', 
        'shiva-theme',
        'theme-default',
        'theme-mahakali',
        'theme-mystery'
      );
      
      // Apply the new color scheme class
      if (appearance.colorScheme !== 'default') {
        if (appearance.colorScheme === 'shiva') {
          document.body.classList.add('shiva-theme');
        } else if (appearance.colorScheme === 'mahakali') {
          // Add Mahakali body class for CSS-based adjustments (colors, fonts)
          document.body.classList.add('theme-mahakali');
        } else {
          document.body.classList.add(`color-scheme-${appearance.colorScheme}`);
        }
      }
    }
    
    // Apply language setting
    if (settings?.language) {
      const languageMap: Record<string, string> = {
        'english': 'en',
        'hindi': 'hi'
      };
      
      const languageCode = languageMap[settings.language] || 'en';
      i18n.changeLanguage(languageCode);
    }
    // Apply theme color variables if provided
    // Expect settings.appearance?.themeColors or settings.themeColors to be an object with fields
    const colors = (settings as any)?.appearance?.themeColors || (settings as any)?.themeColors;
    if (colors) {
      const root = document.documentElement;
      const vars: Record<string, string> = {
        '--color-primary': colors.primary || '#8B2A94',
        '--color-secondary': colors.secondary || '#4A1547',
        '--color-accent': colors.accent || '#E91E63',
        '--color-border': colors.border || '#e5e7eb',
        '--color-success': colors.success || '#16a34a',
        '--color-warning': colors.warning || '#f59e0b',
        '--color-error': colors.error || '#ef4444',
        '--color-info': colors.info || '#3b82f6'
      };

      Object.entries(vars).forEach(([key, val]) => {
        root.style.setProperty(key, val);
      });
    }
  }, [settings?.theme, settings?.appearance, settings?.language]);

  return <>{children}</>;
};

export default ThemeProvider;