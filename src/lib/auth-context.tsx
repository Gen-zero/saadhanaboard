
import React, { createContext, useState, useContext, useEffect } from 'react';
import { AuthUser } from '@/types/books';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => void;
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
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('sadhana_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data');
      }
    }
    setIsLoading(false);
  }, []);

  // Mock authentication methods (in a real app, these would connect to a backend)
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation (in a real app, this would be handled by your backend)
      if (email === 'demo@example.com' && password === 'password') {
        const newUser: AuthUser = {
          id: 'user-1',
          email,
          displayName: 'Demo User',
          preferences: {
            favoriteBooks: [],
            readingHistory: []
          }
        };
        setUser(newUser);
        localStorage.setItem('sadhana_user', JSON.stringify(newUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, this would create a new user in your backend
      const newUser: AuthUser = {
        id: `user-${Date.now().toString()}`,
        email,
        displayName,
        preferences: {
          favoriteBooks: [],
          readingHistory: []
        }
      };
      
      setUser(newUser);
      localStorage.setItem('sadhana_user', JSON.stringify(newUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sadhana_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
