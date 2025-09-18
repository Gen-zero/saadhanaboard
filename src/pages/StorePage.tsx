import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useUserProgression } from '@/hooks/useUserProgression';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { 
  ShoppingCart, 
  Coins, 
  Palette, 
  Gem, 
  Shirt, 
  Calendar,
  CreditCard,
  Lock,
  Star,
  TrendingUp,
  Zap,
  Flower2,
  Users,
  BookOpen,
  Plus,
  Award
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface StoreItem {
  id: string;
  title: string;
  description: string;
  price: number; // in spiritual points
  realPrice?: number; // in real money (USD)
  type: 'theme' | 'yantra' | 'merchandise' | 'workshop';
  isPremium?: boolean;
  isLocked?: boolean;
  unlockLevel?: number;
  imageUrl?: string;
  rating: number;
  category?: 'general' | 'deity'; // Added to categorize themes
}

const StorePage = () => {
  const { toast } = useToast();
  const { progression, spendSpiritualPoints } = useUserProgression();
  const { spiritualPoints, level: userLevel } = progression;
  const [purchasedItems, setPurchasedItems] = useState<string[]>([]);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null);
  const [spPointsToBuy, setSpPointsToBuy] = useState(100);

  // Define store items
  const storeItems: StoreItem[] = [
    // Themes - General
    {
      id: 'dark-theme',
      title: 'Elegant Dark Theme',
      description: 'A sophisticated dark theme with cosmic purple accents',
      price: 50,
      type: 'theme',
      isPremium: false,
      isLocked: false,
      rating: 4.8,
      category: 'general'
    },
    {
      id: 'ocean-theme',
      title: 'Serene Ocean Theme',
      description: 'Calm blue tones inspired by tranquil waters',
      price: 75,
      type: 'theme',
      isPremium: false,
      isLocked: false,
      rating: 4.6,
      category: 'general'
    },
    {
      id: 'forest-theme',
      title: 'Mystical Forest Theme',
      description: 'Earthy greens and nature-inspired elements',
      price: 75,
      type: 'theme',
      isPremium: false,
      isLocked: false,
      rating: 4.7,
      category: 'general'
    },
    {
      id: 'cosmic-theme',
      title: 'Cosmic Nebula Theme',
      description: 'Stunning cosmic visuals with deep purples and blues',
      price: 100,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 5,
      rating: 4.9,
      category: 'general'
    },
    {
      id: 'golden-theme',
      title: 'Golden Dawn Theme',
      description: 'Warm golden tones for an uplifting experience',
      price: 100,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 7,
      rating: 4.9,
      category: 'general'
    },
    // Themes - Deity
    {
      id: 'mahakali-theme',
      title: 'Mahakali Divine Theme',
      description: 'Powerful red and black theme with Mahakali symbolism',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity'
    },
    {
      id: 'shiva-theme',
      title: 'Shiva Consciousness Theme',
      description: 'Transformative theme with Shiva symbolism and ash tones',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity'
    },
    {
      id: 'krishna-theme',
      title: 'Krishna Bliss Theme',
      description: 'Divine love theme with Krishna symbolism and vibrant colors',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity'
    },
    {
      id: 'ganesha-theme',
      title: 'Ganesha Wisdom Theme',
      description: 'Obstacle-removing theme with Ganesha symbolism and golden accents',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity'
    },
    {
      id: 'lakshmi-theme',
      title: 'Lakshmi Prosperity Theme',
      description: 'Abundance-focused theme with Lakshmi symbolism and gold tones',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity'
    },
    {
      id: 'saraswati-theme',
      title: 'Saraswati Knowledge Theme',
      description: 'Wisdom-themed with Saraswati symbolism and blue-white tones',
      price: 150,
      realPrice: 9.99,
      type: 'theme',
      isPremium: true,
      isLocked: true,
      unlockLevel: 10,
      rating: 5.0,
      category: 'deity'
    },
    
    // 3D Yantras
    {
      id: 'shiva-yantra',
      title: 'Shiva Yantra 3D',
      description: 'Dynamic 3D Shiva Yantra with rotating energy',
      price: 120,
      realPrice: 12.99,
      type: 'yantra',
      isPremium: true,
      isLocked: true,
      unlockLevel: 4,
      rating: 4.7
    },
    {
      id: 'ganesha-yantra',
      title: 'Ganesha Yantra 3D',
      description: 'Interactive 3D Ganesha Yantra for obstacle removal',
      price: 100,
      realPrice: 9.99,
      type: 'yantra',
      isPremium: true,
      isLocked: true,
      unlockLevel: 2,
      rating: 4.8
    },
    {
      id: 'lakshmi-yantra',
      title: 'Lakshmi Yantra 3D',
      description: 'Prosperity-focused 3D Lakshmi Yantra',
      price: 130,
      realPrice: 11.99,
      type: 'yantra',
      isPremium: true,
      isLocked: true,
      unlockLevel: 5,
      rating: 4.6
    },
    
    // Merchandise
    {
      id: 'yantra-poster',
      title: 'Sacred Yantra Poster Set',
      description: 'Set of 5 high-quality printed yantra posters',
      price: 80,
      realPrice: 24.99,
      type: 'merchandise',
      isPremium: false,
      isLocked: false,
      rating: 4.5
    },
    {
      id: 'malas-set',
      title: 'Rudraksha Malas Collection',
      description: 'Set of 3 handcrafted Rudraksha malas',
      price: 200,
      realPrice: 39.99,
      type: 'merchandise',
      isPremium: true,
      isLocked: true,
      unlockLevel: 6,
      rating: 4.9
    },
    {
      id: 'incense-kit',
      title: 'Divine Incense Kit',
      description: 'Premium incense collection for meditation',
      price: 60,
      realPrice: 19.99,
      type: 'merchandise',
      isPremium: false,
      isLocked: false,
      rating: 4.4
    },
    {
      id: 'yantra-bracelet',
      title: 'Protection Yantra Bracelet',
      description: 'Handcrafted bracelet with embedded yantra',
      price: 90,
      realPrice: 29.99,
      type: 'merchandise',
      isPremium: true,
      isLocked: true,
      unlockLevel: 4,
      rating: 4.7
    },
    
    // Workshops
    {
      id: 'meditation-workshop',
      title: 'Advanced Meditation Workshop',
      description: '7-day intensive meditation program',
      price: 300,
      realPrice: 199.99,
      type: 'workshop',
      isPremium: true,
      isLocked: true,
      unlockLevel: 5,
      rating: 4.9
    },
    {
      id: 'yantra-workshop',
      title: 'Sacred Geometry & Yantra Creation',
      description: 'Learn to create and energize yantras',
      price: 250,
      realPrice: 149.99,
      type: 'workshop',
      isPremium: true,
      isLocked: true,
      unlockLevel: 7,
      rating: 4.8
    },
    {
      id: 'mantra-workshop',
      title: 'Mantra Chanting Mastery',
      description: 'Deep dive into sacred sound vibrations',
      price: 200,
      realPrice: 129.99,
      type: 'workshop',
      isPremium: true,
      isLocked: true,
      unlockLevel: 6,
      rating: 4.7
    }
  ];

  const handlePurchase = (item: StoreItem) => {
    // Check if user has already purchased this item
    if (purchasedItems.includes(item.id)) {
      toast({
        title: "Already Purchased",
        description: `You've already purchased ${item.title}.`,
        variant: "default"
      });
      return;
    }

    // Check if item is locked due to level requirements
    if (item.isLocked && item.unlockLevel && userLevel < item.unlockLevel) {
      toast({
        title: "Item Locked",
        description: `This item requires Level ${item.unlockLevel}. Continue your spiritual journey to unlock it.`,
        variant: "destructive"
      });
      return;
    }

    // Check if user has enough SP
    if (spiritualPoints < item.price) {
      toast({
        title: "Insufficient Spiritual Points",
        description: `You need ${item.price} SP to purchase ${item.title}. Complete more practices to earn points or buy SP with real money.`,
        variant: "destructive"
      });
      return;
    }

    // Process purchase
    const success = spendSpiritualPoints(item.price);
    if (success) {
      setPurchasedItems([...purchasedItems, item.id]);
      
      toast({
        title: "Purchase Successful!",
        description: `You've unlocked ${item.title} for ${item.price} SP.`,
        duration: 3000
      });
    } else {
      toast({
        title: "Purchase Failed",
        description: "Unable to complete the purchase. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleBuyWithRealMoney = (item: StoreItem) => {
    setSelectedItem(item);
    setIsPaymentModalOpen(true);
  };

  const handleBuySPPackage = () => {
    // In a real app, this would integrate with a payment processor
    toast({
      title: "Purchase Successful!",
      description: `You've purchased ${spPointsToBuy} Spiritual Points!`,
      duration: 3000
    });
    setIsPaymentModalOpen(false);
  };

  const renderStoreSection = (title: string, icon: React.ReactNode, type: StoreItem['type'], category?: StoreItem['category']) => {
    // For merchandise and workshops, show coming soon message instead of items
    if (type === 'merchandise' || type === 'workshop') {
      return (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            {icon}
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
          </div>
          <Card className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 border-purple-500/20">
            <CardContent className="p-8 text-center">
              {type === 'merchandise' ? (
                <Shirt className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              ) : (
                <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              )}
              <h3 className="text-xl font-bold mb-2">Coming Soon</h3>
              <p className="text-muted-foreground">
                {type === 'merchandise' 
                  ? "We're preparing our spiritual merchandise collection. Check back soon for exclusive items!"
                  : "We're preparing our spiritual workshops and courses. Check back soon for transformative learning experiences!"}
              </p>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Filter items based on type and optional category
    let items = storeItems.filter(item => item.type === type);
    if (category) {
      items = items.filter(item => item.category === category);
    }
    
    if (items.length === 0) return null;
    
    return (
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <StoreItemCard 
              key={item.id} 
              item={item} 
              userLevel={userLevel}
              spiritualPoints={spiritualPoints}
              isPurchased={purchasedItems.includes(item.id)}
              onPurchase={handlePurchase}
              onBuyWithRealMoney={handleBuyWithRealMoney}
            />
          ))}
        </div>
      </div>
    );
  };

  // SP Packages for purchase
  const spPackages = [
    { points: 100, price: 4.99, popular: false },
    { points: 250, price: 9.99, popular: true },
    { points: 500, price: 17.99, popular: false },
    { points: 1000, price: 29.99, popular: false }
  ];

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in bg-transparent">
        {/* Store Header */}
        <Card className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 border-purple-500/20">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShoppingCart className="h-8 w-8 text-purple-500" />
                <div>
                  <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
                    Spiritual Store
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Unlock premium themes, yantras, merchandise, and workshops
                  </p>
                </div>
              </div>
              
              {/* User SP */}
              <div className="flex items-center gap-2 bg-secondary/20 px-4 py-3 rounded-lg">
                <Coins className="h-5 w-5 text-yellow-500" />
                <div className="text-center">
                  <p className="text-sm font-medium">Your Spiritual Points</p>
                  <p className="text-xl font-bold text-yellow-500">{spiritualPoints}</p>
                </div>
                <Button 
                  size="sm" 
                  className="ml-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  Buy More
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Prominent SP Purchase Section */}
        <Card className="bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10 border-amber-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-300">
              <Coins className="h-6 w-6" />
              Buy Spiritual Points
            </CardTitle>
            <p className="text-muted-foreground">
              Purchase SP with real money to unlock premium content and accelerate your spiritual journey
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {spPackages.map((pkg) => (
                <Card 
                  key={pkg.points} 
                  className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                    pkg.popular 
                      ? 'border-amber-500/50 bg-amber-500/10 shadow-lg shadow-amber-500/20' 
                      : 'border-amber-500/20 bg-amber-500/5'
                  }`}
                  onClick={() => {
                    setSpPointsToBuy(pkg.points);
                    setIsPaymentModalOpen(true);
                  }}
                >
                  {pkg.popular && (
                    <div className="absolute -top-2 -right-2 bg-amber-500 text-amber-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Award className="h-3 w-3" />
                      BEST VALUE
                    </div>
                  )}
                  <CardContent className="p-4 flex flex-col items-center">
                    <Coins className="h-8 w-8 text-amber-400 mb-2" />
                    <h3 className="text-xl font-bold text-amber-300">{pkg.points} SP</h3>
                    <p className="text-lg font-semibold text-foreground">${pkg.price}</p>
                    {pkg.popular && (
                      <Badge className="mt-2 bg-amber-500 hover:bg-amber-600">
                        Most Popular
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* SP Purchase Modal */}
        {isPaymentModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-500" />
                  Buy Spiritual Points
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Purchase SP with real money to unlock premium content
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedItem ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-secondary/10 rounded-lg">
                      <h3 className="font-medium">{selectedItem.title}</h3>
                      <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium">{selectedItem.price} SP</span>
                        {selectedItem.realPrice && (
                          <span className="font-medium">${selectedItem.realPrice}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm">
                      You can buy this item with real money instead of using your Spiritual Points.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h3 className="font-medium">Select SP Package</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant={spPointsToBuy === 100 ? "default" : "outline"}
                        onClick={() => setSpPointsToBuy(100)}
                        className="flex flex-col h-auto p-4"
                      >
                        <span className="text-lg font-bold">100 SP</span>
                        <span className="text-sm">$4.99</span>
                      </Button>
                      <Button 
                        variant={spPointsToBuy === 250 ? "default" : "outline"}
                        onClick={() => setSpPointsToBuy(250)}
                        className="flex flex-col h-auto p-4 relative"
                      >
                        <div className="absolute -top-2 -right-2 bg-amber-500 text-amber-900 text-xs font-bold px-2 py-1 rounded-full">
                          BEST
                        </div>
                        <span className="text-lg font-bold">250 SP</span>
                        <span className="text-sm">$9.99</span>
                      </Button>
                      <Button 
                        variant={spPointsToBuy === 500 ? "default" : "outline"}
                        onClick={() => setSpPointsToBuy(500)}
                        className="flex flex-col h-auto p-4"
                      >
                        <span className="text-lg font-bold">500 SP</span>
                        <span className="text-sm">$17.99</span>
                      </Button>
                      <Button 
                        variant={spPointsToBuy === 1000 ? "default" : "outline"}
                        onClick={() => setSpPointsToBuy(1000)}
                        className="flex flex-col h-auto p-4"
                      >
                        <span className="text-lg font-bold">1000 SP</span>
                        <span className="text-sm">$29.99</span>
                      </Button>
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setIsPaymentModalOpen(false);
                      setSelectedItem(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                    onClick={selectedItem ? () => handlePurchase(selectedItem) : handleBuySPPackage}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    {selectedItem ? "Buy with Card" : "Purchase"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Store Sections */}
        <div className="space-y-8">
          {renderStoreSection('General Themes', <Palette className="h-5 w-5 text-purple-500" />, 'theme', 'general')}
          {renderStoreSection('Deity Themes', <Flower2 className="h-5 w-5 text-purple-500" />, 'theme', 'deity')}
          {renderStoreSection('3D Yantras', <Gem className="h-5 w-5 text-purple-500" />, 'yantra')}
          {renderStoreSection('Spiritual Merchandise', <Shirt className="h-5 w-5 text-purple-500" />, 'merchandise')}
          {renderStoreSection('Workshops & Courses', <Users className="h-5 w-5 text-purple-500" />, 'workshop')}
        </div>
      </div>
    </Layout>
  );
};

interface StoreItemCardProps {
  item: StoreItem;
  userLevel: number;
  spiritualPoints: number;
  isPurchased: boolean;
  onPurchase: (item: StoreItem) => void;
  onBuyWithRealMoney: (item: StoreItem) => void;
}

const StoreItemCard = ({ item, userLevel, spiritualPoints, isPurchased, onPurchase, onBuyWithRealMoney }: StoreItemCardProps) => {
  const isLocked = item.isLocked && item.unlockLevel && userLevel < item.unlockLevel;
  const canAfford = spiritualPoints >= item.price;
  
  return (
    <Card className={`relative overflow-hidden border ${isPurchased ? 'border-green-500/50 bg-green-500/5' : 'border-purple-500/20'} ${isLocked ? 'opacity-70' : ''}`}>
      {isPurchased && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
          Purchased
        </div>
      )}
      
      {isLocked && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-secondary/90 p-3 rounded-lg flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="text-sm">Level {item.unlockLevel}</span>
          </div>
        </div>
      )}
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-sm">{item.title}</h3>
          {item.isPremium && (
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-xs h-5">
              Premium
            </Badge>
          )}
        </div>
        
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {item.description}
        </p>
        
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`h-3 w-3 ${i < Math.floor(item.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">{item.rating}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Coins className="h-4 w-4 text-yellow-500" />
              <span className="font-medium text-sm">{item.price} SP</span>
            </div>
            {item.realPrice && (
              <div className="text-xs text-muted-foreground line-through">
                ${item.realPrice}
              </div>
            )}
          </div>
          
          <div className="flex gap-1">
            <Button
              size="sm"
              variant={isPurchased ? "outline" : "default"}
              className={`h-8 ${isPurchased ? "bg-green-500/10 border-green-500/30 hover:bg-green-500/20" : "bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"}`}
              onClick={() => onPurchase(item)}
              disabled={isPurchased || isLocked || !canAfford}
            >
              {isPurchased ? "Owned" : "Buy"}
            </Button>
            {item.realPrice && !isPurchased && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                onClick={() => onBuyWithRealMoney(item)}
              >
                $
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorePage;