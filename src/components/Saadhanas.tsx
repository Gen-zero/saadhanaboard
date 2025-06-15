import { useState } from 'react';
import { 
  CheckSquare, 
  Filter, 
  Plus, 
  Search,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useSaadhanas } from '@/hooks/useSaadhanas';
import { Sadhana } from '@/types/sadhana';
import SadhanaCard from './SadhanaCard';
import SadhanaForm from './SadhanaForm';

const SadhanaGroup = ({ title, sadhanas, onUpdate, onDelete, onToggleCompletion }: {
  title: string;
  sadhanas: Sadhana[];
  onUpdate: (sadhana: Sadhana) => void;
  onDelete: (id: number) => void;
  onToggleCompletion: (sadhana: Sadhana) => void;
}) => {
  if (!sadhanas || sadhanas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2 border-b pb-2">
        {title} 
        <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {sadhanas.length}
        </span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sadhanas.map(sadhana => (
          <SadhanaCard
            key={sadhana.id}
            sadhana={sadhana}
            onToggleCompletion={onToggleCompletion}
            onDelete={onDelete}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

const Saadhanas = () => {
  const {
    searchQuery, setSearchQuery,
    filter, setFilter,
    reflectingSadhana, setReflectingSadhana,
    reflectionText, setReflectionText,
    groupedSaadhanas,
    handleAddSadhana,
    handleUpdateSadhana,
    handleDeleteSadhana,
    handleToggleCompletion,
    handleSaveReflection
  } = useSaadhanas();

  const [isAddingSadhana, setIsAddingSadhana] = useState(false);
  const [newSadhana, setNewSadhana] = useState<Omit<Sadhana, 'id' | 'reflection'>>({
    title: '',
    description: '',
    completed: false,
    category: 'daily',
    dueDate: new Date().toISOString().split('T')[0],
    time: '09:00',
    priority: 'medium',
    tags: []
  });

  const onAddSadhana = () => {
    if (handleAddSadhana(newSadhana)) {
      setNewSadhana({
        title: '',
        description: '',
        completed: false,
        category: 'daily',
        dueDate: new Date().toISOString().split('T')[0],
        time: '09:00',
        priority: 'medium',
        tags: []
      });
      setIsAddingSadhana(false);
    }
  };

  const totalSaadhanas = Object.values(groupedSaadhanas).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <CheckSquare className="h-7 w-7 text-primary" />
          Saadhanas
        </h1>
        <p className="text-muted-foreground">
          Organize your spiritual practices and goals.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search saadhanas..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[130px]">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Priority</span>
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isAddingSadhana} onOpenChange={setIsAddingSadhana}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Sadhana
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Sadhana</DialogTitle>
                <DialogDescription>
                  Create a new sadhana for your spiritual practice or goal.
                </DialogDescription>
              </DialogHeader>
              <SadhanaForm sadhana={newSadhana} setSadhana={setNewSadhana} />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingSadhana(false)}>Cancel</Button>
                <Button onClick={onAddSadhana}>Add Sadhana</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="mt-4 space-y-8">
        {totalSaadhanas === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <CheckSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
            <h3 className="text-xl font-medium mb-2">No saadhanas found</h3>
            <p className="text-muted-foreground max-w-md">
              {searchQuery || filter !== 'all' 
                ? "Try changing your search or filter settings." 
                : "Create your first sadhana by clicking the 'Add Sadhana' button."}
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAddingSadhana(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Sadhana
            </Button>
          </div>
        ) : (
          <>
            <SadhanaGroup 
              title="Overdue" 
              sadhanas={groupedSaadhanas.overdue}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
            <SadhanaGroup 
              title="Today's Practice"
              sadhanas={groupedSaadhanas.today}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
            <SadhanaGroup 
              title="Upcoming"
              sadhanas={groupedSaadhanas.upcoming}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
            <SadhanaGroup 
              title="Goals & Aspirations"
              sadhanas={groupedSaadhanas.noDueDate}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
            
            {groupedSaadhanas.completed.length > 0 && (
              <Collapsible defaultOpen={false}>
                <CollapsibleTrigger className="w-full">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                      Completed
                      <span className="text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {groupedSaadhanas.completed.length}
                      </span>
                    </h2>
                    <Button variant="ghost" size="sm" className="w-auto">
                      <span className="mr-2">View</span>
                      <ChevronDown className="h-4 w-4 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-4">
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedSaadhanas.completed.map(sadhana => (
                        <SadhanaCard
                          key={sadhana.id}
                          sadhana={sadhana}
                          onToggleCompletion={handleToggleCompletion}
                          onDelete={handleDeleteSadhana}
                          onUpdate={handleUpdateSadhana}
                        />
                      ))}
                    </div>
                </CollapsibleContent>
              </Collapsible>
            )}
          </>
        )}
      </div>

      <Dialog open={!!reflectingSadhana} onOpenChange={(open) => {
        if (!open) {
          setReflectingSadhana(null);
          setReflectionText('');
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Sadhana: {reflectingSadhana?.title}</DialogTitle>
            <DialogDescription>
              Record a reflection on your practice. This can be a thought, a feeling, or an insight you gained.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="reflection">Your Reflection</Label>
            <Textarea
              id="reflection"
              placeholder="How was your practice today?"
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              className="mt-2 min-h-[120px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setReflectingSadhana(null); setReflectionText(''); }}>Cancel</Button>
            <Button onClick={handleSaveReflection}>Complete & Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Saadhanas;
