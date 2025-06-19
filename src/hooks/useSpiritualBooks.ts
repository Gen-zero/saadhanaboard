
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SpiritualBook {
  id: string;
  title: string;
  author: string;
  traditions: string[];
  content: string;
  description?: string;
  year?: number;
  language: string;
  page_count?: number;
  cover_url?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const useSpiritualBooks = (searchTerm?: string, selectedSubjects?: string[]) => {
  return useQuery({
    queryKey: ['spiritual-books', searchTerm, selectedSubjects],
    queryFn: async (): Promise<SpiritualBook[]> => {
      let query = supabase
        .from('spiritual_books')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply search filter if provided
      if (searchTerm && searchTerm.trim()) {
        query = query.or(
          `title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      // Apply subject/tradition filter if provided
      if (selectedSubjects && selectedSubjects.length > 0) {
        query = query.overlaps('traditions', selectedSubjects);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching books:', error);
        throw error;
      }

      return data || [];
    },
  });
};

// Hook to get unique traditions from all books
export const useBookTraditions = () => {
  return useQuery({
    queryKey: ['book-traditions'],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('spiritual_books')
        .select('traditions');

      if (error) {
        console.error('Error fetching traditions:', error);
        throw error;
      }

      // Extract unique traditions from all books
      const allTraditions = data?.flatMap(book => book.traditions) || [];
      return [...new Set(allTraditions)].sort();
    },
  });
};
