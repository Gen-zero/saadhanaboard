import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, User, MapPin, Users, BookOpen, Sword, Flower2, Zap, Mountain } from 'lucide-react';
import { useOnboarding } from '@/hooks/useOnboarding';

// Define the deities, varnas, and sampradayas directly in the component
const DEITIES = [
  { value: 'vishnu', label: 'Lord Vishnu', emoji: '🌀' },
  { value: 'krishna', label: 'Lord Krishna', emoji: '🪶' },
  { value: 'rama', label: 'Lord Rama', emoji: '🏹' },
  { value: 'ganesha', label: 'Lord Ganesha', emoji: '🐘' },
  { value: 'durga', label: 'Goddess Durga', emoji: '🦁' },
  { value: 'lakshmi', label: 'Goddess Lakshmi', emoji: '🪷' },
  { value: 'saraswati', label: 'Goddess Saraswati', emoji: '🎵' },
  { value: 'kali', label: 'Goddess Kali', emoji: '⚔️' },
  { value: 'parvati', label: 'Goddess Parvati', emoji: '🏔️' },
  { value: 'brahma', label: 'Lord Brahma', emoji: '🌸' },
  { value: 'other', label: 'Other', emoji: '✨' }
];

const VARNAS = [
  { value: 'brahmana', label: 'Brahmana 🙏' },
  { value: 'kshatriya', label: 'Kshatriya ⚔️' },
  { value: 'vaishya', label: 'Vaishya व्यापार' },
  { value: 'shudra', label: 'Shudra 🛠️' },
  { value: 'outcaste', label: 'Outcaste' }
];

