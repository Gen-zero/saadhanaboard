
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
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
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
      "group hover:shadow-md transition-all duration-200",
      sadhana.completed && "opacity-75",
      isSadhanaTask && "border-purple-200 bg-gradient-to-r from-purple-50/50 to-fuchsia-50/50"
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
                
                <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto flex items-center gap-1">
                  {getCategoryIcon(sadhana.category)}
                  {sadhana.category}
                </Badge>
                
                {sadhana.dueDate && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                    {format(new Date(sadhana.dueDate), 'MMM dd')}
                  </Badge>
                )}
                
                {sadhana.time && (
                  <Badge variant="outline" className="text-xs px-1.5 py-0.5 h-auto">
                    {sadhana.time}
                  </Badge>
                )}

                {sadhana.tags?.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-1.5 py-0.5 h-auto",
                      tag === 'sadhana' && "bg-purple-100 text-purple-700 border-purple-200"
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
