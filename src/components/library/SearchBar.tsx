
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
    <div className="flex items-center w-full max-w-md relative">
      <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 bg-background/80 backdrop-blur-sm border-purple-500/20 focus:border-purple-500/50"
      />
    </div>
  );
};

export default SearchBar;
