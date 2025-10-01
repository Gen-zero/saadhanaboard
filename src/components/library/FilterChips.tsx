import React from 'react';
import type { BookFilters } from '@/types/books';

interface FilterChipsProps {
  filters: BookFilters;
  onRemoveFilter: (key: string, value?: any) => void;
}

const FilterChips: React.FC<FilterChipsProps> = ({ filters, onRemoveFilter }) => {
  const chips = [] as { key: string; label: string; payload?: any }[];
  if (filters.search) chips.push({ key: 'search', label: `Search: ${filters.search}`, payload: filters.search });
  if (filters.language) chips.push({ key: 'language', label: `Language: ${filters.language}`, payload: filters.language });
  if (filters.fileType && filters.fileType !== 'all') chips.push({ key: 'fileType', label: `Type: ${filters.fileType}`, payload: filters.fileType });
  if (filters.minYear) chips.push({ key: 'minYear', label: `From: ${filters.minYear}`, payload: filters.minYear });
  if (filters.maxYear) chips.push({ key: 'maxYear', label: `To: ${filters.maxYear}`, payload: filters.maxYear });
  if (filters.sortBy && filters.sortBy !== 'created_at') chips.push({ key: 'sort', label: `Sort: ${filters.sortBy} ${filters.sortOrder || ''}`, payload: { sortBy: filters.sortBy, sortOrder: filters.sortOrder } });
  if (Array.isArray(filters.traditions) && filters.traditions.length > 0) {
    filters.traditions.forEach((t: string) => chips.push({ key: 'tradition', label: `Tradition: ${t}`, payload: t }));
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex gap-2 flex-wrap">
      {chips.map((c, idx) => (
        <div key={`${c.key}-${idx}`} className="px-2 py-1 bg-purple-600/10 text-sm rounded-full border border-purple-300/10 flex items-center gap-2">
          <span>{c.label}</span>
          <button className="text-xs text-muted-foreground" onClick={() => onRemoveFilter(c.key, c.payload)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default FilterChips;
