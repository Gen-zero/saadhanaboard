
import { useState, useEffect } from 'react';
import { AlarmClock, CheckSquare, BookOpen, Lightbulb, Calendar, PieChart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import ManifestationForm from './sadhana/ManifestationForm';
import SadhanaHeader from './sadhana/SadhanaHeader';
import SadhanaContent from './sadhana/SadhanaContent';
import SadhanaFooter from './sadhana/SadhanaFooter';
import CosmicBackgroundSimple from './sadhana/CosmicBackgroundSimple';
import { useSadhanaData } from '@/hooks/useSadhanaData';
import { useManifestationForm } from '@/hooks/useManifestationForm';
import { useSadhanaView } from '@/hooks/useSadhanaView';

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
  category: 'daily' | 'goal';
  dueDate?: string;
  time?: string;
  priority: 'low' | 'medium' | 'high';
}

// Inspirational quotes for daily intention
const inspirationalQuotes = [
  "I will approach each moment with mindfulness and compassion.",
  "Today I choose peace over worry and faith over fear.",
  "I am on a path of spiritual growth and awareness.",
  "I embrace the divine guidance available to me today.",
  "My actions today create ripples of positive energy in the universe.",
  "I will practice gratitude for all experiences today.",
  "I am a vessel for divine love and wisdom.",
  "Today I seek harmony in all my interactions.",
  "I am connected to the eternal source of all creation.",
  "I honor my journey and trust the unfolding of my spiritual path."
];

