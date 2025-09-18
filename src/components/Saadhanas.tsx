import { 
  CheckSquare, 
  Filter, 
  Plus, 
  Search
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sadhana } from '@/types/sadhana';
import { useSaadhanas } from '@/hooks/useSaadhanas';
import SadhanaGroup from './SadhanaGroup';
import AddSadhana from './AddSadhana';
import ReflectionDialog from './ReflectionDialog';
import CosmicBackgroundSimple from './sadhana/CosmicBackgroundSimple';
import { useSettings } from '@/hooks/useSettings';

const CosmicParticle = ({ delay }: { delay: number }) => {
  return (
    <div 
      className="absolute rounded-full bg-purple-500 opacity-0"
      style={{
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite, 
                    cosmic-pulse ${Math.random() * 4 + 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: Math.random() * 0.5 + 0.2
      }}
    ></div>
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

  const { settings } = useSettings();
  const [cosmicParticles, setCosmicParticles] = useState<number[]>([]);
  
  useEffect(() => {
    // Create cosmic particles
    const particles = Array.from({ length: 50 }, (_, i) => i);
    setCosmicParticles(particles);
  }, []);

  const totalSaadhanas = Object.values(groupedSaadhanas).reduce((sum, arr) => sum + arr.length, 0);

  // Check if Shiva theme is active
  const isShivaTheme = settings?.appearance?.colorScheme === 'shiva';

  // Wrapper function to handle the return type expected by AddSadhana
  const handleAddSadhanaWrapper = (newSadhana: Omit<Sadhana, 'id' | 'reflection'>): boolean => {
    try {
      // Convert the type to match what handleAddSadhana expects
      const sadhanaToAdd: Omit<Sadhana, 'id'> = {
        ...newSadhana,
        reflection: undefined
      };
      handleAddSadhana(sadhanaToAdd);
      return true;
    } catch (error) {
      console.error('Failed to add sadhana:', error);
      return false;
    }
  };

  // Type-safe filter handler
  const handleFilterChange = (value: string) => {
    if (value === 'all' || value === 'high' || value === 'medium' || value === 'low') {
      setFilter(value);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in cosmic-nebula-bg relative bg-transparent">
      <CosmicBackgroundSimple />
      
      {/* Cosmic particles - hidden for Shiva theme */}
      <div className={`fixed inset-0 pointer-events-none overflow-hidden ${isShivaTheme ? 'hidden' : ''}`}>
        {cosmicParticles.map((_, index) => (
          <CosmicParticle key={index} delay={index * 0.1} />
        ))}
      </div>
      <div className="backdrop-blur-sm bg-background/70 p-6 rounded-lg border border-purple-500/20">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
          <CheckSquare className="h-7 w-7 text-purple-500" />
          Saadhanas
        </h1>
        <p className="text-muted-foreground">
          Organize your spiritual practices and goals.
        </p>
      </div>

      <div className="backdrop-blur-sm bg-background/70 p-4 rounded-lg border border-purple-500/20">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search saadhanas..."
              className="pl-9 glass-effect"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={filter} onValueChange={handleFilterChange}>
              <SelectTrigger className="w-[130px] glass-effect">
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
            <AddSadhana onAddSadhana={handleAddSadhanaWrapper} />
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-8">
        {totalSaadhanas === 0 ? (
          <div className="backdrop-blur-sm bg-background/70 p-8 rounded-lg border border-purple-500/20">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckSquare className="h-16 w-16 text-purple-500/30 mb-4" />
              <h3 className="text-xl font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">No saadhanas found</h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery || filter !== 'all' 
                  ? "Try changing your search or filter settings." 
                  : "Create your first sadhana by clicking the 'Add Sadhana' button."}
              </p>
              <div className="mt-4">
                <AddSadhana 
                  onAddSadhana={handleAddSadhanaWrapper}
                  triggerButton={
                    <Button variant="outline" className="cosmic-button">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Sadhana
                    </Button>
                  }
                />
              </div>
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