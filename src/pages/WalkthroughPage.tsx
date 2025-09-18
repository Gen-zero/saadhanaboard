import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  BookOpen, 
  Target, 
  Calendar,
  Heart,
  Users,
  Play,
  X,
  ArrowLeft,
  ArrowRight,
  CheckSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/hooks/useSettings';

// Define walkthrough steps
const WALKTHROUGH_STEPS = [
  {
    title: "Your Spiritual Dashboard",
    description: "Track your daily practices, monitor progress, and stay connected with your spiritual goals",
    icon: BookOpen,
    color: "from-purple-500 to-fuchsia-500",
    features: [
      "Daily practice tracking",
      "Progress visualization",
      "Streak maintenance",
      "Goal monitoring"
    ]
  },
  {
    title: "Create Sacred Commitments",
    description: "Design personalized spiritual practices with divine intentions and sacred commitments",
    icon: Heart,
    color: "from-fuchsia-500 to-pink-500",
    features: [
      "Custom sadhana creation",
      "Divine focus selection",
      "Duration planning",
      "Sacred paper generation"
    ]
  },
  {
    title: "Community & Growth",
    description: "Connect with fellow practitioners and track your spiritual evolution",
    icon: Users,
    color: "from-indigo-500 to-purple-500",
    features: [
      "Spiritual level progression",
      "Community sharing",
      "Achievement badges",
      "Reflection journaling"
    ]
  }
];

const WalkthroughPage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const [currentStep, setCurrentStep] = useState(0);
  
  const nextStep = () => {
    if (currentStep < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    // Mark walkthrough as complete in localStorage
    localStorage.setItem('walkthroughComplete', 'true');
    navigate('/dashboard');
  };

  const handleComplete = () => {
    // Mark walkthrough as complete in localStorage
    localStorage.setItem('walkthroughComplete', 'true');
    navigate('/dashboard');
  };

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  const currentStepData = WALKTHROUGH_STEPS[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div className="min-h-screen cosmic-nebula-bg flex items-center justify-center p-4">
      {/* Cosmic particles animation - hidden for Shiva theme */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none ${isShivaTheme ? 'hidden' : ''}`}>
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60 cosmic-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <Card className="w-full max-w-2xl bg-background/80 backdrop-blur-sm border border-purple-500/20 shadow-2xl">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/750cc9ea-fdb3-49ae-9a42-504d1a30ef4e.png" 
              alt="Saadhana Board Logo" 
              className="h-12 w-12" 
            />
            <Sparkles className="ml-2 h-6 w-6 text-purple-500 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-2">
            Welcome to Saadhana Yantra
          </CardTitle>
          <p className="text-muted-foreground text-lg">
            Let's explore the features that will enhance your spiritual journey
          </p>
          
          {/* Step indicator */}
          <div className="flex items-center justify-center space-x-2 mt-6">
            {WALKTHROUGH_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  i <= currentStep 
                    ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 scale-110' 
                    : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="text-center space-y-6"
            >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${currentStepData.color} mb-6`}>
                <IconComponent className="w-10 h-10 text-white" />
              </div>

              <div>
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-4">
                  {currentStepData.title}
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  {currentStepData.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentStepData.features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Badge 
                      variant="secondary" 
                      className="p-3 text-sm bg-purple-500/10 border border-purple-500/20 hover:bg-purple-500/20 transition-colors"
                    >
                      <CheckSquare className="w-4 h-4 mr-2 text-purple-400" />
                      {feature}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between items-center pt-6">
            {currentStep > 0 ? (
              <Button
                variant="outline"
                onClick={prevStep}
                className="border-purple-500/30 hover:border-purple-500/50"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
            ) : (
              <div></div>
            )}

            <div className="flex gap-3">
              <Button
                variant="ghost"
                onClick={handleSkip}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip Tour
              </Button>
              
              {currentStep < WALKTHROUGH_STEPS.length - 1 ? (
                <Button
                  onClick={nextStep}
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleComplete}
                  className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600"
                >
                  Start Journey
                  <Play className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalkthroughPage;