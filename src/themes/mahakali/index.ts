import { ThemeDefinition } from '../types';
import colors from './colors';
import MahakaliBackground from './background';

// Resolve theme-local asset using import.meta-based URL so bundlers produce a proper URL
let skullPath: string;
try {
  skullPath = new URL('./assets/Skull and Bone Turnaround.gif', import.meta.url).href;
} catch (e) {
  console.warn('Failed to resolve Mahakali theme icon, using fallback');
  // Fallback to a simple skull emoji or a data URL for a basic skull icon
  skullPath = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIGQ9Ik04IDIuNWMtMi4yMDkgMC00IDEuNzkxLTQgNHMxLjc5MSA0IDQgNCA0LTEuNzkxIDQtNCAxLjc5MS00IDQtNHoiLz48cGF0aCBkPSJNMTIuNSA4YzAgMS4zODEtMS4xMTkgMi41LTIuNSAyLjVzLTIuNS0xLjExOS0yLjUtMi41IDIuNS0yLjUgMi41LTIuNSAyLjUtMS4xMTkgMi41LTIuNXoiLz48L3N2Zz4=';
}

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