import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BookOpen, Trophy, Calendar, Users, Sparkles, MoonStar, Flame, Target, Heart, Mountain, Star, TrendingUp, Play, Volume2, ChevronRight, Zap, Compass, Crown, InfinityIcon, Skull, Bone, Wind, Eye, EyeOff, Shield } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion, useInView, useAnimation, useScroll, useTransform } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { Line, OrbitControls } from "@react-three/drei";
import * as THREE from "three";


// Dynamic yantra that responds to user interaction - mystery theme
const InteractiveYantra = () => {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(clock.getElapsedTime() * 0.5) * 0.1;
      groupRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.7) * 0.05;
    }
  });

  return (
    <group 
      ref={groupRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Outer circle - mystery theme */}
      <Line
        points={(() => {
          const points = [];
          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(Math.cos(angle) * 2, Math.sin(angle) * 2, 0);
          }
          return points;
        })()}
        color={hovered ? "#818cf8" : "#4f46e5"}
        lineWidth={hovered ? 3 : 1.5}
      />
      
      {/* Inner circles */}
      <Line
        points={(() => {
          const points = [];
          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(Math.cos(angle) * 1.5, Math.sin(angle) * 1.5, 0);
          }
          return points;
        })()}
        color={hovered ? "#818cf8" : "#4338ca"}
        lineWidth={hovered ? 2 : 1}
      />
      
      <Line
        points={(() => {
          const points = [];
          for (let i = 0; i <= 64; i++) {
            const angle = (i / 64) * Math.PI * 2;
            points.push(Math.cos(angle) * 1, Math.sin(angle) * 1, 0);
          }
          return points;
        })()}
        color={hovered ? "#818cf8" : "#3730a3"}
        lineWidth={hovered ? 1.5 : 0.8}
      />
      
      {/* Central triangle - representing the trident (upside down) */}
      <Line
        points={[
          0, -0.8, 0,
          -0.7, 0.4, 0,
          0.7, 0.4, 0,
          0, -0.8, 0
        ]}
        color={hovered ? "#818cf8" : "#6366f1"}
        lineWidth={hovered ? 3 : 1.5}
      />
      
      {/* Bindu - representing the third eye */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshBasicMaterial 
          color={hovered ? "#818cf8" : "#6366f1"} 
          transparent 
          opacity={0.9}
        />
        <pointLight 
          intensity={hovered ? 3 : 1.5} 
          distance={5} 
          color={hovered ? "#818cf8" : "#6366f1"} 
        />
      </mesh>
    </group>
  );
};

