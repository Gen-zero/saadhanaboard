import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import '@/styles/animations.css';
import '@/styles/cosmic.css';

type Item = {
  id: number;
  title: string;
  subtitle?: string;
  excerpt?: string;
  color?: string;
};

const CosmicLibraryShowcase: React.FC = () => {
  const [active, setActive] = useState<'sadhanas' | 'texts'>('sadhanas');
  const [hovered, setHovered] = useState<number | null>(null);

  const items = useMemo<Item[]>(() => {
    return [
      { id: 1, title: '21-Day Mindful Awakening', subtitle: 'Sadhana', excerpt: 'Begin your meditation journey', color: 'from-blue-500 to-cyan-500' },
      { id: 2, title: 'Om Namah Shivaya', subtitle: 'Sadhana', excerpt: 'Mantra practice for transformation', color: 'from-orange-500 to-amber-500' },
      { id: 3, title: 'Bhagavad Gita', subtitle: 'Text', excerpt: 'Timeless guidance', color: 'from-pink-500 to-rose-500' }
    ];
  }, []);

  return (
    <div className="cosmic-library-showcase cosmic-nebula-bg cosmic-scroll-container relative rounded-2xl overflow-hidden p-6">
      {/* Ambient particle / sacred geometry layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="sacred-geometry-bg" />
        <div className="floating-yantra gold-accent" style={{ top: '10%', left: '5%' }}>✦</div>
        <div className="ambient-mantra gold-accent" style={{ top: '60%', left: '80%' }}>ॐ</div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500">The Cosmic Library</h3>
            <p className="text-sm text-muted-foreground">An immersive, floating view of our sacred practices and texts</p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActive('sadhanas')}
              className={`px-4 py-2 rounded-full transition ${active === 'sadhanas' ? 'library-glow bg-gradient-to-r from-amber-500 to-orange-500 text-white' : 'bg-background/60 text-muted-foreground'}`}
            >
              Sacred Practices
            </button>
            <button
              onClick={() => setActive('texts')}
              className={`px-4 py-2 rounded-full transition ${active === 'texts' ? 'library-glow bg-gradient-to-r from-blue-500 to-cyan-500 text-white' : 'bg-background/60 text-muted-foreground'}`}
            >
              Holy Texts
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((it) => (
            <div
              key={it.id}
              onMouseEnter={() => setHovered(it.id)}
              onMouseLeave={() => setHovered(null)}
              className={`relative rounded-xl p-6 border backdrop-blur-md transition-transform duration-500 transform hover:-translate-y-2 floating-book ${it.color ?? ''}`}
            >
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-amber-400/10 to-orange-400/10 rounded-full blur-2xl divine-aura pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-lg">{it.title}</h4>
                    <p className="text-xs text-muted-foreground">{it.subtitle}</p>
                  </div>
                  <div className={`w-12 h-16 rounded-md flex items-center justify-center text-xl bg-gradient-to-b ${it.color ?? 'from-amber-500 to-orange-500'} text-white shadow-lg`}>📘</div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 ink-appear">{it.excerpt}</p>

                <div className="flex items-center gap-3">
                  <Badge className="px-3 py-1">{active === 'sadhanas' ? 'Start' : 'Read'}</Badge>
                  <Button asChild size="sm">
                    <Link to={active === 'sadhanas' ? '/sadhanas' : '/library'} className="px-3 py-2 text-sm">
                      Open
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Interactive visuals when hovered */}
              {hovered === it.id && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-44 h-44 rounded-full chakra-pulse opacity-80 library-glow" />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-center">
          <Button size="lg" className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 glow-primary" asChild>
            <Link to="/library">Explore Full Library</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CosmicLibraryShowcase;
