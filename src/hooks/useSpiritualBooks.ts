
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { spiritualBooks as localBooks } from "@/data/spiritualBooks";
import { SpiritualBook } from "@/types/books";

export const useSpiritualBooks = () => {
  const { toast } = useToast();
  const [books, setBooks] = useState<SpiritualBook[]>(localBooks);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSupabaseBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('spiritual_books')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const supabaseBooks: SpiritualBook[] = data.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        traditions: book.traditions || [],
        content: book.content,
        coverUrl: book.cover_url || undefined,
        description: book.description || undefined,
        year: book.year || undefined,
        source: 'supabase',
        language: book.language || undefined,
        pageCount: book.page_count || undefined,
      }));

      return supabaseBooks;
    } catch (error) {
      console.error('Error fetching books from Supabase:', error);
      return [];
    }
  };

  const loadAllBooks = async () => {
    setIsLoading(true);
    try {
      const supabaseBooks = await fetchSupabaseBooks();
      const allBooks = [...localBooks, ...supabaseBooks];
      setBooks(allBooks);
    } catch (error) {
      console.error('Error loading books:', error);
      toast({
        title: "Error loading books",
        description: "Some books may not be available.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshBooks = () => {
    loadAllBooks();
  };

  useEffect(() => {
    loadAllBooks();
  }, []);

  return {
    books,
    isLoading,
    refreshBooks,
  };
};
