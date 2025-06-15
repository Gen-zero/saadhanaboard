import { useState, useEffect } from 'react';
import { 
  Calendar, 
  CheckSquare, 
  Clock, 
  Filter, 
  Plus, 
  Search, 
  Star,
  Trash2,
  Edit3,
  Clock3,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface Sadhana {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category: 'daily' | 'goal';
  dueDate?: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
  reflection?: string;
}

const Saadhanas = () => {
  const [saadhanas, setSaadhanas] = useState<Sadhana[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddingSadhana, setIsAddingSadhana] = useState(false);
  const [editingSadhana, setEditingSadhana] = useState<Sadhana | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [reflectingSadhana, setReflectingSadhana] = useState<Sadhana | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  
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
  
  const { toast } = useToast();

  // Load saadhanas from localStorage on component mount
  useEffect(() => {
    const savedSaadhanas = localStorage.getItem('saadhanas');
    if (savedSaadhanas) {
      try {
        setSaadhanas(JSON.parse(savedSaadhanas));
      } catch (e) {
        console.error('Failed to parse saadhanas from localStorage:', e);
        // Initialize with empty array if parsing fails
        setSaadhanas([]);
      }
    }
  }, []);

  // Save saadhanas to localStorage whenever saadhanas state changes
  useEffect(() => {
    localStorage.setItem('saadhanas', JSON.stringify(saadhanas));
  }, [saadhanas]);

  const handleAddSadhana = () => {
    if (!newSadhana.title.trim()) {
      toast({
        title: "Sadhana title required",
        description: "Please provide a title for your sadhana.",
        variant: "destructive"
      });
      return;
    }
    
    const newSadhanaWithId: Sadhana = {
      ...newSadhana,
      id: Date.now()
    };
    
    setSaadhanas([...saadhanas, newSadhanaWithId]);
    
    // Reset form
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
    
    toast({
      title: "Sadhana added",
      description: "Your sadhana has been successfully added."
    });
  };

  const handleUpdateSadhana = () => {
    if (!editingSadhana) return;
    
    if (!editingSadhana.title.trim()) {
      toast({
        title: "Sadhana title required",
        description: "Please provide a title for your sadhana.",
        variant: "destructive"
      });
      return;
    }
    
    setSaadhanas(saadhanas.map(sadhana => 
      sadhana.id === editingSadhana.id ? editingSadhana : sadhana
    ));
    
    setEditingSadhana(null);
    
    toast({
      title: "Sadhana updated",
      description: "Your sadhana has been successfully updated."
    });
  };

  const handleDeleteSadhana = (id: number) => {
    setSaadhanas(saadhanas.filter(sadhana => sadhana.id !== id));
    
    toast({
      title: "Sadhana deleted",
      description: "Your sadhana has been deleted."
    });
  };

  const handleToggleCompletion = (sadhanaToToggle: Sadhana) => {
    if (sadhanaToToggle.completed) {
      // Mark as incomplete, remove reflection
      setSaadhanas(prevSaadhanas =>
        prevSaadhanas.map(sadhana =>
          sadhana.id === sadhanaToToggle.id
            ? { ...sadhana, completed: false, reflection: undefined }
            : sadhana
        )
      );
      toast({
        title: "Sadhana incomplete",
        description: "Your sadhana has been marked as incomplete."
      });
    } else {
      // Open reflection dialog to mark as complete
      setReflectingSadhana(sadhanaToToggle);
    }
  };

  const handleSaveReflection = () => {
    if (!reflectingSadhana) return;

    setSaadhanas(prevSaadhanas =>
      prevSaadhanas.map(sadhana =>
        sadhana.id === reflectingSadhana.id
          ? { ...sadhana, completed: true, reflection: reflectionText }
          : sadhana
      )
    );

    toast({
      title: "Sadhana Completed!",
      description: "Great job on your practice. Your reflection is saved."
    });

    setReflectingSadhana(null);
    setReflectionText('');
  };

  // Filter and search saadhanas
  const filteredSaadhanas = saadhanas.filter(sadhana => {
    // Filter by tab
    if (activeTab === 'daily' && sadhana.category !== 'daily') return false;
    if (activeTab === 'goals' && sadhana.category !== 'goal') return false;
    if (activeTab === 'completed' && !sadhana.completed) return false;
    if (activeTab === 'incomplete' && sadhana.completed) return false;
    
    // Filter by priority
    if (filter !== 'all' && sadhana.priority !== filter) return false;
    
    // Filter by search query
    if (searchQuery && !sadhana.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Sort saadhanas by priority and due date
  const sortedSaadhanas = [...filteredSaadhanas].sort((a, b) => {
    // First by completion status
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // Then by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    
    // Then by due date (if available)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    
    // Finally by title
    return a.title.localeCompare(b.title);
  });

  // Get color for priority
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-primary';
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'No Date';
    
    const sadhanaDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const sadhanaDateStart = new Date(sadhanaDate);
    sadhanaDateStart.setHours(0, 0, 0, 0);
    
    if (sadhanaDateStart.getTime() === today.getTime()) {
      return 'Today';
    } else if (sadhanaDateStart.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return sadhanaDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

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
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Sadhana title"
                    value={newSadhana.title}
                    onChange={(e) => setNewSadhana({...newSadhana, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Sadhana description"
                    value={newSadhana.description || ''}
                    onChange={(e) => setNewSadhana({...newSadhana, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newSadhana.category}
                      onValueChange={(value: 'daily' | 'goal') => setNewSadhana({...newSadhana, category: value})}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily Ritual</SelectItem>
                        <SelectItem value="goal">Goal Oriented</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select
                      value={newSadhana.priority}
                      onValueChange={(value: 'low' | 'medium' | 'high') => setNewSadhana({...newSadhana, priority: value})}
                    >
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Input
                      id="dueDate"
                      type="date"
                      value={newSadhana.dueDate || ''}
                      onChange={(e) => setNewSadhana({...newSadhana, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newSadhana.time || ''}
                      onChange={(e) => setNewSadhana({...newSadhana, time: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingSadhana(false)}>Cancel</Button>
                <Button onClick={handleAddSadhana}>Add Sadhana</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
        </TabsList>

        {/* Sadhana list for all tabs */}
        <TabsContent value={activeTab} className="mt-4">
          {sortedSaadhanas.length === 0 ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              {sortedSaadhanas.map(sadhana => (
                <Card key={sadhana.id} className={`flex flex-col hover-lift transition-all ${sadhana.completed ? 'bg-card/60 border-green-500/30' : ''}`}>
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
                            onClick={() => handleToggleCompletion(sadhana)}
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
                          <>
                            <Clock3 className="h-3 w-3" />
                            Daily Ritual
                          </>
                        ) : (
                          <>
                            <Star className="h-3 w-3" />
                            Goal Oriented
                          </>
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
                        <Dialog open={editingSadhana?.id === sadhana.id} onOpenChange={(open) => {
                          if (open) {
                            setEditingSadhana(sadhana);
                          } else {
                            setEditingSadhana(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Edit Sadhana</DialogTitle>
                              <DialogDescription>
                                Update your sadhana details.
                              </DialogDescription>
                            </DialogHeader>
                            {editingSadhana && (
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-title">Title</Label>
                                  <Input
                                    id="edit-title"
                                    placeholder="Sadhana title"
                                    value={editingSadhana.title}
                                    onChange={(e) => setEditingSadhana({...editingSadhana, title: e.target.value})}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    placeholder="Sadhana description"
                                    value={editingSadhana.description || ''}
                                    onChange={(e) => setEditingSadhana({...editingSadhana, description: e.target.value})}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select
                                      value={editingSadhana.category}
                                      onValueChange={(value: 'daily' | 'goal') => setEditingSadhana({...editingSadhana, category: value})}
                                    >
                                      <SelectTrigger id="edit-category">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="daily">Daily Ritual</SelectItem>
                                        <SelectItem value="goal">Goal Oriented</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-priority">Priority</Label>
                                    <Select
                                      value={editingSadhana.priority}
                                      onValueChange={(value: 'low' | 'medium' | 'high') => setEditingSadhana({...editingSadhana, priority: value})}
                                    >
                                      <SelectTrigger id="edit-priority">
                                        <SelectValue placeholder="Select priority" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="low">Low</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-dueDate">Due Date</Label>
                                    <Input
                                      id="edit-dueDate"
                                      type="date"
                                      value={editingSadhana.dueDate || ''}
                                      onChange={(e) => setEditingSadhana({...editingSadhana, dueDate: e.target.value})}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-time">Time</Label>
                                    <Input
                                      id="edit-time"
                                      type="time"
                                      value={editingSadhana.time || ''}
                                      onChange={(e) => setEditingSadhana({...editingSadhana, time: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <div className="flex items-center gap-2">
                                    <Switch 
                                      checked={editingSadhana.completed}
                                      onCheckedChange={(checked) => setEditingSadhana({...editingSadhana, completed: checked})}
                                    />
                                    <Label>Mark as completed</Label>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingSadhana(null)}>Cancel</Button>
                              <Button onClick={handleUpdateSadhana}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSadhana(sadhana.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Reflection Dialog */}
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
