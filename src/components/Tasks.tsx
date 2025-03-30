
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

interface Task {
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

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  
  const [newTask, setNewTask] = useState<Omit<Task, 'id'>>({
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

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('saadhanaTasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Failed to parse tasks from localStorage:', e);
        // Initialize with empty array if parsing fails
        setTasks([]);
      }
    }
  }, []);

  // Save tasks to localStorage whenever tasks state changes
  useEffect(() => {
    localStorage.setItem('saadhanaTasks', JSON.stringify(tasks));
  }, [tasks]);

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Task title required",
        description: "Please provide a title for your task.",
        variant: "destructive"
      });
      return;
    }
    
    const newTaskWithId: Task = {
      ...newTask,
      id: Date.now()
    };
    
    setTasks([...tasks, newTaskWithId]);
    
    // Reset form
    setNewTask({
      title: '',
      description: '',
      completed: false,
      category: 'daily',
      dueDate: new Date().toISOString().split('T')[0],
      time: '09:00',
      priority: 'medium',
      tags: []
    });
    
    setIsAddingTask(false);
    
    toast({
      title: "Task added",
      description: "Your task has been successfully added."
    });
  };

  const handleUpdateTask = () => {
    if (!editingTask) return;
    
    if (!editingTask.title.trim()) {
      toast({
        title: "Task title required",
        description: "Please provide a title for your task.",
        variant: "destructive"
      });
      return;
    }
    
    setTasks(tasks.map(task => 
      task.id === editingTask.id ? editingTask : task
    ));
    
    setEditingTask(null);
    
    toast({
      title: "Task updated",
      description: "Your task has been successfully updated."
    });
  };

  const handleDeleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    
    toast({
      title: "Task deleted",
      description: "Your task has been deleted."
    });
  };

  const toggleTaskCompletion = (id: number) => {
    setTasks(prevTasks => prevTasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === id);
    
    toast({
      title: task?.completed ? "Task incomplete" : "Task completed",
      description: task?.completed 
        ? "Task marked as incomplete." 
        : "Great job! Your task is complete."
    });
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by tab
    if (activeTab === 'daily' && task.category !== 'daily') return false;
    if (activeTab === 'goals' && task.category !== 'goal') return false;
    if (activeTab === 'completed' && !task.completed) return false;
    if (activeTab === 'incomplete' && task.completed) return false;
    
    // Filter by priority
    if (filter !== 'all' && task.priority !== filter) return false;
    
    // Filter by search query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    
    return true;
  });

  // Sort tasks by priority and due date
  const sortedTasks = [...filteredTasks].sort((a, b) => {
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
    
    const taskDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const taskDateStart = new Date(taskDate);
    taskDateStart.setHours(0, 0, 0, 0);
    
    if (taskDateStart.getTime() === today.getTime()) {
      return 'Today';
    } else if (taskDateStart.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return taskDate.toLocaleDateString('en-US', {
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
          Tasks
        </h1>
        <p className="text-muted-foreground">
          Organize your spiritual practices and goals.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search tasks..."
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
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
                <DialogDescription>
                  Create a new task for your spiritual practice or goal.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Task title"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Task description"
                    value={newTask.description || ''}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={newTask.category}
                      onValueChange={(value: 'daily' | 'goal') => setNewTask({...newTask, category: value})}
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
                      value={newTask.priority}
                      onValueChange={(value: 'low' | 'medium' | 'high') => setNewTask({...newTask, priority: value})}
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
                      value={newTask.dueDate || ''}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={newTask.time || ''}
                      onChange={(e) => setNewTask({...newTask, time: e.target.value})}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingTask(false)}>Cancel</Button>
                <Button onClick={handleAddTask}>Add Task</Button>
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

        {/* Task list for all tabs */}
        <TabsContent value={activeTab} className="mt-4">
          {sortedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <CheckSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <h3 className="text-xl font-medium mb-2">No tasks found</h3>
              <p className="text-muted-foreground max-w-md">
                {searchQuery || filter !== 'all' 
                  ? "Try changing your search or filter settings." 
                  : "Create your first task by clicking the 'Add Task' button."}
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setIsAddingTask(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {sortedTasks.map(task => (
                <Card key={task.id} className={`hover-lift transition-all ${task.completed ? 'opacity-70' : ''}`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id={`task-${task.id}`}
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-1"
                        />
                        <div>
                          <CardTitle className={`text-xl ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </CardTitle>
                          {task.description && (
                            <CardDescription className="mt-1">
                              {task.description}
                            </CardDescription>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Dialog open={editingTask?.id === task.id} onOpenChange={(open) => {
                          if (open) {
                            setEditingTask(task);
                          } else {
                            setEditingTask(null);
                          }
                        }}>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]">
                            <DialogHeader>
                              <DialogTitle>Edit Task</DialogTitle>
                              <DialogDescription>
                                Update your task details.
                              </DialogDescription>
                            </DialogHeader>
                            {editingTask && (
                              <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-title">Title</Label>
                                  <Input
                                    id="edit-title"
                                    placeholder="Task title"
                                    value={editingTask.title}
                                    onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    placeholder="Task description"
                                    value={editingTask.description || ''}
                                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select
                                      value={editingTask.category}
                                      onValueChange={(value: 'daily' | 'goal') => setEditingTask({...editingTask, category: value})}
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
                                      value={editingTask.priority}
                                      onValueChange={(value: 'low' | 'medium' | 'high') => setEditingTask({...editingTask, priority: value})}
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
                                      value={editingTask.dueDate || ''}
                                      onChange={(e) => setEditingTask({...editingTask, dueDate: e.target.value})}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-time">Time</Label>
                                    <Input
                                      id="edit-time"
                                      type="time"
                                      value={editingTask.time || ''}
                                      onChange={(e) => setEditingTask({...editingTask, time: e.target.value})}
                                    />
                                  </div>
                                </div>
                                <div className="grid gap-2">
                                  <div className="flex items-center gap-2">
                                    <Switch 
                                      checked={editingTask.completed}
                                      onCheckedChange={(checked) => setEditingTask({...editingTask, completed: checked})}
                                    />
                                    <Label>Mark as completed</Label>
                                  </div>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
                              <Button onClick={handleUpdateTask}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <Badge variant="outline" className={`flex items-center gap-1 ${getPriorityColor(task.priority)}`}>
                        <AlertCircle className="h-3 w-3" />
                        {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                      </Badge>
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {task.category === 'daily' ? (
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
                      {task.dueDate && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(task.dueDate)}
                        </Badge>
                      )}
                      {task.time && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {task.time}
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

export default Tasks;
