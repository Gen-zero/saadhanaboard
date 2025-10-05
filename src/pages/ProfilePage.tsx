import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit, 
  Share2, 
  Flame, 
  Award, 
  TrendingUp, 
  Heart, 
  Users, 
  Zap,
  Star,
  Target,
  Calendar,
  Medal,
  Crown,
  Leaf,
  Moon,
  Sun,
  Sparkles,
  Compass,
  BookOpen,
  Clock,
  Activity,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  RadialBarChart, RadialBar, BarChart, Bar, AreaChart, Area, Label
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';

// Types for our profile data
interface Achievement {
  id: number;
  name: string;
  description: string;
  earned: string;
  icon: JSX.Element;
}

interface SadhanaData {
  day: string;
  duration: number;
}

interface DeityData {
  name: string;
  value: number;
}

interface EnergyBalance {
  sattva: number;
  rajas: number;
  tamas: number;
}

interface ChakraData {
  name: string;
  value: number;
  color: string;
}

interface WeeklyProgress {
  day: string;
  progress: number;
}

interface ProfileData {
  name: string;
  title: string;
  status: 'online' | 'offline';
  avatar: string;
  favoriteDeity: string;
  xp: number;
  level: number;
  karmaBalance: number;
  tier: string;
  sankalpaProgress: number;
  dailyStreak: number;
  achievements: Achievement[];
  sadhanaDurationData: SadhanaData[];
  deityConnectionData: DeityData[];
  energyBalance: EnergyBalance;
  bio: string;
  varna: string;
  gotra: string;
  sampradaya: string;
  experienceLevel: string;
  favoriteMantra: string;
  rank: number;
  percentile: number;
  followers: number;
  following: number;
  titles: string[];
  weeklyProgress: WeeklyProgress[];
  chakraBalance: ChakraData[];
}

// Mock data for the profile
const mockProfileData: ProfileData = {
  name: "Divine Seeker",
  title: "Practitioner of Light",
  status: "online",
  avatar: "/lovable-uploads/sadhanaboard_logo.png",
  favoriteDeity: "Ganesha",
  xp: 2450,
  level: 7,
  karmaBalance: 1250,
  tier: "Practitioner",
  sankalpaProgress: 75,
  dailyStreak: 28,
  achievements: [
    { id: 1, name: "First Steps", description: "Completed your first sadhana", earned: "2024-01-15", icon: <Leaf className="h-5 w-5" /> },
    { id: 2, name: "Consistency Master", description: "7-day streak achieved", earned: "2024-02-01", icon: <Flame className="h-5 w-5" /> },
    { id: 3, name: "Mindful Warrior", description: "Completed 50 sadhanas", earned: "2024-03-10", icon: <Medal className="h-5 w-5" /> },
    { id: 4, name: "Energy Balancer", description: "Balanced all chakras", earned: "2024-04-05", icon: <Zap className="h-5 w-5" /> },
    { id: 5, name: "Sankalpa Keeper", description: "Maintained intention for 30 days", earned: "2024-05-12", icon: <Target className="h-5 w-5" /> },
    { id: 6, name: "Community Builder", description: "Shared 10 practices", earned: "2024-06-18", icon: <Users className="h-5 w-5" /> },
  ],
  sadhanaDurationData: [
    { day: 'Mon', duration: 45 },
    { day: 'Tue', duration: 60 },
    { day: 'Wed', duration: 30 },
    { day: 'Thu', duration: 75 },
    { day: 'Fri', duration: 50 },
    { day: 'Sat', duration: 90 },
    { day: 'Sun', duration: 40 },
  ],
  deityConnectionData: [
    { name: 'Ganesha', value: 35 },
    { name: 'Krishna', value: 25 },
    { name: 'Shiva', value: 20 },
    { name: 'Durga', value: 15 },
    { name: 'Vishnu', value: 5 },
  ],
  energyBalance: {
    sattva: 70,
    rajas: 20,
    tamas: 10,
  },
  bio: "Walking the path of light, seeking truth through daily practice and mindful awareness. Believer in the power of sankalpa and the transformative energy of devotion.",
  varna: "Brahmin",
  gotra: "Kashyapa",
  sampradaya: "Vaishnava",
  experienceLevel: "Intermediate",
  favoriteMantra: "Om Gam Ganapataye Namaha",
  rank: 1247,
  percentile: 87,
  followers: 342,
  following: 128,
  titles: ["Sankalpa Keeper", "Seeker of Light", "Mindful Warrior"],
  weeklyProgress: [
    { day: 'Mon', progress: 80 },
    { day: 'Tue', progress: 95 },
    { day: 'Wed', progress: 60 },
    { day: 'Thu', progress: 100 },
    { day: 'Fri', progress: 75 },
    { day: 'Sat', progress: 110 },
    { day: 'Sun', progress: 90 },
  ],
  chakraBalance: [
    { name: 'Root', value: 85, color: '#ef4444' },
    { name: 'Sacral', value: 78, color: '#f97316' },
    { name: 'Solar', value: 92, color: '#eab308' },
    { name: 'Heart', value: 88, color: '#22c55e' },
    { name: 'Throat', value: 75, color: '#06b6d4' },
    { name: 'Third Eye', value: 82, color: '#8b5cf6' },
    { name: 'Crown', value: 90, color: '#ec4899' },
  ]
};

