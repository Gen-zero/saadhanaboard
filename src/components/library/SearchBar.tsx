import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { api } from '@/services/api';
import type { BookSuggestion } from '@/types/books';

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  onSelectSuggestion?: (suggestion: BookSuggestion) => void;
}

const SearchBar = ({ value, onChange, placeholder = "Search...", onSelectSuggestion }: SearchBarProps) => {
  const [suggestions, setSuggestions] = useState<BookSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = async () => {
      try {
        if (!value || value.trim().length < 2) {
          setSuggestions([]);
          setOpen(false);
          return;
        }
  const res = await api.getBookSuggestions(value, 6);
  const s: BookSuggestion[] = res.suggestions || [];
  setSuggestions(s);
        setOpen(s.length > 0);
      } catch (e) {
        setSuggestions([]);
        setOpen(false);
      }
    };

    const t = setTimeout(handler, 250);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  const handleSelect = (s: BookSuggestion) => {
    if (onSelectSuggestion) onSelectSuggestion(s);
    setOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>
      <Input
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-autocomplete="list"
        aria-expanded={open}
        className="pl-10 pr-4 py-3 bg-background/80 backdrop-blur-sm border border-purple-500/20 focus:border-purple-500/50 rounded-lg w-full max-w-md transition-transform duration-200 focus:ring-2 focus:ring-purple-500/30"
      />

      {open && suggestions.length > 0 && (
        <ul role="listbox" className="absolute z-50 mt-1 w-full max-w-md bg-popover border border-border rounded-md shadow-lg overflow-hidden">
          {suggestions.map(s => (
            <li key={s.id || `${s.title}-${s.author}` } role="option" className="p-2 hover:bg-accent/20 cursor-pointer" onClick={() => handleSelect(s)}>
              <div className="font-medium">{s.title}</div>
              {s.author && <div className="text-xs text-muted-foreground">{s.author}</div>}
              {s.tradition && <div className="text-xs text-muted-foreground">{s.tradition}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBar;