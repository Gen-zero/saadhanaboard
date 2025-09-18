
import { useQuery } from '@tanstack/react-query';
import api from '@/services/api';

export interface SpiritualBook {
  id: string;
  user_id: string;
  title: string;
  author: string;
  traditions: string[];
  content: string;
  description?: string;
  year?: number;
  language?: string;
  page_count?: number;
  cover_url?: string;
  created_at: string;
  updated_at: string;
}

export const useSpiritualBooks = (searchTerm?: string, selectedSubjects?: string[]) => {
  const query = useQuery({
    queryKey: ['spiritual-books', searchTerm, selectedSubjects],
    queryFn: async (): Promise<SpiritualBook[]> => {
      const data = await api.getBooks(searchTerm, selectedSubjects);
      return data.books || [];
    },
  });

  return {
    books: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    refreshBooks: query.refetch
  };
};

// Hook to get unique traditions from all books
export const useBookTraditions = () => {
  return useQuery({
    queryKey: ['book-traditions'],
    queryFn: async (): Promise<string[]> => {
      const data = await api.getBookTraditions();
      return data.traditions || [];
    },
  });
};
