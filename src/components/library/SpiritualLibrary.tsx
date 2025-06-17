
import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import BookViewer from "./BookViewer";
import BookShelf from "./BookShelf";
import LibraryHeader from "./LibraryHeader";
import SubjectTabs from "./SubjectTabs";
import SearchBar from "./SearchBar";
import LibraryLoading from "./LibraryLoading";
import BookUploadDialog from "./BookUploadDialog";
import { spiritualBooks } from "@/data/spiritualBooks";
import { SpiritualBook } from "@/types/books";
import { fetchAllSpiritualBooks, fetchOpenLibrarySubject } from "@/lib/api";
import { useSpiritualBooks } from "@/hooks/useSpiritualBooks";

const SpiritualLibrary = () => {
  const { toast } = useToast();
  const { books: allBooks, isLoading: booksLoading, refreshBooks } = useSpiritualBooks();
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [books, setBooks] = useState<SpiritualBook[]>([]);
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

  // Update books when allBooks changes
  useEffect(() => {
    if (dataSource === "local") {
      setBooks(allBooks);
    }
  }, [allBooks, dataSource]);

  // Load data based on the selected subject
  const loadSubjectData = async (subject: string) => {
    setIsLoading(true);
    try {
      const subjectBooks = await fetchOpenLibrarySubject(subject);
      if (subjectBooks.length > 0) {
        setBooks([...allBooks, ...subjectBooks]);
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
      setBooks(allBooks);
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
            setBooks([...allBooks, ...apiBooks]);
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
      setBooks(allBooks);
    }
  }, [dataSource, toast, allBooks]);

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

  const currentLoading = isLoading || booksLoading;

  return (
    <div className="cosmic-nebula-bg p-4 md:p-6 rounded-lg border border-purple-500/20">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <LibraryHeader 
            dataSource={dataSource}
            view={view}
            isLoading={currentLoading}
            toggleDataSource={toggleDataSource}
            toggleView={toggleView}
          />
          <BookUploadDialog onBookUploaded={handleBookUploaded} />
        </div>
        
        {dataSource === "api" && (
          <SubjectTabs 
            subjects={spiritualSubjects}
            currentSubject={currentSubject}
            onChange={setCurrentSubject}
          />
        )}
        
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, author or tradition..."
        />
        
        {currentLoading ? (
          <LibraryLoading />
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
