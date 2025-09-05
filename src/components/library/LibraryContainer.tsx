
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookViewer from "./BookViewer";
import BookShelf from "./BookShelf";
import LibraryHeader from "./LibraryHeader";
import SearchBar from "./SearchBar";
import LibraryLoading from "./LibraryLoading";
import SadhanaStore from "./store/SadhanaStore";
import { useSpiritualBooks } from "@/hooks/useSpiritualBooks";

const LibraryContainer = () => {
  const { toast } = useToast();
  const { books, isLoading } = useSpiritualBooks();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("books");
  
  // Add safety check to ensure books is an array before filtering
  const filteredBooks = (books || []).filter(
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

  return (
    <div className="flex flex-col gap-4">
      <LibraryHeader 
        view={view}
        isLoading={isLoading}
        toggleView={toggleView}
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="books" className="flex items-center gap-2">
            📚 Sacred Books
          </TabsTrigger>
          <TabsTrigger value="store" className="flex items-center gap-2">
            🏪 Sadhana Store
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="books" className="space-y-4">
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
        </TabsContent>
        
        <TabsContent value="store">
          <SadhanaStore />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LibraryContainer;
