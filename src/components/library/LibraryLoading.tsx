
import React from "react";
import { Loader2 } from "lucide-react";

const LibraryLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className="h-8 w-8 text-purple-500 animate-spin mb-4" />
      <p className="text-muted-foreground">Loading spiritual texts from across realms...</p>
    </div>
  );
};

export default LibraryLoading;
