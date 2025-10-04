import { useEffect } from 'react';
import { SettingsType } from '@/components/settings/SettingsTypes';
import i18n from '@/lib/i18n';
import { getThemeById, listThemes, themeUtils } from '@/themes';

interface ThemeProviderProps {
  settings: SettingsType;
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ settings, children }) => {
  useEffect(() => {
  // Base theme (light/dark) remains as simple classes
  const baseTheme = settings?.theme || 'dark';
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(baseTheme);
    
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
    
    // Apply color scheme via registry-driven classes + CSS variables
    if (appearance?.colorScheme) {
      // remove any known color-scheme-* and theme-* classes conservatively
      Array.from(document.body.classList)
        .filter((c) => c.startsWith('color-scheme-') || c.startsWith('theme-') || c.endsWith('-theme'))
        .forEach((c) => document.body.classList.remove(c));

      const selected = appearance.colorScheme;
      if (selected && selected !== 'default') {
        // add a theme class for legacy CSS that expects it
        document.body.classList.add(`theme-${selected}`);

        // apply CSS vars if the theme is in registry
        const themeDef = getThemeById(selected as string);
        if (!themeDef) {
          console.warn(`Unknown theme id '${selected}', falling back to default`);
        } else {
          // apply theme token colors
          try {
            themeUtils.applyThemeColors(themeDef.colors as any);
          } catch(e) {
            console.warn('applyThemeColors failed', e);
          }
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
    // Apply explicit themeColors from settings if present (overrides)
    const explicitColors = (settings as any)?.appearance?.themeColors || (settings as any)?.themeColors;
    if (explicitColors) {
      try {
        themeUtils.applyThemeColors(explicitColors as any);
      } catch(e) {
        console.warn('applyThemeColors failed for explicit colors', e);
      }
    }
  }, [settings?.theme, settings?.appearance, settings?.language]);

  return <>{children}</>;
};

export default ThemeProvider;