import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/hooks/use-toast';

export interface OnboardingData {
  name: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  favoriteDeity: string;
}

export const useOnboarding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { user } = useAuth();
  
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    name: user?.user_metadata?.display_name || '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    favoriteDeity: ''
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

      // Update the user's profile with onboarding data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          display_name: onboardingData.name,
          date_of_birth: onboardingData.dateOfBirth || null,
          time_of_birth: onboardingData.timeOfBirth || null,
          place_of_birth: onboardingData.placeOfBirth || null,
          favorite_deity: onboardingData.favoriteDeity || null,
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Welcome to Saadhana Board!",
        description: "Your spiritual journey begins now.",
      });

      return { error: null, showWalkthrough };
    } catch (error: any) {
      console.error('Onboarding completion error:', error);
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
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

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
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      return data?.onboarding_completed || false;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  };

  return {
    onboardingData,
    updateData,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    completeOnboarding,
    skipOnboarding,
    checkOnboardingStatus,
    isLoading
  };
};