const SaadhanaBoard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Use our custom hooks to manage state
  const { sadhanaData, paperContent } = useSadhanaData();
  const { isEditing, view3D, setIsEditing, setView3D } = useSadhanaView();
  const { showManifestationForm, setShowManifestationForm } = useManifestationForm();

  // Dashboard state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [dailyProgress, setDailyProgress] = useState(0);
  const [urgentTasks, setUrgentTasks] = useState<Task[]>([]);
  const [dailyIntention, setDailyIntention] = useState("");
  const [goalProgress, setGoalProgress] = useState(0);
  const [totalDays, setTotalDays] = useState(40);
  const [currentDay, setCurrentDay] = useState(15);

  // Initialize tasks from localStorage
  useEffect(() => {
    // Get today's date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Fetch tasks from localStorage
    const savedTasks = localStorage.getItem('saadhanaTasks');
    let taskList: Task[] = [];
    
    if (savedTasks) {
      try {
        taskList = JSON.parse(savedTasks);
        setTasks(taskList);
        
        // Calculate today's progress
        const todayTasks = taskList.filter(task => task.category === 'daily');
        const completedTodayTasks = todayTasks.filter(task => task.completed);
        
        setCompletedCount(completedTodayTasks.length);
        setTotalCount(todayTasks.length);
        
        if (todayTasks.length > 0) {
          setDailyProgress(Math.floor((completedTodayTasks.length / todayTasks.length) * 100));
        }
        
        // Get urgent tasks (upcoming or due today)
        const urgent = taskList.filter(task => {
          // For daily tasks that are not completed
          if (task.category === 'daily' && !task.completed) {
            return true;
          }
          
          // For goal-oriented tasks with due dates
          if (task.category === 'goal' && task.dueDate && !task.completed) {
            const dueDate = new Date(task.dueDate);
            dueDate.setHours(0, 0, 0, 0);
            
            // Due today or within the next 3 days
            const diffTime = dueDate.getTime() - today.getTime();
            const diffDays = diffTime / (1000 * 60 * 60 * 24);
            
            return diffDays <= 3;
          }
          
          return false;
        });
        
        // Sort by priority and due date
        urgent.sort((a, b) => {
          const priorityOrder = { high: 0, medium: 1, low: 2 };
          const aPriority = priorityOrder[a.priority];
          const bPriority = priorityOrder[b.priority];
          
          if (aPriority !== bPriority) {
            return aPriority - bPriority;
          }
          
          // If same priority, sort by due date
          if (a.dueDate && b.dueDate) {
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          }
          
          return 0;
        });
        
        setUrgentTasks(urgent.slice(0, 5)); // Get top 5 urgent tasks
      } catch (e) {
        console.error("Failed to parse tasks:", e);
      }
    }
    
    // Get or set daily intention
    const savedIntention = localStorage.getItem('dailyIntention');
    const lastIntentionDate = localStorage.getItem('lastIntentionDate');
    
    // Check if we need a new intention (new day)
    const todayStr = today.toDateString();
    
    if (!savedIntention || !lastIntentionDate || lastIntentionDate !== todayStr) {
      // Set new random intention
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      const newIntention = inspirationalQuotes[randomIndex];
      
      setDailyIntention(newIntention);
      localStorage.setItem('dailyIntention', newIntention);
      localStorage.setItem('lastIntentionDate', todayStr);
    } else {
      setDailyIntention(savedIntention);
    }
    
    // Get or initialize spiritual practice progress
    const savedProgress = localStorage.getItem('spiritualPracticeProgress');
    
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setCurrentDay(progress.currentDay);
        setTotalDays(progress.totalDays);
        setGoalProgress(Math.floor((progress.currentDay / progress.totalDays) * 100));
      } catch (e) {
        console.error("Failed to parse spiritual progress:", e);
        
        // Set default values
        localStorage.setItem('spiritualPracticeProgress', JSON.stringify({
          currentDay: 15,
          totalDays: 40
        }));
      }
    } else {
      // Initialize progress data
      localStorage.setItem('spiritualPracticeProgress', JSON.stringify({
        currentDay: 15,
        totalDays: 40
      }));
      
      setGoalProgress(Math.floor((15 / 40) * 100));
    }
  }, []);

  // Complete task handler
  const completeTask = (taskId: number) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: true } : task
    );
    
    setTasks(updatedTasks);
    localStorage.setItem('saadhanaTasks', JSON.stringify(updatedTasks));
    
    // Update urgent tasks list
    setUrgentTasks(prev => prev.filter(task => task.id !== taskId));
    
    // Recalculate progress if it's a daily task
    const completedTask = tasks.find(task => task.id === taskId);
    if (completedTask && completedTask.category === 'daily') {
      const newCompletedCount = completedCount + 1;
      setCompletedCount(newCompletedCount);
      setDailyProgress(Math.floor((newCompletedCount / totalCount) * 100));
    }
    
    toast({
      title: "Task Completed",
      description: "Great job! Your spiritual journey progresses."
    });
  };

  // Format time for display
  const formatTime = (timeString?: string) => {
    if (!timeString) return '';
    
    try {
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      
      return `${hour % 12 || 12}:${minutes} ${hour >= 12 ? 'PM' : 'AM'}`;
    } catch (e) {
      return timeString;
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Today';
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(dateString);
      dueDate.setHours(0, 0, 0, 0);
      
      const diffTime = dueDate.getTime() - today.getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      
      if (diffDays === 0) {
        return 'Today';
      } else if (diffDays === 1) {
        return 'Tomorrow';
      } else if (diffDays < 0) {
        return 'Overdue';
      } else {
        return dueDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric'
        });
      }
    } catch (e) {
      return dateString;
    }
  };

  // Get deadline display
  const getDeadline = (task: Task) => {
    if (task.category === 'daily') {
      return `Today, ${formatTime(task.time)}`;
    } else {
      return formatDate(task.dueDate);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      <CosmicBackgroundSimple />
      
      <SadhanaHeader 
        isEditing={isEditing}
        showManifestationForm={showManifestationForm}
        view3D={view3D}
        setIsEditing={setIsEditing}
        setShowManifestationForm={setShowManifestationForm}
        setView3D={setView3D}
      />

      {showManifestationForm && (
        <div className="relative z-10">
          <ManifestationForm onClose={() => setShowManifestationForm(false)} />
        </div>
      )}

      {/* Dashboard Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card className="bg-background/80 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-xl font-medium flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <span>Today's Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-48">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    className="text-secondary stroke-current" 
                    strokeWidth="10" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent"
                  />
                  <circle 
                    className="text-primary stroke-current" 
                    strokeWidth="10" 
                    cx="50" 
                    cy="50" 
                    r="40" 
                    fill="transparent"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * dailyProgress) / 100}
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground">
                      {completedCount}/{totalCount}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Daily Tasks Completed</p>
              {dailyProgress === 100 && (
                <span className="mt-2 text-xs px-2 py-1 bg-primary/20 text-primary rounded-full">
                  Congratulations! All tasks complete
                </span>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-background/80 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-xl font-medium flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              <span>Spiritual Focus</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 text-foreground">
                  <Calendar className="h-4 w-4 text-primary" />
                  Today's Intention
                </h3>
                <p className="text-muted-foreground mt-1 italic">
                  "{dailyIntention}"
                </p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium flex items-center gap-2 text-foreground">
                  <BookOpen className="h-4 w-4 text-primary" />
                  Goal Progress
                </h3>
                <p className="text-muted-foreground mt-1">
                  {currentDay} days into your {totalDays}-day devotional practice
                </p>
                <div className="w-full mt-2 space-y-1">
                  <div className="flex justify-between text-xs text-foreground">
                    <span>Day 1</span>
                    <span>Day {totalDays}</span>
                  </div>
                  <Progress value={goalProgress} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks Section */}
      <Card className="bg-background/80 backdrop-blur-sm border-purple-500/20">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-primary" />
            <span>Tasks Requiring Attention</span>
          </CardTitle>
          <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
            View All Tasks
          </Button>
        </CardHeader>
        <CardContent>
          {urgentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <CheckSquare className="h-12 w-12 text-primary/30 mb-2" />
              <p className="text-muted-foreground">All caught up! No urgent tasks.</p>
              <Button 
                variant="link" 
                size="sm" 
                className="mt-2" 
                onClick={() => navigate('/tasks')}
              >
                Add New Task
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {urgentTasks.map((task) => (
                <div 
                  key={task.id} 
                  className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover-lift"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      <CheckSquare className={`h-5 w-5 ${
                        task.priority === 'high' ? 'text-red-500' : 
                        task.priority === 'medium' ? 'text-yellow-500' : 
                        'text-primary/70'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">{task.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-accent-foreground">
                          {task.category === 'daily' ? 'Daily Ritual' : 'Goal Oriented'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{getDeadline(task)}</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => completeTask(task.id)}
                    >
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <SadhanaContent 
        isEditing={isEditing}
        view3D={view3D}
        sadhanaData={sadhanaData}
        paperContent={paperContent}
        setView3D={setView3D}
      />
      
      <SadhanaFooter />
    </div>
  );
};

export default SaadhanaBoard;
