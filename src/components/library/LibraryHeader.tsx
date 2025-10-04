import React from "react";
import { BookOpen, AlignCenter, Loader2, Grid, List, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

interface LibraryHeaderProps {
  view: "grid" | "list";
  isLoading: boolean;
  toggleView: () => void;
}

const LibraryHeader = ({
  view,
  isLoading,
  toggleView
}: LibraryHeaderProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center flex-wrap gap-3">
      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
        <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-purple-500" />
        <span>Spiritual Library</span>
        <span className="text-xs md:text-sm text-muted-foreground ml-1 italic font-normal hidden md:inline">
          Sacred Texts & Practices
        </span>
      </h1>
      
      <div className="flex gap-2 w-full md:w-auto">
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          className="flex items-center gap-1 cosmic-highlight bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 flex-1 md:flex-initial"
          onClick={toggleView}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : view === "grid" ? (
            <>
              <List className="h-4 w-4" />
              <span className="hidden sm:inline">List View</span>
            </>
          ) : (
            <>
              <Grid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid View</span>
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size={isMobile ? "default" : "sm"}
          className="flex items-center gap-1 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 flex-1 md:flex-initial"
          onClick={() => navigate('/store')}
        >
          <ShoppingCart className="h-4 w-4" />
          <span className="hidden sm:inline">Store</span>
        </Button>
      </div>
    </div>
  );
};

export default LibraryHeader;