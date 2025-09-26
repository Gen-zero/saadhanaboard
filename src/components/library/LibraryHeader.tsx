import React from "react";
import { BookOpen, AlignCenter, Loader2, Grid, List, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="flex justify-between items-center flex-wrap gap-3">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
        <BookOpen className="h-6 w-6 text-purple-500" />
        <span>Spiritual Library</span>
        <span className="text-sm text-muted-foreground ml-1 italic font-normal">
          Sacred Texts & Practices
        </span>
      </h1>
      
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 cosmic-highlight bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
          onClick={toggleView}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : view === "grid" ? (
            <>
              <List className="h-4 w-4" />
              <span>List View</span>
            </>
          ) : (
            <>
              <Grid className="h-4 w-4" />
              <span>Grid View</span>
            </>
          )}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
          onClick={() => navigate('/store')}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Store</span>
        </Button>
      </div>
    </div>
  );
};

export default LibraryHeader;