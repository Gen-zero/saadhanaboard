import Layout from "@/components/Layout";
import SpiritualLibrary from "@/components/library/SpiritualLibrary";
import { ShoppingCart, Coins, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserProgression } from '@/hooks/useUserProgression';
import { useNavigate } from 'react-router-dom';

const LibraryPage = () => {
  const { progression } = useUserProgression();
  const { spiritualPoints, level: userLevel } = progression;
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="space-y-6 animate-fade-in bg-transparent">
        {/* Library Header with Store-inspired Design */}
        <Card className="bg-gradient-to-r from-purple-500/10 via-fuchsia-500/10 to-purple-500/10 border-purple-500/20 relative overflow-hidden">
          {/* Animated background */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,rgba(0,0,0,0)_70%)]"></div>
          <CardHeader className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <BookOpen className="h-8 w-8 text-purple-500" />
                <div>
                  <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
                    Spiritual Library
                  </CardTitle>
                  <p className="text-muted-foreground">
                    Sacred texts, practices, and spiritual wisdom
                  </p>
                </div>
              </div>
              
              {/* User Stats */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-secondary/20 px-3 py-2 rounded-lg">
                  <Coins className="h-4 w-4 text-yellow-500" />
                  <div className="text-center">
                    <p className="text-sm font-medium">Spiritual Points</p>
                    <p className="text-lg font-bold text-yellow-500">{spiritualPoints}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 bg-secondary/20 px-3 py-2 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm font-medium">Level</p>
                    <p className="text-lg font-bold text-blue-500">{userLevel}</p>
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                  onClick={() => navigate('/store')}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Visit Store
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
        
        <SpiritualLibrary />
      </div>
    </Layout>
  );
};

export default LibraryPage;