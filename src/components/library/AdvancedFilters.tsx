import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { BookFilters } from '@/types/books';

interface AdvancedFiltersProps {
  filters: BookFilters;
  onFiltersChange: (next: BookFilters) => void;
  languages?: string[];
  yearRange?: { min: number | null; max: number | null };
  traditions?: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ filters, onFiltersChange, languages = [], yearRange, traditions = [] }) => {
  const min = yearRange?.min ?? 1800;
  const max = yearRange?.max ?? new Date().getFullYear();
  const safeMin = Number.isFinite(filters.minYear as number) ? (filters.minYear as number) : min;
  const safeMax = Number.isFinite(filters.maxYear as number) ? (filters.maxYear as number) : max;

  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v)));
  const sliderValue = [clamp(safeMin), clamp(safeMax)];

  const patch = (partial: Partial<BookFilters>) => {
    const next: BookFilters = { ...(filters || {}), ...partial } as BookFilters;
    onFiltersChange(next);
  };

  return (
    <div className="p-3 bg-background/70 rounded-md border border-purple-200/10 flex gap-3 flex-wrap items-center">
      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Traditions</label>
        <select
          multiple
          value={filters.traditions || []}
          onChange={(e) => {
            const opts = Array.from(e.target.selectedOptions).map(o => o.value);
            patch({ traditions: opts });
          }}
          className="select select-sm"
        >
          <option value="" disabled hidden>Choose traditions</option>
          {traditions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Language</label>
        <Select onValueChange={(v) => patch({ language: v === 'all' ? undefined : v })} value={filters.language || 'all'}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {languages.map((l) => (
              <SelectItem key={l} value={l}>{l}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Sort</label>
  <Select onValueChange={(v: any) => patch({ sortBy: v || undefined })} value={(filters.sortBy ?? 'created_at') as 'created_at' | 'title' | 'language' | 'year' | 'author'}>
          <SelectTrigger className="w-[140px]"><SelectValue placeholder="Newest"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest</SelectItem>
            <SelectItem value="title">Title</SelectItem>
            <SelectItem value="author">Author</SelectItem>
            <SelectItem value="year">Year</SelectItem>
            <SelectItem value="language">Language</SelectItem>
          </SelectContent>
        </Select>

  <Select onValueChange={(v: any) => patch({ sortOrder: v || undefined })} value={(filters.sortOrder ?? 'desc') as 'asc' | 'desc'}>
          <SelectTrigger className="w-[100px]"><SelectValue placeholder="Desc"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Desc</SelectItem>
            <SelectItem value="asc">Asc</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-muted-foreground">Type</label>
  <Select onValueChange={(v: any) => patch({ fileType: v || undefined })} value={(filters.fileType ?? 'all') as 'all' | 'pdf' | 'text'}>
          <SelectTrigger className="w-[120px]"><SelectValue placeholder="All"/></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="text">Text</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-3 w-full">
        <label className="text-sm text-muted-foreground">Year Range</label>
        <div className="flex items-center gap-2 w-72">
          <input
            type="number"
            value={sliderValue[0] ?? ''}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') {
                // clear filter => restore to bounds
                patch({ minYear: undefined });
                return;
              }
              const n = Number(raw);
              if (Number.isNaN(n)) return;
              const v = clamp(n);
              patch({ minYear: v });
            }}
            className="input input-sm w-20"
          />
          <div className="flex-1">
            <Slider min={min} max={max} value={sliderValue} onValueChange={(vals: any) => {
              const a = clamp(vals[0]);
              const b = clamp(vals[1]);
              patch({ minYear: a, maxYear: b });
            }} />
          </div>
          <input
            type="number"
            value={sliderValue[1] ?? ''}
            onChange={(e) => {
              const raw = e.target.value;
              if (raw === '') {
                patch({ maxYear: undefined });
                return;
              }
              const n = Number(raw);
              if (Number.isNaN(n)) return;
              const v = clamp(n);
              patch({ maxYear: v });
            }}
            className="input input-sm w-20"
          />
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;
