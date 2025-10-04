import { ThemeDefinition } from '../types';
import colors from './colors';
import MahakaliBackground from './background';

// Resolve theme-local asset using import.meta-based URL so bundlers produce a proper URL
const skullPath = new URL('./assets/Skull and Bone Turnaround.gif', import.meta.url).href;

export const mahakaliTheme: ThemeDefinition = {
  metadata: {
    id: 'mahakali',
    name: 'Mahakali Theme',
    description: '🔥 Cremation ground landing page',
    deity: 'Mahakali',
    category: 'hybrid',
    isLandingPage: true,
    landingPagePath: '/MahakaliLandingpage',
    icon: skullPath,
    gradient: 'from-red-700 to-black'
  },
  colors,
  assets: { icon: skullPath },
  BackgroundComponent: MahakaliBackground,
  available: true,
  createdAt: new Date('2024-09-26T13:00:00.000Z')
};

export default mahakaliTheme;
