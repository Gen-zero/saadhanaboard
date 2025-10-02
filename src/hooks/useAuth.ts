import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// User type matching Supabase structure
interface User {
  id: string;
  email: string;
  display_name?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch profile data for display_name
          const { data: profile } = await supabase
            .from('profiles')
            .select('display_name')
            .eq('id', session.user.id)
            .single();
          
          setUser({
            id: session.user.id,
            email: session.user.email!,
            display_name: profile?.display_name || session.user.email!,
          });
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', session.user.id)
          .single();
        
        setUser({
          id: session.user.id,
          email: session.user.email!,
          display_name: profile?.display_name || session.user.email!,
        });
      }
      
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const refreshUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', session.user.id)
          .single();
        
        setUser({
          id: session.user.id,
          email: session.user.email!,
          display_name: profile?.display_name || session.user.email!,
        });
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setIsLoading(true);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName
          }
        }
      });

      if (error) {
        toast({ 
          title: 'Registration failed', 
          description: error.message, 
          variant: 'destructive' 
        });
        return { error: error.message };
      }

      toast({
        title: "Success!",
        description: "Account created successfully. Please check your email to verify your account."
      });

      return { error: null };
    } catch (error: any) {
      const message = error?.message || 'Registration failed';
      toast({ title: 'Registration failed', description: message, variant: 'destructive' });
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        toast({ 
          title: 'Sign in failed', 
          description: error.message, 
          variant: 'destructive' 
        });
        return { error: error.message };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in."
      });

      return { error: null };
    } catch (error: any) {
      const message = error?.message || 'Sign in failed';
      toast({ title: 'Sign in failed', description: message, variant: 'destructive' });
      return { error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) throw error;
      
      setUser(null);
      setSession(null);
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    signUp,
    signIn,
    signOut,
    refreshUser // Add refreshUser function
  };
};