const SAMPRADAYAS = [
  { value: 'shakta', label: 'Shakta' },
  { value: 'shaiva', label: 'Shaiva' },
  { value: 'smarta', label: 'Smarta' },
  { value: 'vaishnava', label: 'Vaishnava' },
  { value: 'buddhist', label: 'Buddhist / Zen' },
  { value: 'jain', label: 'Jain' }
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
  const [isDikshit, setIsDikshit] = useState(false);
  const [otherDeity, setOtherDeity] = useState('');

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
      case 4:
        // Profile information step
        if (!onboardingData.gotra?.trim()) {
          errors.gotra = 'Gotra is required';
        }
        if (!onboardingData.varna) {
          errors.varna = 'Varna selection is required';
        }
        if (isDikshit && !onboardingData.sampradaya) {
          errors.sampradaya = 'Sampradaya selection is required for Dikshit';
        }
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
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-400 to-blue-600 mb-2">
                Birth Details (Optional)
              </h2>
              <p className="text-muted-foreground">
                These details help personalize your spiritual experience
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="dateOfBirth" className="text-base font-medium">
                  Date of Birth
                </Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={onboardingData.dateOfBirth || ''}
                    onChange={(e) => updateData('dateOfBirth', e.target.value)}
                    className="pl-10 bg-background/50 border-blue-500/20 focus:border-blue-500/50"
                  />
                </div>
                {localErrors.dateOfBirth && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.dateOfBirth}</p>
                )}
              </div>

              <div>
                <Label htmlFor="timeOfBirth" className="text-base font-medium">
                  Time of Birth (24hr)
                </Label>
                <div className="relative mt-2">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="timeOfBirth"
                    type="time"
                    value={onboardingData.timeOfBirth || ''}
                    onChange={(e) => updateData('timeOfBirth', e.target.value)}
                    className="pl-10 bg-background/50 border-blue-500/20 focus:border-blue-500/50"
                  />
                </div>
                {localErrors.timeOfBirth && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.timeOfBirth}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="birthPlace" className="text-base font-medium">
                Place of Birth
              </Label>
              <div className="relative mt-2">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="birthPlace"
                  placeholder="City, State/Country"
                  value={onboardingData.placeOfBirth || ''}
                  onChange={(e) => updateData('placeOfBirth', e.target.value)}
                  className="pl-10 bg-background/50 border-blue-500/20 focus:border-blue-500/50"
                />
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
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-400 to-amber-600 mb-2">
                Divine Connection
              </h2>
              <p className="text-muted-foreground">
                Which deity resonates most with your spiritual path?
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {DEITIES.map((deity) => (
                <div
                  key={deity.value}
                  onClick={() => {
                    setOtherDeity('');
                    updateData('favoriteDeity', deity.value);
                  }}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    onboardingData.favoriteDeity === deity.value
                      ? 'border-amber-500 bg-amber-500/10 scale-105'
                      : 'border-border hover:border-amber-500/50 hover:bg-amber-500/5'
                  }`}
                >
                  <div className="text-2xl mb-2">{deity.emoji}</div>
                  <div className="text-sm font-medium text-center">{deity.label}</div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Label htmlFor="otherDeity" className="text-base font-medium">
                Other Deity or Spiritual Focus
              </Label>
              <Input
                id="otherDeity"
                placeholder="If your deity isn't listed above..."
                value={otherDeity}
                onChange={(e) => {
                  setOtherDeity(e.target.value);
                  updateData('favoriteDeity', e.target.value);
                }}
                className="mt-2 bg-background/50 border-amber-500/20 focus:border-amber-500/50"
              />
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 mb-4">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 mb-2">
                Profile Information
              </h2>
              <p className="text-muted-foreground">
                Share some details about your spiritual background
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <Label htmlFor="gotra" className="text-base font-medium">
                  Gotra *
                </Label>
                <Input
                  id="gotra"
                  placeholder="Enter your gotra"
                  value={onboardingData.gotra || ''}
                  onChange={(e) => updateData('gotra', e.target.value)}
                  className="mt-2 bg-background/50 border-green-500/20 focus:border-green-500/50"
                />
                {localErrors.gotra && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.gotra}</p>
                )}
              </div>

              <div>
                <Label htmlFor="varna" className="text-base font-medium">
                  Varna *
                </Label>
                <Select value={onboardingData.varna || ''} onValueChange={(value) => updateData('varna', value)}>
                  <SelectTrigger className="mt-2 bg-background/50 border-green-500/20 focus:border-green-500/50">
                    <SelectValue placeholder="Select your varna" />
                  </SelectTrigger>
                  <SelectContent>
                    {VARNAS.map((varna) => (
                      <SelectItem key={varna.value} value={varna.value}>
                        {varna.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {localErrors.varna && (
                  <p className="text-red-400 text-sm mt-1">{localErrors.varna}</p>
                )}
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isDikshit"
                  checked={isDikshit}
                  onChange={(e) => setIsDikshit(e.target.checked)}
                  className="h-4 w-4 text-green-500 border-green-500/20 rounded focus:ring-green-500"
                />
                <Label htmlFor="isDikshit" className="text-base">
                  I am Dikshit (formally initiated)
                </Label>
              </div>

              {isDikshit && (
                <div>
                  <Label htmlFor="sampradaya" className="text-base font-medium">
                    Sampradaya *
                  </Label>
                  <Select value={onboardingData.sampradaya || ''} onValueChange={(value) => updateData('sampradaya', value)}>
                    <SelectTrigger className="mt-2 bg-background/50 border-green-500/20 focus:border-green-500/50">
                      <SelectValue placeholder="Select your sampradaya" />
                    </SelectTrigger>
                    <SelectContent>
                      {SAMPRADAYAS.map((sampradaya) => (
                        <SelectItem key={sampradaya.value} value={sampradaya.value}>
                          {sampradaya.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {localErrors.sampradaya && (
                    <p className="text-red-400 text-sm mt-1">{localErrors.sampradaya}</p>
                  )}
                </div>
              )}

              <div>
                <Label htmlFor="location" className="text-base font-medium">
                  Location
                </Label>
                <div className="relative mt-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="City, State/Country"
                    value={onboardingData.location || ''}
                    onChange={(e) => updateData('location', e.target.value)}
                    className="pl-10 bg-background/50 border-green-500/20 focus:border-green-500/50"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-fuchsia-500 mb-4 mx-auto">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-2">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-muted-foreground mb-8">
              You're all set to start your spiritual practice with SaadhanaBoard. 
              Would you like a quick walkthrough of the features, or dive right in?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={handleCompleteWithWalkthrough}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 px-8 py-6 text-lg"
              >
                Show Me Around
              </Button>
              <Button
                onClick={handleComplete}
                variant="outline"
                className="border-purple-500/30 hover:bg-purple-500/10 px-8 py-6 text-lg"
              >
                Start Practicing
              </Button>
            </div>
            
            <div className="pt-8">
              <Button
                onClick={handleSkip}
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
              >
                Skip for now
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="backdrop-blur-sm bg-background/70 rounded-2xl border border-purple-500/20 p-8 shadow-2xl">
          <StepIndicator currentStep={currentStep} totalSteps={5} />
          
          <div className="mb-8">
            {renderStep()}
          </div>
          
          {currentStep < 5 && (
            <div className="flex justify-between pt-6 border-t border-border">
              <Button
                onClick={prevStep}
                variant="outline"
                disabled={currentStep === 1}
                className="border-purple-500/30 hover:bg-purple-500/10"
              >
                Back
              </Button>
              <Button
                onClick={currentStep === 4 ? handleComplete : handleNext}
                className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
              >
                {currentStep === 4 ? 'Complete Setup' : 'Next'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;