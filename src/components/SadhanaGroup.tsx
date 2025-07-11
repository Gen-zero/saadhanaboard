
import { Sadhana } from '@/types/sadhana';
import SadhanaCard from './SadhanaCard';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface SadhanaGroupProps {
  title: string;
  sadhanas: Sadhana[];
  onUpdate: (sadhana: Sadhana) => void;
  onDelete: (id: number) => void;
  onToggleCompletion: (sadhana: Sadhana) => void;
  isCollapsible?: boolean;
  defaultOpen?: boolean;
}

const SadhanaGroup = ({ 
  title, 
  sadhanas, 
  onUpdate, 
  onDelete, 
  onToggleCompletion, 
  isCollapsible = false,
  defaultOpen = true,
}: SadhanaGroupProps) => {
  if (!sadhanas || sadhanas.length === 0) {
    return null;
  }

  const handleToggleCompletion = (id: number) => {
    const sadhana = sadhanas.find(s => s.id === id);
    if (sadhana) {
      onToggleCompletion(sadhana);
    }
  };

  const content = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sadhanas.map(sadhana => (
        <SadhanaCard
          key={sadhana.id}
          sadhana={sadhana}
          onToggleCompletion={handleToggleCompletion}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );

  if (isCollapsible) {
    return (
      <Collapsible defaultOpen={defaultOpen}>
        <CollapsibleTrigger className="w-full group">
          <div className="flex justify-between items-center border-b pb-2">
            <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
              {title}
              <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {sadhanas.length}
              </span>
            </h2>
            <Button variant="ghost" size="sm" className="w-auto p-2">
              <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </Button>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-4 animate-in fade-in-0 zoom-in-95">
           {content}
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 border-b pb-2">
        {title} 
        <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {sadhanas.length}
        </span>
      </h2>
      {content}
    </div>
  );
};

export default SadhanaGroup;
