import React from "react";
import { Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const LibraryLoading = () => {
  return (
    <div className="space-y-6">
      {/* Header loading */}
      <Card className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 border-purple-500/20 p-6 animate-pulse">
        <div className="h-8 bg-purple-500/20 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-purple-500/10 rounded w-2/3"></div>
      </Card>
      
      {/* Content loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <Card key={index} className="overflow-hidden border border-purple-500/20 bg-gradient-to-b from-purple-600/10 via-purple-500/5 to-purple-400/10 backdrop-blur-sm animate-pulse">
            <div className="aspect-[2/3] w-full bg-purple-500/10"></div>
            <div className="p-4">
              <div className="h-5 bg-purple-500/20 rounded w-4/5 mb-2"></div>
              <div className="h-4 bg-purple-500/10 rounded w-3/5 mb-3"></div>
              <div className="h-4 bg-purple-500/10 rounded w-2/5 mb-4"></div>
              <div className="h-9 bg-purple-500/20 rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LibraryLoading;