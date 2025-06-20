
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SpiritualBook } from '@/types/books';

interface TextViewerProps {
  book: SpiritualBook;
}

const TextViewer = ({ book }: TextViewerProps) => {
  const [currentPage, setCurrentPage] = useState(0);
  
  const pages = book.content?.split('---PAGE---') || ['No content available'];
  const totalPages = pages.length;
  
  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };
  
  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-3 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-transparent">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <span className="text-sm text-muted-foreground">by {book.author}</span>
        </div>
      </div>
      
      <div className="flex-1 flex">
        <div className="w-10 flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="rounded-full hover:bg-purple-500/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
        
        <div className="flex-1 p-4">
          <ScrollArea 
            className="h-full rounded-lg border border-purple-500/20 p-6 bg-gradient-to-b from-amber-50/80 to-orange-50/80 dark:from-gray-900/80 dark:to-gray-800/80"
          >
            <div className="max-w-2xl mx-auto">
              <div className="scroll-page animate-unfold parchment-glow flex flex-col">
                <div className="text-content animate-ink-appear space-y-4 whitespace-pre-wrap">
                  {pages[currentPage].split('\n\n').map((paragraph, idx) => (
                    <p key={idx} className="text-base leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
        
        <div className="w-10 flex items-center justify-center">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="rounded-full hover:bg-purple-500/10"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <div className="p-3 border-t border-purple-500/20 flex justify-between items-center text-sm">
        <span>Page {currentPage + 1} of {totalPages}</span>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="btn-cosmic h-8"
          >
            Previous
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="btn-cosmic h-8"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TextViewer;
