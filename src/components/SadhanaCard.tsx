
import { useState } from 'react';
import { Sadhana } from '@/types/sadhana';
import { 
  Calendar, CheckSquare, Clock, Star, Trash2, Edit3, Clock3, AlertCircle, MessageSquare 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import SadhanaForm from './SadhanaForm';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'text-red-500';
    case 'medium': return 'text-yellow-500';
    case 'low': return 'text-green-500';
    default: return 'text-primary';
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'No Date';
  const sadhanaDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const sadhanaDateStart = new Date(sadhanaDate);
  sadhanaDateStart.setHours(0, 0, 0, 0);
  if (sadhanaDateStart.getTime() === today.getTime()) return 'Today';
  if (sadhanaDateStart.getTime() === tomorrow.getTime()) return 'Tomorrow';
  return sadhanaDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

interface SadhanaCardProps {
  sadhana: Sadhana;
  onToggleCompletion: (sadhana: Sadhana) => void;
  onDelete: (id: number) => void;
  onUpdate: (sadhana: Sadhana) => void;
}

const SadhanaCard = ({ sadhana, onToggleCompletion, onDelete, onUpdate }: SadhanaCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSadhana, setEditingSadhana] = useState<Sadhana>(sadhana);

  const handleSaveChanges = () => {
    onUpdate(editingSadhana);
    setIsEditing(false);
  };

  return (
    <Card className={`flex flex-col hover-lift transition-all ${sadhana.completed ? 'bg-card/60 border-green-500/30' : ''}`}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-grow">
            <CardTitle className={`text-xl ${sadhana.completed ? 'line-through text-muted-foreground' : ''}`}>
              {sadhana.title}
            </CardTitle>
            {sadhana.description && (
              <CardDescription className="mt-1">
                {sadhana.description}
              </CardDescription>
            )}
          </div>
          <div className="shrink-0">
            <Button
              variant={sadhana.completed ? 'secondary' : 'default'}
              size="sm"
              onClick={() => onToggleCompletion(sadhana)}
              className="w-full"
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              {sadhana.completed ? 'Undo' : 'Complete'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4 flex-grow space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={`flex items-center gap-1 ${getPriorityColor(sadhana.priority)}`}>
            <AlertCircle className="h-3 w-3" />
            {sadhana.priority.charAt(0).toUpperCase() + sadhana.priority.slice(1)} Priority
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            {sadhana.category === 'daily' ? (
              <><Clock3 className="h-3 w-3" /> Daily Ritual</>
            ) : (
              <><Star className="h-3 w-3" /> Goal Oriented</>
            )}
          </Badge>
          {sadhana.dueDate && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(sadhana.dueDate)}
            </Badge>
          )}
          {sadhana.time && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {sadhana.time}
            </Badge>
          )}
        </div>
        {sadhana.reflection && (
          <div className="mt-4 p-3 bg-background/50 rounded-lg border border-border">
            <p className="text-sm font-semibold flex items-center gap-2 text-primary">
              <MessageSquare className="h-4 w-4" />
              Reflection
            </p>
            <p className="text-sm text-muted-foreground mt-1 italic">"{sadhana.reflection}"</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0 flex justify-end gap-2">
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" onClick={() => setEditingSadhana(sadhana)}>
              <Edit3 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Edit Sadhana</DialogTitle>
              <DialogDescription>Update your sadhana details.</DialogDescription>
            </DialogHeader>
            <SadhanaForm sadhana={editingSadhana} setSadhana={setEditingSadhana} isEditing />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSaveChanges}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button variant="ghost" size="icon" onClick={() => onDelete(sadhana.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SadhanaCard;
