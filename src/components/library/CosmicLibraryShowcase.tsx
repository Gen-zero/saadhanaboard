import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import '@/styles/animations.css';
import '@/styles/cosmic.css';
import { BookOpen, Flame, Sparkles, Heart, Target, Compass, Map, Mountain, Check, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

type Item = {
  id: number;
  title: string;
  subtitle?: string;
  description: string;
  category: 'sadhanas' | 'texts' | 'journeys';
  icon: React.ReactNode;
  difficulty: Difficulty;
  duration: string;
  color: string; // gradient classes
  features: string[];
  popular?: boolean;
};

const DATA = (): Item[] => [
  // Sacred Practices
  {
    id: 1,
    title: '21-Day Mindful Awakening',
    subtitle: 'Meditation Program',
    description: 'A gentle guided program to build a daily meditation habit and deepen awareness.',
    category: 'sadhanas',
    icon: <Flame size={28} />, difficulty: 'Beginner', duration: '21 days', color: 'from-amber-400 to-amber-600',
    features: ['Daily guided sessions', 'Breathwork', 'Reflection prompts'], popular: true
  },
  {
    id: 2,
    title: 'Om Namah Shivaya Mantra',
    subtitle: 'Mantra Sadhana',
    description: 'A focused mantra practice aimed at inner transformation and grounding.',
    category: 'sadhanas',
    icon: <Sparkles size={28} />, difficulty: 'Intermediate', duration: '14 days', color: 'from-indigo-500 to-violet-500',
    features: ['Chant tracks', 'Meaning & technique', 'Progress tracker']
  },
  {
    id: 3,
    title: 'Heart Rhythm Yoga',
    subtitle: 'Movement & Breath',
    description: 'A gentle flow that synchronizes breath with movement for emotional balance.',
    category: 'sadhanas',
    icon: <Heart size={28} />, difficulty: 'Beginner', duration: '60 min', color: 'from-pink-400 to-rose-500',
    features: ['Sequenced flows', 'Audio guidance', 'Accessible for all']
  },
  // Holy Texts
  {
    id: 4,
    title: 'Bhagavad Gita (Selected)',
    subtitle: 'Holy Text',
    description: 'Selected verses and commentary to support practical spiritual living.',
    category: 'texts',
    icon: <BookOpen size={28} />, difficulty: 'Advanced', duration: 'Variable', color: 'from-sky-400 to-cyan-500',
    features: ['Curated verses', 'Modern commentary', 'Audio recitation'], popular: true
  },
  {
    id: 5,
    title: 'Upanishads (Intro)',
    subtitle: 'Holy Text',
    description: 'Foundational teachings exploring the nature of Self and reality.',
    category: 'texts',
    icon: <Map size={28} />, difficulty: 'Advanced', duration: 'Varies', color: 'from-emerald-400 to-teal-500',
    features: ['Key passages', 'Summaries', 'Guided reflections']
  },
  {
    id: 6,
    title: 'Yoga Sutras — Essentials',
    subtitle: 'Holy Text',
    description: 'Pithy aphorisms and practical notes to support daily practice.',
    category: 'texts',
    icon: <ScrollIconPlaceholder />, difficulty: 'Intermediate', duration: 'Variable', color: 'from-yellow-400 to-orange-500',
    features: ['Concise explanations', 'Practice tips', 'Audio highlights']
  },
  // Guided Journeys
  {
    id: 7,
    title: '7-Day Chakra Journey',
    subtitle: 'Guided Journey',
    description: 'A deep somatic and meditative exploration of the chakra system across a week.',
    category: 'journeys',
    icon: <Compass size={28} />, difficulty: 'Intermediate', duration: '7 days', color: 'from-purple-500 to-pink-500',
    features: ['Daily practices', 'Journaling prompts', 'Energy visualizations']
  },
  {
    id: 8,
    title: 'Pilgrimage — Inner Map',
    subtitle: 'Guided Journey',
    description: 'A multi-week guided journey combining study, practice and reflection.',
    category: 'journeys',
    icon: <Mountain size={28} />, difficulty: 'Advanced', duration: '21 days', color: 'from-slate-400 to-slate-700',
    features: ['Multi-week structure', 'Live sessions', 'Community support']
  },
  {
    id: 9,
    title: 'Compass: Daily Micro-Journeys',
    subtitle: 'Guided Journey',
    description: 'Short 10–15 minute guided sessions for busy days.',
    category: 'journeys',
    icon: <Target size={28} />, difficulty: 'Beginner', duration: '10–15 min', color: 'from-lime-400 to-green-500',
    features: ['Quick practices', 'On-demand', 'Energy resets']
  }
];

function ScrollIconPlaceholder() {
  // Small inline placeholder for Scroll icon (lucide has Scroll but avoid extra import; keep accessible)
  return <Star size={28} />;
}

const rotations = ['-1', '1', '-2', '2', '-3', '3'];

const CosmicLibraryShowcase: React.FC = () => {
  const [active, setActive] = useState<'sadhanas' | 'texts' | 'journeys'>('sadhanas');
  const [hovered, setHovered] = useState<number | null>(null);
  const items = useMemo(() => DATA(), []);

  const filtered = items.filter(i => i.category === active);

  const difficultyColors: Record<Difficulty, string> = {
    Beginner: 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700',
    Intermediate: 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-900 dark:text-amber-100 dark:border-amber-700',
    Advanced: 'bg-indigo-100 text-indigo-900 border-indigo-300 dark:bg-indigo-900 dark:text-indigo-100 dark:border-indigo-700'
  };

  return (
    <section aria-labelledby="cosmic-library-title" className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-transparent to-transparent">
      {/* decorative background - subtle and muted to match page */}
      <div className="absolute inset-0 z-0 pointer-events-none -rotate-1 bg-gradient-to-br from-amber-50/10 via-purple-50/6 to-sky-50/10 dark:from-black/20 dark:via-purple-900/10 dark:to-black/30" />
      <div className="absolute -top-8 -right-8 opacity-40 z-0">
        <div className="w-44 h-44 rounded-full bg-gradient-to-tr from-purple-300/12 to-amber-300/10 blur-3xl dark:from-purple-700/20 dark:to-amber-700/6" />
      </div>

      <div className="relative z-10">
        <div className="mb-6">
          <p className="font-handwritten text-sm text-amber-700/90 rotate-[-2deg]">Explore Our Collection</p>
          <h2 id="cosmic-library-title" className="font-handwritten text-4xl md:text-5xl leading-tight font-bold -rotate-1">The Cosmic Library</h2>
          <div className="mt-2 w-24 h-2 bg-gradient-to-r from-amber-400 to-pink-400 rounded rotate-[-2deg] blur-sm" />
          <p className="mt-3 text-sm text-muted-foreground max-w-2xl">Sacred practices, timeless texts and guided journeys — curated for practice and reflection.</p>
        </div>

        <div className="flex gap-3 items-center mb-6">
          {(['sadhanas','texts','journeys'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={cn(
                'px-4 py-2 rounded-md border-2 transition-transform duration-200 font-handwritten text-sm',
                active === c ? 'bg-gradient-to-r from-amber-400 to-pink-400 text-white border-zinc-900 shadow-[6px_6px_0_rgba(0,0,0,0.85)]' : 'bg-background/50 text-foreground border-zinc-700'
              )}
            >
              {c === 'sadhanas' ? 'Sacred Practices' : c === 'texts' ? 'Holy Texts' : 'Guided Journeys'}
            </button>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            {filtered.map((it, idx) => (
              <motion.article
                key={it.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.35, delay: idx * 0.03 }}
                onMouseEnter={() => setHovered(it.id)}
                onMouseLeave={() => setHovered(null)}
                    className={cn(
                      'relative rounded-lg p-6 border-2 bg-white/5 dark:bg-black/40 backdrop-blur-md transition-all duration-300',
                      'hover:shadow-[8px_8px_0_rgba(15,23,42,0.6)] hover:-translate-y-2 hover:-translate-x-1',
                      'border-zinc-800/70 dark:border-zinc-200/10'
                    )}
                    style={{ transform: `rotate(${rotations[idx % rotations.length]}deg)`, borderColor: undefined }}
              >
                {/* Decorative aura */}
                    <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.06), transparent 40%)' }} />

                <header className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                      <div className={cn('w-14 h-14 rounded-md flex items-center justify-center border-2', it.color)} style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.03), transparent)' }}>
                      {it.icon}
                    </div>
                    <div>
                      <h3 className="font-handwritten text-2xl">{it.title}</h3>
                      <p className="text-xs text-muted-foreground">{it.subtitle} • {it.duration}</p>
                    </div>
                  </div>
                  {it.popular && (
                    <div className="transform rotate-[-10deg] border-2 px-3 py-1 rounded-md bg-yellow-200/40 text-yellow-900/90 shadow-[3px_3px_0_rgba(15,23,42,0.35)] font-handwritten text-sm">Popular!</div>
                  )}
                </header>

                <p className="text-sm text-muted-foreground mb-4">{it.description}</p>

                <ul className="grid grid-cols-1 gap-2 mb-4">
                  {it.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <span className="w-6 h-6 rounded-full border flex items-center justify-center text-xs shadow-sm bg-white/3 dark:bg-black/20">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <footer className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className={cn('px-3 py-1 rounded-sm shadow-[1px_1px_0_rgba(15,23,42,0.12)] border', difficultyColors[it.difficulty])}>{it.difficulty}</Badge>
                    <span className="text-xs text-muted-foreground">{it.duration}</span>
                  </div>
                  <Button asChild size="sm">
                    <Link to={it.category === 'texts' ? '/library' : it.category === 'sadhanas' ? '/sadhanas' : '/journeys'} className="px-4 py-2 font-handwritten bg-white text-zinc-900 border border-zinc-900 rounded-md shadow-[2px_2px_0_rgba(15,23,42,0.25)]">
                      Explore
                    </Link>
                  </Button>
                </footer>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex justify-center">
          <Button size="lg" className="px-8 py-4 font-handwritten bg-white text-zinc-900 border border-zinc-900 shadow-[3px_3px_0_rgba(15,23,42,0.25)]" asChild>
            <Link to="/library">Explore Full Library</Link>
          </Button>
        </div>
      </div>

      {/* floating decorative symbols */}
      <div className="pointer-events-none absolute left-4 bottom-6 opacity-80">
        <div className="animate-float-petal text-2xl">✨</div>
      </div>
      <div className="pointer-events-none absolute right-8 bottom-10 opacity-60">
        <div className="animate-float-petal text-3xl">ॐ</div>
      </div>
    </section>
  );
};

export default CosmicLibraryShowcase;
