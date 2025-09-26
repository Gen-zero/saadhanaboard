import { useState } from "react";
import { BookMarked, BookOpen, BookText, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { SpiritualBook } from "@/types/books";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";

interface BookShelfProps {
  books: SpiritualBook[];
  onSelectBook: (id: string) => void;
  view: "grid" | "list";
}

const BookShelf = ({ books, onSelectBook, view }: BookShelfProps) => {
  const isMobile = useIsMobile();
  
  if (books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-purple-500/20 bg-gradient-to-b from-purple-600/10 via-purple-500/5 to-purple-400/10 backdrop-blur-sm">
        <BookText className="h-12 w-12 text-muted-foreground mb-2" />
        <h3 className="text-lg font-medium">No books found</h3>
        <p className="text-muted-foreground">Try adjusting your search query</p>
      </div>
    );
  }
  
  return (
    <div className="mt-4">
      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} onSelect={onSelectBook} />
          ))}
        </div>
      ) : (
        <ScrollArea className="h-[500px] rounded-xl border border-purple-500/20 bg-gradient-to-b from-background/70 to-secondary/10 backdrop-blur-sm">
          <div className="p-4">
            {books.map((book) => (
              <BookListItem key={book.id} book={book} onSelect={onSelectBook} />
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

interface BookCardProps {
  book: SpiritualBook;
  onSelect: (id: string) => void;
}

const BookCard = ({ book, onSelect }: BookCardProps) => {
  const BookIcon = book.is_storage_file ? FileText : BookMarked;
  
  return (
    <div 
      className="group relative flex flex-col overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-b from-purple-600/10 via-purple-500/5 to-purple-400/10 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Book cover area with enhanced styling */}
      <div className="aspect-[2/3] w-full overflow-hidden rounded-t-xl bg-gradient-to-b from-purple-600/20 via-purple-500/10 to-purple-400/20 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.1)_0%,transparent_70%)]"></div>
        <BookIcon className="h-16 w-16 text-purple-500 opacity-80 group-hover:scale-110 transition-transform duration-300" />
        
        {/* Glowing effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="text-lg font-medium leading-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">{book.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{book.author}</p>
          
          <div className="flex flex-wrap gap-1 mt-3">
            {book.traditions.slice(0, 2).map((tradition) => (
              <Badge key={tradition} variant="outline" className="text-xs bg-purple-500/10 hover:bg-purple-500/20 border-purple-500/30">
                {tradition}
              </Badge>
            ))}
            {book.traditions.length > 2 && (
              <Badge variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">
                +{book.traditions.length - 2}
              </Badge>
            )}
          </div>
          
          {book.is_storage_file && (
            <div className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 mt-2">
              <FileText className="h-3 w-3" />
              <span>PDF from Storage</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-fuchsia-500/30 transition-all duration-300"
            onClick={() => onSelect(book.id)}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            {book.is_storage_file ? 'Open PDF' : 'Read Now'}
          </Button>
        </div>
      </div>
      
      {/* Enhanced hover effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"></div>
    </div>
  );
};

const BookListItem = ({ book, onSelect }: BookCardProps) => {
  const BookIcon = book.is_storage_file ? FileText : BookMarked;
  
  return (
    <div 
      className="group flex justify-between items-center p-4 my-2 rounded-lg hover:bg-purple-500/10 transition-all duration-300 border border-transparent hover:border-purple-500/30 cursor-pointer"
      onClick={() => onSelect(book.id)}
    >
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 bg-gradient-to-br from-purple-600/30 to-purple-400/30 rounded-lg flex items-center justify-center relative overflow-hidden">
          <BookIcon className="h-6 w-6 text-purple-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div>
          <h3 className="font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">{book.title}</h3>
          <p className="text-sm text-muted-foreground">{book.author}</p>
          {book.is_storage_file && (
            <span className="text-xs text-blue-600 dark:text-blue-400">PDF from Storage</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="hidden md:flex gap-1">
          {book.traditions.slice(0, 1).map((tradition) => (
            <Badge key={tradition} variant="outline" className="text-xs bg-purple-500/10 border-purple-500/30">
              {tradition}
            </Badge>
          ))}
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="text-purple-600 hover:text-purple-700 hover:bg-purple-500/10 border border-purple-500/30 bg-purple-500/10"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(book.id);
          }}
        >
          <BookOpen className="h-4 w-4" />
          <span className="sr-only">Read</span>
        </Button>
      </div>
    </div>
  );
};

export default BookShelf;