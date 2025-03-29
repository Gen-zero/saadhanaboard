
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, Plus, BookOpen, CheckCheck, Calendar, Trash2, Edit, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category: 'daily' | 'goal';
  dueDate?: string;
  time?: string;
  createdAt: string;
  priority: 'low' | 'medium' | 'high';
}

const Tasks = () => {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [isEditMode, setIsEditMode] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [taskData, setTaskData] = useState<Task | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    id: 0,
    title: '',
    description: '',
    category: 'daily',
    dueDate: '',
    time: '',
    priority: 'medium'
  });
  
  // Get tasks from localStorage or use default
  const getLocalTasks = () => {
    const savedTasks = localStorage.getItem('saadhanaTasks');
    if (savedTasks) {
      try {
        return JSON.parse(savedTasks);
      } catch (e) {
        console.error("Failed to parse tasks:", e);
        return [];
      }
    }
    
    // Default tasks
    return [
      // Daily ritual tasks
      {
        id: 1,
        title: 'Morning Prayer/Meditation',
        description: 'Start the day with intention and connection',
        completed: false,
        category: 'daily',
        time: '06:00',
        createdAt: new Date().toISOString(),
        priority: 'high'
      },
      {
        id: 2,
        title: 'Recite Sacred Text',
        description: 'Reading from your chosen spiritual text',
        completed: true,
        category: 'daily',
        time: '07:00',
        createdAt: new Date().toISOString(),
        priority: 'medium'
      },
      {
        id: 3,
        title: 'Evening Reflection',
        description: 'Reflect on the day and set intentions for tomorrow',
        completed: false,
        category: 'daily',
        time: '21:00',
        createdAt: new Date().toISOString(),
        priority: 'medium'
      },
      // Goal oriented tasks
      {
        id: 4,
        title: 'Volunteer at Community Service',
        description: 'Give back to your community',
        completed: false,
        category: 'goal',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        priority: 'medium'
      },
      {
        id: 5,
        title: 'Study Chapter 3 of Sacred Text',
        description: 'Deepen your understanding',
        completed: false,
        category: 'goal',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        priority: 'high'
      },
      {
        id: 6,
        title: 'Attend Spiritual Gathering',
        description: 'Connect with community',
        completed: true,
        category: 'goal',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        priority: 'low'
      }
    ];
  };

  // Initialize tasks from localStorage
  const [tasks, setTasks] = useState<Task[]>(getLocalTasks());

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('saadhanaTasks', JSON.stringify(tasks));
  }, [tasks]);

  // Reset form data
  const resetFormData = () => {
    setFormData({
      id: 0,
      title: '',
      description: '',
      category: 'daily',
      dueDate: '',
      time: '',
      priority: 'medium'
    });
    setIsEditMode(false);
  };

  // Open dialog for new task
  const openNewTaskDialog = () => {
    resetFormData();
    setTaskData(null);
    setIsDialogOpen(true);
  };

  // Open dialog for editing task
  const openEditTaskDialog = (task: Task) => {
    setFormData({
      id: task.id,
      title: task.title,
      description: task.description || '',
      category: task.category,
      dueDate: task.dueDate || '',
      time: task.time || '',
      priority: task.priority
    });
    setTaskData(task);
    setIsEditMode(true);
    setIsDialogOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle task form submission
  const handleTaskSubmit = () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a task title",
        variant: "destructive"
      });
      return;
    }

    if (isEditMode && taskData) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === taskData.id ? {
          ...task,
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category as 'daily' | 'goal',
          dueDate: formData.dueDate || undefined,
          time: formData.time || undefined,
          priority: formData.priority as 'low' | 'medium' | 'high'
        } : task
      );
      setTasks(updatedTasks);
      toast({
        title: "Task updated",
        description: "Your task has been updated successfully"
      });
    } else {
      // Add new task
      const newTask: Task = {
        id: Date.now(),
        title: formData.title,
        description: formData.description || undefined,
        completed: false,
        category: formData.category as 'daily' | 'goal',
        dueDate: formData.dueDate || undefined,
        time: formData.time || undefined,
        createdAt: new Date().toISOString(),
        priority: formData.priority as 'low' | 'medium' | 'high'
      };
      setTasks([...tasks, newTask]);
      toast({
        title: "Task added",
        description: "Your new task has been added successfully"
      });
    }
    
    setIsDialogOpen(false);
    resetFormData();
  };

  // Delete task
  const confirmDeleteTask = (taskId: number) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const deleteTask = () => {
    if (taskToDelete === null) return;
    
    const updatedTasks = tasks.filter(task => task.id !== taskToDelete);
    setTasks(updatedTasks);
    setIsDeleteDialogOpen(false);
    setTaskToDelete(null);
    
    toast({
      title: "Task deleted",
      description: "Your task has been removed"
    });
  };

  // Toggle task completion
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toast({
        title: task.completed ? "Task marked as incomplete" : "Task completed",
        description: task.completed ? "Task marked as pending" : `Congratulations on completing "${task.title}"!`
      });
    }
  };

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'daily') return task.category === 'daily';
    if (activeTab === 'goal') return task.category === 'goal';
    if (activeTab === 'completed') return task.completed;
    if (activeTab === 'pending') return !task.completed;
    return true;
  });

  // Separate tasks by category
  const dailyTasks = tasks.filter(task => task.category === 'daily');
  const goalTasks = tasks.filter(task => task.category === 'goal');
  
  // Get priority class
  const getPriorityClass = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-500/20 text-red-700 dark:text-red-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-700 dark:text-green-300';
      default: return 'bg-secondary text-muted-foreground';
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <CheckSquare className="h-7 w-7 text-primary" />
            <span>Tasks</span>
          </h1>
          <p className="text-muted-foreground">
            Manage your spiritual practices and goals.
          </p>
        </div>
        <Button className="mt-2 sm:mt-0" onClick={openNewTaskDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Task
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-md mb-6">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="goal">Goals</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Done</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <CheckCheck className="h-5 w-5 text-primary" />
                  <span>Daily Rituals</span>
                </CardTitle>
                <CardDescription>
                  Recurring spiritual practices
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dailyTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No daily rituals found</p>
                    <Button variant="link" size="sm" onClick={openNewTaskDialog} className="mt-2">
                      Add your first daily ritual
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dailyTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex items-start p-3 rounded-lg task-item-transition ${
                          task.completed ? 'bg-secondary/30 opacity-70' : 'bg-secondary/50 hover-lift'
                        }`}
                      >
                        <Checkbox 
                          id={`task-${task.id}`} 
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-1 h-5 w-5"
                        />
                        <div className="ml-3 space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Label 
                              htmlFor={`task-${task.id}`}
                              className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.title}
                            </Label>
                            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityClass(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {task.time && (
                            <div className="text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                              {task.time}
                            </div>
                          )}
                          <div className="flex flex-col md:flex-row gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={() => openEditTaskDialog(task)}
                            >
                              <Edit size={15} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive/90" 
                              onClick={() => confirmDeleteTask(task.id)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span>Goal Oriented</span>
                </CardTitle>
                <CardDescription>
                  Tasks to help you achieve your spiritual goals
                </CardDescription>
              </CardHeader>
              <CardContent>
                {goalTasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p>No goals found</p>
                    <Button variant="link" size="sm" onClick={openNewTaskDialog} className="mt-2">
                      Add your first goal
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {goalTasks.map((task) => (
                      <div 
                        key={task.id} 
                        className={`flex items-start p-3 rounded-lg task-item-transition ${
                          task.completed ? 'bg-secondary/30 opacity-70' : 'bg-secondary/50 hover-lift'
                        }`}
                      >
                        <Checkbox 
                          id={`task-${task.id}`} 
                          checked={task.completed}
                          onCheckedChange={() => toggleTaskCompletion(task.id)}
                          className="mt-1 h-5 w-5"
                        />
                        <div className="ml-3 space-y-1 flex-1">
                          <div className="flex items-center gap-2">
                            <Label 
                              htmlFor={`task-${task.id}`}
                              className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                            >
                              {task.title}
                            </Label>
                            <span className={`text-xs px-2 py-0.5 rounded ${getPriorityClass(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>
                          {task.description && (
                            <p className="text-sm text-muted-foreground">
                              {task.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {task.dueDate && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                              <Calendar className="h-3 w-3" />
                              {formatDate(task.dueDate)}
                            </div>
                          )}
                          <div className="flex flex-col md:flex-row gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7" 
                              onClick={() => openEditTaskDialog(task)}
                            >
                              <Edit size={15} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-7 w-7 text-destructive hover:text-destructive/90" 
                              onClick={() => confirmDeleteTask(task.id)}
                            >
                              <Trash2 size={15} />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCheck className="h-6 w-6 text-primary" />
                <span>Daily Ritual Tasks</span>
              </CardTitle>
              <CardDescription>Recurring spiritual practices</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No daily rituals found</p>
                  <Button variant="link" size="sm" onClick={openNewTaskDialog} className="mt-2">
                    Add your first daily ritual
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-start p-3 rounded-lg task-item-transition ${
                        task.completed ? 'bg-secondary/30 opacity-70' : 'bg-secondary/50 hover-lift'
                      }`}
                    >
                      <Checkbox 
                        id={`daily-${task.id}`} 
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1 h-5 w-5"
                      />
                      <div className="ml-3 space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Label 
                            htmlFor={`daily-${task.id}`}
                            className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {task.title}
                          </Label>
                          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {task.time && (
                          <div className="text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                            {task.time}
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => openEditTaskDialog(task)}
                          >
                            <Edit size={15} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive/90" 
                            onClick={() => confirmDeleteTask(task.id)}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <span>Goal Oriented Tasks</span>
              </CardTitle>
              <CardDescription>Tasks to help you achieve your spiritual goals</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No goals found</p>
                  <Button variant="link" size="sm" onClick={openNewTaskDialog} className="mt-2">
                    Add your first goal
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className={`flex items-start p-3 rounded-lg task-item-transition ${
                        task.completed ? 'bg-secondary/30 opacity-70' : 'bg-secondary/50 hover-lift'
                      }`}
                    >
                      <Checkbox 
                        id={`goal-${task.id}`} 
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1 h-5 w-5"
                      />
                      <div className="ml-3 space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Label 
                            htmlFor={`goal-${task.id}`}
                            className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                          >
                            {task.title}
                          </Label>
                          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {task.dueDate && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                            <Calendar className="h-3 w-3" />
                            {formatDate(task.dueDate)}
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => openEditTaskDialog(task)}
                          >
                            <Edit size={15} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive/90" 
                            onClick={() => confirmDeleteTask(task.id)}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
              <CardDescription>Tasks that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No pending tasks</p>
                  <Button variant="link" size="sm" onClick={openNewTaskDialog} className="mt-2">
                    Add a new task
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-start p-3 bg-secondary/50 rounded-lg hover-lift"
                    >
                      <Checkbox 
                        id={`pending-${task.id}`} 
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1 h-5 w-5"
                      />
                      <div className="ml-3 space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Label 
                            htmlFor={`pending-${task.id}`}
                            className="font-medium"
                          >
                            {task.title}
                          </Label>
                          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityClass(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                        <p className="text-xs text-primary font-medium">
                          {task.category === 'daily' ? 'Daily Ritual' : 'Goal Oriented'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(task.time || task.dueDate) && (
                          <div className="text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                            {task.time || formatDate(task.dueDate!)}
                          </div>
                        )}
                        <div className="flex flex-col md:flex-row gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7" 
                            onClick={() => openEditTaskDialog(task)}
                          >
                            <Edit size={15} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-destructive hover:text-destructive/90" 
                            onClick={() => confirmDeleteTask(task.id)}
                          >
                            <Trash2 size={15} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
              <CardDescription>Tasks you have accomplished</CardDescription>
            </CardHeader>
            <CardContent>
              {filteredTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2 opacity-50" />
                  <p>No completed tasks</p>
                  <p className="text-sm mt-1">Tasks you complete will appear here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTasks.map((task) => (
                    <div 
                      key={task.id} 
                      className="flex items-start p-3 bg-secondary/30 rounded-lg opacity-80"
                    >
                      <Checkbox 
                        id={`completed-${task.id}`} 
                        checked={task.completed}
                        onCheckedChange={() => toggleTaskCompletion(task.id)}
                        className="mt-1 h-5 w-5"
                      />
                      <div className="ml-3 space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Label 
                            htmlFor={`completed-${task.id}`}
                            className="font-medium line-through text-muted-foreground"
                          >
                            {task.title}
                          </Label>
                          <span className={`text-xs px-2 py-0.5 rounded ${getPriorityClass(task.priority)} opacity-50`}>
                            {task.priority}
                          </span>
                        </div>
                        {task.description && (
                          <p className="text-sm text-muted-foreground line-through">
                            {task.description}
                          </p>
                        )}
                        <p className="text-xs text-primary/70 font-medium">
                          {task.category === 'daily' ? 'Daily Ritual' : 'Goal Oriented'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {(task.time || task.dueDate) && (
                          <div className="text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                            {task.time || formatDate(task.dueDate!)}
                          </div>
                        )}
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7 text-destructive hover:text-destructive/90" 
                          onClick={() => confirmDeleteTask(task.id)}
                        >
                          <Trash2 size={15} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add/Edit Task Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Task" : "Add New Task"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input 
                id="title" 
                name="title"
                placeholder="Enter task title" 
                value={formData.title}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea 
                id="description" 
                name="description"
                placeholder="Enter task description" 
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Task Category</Label>
              <Select 
                value={formData.category}
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily Ritual</SelectItem>
                  <SelectItem value="goal">Goal Oriented</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select 
                value={formData.priority}
                onValueChange={(value) => handleSelectChange('priority', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {formData.category === 'goal' ? (
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input 
                    id="dueDate" 
                    name="dueDate"
                    type="date" 
                    value={formData.dueDate}
                    onChange={handleInputChange}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input 
                    id="time" 
                    name="time"
                    type="time" 
                    value={formData.time}
                    onChange={handleInputChange}
                  />
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleTaskSubmit}>{isEditMode ? "Update" : "Add"} Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteTask} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Tasks;
