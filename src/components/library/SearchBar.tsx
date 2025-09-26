import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChange, placeholder = "Search..." }: SearchBarProps) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-3 bg-background/80 backdrop-blur-sm border border-purple-500/20 focus:border-purple-500/50 rounded-lg w-full max-w-md transition-all duration-300 focus:ring-2 focus:ring-purple-500/30"
      />
    </div>
  );
};

export default SearchBar;