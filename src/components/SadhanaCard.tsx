import { useState } from 'react';
import { SharedSadhana, PrivacyLevel } from '@/types/sadhana';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Edit, Trash2, MessageSquare, Clock, Calendar, Sparkles, Share2, Heart } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface SadhanaCardProps {
  sadhana: SharedSadhana;
  onUpdate?: (sadhana: SharedSadhana) => void;
  onDelete?: (id: number) => void;
  onToggleCompletion?: (id: number) => void;
  onShare?: (id: number, privacy: PrivacyLevel) => void;
  onLike?: (id: number) => void;
  onComment?: (id: number) => void;
  showSocialFeatures?: boolean;
}

const SadhanaCard = ({ sadhana, onUpdate, onDelete, onToggleCompletion, onShare, onLike, onComment, showSocialFeatures = false }: SadhanaCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [selectedPrivacy, setSelectedPrivacy] = useState<PrivacyLevel>('public');
  const [isSharing, setIsSharing] = useState(false);
  const { toast } = useToast();

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
      "backdrop-blur-sm border border-purple-500/20 bg-transparent rounded-xl",
      sadhana.completed && "opacity-75",
      isSadhanaTask && "border-purple-300 bg-gradient-to-r from-purple-900/30 to-indigo-900/30 shadow-lg shadow-purple-500/10",
      !isSadhanaTask && "bg-gradient-to-r from-purple-900/10 to-indigo-900/10 hover:border-purple-500/40 hover:shadow-purple-500/20 hover:from-purple-900/20 hover:to-indigo-900/20"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Checkbox
              checked={sadhana.completed}
              onCheckedChange={() => onToggleCompletion?.(sadhana.id)}
              className="mt-0.5 shrink-0"
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className={cn(
                  "font-semibold text-base leading-tight",
                  sadhana.completed && "line-through text-muted-foreground"
                )}>
                  {sadhana.title}
                </h3>
                {isSadhanaTask && (
                  <Sparkles className="h-4 w-4 text-purple-500 shrink-0" />
                )}
              </div>
              
              {sadhana.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {sadhana.description}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className={cn("text-xs px-2 py-1 h-auto", getPriorityColor(sadhana.priority))}>
                  {sadhana.priority}
                </Badge>
                
                <Badge variant="outline" className="text-xs px-2 py-1 h-auto flex items-center gap-1 bg-purple-500/10 text-purple-300 border-purple-500/30">
                  {getCategoryIcon(sadhana.category)}
                  <span>{sadhana.category}</span>
                </Badge>
                
                {sadhana.dueDate && (
                  <Badge variant="outline" className="text-xs px-2 py-1 h-auto bg-cyan-500/10 text-cyan-300 border-cyan-500/30">
                    {format(new Date(sadhana.dueDate), 'MMM dd')}
                  </Badge>
                )}
                
                {sadhana.time && (
                  <Badge variant="outline" className="text-xs px-2 py-1 h-auto bg-slate-500/10 text-slate-300 border-slate-500/30">
                    {sadhana.time}
                  </Badge>
                )}

                {sadhana.tags?.map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className={cn(
                      "text-xs px-2 py-1 h-auto",
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
          
          <div className="flex items-center gap-2">
            {showSocialFeatures && (
              <div className="flex items-center gap-2">
                <button onClick={() => onLike?.(sadhana.id)} className="p-1 rounded hover:bg-gray-800/20">
                  <Heart className={cn('h-4 w-4', sadhana.userHasLiked && 'text-red-400')} />
                </button>
                <button onClick={() => onComment?.(sadhana.id)} className="p-1 rounded hover:bg-gray-800/20">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            )}

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
                <DropdownMenuItem onClick={() => setIsShareDialogOpen(true)}>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onDelete(sadhana.id)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share Sadhana</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">Choose who can see this sadhana</p>
                <Select onValueChange={(val) => setSelectedPrivacy(val as PrivacyLevel)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Privacy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public</SelectItem>
                    <SelectItem value="friends">Friends (coming soon)</SelectItem>
                    <SelectItem value="private">Private</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setIsShareDialogOpen(false)}>Cancel</Button>
                  <Button onClick={async () => {
                    try {
                      setIsSharing(true);
                      await api.shareSadhana(sadhana.id, selectedPrivacy);
                      toast({ title: 'Sadhana shared', description: 'Your sadhana is now shared' });
                      onShare?.(sadhana.id, selectedPrivacy);
                      setIsShareDialogOpen(false);
                    } catch (e) {
                      toast({ title: 'Error', description: e?.message || 'Failed to share' });
                    } finally {
                      setIsSharing(false);
                    }
                  }} disabled={isSharing}>{isSharing ? 'Sharing...' : 'Share'}</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default SadhanaCard;