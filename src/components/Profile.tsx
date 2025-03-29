
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Calendar, BookOpen, Clock } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Profile = () => {
  // Mock user data
  const userData = {
    name: 'Sarah Johnson',
    joined: 'January 2023',
    email: 'sarah.j@example.com',
    avatar: '',
    previousSadhanas: [
      {
        id: 1,
        title: 'Inner Peace Meditation',
        deity: 'Universal Consciousness',
        startDate: '2023-01-15',
        endDate: '2023-02-24',
        duration: 40,
        goal: 'Develop deeper awareness and presence in daily life'
      },
      {
        id: 2,
        title: '21-Day Gratitude Practice',
        deity: 'Divine Mother',
        startDate: '2022-11-01',
        endDate: '2022-11-21',
        duration: 21,
        goal: 'Cultivate an attitude of gratitude and abundance'
      },
      {
        id: 3,
        title: 'Sacred Text Study',
        deity: 'Lord Krishna',
        startDate: '2022-08-05',
        endDate: '2022-09-13',
        duration: 40,
        goal: 'Deepen understanding of the Bhagavad Gita'
      }
    ]
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <User className="h-7 w-7 text-primary" />
          <span>Profile</span>
        </h1>
        <p className="text-muted-foreground">
          Your spiritual journey and history.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarImage src={userData.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {userData.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4">{userData.name}</CardTitle>
            <CardDescription className="flex justify-center items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Joined {userData.joined}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-secondary/40 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                <p className="mt-1">{userData.email}</p>
              </div>
              <div className="bg-secondary/40 p-4 rounded-lg">
                <h3 className="font-medium text-sm text-muted-foreground">Current Practice</h3>
                <p className="mt-1">40-Day Meditation Journey</p>
                <p className="text-xs text-muted-foreground mt-1">Day 15 of 40</p>
                <div className="w-full bg-secondary h-2 rounded-full mt-2">
                  <div className="bg-primary h-2 rounded-full w-[37.5%]"></div>
                </div>
              </div>
              <Button variant="outline" className="w-full">Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>Previous Saadhanas</span>
            </CardTitle>
            <CardDescription>
              Your spiritual journey history
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {userData.previousSadhanas.map((sadhana) => (
                <div key={sadhana.id} className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h3 className="font-medium text-lg">{sadhana.title}</h3>
                      <p className="text-sm text-muted-foreground">{sadhana.deity}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium bg-accent/40 text-accent-foreground px-3 py-1 rounded-full">
                      <Clock className="h-4 w-4" />
                      <span>{sadhana.duration} Days</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <h4 className="text-xs font-medium text-muted-foreground">GOAL</h4>
                      <p className="mt-1 text-sm">{sadhana.goal}</p>
                    </div>
                    <div className="bg-secondary/30 p-3 rounded-lg">
                      <h4 className="text-xs font-medium text-muted-foreground">TIME PERIOD</h4>
                      <p className="mt-1 text-sm">
                        {formatDate(sadhana.startDate)} - {formatDate(sadhana.endDate)}
                      </p>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                </div>
              ))}

              <div className="text-center pt-2">
                <Button variant="ghost">
                  View All Spiritual History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Spiritual Statistics</CardTitle>
          <CardDescription>Your journey in numbers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-primary">3</h3>
              <p className="text-sm text-muted-foreground mt-1">Completed Saadhanas</p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-primary">101</h3>
              <p className="text-sm text-muted-foreground mt-1">Total Practice Days</p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-primary">85%</h3>
              <p className="text-sm text-muted-foreground mt-1">Task Completion Rate</p>
            </div>
            <div className="bg-secondary/50 p-4 rounded-lg text-center">
              <h3 className="text-3xl font-bold text-primary">2</h3>
              <p className="text-sm text-muted-foreground mt-1">Deities Connected</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
