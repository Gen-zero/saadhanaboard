
import { useState } from "react";
import { BookOpen, Sparkles, Search, BookText, AlignCenter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookViewer from "./BookViewer";
import BookShelf from "./BookShelf";
import { useToast } from "@/components/ui/use-toast";
import { spiritualBooks } from "@/data/spiritualBooks";
import { useIsMobile } from "@/hooks/use-mobile";

const SpiritualLibrary = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  
  const filteredBooks = spiritualBooks.filter(
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

  return (
    <div className="cosmic-nebula-bg p-4 md:p-6 rounded-lg border border-purple-500/20">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
            <BookOpen className="h-6 w-6 text-purple-500" />
            <span>Spiritual Library</span>
            <span className="text-sm text-muted-foreground ml-1 italic font-normal">
              Ancient Wisdom Repository
            </span>
          </h1>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 cosmic-highlight bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
              onClick={() => setView(view === "grid" ? "list" : "grid")}
            >
              <AlignCenter className="h-4 w-4" />
              <span>{view === "grid" ? "List View" : "Grid View"}</span>
            </Button>
          </div>
        </div>
        
        <div className="flex items-center w-full max-w-md relative">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author or tradition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/80 backdrop-blur-sm border-purple-500/20 focus:border-purple-500/50"
          />
        </div>
        
        {selectedBook ? (
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
