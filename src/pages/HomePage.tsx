import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Calendar, Users, Sparkles, MoonStar, Flame, Target, Heart, Mountain, Star, TrendingUp, Play, Volume2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';

// Simple count-up hook for animated stats
const useCountUp = (targetValue: number, durationMs: number = 1500) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let rafId: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * targetValue));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [targetValue, durationMs]);
  return value;
};

// Spiritual Library Showcase Component
const SpiritualLibraryShowcase = () => {
  const [activeTab, setActiveTab] = useState('sadhanas');
  const [selectedBook, setSelectedBook] = useState(null);
  const [hoveredSadhana, setHoveredSadhana] = useState(null);

  // Sample data for showcase
  const sampleSadhanas = [
    {
      id: 1,
      title: "21-Day Mindful Awakening",
      description: "Begin your meditation journey",
      duration: "21 days",
      difficulty: "Beginner",
      icon: "🧘‍♂️",
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Om Namah Shivaya",
      description: "Sacred mantra practice",
      duration: "108 days",
      difficulty: "Intermediate",
      icon: "🕉️",
      color: "from-orange-500 to-amber-500"
    },
    {
      id: 3,
      title: "Krishna Bhakti",
      description: "Divine love through devotion",
      duration: "49 days",
      difficulty: "Beginner",
      icon: "💝",
      color: "from-pink-500 to-rose-500"
    }
  ];

  const sampleBooks = [
    {
      id: 1,
      title: "Bhagavad Gita",
      author: "Vyasa",
      tradition: "Hinduism",
      excerpt: "You are what you believe yourself to be...",
      pages: "18 Chapters"
    },
    {
      id: 2,
      title: "Tao Te Ching",
      author: "Laozi",
      tradition: "Taoism",
      excerpt: "The Tao that can be told is not the eternal Tao...",
      pages: "81 Verses"
    },
    {
      id: 3,
      title: "Yoga Sutras",
      author: "Patanjali",
      tradition: "Yoga",
      excerpt: "Yoga is the cessation of fluctuations of the mind...",
      pages: "196 Sutras"
    }
  ];

  return (
    <Card className="bg-background/95 backdrop-blur-sm border border-amber-500/30 shadow-xl overflow-hidden">
      <CardHeader className="text-center pb-3">
        <div className="flex items-center justify-center mb-3">
          <div className="text-2xl mr-2">📚</div>
          <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700">
            A Living Spiritual Library, Always Within Reach
          </CardTitle>
        </div>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Discover a sacred space where everything you need for your practice lives together — sadhanas to guide you, 
          texts to inspire you. No more searching, no more scattered rituals — just a single home for your journey.
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Interactive Tabs */}
        <div className="flex justify-center space-x-1 bg-muted/50 p-1 rounded-lg max-w-sm mx-auto">
          {[
            { id: 'sadhanas', label: 'Sacred Practices', icon: '🧘‍♂️' },
            { id: 'texts', label: 'Holy Texts', icon: '📖' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md transition-all duration-300 text-xs ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md transform scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <span className="text-sm">{tab.icon}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[250px]">
          <AnimatePresence mode="wait">
            {activeTab === 'sadhanas' && (
              <motion.div
                key="sadhanas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {sampleSadhanas.map((sadhana, index) => (
                  <motion.div
                    key={sadhana.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredSadhana(sadhana.id)}
                    onMouseLeave={() => setHoveredSadhana(null)}
                    className="group relative overflow-hidden rounded-lg border border-amber-200/50 bg-gradient-to-br from-background/80 to-background/40 p-4 hover:shadow-lg transition-all duration-300 cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${sadhana.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                    
                    <div className="relative z-10">
                      <div className="text-2xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                        {sadhana.icon}
                      </div>
                      
                      <h3 className="font-bold text-base mb-2 text-foreground group-hover:text-amber-700 transition-colors">
                        {sadhana.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-xs mb-3 leading-relaxed">
                        {sadhana.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-xs gap-2">
                        <Badge variant="secondary" className="bg-amber-100/50 text-amber-800 border-amber-200/50 text-[10px] px-2 py-0.5">
                          {sadhana.duration}
                        </Badge>
                        <Badge variant="outline" className="border-amber-300/50 text-amber-700 text-[10px] px-2 py-0.5">
                          {sadhana.difficulty}
                        </Badge>
                      </div>
                      
                      {hoveredSadhana === sadhana.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-amber-500/90 to-orange-500/90 backdrop-blur-sm rounded-lg flex items-center justify-center"
                        >
                          <div className="text-white text-center">
                            <Play className="w-6 h-6 mx-auto mb-1" />
                            <p className="font-semibold text-sm">Start Practice</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Browse More Sadhanas Button */}
                <div className="mt-6 w-full flex justify-center">
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="border-amber-300/50 text-amber-700 hover:bg-amber-50/50 text-sm px-6 py-3 font-medium"
                    asChild
                  >
                    <Link to="/sadhanas">
                      Browse More Sadhanas
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}

            {activeTab === 'texts' && (
              <motion.div
                key="texts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                {sampleBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedBook(selectedBook === book.id ? null : book.id)}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 rounded-lg p-4 border border-amber-200/50 hover:border-amber-300/70 transition-all duration-300 hover:shadow-lg">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-12 bg-gradient-to-b from-amber-600 to-orange-600 rounded shadow-md flex items-center justify-center text-white text-sm font-bold transform group-hover:scale-105 transition-transform">
                          📖
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-bold text-sm text-amber-800 dark:text-amber-200 mb-1">
                            {book.title}
                          </h3>
                          <p className="text-xs text-amber-600 dark:text-amber-300 mb-1">
                            by {book.author}
                          </p>
                          <Badge variant="outline" className="text-[10px] border-amber-300 text-amber-700 dark:text-amber-300 px-2 py-0.5">
                            {book.tradition}
                          </Badge>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {selectedBook === book.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-3 pt-3 border-t border-amber-200/50"
                          >
                            <p className="text-xs text-muted-foreground italic mb-2 leading-relaxed">
                              "{book.excerpt}"
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-[10px] text-amber-600">{book.pages}</span>
                              <Button size="sm" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-xs px-3 py-1 h-6">
                                <BookOpen className="w-3 h-3 mr-1" />
                                Read Now
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
                
                {/* Browse More Texts Button */}
                <div className="mt-6 w-full flex justify-center">
                  <Button 
                    variant="outline" 
                    size="default" 
                    className="border-amber-300/50 text-amber-700 hover:bg-amber-50/50 text-sm px-6 py-3 font-medium"
                    asChild
                  >
                    <Link to="/library">
                      Browse More Texts
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-6 border-t border-amber-200/50">
          <div className="max-w-xl mx-auto">
            <h4 className="text-lg font-semibold text-amber-800 dark:text-amber-200 mb-2">
              Ready to Begin Your Sacred Journey?
            </h4>
            <p className="text-muted-foreground mb-4 text-sm">
              Join thousands of seekers who have found their spiritual home in our integrated practice platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 px-6 text-sm" asChild>
                <Link to="/signup">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Start Your Practice
                </Link>
              </Button>
              <Button variant="outline" className="border-amber-300/50 text-amber-700 hover:bg-amber-50/50 px-6 text-sm" asChild>
                <Link to="/library">
                  Explore Library
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HomePage = () => {
  // Ambient audio toggle
  const [audioOn, setAudioOn] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.loop = true;
    audioRef.current.volume = 0.25;
    if (audioOn) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [audioOn]);

  // Subtle parallax sparkles in hero
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };
  const features = [
    {
      title: "Sadhana Tracker",
      description: "Track your daily spiritual practices with our intuitive tracker",
      icon: BookOpen,
      details: "Monitor your progress, set reminders, and maintain consistency in your spiritual journey with our comprehensive tracking system."
    },
    {
      title: "Progress Dashboard",
      description: "Visualize your spiritual growth with detailed analytics",
      icon: Trophy,
      details: "Gain insights into your practice patterns, streaks, and achievements through beautiful visualizations and progress reports."
    },
    {
      title: "Community",
      description: "Connect with fellow practitioners and share your journey",
      icon: Users,
      details: "Join a supportive community of like-minded spiritual seekers, share experiences, and learn from others on similar paths."
    },
    {
      title: "Divine Calendar",
      description: "Never miss important festivals and observances",
      icon: Calendar,
      details: "Stay connected with the spiritual calendar, receive reminders for important festivals, and plan your practices accordingly."
    },
    {
      title: "Sacred Library",
      description: "Access a vast collection of spiritual texts and resources",
      icon: BookOpen,
      details: "Explore our curated library of sacred texts, teachings, and resources to deepen your understanding and practice."
    },
    {
      title: "Divine Themes",
      description: "Personalize your experience with spiritual themes",
      icon: Sparkles,
      details: "Transform your practice with beautiful divine themes inspired by Hindu deities, each with unique visual elements and ambiance."
    }
  ];

  const practices = [
    {
      title: "Meditation & Mindfulness",
      description: "Begin your meditation journey with gentle daily practices",
      level: "Beginner",
      duration: "21 days",
      deity: "Buddha",
      tradition: "Buddhist"
    },
    {
      title: "Om Namah Shivaya",
      description: "Sacred mantra practice for spiritual transformation",
      level: "Beginner",
      duration: "108 days",
      deity: "Shiva",
      tradition: "Hindu"
    },
    {
      title: "Krishna Bhakti",
      description: "Immerse in divine love through Krishna consciousness",
      level: "Beginner",
      duration: "49 days",
      deity: "Krishna",
      tradition: "Vaishnava"
    },
    {
      title: "Divine Mother Worship",
      description: "Connect with the nurturing aspect of the Divine",
      level: "Beginner",
      duration: "21 days",
      deity: "Devi",
      tradition: "Shakta"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Yoga Teacher",
      content: "SadhanaBoard has transformed my daily practice. The tracking features keep me accountable and the progress insights are truly inspiring.",
      avatar: "PS"
    },
    {
      name: "Rahul Mehta",
      role: "Software Engineer",
      content: "The divine calendar helps me stay on top of important spiritual observances. It's a great tool for maintaining consistency in my practice.",
      avatar: "RM"
    },
    {
      name: "Anjali Devi",
      role: "Spiritual Seeker",
      content: "The community features have connected me with like-minded practitioners worldwide. My spiritual journey has deepened through these connections.",
      avatar: "AD"
    },
    {
      name: "Vikram Singh",
      role: "Retired Teacher",
      content: "The sacred library has opened up new dimensions of understanding for me. I've discovered texts I never knew existed that have enriched my practice.",
      avatar: "VS"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Practitioners", icon: Users },
    { value: "500+", label: "Sadhana Practices", icon: BookOpen },
    { value: "50+", label: "Sacred Texts", icon: BookOpen },
    { value: "98%", label: "User Satisfaction", icon: Star }
  ];

  return (
    <>
      {/* Sticky Navigation Bar - Glassy Spiritual Theme */}
      <div 
        className="sticky top-0 left-0 right-0 z-[999999] px-2 sm:px-4 pt-2 sm:pt-4"
        style={{
          pointerEvents: 'auto'
        }}
      >
        <nav 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(75, 0, 130, 0.12), rgba(148, 0, 211, 0.08))',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            boxShadow: '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.05), transparent, rgba(138, 43, 226, 0.05))'
            }}
          />
          
          {/* Floating spiritual particles in navbar - Responsive positioning */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1 sm:top-2 left-8 sm:left-16 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-yellow-400/60 rounded-full animate-pulse" />
            <div className="absolute top-2 sm:top-4 right-8 sm:right-20 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1 sm:bottom-3 left-16 sm:left-32 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-fuchsia-400/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="relative flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <img
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-8 w-8 sm:h-12 sm:w-12 rounded-full cursor-pointer scale-110 shadow-lg shadow-purple-500/30"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
                  }}
                />
                {/* Constant glowing ring around logo */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.3), rgba(138, 43, 226, 0.3), rgba(255, 215, 0, 0.3))',
                    padding: '2px'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-background/20" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300">
                  SadhanaBoard
                </span>
                <span className="text-[10px] sm:text-xs text-yellow-400/70 font-medium tracking-wider hidden xs:block">
                  ✨ Your Digital Yantra
                </span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                asChild 
                variant="ghost" 
                size="sm"
                className="relative text-foreground/80 hover:text-foreground hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-400/40 transition-all duration-300 group/btn overflow-hidden px-3 sm:px-4 py-2 text-sm"
              >
                <Link to="/login">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">Login</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="sm"
                className="relative bg-gradient-to-r from-purple-500/80 via-fuchsia-500/80 to-purple-500/80 hover:from-purple-400 hover:via-fuchsia-400 hover:to-purple-400 backdrop-blur-sm border border-purple-400/30 hover:border-yellow-400/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group/cta overflow-hidden px-3 sm:px-4 py-2 text-sm"
              >
                <Link to="/waitlist">
                  {/* Animated gradient background */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-purple-400/20 to-fuchsia-400/20 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                  />
                  {/* Floating sparkles - Smaller on mobile */}
                  <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-yellow-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
                  <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-0 group-hover/cta:opacity-100" style={{ animationDelay: '0.5s' }} />
                  
                  <span className="relative z-10 flex items-center">
                    <span className="hidden xs:inline">Join Waitlist</span>
                    <span className="xs:hidden">Waitlist</span>
                    <Sparkles className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover/cta:animate-spin" style={{ animationDuration: '2s' }} />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <div className="min-h-screen bg-transparent">
        {/* Beta banner */}
        <div className="px-2 sm:px-4 pt-2">
          <div className="mx-auto max-w-5xl rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-200 text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center justify-center gap-2">
            <span className="inline-block rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold">BETA</span>
            We’re in private beta. New registrations are closed — join the waitlist to get early access.
          </div>
        </div>
        <div className="space-y-16 animate-fade-in min-h-screen flex flex-col">
          {/* Hero Section with Sadhana Paper */}
          <section className="flex-1 flex items-center justify-center px-2 sm:px-4 mt-6 sm:mt-10 relative overflow-hidden">
            {/* Yantra watermark behind hero */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] -z-10 flex items-center justify-center">
              <svg width="800" height="800" viewBox="0 0 200 200" className="drop-shadow-[0_0_12px_rgba(255,215,0,0.15)]">
                <g fill="none" stroke="url(#grad)" strokeWidth="0.4">
                  <circle cx="100" cy="100" r="20" />
                  <circle cx="100" cy="100" r="40" />
                  <circle cx="100" cy="100" r="60" />
                  <circle cx="100" cy="100" r="80" />
                  <polygon points="100,20 140,100 100,180 60,100" />
                  <polygon points="100,30 135,100 100,170 65,100" />
                  <line x1="20" y1="100" x2="180" y2="100" />
                  <line x1="100" y1="20" x2="100" y2="180" />
                </g>
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FDE68A" />
                    <stop offset="100%" stopColor="#C084FC" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {/* Parallax sparkles */}
            <div className="pointer-events-none absolute inset-0 -z-10" style={{ transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)` }}>
              <div className="absolute top-16 left-12 text-xl">✨</div>
              <div className="absolute bottom-24 right-16 text-2xl">🪔</div>
              <div className="absolute top-1/3 right-1/4 text-lg">🌸</div>
            </div>
            <div className="max-w-7xl mx-0 sm:mx-2 lg:mx-4" onMouseMove={handleMouseMove}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Left Side - Spiritual Content */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
                      ✨ The First Digital Platform
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-400 to-fuchsia-600">
                      for Your Daily Saadhana
                    </span>
                  </h1>
                  
                  <p className="text-xl sm:text-2xl text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    Design, track, and deepen your spiritual practice in one sacred space.
                  </p>
                  
                  <p className="text-lg sm:text-xl text-muted-foreground/90 mb-6 sm:mb-8 leading-relaxed">
                    Join the private waitlist and be among the first to experience discipline, guidance, and growth through SaadhanaBoard.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-4 sm:mb-6">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-lg sm:text-xl px-8 sm:px-10 py-5 sm:py-7 shadow-lg hover:shadow-2xl transition-all duration-300"
                      style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)' }}
                      asChild
                    >
                      <Link to="/waitlist">
                        🌟 Join the Waitlist
                      </Link>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-purple-500/40 text-lg sm:text-xl px-8 sm:px-10 py-5 sm:py-7 hover:bg-purple-500/10 backdrop-blur-sm transition-all duration-300"
                      style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)' }}
                      asChild
                    >
                      <Link to="/about">
                        🌙 Explore Features
                      </Link>
                    </Button>
                    <Button 
                      size="lg"
                      variant="ghost"
                      className="text-lg sm:text-xl px-8 sm:px-10 py-5 sm:py-7 hover:bg-purple-500/10 backdrop-blur-sm transition-all duration-300"
                      onClick={() => setAudioOn((v) => !v)}
                    >
                      <Volume2 className="w-6 h-6 mr-2" /> {audioOn ? 'Sound: On' : 'Sound: Off'}
                    </Button>
                  </div>
                  
                  {/* Urgency + Exclusivity Line */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base">
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20 backdrop-blur-sm">
                      <span className="text-purple-400">🔒</span>
                      <span className="text-muted-foreground text-center sm:text-left">
                        Limited seats available. Early seekers get priority access and exclusive features.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Sadhana Paper (Transparent Golden Metallic) */}
              <div className="lg:col-span-4 relative">
                <div className="relative max-w-xl mx-auto lg:mx-0">
                  {/* Paper Container - Transparent Golden Metallic styling */}
                  <div 
                    className="relative p-6 rounded-2xl border-2 backdrop-blur-md"
                    style={{
                      background: 'linear-gradient(145deg, rgba(255, 223, 0, 0.05) 0%, rgba(255, 215, 0, 0.08) 30%, rgba(255, 207, 0, 0.04) 70%, rgba(255, 199, 0, 0.06) 100%)',
                      borderColor: 'rgba(255, 215, 0, 0.3)',
                      fontFamily: 'Georgia, serif',
                      boxShadow: `
                        0 8px 32px rgba(255, 215, 0, 0.12),
                        0 0 0 1px rgba(255, 215, 0, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                        inset 0 -1px 0 rgba(255, 215, 0, 0.08)
                      `,
                      backdropFilter: 'blur(14px) saturate(140%)',
                      WebkitBackdropFilter: 'blur(14px) saturate(140%)'
                    }}
                  >
                    {/* Metallic overlay gradient */}
                    <div 
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: `
                          linear-gradient(135deg, 
                            rgba(255, 255, 200, 0.08) 0%, 
                            transparent 25%, 
                            rgba(255, 223, 0, 0.05) 50%, 
                            transparent 75%, 
                            rgba(255, 255, 180, 0.03) 100%
                          )
                        `,
                        opacity: 0.5
                      }}
                    />
                    
                    {/* Enhanced ornate corners with golden metallic effect */}
                    <div 
                      className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
                      style={{
                        borderColor: 'rgba(255, 215, 0, 0.8)',
                        filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
                      }}
                    />
                    <div 
                      className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
                      style={{
                        borderColor: 'rgba(255, 215, 0, 0.8)',
                        filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
                      }}
                    />
                    <div 
                      className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg"
                      style={{
                        borderColor: 'rgba(255, 215, 0, 0.8)',
                        filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
                      }}
                    />
                    <div 
                      className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg"
                      style={{
                        borderColor: 'rgba(255, 215, 0, 0.8)',
                        filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.4))'
                      }}
                    />
                    
                    {/* Header with enhanced golden styling */}
                    <div className="text-center mb-4 relative z-10">
                      <h3 
                        className="text-2xl font-bold mb-2" 
                        style={{ 
                          fontFamily: 'Georgia, serif',
                          color: 'rgba(255, 223, 0, 0.95)',
                          textShadow: '0 0 8px rgba(255, 215, 0, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        🕉️ Sadhana Paper
                      </h3>
                      <div 
                        className="w-20 h-0.5 mx-auto"
                        style={{
                          background: 'linear-gradient(to right, transparent, rgba(255, 215, 0, 0.8), transparent)',
                          filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.4))'
                        }}
                      />
                    </div>

                    {/* Content with enhanced golden metallic text */}
                    <div className="space-y-2 relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(255, 223, 0, 0.95)',
                            textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                          }}
                        >
                          Purpose:
                        </div>
                        <div 
                          className="text-sm leading-relaxed pl-2"
                          style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          To honor Divine Mother Durga during the sacred nine nights of Navratri and invoke her blessings for strength, wisdom, and spiritual growth.
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(255, 223, 0, 0.95)',
                            textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                          }}
                        >
                          Goal:
                        </div>
                        <div 
                          className="text-sm leading-relaxed pl-2"
                          style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          Complete daily worship, fasting, and meditation practices for spiritual purification and divine connection.
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(255, 223, 0, 0.95)',
                            textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                          }}
                        >
                          Divine Focus:
                        </div>
                        <div 
                          className="text-sm leading-relaxed pl-2"
                          style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          Maa Durga and her nine divine forms (Navadurga)
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(255, 223, 0, 0.95)',
                            textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                          }}
                        >
                          Duration:
                        </div>
                        <div 
                          className="text-sm leading-relaxed pl-2"
                          style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          9 days
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(255, 223, 0, 0.95)',
                            textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                          }}
                        >
                          Message:
                        </div>
                        <div 
                          className="text-sm italic leading-relaxed pl-2"
                          style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          "May the Divine Mother's grace illuminate my path and transform my being with her infinite love and protection."
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(255, 223, 0, 0.95)',
                            textShadow: '0 0 4px rgba(255, 215, 0, 0.4)'
                          }}
                        >
                          My Offerings:
                        </div>
                        <div 
                          className="text-sm space-y-0.5 pl-2"
                          style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          <div>1. Daily Durga Chalisa recitation</div>
                          <div>2. Morning meditation (30 minutes)</div>
                          <div>3. Evening aarti and prayers</div>
                          <div>4. Sattvic fasting during day</div>
                          <div>5. Reading Devi Mahatmya</div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced metallic texture overlay */}
                    <div 
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: `
                          radial-gradient(circle at 20% 30%, rgba(255, 223, 0, 0.05) 0%, transparent 40%),
                          radial-gradient(circle at 80% 70%, rgba(255, 215, 0, 0.04) 0%, transparent 40%),
                          radial-gradient(circle at 40% 80%, rgba(255, 207, 0, 0.03) 0%, transparent 30%)
                        `,
                        opacity: 0.4
                      }}
                    />
                  </div>
                  
                  {/* Enhanced floating spiritual elements with golden glow */}
                  <div 
                    className="absolute -top-3 -right-3 text-2xl animate-pulse"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))',
                      opacity: 0.8
                    }}
                  >
                    🌸
                  </div>
                  <div 
                    className="absolute -bottom-3 -left-3 text-xl animate-pulse"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(255, 215, 0, 0.6))',
                      opacity: 0.8
                    }}
                  >
                    🪔
                  </div>
                  <div 
                    className="absolute top-1/2 -left-6 text-lg animate-bounce"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(255, 215, 0, 0.5))',
                      opacity: 0.7
                    }}
                  >
                    ✨
                  </div>
                </div>
              </div>
            </div>
            </div>
          </section>

          {/* Animated stats strip removed for beta landing */}

          {/* Features Section - Marketing focused */}
          <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Your Spiritual Growth</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to maintain and deepen your spiritual practice in one comprehensive platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="backdrop-blur-md bg-background/20 border-purple-500/10 hover:border-purple-500/30 hover:bg-background/30 transition-all duration-300 h-full"
                >
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground/80 mb-4">{feature.description}</p>
                    <p className="text-sm text-muted-foreground">{feature.details}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          </section>

          {/* Spiritual Library Showcase Section */}
          <section className="py-16 container mx-auto px-4">
            <SpiritualLibraryShowcase />
          </section>

          {/* Testimonials Section */}
          <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Practitioners Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of practitioners who have deepened their spiritual journey with SadhanaBoard
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="backdrop-blur-md bg-background/20 border-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 mr-3 flex items-center justify-center text-sm font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground/70">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground/80 text-sm">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-gradient-to-b from-background/30 to-background/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Our Sacred Values</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Principles that guide our spiritual community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-purple-400">🕉️</span>
                  </div>
                  <CardTitle className="text-xl">Discipline as Devotion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We honor daily practice not as a burden, but as a sacred offering — each act of discipline becomes worship.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-fuchsia-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-fuchsia-400">🪔</span>
                  </div>
                  <CardTitle className="text-xl">Unity in Diversity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Every path, every mantra, every deity has a place here. SadhanaBoard is a mandala where seekers of all traditions can walk side by side.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-blue-400">🔱</span>
                  </div>
                  <CardTitle className="text-xl">Authenticity over Appearance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We value genuine practice and inner growth above show or performance. Your journey is yours — honest, simple, and sacred.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-amber-400">🔯</span>
                  </div>
                  <CardTitle className="text-xl">Sacred Technology</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We believe technology can be a yantra — a living tool to deepen awareness, discipline, and divine connection when built with purity of intent.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-green-400">☸️</span>
                  </div>
                  <CardTitle className="text-xl">Collective Awakening</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Each seeker's practice strengthens the whole mandala. By growing individually, we lift each other and move humanity closer to awakening.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl text-rose-400">🧘‍♂️</span>
                  </div>
                  <CardTitle className="text-xl">Grace in Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    We walk the path with patience and compassion — honoring progress, embracing setbacks, and trusting that grace accompanies every step.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/30 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <MoonStar className="h-16 w-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Private Beta Is Live</h2>
            <p className="text-muted-foreground/90 mb-10 text-xl">
              We’re onboarding in waves. Join the waitlist to secure early access and explore our features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500/90 to-fuchsia-500/90 hover:from-purple-500 hover:to-fuchsia-500 text-lg px-8 py-6 backdrop-blur-sm"
                asChild
              >
                <Link to="/waitlist">
                  Join the Waitlist
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-500/40 text-lg px-8 py-6 hover:bg-purple-500/10 backdrop-blur-sm"
                asChild
              >
                <Link to="/about">
                  Explore Features
                </Link>
              </Button>
            </div>
          </div>
          </section>

          {/* Footer */}
          <div className="px-4 sm:px-4 pb-4 sm:pb-4">
            <footer 
              className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(75, 0, 130, 0.12), rgba(148, 0, 211, 0.08))',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                border: '1px solid rgba(255, 215, 0, 0.25)',
                boxShadow: `
                  0 8px 32px rgba(139, 69, 19, 0.1),
                  0 0 0 1px rgba(255, 215, 0, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.1)
                `,
              }}
            >
              {/* Subtle gradient overlay */}
              <div 
                className="absolute inset-0 rounded-xl sm:rounded-2xl pointer-events-none opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                style={{
                  background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.05), transparent, rgba(138, 43, 226, 0.05))'
                }}
              />
              
              {/* Floating spiritual particles in footer - Hidden on mobile to avoid interference */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
                <div className="absolute top-2 left-8 w-1 h-1 bg-yellow-400/60 rounded-full animate-pulse" />
                <div className="absolute top-4 right-20 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-3 left-32 w-1 h-1 bg-fuchsia-400/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-2 right-8 w-0.5 h-0.5 bg-amber-400/60 rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
              </div>

              <div className="relative z-20 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center space-x-3 sm:space-x-3">
                    <div className="relative">
                      <img
                        src="/lovable-uploads/sadhanaboard_logo.png"
                        alt="SadhanaBoard Logo"
                        className="h-10 w-10 sm:h-10 sm:w-10 rounded-full cursor-pointer scale-110 shadow-lg shadow-purple-500/30 relative z-10"
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
                        }}
                      />
                      {/* Constant glowing ring around logo */}
                      <div 
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.3), rgba(138, 43, 226, 0.3), rgba(255, 215, 0, 0.3))',
                          padding: '2px'
                        }}
                      >
                        <div className="w-full h-full rounded-full bg-background/20" />
                      </div>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-xl sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300">
                        SadhanaBoard
                      </span>
                      <span className="text-xs sm:text-xs text-yellow-400/70 font-medium tracking-wider">
                        ✨ Your Digital Yantra
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-6 sm:space-x-6 text-sm">
                    <Link 
                      to="/about" 
                      className="relative text-foreground hover:text-yellow-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10">About</span>
                    </Link>
                    <a 
                      href="#" 
                      className="relative text-foreground hover:text-yellow-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10">Privacy</span>
                    </a>
                    <a 
                      href="#" 
                      className="relative text-foreground hover:text-yellow-300 transition-all duration-300 group/link overflow-hidden px-2 py-1 z-10"
                    >
                      {/* Shimmer effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover/link:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                      <span className="relative z-10">Terms</span>
                    </a>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <div 
                    className="inline-block px-4 py-2 rounded-full text-xs text-muted-foreground/80"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(138, 43, 226, 0.08))',
                      border: '1px solid rgba(255, 215, 0, 0.15)'
                    }}
                  >
                    © {new Date().getFullYear()} SadhanaBoard. All rights reserved. A sacred space for spiritual practitioners.
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;