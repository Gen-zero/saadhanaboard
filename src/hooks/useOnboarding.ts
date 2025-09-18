import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/hooks/use-toast';
import api from '@/services/api';

export interface OnboardingData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  favoriteDeity: string;
  gotra?: string;
  varna?: string;
  sampradaya?: string;
  location?: string;
  // Removed welcomeQuizCompleted field
}

export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: user?.display_name || '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    favoriteDeity: '',
    gotra: '',
    varna: '',
    sampradaya: '',
    location: ''
    // Removed welcomeQuizCompleted field
  });

  const updateData = (field: keyof OnboardingData, value: string) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const completeOnboarding = async (showWalkthrough: boolean = false) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      });
      return { error: new Error("User not authenticated") };
    }

    try {
      setIsLoading(true);

      // Update profile with onboarding data
      const profileData = {
        display_name: onboardingData.name,
        date_of_birth: onboardingData.dateOfBirth,
        time_of_birth: onboardingData.timeOfBirth,
        place_of_birth: onboardingData.placeOfBirth,
        favorite_deity: onboardingData.favoriteDeity,
        gotra: onboardingData.gotra,
        varna: onboardingData.varna,
        sampradaya: onboardingData.sampradaya,
        location: onboardingData.location,
        onboarding_completed: true
        // Removed welcome_quiz_completed field
      };

      await api.updateProfile(profileData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });

      return { error: null, showWalkthrough };
    } catch (error: any) {
      console.error('Complete onboarding error:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const skipOnboarding = async () => {
    if (!user?.id) return { error: new Error("User not authenticated") };

    try {
      setIsLoading(true);

      // Mark onboarding as completed without additional data
      await api.updateProfile({
        onboarding_completed: true
        // Removed welcome_quiz_completed field
      });

      toast({
        title: "Onboarding Skipped",
        description: "You can complete your profile later in settings.",
      });

      return { error: null };
    } catch (error: any) {
      console.error('Skip onboarding error:', error);
      toast({
        title: "Error",
        description: "Failed to skip onboarding. Please try again.",
        variant: "destructive"
      });
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  const checkOnboardingStatus = async () => {
    if (!user?.id) return false;

    try {
      const data = await api.getProfile();
      return data.profile?.onboarding_completed || false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  };

  return {
    isLoading,
    currentStep,
    onboardingData,
    updateData,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    checkOnboardingStatus
  };
};