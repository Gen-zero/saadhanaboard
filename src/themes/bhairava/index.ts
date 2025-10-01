import { ThemeDefinition } from '../types';
import colors from './colors';
import { Flame } from 'lucide-react';

// No deity PNG present in repository for bhairava; using Lucide Flame icon as fallback.

export const bhairavaTheme: ThemeDefinition = {
  metadata: {
    id: 'bhairava',
    name: 'Bhairava Theme',
    description: 'Fierce dark red and crimson tones',
    deity: 'Bhairava',
    category: 'color-scheme',
    isLandingPage: false,
    gradient: 'from-red-900 to-red-700',
    icon: Flame,
  },
  colors,
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default bhairavaTheme;
