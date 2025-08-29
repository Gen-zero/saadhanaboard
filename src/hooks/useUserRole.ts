import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';

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
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) {
          if (error.code === 'PGRST116') {
            // No rows found, user has no role yet
            setRole(null);
          } else {
            console.error('Error fetching user role:', error);
            setRole(null);
          }
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

  const setUserRole = async (newRole: 'guru' | 'shishya'): Promise<{ error: Error | null }> => {
    if (!user) {
      console.error('No user logged in when trying to set role');
      return { error: new Error('No user logged in') };
    }

    try {
      setIsLoading(true);
      
      console.log('Attempting to set role:', newRole, 'for user:', user.id);
      
      // Use upsert to handle existing roles
      const { data, error } = await supabase
        .from('user_roles')
        .upsert({
          user_id: user.id,
          role: newRole
        }, {
          onConflict: 'user_id,role'
        })
        .select();

      if (error) {
        console.error('Supabase error setting role:', error);
        throw error;
      }

      console.log('Role set successfully:', data);
      setRole(newRole);
      return { error: null };
    } catch (error) {
      console.error('Error setting user role:', error);
      return { error: error as Error };
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