const COLORS = ['#8b5cf6', '#a855f7', '#c084fc', '#d8b4fe', '#ede9fe'];
const ENERGY_COLORS = ['#10b981', '#f59e0b', '#ef4444'];
const CHAKRA_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#8b5cf6', '#ec4899'];

// Floating particle component for background
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    className="absolute rounded-full bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20"
    style={{
      width: `${Math.random() * 30 + 10}px`,
      height: `${Math.random() * 30 + 10}px`,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
    }}
    animate={{
      y: [0, -(Math.random() * 100 + 50), 0],
      x: [0, (Math.random() - 0.5) * 100, 0],
      rotate: [0, 360],
      scale: [1, Math.random() + 0.5, 1],
    }}
    transition={{
      duration: 15 + Math.random() * 10,
      repeat: Infinity,
      ease: "easeInOut",
      delay,
    }}
  />
);

// Animated number counter
const AnimatedNumber = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count}</span>;
};

// Skeleton loader for cards
const CardSkeleton = () => (
  <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl">
    <CardHeader>
      <Skeleton className="h-6 w-32 bg-purple-500/20" />
      <Skeleton className="h-4 w-48 bg-purple-500/20 mt-2" />
    </CardHeader>
    <CardContent>
      <Skeleton className="h-32 w-full bg-purple-500/20 rounded-xl" />
    </CardContent>
  </Card>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

const ProfilePage = () => {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Simulate data fetching
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // In a real app, this would be an actual API call:
        // const response = await fetch('/api/profile');
        // const data = await response.json();
        // setProfileData(data);
        
        setProfileData(mockProfileData);
        setError(null);
      } catch (err) {
        setError('Failed to load profile data. Please try again later.');
        console.error('Error fetching profile data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
    // In a real app, this would open an edit modal or navigate to edit page
    toast({
      title: "Edit Profile",
      description: "Profile editing functionality would be implemented here.",
    });
    
    // Reset after a short delay for demo purposes
    setTimeout(() => setIsEditing(false), 2000);
  };

  const handleRetry = () => {
    setError(null);
    setIsLoading(true);
    
    // Simulate retry
    setTimeout(() => {
      setProfileData(mockProfileData);
      setIsLoading(false);
    }, 1000);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 p-4 md:p-8 flex items-center justify-center">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-300">
              <AlertCircle className="h-5 w-5" />
              Error Loading Profile
            </CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button onClick={handleRetry} className="bg-gradient-to-r from-purple-600 to-fuchsia-500 hover:from-purple-700 hover:to-fuchsia-600">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 p-4 md:p-8 relative overflow-hidden">
        {/* Floating particles background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          {[...Array(15)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.2} />
          ))}
        </div>
        
        <div className="max-w-screen-2xl mx-auto relative z-10">
          <div className="animate-pulse space-y-6">
            {/* Header skeleton */}
            <div className="h-64 rounded-2xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 backdrop-blur-xl"></div>
            
            {/* Stats skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 backdrop-blur-xl"></div>
              ))}
            </div>
            
            {/* Charts skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CardSkeleton />
              <CardSkeleton />
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="h-96 rounded-2xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 backdrop-blur-xl lg:col-span-2"></div>
              <div className="h-96 rounded-2xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 backdrop-blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-purple-900/20 to-fuchsia-900/20 p-4 md:p-8 relative overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Floating particles background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} delay={i * 0.2} />
        ))}
      </div>

      <div className="max-w-screen-2xl mx-auto relative z-10">
        {/* Profile Header Card */}
        <motion.div variants={itemVariants}>
          <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-fuchsia-400 rounded-full blur-xl opacity-70 animate-pulse"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-300 to-fuchsia-300 rounded-full blur-lg opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                    <img 
                      src={profileData.avatar} 
                      alt={profileData.name} 
                      className="relative h-24 w-24 md:h-32 md:w-32 rounded-full border-4 border-white/30 object-cover shadow-2xl"
                    />
                  </motion.div>
                  <div className={`absolute bottom-0 right-0 h-4 w-4 md:h-5 md:w-5 rounded-full border-2 border-white ${
                    profileData.status === 'online' ? 'bg-green-500' : 'bg-gray-500'
                  }`}></div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">{profileData.name}</h1>
                  <p className="text-purple-100 mt-1 text-lg">{profileData.title}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                    <Star className="h-4 w-4 text-yellow-300" />
                    <span className="text-purple-100">Favorite Deity: {profileData.favoriteDeity}</span>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Button 
                      variant="secondary" 
                      className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
                      onClick={handleEditProfile}
                      disabled={isEditing}
                    >
                      {isEditing ? (
                        <>
                          <span className="h-4 w-4 mr-2 animate-spin">⏳</span>
                          Editing...
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.div 
                  className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer relative overflow-hidden"
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-2xl font-bold text-purple-300">
                      <AnimatedNumber value={profileData.xp} />
                    </div>
                    <div className="text-sm text-purple-100">Experience</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer relative overflow-hidden"
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-2xl font-bold text-purple-300">Level {profileData.level}</div>
                    <div className="text-sm text-purple-100">Current Level</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer relative overflow-hidden"
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-2xl font-bold text-purple-300">
                      <AnimatedNumber value={profileData.karmaBalance} />
                    </div>
                    <div className="text-sm text-purple-100">Karma Balance</div>
                  </div>
                </motion.div>
                <motion.div 
                  className="text-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer relative overflow-hidden"
                  whileHover={{ y: -8, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative z-10">
                    <div className="text-2xl font-bold text-purple-300">{profileData.tier}</div>
                    <div className="text-sm text-purple-100">Tier</div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats and Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Sankalpa Progress */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple-300" />
                  Sankalpa Progress
                </CardTitle>
                <CardDescription>Your intention commitment journey</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <RadialBarChart 
                    width={250} 
                    height={250} 
                    innerRadius="70%" 
                    outerRadius="100%" 
                    barSize={12}
                    data={[{ name: 'Progress', value: profileData.sankalpaProgress }]}
                    startAngle={180} 
                    endAngle={0}
                  >
                    <RadialBar
                      background
                      dataKey="value"
                      cornerRadius={10}
                      fill="url(#gradient)"
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                            return (
                              <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                                <tspan x={viewBox.cx} y={viewBox.cy} className="fill-white text-3xl font-bold">
                                  {profileData.sankalpaProgress}%
                                </tspan>
                                <tspan x={viewBox.cx} y={viewBox.cy + 20} className="fill-purple-200 text-sm">
                                  Completed
                                </tspan>
                              </text>
                            );
                          }
                          return null;
                        }}
                      />
                    </RadialBar>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                    <circle cx={125} cy={125} r={90} fill="transparent" stroke="#7c3aed" strokeWidth={2} />
                  </RadialBarChart>
                </motion.div>
                <motion.div 
                  className="mt-4 text-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-lg font-semibold text-purple-300 flex items-center justify-center gap-2">
                    <Flame className="h-5 w-5 text-orange-400" />
                    Daily Streak
                  </div>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    >
                      <Flame className="h-5 w-5 text-orange-400" />
                    </motion.div>
                    <span className="text-2xl font-bold text-orange-300">{profileData.dailyStreak} days</span>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-300" />
                  Achievements
                </CardTitle>
                <CardDescription>Badges earned on your spiritual journey</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {profileData.achievements.map((achievement, index) => (
                    <motion.div
                      key={achievement.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -10, scale: 1.05, zIndex: 10 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-all cursor-pointer relative overflow-hidden group"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      <div className="relative z-10">
                        <motion.div 
                          className="p-3 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 mb-3 shadow-lg"
                          whileHover={{ rotate: 10, scale: 1.1 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {achievement.icon}
                        </motion.div>
                        <h3 className="font-semibold text-sm text-center text-purple-100 group-hover:text-white transition-colors duration-300">{achievement.name}</h3>
                        <p className="text-xs text-purple-300 text-center mt-1 group-hover:text-purple-200 transition-colors duration-300">{achievement.earned}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Sadhana Duration Chart */}
          <motion.div variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-300" />
                  Sadhana Duration
                </CardTitle>
                <CardDescription>Minutes per day over the last week</CardDescription>
              </CardHeader>
              <CardContent className="p-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={profileData.sadhanaDurationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#7c3aed" strokeOpacity={0.3} />
                    <XAxis dataKey="day" stroke="#c084fc" />
                    <YAxis stroke="#c084fc" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(124, 58, 237, 0.2)', 
                        borderColor: '#7c3aed',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0.75rem'
                      }} 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="duration" 
                      stroke="#a855f7" 
                      fill="url(#areaGradient)"
                      strokeWidth={2}
                      activeDot={{ r: 8, fill: '#c084fc' }}
                    />
                    <defs>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weekly Progress Chart */}
          <motion.div variants={itemVariants}
            whileHover={{ y: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-purple-300" />
                  Weekly Progress
                </CardTitle>
                <CardDescription>Your sadhana consistency over the week</CardDescription>
              </CardHeader>
              <CardContent className="p-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={profileData.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#7c3aed" strokeOpacity={0.3} />
                    <XAxis dataKey="day" stroke="#c084fc" />
                    <YAxis stroke="#c084fc" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(124, 58, 237, 0.2)', 
                        borderColor: '#7c3aed',
                        backdropFilter: 'blur(10px)',
                        borderRadius: '0.75rem'
                      }} 
                    />
                    <Bar 
                      dataKey="progress" 
                      fill="url(#barGradient)"
                      radius={[4, 4, 0, 0]}
                      activeBar={{ fill: 'url(#barGradient)', stroke: '#c084fc', strokeWidth: 2 }}
                    >
                      {profileData.weeklyProgress.map((entry, index) => (
                        <motion.rect
                          key={`rect-${index}`}
                          initial={{ height: 0 }}
                          animate={{ height: '100%' }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        />
                      ))}
                    </Bar>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" />
                        <stop offset="95%" stopColor="#d946ef" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Additional Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Chakra Balance */}
          <motion.div variants={itemVariants}>
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-purple-300" />
                  Chakra Balance
                </CardTitle>
                <CardDescription>Your energy center alignment</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {profileData.chakraBalance.map((chakra, index) => (
                    <motion.div 
                      key={chakra.name}
                      initial={{ width: 0 }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 0.8, delay: index * 0.1 }}
                      className="flex items-center gap-3 group"
                      whileHover={{ x: 5 }}
                    >
                      <div className="w-20 text-sm text-purple-200 font-medium">{chakra.name}</div>
                      <div className="flex-1 h-3 bg-purple-900/50 rounded-full overflow-hidden relative">
                        <motion.div 
                          className="h-full rounded-full"
                          style={{ backgroundColor: chakra.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${chakra.value}%` }}
                          transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                          whileHover={{ scaleY: 1.2 }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center text-xs text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {chakra.value}%
                        </div>
                      </div>
                      <div className="w-10 text-sm text-purple-200 font-medium">{chakra.value}%</div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bio & Spiritual Details */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600/10 to-fuchsia-500/10 border border-purple-500/20 rounded-2xl shadow-xl h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-purple-300" />
                  Spiritual Journey
                </CardTitle>
                <CardDescription>About your path and practices</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-purple-100 mb-2 flex items-center gap-2">
                      <Leaf className="h-5 w-5 text-purple-300" />
                      Biography
                    </h3>
                    <motion.p 
                      className="text-purple-200 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
                    >
                      {profileData.bio}
                    </motion.p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-purple-100 mb-3 flex items-center gap-2">
                      <Compass className="h-5 w-5 text-purple-300" />
                      Spiritual Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div 
                        className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 relative overflow-hidden"
                        whileHover={{ scale: 1.02, y: -3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="text-sm text-purple-300 flex items-center gap-1">
                            <Crown className="h-4 w-4" />
                            Varna
                          </div>
                          <div className="font-medium text-purple-100">{profileData.varna}</div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 relative overflow-hidden"
                        whileHover={{ scale: 1.02, y: -3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="text-sm text-purple-300 flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            Gotra
                          </div>
                          <div className="font-medium text-purple-100">{profileData.gotra}</div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 relative overflow-hidden"
                        whileHover={{ scale: 1.02, y: -3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="text-sm text-purple-300 flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            Sampradaya
                          </div>
                          <div className="font-medium text-purple-100">{profileData.sampradaya}</div>
                        </div>
                      </motion.div>
                      <motion.div 
                        className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 relative overflow-hidden"
                        whileHover={{ scale: 1.02, y: -3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-fuchsia-500/5 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative z-10">
                          <div className="text-sm text-purple-300 flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            Experience Level
                          </div>
                          <div className="font-medium text-purple-100">{profileData.experienceLevel}</div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-purple-100 mb-2 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-300" />
                      Favorite Mantra
                    </h3>
                    <motion.div 
                      className="p-4 rounded-xl bg-gradient-to-r from-purple-600/20 to-fuchsia-500/20 border border-purple-500/30 relative overflow-hidden"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <p className="text-lg font-sans text-purple-100 italic text-center">"{profileData.favoriteMantra}"</p>
                        <div className="flex justify-center mt-2">
                          <motion.button
                            className="text-xs text-purple-300 hover:text-white flex items-center gap-1"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Copy className="h-3 w-3" />
                            Copy Mantra
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Community Metrics */}
        {/* Removed as per user request */}
      </div>
    </motion.div>
  );
};

export default ProfilePage;