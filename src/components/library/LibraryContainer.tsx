import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import BookViewer from "./BookViewer";
import BookShelf from "./BookShelf";
import LibraryHeader from "./LibraryHeader";
import SearchBar from "./SearchBar";
import LibraryLoading from "./LibraryLoading";
import SadhanaStore from "./store/SadhanaStore";
import BookRequestDialog from "./BookRequestDialog";
import RecommendedRow from "./RecommendedRow";
import FoundationsCategory from "./FoundationsCategory";
import FoundationSadhanaViewer from "./FoundationSadhanaViewer";
import { useSpiritualBooks } from "@/hooks/useSpiritualBooks";
import { StoreSadhana } from "@/types/store";
import { Link } from "react-router-dom";

const LibraryContainer = () => {
  const { toast } = useToast();
  const { books, isLoading, refreshBooks } = useSpiritualBooks();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedFoundationSadhana, setSelectedFoundationSadhana] = useState<StoreSadhana | null>(null);
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

  const handleFoundationsSadhanaSelect = (sadhana: StoreSadhana) => {
    setSelectedFoundationSadhana(sadhana);
  };

  const handleCloseFoundationSadhana = () => {
    setSelectedFoundationSadhana(null);
  };

  const handleStartFoundationSadhana = (sadhana: StoreSadhana) => {
    // In a real implementation, this would create the sadhana in the user's account
    toast({
      title: "Sadhana Started",
      description: `You've successfully started "${sadhana.title}". It will appear in your Sadhana Board.`,
    });
    
    // Close the viewer after starting
    setSelectedFoundationSadhana(null);
    
    // Navigate to the sadhana page
    window.location.href = '/sadhana';
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
          
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 rounded-lg border border-purple-500/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-lg">Request a Sacred Text</h3>
                <p className="text-sm text-muted-foreground">
                  Can't find the book you're looking for? Request it from our admins and we'll add it to the library.
                </p>
              </div>
              <BookRequestDialog />
            </div>
          </div>
          
          {isLoading ? (
            <LibraryLoading />
          ) : selectedBook ? (
            <BookViewer bookId={selectedBook} onClose={handleCloseBook} />
          ) : selectedFoundationSadhana ? (
            <FoundationSadhanaViewer 
              sadhana={selectedFoundationSadhana} 
              onClose={handleCloseFoundationSadhana}
              onStart={handleStartFoundationSadhana}
            />
          ) : (
            <>
              <RecommendedRow />
              <FoundationsCategory onSadhanaSelect={handleFoundationsSadhanaSelect} />
              <BookShelf 
                books={filteredBooks} 
                onSelectBook={handleSelectBook} 
                view={view}
              />
            </>
          )}
        </TabsContent>
        
        <TabsContent value="store">
          <div className="mb-4 p-4 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 rounded-lg border border-purple-500/20">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-medium text-lg">Expand Your Spiritual Journey</h3>
                <p className="text-sm text-muted-foreground">
                  Visit our full store for premium themes, 3D yantras, merchandise, and workshops
                </p>
              </div>
              <Link to="/store">
                <Button className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Visit Full Store
                </Button>
              </Link>
            </div>
          </div>
          <SadhanaStore />
        </TabsContent>
        

      </Tabs>
    </div>
  );
};

export default LibraryContainer;