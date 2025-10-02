import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'guru' | 'shishya' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRole = async () => {
    if (!user?.id) {
      setRole(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;

      setRole(data?.role || null);
    } catch (error: any) {
      console.error('Error fetching role:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user role',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRole();
  }, [user?.id]);

  const updateRole = async (newRole: 'guru' | 'shishya') => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('user_roles')
        .upsert(
          {
            user_id: user.id,
            role: newRole,
          },
          {
            onConflict: 'user_id,role',
          }
        );

      if (error) throw error;

      setRole(newRole);
      
      toast({
        title: 'Success',
        description: `Role set to ${newRole}`,
      });

      return { error: null };
    } catch (error: any) {
      console.error('Error setting role:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to set role',
        variant: 'destructive',
      });
      return { error: error.message };
    }
  };

  return {
    role,
    isLoading,
    updateRole,
    refreshRole: fetchRole,
  };
};
