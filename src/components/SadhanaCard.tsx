
import { useState } from 'react';
import { Sadhana } from '@/types/sadhana';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, MessageSquare, Clock, Calendar, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SadhanaCardProps {
  sadhana: Sadhana;
  onUpdate: (sadhana: Sadhana) => void;
  onDelete: (id: number) => void;
  onToggleCompletion: (id: number) => void;
}

const SadhanaCard = ({ sadhana, onUpdate, onDelete, onToggleCompletion }: SadhanaCardProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'daily': return <Clock className="h-3 w-3" />;
      case 'goal': return <Calendar className="h-3 w-3" />;
      default: return null;
    }
  };

  const isSadhanaTask = sadhana.tags?.includes('sadhana') || sadhana.sadhanaId;

  const handleReflection = () => {
    // This would open a reflection dialog - implementation depends on parent component
    console.log('Open reflection for:', sadhana.id);
  };

  return (
    <Card className={cn(
      "group hover:shadow-md transition-all duration-300 cosmic-highlight",
      "backdrop-blur-sm border border-purple-500/20 bg-transparent",
      sadhana.completed && "opacity-75",
      isSadhanaTask && "border-purple-300 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 shadow-lg shadow-purple-500/10",
      !isSadhanaTask && "bg-gradient-to-r from-purple-900/10 to-indigo-900/10 hover:border-purple-500/40 hover:shadow-purple-500/20 hover:from-purple-900/20 hover:to-indigo-900/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Checkbox
              checked={sadhana.completed}
              onCheckedChange={() => onToggleCompletion(sadhana.id)}
              className="mt-0.5 shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className={cn(
                  "font-medium text-sm leading-tight",
                  sadhana.completed && "line-through text-muted-foreground"
                )}>
                  {sadhana.title}
                </h3>
                {isSadhanaTask && (
                  <Sparkles className="h-3 w-3 text-purple-500 shrink-0" />
                )}
              </div>
              
              {sadhana.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {sadhana.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className={cn("text-xs px-1.5 py-0.5 h-auto", getPriorityColor(sadhana.priority))}>
                  {sadhana.priority}
                </Badge>
                
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto flex items-center gap-1 bg-purple-500/10 text-purple-300 border-purple-500/30">
                  {getCategoryIcon(sadhana.category)}
                  {sadhana.category}
                </Badge>
                
                {sadhana.dueDate && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                    {format(new Date(sadhana.dueDate), 'MMM dd')}
                  </Badge>
                )}
                
                {sadhana.time && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto bg-slate-500/10 text-slate-300 border-slate-500/30">
                    {sadhana.time}
                  </Badge>
                )}

                {sadhana.tags?.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-1.5 py-0.5 h-auto",
                      tag === 'sadhana' && "bg-purple-500/20 text-purple-300 border-purple-500/40",
                      tag !== 'sadhana' && "bg-accent/20 text-accent-foreground border-accent/30"
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {sadhana.completed && (
                <DropdownMenuItem onClick={handleReflection}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Add Reflection
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => onDelete(sadhana.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default SadhanaCard;
