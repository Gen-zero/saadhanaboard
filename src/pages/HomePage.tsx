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
      {/* Sticky Navigation Bar with Saadhana Paper Texture */}
      <div 
        className="sticky top-4 z-50 mx-4"
        style={{
          pointerEvents: 'auto'
        }}
      >
        <nav 
          className="bg-[url('/textures/parchment.jpg')] bg-cover bg-center border border-amber-500/30 rounded-lg shadow-2xl backdrop-blur-sm"
          style={{
            backgroundImage: 'url(/textures/parchment.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: 'rgba(255, 248, 220, 0.9)', // Fallback parchment color
            backdropFilter: 'blur(8px)',
            boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.3), 0 8px 32px rgba(0, 0, 0, 0.3)'
          }}
        >
          {/* Decorative border overlay */}
          <div className="absolute inset-0 border-[8px] border-[rgba(255,215,0,0.4)] rounded-lg pointer-events-none"></div>
          
          <div className="flex items-center justify-between px-6 py-4 relative z-10">
            <Link to="/" className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/sadhanaboard_logo.png"
                alt="SadhanaBoard Logo"
                className="h-10 w-10 rounded-full cursor-pointer transition-transform duration-300 hover:scale-110 border-2 border-amber-600/30"
              />
              <span className="text-xl font-bold text-amber-900 font-serif drop-shadow-sm">
                SadhanaBoard
              </span>
            </Link>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" className="text-amber-800 hover:text-amber-900 hover:bg-amber-200/30 border border-amber-600/20">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white border border-amber-700/50 shadow-lg">
                <Link to="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </nav>
      </div>

      <div className="min-h-screen bg-transparent">
        <div className="space-y-16 animate-fade-in pt-8">
          {/* Hero Section with Sadhana Paper */}
          <section className="py-20 container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Side - Sadhana Paper */}
              <div className="relative">
                <div className="bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/20 dark:to-orange-950/20 p-8 rounded-lg shadow-2xl border border-amber-200/50 dark:border-amber-800/30 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-amber-800 dark:text-amber-200 mb-2">🌸 Navratri 2025 Sadhana 🌸</h3>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">September 22 - October 1, 2025</p>
                  </div>
                  
                  <div className="space-y-4 text-amber-900 dark:text-amber-100">
                    <div className="border-b border-amber-300/50 pb-2">
                      <h4 className="font-semibold text-lg">🕉️ Daily Practice</h4>
                      <ul className="mt-2 space-y-1 text-sm">
                        <li>• Morning: Durga Chalisa (21 minutes)</li>
                        <li>• Evening: Aarti & Meditation (15 minutes)</li>
                        <li>• Night: Gratitude Journal (5 minutes)</li>
                      </ul>
                    </div>
                    
                    <div className="border-b border-amber-300/50 pb-2">
                      <h4 className="font-semibold text-lg">🌺 Nine Divine Aspects</h4>
                      <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
                        <div className="text-center p-2 bg-red-100/50 dark:bg-red-900/20 rounded">
                          <div className="font-medium">Day 1-3</div>
                          <div>Durga</div>
                          <div className="text-red-600 dark:text-red-400">Strength</div>
                        </div>
                        <div className="text-center p-2 bg-green-100/50 dark:bg-green-900/20 rounded">
                          <div className="font-medium">Day 4-6</div>
                          <div>Lakshmi</div>
                          <div className="text-green-600 dark:text-green-400">Abundance</div>
                        </div>
                        <div className="text-center p-2 bg-blue-100/50 dark:bg-blue-900/20 rounded">
                          <div className="font-medium">Day 7-9</div>
                          <div>Saraswati</div>
                          <div className="text-blue-600 dark:text-blue-400">Wisdom</div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg">🎯 Intention (Sankalpa)</h4>
                      <p className="text-sm italic mt-1">"May I cultivate inner strength, abundance of spirit, and divine wisdom to serve my highest purpose."</p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-amber-300/50">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-amber-600 dark:text-amber-400">✨ Track daily progress</span>
                        <span className="text-amber-600 dark:text-amber-400">Created with SadhanaBoard</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Decorative elements around the paper */}
                <div className="absolute -top-4 -left-4 w-8 h-8 text-amber-400 animate-pulse">
                  <Sparkles className="w-full h-full" />
                </div>
                <div className="absolute -bottom-4 -right-4 w-6 h-6 text-orange-400 animate-bounce">
                  <Heart className="w-full h-full" />
                </div>
              </div>
              
              {/* Right Side - Spiritual Content */}
              <div className="space-y-8">
                <div className="text-center lg:text-left">
                  <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
                      Sacred
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-500 via-purple-400 to-fuchsia-600">
                      Practice
                    </span>
                    <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-500 to-purple-500">
                      Tracker
                    </span>
                  </h1>
                  
                  <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                    Transform your spiritual journey with personalized sadhana practices. 
                    Create, track, and evolve your daily rituals with divine guidance.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                    <Button 
                      size="lg" 
                      className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-lg px-8 py-6"
                      asChild
                    >
                      <Link to="/signup">
                        Start Your Journey
                        <Sparkles className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-purple-500/40 text-lg px-8 py-6 hover:bg-purple-500/10"
                      asChild
                    >
                      <Link to="/library">
                        Explore Practices
                        <BookOpen className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </div>
                </div>
                
                {/* Spiritual Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                  <Card className="backdrop-blur-md bg-background/20 border-purple-500/10 hover:border-purple-500/30 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-400">10,000+</div>
                      <div className="text-sm text-muted-foreground">Active Practitioners</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-background/20 border-fuchsia-500/10 hover:border-fuchsia-500/30 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-fuchsia-400">500+</div>
                      <div className="text-sm text-muted-foreground">Sacred Practices</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-background/20 border-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-400">98%</div>
                      <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
                    </CardContent>
                  </Card>
                  
                  <Card className="backdrop-blur-md bg-background/20 border-green-500/10 hover:border-green-500/30 transition-all duration-300">
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-400">24/7</div>
                      <div className="text-sm text-muted-foreground">Divine Support</div>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Featured Quote */}
                <div className="relative">
                  <Card className="backdrop-blur-md bg-gradient-to-br from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 border-purple-500/20">
                    <CardContent className="p-6">
                      <div className="text-lg italic text-center text-muted-foreground mb-4">
                        "The mind is everything. What you think you become."
                      </div>
                      <div className="text-center text-sm text-purple-400 font-medium">
                        — Buddha
                      </div>
                    </CardContent>
                  </Card>
                  <div className="absolute -top-2 left-4 text-purple-400">
                    <Star className="w-6 h-6" />
                  </div>
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
                <img
                  src="/lovable-uploads/sadhanaboard_logo.png"
                  alt="SadhanaBoard Logo"
                  className="h-8 w-8 rounded-full cursor-pointer transition-transform duration-300 hover:scale-110 border-2 border-purple-500/30"
                />
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