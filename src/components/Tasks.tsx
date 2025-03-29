
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckSquare, Plus, BookOpen, CheckCheck, Calendar } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category: 'daily' | 'goal';
  dueDate?: string;
  time?: string;
}

const Tasks = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for tasks
  const [tasks, setTasks] = useState<Task[]>([
    // Daily ritual tasks
    {
      id: 1,
      title: 'Morning Prayer/Meditation',
      description: 'Start the day with intention and connection',
      completed: false,
      category: 'daily',
      time: '6:00 AM'
    },
    {
      id: 2,
      title: 'Recite Sacred Text',
      description: 'Reading from your chosen spiritual text',
      completed: true,
      category: 'daily',
      time: '7:00 AM'
    },
    {
      id: 3,
      title: 'Evening Reflection',
      description: 'Reflect on the day and set intentions for tomorrow',
      completed: false,
      category: 'daily',
      time: '9:00 PM'
    },
    // Goal oriented tasks
    {
      id: 4,
      title: 'Volunteer at Community Service',
      description: 'Give back to your community',
      completed: false,
      category: 'goal',
      dueDate: '2023-07-15'
    },
    {
      id: 5,
      title: 'Study Chapter 3 of Sacred Text',
      description: 'Deepen your understanding',
      completed: false,
      category: 'goal',
      dueDate: '2023-07-10'
    },
    {
      id: 6,
      title: 'Attend Spiritual Gathering',
      description: 'Connect with community',
      completed: true,
      category: 'goal',
      dueDate: '2023-07-05'
    }
  ]);

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const filteredTasks = tasks.filter(task => {
    if (activeTab === 'all') return true;
    if (activeTab === 'daily') return task.category === 'daily';
    if (activeTab === 'goal') return task.category === 'goal';
    if (activeTab === 'completed') return task.completed;
    if (activeTab === 'pending') return !task.completed;
    return true;
  });

  const dailyTasks = tasks.filter(task => task.category === 'daily');
  const goalTasks = tasks.filter(task => task.category === 'goal');
  
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
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="mt-2 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Add New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Task</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="task-title">Task Title</Label>
                <Input id="task-title" placeholder="Enter task title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-description">Description (Optional)</Label>
                <Textarea id="task-description" placeholder="Enter task description" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="task-category">Task Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily Ritual</SelectItem>
                    <SelectItem value="goal">Goal Oriented</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="task-date">Due Date</Label>
                  <Input id="task-date" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task-time">Time</Label>
                  <Input id="task-time" type="time" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => setIsDialogOpen(false)}>Add Task</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                        <Label 
                          htmlFor={`task-${task.id}`}
                          className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {task.title}
                        </Label>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      {task.time && (
                        <div className="text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                          {task.time}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                        <Label 
                          htmlFor={`task-${task.id}`}
                          className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {task.title}
                        </Label>
                        {task.description && (
                          <p className="text-sm text-muted-foreground">
                            {task.description}
                          </p>
                        )}
                      </div>
                      {task.dueDate && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                          <Calendar className="h-3 w-3" />
                          {new Date(task.dueDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
              <div className="space-y-4">
                {dailyTasks.map((task) => (
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
                      <Label 
                        htmlFor={`daily-${task.id}`}
                        className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {task.title}
                      </Label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </div>
                    {task.time && (
                      <div className="text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                        {task.time}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {goalTasks.map((task) => (
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
                      <Label 
                        htmlFor={`goal-${task.id}`}
                        className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}
                      >
                        {task.title}
                      </Label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                    </div>
                    {task.dueDate && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                        <Calendar className="h-3 w-3" />
                        {new Date(task.dueDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                      <Label 
                        htmlFor={`pending-${task.id}`}
                        className="font-medium"
                      >
                        {task.title}
                      </Label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground">
                          {task.description}
                        </p>
                      )}
                      <p className="text-xs text-primary font-medium">
                        {task.category === 'daily' ? 'Daily Ritual' : 'Goal Oriented'}
                      </p>
                    </div>
                    {(task.time || task.dueDate) && (
                      <div className="text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                        {task.time || new Date(task.dueDate!).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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
                      <Label 
                        htmlFor={`completed-${task.id}`}
                        className="font-medium line-through text-muted-foreground"
                      >
                        {task.title}
                      </Label>
                      {task.description && (
                        <p className="text-sm text-muted-foreground line-through">
                          {task.description}
                        </p>
                      )}
                      <p className="text-xs text-primary/70 font-medium">
                        {task.category === 'daily' ? 'Daily Ritual' : 'Goal Oriented'}
                      </p>
                    </div>
                    {(task.time || task.dueDate) && (
                      <div className="text-xs text-muted-foreground font-medium bg-background/50 px-2 py-1 rounded">
                        {task.time || new Date(task.dueDate!).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Tasks;
