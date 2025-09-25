import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Trophy, Calendar, Users, Sparkles, MoonStar, Flame, Target, Heart, Mountain, Star, TrendingUp, Play, Volume2, Eye } from "lucide-react";
import { Link } from "react-router-dom";
// Removed Layout import to create a distinct landing page experience

const HomePage = () => {
  const features = [
    {
      title: "Sadhana Tracker",
      description: "Track your daily spiritual practices with our intuitive tracker",
      icon: BookOpen,
      details: "Monitor your progress, set reminders, and maintain consistency in your spiritual journey with our comprehensive tracking system."
    },
    {
      title: "Progress Dashboard",
      description: "Visualize your spiritual growth with detailed analytics",
      icon: Trophy,
      details: "Gain insights into your practice patterns, streaks, and achievements through beautiful visualizations and progress reports."
    },
    {
      title: "Community",
      description: "Connect with fellow practitioners and share your journey",
      icon: Users,
      details: "Join a supportive community of like-minded spiritual seekers, share experiences, and learn from others on similar paths."
    },
    {
      title: "Divine Calendar",
      description: "Never miss important festivals and observances",
      icon: Calendar,
      details: "Stay connected with the spiritual calendar, receive reminders for important festivals, and plan your practices accordingly."
    },
    {
      title: "Sacred Library",
      description: "Access a vast collection of spiritual texts and resources",
      icon: BookOpen,
      details: "Explore our curated library of sacred texts, teachings, and resources to deepen your understanding and practice."
    },
    {
      title: "Divine Themes",
      description: "Personalize your experience with spiritual themes",
      icon: Sparkles,
      details: "Transform your practice with beautiful divine themes inspired by Hindu deities, each with unique visual elements and ambiance."
    }
  ];

  const practices = [
    {
      title: "Meditation & Mindfulness",
      description: "Begin your meditation journey with gentle daily practices",
      level: "Beginner",
      duration: "21 days",
      deity: "Buddha",
      tradition: "Buddhist"
    },
    {
      title: "Om Namah Shivaya",
      description: "Sacred mantra practice for spiritual transformation",
      level: "Beginner",
      duration: "108 days",
      deity: "Shiva",
      tradition: "Hindu"
    },
    {
      title: "Krishna Bhakti",
      description: "Immerse in divine love through Krishna consciousness",
      level: "Beginner",
      duration: "49 days",
      deity: "Krishna",
      tradition: "Vaishnava"
    },
    {
      title: "Divine Mother Worship",
      description: "Connect with the nurturing aspect of the Divine",
      level: "Beginner",
      duration: "21 days",
      deity: "Devi",
      tradition: "Shakta"
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Yoga Teacher",
      content: "SadhanaBoard has transformed my daily practice. The tracking features keep me accountable and the progress insights are truly inspiring.",
      avatar: "PS"
    },
    {
      name: "Rahul Mehta",
      role: "Software Engineer",
      content: "The divine calendar helps me stay on top of important spiritual observances. It's a great tool for maintaining consistency in my practice.",
      avatar: "RM"
    },
    {
      name: "Anjali Devi",
      role: "Spiritual Seeker",
      content: "The community features have connected me with like-minded practitioners worldwide. My spiritual journey has deepened through these connections.",
      avatar: "AD"
    },
    {
      name: "Vikram Singh",
      role: "Retired Teacher",
      content: "The sacred library has opened up new dimensions of understanding for me. I've discovered texts I never knew existed that have enriched my practice.",
      avatar: "VS"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Practitioners", icon: Users },
    { value: "500+", label: "Sadhana Practices", icon: BookOpen },
    { value: "50+", label: "Sacred Texts", icon: BookOpen },
    { value: "98%", label: "User Satisfaction", icon: Star }
  ];

  return (
    <>
      {/* Sticky Navigation Bar - Glassy Spiritual Theme */}
      <div 
        className="sticky top-0 left-0 right-0 z-[999999] px-4 pt-4"
        style={{
          pointerEvents: 'auto'
        }}
      >
        <nav 
          className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-2xl group"
          style={{
            background: 'linear-gradient(135deg, rgba(139, 69, 19, 0.08), rgba(75, 0, 130, 0.12), rgba(148, 0, 211, 0.08))',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255, 215, 0, 0.25)',
            boxShadow: '0 8px 32px rgba(139, 69, 19, 0.1), 0 0 0 1px rgba(255, 215, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Subtle gradient overlay */}
          <div 
            className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500"
            style={{
              background: 'linear-gradient(45deg, rgba(255, 215, 0, 0.05), transparent, rgba(138, 43, 226, 0.05))'
            }}
          />
          
          {/* Floating spiritual particles in navbar */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-2 left-16 w-1 h-1 bg-yellow-400/60 rounded-full animate-pulse" />
            <div className="absolute top-4 right-20 w-1.5 h-1.5 bg-purple-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-3 left-32 w-1 h-1 bg-fuchsia-400/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
          
          <div className="relative flex items-center justify-between px-6 py-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-12 w-12 rounded-full cursor-pointer scale-110 shadow-lg shadow-purple-500/30"
                  style={{
                    filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
                  }}
                />
                {/* Constant glowing ring around logo */}
                <div 
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.3), rgba(138, 43, 226, 0.3), rgba(255, 215, 0, 0.3))',
                    padding: '2px'
                  }}
                >
                  <div className="w-full h-full rounded-full bg-background/20" />
                </div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-purple-300 to-fuchsia-300">
                  SadhanaBoard
                </span>
                <span className="text-xs text-yellow-400/70 font-medium tracking-wider">
                  ✨ Your Digital Yantra
                </span>
              </div>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Button 
                asChild 
                variant="ghost" 
                className="relative text-foreground/80 hover:text-foreground hover:bg-white/10 backdrop-blur-sm border border-white/10 hover:border-purple-400/40 transition-all duration-300 group/btn overflow-hidden"
              >
                <Link to="/login">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <span className="relative z-10">Login</span>
                </Link>
              </Button>
              
              <Button 
                asChild 
                className="relative bg-gradient-to-r from-purple-500/80 via-fuchsia-500/80 to-purple-500/80 hover:from-purple-400 hover:via-fuchsia-400 hover:to-purple-400 backdrop-blur-sm border border-purple-400/30 hover:border-yellow-400/50 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group/cta overflow-hidden"
              >
                <Link to="/signup">
                  {/* Animated gradient background */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-purple-400/20 to-fuchsia-400/20 opacity-0 group-hover/cta:opacity-100 transition-opacity duration-500"
                  />
                  {/* Floating sparkles */}
                  <div className="absolute top-1 right-2 w-1 h-1 bg-yellow-300 rounded-full animate-ping opacity-0 group-hover/cta:opacity-100" />
                  <div className="absolute bottom-1 left-3 w-0.5 h-0.5 bg-white rounded-full animate-pulse opacity-0 group-hover/cta:opacity-100" style={{ animationDelay: '0.5s' }} />
                  
                  <span className="relative z-10 flex items-center">
                    Sign Up
                    <Sparkles className="ml-2 h-4 w-4 group-hover/cta:animate-spin" style={{ animationDuration: '2s' }} />
                  </span>
                </Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <div className="min-h-screen bg-transparent">
        <div className="space-y-16 animate-fade-in">
          {/* Hero Section with Sadhana Paper */}
          <section className="py-4 container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Spiritual Content */}
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
                      ✨ Your Saadhana
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-400 to-fuchsia-600">
                      Awaits.
                    </span>
                  </h1>
                  
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    A private circle is opening. Join the seekers walking the first path into SaadhanaBoard — a digital yantra for practice, discipline, and inner growth.
                  </p>
                  
                  {/* Glowing Path with Markers */}
                  <div className="relative mb-8 py-6">
                    {/* Glowing line/path */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500/20 via-fuchsia-400/60 to-purple-500/20 transform -translate-y-1/2" />
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-purple-500/10 via-fuchsia-400/30 to-purple-500/10 transform -translate-y-1/2 blur-sm" />
                    
                    {/* Luminous markers */}
                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex flex-col items-center text-center max-w-[120px]">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-fuchsia-400 mb-2 shadow-lg animate-pulse" style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }} />
                        <div className="text-sm font-medium text-purple-300">🌸 Waitlist Opens</div>
                        <div className="text-xs text-muted-foreground">(Now)</div>
                      </div>
                      
                      <div className="flex flex-col items-center text-center max-w-[120px]">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-fuchsia-400 to-purple-400 mb-2 shadow-lg" style={{ boxShadow: '0 0 15px rgba(217, 70, 239, 0.4)' }} />
                        <div className="text-sm font-medium text-fuchsia-300">🌅 Early Circle Forms</div>
                        <div className="text-xs text-muted-foreground">(2 Weeks)</div>
                      </div>
                      
                      <div className="flex flex-col items-center text-center max-w-[120px]">
                        <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-400 to-indigo-400 mb-2 shadow-lg" style={{ boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)' }} />
                        <div className="text-sm font-medium text-indigo-300">🔮 Doors Open</div>
                        <div className="text-xs text-muted-foreground">(Private Beta)</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-400 hover:to-fuchsia-400 text-lg px-8 py-6 shadow-lg hover:shadow-2xl transition-all duration-300"
                      style={{ boxShadow: '0 0 30px rgba(168, 85, 247, 0.3)' }}
                      asChild
                    >
                      <Link to="/signup">
                        🌟 Enter the Path
                      </Link>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-purple-500/40 text-lg px-8 py-6 hover:bg-purple-500/10 backdrop-blur-sm transition-all duration-300"
                      style={{ boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)' }}
                      asChild
                    >
                      <Link to="/library">
                        🌙 Learn More
                      </Link>
                    </Button>
                  </div>
                </div>
                
                {/* Early Access Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">Limited</div>
                      <div className="text-sm text-muted-foreground">Beta Access</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-background/20 border-fuchsia-500/10 hover:border-fuchsia-500/30 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-fuchsia-400">Early</div>
                      <div className="text-sm text-muted-foreground">Adopters</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-background/20 border-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">Priority</div>
                      <div className="text-sm text-muted-foreground">Support</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-background/20 border-green-500/10 hover:border-green-500/30 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">Exclusive</div>
                      <div className="text-sm text-muted-foreground">Features</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Right Side - Sadhana Paper (Exact Replica) */}
              <div className="relative">
                <div className="relative max-w-md mx-auto">
                  {/* Paper Container - Exact replica styling */}
                  <div 
                    className="relative p-8 rounded-2xl shadow-2xl border-2"
                    style={{
                      background: 'linear-gradient(145deg, #fdfcf0 0%, #f7f3e8 50%, #f0ead2 100%)',
                      borderColor: '#d4af37',
                      fontFamily: 'Georgia, serif'
                    }}
                  >
                    {/* Ornate corners */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-amber-600 rounded-tl-lg" />
                    <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-amber-600 rounded-tr-lg" />
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-amber-600 rounded-bl-lg" />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-amber-600 rounded-br-lg" />
                    
                    {/* Header */}
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-amber-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>🕉️ Sadhana Paper</h3>
                      <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto" />
                    </div>

                    {/* Content - Following exact original format */}
                    <div className="space-y-3" style={{ fontFamily: 'Georgia, serif', color: '#8b4513' }}>
                      <div>
                        <div className="font-semibold text-amber-800 mb-1">Purpose:</div>
                        <div className="text-sm leading-relaxed pl-2">
                          To honor Divine Mother Durga during the sacred nine nights of Navratri and invoke her blessings for strength, wisdom, and spiritual growth.
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-amber-800 mb-1">Goal:</div>
                        <div className="text-sm leading-relaxed pl-2">
                          Complete daily worship, fasting, and meditation practices for spiritual purification and divine connection.
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-amber-800 mb-1">Divine Focus:</div>
                        <div className="text-sm leading-relaxed pl-2">
                          Maa Durga and her nine divine forms (Navadurga)
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-amber-800 mb-1">Duration:</div>
                        <div className="text-sm leading-relaxed pl-2">
                          9 days
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-amber-800 mb-1">Message:</div>
                        <div className="text-sm italic leading-relaxed pl-2">
                          "May the Divine Mother's grace illuminate my path and transform my being with her infinite love and protection."
                        </div>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-amber-800 mb-1">My Offerings:</div>
                        <div className="text-sm space-y-1 pl-2">
                          <div>1. Daily Durga Chalisa recitation</div>
                          <div>2. Morning meditation (30 minutes)</div>
                          <div>3. Evening aarti and prayers</div>
                          <div>4. Sattvic fasting during day</div>
                          <div>5. Reading Devi Mahatmya</div>
                        </div>
                      </div>
                    </div>

                    {/* Subtle texture overlay */}
                    <div 
                      className="absolute inset-0 rounded-2xl pointer-events-none opacity-20"
                      style={{
                        backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(139, 69, 19, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(184, 134, 11, 0.1) 0%, transparent 50%)'
                      }}
                    />
                  </div>
                  
                  {/* Floating spiritual elements */}
                  <div className="absolute -top-3 -right-3 text-2xl animate-pulse opacity-70">🌸</div>
                  <div className="absolute -bottom-3 -left-3 text-xl animate-pulse opacity-70">🪔</div>
                  <div className="absolute top-1/2 -left-6 text-lg animate-bounce opacity-50">✨</div>
                </div>
              </div>
            </div>
          </section>

          {/* Features Section - Marketing focused */}
          <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Your Spiritual Growth</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Everything you need to maintain and deepen your spiritual practice in one comprehensive platform
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="backdrop-blur-md bg-background/20 border-purple-500/10 hover:border-purple-500/30 hover:bg-background/30 transition-all duration-300 h-full"
                >
                  <CardHeader>
                    <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-4">
                      <Icon className="h-8 w-8 text-purple-400" />
                    </div>
                    <CardTitle className="text-2xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground/80 mb-4">{feature.description}</p>
                    <p className="text-sm text-muted-foreground">{feature.details}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          </section>

          {/* Popular Practices Section */}
          <section className="py-16 bg-gradient-to-b from-background/30 to-background/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Popular Spiritual Practices</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover transformative practices designed by our spiritual community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {practices.map((practice, index) => (
                <Card key={index} className="backdrop-blur-md bg-background/20 border-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{practice.title}</CardTitle>
                      <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded-full">
                        {practice.level}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Flame className="h-4 w-4 mr-1" />
                      <span>{practice.duration}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground/80 mb-4 text-sm">{practice.description}</p>
                    <div className="flex justify-between text-xs">
                      <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                        {practice.deity}
                      </span>
                      <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded">
                        {practice.tradition}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="outline" className="border-purple-500/40 hover:bg-purple-500/10">
                <Link to="/signup">
                  Explore All Practices
                </Link>
              </Button>
            </div>
          </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-16 container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Practitioners Say</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join thousands of practitioners who have deepened their spiritual journey with SadhanaBoard
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="backdrop-blur-md bg-background/20 border-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 mr-3 flex items-center justify-center text-sm font-medium">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground/70">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground/80 text-sm">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          </section>

          {/* Values Section */}
          <section className="py-16 bg-gradient-to-b from-background/30 to-background/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Our Sacred Values</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Principles that guide our spiritual community
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
                    <Mountain className="h-8 w-8 text-purple-400" />
                  </div>
                  <CardTitle className="text-2xl">Spiritual Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe in fostering genuine spiritual development through consistent practice and divine connection.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-fuchsia-500/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-fuchsia-400" />
                  </div>
                  <CardTitle className="text-2xl">Community Connection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Building bridges between practitioners to share wisdom, support, and spiritual experiences.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 text-center">
                <CardHeader>
                  <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-blue-400" />
                  </div>
                  <CardTitle className="text-2xl">Divine Inspiration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Drawing strength and guidance from the divine energies that surround and inspire us on our journey.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/30 backdrop-blur-sm"></div>
          <div className="relative z-10 max-w-3xl mx-auto px-4">
            <MoonStar className="h-16 w-16 text-purple-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Practice?</h2>
            <p className="text-muted-foreground/90 mb-10 text-xl">
              Join thousands of practitioners who have deepened their spiritual journey with SaadhanaBoard.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-500/90 to-fuchsia-500/90 hover:from-purple-500 hover:to-fuchsia-500 text-lg px-8 py-6 backdrop-blur-sm"
                asChild
              >
                <Link to="/signup">
                  Start Your Free Journey
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-purple-500/40 text-lg px-8 py-6 hover:bg-purple-500/10 backdrop-blur-sm"
                asChild
              >
                <Link to="/about">
                  Learn More
                </Link>
              </Button>
            </div>
            
            {/* Demo Preview */}
            <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  <Play className="h-5 w-5 text-purple-400" />
                  <span>Experience a Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  See how SaadhanaBoard can enhance your spiritual practice with divine themes, tracking tools, and community features.
                </p>
                <div className="flex flex-col gap-2">
                  <Button asChild variant="ghost" className="text-purple-300 hover:text-purple-200 justify-start">
                    <Link to="/your-atma-yantra">
                      <Volume2 className="h-4 w-4 mr-2" />
                      View Your Yantras
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="text-red-500 hover:text-red-400 justify-start bg-red-500/5 hover:bg-red-500/10 border border-red-500/20">
                    <Link to="/MahakaliLandingpage">
                      <Flame className="h-4 w-4 mr-2" />
                      Experience Mahakali Theme 🔥
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" className="text-indigo-500 hover:text-indigo-400 justify-start bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/20">
                    <Link to="/MysteryLandingpage">
                      <Eye className="h-4 w-4 mr-2" />
                      Experience Mystery Theme 🔮
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          </section>

          {/* Footer */}
          <footer className="backdrop-blur-md bg-background/30 border-t border-purple-500/10 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-2 mb-4 md:mb-0">
                <div className="relative">
                  <img
                    src="/lovable-uploads/sadhanaboard_logo.png"
                    alt="SadhanaBoard Logo"
                    className="h-8 w-8 rounded-full cursor-pointer transition-transform duration-300 hover:scale-110 relative z-10"
                    style={{
                      filter: 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.3))'
                    }}
                  />
                  {/* Constant glowing ring around logo */}
                  <div 
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: 'conic-gradient(from 0deg, rgba(255, 215, 0, 0.3), rgba(138, 43, 226, 0.3), rgba(255, 215, 0, 0.3))',
                      padding: '2px'
                    }}
                  >
                    <div className="w-full h-full rounded-full bg-background/20" />
                  </div>
                </div>
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-fuchsia-500">
                  SadhanaBoard
                </span>
              </div>
              <div className="flex space-x-6 text-sm text-muted-foreground/80">
                <Link to="/about" className="hover:text-foreground transition-colors">
                  About
                </Link>
                <a href="#" className="hover:text-foreground transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  Terms
                </a>
              </div>
            </div>
            <div className="mt-6 text-center text-xs text-muted-foreground/70">
              © {new Date().getFullYear()} SadhanaBoard. All rights reserved. A sacred space for spiritual practitioners.
            </div>
          </div>
          </footer>
        </div>
      </div>
    </>
  );
};

export default HomePage;