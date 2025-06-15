
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
  AlertCircle
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

interface Saadhana {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category: 'daily' | 'goal';
  dueDate?: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

const Saadhanas = () => {
  const [saadhanas, setSaadhanas] = useState<Saadhana[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddingSaadhana, setIsAddingSaadhana] = useState(false);
  const [editingSaadhana, setEditingSaadhana] = useState<Saadhana | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const [newSaadhana, setNewSaadhana] = useState<Omit<Saadhana, 'id'>>({
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

  const handleAddSaadhana = () => {
    if (!newSaadhana.title.trim()) {
      toast({
        title: "Saadhana title required",
        description: "Please provide a title for your saadhana.",
        variant: "destructive"
      });
      return;
    }
    
    const newSaadhanaWithId: Saadhana = {
      ...newSaadhana,
      id: Date.now()
    };
    
    setSaadhanas([...saadhanas, newSaadhanaWithId]);
    
    // Reset form
    setNewSaadhana({
      title: '',
      description: '',
      completed: false,
      category: 'daily',
      dueDate: new Date().toISOString().split('T')[0],
      time: '09:00',
      priority: 'medium',
      tags: []
    });
    
    setIsAddingSaadhana(false);
    
    toast({
      title: "Saadhana added",
      description: "Your saadhana has been successfully added."
    });
  };

  const handleUpdateSaadhana = () => {
    if (!editingSaadhana) return;
    
    if (!editingSaadhana.title.trim()) {
      toast({
        title: "Saadhana title required",
        description: "Please provide a title for your saadhana.",
        variant: "destructive"
      });
      return;
    }
    
    setSaadhanas(saadhanas.map(saadhana => 
      saadhana.id === editingSaadhana.id ? editingSaadhana : saadhana
    ));
    
    setEditingSaadhana(null);
    
    toast({
      title: "Saadhana updated",
      description: "Your saadhana has been successfully updated."
    });
  };

  const handleDeleteSaadhana = (id: number) => {
    setSaadhanas(saadhanas.filter(saadhana => saadhana.id !== id));
    
    toast({
      title: "Saadhana deleted",
      description: "Your saadhana has been deleted."
    });
  };

  const toggleSaadhanaCompletion = (id: number) => {
    setSaadhanas(prevSaadhanas => prevSaadhanas.map(saadhana => 
      saadhana.id === id ? { ...saadhana, completed: !saadhana.completed } : saadhana
    ));
    
    const saadhana = saadhanas.find(t => t.id === id);
    
    toast({
      title: saadhana?.completed ? "Saadhana incomplete" : "Saadhana completed",
      description: saadhana?.completed 
        ? "Saadhana marked as incomplete." 
        : "Great job! Your saadhana is complete."
    });
  };

  // Filter and search saadhanas
  const filteredSaadhanas = saadhanas.filter(saadhana => {
    // Filter by tab
    if (activeTab === 'daily' && saadhana.category !== 'daily') return false;
    if (activeTab === 'goals' && saadhana.category !== 'goal') return false;
    if (activeTab === 'completed' && !saadhana.completed) return false;
    if (activeTab === 'incomplete' && saadhana.completed) return false;
    
    // Filter by priority
    if (filter !== 'all' && saadhana.priority !== filter) return false;
    
    // Filter by search query
    if (searchQuery && !saadhana.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
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
    
    const saadhanaDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const saadhanaDateStart = new Date(saadhanaDate);
    saadhanaDateStart.setHours(0, 0, 0, 0);
    
    if (saadhanaDateStart.getTime() === today.getTime()) {
      return 'Today';
    } else if (saadhanaDateStart.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return saadhanaDate.toLocaleDateString('en-US', {
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
          <Dialog open={isAddingSaadhana} onOpenChange={setIsAddingSaadhana}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Saadhana
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Saadhana</DialogTitle>
                <DialogDescription>
                  Create a new saadhana for your spiritual practice or goal.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Saadhana title"
                    value={newSaadhana.title}
                    onChange={(e) => setNewSaadhana({...newSaadhana, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Saadhana description"
                    value={newSaadhana.description || ''}
                    onChange={(e) => setNewSaadhana({...newSaadhana, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newSaadhana.category}
                      onValueChange={(value: 'daily' | 'goal') => setNewSaadhana({...newSaadhana, category: value})}
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
                      value={newSaadhana.priority}
                      onValueChange={(value: 'low' | 'medium' | 'high') => setNewSaadhana({...newSaadhana, priority: value})}
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
                      value={newSaadhana.dueDate || ''}
                      onChange={(e) => setNewSaadhana({...newSaadhana, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newSaadhana.time || ''}
                      onChange={(e) => setNewSaadhana({...newSaadhana, time: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingSaadhana(false)}>Cancel</Button>
                <Button onClick={handleAddSaadhana}>Add Saadhana</Button>
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

        {/* Saadhana list for all tabs */}
        <TabsContent value={activeTab} className="mt-4">
          {sortedSaadhanas.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">No saadhanas found</h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery || filter !== 'all' 
                  ? "Try changing your search or filter settings." 
                  : "Create your first saadhana by clicking the 'Add Saadhana' button."}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddingSaadhana(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Saadhana
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {sortedSaadhanas.map(saadhana => (
                <Card key={saadhana.id} className={`hover-lift transition-all ${saadhana.completed ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`saadhana-${saadhana.id}`}
                          checked={saadhana.completed}
                          onCheckedChange={() => toggleSaadhanaCompletion(saadhana.id)}
                          className="mt-1"
                        />
                        <div>
                          <CardTitle className={`text-xl ${saadhana.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {saadhana.title}
                          </CardTitle>
                          {saadhana.description && (
                            <CardDescription className="mt-1">
                              {saadhana.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={editingSaadhana?.id === saadhana.id} onOpenChange={(open) => {
                          if (open) {
                            setEditingSaadhana(saadhana);
                          } else {
                            setEditingSaadhana(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Edit Saadhana</DialogTitle>
                              <DialogDescription>
                                Update your saadhana details.
                              </DialogDescription>
                            </DialogHeader>
                            {editingSaadhana && (
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-title">Title</Label>
                                  <Input
                                    id="edit-title"
                                    placeholder="Saadhana title"
                                    value={editingSaadhana.title}
                                    onChange={(e) => setEditingSaadhana({...editingSaadhana, title: e.target.value})}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    placeholder="Saadhana description"
                                    value={editingSaadhana.description || ''}
                                    onChange={(e) => setEditingSaadhana({...editingSaadhana, description: e.target.value})}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select
                                      value={editingSaadhana.category}
                                      onValueChange={(value: 'daily' | 'goal') => setEditingSaadhana({...editingSaadhana, category: value})}
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
                                      value={editingSaadhana.priority}
                                      onValueChange={(value: 'low' | 'medium' | 'high') => setEditingSaadhana({...editingSaadhana, priority: value})}
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
                                      value={editingSaadhana.dueDate || ''}
                                      onChange={(e) => setEditingSaadhana({...editingSaadhana, dueDate: e.target.value})}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-time">Time</Label>
                                    <Input
                                      id="edit-time"
                                      type="time"
                                      value={editingSaadhana.time || ''}
                                      onChange={(e) => setEditingSaadhana({...editingSaadhana, time: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <div className="flex items-center gap-2">
                                    <Switch 
                                      checked={editingSaadhana.completed}
                                      onCheckedChange={(checked) => setEditingSaadhana({...editingSaadhana, completed: checked})}
                                    />
                                    <Label>Mark as completed</Label>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingSaadhana(null)}>Cancel</Button>
                              <Button onClick={handleUpdateSaadhana}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteSaadhana(saadhana.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className={`flex items-center gap-1 ${getPriorityColor(saadhana.priority)}`}>
                        <AlertCircle className="h-3 w-3" />
                        {saadhana.priority.charAt(0).toUpperCase() + saadhana.priority.slice(1)} Priority
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {saadhana.category === 'daily' ? (
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
                      {saadhana.dueDate && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(saadhana.dueDate)}
                        </Badge>
                      )}
                      {saadhana.time && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {saadhana.time}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Saadhanas;
