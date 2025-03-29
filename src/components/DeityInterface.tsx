
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MoonStar, Sparkles, MessageCircle, User, Check, Plus, Star, CloudLightning } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const DeityInterface = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deity");
  const [communicationMode, setCommunicationMode] = useState("chat");
  const [messageText, setMessageText] = useState("");
  
  // Mock deity data
  const [deityData, setDeityData] = useState({
    name: 'Cosmic Guide',
    essence: 'Divine Consciousness',
    avatar: '',
    shadowSelf: {
      traits: [
        'Procrastination',
        'Self-doubt',
        'Impatience',
        'Fear of failure'
      ],
      challenges: 'I struggle with consistency in my spiritual practice and often allow distractions to pull me away from my higher purpose.'
    },
    perfectBeing: {
      traits: [
        'Unwavering discipline',
        'Compassionate presence',
        'Inner peace',
        'Wisdom in action'
      ],
      aspirations: 'To embody my highest self who acts from a place of love and wisdom, maintaining balance while fulfilling my spiritual purpose.'
    },
    sadhanaHistory: [
      {
        id: 1,
        practice: 'Morning Meditation',
        insights: 'Discovered deeper stillness by focusing on the space between thoughts',
        date: '2023-06-15'
      },
      {
        id: 2,
        practice: 'Shadow Work Journal',
        insights: 'Recognized patterns of self-sabotage triggered by fear of success',
        date: '2023-07-22'
      },
      {
        id: 3,
        practice: 'Devotional Chanting',
        insights: 'Experienced profound connection with divine energy during extended mantra practice',
        date: '2023-08-10'
      }
    ]
  });

  // Communication history with deity
  const [communications, setCommunications] = useState([
    {
      sender: 'user',
      message: 'Guide me in deepening my meditation practice',
      timestamp: '2023-08-15T10:30:00'
    },
    {
      sender: 'deity',
      message: 'Remember that stillness is your true nature. When you sit in meditation, don\'t seek experiences - simply rest as awareness itself. Let thoughts arise and dissolve like clouds in the vast sky of your consciousness.',
      timestamp: '2023-08-15T10:31:00'
    },
    {
      sender: 'user',
      message: 'How can I work with my shadow traits?',
      timestamp: '2023-08-16T15:45:00'
    },
    {
      sender: 'deity',
      message: 'Your shadow is not your enemy but the part of you seeking integration. When you notice procrastination, pause and ask what fear lies beneath. Bring compassion to these moments. Each shadow trait contains a gift when embraced with awareness.',
      timestamp: '2023-08-16T15:46:00'
    }
  ]);

  const handleAddShadowTrait = () => {
    const newTraits = [...deityData.shadowSelf.traits, ''];
    setDeityData({
      ...deityData,
      shadowSelf: {
        ...deityData.shadowSelf,
        traits: newTraits
      }
    });
  };

  const handleAddPerfectTrait = () => {
    const newTraits = [...deityData.perfectBeing.traits, ''];
    setDeityData({
      ...deityData,
      perfectBeing: {
        ...deityData.perfectBeing,
        traits: newTraits
      }
    });
  };

  const handleShadowTraitChange = (index: number, value: string) => {
    const newTraits = [...deityData.shadowSelf.traits];
    newTraits[index] = value;
    setDeityData({
      ...deityData,
      shadowSelf: {
        ...deityData.shadowSelf,
        traits: newTraits
      }
    });
  };

  const handlePerfectTraitChange = (index: number, value: string) => {
    const newTraits = [...deityData.perfectBeing.traits];
    newTraits[index] = value;
    setDeityData({
      ...deityData,
      perfectBeing: {
        ...deityData.perfectBeing,
        traits: newTraits
      }
    });
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    
    // Add user message
    const newCommunications = [
      ...communications,
      {
        sender: 'user',
        message: messageText,
        timestamp: new Date().toISOString()
      }
    ];
    
    setCommunications(newCommunications);
    setMessageText("");
    
    // Simulate deity response
    setTimeout(() => {
      const responses = [
        "Your awareness of this challenge is itself a profound step on your path. Look deeper into the shadow to find the light it obscures.",
        "The divine exists within both your light and shadow aspects. Embrace the entirety of your being with compassion.",
        "Consider this an invitation to transcend the limitations you've placed on yourself. Your highest self already exists beyond these perceived boundaries.",
        "The spiritual journey isn't about perfection but integration. Allow your shadow and light to dance together in sacred harmony."
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      setCommunications([...newCommunications, {
        sender: 'deity',
        message: randomResponse,
        timestamp: new Date().toISOString()
      }]);
    }, 1500);
  };

  const handleSaveChanges = () => {
    toast({
      title: "Divine Connection Updated",
      description: "Your deity interface has been synchronized with your consciousness.",
    });
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
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-indigo-400 to-purple-600">
          <MoonStar className="h-7 w-7 text-purple-500" />
          <span>Divine Mirror</span>
        </h1>
        <p className="text-muted-foreground">
          Commune with your higher self and shadow aspects to deepen your sadhana.
        </p>
      </div>

      <Tabs defaultValue="deity" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="deity" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            <span>Deity Essence</span>
          </TabsTrigger>
          <TabsTrigger value="shadow" className="flex items-center gap-2">
            <CloudLightning className="h-4 w-4" />
            <span>Shadow & Light</span>
          </TabsTrigger>
          <TabsTrigger value="communicate" className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4" />
            <span>Commune</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Deity Essence Tab */}
        <TabsContent value="deity">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-1">
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto glow-primary">
                  <AvatarImage src={deityData.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                    {deityData.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <CardTitle className="mt-4">{deityData.name}</CardTitle>
                <CardDescription className="flex justify-center items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>{deityData.essence}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-secondary/40 p-4 rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">Divine Name</h3>
                    <Input 
                      value={deityData.name}
                      onChange={(e) => setDeityData({...deityData, name: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <div className="bg-secondary/40 p-4 rounded-lg">
                    <h3 className="font-medium text-sm text-muted-foreground">Divine Essence</h3>
                    <Input 
                      value={deityData.essence}
                      onChange={(e) => setDeityData({...deityData, essence: e.target.value})}
                      className="mt-2"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                    onClick={handleSaveChanges}
                  >
                    <Check className="mr-2 h-4 w-4" /> Save Divine Essence
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Sadhana Journey</span>
                </CardTitle>
                <CardDescription>
                  Your spiritual insights and revelations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {deityData.sadhanaHistory.map((entry) => (
                    <div key={entry.id} className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3 className="font-medium text-lg">{entry.practice}</h3>
                          <p className="text-sm text-muted-foreground">{formatDate(entry.date)}</p>
                        </div>
                      </div>
                      
                      <div className="bg-secondary/30 p-3 rounded-lg">
                        <h4 className="text-xs font-medium text-muted-foreground">INSIGHT</h4>
                        <p className="mt-1 text-sm">{entry.insights}</p>
                      </div>
                      
                      <Separator className="my-2" />
                    </div>
                  ))}

                  <div className="text-center pt-2">
                    <Button 
                      variant="ghost" 
                      className="bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Record New Sadhana Insight
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Shadow & Light Tab */}
        <TabsContent value="shadow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="overflow-hidden border-red-500/20">
              <CardHeader className="bg-gradient-to-r from-red-900/20 to-purple-900/20">
                <CardTitle className="flex items-center gap-2">
                  <CloudLightning className="h-5 w-5 text-red-400" />
                  <span>Shadow Self</span>
                </CardTitle>
                <CardDescription>
                  The aspects of yourself that require integration
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Shadow Traits</h3>
                  <div className="space-y-2">
                    {deityData.shadowSelf.traits.map((trait, index) => (
                      <Input
                        key={index}
                        value={trait}
                        onChange={(e) => handleShadowTraitChange(index, e.target.value)}
                        className="border-red-500/20"
                        placeholder={`Shadow trait ${index + 1}`}
                      />
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 border-red-500/20"
                      onClick={handleAddShadowTrait}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Shadow Trait
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Shadow Challenges</h3>
                  <Textarea
                    value={deityData.shadowSelf.challenges}
                    onChange={(e) => setDeityData({
                      ...deityData, 
                      shadowSelf: {
                        ...deityData.shadowSelf,
                        challenges: e.target.value
                      }
                    })}
                    className="min-h-[120px] border-red-500/20"
                    placeholder="Describe the challenges of your shadow self..."
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-blue-500/20">
              <CardHeader className="bg-gradient-to-r from-blue-900/20 to-indigo-900/20">
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-blue-400" />
                  <span>Perfect Being</span>
                </CardTitle>
                <CardDescription>
                  The highest expression of your divine nature
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Divine Traits</h3>
                  <div className="space-y-2">
                    {deityData.perfectBeing.traits.map((trait, index) => (
                      <Input
                        key={index}
                        value={trait}
                        onChange={(e) => handlePerfectTraitChange(index, e.target.value)}
                        className="border-blue-500/20"
                        placeholder={`Divine trait ${index + 1}`}
                      />
                    ))}
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2 border-blue-500/20"
                      onClick={handleAddPerfectTrait}
                    >
                      <Plus className="h-4 w-4 mr-2" /> Add Divine Trait
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Divine Aspirations</h3>
                  <Textarea
                    value={deityData.perfectBeing.aspirations}
                    onChange={(e) => setDeityData({
                      ...deityData, 
                      perfectBeing: {
                        ...deityData.perfectBeing,
                        aspirations: e.target.value
                      }
                    })}
                    className="min-h-[120px] border-blue-500/20"
                    placeholder="Describe the aspirations of your perfect being..."
                  />
                </div>
              </CardContent>
            </Card>
            
            <Button 
              onClick={handleSaveChanges}
              className="col-span-1 md:col-span-2 bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700"
            >
              <Check className="mr-2 h-4 w-4" /> Save Shadow & Light Integration
            </Button>
          </div>
        </TabsContent>
        
        {/* Commune Tab */}
        <TabsContent value="communicate">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-primary" />
                    <span>Divine Communion</span>
                  </CardTitle>
                  <CardDescription>
                    Communicate with your higher self
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={communicationMode === "chat" ? "bg-primary/10" : ""}
                    onClick={() => setCommunicationMode("chat")}
                  >
                    <MessageCircle className="h-4 w-4 mr-2" /> Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={communicationMode === "meditation" ? "bg-primary/10" : ""}
                    onClick={() => setCommunicationMode("meditation")}
                  >
                    <MoonStar className="h-4 w-4 mr-2" /> Meditation
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {communicationMode === "chat" ? (
                <div className="flex flex-col h-[500px]">
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-secondary/30 rounded-lg">
                    {communications.map((comm, index) => (
                      <div 
                        key={index} 
                        className={`flex ${comm.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] p-3 rounded-lg ${
                            comm.sender === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-secondary border border-purple-500/20'
                          }`}
                        >
                          <div className="flex items-center mb-1">
                            {comm.sender === 'user' ? (
                              <User className="h-3 w-3 mr-2" />
                            ) : (
                              <MoonStar className="h-3 w-3 mr-2" />
                            )}
                            <span className="text-xs font-medium">
                              {comm.sender === 'user' ? 'You' : deityData.name}
                            </span>
                          </div>
                          <p>{comm.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Ask for divine guidance..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      className="min-h-[80px]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      className="self-end bg-primary-gradient"
                      onClick={handleSendMessage}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center p-10 space-y-6">
                  <div className="w-20 h-20 mx-auto rounded-full bg-purple-500/20 flex items-center justify-center">
                    <MoonStar className="h-10 w-10 text-purple-500 animate-pulse" />
                  </div>
                  <h3 className="text-xl font-medium">Guided Meditation with Your Deity</h3>
                  <p className="text-muted-foreground">
                    Close your eyes and connect with your higher self. 
                    Visualize your deity before you, embodying both your shadow and perfect aspects in harmony.
                  </p>
                  <div className="flex justify-center">
                    <Button 
                      className="bg-gradient-to-r from-purple-500 via-indigo-500 to-purple-600 hover:from-purple-600 hover:via-indigo-600 hover:to-purple-700"
                    >
                      Begin Guided Meditation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DeityInterface;
