
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useSupabaseAuth } from '@/hooks/useAuth';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOnboardingComplete: boolean | null;
  checkOnboardingStatus: () => Promise<boolean>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (email: string, password: string, displayName: string) => Promise<{ error: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading, signIn, signUp, signOut } = useSupabaseAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);

  const checkOnboardingStatus = async (): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking onboarding status:', error);
        return false;
      }

      const completed = data?.onboarding_completed || false;
      setIsOnboardingComplete(completed);
      return completed;
    } catch (error) {
      console.error('Error in checkOnboardingStatus:', error);
      return false;
    }
  };

  // Check onboarding status when user changes
  useEffect(() => {
    if (user && !isLoading) {
      checkOnboardingStatus();
    } else if (!user) {
      setIsOnboardingComplete(null);
    }
  }, [user, isLoading]);

  const login = async (email: string, password: string) => {
    return await signIn(email, password);
  };

  const signup = async (email: string, password: string, displayName: string) => {
    return await signUp(email, password, displayName);
  };

  const logout = async () => {
    await signOut();
    setIsOnboardingComplete(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      isOnboardingComplete, 
      checkOnboardingStatus, 
      login, 
      signup, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
