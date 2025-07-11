
import { 
  CheckSquare, 
  Filter, 
  Plus, 
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useSaadhanas } from '@/hooks/useSaadhanas';
import SadhanaGroup from './SadhanaGroup';
import AddSadhana from './AddSadhana';
import ReflectionDialog from './ReflectionDialog';

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
          <AddSadhana onAddSadhana={handleAddSadhana} />
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
            <div className="mt-4">
              <AddSadhana 
                onAddSadhana={handleAddSadhana}
                triggerButton={
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Sadhana
                  </Button>
                }
              />
            </div>
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
              title="Daily Rituals"
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
            
            <SadhanaGroup
              title="Completed"
              isCollapsible={true}
              defaultOpen={false}
              sadhanas={groupedSaadhanas.completed}
              onUpdate={handleUpdateSadhana}
              onDelete={handleDeleteSadhana}
              onToggleCompletion={handleToggleCompletion}
            />
          </>
        )}
      </div>

      <ReflectionDialog 
        reflectingSadhana={reflectingSadhana}
        setReflectingSadhana={setReflectingSadhana}
        reflectionText={reflectionText}
        setReflectionText={setReflectionText}
        onSave={handleSaveReflection}
      />
    </div>
  );
};

export default Saadhanas;
