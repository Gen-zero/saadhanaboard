import { ThemeDefinition } from '../types';
import colors from './colors';

const iconPath = new URL('./assets/Maa_Durga_icon.png', import.meta.url).href;

export const fireTheme: ThemeDefinition = {
  metadata: {
    id: 'fire',
    name: 'Maa Durga Theme',
    description: 'Fiery red, orange and yellow tones',
    deity: 'Durga',
    category: 'color-scheme',
    isLandingPage: false,
    gradient: 'from-red-600 to-yellow-500'
  },
  colors,
  assets: { icon: iconPath },
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default fireTheme;
