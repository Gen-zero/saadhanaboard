import React from 'react';
import { MoonStar, Sparkles, LayoutDashboard, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface SadhanaHeaderProps {
  showManifestationForm: boolean;
  view3D: boolean;
  showDashboard: boolean;
  setIsEditing: (value: boolean) => void;
  setShowManifestationForm: (value: boolean) => void;
  setView3D: (value: boolean) => void;
  setShowDashboard: (value: boolean) => void;
}

const SadhanaHeader = ({
  showManifestationForm,
  view3D,
  showDashboard,
  setIsEditing,
  setShowManifestationForm,
  setView3D,
  setShowDashboard
}: SadhanaHeaderProps) => {
  const navigate = useNavigate();

  const handleDashboardToggle = () => {
    // Redirect to the dashboard page instead of toggling the local dashboard view
    navigate('/dashboard');
  };

  return (
    <div className="backdrop-blur-sm bg-background/70 p-4 rounded-xl border border-purple-500/20 relative overflow-hidden">
      {/* Cosmic glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-fuchsia-500/5 to-purple-500/5 opacity-50"></div>
      
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
              <MoonStar className="h-7 w-7 text-purple-500 animate-pulse" />
              <span>Saadhana Board</span>
            </h1>
            <p className="text-muted-foreground font-light tracking-wide mt-1">
              Your celestial yantra for divine manifestation and spiritual growth
            </p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 bg-gradient-to-r from-purple-500/20 to-fuchsia-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-fuchsia-500/30 text-purple-700 dark:text-purple-300"
              onClick={() => setShowManifestationForm(!showManifestationForm)}
            >
              <Sparkles className="h-4 w-4" />
              <span>Manifest Intention</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-gradient-to-r from-fuchsia-500/20 to-indigo-500/20 border border-fuchsia-500/30 hover:from-fuchsia-500/30 hover:to-indigo-500/30 text-fuchsia-700 dark:text-fuchsia-300"
              onClick={handleDashboardToggle}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>View Progress</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 hover:from-indigo-500/30 hover:to-purple-500/30 text-indigo-700 dark:text-indigo-300"
              onClick={() => setView3D(!view3D)}
            >
              {view3D ? <Star className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
              <span>{view3D ? '2D View' : '3D View'}</span>
            </Button>
          </div>
        </div>
        
        {/* Enhanced description with cosmic styling */}
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-purple-500/10 to-fuchsia-500/10 border border-purple-500/20">
          <p className="text-muted-foreground font-light tracking-wide text-sm">
            <span className="font-medium text-purple-500">Tip:</span> Your spiritual intentions transcend dimensions through this cosmic yantra. 
            Connect with your divine guide to manifest your desires into reality.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SadhanaHeader;