// Floating elements - mystery theme
const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-indigo-500/40"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight - 150, Math.random() * window.innerHeight + 150],
            x: [null, Math.random() * window.innerWidth - 150, Math.random() * window.innerWidth + 150],
            rotate: [0, 360],
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 30 + 20}px`,
          }}
        >
          {['👁', '👁‍🗨', '🔮', '🌀', '🌌'][Math.floor(Math.random() * 5)]
}
        </motion.div>
      ))}
    </div>
  );
};

const MysteryLandingPage = () => {
  const [sankalpa, setSankalpa] = useState("");
  const [isEntering, setIsEntering] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [manifestationCount, setManifestationCount] = useState(1247);
  const [energyLevel, setEnergyLevel] = useState(78);
  const [activeElement, setActiveElement] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Apply Mystery theme when component mounts
  useEffect(() => {
    // Add Mystery theme class to body
    document.body.classList.add('theme-mystery');
    
    // Set theme variables
    document.documentElement.style.setProperty('--theme-primary', '240 100% 70%');
    document.documentElement.style.setProperty('--theme-secondary', '240 50% 20%');
    document.documentElement.style.setProperty('--theme-accent', '270 100% 60%');
    
    // Also apply the color scheme classes for consistency
    document.body.classList.add('color-scheme-mystery');
    
    // Cleanup function to remove theme when component unmounts
    return () => {
      document.body.classList.remove('theme-mystery', 'color-scheme-mystery');
      // Reset to default theme values
      document.documentElement.style.setProperty('--theme-primary', '348 83% 47%');
      document.documentElement.style.setProperty('--theme-secondary', '348 22% 25%');
      document.documentElement.style.setProperty('--theme-accent', '348 73% 38%');
    };
  }, []);

  // Smooth parallax effects for different sections
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -50]);
  const featuresY = useTransform(scrollYProgress, [0.1, 0.5], [50, 0]);
  const statsY = useTransform(scrollYProgress, [0.2, 0.6], [50, 0]);
  const testimonialsY = useTransform(scrollYProgress, [0.3, 0.7], [50, 0]);
  const inspirationY = useTransform(scrollYProgress, [0.4, 0.8], [50, 0]);
  const ctaY = useTransform(scrollYProgress, [0.6, 1], [50, 0]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Animated counters
  useEffect(() => {
    const interval = setInterval(() => {
      setManifestationCount((prev) => prev + Math.floor(Math.random() * 7));
      setEnergyLevel((prev) => Math.min(100, prev + Math.floor(Math.random() * 4)));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Rotate through elements
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveElement((prev) => (prev + 1) % 6);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: "The Third Eye Vision 👁",
      description: "Unlock hidden knowledge and inner wisdom through mindful practice. See beyond the veil of illusion to perceive deeper truths.",
      icon: Eye,
      color: "from-indigo-800 to-indigo-900"
    },
    {
      title: "The Cosmic Fire 🔥",
      description: "Ignite your inner fire through disciplined practice. Burn away ignorance and emerge with cosmic clarity.",
      icon: Flame,
      color: "from-blue-700 to-indigo-800"
    },
    {
      title: "The Shield of Protection 🛡️",
      description: "Build an impenetrable shield of divine protection. Ward off negative energies and cultivate inner strength.",
      icon: Shield,
      color: "from-violet-800 to-indigo-900"
    },
    {
      title: "The Wind of Mystery 💨",
      description: "Let the winds of mystery carry you to unknown realms. Embrace the unknown and find magic in the unseen.",
      icon: Wind,
      color: "from-gray-700 to-gray-900"
    },
    {
      title: "The Yantra of Secrets ⚡",
      description: "Channel cosmic energy through sacred geometry. Create powerful yantras for protection, transformation, and spiritual awakening.",
      icon: Compass,
      color: "from-purple-800 to-indigo-900"
    },
    {
      title: "The Divine Blueprint 🏛️",
      description: "Craft your path to cosmic consciousness. Unlock the mysteries of the universe and manifest your highest potential.",
      icon: Crown,
      color: "from-indigo-900 to-black"
    }
  ];

  const testimonials = [
    {
      name: "Mystery Seeker",
      role: "Esoteric Practitioner",
      content: "This platform helped me unlock hidden knowledge. The mystery theme reminds me daily of the infinite possibilities that exist.",
      avatar: "MS",
      practice: "Third Eye Activation"
    },
    {
      name: "Cosmic Traveler",
      role: "Daily Practitioner",
      content: "The dark, cosmic energy of this space transforms my practice. It feels like communing with the universe itself.",
      avatar: "CT",
      practice: "Cosmic Mantra"
    },
    {
      name: "Keeper of Secrets",
      role: "Meditation Master",
      content: "The yantra studio helped me visualize cosmic patterns. This is the real power of transformation.",
      avatar: "KS",
      practice: "Stellar Meditation"
    },
    {
      name: "Awakened Soul",
      role: "Spiritual Warrior",
      content: "Every session feels like a journey to another dimension. I emerge renewed, stronger, and more aligned with cosmic truth.",
      avatar: "AS",
      practice: "Astral Rituals"
    }
  ];

  const stats = [
    { value: manifestationCount, label: "Souls Awakened", icon: Eye },
    { value: energyLevel, label: "Cosmic Power %", icon: Flame },
    { value: 500, label: "Sacred Yantras Created", icon: Compass },
    { value: 98, label: "Enlightenment Rate %", icon: Wind }
  ];

  const elements = [
    { name: "Vision", icon: <Eye className="h-6 w-6" />, color: "from-indigo-700 to-indigo-900" },
    { name: "Transformation", icon: <Flame className="h-6 w-6" />, color: "from-blue-600 to-indigo-800" },
    { name: "Protection", icon: <Shield className="h-6 w-6" />, color: "from-violet-700 to-indigo-900" },
    { name: "Mystery", icon: <EyeOff className="h-6 w-6" />, color: "from-purple-700 to-indigo-900" },
    { name: "Liberation", icon: <Wind className="h-6 w-6" />, color: "from-gray-600 to-black" },
    { name: "Wisdom", icon: <Crown className="h-6 w-6" />, color: "from-indigo-900 to-black" }
  ];

  const handleEnterSpace = () => {
    setIsEntering(true);
    // Simulate transition
    setTimeout(() => {
      // In a real app, this would navigate to the dashboard
      console.log("Entering with sankalpa:", sankalpa);
      setIsEntering(false);
    }, 1000);
  };

  // Refs for scroll-triggered animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const testimonialsRef = useRef(null);
  const inspirationRef = useRef(null);
  const statsRef = useRef(null);
  const ctaRef = useRef(null);

  const isHeroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const isFeaturesInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });
  const isInspirationInView = useInView(inspirationRef, { once: true, margin: "-100px" });
  const isStatsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const isCtaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  // Animation controls
  const heroControls = useAnimation();
  const featuresControls = useAnimation();

  useEffect(() => {
    if (isHeroInView) {
      heroControls.start({ opacity: 1, y: 0 });
    }
  }, [isHeroInView, heroControls]);

  useEffect(() => {
    if (isFeaturesInView) {
      featuresControls.start({ opacity: 1, y: 0 });
    }
  }, [isFeaturesInView, featuresControls]);

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-950 to-black text-white overflow-hidden relative">
      {/* Cosmic Background with Stars and Nebulas */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-indigo-500/30"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.1, 0.5, 0.1],
              y: [0, Math.random() * 20 - 10],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 10 + 5}px`,
            }}
          >
            {['✦', '✧', '✶', '✺'][Math.floor(Math.random() * 4)]
}
          </motion.div>
        ))}
      </div>
      
      {/* Animated cosmic particles */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`cosmic-${i}`}
            className="absolute text-indigo-500/30"
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0
            }}
            animate={{
              y: [null, Math.random() * window.innerHeight - 100],
              x: [null, Math.random() * window.innerWidth - 50, Math.random() * window.innerWidth + 50],
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
            }}
            transition={{
              duration: Math.random() * 8 + 8,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "easeOut"
            }}
            style={{
              fontSize: `${Math.random() * 20 + 10}px`,
            }}
          >
            🔮
          </motion.div>
        ))}
      </div>

      {/* Floating Elements */}
      <FloatingElements />

      {/* Beta banner */}
      <div className="px-2 sm:px-4 pt-2">
        <div className="mx-auto max-w-5xl rounded-lg border border-amber-400/30 bg-amber-500/10 text-amber-200 text-xs sm:text-sm px-3 sm:px-4 py-2 flex items-center justify-center gap-2">
          <span className="inline-block rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] sm:text-xs font-semibold">BETA</span>
          We're in private beta. New registrations are closed — join the waitlist to get early access.
        </div>
      </div>

      {/* Sticky Navigation Bar - Glassy Spiritual Theme with Cosmic Mystery colors */}
      <div 
        className="sticky top-0 left-0 right-0 z-[999999] px-2 sm:px-4 pt-2 sm:pt-4"
        style={{
          pointerEvents: 'auto'
        }}
      >
        <nav 
          className="relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500 hover:shadow-2xl group"
          style={
            {
              background: 'linear-gradient(135deg, rgba(75, 0, 130, 0.08), rgba(75, 0, 130, 0.12), rgba(148, 0, 211, 0.08))',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)',
              border: '1px solid rgba(138, 43, 226, 0.25)',
              boxShadow: '0 8px 32px rgba(75, 0, 130, 0.1), 0 0 0 1px rgba(138, 43, 226, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }
          }
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            style={
              {
                background: 'linear-gradient(45deg, rgba(138, 43, 226, 0.05), transparent, rgba(148, 0, 211, 0.05))'
              }
            }
          />
          
          {/* Floating spiritual particles in navbar - Responsive positioning */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1 sm:top-2 left-8 sm:left-16 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-purple-400/60 rounded-full animate-pulse" />
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
                  style={
                    {
                      filter: 'drop-shadow(0 0 8px rgba(138, 43, 226, 0.3))'
                    }
                  }
                />
                {/* Constant glowing ring around logo */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={
                    {
                      background: 'conic-gradient(from 0deg, rgba(138, 43, 226, 0.3), rgba(148, 0, 211, 0.3), rgba(138, 43, 226, 0.3))',
                      padding: '2px'
                    }
                  }
                >
                  <div className="w-full h-full rounded-full bg-background/20" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-lg sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-fuchsia-300 to-purple-300">
                  Cosmic Mystery
                </span>
                <span className="text-[10px] sm:text-xs text-purple-400/70 font-medium tracking-wider hidden xs:block">
                  🔮 Unlock Hidden Knowledge
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
                  <span className="relative z-10">Enter</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                size="sm"
                className="relative bg-gradient-to-r from-purple-500/80 via-fuchsia-500/80 to-purple-500/80 hover:from-purple-400 hover:via-fuchsia-400 hover:to-purple-400 backdrop-blur-sm border border-purple-400/30 hover:border-purple-400/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group/cta overflow-hidden px-3 sm:px-4 py-2 text-sm"
              >
                <Link to="/waitlist">
                  {/* Animated gradient background */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-fuchsia-400/20 to-purple-400/20 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                  />
                  {/* Floating sparkles - Smaller on mobile */}
                  <div className="absolute top-0.5 sm:top-1 right-1 sm:right-2 w-0.5 sm:w-1 h-0.5 sm:h-1 bg-purple-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
                  <div className="absolute bottom-0.5 sm:bottom-1 left-1 sm:left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-0 group-hover/cta:opacity-100" style={{ animationDelay: '0.5s' }} />
                  
                  <span className="relative z-10 flex items-center">
                    <span className="hidden xs:inline">Join Waitlist</span>
                    <span className="xs:hidden">Waitlist</span>
                    <Eye className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4 group-hover/cta:animate-spin" style={{ animationDuration: '2s' }} />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <div className="space-y-0 relative z-20">
        {/* Hero Section - mystery theme */}
        <motion.section 
          ref={heroRef} 
          className="text-center py-20 md:py-40 relative overflow-hidden"
          style={{ y: heroY }}
        >
          {/* Animated Mandala Background with enhanced cosmic effects */}
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="relative w-full h-full max-w-4xl">
              {[...Array(16)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute inset-0 border border-indigo-700/40 rounded-full"
                  style={{
                    transform: `rotate(${i * 22.5}deg)`,
                  }}
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.5, 0.2],
                    rotate: [i * 22.5, i * 22.5 + 10, i * 22.5],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>
          
          {/* Floating cosmic particles in hero section */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={`hero-cosmic-${i}`}
                className="absolute text-indigo-500/40"
                initial={{ 
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0
                }}
                animate={{
                  y: [null, Math.random() * window.innerHeight - 100],
                  x: [null, Math.random() * window.innerWidth - 50, Math.random() * window.innerWidth + 50],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5, 0.5],
                }}
                transition={{
                  duration: Math.random() * 6 + 6,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                  ease: "easeOut"
                }}
                style={{
                  fontSize: `${Math.random() * 15 + 10}px`,
                }}
              >
                🔮
              </motion.div>
            ))}
          </div>
          
          <div className="relative z-10 max-w-6xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 text-indigo-300 mb-6 border border-indigo-700/40">
                <Eye className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium">Unlock Cosmic Secrets</span>
              </div>
              
              <motion.h1 
                className="text-5xl md:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300"
                animate={{
                  textShadow: [
                    '0 0 10px rgba(129, 140, 248, 0.5)',
                    '0 0 20px rgba(129, 140, 248, 0.8)',
                    '0 0 10px rgba(129, 140, 248, 0.5)'
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                COSMIC
                <br />
                <span className="block mt-2">MYSTERY</span>
              </motion.h1>
              
              <p className="text-xl md:text-3xl text-indigo-100 mb-16 max-w-4xl mx-auto leading-relaxed">
                The ultimate cosmic journey where hidden knowledge awakens. 
                <br />
                <span className="text-indigo-300">Transform through cosmic wisdom. Unlock universal secrets.</span>
              </p>
            </motion.div>

            {/* Interactive Sankalpa Input with Enhanced Design */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="max-w-3xl mx-auto"
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-3xl p-10 border border-indigo-800/50 shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/20 to-black/30"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <Eye className="h-6 w-6 text-indigo-400" />
                    <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">
                      Declare Your Cosmic Intent
                    </h2>
                  </div>
                  <p className="text-lg text-indigo-200 mb-6">
                    Join the waitlist to get early access to this cosmic experience.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      size="lg"
                      className="bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-black h-16 px-10 text-xl group shadow-2xl shadow-indigo-900/40 border border-indigo-700"
                      asChild
                    >
                      <Link to="/waitlist">
                        Join the Waitlist
                        <ChevronRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section 
          ref={statsRef} 
          className="py-16 container mx-auto px-4"
          style={{ y: statsY }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="backdrop-blur-md bg-black/50 p-6 rounded-2xl border border-indigo-800/40 text-center hover:border-indigo-500/40 transition-all duration-300"
                >
                  <Icon className="h-10 w-10 text-indigo-400 mx-auto mb-4" />
                  <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                    {stat.value}{index === 1 ? '%' : ''}
                  </div>
                  <div className="text-sm text-indigo-200">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Features Section - mystery theme */}
        <motion.section 
          ref={featuresRef} 
          className="py-20 container mx-auto px-4 relative"
          style={{ y: featuresY }}
        >
          <div className="text-center mb-20">
            <motion.h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">
                Tools of Cosmic Wisdom
              </span>
            </motion.h2>
            <motion.p 
              className="text-xl text-indigo-200 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Powerful instruments for cosmic awakening and universal understanding
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                  whileHover={{ y: -10 }}
                  className="h-full"
                >
                  <Card className="backdrop-blur-md bg-black/50 border border-indigo-800/40 hover:border-indigo-500/40 hover:bg-black/60 transition-all duration-500 h-full group overflow-hidden relative">
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`}></div>
                    <CardHeader>
                      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform mx-auto`}>
                        <Icon className="h-10 w-10 text-indigo-300" />
                      </div>
                      <CardTitle className="text-2xl text-center text-indigo-100 group-hover:text-indigo-300 transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-indigo-200/90 text-center">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Sadhana Paper Section - Cosmic Theme */}
        <section className="py-16 container mx-auto px-4 relative overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
              {/* Left Side - Cosmic Content */}
              <div className="lg:col-span-8 space-y-6 sm:space-y-8">
                <div className="text-center lg:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">
                    Embark on Your Cosmic Journey
                  </h2>
                  <p className="text-lg text-indigo-200 mb-6 max-w-3xl mx-auto leading-relaxed">
                    Unlock the mysteries of the universe through mindful practice and cosmic awareness.
                  </p>
                  <p className="text-indigo-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                    Join thousands of seekers who have found their cosmic home in our integrated practice platform.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-black px-8 py-6 text-lg shadow-lg hover:shadow-2xl transition-all duration-300"
                      asChild
                    >
                      <Link to="/signup">
                        <Sparkles className="w-6 h-6 mr-3" />
                        Begin Your Practice
                      </Link>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-indigo-500/40 text-lg px-8 py-6 hover:bg-indigo-500/10 backdrop-blur-sm transition-all duration-300"
                      asChild
                    >
                      <Link to="/library">
                        <BookOpen className="w-6 h-6 mr-3" />
                        Explore Library
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Right Side - Cosmic Sadhana Paper (Transparent Cosmic Metallic) */}
              <div className="lg:col-span-4 relative">
                <div className="relative max-w-xl mx-auto lg:mx-0">
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
          </div>
        </section>

        {/* Testimonials with Auto-Rotation */}
        <motion.section 
          ref={testimonialsRef} 
          className="py-20 relative"
          style={{ y: testimonialsY }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/30 to-black/30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="text-center mb-16">
              <motion.h2 
                className="text-4xl md:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">
                  Voices from the Cosmos
                </span>
              </motion.h2>
              <motion.p 
                className="text-xl text-indigo-200 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={isTestimonialsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Hear from those who have walked the path of cosmic awakening
              </motion.p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative h-96">
                {testimonials.map((testimonial, index) => (
                  <motion.div
                    key={index}
                    className={`absolute inset-0 ${index === activeTestimonial ? 'z-10' : 'z-0'}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: index === activeTestimonial ? 1 : 0,
                      scale: index === activeTestimonial ? 1 : 0.9,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="backdrop-blur-md bg-black/60 border border-indigo-800/50 h-full flex flex-col">
                      <CardContent className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-indigo-700 to-indigo-900 mr-4 flex items-center justify-center text-lg font-bold">
                            {testimonial.avatar}
                          </div>
                          <div>
                            <p className="font-bold text-xl text-white">{testimonial.name}</p>
                            <p className="text-sm text-indigo-300">{testimonial.role}</p>
                            <p className="text-xs text-indigo-300 mt-1">{testimonial.practice}</p>
                          </div>
                        </div>
                        <div className="flex-grow flex items-center">
                          <p className="text-indigo-100/90 text-xl italic text-center">
                            "{testimonial.content}"
                          </p>
                        </div>
                        <div className="flex justify-center mt-6 space-x-2">
                          {testimonials.map((_, dotIndex) => (
                            <button
                              key={dotIndex}
                              className={`w-3 h-3 rounded-full transition-all ${
                                dotIndex === activeTestimonial
                                  ? "bg-indigo-500 scale-125"
                                  : "bg-indigo-700/50"
                              }`}
                              onClick={() => setActiveTestimonial(dotIndex)}
                            />
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Inspiration / "Why" Section - mystery theme */}
        <motion.section 
          ref={inspirationRef} 
          className="py-20 container mx-auto px-4"
          style={{ y: inspirationY }}
        >
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isInspirationInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 text-indigo-300 mb-6 border border-indigo-700/40">
                  <Eye className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm font-medium">Cosmic Origins</span>
                </div>
                
                <h2 className="text-4xl md:text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">
                  The Cosmic Mystery
                </h2>
                
                <div className="space-y-6 text-indigo-100/90 text-lg">
                  <p>
                    In the vast cosmic expanse where all mysteries unfold, we found our truest path to universal understanding. 
                    Inspired by the infinite cosmos, we created this space for those ready to unlock hidden knowledge.
                  </p>
                  <p>
                    Our platform combines ancient esoteric wisdom with modern technology to create a truly transformative experience. 
                    Every feature is designed to help you cut through illusion and embrace cosmic truth.
                  </p>
                  <p className="text-indigo-300 font-medium">
                    "Knowledge is not an end, but a beginning. Unlock what binds you, and rise as your true cosmic self."
                  </p>
                </div>
                
                <div className="mt-10 flex flex-wrap gap-4">
                  <Button className="bg-gradient-to-r from-indigo-700 to-indigo-900 hover:from-indigo-800 hover:to-black px-8 py-6 text-lg rounded-xl border border-indigo-700">
                    <Eye className="mr-2 h-5 w-5 text-indigo-300" />
                    Unlock Secrets
                  </Button>
                  <Button variant="outline" className="border-indigo-700/50 text-indigo-200 hover:bg-indigo-900/30 px-8 py-6 text-lg rounded-xl">
                    <BookOpen className="mr-2 h-5 w-5 text-indigo-300" />
                    Ancient Wisdom
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isInspirationInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                {/* Enhanced Yantra Visualization */}
                <div className="relative bg-gradient-to-br from-indigo-900/50 to-black/50 rounded-3xl p-12 border border-indigo-800/50 backdrop-blur-xl overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/30 via-transparent to-transparent"></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-center mb-8">
                      <Eye className="h-12 w-12 text-indigo-400" />
                    </div>
                    
                    <h3 className="text-3xl font-bold text-center text-indigo-200 mb-2">Sacred Geometry of the Cosmos</h3>
                    <p className="text-indigo-100/80 text-center mb-12">The Divine Blueprint of Universal Understanding</p>
                    
                    {/* Interactive 3D Yantra */}
                    <div className="flex justify-center">
                      <div className="w-80 h-80">
                        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
                          <ambientLight intensity={0.7} />
                          <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
                          <InteractiveYantra />
                          <OrbitControls 
                            enableZoom={true}
                            enablePan={false}
                            maxDistance={7}
                            minDistance={3}
                          />
                        </Canvas>
                      </div>
                    </div>
                    
                    {/* Element selector */}
                    <div className="flex justify-center mt-8 space-x-4">
                      {elements.map((element, index) => (
                        <motion.div
                          key={index}
                          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer ${
                            activeElement === index 
                              ? `bg-gradient-to-r ${element.color} shadow-lg border border-indigo-500/50` 
                              : 'bg-black/50 border border-indigo-700/50'
                          }`}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setActiveElement(index)}
                        >
                          {element.icon}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Theme Changing Section - Removed as per requirements */}
        {/* This section has been removed from landing pages as per project specifications */}

        {/* Final CTA Section - mystery theme */}
        <motion.section 
          ref={ctaRef} 
          className="py-32 text-center relative overflow-hidden"
          style={{ y: ctaY }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/40 via-black/30 to-black/50 backdrop-blur-sm"></div>
          
          {/* Enhanced Animated Background Elements with cosmic effects */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-indigo-500/50"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 20 + 10}px`,
                }}
                animate={{
                  y: [0, -200, -400],
                  opacity: [0, 1, 0],
                  x: [0, (Math.random() - 0.5) * 150],
                  scale: [0.5, 1.5, 0.5],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: Math.random() * 8 + 8,
                  repeat: Infinity,
                  delay: Math.random() * 8,
                }}
              >
                {['🔮', '👁', '🌌'][Math.floor(Math.random() * 3)]
}
              </motion.div>
            ))}
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isCtaInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-900/30 text-indigo-300 mb-8 border border-indigo-700/40 mx-auto">
                <Eye className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-medium">Begin Your Cosmic Journey</span>
              </div>
              
              <h2 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-purple-300 to-indigo-300">
                Enter the Cosmic Mystery
              </h2>
              
              <p className="text-2xl md:text-3xl text-indigo-200 mb-16 max-w-3xl mx-auto leading-relaxed">
                Join the circle of cosmic seekers. 
                <br />
                <span className="text-indigo-300">Unlock hidden knowledge. Embrace universal truth.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(79, 70, 229, 0.5)',
                      '0 0 30px rgba(129, 140, 248, 0.8)',
                      '0 0 20px rgba(79, 70, 229, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-black hover:from-indigo-800 hover:via-indigo-900 hover:to-black text-2xl px-16 py-10 backdrop-blur-sm shadow-2xl shadow-indigo-900/50 rounded-2xl border border-indigo-700"
                    asChild
                  >
                    <Link to="/waitlist">
                      Join the Waitlist
                      <ChevronRight className="ml-3 h-8 w-8" />
                    </Link>
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    borderColor: [
                      'rgba(67, 56, 202, 0.5)',
                      'rgba(129, 140, 248, 0.8)',
                      'rgba(67, 56, 202, 0.5)'
                    ]
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="border-indigo-700/50 text-indigo-200 hover:bg-indigo-900/30 text-2xl px-16 py-10 backdrop-blur-sm rounded-2xl border-2"
                    asChild
                  >
                    <Link to="/your-atma-yantra" className="flex items-center">
                      <Eye className="mr-3 h-8 w-8 text-indigo-400" />
                      Explore Features
                    </Link>
                  </Button>
                </motion.div>
              </div>
              
              <div className="flex items-center justify-center gap-4 text-indigo-300/80">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span>Free Forever</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-indigo-700/50"></div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-indigo-400" />
                  <span>Cosmic Power</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-indigo-700/50"></div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-indigo-400" />
                  <span>Sacred Community</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer - mystery theme */}
        <footer className="backdrop-blur-md bg-black/60 border-t border-indigo-800/30">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-700 to-indigo-900 flex items-center justify-center">
                  <Eye className="h-5 w-5 text-indigo-300" />
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                  Cosmic Mystery
                </span>
              </div>
              <div className="flex space-x-6 text-sm text-indigo-300/80">
                <Link to="/about" className="hover:text-indigo-200 transition-colors">
                  About
                </Link>
                <a href="#" className="hover:text-indigo-200 transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-indigo-200 transition-colors">
                  Terms
                </a>
              </div>
            </div>
            <div className="mt-8 text-center text-sm text-indigo-300/70">
              © {new Date().getFullYear()} Cosmic Mystery. All rights reserved. A sacred space for cosmic seekers.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default MysteryLandingPage;