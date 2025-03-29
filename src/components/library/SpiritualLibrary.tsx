
import { useState, useEffect } from "react";
import { BookOpen, Sparkles, Search, BookText, AlignCenter, Loader2, Download, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import BookViewer from "./BookViewer";
import BookShelf from "./BookShelf";
import { useToast } from "@/components/ui/use-toast";
import { spiritualBooks } from "@/data/spiritualBooks";
import { useIsMobile } from "@/hooks/use-mobile";
import { SpiritualBook } from "@/types/books";
import { fetchAllSpiritualBooks, fetchOpenLibrarySubject } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SpiritualLibrary = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [books, setBooks] = useState<SpiritualBook[]>(spiritualBooks);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSource, setDataSource] = useState<"local" | "api">("local");
  const [currentSubject, setCurrentSubject] = useState<string>("spirituality");
  
  const spiritualSubjects = [
    { id: "spirituality", name: "Spirituality" },
    { id: "buddhism", name: "Buddhism" },
    { id: "yoga", name: "Yoga" },
    { id: "meditation", name: "Meditation" },
    { id: "hinduism", name: "Hinduism" },
    { id: "taoism", name: "Taoism" },
    { id: "sufism", name: "Sufism" },
    { id: "christianity", name: "Christianity" },
    { id: "mysticism", name: "Mysticism" },
  ];

  // Load data based on the selected subject
  const loadSubjectData = async (subject: string) => {
    setIsLoading(true);
    try {
      const subjectBooks = await fetchOpenLibrarySubject(subject);
      if (subjectBooks.length > 0) {
        setBooks([...spiritualBooks, ...subjectBooks]);
        toast({
          title: `${subject} books loaded`,
          description: `Loaded ${subjectBooks.length} books from Open Library`,
          duration: 3000,
        });
      } else {
        toast({
          title: "No books found",
          description: `No books found for ${subject}`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error(`Error loading ${subject} books:`, error);
      toast({
        title: "Error loading books",
        description: `Failed to load ${subject} books. Using local library.`,
        variant: "destructive",
        duration: 3000,
      });
      setBooks(spiritualBooks);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch books from APIs when data source changes
  useEffect(() => {
    if (dataSource === "api") {
      setIsLoading(true);
      fetchAllSpiritualBooks()
        .then(apiBooks => {
          if (apiBooks.length > 0) {
            setBooks([...spiritualBooks, ...apiBooks]);
            toast({
              title: "External books loaded",
              description: `Loaded ${apiBooks.length} books from external sources`,
              duration: 3000,
            });
          } else {
            toast({
              title: "No external books found",
              description: "Using local library only",
              duration: 3000,
            });
          }
        })
        .catch(error => {
          console.error("Error loading external books:", error);
          toast({
            title: "Error loading external books",
            description: "Using local library only",
            variant: "destructive",
            duration: 3000,
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setBooks(spiritualBooks);
    }
  }, [dataSource, toast]);

  useEffect(() => {
    if (dataSource === "api" && currentSubject) {
      loadSubjectData(currentSubject);
    }
  }, [currentSubject, dataSource]);
  
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

  const toggleDataSource = () => {
    setDataSource(dataSource === "local" ? "api" : "local");
  };

  const handleSubjectChange = (subject: string) => {
    setCurrentSubject(subject);
    if (dataSource === "api") {
      loadSubjectData(subject);
    }
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
              className={`flex items-center gap-1 cosmic-highlight ${
                dataSource === "api" 
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
              }`}
              onClick={toggleDataSource}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              <span>{dataSource === "local" ? "Connect to Open Library" : "Local Books Only"}</span>
            </Button>
            
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

        {dataSource === "api" && (
          <div className="w-full overflow-x-auto">
            <Tabs 
              defaultValue={currentSubject} 
              onValueChange={handleSubjectChange}
              className="w-full"
            >
              <TabsList className="mb-4 overflow-x-auto flex flex-nowrap p-1 w-full">
                {spiritualSubjects.map((subject) => (
                  <TabsTrigger 
                    key={subject.id}
                    value={subject.id}
                    className="whitespace-nowrap"
                  >
                    {subject.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        )}
        
        <div className="flex items-center w-full max-w-md relative">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, author or tradition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/80 backdrop-blur-sm border-purple-500/20 focus:border-purple-500/50"
          />
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading spiritual texts from across realms...</p>
          </div>
        ) : selectedBook ? (
          <BookViewer bookId={selectedBook} onClose={handleCloseBook} />
        ) : (
          <>
            <BookShelf 
              books={filteredBooks} 
              onSelectBook={handleSelectBook} 
              view={view}
            />
            {dataSource === "api" && filteredBooks.length > spiritualBooks.length && (
              <div className="flex justify-center mt-4">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <ExternalLink size={12} />
                  Books provided by Open Library API
                </span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SpiritualLibrary;
