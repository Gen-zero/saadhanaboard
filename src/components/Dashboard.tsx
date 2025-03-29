
import { AlarmClock, CheckSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const Dashboard = () => {
  // Mock data for urgent tasks
  const urgentTasks = [
    { id: 1, title: 'Morning Prayer', deadline: 'Today, 6:00 AM', category: 'Daily Ritual' },
    { id: 2, title: 'Meditation Session', deadline: 'Today, 8:00 AM', category: 'Daily Ritual' },
    { id: 3, title: 'Read Sacred Text', deadline: 'Today, 9:00 PM', category: 'Goal Oriented' },
    { id: 4, title: 'Reflect on Daily Progress', deadline: 'Today, 10:00 PM', category: 'Goal Oriented' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
        <p className="text-muted-foreground">
          Continue your spiritual journey with purpose and intention.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <CardTitle className="text-xl font-medium flex items-center gap-2">
            <AlarmClock className="h-5 w-5 text-primary" />
            <span>Tasks Requiring Attention</span>
          </CardTitle>
          <Button variant="outline" size="sm" asChild>
            <a href="/tasks">View All Tasks</a>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {urgentTasks.map((task) => (
              <div 
                key={task.id} 
                className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg hover-lift"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <CheckSquare className="h-5 w-5 text-primary/70" />
                  </div>
                  <div>
                    <h3 className="font-medium">{task.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-accent text-accent-foreground">
                        {task.category}
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-muted-foreground">{task.deadline}</span>
                  <Button variant="ghost" size="sm">Complete</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium">Today's Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 bg-secondary/30 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">2/5</div>
                <p className="text-sm text-muted-foreground mt-2">Daily Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium">Spiritual Focus</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium">Today's Intention</h3>
                <p className="text-muted-foreground mt-1">
                  "I will approach each moment with mindfulness and compassion."
                </p>
              </div>
              <div className="bg-secondary/30 p-4 rounded-lg">
                <h3 className="font-medium">Goal Progress</h3>
                <p className="text-muted-foreground mt-1">
                  15 days into your 40-day devotional practice
                </p>
                <div className="w-full bg-secondary h-2 rounded-full mt-2">
                  <div className="bg-primary h-2 rounded-full w-[37.5%]"></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
