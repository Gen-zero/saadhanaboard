import defaultTheme from './default';
import shivaTheme from './shiva';
import mahakaliTheme from './mahakali';
import mysteryTheme from './mystery';
import earthTheme from './earth';
import waterTheme from './water';
import fireTheme from './fire';
import bhairavaTheme from './bhairava';
import serenityTheme from './serenity';
import ganeshaTheme from './ganesha';
// serenity and ganesha will be added below

import type { ThemeDefinition } from './types';

export type { ThemeDefinition } from './types';

const THEME_REGISTRY: ReadonlyArray<ThemeDefinition> = Object.freeze([
  defaultTheme,
  shivaTheme,
  mahakaliTheme,
  mysteryTheme,
  earthTheme,
  waterTheme,
  fireTheme,
  bhairavaTheme,
  serenityTheme,
  ganeshaTheme,
]);

function getThemeById(id: string): ThemeDefinition | undefined {
  return THEME_REGISTRY.find(t => t.metadata.id === id);
}

function listThemes(options?: { category?: string; available?: boolean }): ThemeDefinition[] {
  let res = [...THEME_REGISTRY];
  if (options) {
    if (options.category) res = res.filter(r => r.metadata.category === (options.category as any));
    if (typeof options.available === 'boolean') res = res.filter(r => Boolean(r.available) === options.available);
  }
  return res;
}

function getThemesByDeity(deity: string): ThemeDefinition[] {
  return THEME_REGISTRY.filter(t => String(t.metadata.deity || '').toLowerCase() === String(deity || '').toLowerCase());
}

function getLandingPageThemes(): ThemeDefinition[] {
  return THEME_REGISTRY.filter(t => Boolean(t.metadata.isLandingPage));
}

function getColorSchemeThemes(): ThemeDefinition[] {
  return THEME_REGISTRY.filter(t => t.metadata.category === 'color-scheme');
}

export {
  THEME_REGISTRY,
  getThemeById,
  listThemes,
  getThemesByDeity,
  getLandingPageThemes,
  getColorSchemeThemes
};

export default {
  THEME_REGISTRY,
  getThemeById,
  listThemes,
  getThemesByDeity,
  getLandingPageThemes,
  getColorSchemeThemes
};

// Re-export utilities for convenience
export { default as themeUtils } from './utils';
export * from './utils';
