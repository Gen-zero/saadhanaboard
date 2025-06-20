
import { Button } from '@/components/ui/button';
import { X, Maximize, Minimize } from 'lucide-react';

interface BookViewerHeaderProps {
  title: string;
  author: string;
  fullscreen: boolean;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

const BookViewerHeader = ({ 
  title, 
  author, 
  fullscreen, 
  onToggleFullscreen, 
  onClose 
}: BookViewerHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-3 border-b border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-transparent">
      <div className="flex items-center gap-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <span className="text-sm text-muted-foreground">by {author}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleFullscreen}
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
  );
};

export default BookViewerHeader;
