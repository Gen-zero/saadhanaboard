
import { useEffect, useRef, useState } from 'react';
import { X, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSpiritualBooks } from '@/hooks/useSpiritualBooks';
import UnifiedViewer from './viewer/UnifiedViewer';

interface BookViewerProps {
  bookId: string;
  onClose: () => void;
}

const BookViewer = ({ bookId, onClose }: BookViewerProps) => {
  const { books } = useSpiritualBooks();
  const book = books.find(b => b.id === bookId);
  const [fullscreen, setFullscreen] = useState(false);
  const viewerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
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
      
      <div className="flex-1 overflow-hidden">
        <UnifiedViewer book={book} />
      </div>
    </div>
  );
};

export default BookViewer;
