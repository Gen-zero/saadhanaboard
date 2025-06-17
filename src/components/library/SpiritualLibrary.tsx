
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import BookViewer from "./BookViewer";
import BookShelf from "./BookShelf";
import LibraryHeader from "./LibraryHeader";
import SearchBar from "./SearchBar";
import LibraryLoading from "./LibraryLoading";
import BookUploadDialog from "./BookUploadDialog";
import { SpiritualBook } from "@/types/books";
import { useSpiritualBooks } from "@/hooks/useSpiritualBooks";

const SpiritualLibrary = () => {
  const { toast } = useToast();
  const { books, isLoading, refreshBooks } = useSpiritualBooks();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  
  const filteredBooks = books.filter(
    (book) => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.traditions.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleSelectBook = (bookId: string) => {
    setSelectedBook(bookId);
    toast({
      title: "Opening spiritual text",
      description: "Manifesting wisdom from the cosmic library...",
      duration: 2000,
    });
  };
  
  const handleCloseBook = () => {
    setSelectedBook(null);
  };

  const toggleView = () => {
    setView(view === "grid" ? "list" : "grid");
  };

  const handleBookUploaded = () => {
    refreshBooks();
    toast({
      title: "Library updated",
      description: "Your uploaded book is now available in the library.",
      duration: 3000,
    });
  };

  return (
    <div className="cosmic-nebula-bg p-4 md:p-6 rounded-lg border border-purple-500/20">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <LibraryHeader 
            view={view}
            isLoading={isLoading}
            toggleView={toggleView}
          />
          <BookUploadDialog onBookUploaded={handleBookUploaded} />
        </div>
        
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, author or tradition..."
        />
        
        {isLoading ? (
          <LibraryLoading />
        ) : selectedBook ? (
          <BookViewer bookId={selectedBook} onClose={handleCloseBook} />
        ) : (
          <BookShelf 
            books={filteredBooks} 
            onSelectBook={handleSelectBook} 
            view={view}
          />
        )}
      </div>
    </div>
  );
};

export default SpiritualLibrary;
