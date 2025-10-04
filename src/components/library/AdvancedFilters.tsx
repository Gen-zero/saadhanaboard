import React, { useState, useEffect } from "react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  ChevronDown, 
  X,
  Save,
  Sparkles,
  Clock,
  BookMarked,
  Star,
  Flame
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import type { BookFilters } from "@/types/books";
import { FILTER_PRESETS, applyPreset } from "@/lib/filterPresets";
import { loadSavedFilters, addSavedFilter, deleteSavedFilter, updateLastUsed } from "@/lib/filterStorage";
import type { SavedFilter } from "@/types/books";

interface AdvancedFiltersProps {
  filters: BookFilters;
  onFiltersChange: (filters: Partial<BookFilters>) => void;
  languages?: string[];
  yearRange?: { min: number | null; max: number | null };
  traditions?: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({ 
  filters, 
  onFiltersChange, 
  languages = [], 
  yearRange, 
  traditions = [] 
}) => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [filterName, setFilterName] = useState('');
  const min = yearRange?.min ?? 1800;
  const max = yearRange?.max ?? new Date().getFullYear();
  const safeMin = Number.isFinite(filters.minYear as number) ? (filters.minYear as number) : min;
  const safeMax = Number.isFinite(filters.maxYear as number) ? (filters.maxYear as number) : max;

  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v)));
  // Ensure sliderValue is always ordered [low, high]
  const aVal = clamp(safeMin);
  const bVal = clamp(safeMax);
  const sliderValue = [Math.min(aVal, bVal), Math.max(aVal, bVal)];

  // Load saved filters on mount
  useEffect(() => {
    setSavedFilters(loadSavedFilters());
  }, []);

  const patch = (partial: Partial<BookFilters>) => {
    // Propagate partial changes directly to parent
    onFiltersChange(partial);
  };

  // Handle preset selection
  const handlePresetSelect = (presetId: string) => {
    const newFilters = applyPreset(presetId, filters);
    patch(newFilters);
    
    toast({
      title: "Preset Applied",
      description: `Applied "${FILTER_PRESETS.find(p => p.id === presetId)?.name}" filter preset`
    });
  };

  // Handle saving current filters
  const handleSaveFilter = () => {
    if (!filterName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your filter",
        variant: "destructive"
      });
      return;
    }

    const newSavedFilter = addSavedFilter(filterName, filters);
    setSavedFilters(prev => [newSavedFilter, ...prev]);
    setFilterName('');
    setShowSaveDialog(false);
    
    toast({
      title: "Filter Saved",
      description: "Your filter configuration has been saved"
    });
  };

  // Handle deleting a saved filter
  const handleDeleteFilter = (id: string) => {
    deleteSavedFilter(id);
    setSavedFilters(prev => prev.filter(f => f.id !== id));
    
    toast({
      title: "Filter Deleted",
      description: "Saved filter has been removed"
    });
  };

  // Check if there are active filters
  const hasActiveFilters = Boolean(
    (filters.search && filters.search.length > 0) ||
    (filters.traditions && filters.traditions.length > 0) ||
    filters.language ||
    filters.minYear ||
    filters.maxYear ||
    (filters.fileType && filters.fileType !== 'all') ||
    (filters.sortBy && filters.sortBy !== 'created_at') ||
    (filters.sortOrder && filters.sortOrder !== 'desc') ||
    filters.preset
  );

  // Get icon component for preset
  const getPresetIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Clock': return <Clock className="h-4 w-4" />;
      case 'BookMarked': return <BookMarked className="h-4 w-4" />;
      case 'Star': return <Star className="h-4 w-4" />;
      case 'Flame': return <Flame className="h-4 w-4" />;
      default: return <Sparkles className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-3 bg-background/70 rounded-md border border-purple-200/10 flex flex-col gap-3 md:gap-4">
      {/* Preset Filters Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs md:text-sm font-medium text-muted-foreground">Quick Filters</label>
          {hasActiveFilters && (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setShowSaveDialog(true)}
              className="h-8 text-xs"
            >
              <Save className="h-3 w-3 mr-1" />
              Save Filters
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {FILTER_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              variant={filters.preset === preset.id ? "default" : "outline"}
              size="sm"
              className={`h-8 text-xs ${filters.preset === preset.id ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500' : ''}`}
              onClick={() => handlePresetSelect(preset.id)}
            >
              {getPresetIcon(preset.icon)}
              <span className="ml-1">{preset.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Saved Filters Section */}
      {savedFilters.length > 0 && (
        <div className="flex flex-col gap-2">
          <label className="text-xs md:text-sm font-medium text-muted-foreground">Saved Filters</label>
          <div className="flex flex-wrap gap-2">
            {savedFilters.map((savedFilter) => (
              <div key={savedFilter.id} className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs rounded-r-none"
                  onClick={() => {
                    const next = { ...savedFilter.filters, offset: 0 };
                    patch(next);
                    updateLastUsed(savedFilter.id);
                    toast({
                      title: "Filter Applied",
                      description: `Applied saved filter "${savedFilter.name}"`
                    });
                  }}
                >
                  {savedFilter.name}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 rounded-l-none border-l-0"
                  onClick={() => handleDeleteFilter(savedFilter.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Filter Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Save Current Filters</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Enter filter name"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFilter}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Traditional Filters */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-4 flex-wrap items-center">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs md:text-sm font-medium text-muted-foreground">Traditions</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-11 md:h-10 w-full md:w-[220px] justify-between text-left font-normal">
                <span className="truncate">
                  {filters.traditions && filters.traditions.length > 0 ? `${filters.traditions.length} selected` : 'Select traditions'}
                </span>
                <ChevronDown className="ml-2" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[calc(100vw-2rem)] md:w-[220px] p-0">
              <div className="max-h-[300px] overflow-y-auto p-3 space-y-2">
                {traditions.map((t) => (
                  <label key={t} className="flex items-center gap-2 py-1">
                    <Checkbox
                      checked={Boolean(filters.traditions && filters.traditions.includes(t))}
                      onCheckedChange={(val) => {
                        // Guard against indeterminate state; only act on explicit true
                        const cur = filters.traditions || [];
                        if (val === true) {
                          patch({ traditions: Array.from(new Set([...cur, t])) });
                        } else if (val === false) {
                          patch({ traditions: cur.filter(x => x !== t) });
                        }
                      }}
                      className="h-5 w-5"
                    />
                    <span className="text-sm">{t}</span>
                  </label>
                ))}
                {filters.traditions && filters.traditions.length > 0 && (
                  <div className="pt-2 border-t mt-2 flex justify-end">
                    <Button size="sm" variant="ghost" onClick={() => patch({ traditions: [] })}>
                      <X className="mr-2" /> Clear
                    </Button>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs md:text-sm font-medium text-muted-foreground">Language</label>
          <Select onValueChange={(v) => patch({ language: v === 'all' ? undefined : v })} value={filters.language || 'all'}>
            <SelectTrigger className="w-full md:w-[160px] h-11 md:h-10">
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

        <div className="flex flex-col md:flex-row md:items-center gap-2 w-full md:w-auto">
          <label className="text-xs md:text-sm font-medium text-muted-foreground">Sort</label>
          <div className="flex gap-2">
            <Select onValueChange={(v: any) => patch({ sortBy: v || undefined })} value={(filters.sortBy ?? 'created_at') as 'created_at' | 'title' | 'language' | 'year' | 'author'}>
              <SelectTrigger className="w-full md:w-[140px] h-11 md:h-10">
                <SelectValue placeholder="Newest"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Newest</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="author">Author</SelectItem>
                <SelectItem value="year">Year</SelectItem>
                <SelectItem value="language">Language</SelectItem>
              </SelectContent>
            </Select>

            <Select onValueChange={(v: any) => patch({ sortOrder: v || undefined })} value={(filters.sortOrder ?? 'desc') as 'asc' | 'desc'}>
              <SelectTrigger className="w-full md:w-[100px] h-11 md:h-10">
                <SelectValue placeholder="Desc"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Desc</SelectItem>
                <SelectItem value="asc">Asc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs md:text-sm font-medium text-muted-foreground">Type</label>
          <Select onValueChange={(v: any) => patch({ fileType: v || undefined })} value={(filters.fileType ?? 'all') as 'all' | 'pdf' | 'text'}>
            <SelectTrigger className="w-full md:w-[120px] h-11 md:h-10">
              <SelectValue placeholder="All"/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="text">Text</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col w-full">
          <label className="text-xs md:text-sm font-medium text-muted-foreground mb-2">Year Range</label>
          <div className="flex flex-col md:flex-row items-center gap-3 w-full">
            <Input
              type="number"
              value={sliderValue[0] ?? ''}
              onChange={(e) => {
                const raw = e.target.value;
                if (raw === '') {
                  patch({ minYear: undefined });
                  return;
                }
                const n = Number(raw);
                if (Number.isNaN(n)) return;
                let v = clamp(n);
                // ensure min <= current max
                const currentMax = Number.isFinite(filters.maxYear as number) ? clamp(filters.maxYear as number) : max;
                if (v > currentMax) v = currentMax;
                patch({ minYear: v });
              }}
              className="w-full md:w-20 h-11 md:h-10"
              placeholder="Min"
            />
            <div className="w-full md:flex-1 px-2 py-2 md:py-0">
              <Slider min={min} max={max} value={sliderValue} onValueChange={(vals: any) => {
                const a = clamp(vals[0]);
                const b = clamp(vals[1]);
                patch({ minYear: a, maxYear: b });
              }} />
            </div>
            <Input
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
                let v = clamp(n);
                // ensure max >= current min
                const currentMin = Number.isFinite(filters.minYear as number) ? clamp(filters.minYear as number) : min;
                if (v < currentMin) v = currentMin;
                patch({ maxYear: v });
              }}
              className="w-full md:w-20 h-11 md:h-10"
              placeholder="Max"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFilters;