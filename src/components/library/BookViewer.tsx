
import { useEffect, useRef, useState } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize, Minimize, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSpiritualBooks } from '@/hooks/useSpiritualBooks';
import { useToast } from '@/components/ui/use-toast';

interface BookViewerProps {
  bookId: string;
  onClose: () => void;
}

const BookViewer = ({ bookId, onClose }: BookViewerProps) => {
  const { books } = useSpiritualBooks();
  const book = books.find(b => b.id === bookId);
  const [currentPage, setCurrentPage] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [pdfContent, setPdfContent] = useState<string>('');
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const { toast } = useToast();
  
  // Handle PDF content loading
  useEffect(() => {
    const loadPdfContent = async () => {
      if (book?.is_storage_file && book.storage_url && !pdfContent) {
        setIsLoadingPdf(true);
        try {
          const response = await fetch(book.storage_url);
          const arrayBuffer = await response.arrayBuffer();
          const uint8Array = new Uint8Array(arrayBuffer);
          
          // Dynamic import to handle pdf-parse
          const pdfParse = await import('pdf-parse');
          const data = await (pdfParse as any).default(uint8Array);
          
          setPdfContent(data.text);
          toast({
            title: "PDF loaded successfully",
            description: `Extracted ${data.numpages} pages from ${book.title}`,
          });
        } catch (error) {
          console.error('Error loading PDF:', error);
          setPdfContent('Failed to load PDF content. Please try again.');
          toast({
            title: "PDF loading failed",
            description: "Could not extract text from the PDF file.",
            variant: "destructive",
          });
        } finally {
          setIsLoadingPdf(false);
        }
      }
    };

    loadPdfContent();
  }, [book, pdfContent, toast]);

  const content = book?.is_storage_file ? pdfContent : book?.content;
  const pages = content?.split('---PAGE---') || ['No content available'];
  const totalPages = pages.length;
  
  useEffect(() => {
    if (fullscreen && viewerRef.current) {
      if (viewerRef.current.requestFullscreen) {
        viewerRef.current.requestFullscreen();
      }
    } else if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [fullscreen]);
  
  if (!book) return null;
  
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
  
  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  return (
    <div 
      ref={viewerRef}
      className={`relative flex flex-col w-full h-full rounded-lg border border-purple-500/20 overflow-hidden ${
        fullscreen ? 'fixed inset-0 z-50 bg-background p-6' : 'min-h-[600px]'
      }`}
    >
      <div className="flex items-center justify-between p-3 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-transparent">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{book.title}</h2>
          <span className="text-sm text-muted-foreground">by {book.author}</span>
          <span className={`text-xs px-2 py-1 rounded ${
            book.is_storage_file 
              ? 'bg-blue-500/20 text-blue-700' 
              : 'bg-green-500/20 text-green-700'
          }`}>
            {book.is_storage_file ? (
              <>
                <FileText className="inline h-3 w-3 mr-1" />
                Storage PDF
              </>
            ) : (
              'User Upload'
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
            className="hover:bg-purple-500/10"
          >
            {fullscreen ? (
              <Minimize className="h-5 w-5" />
            ) : (
              <Maximize className="h-5 w-5" />
            )}
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onClose}
            className="hover:bg-purple-500/10"
          >
            <X className="h-5 w-5" />
          </Button>
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
                {isLoadingPdf ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading PDF content...</p>
                  </div>
                ) : (
                  <div className="text-content animate-ink-appear space-y-4 whitespace-pre-wrap">
                    {pages[currentPage].split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-base leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
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

export default BookViewer;
