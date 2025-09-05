import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useOnboarding } from '@/hooks/useOnboarding';
import { User, Calendar, Clock, MapPin, Heart, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEITIES = [
  { value: 'shiva', label: 'Lord Shiva', emoji: '🔱' },
  { value: 'vishnu', label: 'Lord Vishnu', emoji: '🌀' },
  { value: 'krishna', label: 'Lord Krishna', emoji: '🪶' },
  { value: 'rama', label: 'Lord Rama', emoji: '🏹' },
  { value: 'ganesha', label: 'Lord Ganesha', emoji: '🐘' },
  { value: 'hanuman', label: 'Lord Hanuman', emoji: '🙏' },
  { value: 'durga', label: 'Goddess Durga', emoji: '🦁' },
  { value: 'lakshmi', label: 'Goddess Lakshmi', emoji: '🪷' },
  { value: 'saraswati', label: 'Goddess Saraswati', emoji: '🎵' },
  { value: 'kali', label: 'Goddess Kali', emoji: '⚔️' },
  { value: 'parvati', label: 'Goddess Parvati', emoji: '🏔️' },
  { value: 'brahma', label: 'Lord Brahma', emoji: '🌸' },
  { value: 'other', label: 'Other', emoji: '✨' }
];

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="flex items-center justify-center space-x-2 mb-8">
    {Array.from({ length: totalSteps }, (_, i) => (
      <div
        key={i}
        className={`w-3 h-3 rounded-full transition-all duration-300 ${
          i + 1 <= currentStep 
            ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 scale-110' 
            : 'bg-gray-700'
        }`}
      />
    ))}
  </div>
);

const OnboardingPage = () => {
  const navigate = useNavigate();
  const { 
    onboardingData, 
    updateData, 
    currentStep, 
    nextStep, 
    prevStep, 
    completeOnboarding, 
    skipOnboarding,
    isLoading 
  } = useOnboarding();

  const [localErrors, setLocalErrors] = useState<Record<string, string>>({});

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!onboardingData.name.trim()) {
          errors.name = 'Name is required';
        }
        break;
      case 2:
        // Birth details are optional but validate format if provided
        if (onboardingData.dateOfBirth && !/^\d{4}-\d{2}-\d{2}$/.test(onboardingData.dateOfBirth)) {
          errors.dateOfBirth = 'Please enter a valid date';
        }
        if (onboardingData.timeOfBirth && !/^\d{2}:\d{2}$/.test(onboardingData.timeOfBirth)) {
          errors.timeOfBirth = 'Please enter a valid time (HH:MM)';
        }
        break;
      case 3:
        // Deity selection is optional
        break;
    }
    
    setLocalErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleComplete = async () => {
    if (validateStep(currentStep)) {
      const { error, showWalkthrough } = await completeOnboarding(false);
      if (!error) {
        navigate('/sadhana');
      }
    }
  };

  const handleCompleteWithWalkthrough = async () => {
    if (validateStep(currentStep)) {
      const { error } = await completeOnboarding(true);
      if (!error) {
        navigate('/walkthrough');
      }
    }
  };

  const handleSkip = async () => {
    const { error } = await skipOnboarding();
    if (!error) {
      navigate('/sadhana');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-2">
                Welcome to your spiritual journey
              </h2>
              <p className="text-muted-foreground">
                Let's start by getting to know you better
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-base font-medium">
                  What should we call you? *
                </Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={onboardingData.name}
                    onChange={(e) => updateData('name', e.target.value)}
                    className="pl-10 bg-background/50 border-purple-500/20 focus:border-purple-500/50 text-lg"
                  />
                </div>
                {localErrors.name && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.name}</p>
                )}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-fuchsia-600 mb-2">
                Your birth details
              </h2>
              <p className="text-muted-foreground">
                This helps us create personalized spiritual insights (optional)
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="dateOfBirth" className="text-base font-medium">
                  Date of Birth
                </Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={onboardingData.dateOfBirth}
                    onChange={(e) => updateData('dateOfBirth', e.target.value)}
                    className="pl-10 bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
                {localErrors.dateOfBirth && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <Label htmlFor="timeOfBirth" className="text-base font-medium">
                  Time of Birth
                </Label>
                <div className="relative mt-2">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="timeOfBirth"
                    type="time"
                    value={onboardingData.timeOfBirth}
                    onChange={(e) => updateData('timeOfBirth', e.target.value)}
                    className="pl-10 bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
                {localErrors.timeOfBirth && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.timeOfBirth}</p>
                )}
              </div>

              <div>
                <Label htmlFor="placeOfBirth" className="text-base font-medium">
                  Place of Birth
                </Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="placeOfBirth"
                    placeholder="City, Country"
                    value={onboardingData.placeOfBirth}
                    onChange={(e) => updateData('placeOfBirth', e.target.value)}
                    className="pl-10 bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-500 mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 via-pink-400 to-purple-600 mb-2">
                Choose your divine guide
              </h2>
              <p className="text-muted-foreground">
                Select a deity that resonates with your spiritual journey
              </p>
            </div>

            <div className="space-y-4">
              <Label className="text-base font-medium">Favorite Deity</Label>
              <Select
                value={onboardingData.favoriteDeity}
                onValueChange={(value) => updateData('favoriteDeity', value)}
              >
                <SelectTrigger className="w-full bg-background/50 border-purple-500/20 focus:border-purple-500/50 text-lg">
                  <SelectValue placeholder="Choose your deity..." />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {DEITIES.map((deity) => (
                    <SelectItem 
                      key={deity.value} 
                      value={deity.value}
                      className="cursor-pointer hover:bg-purple-500/10"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{deity.emoji}</span>
                        <span>{deity.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const progress = (currentStep / 3) * 100;

  return (
    <div className="min-h-screen cosmic-nebula-bg flex items-center justify-center p-4">
      {/* Cosmic particles animation */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
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

      <Card className="w-full max-w-lg bg-background/80 backdrop-blur-sm border border-purple-500/20 shadow-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/lovable-uploads/750cc9ea-fdb3-49ae-9a42-504d1a30ef4e.png" 
              alt="Saadhana Board Logo" 
              className="h-12 w-12" 
            />
            <Sparkles className="ml-2 h-6 w-6 text-purple-500 animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
            Saadhana Yantra
          </CardTitle>
          <StepIndicator currentStep={currentStep} totalSteps={3} />
          <Progress value={progress} className="w-full h-2 mb-4" />
        </CardHeader>

        <CardContent className="space-y-6">
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>

          <div className="flex justify-between pt-6">
            {currentStep > 1 ? (
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
                disabled={isLoading}
                className="text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Button>
              
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleComplete}
                    disabled={isLoading}
                    variant="outline"
                    className="border-purple-500/30 hover:border-purple-500/50"
                  >
                    {isLoading ? 'Completing...' : 'Start Journey'}
                  </Button>
                  <Button
                    onClick={handleCompleteWithWalkthrough}
                    disabled={isLoading}
                    className="bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-600 hover:to-pink-600"
                  >
                    {isLoading ? 'Loading...' : 'Take Tour'}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingPage;