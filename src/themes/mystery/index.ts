import { ThemeDefinition } from '../types';
import colors from './colors';
import { Skull } from 'lucide-react';

export const mysteryTheme: ThemeDefinition = {
  metadata: {
    id: 'mystery',
    name: 'Mystery Theme',
    description: '🔮 Cosmic mystery landing page',
    category: 'landing',
    isLandingPage: true,
    landingPagePath: '/MysteryLandingpage',
    icon: Skull,
    gradient: 'from-blue-900 to-indigo-900'
  },
  colors,
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default mysteryTheme;
