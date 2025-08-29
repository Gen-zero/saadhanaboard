import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export type UserRole = 'guru' | 'shishya' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    const fetchUserRole = async () => {
      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        } else {
          setRole(data?.role || null);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const setUserRole = async (newRole: 'guru' | 'shishya') => {
    if (!user) {
      console.error('No user logged in when trying to set role');
      return { error: new Error('No user logged in') };
    }

    try {
      setIsLoading(true);
      
      console.log('Attempting to set role:', newRole, 'for user:', user.id);
      
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: newRole
        })
        .select();

      if (error) {
        console.error('Supabase error setting role:', error);
        throw error;
      }

      console.log('Role set successfully:', data);
      setRole(newRole);
      return { error: null };
    } catch (error: any) {
      console.error('Error setting user role:', error);
      return { error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    role,
    isLoading,
    setUserRole,
    isGuru: role === 'guru',
    isShishya: role === 'shishya'
  };
};