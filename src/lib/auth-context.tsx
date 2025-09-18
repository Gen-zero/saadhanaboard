import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth as useLocalAuth } from '@/hooks/useAuth';
import api from '@/services/api';

interface AuthContextType {
  user: any;
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
  const { user, isLoading, signIn, signUp, signOut } = useLocalAuth();
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean | null>(null);
  const [isOnboardingLoading, setIsOnboardingLoading] = useState<boolean>(false);

  const checkOnboardingStatus = async (): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      setIsOnboardingLoading(true);
      const data = await api.getProfile();
      const completed = data.profile?.onboarding_completed || false;
      setIsOnboardingComplete(completed);
      return completed;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      // Set onboarding as complete on error to prevent blocking the app
      setIsOnboardingComplete(true);
      return true;
    } finally {
      setIsOnboardingLoading(false);
    }
  };

  // Check onboarding status when user changes
  useEffect(() => {
    if (user && !isLoading) {
      // Add a small delay to ensure the profile is properly created
      const timer = setTimeout(() => {
        checkOnboardingStatus();
      }, 100);
      
      return () => clearTimeout(timer);
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
  };

  const value = {
    user,
    isLoading: isLoading || isOnboardingLoading,
    isOnboardingComplete,
    checkOnboardingStatus,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};