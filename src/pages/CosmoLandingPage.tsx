import { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Trophy, Calendar, Users, Sparkles, MoonStar, Flame, Target, Heart, Mountain, Star, TrendingUp, Play, Volume2, Eye, Zap, Compass, Crown,InfinityIcon } from "lucide-react";
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
      title: "Zen Meditation Journey",
      description: "Begin your journey into the depths of mindful awareness and inner stillness",
      duration: "21 days",
      difficulty: "Beginner",
      icon: "🧘‍♂️",
      color: "from-blue-500 to-cyan-500",
      practices: ["Breathing Exercises", "Body Scanning", "Mindful Walking"]
    },
    {
      id: 2,
      title: "Cosmic Consciousness",
      description: "Expand your awareness to connect with the infinite cosmos",
      duration: "40 days",
      difficulty: "Intermediate",
      icon: "🌌",
      color: "from-indigo-500 to-purple-500",
      practices: ["Stellar Meditation", "Cosmic Breathing", "Universal Connection"]
    },
    {
      id: 3,
      title: "Stellar Mindfulness",
      description: "Align your consciousness with the rhythms of the universe",
      duration: "28 days",
      difficulty: "Beginner",
      icon: "⭐",
      color: "from-purple-500 to-fuchsia-500",
      practices: ["Star Gazing Meditation", "Galactic Breathing", "Cosmic Awareness"]
    }
  ];

  const sampleBooks = [
    {
      id: 1,
      title: "The Tao Te Ching",
      author: "Laozi",
      tradition: "Taoism",
      excerpt: "The Tao that can be told is not the eternal Tao...",
      pages: "81 Verses",
      rating: 4.9
    },
    {
      id: 2,
      title: "The Dhammapada",
      author: "Buddha",
      tradition: "Buddhism",
      excerpt: "We are what we think. All that we are arises with our thoughts...",
      pages: "423 Verses",
      rating: 4.8
    },
    {
      id: 3,
      title: "The Yoga Sutras",
      author: "Patanjali",
      tradition: "Yoga",
      excerpt: "Yoga is the cessation of fluctuations of the mind...",
      pages: "196 Sutras",
      rating: 4.7
    }
  ];

  return (
    <Card className="bg-background/95 backdrop-blur-sm border border-indigo-500/30 shadow-2xl overflow-hidden relative">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(129, 140, 248,0.08)_0%,rgba(0,0,0,0)_70%)]"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <CardHeader className="text-center pb-4 relative z-10">
        <div className="flex items-center justify-center mb-4">
          <div className="text-3xl mr-3">📚</div>
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-700">
            A Cosmic Library of Infinite Wisdom
          </CardTitle>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Discover a sacred space where everything you need for your cosmic practice lives together — sadhanas to guide you, 
          texts to inspire you. No more searching, no more scattered rituals — just a single home for your journey.
        </p>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Enhanced Interactive Tabs with glow effect */}
        <div className="flex justify-center space-x-2 bg-muted/50 p-2 rounded-xl max-w-md mx-auto shadow-inner">
          {[
            { id: 'sadhanas', label: 'Cosmic Practices', icon: '🧘‍♂️' },
            { id: 'texts', label: 'Universal Texts', icon: '📖' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-5 py-3 rounded-lg transition-all duration-300 text-base font-medium ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg transform scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="min-h-[350px]">
          <AnimatePresence mode="wait">
            {activeTab === 'sadhanas' && (
              <motion.div
                key="sadhanas"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {sampleSadhanas.map((sadhana, index) => (
                  <motion.div
                    key={sadhana.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 }}
                    onMouseEnter={() => setHoveredSadhana(sadhana.id)}
                    onMouseLeave={() => setHoveredSadhana(null)}
                    className="group relative overflow-hidden rounded-2xl border border-indigo-200/50 bg-gradient-to-br from-background/90 to-background/60 p-6 hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2"
                  >
                    {/* Enhanced animated background gradient on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${sadhana.color} opacity-0 group-hover:opacity-20 transition-all duration-700`}></div>
                    
                    {/* Floating particles effect */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-white/20 rounded-full animate-ping"></div>
                      <div className="absolute bottom-6 left-6 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </div>
                    
                    <div className="relative z-10">
                      <div className="text-4xl mb-5 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                        {sadhana.icon}
                      </div>
                      
                      <h3 className="font-bold text-xl mb-3 text-foreground group-hover:text-indigo-700 transition-colors duration-300">
                        {sadhana.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-base mb-5 leading-relaxed">
                        {sadhana.description}
                      </p>
                      
                      <div className="flex justify-between items-center text-base gap-3 mb-4">
                        <Badge variant="secondary" className="bg-indigo-100/50 text-indigo-800 border-indigo-200/50 text-sm px-4 py-1.5">
                          {sadhana.duration}
                        </Badge>
                        <Badge variant="outline" className="border-indigo-300/50 text-indigo-700 text-sm px-4 py-1.5">
                          {sadhana.difficulty}
                        </Badge>
                      </div>
                      
                      {/* Practices list */}
                      <div className="mb-5">
                        <p className="text-sm font-medium text-indigo-700 mb-2">Includes:</p>
                        <div className="flex flex-wrap gap-2">
                          {sadhana.practices.map((practice, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs border-indigo-300/50 text-indigo-600 px-2 py-0.5">
                              {practice}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      {/* Enhanced Call to action badge for first-time visitors */}
                      <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm w-full justify-center py-2 hover:from-blue-600 hover:to-indigo-600 transition-all duration-300">
                          <Sparkles className="h-4 w-4 mr-2" />
                          Begin Cosmic Journey
                        </Badge>
                      </div>
                      
                      {hoveredSadhana === sadhana.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-indigo-500/95 to-purple-500/95 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                        >
                          <div className="text-white text-center p-4">
                            <Play className="w-12 h-12 mx-auto mb-3" />
                            <p className="font-bold text-lg">Begin Practice</p>
                            <p className="text-sm opacity-90 mt-1">Click to start your cosmic journey</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                ))}
                
                {/* Enhanced Browse More Sadhanas Button */}
                <div className="mt-8 w-full flex justify-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-indigo-300/50 text-indigo-700 hover:bg-indigo-50/50 text-lg px-10 py-7 font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50"
                    asChild
                  >
                    <Link to="/sadhanas">
                      <Sparkles className="w-6 h-6 mr-3" />
                      Browse Our Complete Collection of Cosmic Sadhanas
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
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {sampleBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    onClick={() => setSelectedBook(selectedBook === book.id ? null : book.id)}
                    className="group cursor-pointer"
                  >
                    <div className="relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/60 dark:to-purple-950/60 rounded-2xl p-6 border border-indigo-200/50 hover:border-indigo-300/70 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
                      {/* Enhanced animated glow effect */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-400/15 to-purple-400/15 opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                      
                      {/* Corner decorative elements */}
                      <div className="absolute top-3 right-3 text-indigo-400/20 text-2xl">❦</div>
                      <div className="absolute bottom-3 left-3 text-indigo-400/20 text-2xl">❧</div>
                      
                      <div className="flex items-start space-x-5 relative z-10">
                        <div className="w-16 h-20 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center text-white text-xl font-bold transform group-hover:scale-105 transition-transform duration-300">
                          📖
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-indigo-800 dark:text-indigo-200 group-hover:text-indigo-900 transition-colors duration-300">
                              {book.title}
                            </h3>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-indigo-500 fill-indigo-500" />
                              <span className="text-sm font-medium text-indigo-700">{book.rating}</span>
                            </div>
                          </div>
                          <p className="text-base text-indigo-600 dark:text-indigo-300 mb-3">
                            by {book.author}
                          </p>
                          <Badge variant="outline" className="text-sm border-indigo-300 text-indigo-700 dark:text-indigo-300 px-3 py-1">
                            {book.tradition}
                          </Badge>
                          
                          {/* Enhanced Highlight for first-time visitors */}
                          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-sm w-full justify-center py-1.5">
                              <BookOpen className="h-4 w-4 mr-2" />
                              Free Preview Available
                            </Badge>
                          </div>
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {selectedBook === book.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4 }}
                            className="mt-5 pt-5 border-t border-indigo-200/50 relative z-10"
                          >
                            <p className="text-base text-muted-foreground italic mb-4 leading-relaxed">
                              "{book.excerpt}"
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-indigo-600">{book.pages}</span>
                              <Button size="sm" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-sm px-5 py-2.5 h-9 transition-all duration-300 hover:scale-105">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Read Now
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
                
                {/* Enhanced Browse More Texts Button */}
                <div className="mt-8 w-full flex justify-center">
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-indigo-300/50 text-indigo-700 hover:bg-indigo-50/50 text-lg px-10 py-7 font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-r from-indigo-50/50 to-purple-50/50"
                    asChild
                  >
                    <Link to="/library">
                      <BookOpen className="w-6 h-6 mr-3" />
                      Explore Our Complete Cosmic Library
                    </Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Enhanced Call to Action with Urgency for First-Time Visitors */}
        <div className="text-center pt-10 border-t border-indigo-200/50 relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center bg-gradient-to-r from-indigo-500/15 to-purple-500/15 border border-indigo-500/40 rounded-full px-6 py-3 mb-6 animate-pulse">
              <Zap className="h-5 w-5 text-indigo-500 mr-3" />
              <span className="text-base font-bold text-indigo-700">First-time visitor? Start with our curated beginner collection!</span>
            </div>
            <h4 className="text-3xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">
              Ready to Begin Your Cosmic Journey?
            </h4>
            <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
              Join thousands of seekers who have found their cosmic home in our integrated practice platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center">
              <Button className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 px-10 py-7 text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl" asChild>
                <Link to="/signup">
                  <Sparkles className="w-6 h-6 mr-3" />
                  Start Your Practice - Free Trial
                </Link>
              </Button>
              <Button variant="outline" className="border-indigo-300/50 text-indigo-700 hover:bg-indigo-50/50 px-10 py-7 text-lg font-bold transition-all duration-300 hover:scale-105 hover:shadow-xl" asChild>
                <Link to="/library">
                  <BookOpen className="w-6 h-6 mr-3" />
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

const CosmoLandingPage = () => {
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
      title: "Cosmic Sadhana Tracker",
      description: "Track your daily cosmic practices with our intuitive tracker",
      icon: BookOpen,
      details: "Monitor your progress, set reminders, and maintain consistency in your cosmic journey with our comprehensive tracking system."
    },
    {
      title: "Stellar Progress Dashboard",
      description: "Visualize your cosmic growth with detailed analytics",
      icon: Trophy,
      details: "Gain insights into your practice patterns, streaks, and achievements through beautiful visualizations and progress reports."
    },
    {
      title: "Galactic Community",
      description: "Connect with fellow cosmic practitioners and share your journey",
      icon: Users,
      details: "Join a supportive community of like-minded cosmic seekers, share experiences, and learn from others on similar paths."
    },
    {
      title: "Universal Calendar",
      description: "Never miss important cosmic events and observances",
      icon: Calendar,
      details: "Stay connected with the cosmic calendar, receive reminders for important events, and plan your practices accordingly."
    },
    {
      title: "Cosmic Library",
      description: "Access a vast collection of cosmic texts and resources",
      icon: BookOpen,
      details: "Explore our curated library of cosmic texts, teachings, and resources to deepen your understanding and practice."
    },
    {
      title: "Cosmic Themes",
      description: "Personalize your experience with cosmic themes",
      icon: Sparkles,
      details: "Transform your practice with beautiful cosmic themes inspired by the universe, each with unique visual elements and ambiance."
    }
  ];

  const practices = [
    {
      title: "Zen Meditation & Mindfulness",
      description: "Begin your meditation journey with gentle daily practices",
      level: "Beginner",
      duration: "21 days",
      deity: "Universal Consciousness",
      tradition: "Zen"
    },
    {
      title: "Stellar Awareness",
      description: "Expand your consciousness to connect with the infinite cosmos",
      level: "Beginner",
      duration: "40 days",
      deity: "Cosmic Energy",
      tradition: "Universal"
    },
    {
      title: "Galactic Mindfulness",
      description: "Align your consciousness with the rhythms of the universe",
      level: "Beginner",
      duration: "28 days",
      deity: "Stellar Forces",
      tradition: "Cosmic"
    },
    {
      title: "Universal Love Meditation",
      description: "Connect with the nurturing aspect of the Universal Consciousness",
      level: "Beginner",
      duration: "21 days",
      deity: "Cosmic Love",
      tradition: "Universal"
    }
  ];

  const testimonials = [
    {
      name: "Alex Morgan",
      role: "Meditation Practitioner",
      content: "CosmoBoard has transformed my daily practice. The cosmic tracking features keep me accountable and the progress insights are truly inspiring.",
      avatar: "AM"
    },
    {
      name: "Sam Wilson",
      role: "Spiritual Seeker",
      content: "The cosmic calendar helps me stay on top of important universal observances. It's a great tool for maintaining consistency in my practice.",
      avatar: "SW"
    },
    {
      name: "Jordan Lee",
      role: "Zen Practitioner",
      content: "The community features have connected me with like-minded cosmic practitioners worldwide. My spiritual journey has deepened through these connections.",
      avatar: "JL"
    },
    {
      name: "Taylor Kim",
      role: "Cosmic Explorer",
      content: "The cosmic library has opened up new dimensions of understanding for me. I've discovered texts I never knew existed that have enriched my practice.",
      avatar: "TK"
    }
  ];

  const stats = [
    { value: "15,000+", label: "Cosmic Practitioners", icon: Users },
    { value: "700+", label: "Cosmic Sadhanas", icon: BookOpen },
    { value: "100+", label: "Universal Texts", icon: BookOpen },
    { value: "99%", label: "User Satisfaction", icon: Star }
  ];

  return (
    <>
      {/* Sticky Navigation Bar - Glassy Cosmic Theme */}
      <div 
        className="sticky top-0 left-0 right-0 z-[999999] px-2 sm:px-4 pt-2 sm:pt-4"
        style={{
          pointerEvents: 'auto'
        }}
      >
        <nav 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group"
          style={{
            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(139, 92, 246, 0.12), rgba(192, 132, 252, 0.08))',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(129, 140, 248, 0.25)',
            boxShadow: '0 8px 32px rgba(99, 102, 241, 0.1), 0 0 0 1px rgba(129, 140, 248, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(45deg, rgba(129, 140, 248, 0.05), transparent, rgba(139, 92, 246, 0.05))'
            }}
          />
          
          {/* Floating cosmic particles in navbar - Responsive positioning */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1 sm:top-2 left-8 sm:left-16 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-indigo-400/60 rounded-full animate-pulse" />
            <div className="absolute top-2 sm:top-4 right-8 sm:right-20 w-1 sm:w-1.5 h-1 sm:h-1.5 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1 sm:bottom-3 left-16 sm:left-32 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-fuchsia-400/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="relative flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4">
            <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
              <div className="relative">
                <img
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="CosmoBoard Logo"
                  className="h-8 w-8 sm:h-12 sm:w-12 rounded-full cursor-pointer scale-110 shadow-lg shadow-indigo-500/30"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(129, 140, 248, 0.3))'
                  }}
                />
                {/* Constant glowing ring around logo */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(129, 140, 248, 0.3), rgba(139, 92, 246, 0.3), rgba(129, 140, 248, 0.3))',
                    padding: '2px'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-background/20" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-fuchsia-300">
                  CosmoBoard
                </span>
                <span className="text-[10px] sm:text-xs text-indigo-400/70 font-medium tracking-wider hidden xs:block">
                  🌌 Your Universal Yantra
                </span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button 
                asChild 
                variant="ghost" 
                size="sm"
                className="relative text-foreground/80 hover:text-foreground hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-indigo-400/40 transition-all duration-300 group/btn overflow-hidden px-3 sm:px-4 py-2 text-sm"
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
                className="relative bg-gradient-to-r from-indigo-500/80 via-purple-500/80 to-indigo-500/80 hover:from-indigo-400 hover:via-purple-400 hover:to-indigo-400 backdrop-blur-sm border border-indigo-400/30 hover:border-indigo-400/50 shadow-lg hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 group/cta overflow-hidden px-3 sm:px-4 py-2 text-sm"
              >
                <Link to="/waitlist">

                  {/* Animated gradient background */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-fuchsia-400/20 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                  />
                  {/* Floating sparkles - Smaller on mobile */}
                  <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-indigo-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
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
          <div className="mx-auto max-w-5xl rounded-lg border border-indigo-400/30 bg-indigo-500/10 text-indigo-200 text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center justify-center gap-2">
            <span className="inline-block rounded-full bg-indigo-400/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold">BETA</span>
            We’re in private beta. New registrations are closed — join the waitlist to get early access.
          </div>
        </div>
        <div className="space-y-16 animate-fade-in min-h-screen flex flex-col">
          {/* Hero Section with Cosmic Sadhana Paper */}
          <section className="flex-1 flex items-center justify-center px-2 sm:px-4 mt-6 sm:mt-10 relative overflow-hidden">
            {/* Cosmic background elements */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.07] -z-10 flex items-center justify-center">
              <svg width="800" height="800" viewBox="0 0 200 200" className="drop-shadow-[0_0_12px_rgba(129,140,248,0.15)]">
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
                    <stop offset="0%" stopColor="#C7D2FE" />
                    <stop offset="100%" stopColor="#C084FC" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {/* Parallax cosmic sparkles */}
            <div className="pointer-events-none absolute inset-0 -z-10" style={{ transform: `translate(${mousePos.x * 6}px, ${mousePos.y * 6}px)` }}>
              <div className="absolute top-16 left-12 text-xl">✨</div>
              <div className="absolute bottom-24 right-16 text-2xl">🪐</div>
              <div className="absolute top-1/3 right-1/4 text-lg">🌟</div>
            </div>
            <div className="max-w-7xl mx-0 sm:mx-2 lg:mx-4" onMouseMove={handleMouseMove}>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Left Side - Cosmic Content */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                <div className="text-center lg:text-left">
                  <h1 className="text-4xl xs:text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-400 to-indigo-600">
                      🌌 The First Digital Platform
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-600">
                      for Your Cosmic Saadhana
                    </span>
                  </h1>
                  
                  <p className="text-xl sm:text-2xl text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
                    Design, track, and deepen your cosmic practice in one universal space.
                  </p>
                  
                  <p className="text-lg sm:text-xl text-muted-foreground/90 mb-6 sm:mb-8 leading-relaxed">
                    Join the private waitlist and be among the first to experience cosmic discipline, guidance, and growth through CosmoBoard.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start mb-4 sm:mb-6">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-lg sm:text-xl px-8 sm:px-10 py-5 sm:py-7 shadow-lg hover:shadow-2xl transition-all duration-300"
                      style={{ boxShadow: '0 0 30px rgba(129, 140, 248, 0.3)' }}
                      asChild
                    >
                      <Link to="/waitlist">
                        🌟 Join the Waitlist
                      </Link>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-indigo-500/40 text-lg sm:text-xl px-8 sm:px-10 py-5 sm:py-7 hover:bg-indigo-500/10 backdrop-blur-sm transition-all duration-300"
                      style={{ boxShadow: '0 0 15px rgba(129, 140, 248, 0.1)' }}
                      asChild
                    >
                      <Link to="/about">
                        🌙 Explore Features
                      </Link>
                    </Button>
                    <Button 
                      size="lg"
                      variant="ghost"
                      className="text-lg sm:text-xl px-8 sm:px-10 py-5 sm:py-7 hover:bg-indigo-500/10 backdrop-blur-sm transition-all duration-300"
                      onClick={() => setAudioOn((v) => !v)}
                    >
                      <Volume2 className="w-6 h-6 mr-2" /> {audioOn ? 'Sound: On' : 'Sound: Off'}
                    </Button>
                  </div>
                  
                  {/* Urgency + Exclusivity Line */}
                  <div className="flex items-center justify-center lg:justify-start gap-2 text-sm sm:text-base">
                    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 backdrop-blur-sm">
                      <span className="text-indigo-400">🔒</span>
                      <span className="text-muted-foreground text-center sm:text-left">
                        Limited seats available. Early cosmic seekers get priority access and exclusive features.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </div>
              

                  {/* Paper Container - Transparent Cosmic Metallic styling */}
                  <div 
                    className="relative p-6 rounded-2xl border-2 backdrop-blur-md"
                    style={{
                      background: 'linear-gradient(145deg, rgba(165, 180, 252, 0.05) 0%, rgba(129, 140, 248, 0.08) 30%, rgba(139, 92, 246, 0.04) 70%, rgba(192, 132, 252, 0.06) 100%)',
                      borderColor: 'rgba(129, 140, 248, 0.3)',
                      fontFamily: 'Georgia, serif',
                      boxShadow: `
                        0 8px 32px rgba(129, 140, 248, 0.12),
                        0 0 0 1px rgba(129, 140, 248, 0.15),
                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                        inset 0 -1px 0 rgba(129, 140, 248, 0.08)
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
                            rgba(199, 210, 254, 0.08) 0%, 
                            transparent 25%, 
                            rgba(165, 180, 252, 0.05) 50%, 
                            transparent 75%, 
                            rgba(237, 229, 253, 0.03) 100%
                          )
                        `,
                        opacity: 0.5
                      }}
                    />
                    
                    {/* Enhanced ornate corners with cosmic metallic effect */}
                    <div 
                      className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg"
                      style={{
                        borderColor: 'rgba(129, 140, 248, 0.8)',
                        filter: 'drop-shadow(0 0 4px rgba(129, 140, 248, 0.4))'
                      }}
                    />
                    <div 
                      className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg"
                      style={{
                        borderColor: 'rgba(129, 140, 248, 0.8)',
                        filter: 'drop-shadow(0 0 4px rgba(129, 140, 248, 0.4))'
                      }}
                    />
                    <div 
                      className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg"
                      style={{
                        borderColor: 'rgba(129, 140, 248, 0.8)',
                        filter: 'drop-shadow(0 0 4px rgba(129, 140, 248, 0.4))'
                      }}
                    />
                    <div 
                      className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg"
                      style={{
                        borderColor: 'rgba(129, 140, 248, 0.8)',
                        filter: 'drop-shadow(0 0 4px rgba(129, 140, 248, 0.4))'
                      }}
                    />
                    
                    {/* Header with enhanced cosmic styling */}
                    <div className="text-center mb-4 relative z-10">
                      <h3 
                        className="text-2xl font-bold mb-2" 
                        style={{ 
                          fontFamily: 'Georgia, serif',
                          color: 'rgba(165, 180, 252, 0.95)',
                          textShadow: '0 0 8px rgba(129, 140, 248, 0.6), 0 2px 4px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        🌌 Cosmic Sadhana Paper
                      </h3>
                      <div 
                        className="w-20 h-0.5 mx-auto"
                        style={{
                          background: 'linear-gradient(to right, transparent, rgba(129, 140, 248, 0.8), transparent)',
                          filter: 'drop-shadow(0 0 2px rgba(129, 140, 248, 0.4))'
                        }}
                      />
                    </div>

                    {/* Content with enhanced cosmic metallic text */}
                    <div className="space-y-2 relative z-10" style={{ fontFamily: 'Georgia, serif' }}>
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(165, 180, 252, 0.95)',
                            textShadow: '0 0 4px rgba(129, 140, 248, 0.4)'
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
                          To align with universal consciousness during the sacred practice of Zen meditation and invoke cosmic energy for inner peace and spiritual growth.
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(165, 180, 252, 0.95)',
                            textShadow: '0 0 4px rgba(129, 140, 248, 0.4)'
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
                          Achieve mindful awareness and inner stillness through daily meditation practices for spiritual purification and universal connection.
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(165, 180, 252, 0.95)',
                            textShadow: '0 0 4px rgba(129, 140, 248, 0.4)'
                          }}
                        >
                          Cosmic Focus:
                        </div>
                        <div 
                          className="text-sm leading-relaxed pl-2"
                          style={{
                            color: 'rgba(255, 255, 255, 0.85)',
                            textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                          }}
                        >
                          Universal Consciousness and the infinite cosmos
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(165, 180, 252, 0.95)',
                            textShadow: '0 0 4px rgba(129, 140, 248, 0.4)'
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
                          21 days
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(165, 180, 252, 0.95)',
                            textShadow: '0 0 4px rgba(129, 140, 248, 0.4)'
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
                          "May the universal consciousness illuminate my path and transform my being with infinite peace and cosmic wisdom."
                        </div>
                      </div>
                      
                      <div>
                        <div 
                          className="font-semibold mb-1 text-base"
                          style={{
                            color: 'rgba(165, 180, 252, 0.95)',
                            textShadow: '0 0 4px rgba(129, 140, 248, 0.4)'
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
                          <div>1. Daily Zen meditation (30 minutes)</div>
                          <div>2. Mindful breathing exercises</div>
                          <div>3. Evening gratitude practice</div>
                          <div>4. Cosmic awareness journaling</div>
                          <div>5. Universal love meditation</div>
                        </div>
                      </div>
                    </div>

                    {/* Enhanced metallic texture overlay */}
                    <div 
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: `
                          radial-gradient(circle at 20% 30%, rgba(165, 180, 252, 0.05) 0%, transparent 40%),
                          radial-gradient(circle at 80% 70%, rgba(129, 140, 248, 0.04) 0%, transparent 40%),
                          radial-gradient(circle at 40% 80%, rgba(139, 92, 246, 0.03) 0%, transparent 30%)
                        `,
                        opacity: 0.4
                      }}
                    />
                  </div>
                  
                  {/* Enhanced floating cosmic elements with cosmic glow */}
                  <div 
                    className="absolute -top-3 -right-3 text-2xl animate-pulse"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.6))',
                      opacity: 0.8
                    }}
                  >
                    🌟
                  </div>
                  <div 
                    className="absolute -bottom-3 -left-3 text-xl animate-pulse"
                    style={{
                      filter: 'drop-shadow(0 0 6px rgba(129, 140, 248, 0.6))',
                      opacity: 0.8
                    }}
                  >
                    🪐
                  </div>
                  <div 
                    className="absolute top-1/2 -left-6 text-lg animate-bounce"
                    style={{
                      filter: 'drop-shadow(0 0 4px rgba(129, 140, 248, 0.5))',
                      opacity: 0.7
                    }}
                  >
                    ✨
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* End of removed section */}

          {/* Animated stats strip removed for beta landing */}

          {/* Theme Changing Section - Removed as per requirements */}
          {/* This section has been removed from landing pages as per project specifications */}

          {/* Features Section - Marketing focused */}
          <section className="py-20 container mx-auto px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/5 to-purple-900/5 rounded-3xl"></div>
          <div className="relative z-10 text-center mb-16">
            <h2 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Powerful Cosmic Features for Your Universal Growth</h2>
            <p className="text-2xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to maintain and deepen your cosmic practice in one comprehensive platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="backdrop-blur-lg bg-background/30 border-indigo-500/20 hover:border-indigo-400/50 hover:bg-background/40 transition-all duration-500 h-full transform hover:-translate-y-2 hover:shadow-2xl rounded-2xl overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <CardHeader>
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mb-6 mx-auto group-hover:from-indigo-500/30 group-hover:to-purple-500/30 transition-all duration-300">
                      <Icon className="h-10 w-10 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" />
                    </div>
                    <CardTitle className="text-3xl text-center group-hover:text-indigo-300 transition-colors duration-300">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground/90 mb-4 text-lg text-center">{feature.description}</p>
                    <p className="text-base text-muted-foreground text-center group-hover:text-foreground/80 transition-colors duration-300">{feature.details}</p>
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
          <section className="py-16 container mx-auto px-4 relative overflow-hidden">
          <div className="relative z-10">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                What Cosmic Practitioners Say
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands of practitioners who have deepened their cosmic journey
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {testimonials.slice(0, 2).map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="bg-background/30 border border-indigo-500/20 hover:border-indigo-400/40 transition-all duration-300 h-full rounded-xl overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mr-3 text-lg">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-bold text-sm">{testimonial.name}</p>
                          <p className="text-xs text-muted-foreground/70">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-muted-foreground text-sm">
                        "{testimonial.content}"
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          </section>

          {/* Our Cosmic Values */}
          <section className="py-24 container mx-auto px-4 relative overflow-hidden">
          {/* Enhanced background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.03)_0%,rgba(0,0,0,0)_70%)]"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          </div>
          
          <div className="relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
                  <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center mx-auto">
                    <span className="text-2xl text-white">🌌</span>
                  </div>
                </div>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
                Our Cosmic Values
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                The guiding principles that shape our universal space and cosmic community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {[
                {
                  title: "Universal Growth",
                  description: "We believe in fostering genuine cosmic development through consistent practice",
                  detailedDescription: "True cosmic growth emerges from dedicated daily practice, mindful reflection, and the cultivation of universal awareness. Our platform supports your journey with personalized tracking, insightful analytics, and guided practices that adapt to your evolving needs.",
                  icon: "🌌",
                  knowledge: "Ancient wisdom traditions teach that cosmic development is a gradual process requiring patience, discipline, and consistent effort. Modern neuroscience confirms that regular spiritual practices rewire the brain for greater compassion, resilience, and awareness."
                },
                {
                  title: "Community Connection",
                  description: "Building bridges between practitioners to share wisdom and support",
                  detailedDescription: "Cosmic growth flourishes in community. We connect you with like-minded practitioners, experienced guides, and wisdom keepers worldwide. Share experiences, seek guidance, and celebrate milestones together in our supportive ecosystem.",
                  icon: "👥",
                  knowledge: "The Sanskrit concept of 'Satsang' emphasizes the transformative power of spiritual community. Research shows that group practice amplifies individual benefits, creating a collective energy field that supports deeper states of consciousness and personal transformation."
                },
                {
                  title: "Cosmic Inspiration",
                  description: "Drawing strength and guidance from the universal energies that surround us",
                  detailedDescription: "We honor the sacred connection between the human and cosmic. Through carefully curated practices, sacred texts, and devotional tools, we create space for cosmic inspiration to flow into your daily life, offering guidance, strength, and profound inner peace.",
                  icon: "✨",
                  knowledge: "Bhakti traditions recognize that cosmic grace flows through devotion, surrender, and remembrance. Quantum physics suggests that consciousness and energy are fundamentally interconnected, supporting the ancient understanding that we are never separate from the cosmic source."
                },
                {
                  title: "Authentic Practice",
                  description: "Encouraging sincere and dedicated cosmic practices rooted in tradition",
                  detailedDescription: "Authenticity means honoring both ancient wisdom and modern understanding. Our practices are rooted in time-tested traditions while embracing contemporary insights about psychology, neuroscience, and human development to create genuinely transformative experiences.",
                  icon: "❤️",
                  knowledge: "The Yoga Sutras define authentic practice (Abhyasa) as sustained effort over time. Modern research confirms that practices combining traditional wisdom with evidence-based methods produce the most profound and lasting transformation in practitioners."
                }
              ].map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="h-full"
                >
                  <Card className="backdrop-blur-lg bg-background/40 border-2 border-indigo-500/30 hover:border-indigo-400/50 transition-all duration-500 h-full transform hover:-translate-y-3 hover:shadow-2xl rounded-3xl overflow-hidden group relative shadow-xl hover:shadow-indigo-500/20 transition-shadow duration-300">
                    {/* Enhanced hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-400/20 rounded-full animate-ping"></div>
                      <div className="absolute bottom-6 left-6 w-1 h-1 bg-purple-400/30 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    </div>
                    
                    <CardHeader>
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center mx-auto mb-5 group-hover:from-indigo-500/40 group-hover:to-purple-500/40 transition-all duration-300 text-3xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        {value.icon}
                      </div>
                      <CardTitle className="text-2xl text-center group-hover:text-indigo-300 transition-colors duration-300 font-bold">{value.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                      <p className="text-muted-foreground text-base text-center leading-relaxed group-hover:text-foreground/90 transition-colors duration-300 mb-4">
                        {value.description}
                      </p>
                      <div className="border-t border-indigo-500/20 pt-4 mt-4 group-hover:border-indigo-400/30 transition-colors duration-300">
                        <p className="text-foreground/80 text-sm leading-relaxed mb-3">
                          {value.detailedDescription}
                        </p>
                        <div className="bg-indigo-500/5 rounded-xl p-3 border border-indigo-500/10 group-hover:bg-indigo-500/10 transition-colors duration-300">
                          <p className="text-xs text-indigo-300 italic leading-relaxed">
                            <span className="font-semibold text-indigo-200">Wisdom Insight:</span> {value.knowledge}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    {/* Enhanced hover effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-400/30 rounded-full animate-ping"></div>
                      <div className="absolute bottom-8 left-8 w-2 h-2 bg-purple-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                      <div className="absolute top-1/2 left-4 w-1 h-1 bg-violet-400/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/30 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <h2 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
              Begin Your Cosmic Journey Today
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join our community of cosmic practitioners and unlock the mysteries of the universe
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 px-8 py-6 text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                asChild
              >
                <Link to="/waitlist">
                  <Sparkles className="w-6 h-6 mr-3" />
                  Join the Waitlist
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-indigo-500/40 text-lg px-8 py-6 hover:bg-indigo-500/10 backdrop-blur-sm transition-all duration-300"
                asChild
              >
                <Link to="/about">
                  <Compass className="w-6 h-6 mr-3" />
                  Explore Features
                </Link>
              </Button>
            </div>
          </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default CosmoLandingPage;
