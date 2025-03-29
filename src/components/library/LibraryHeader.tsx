
import React from "react";
import { BookOpen, Sparkles, AlignCenter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LibraryHeaderProps {
  dataSource: "local" | "api";
  view: "grid" | "list";
  isLoading: boolean;
  toggleDataSource: () => void;
  toggleView: () => void;
}

const LibraryHeader = ({
  dataSource,
  view,
  isLoading,
  toggleDataSource,
  toggleView
}: LibraryHeaderProps) => {
  return (
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
          onClick={toggleView}
        >
          <AlignCenter className="h-4 w-4" />
          <span>{view === "grid" ? "List View" : "Grid View"}</span>
        </Button>
      </div>
    </div>
  );
};

export default LibraryHeader;
