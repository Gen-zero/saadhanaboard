
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
  storage_url?: string;
  is_storage_file?: boolean;
}

export const useSpiritualBooks = (searchTerm?: string, selectedSubjects?: string[]) => {
  const query = useQuery({
    queryKey: ['spiritual-books', searchTerm, selectedSubjects],
    queryFn: async (): Promise<SpiritualBook[]> => {
      // Fetch books from database
      let dbQuery = supabase
        .from('spiritual_books')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm && searchTerm.trim()) {
        dbQuery = dbQuery.or(
          `title.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
        );
      }

      if (selectedSubjects && selectedSubjects.length > 0) {
        dbQuery = dbQuery.overlaps('traditions', selectedSubjects);
      }

      const { data: dbBooks, error: dbError } = await dbQuery;

      if (dbError) {
        console.error('Error fetching books from database:', dbError);
        throw dbError;
      }

      // Fetch files from storage
      const { data: storageFiles, error: storageError } = await supabase.storage
        .from('spiritual-books')
        .list('', {
          limit: 100,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (storageError) {
        console.error('Error fetching files from storage:', storageError);
        // Don't throw here, just continue with database books
      }

      const allBooks: SpiritualBook[] = [...(dbBooks || [])];

      // Add storage files as books
      if (storageFiles) {
        const storageBooks = storageFiles
          .filter(file => file.name.toLowerCase().endsWith('.pdf'))
          .map(file => {
            const { data } = supabase.storage
              .from('spiritual-books')
              .getPublicUrl(file.name);
            
            // Extract title from filename
            const title = file.name
              .replace(/\.pdf$/i, '')
              .replace(/[-_]/g, ' ')
              .replace(/\b\w/g, (l) => l.toUpperCase());

            return {
              id: `storage-${file.name}`,
              title,
              author: 'Unknown Author',
              traditions: ['General'],
              content: '', // Empty for PDF files
              description: `PDF file: ${file.name}`,
              language: 'English',
              created_at: file.created_at || new Date().toISOString(),
              updated_at: file.updated_at || new Date().toISOString(),
              user_id: 'storage',
              storage_url: data.publicUrl,
              is_storage_file: true
            } as SpiritualBook;
          });

        allBooks.push(...storageBooks);
      }

      // Apply search filters to combined results
      let filteredBooks = allBooks;
      
      if (searchTerm && searchTerm.trim()) {
        const searchLower = searchTerm.toLowerCase();
        filteredBooks = allBooks.filter(book =>
          book.title.toLowerCase().includes(searchLower) ||
          book.author.toLowerCase().includes(searchLower) ||
          book.description?.toLowerCase().includes(searchLower) ||
          book.traditions.some(t => t.toLowerCase().includes(searchLower))
        );
      }

      if (selectedSubjects && selectedSubjects.length > 0) {
        filteredBooks = filteredBooks.filter(book =>
          book.traditions.some(tradition => selectedSubjects.includes(tradition))
        );
      }

      return filteredBooks;
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
