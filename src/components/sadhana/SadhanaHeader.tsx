
import React from 'react';
import { MoonStar, Sparkles, Eye, Pencil, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SadhanaHeaderProps {
  isEditing: boolean;
  showManifestationForm: boolean;
  view3D: boolean;
  showDashboard: boolean;
  setIsEditing: (value: boolean) => void;
  setShowManifestationForm: (value: boolean) => void;
  setView3D: (value: boolean) => void;
  setShowDashboard: (value: boolean) => void;
}

const SadhanaHeader = ({
  isEditing,
  showManifestationForm,
  view3D,
  showDashboard,
  setIsEditing,
  setShowManifestationForm,
  setView3D,
  setShowDashboard
}: SadhanaHeaderProps) => {

  const handleDashboardToggle = () => {
    setShowDashboard(!showDashboard);
    if (!showDashboard) { // If turning dashboard ON
      setIsEditing(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) { // If turning edit mode ON
      setShowDashboard(false);
    }
  };

  return (
    <div className="backdrop-blur-sm bg-background/70 p-4 rounded-lg border border-purple-500/20">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
          <MoonStar className="h-7 w-7 text-purple-500" />
          <span>Saadhana Board</span>
          <span className="text-sm text-muted-foreground ml-2 italic font-normal">
            Celestial Yantra for Divine Manifestation
          </span>
        </h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
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
            className="flex items-center gap-1 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
            onClick={handleDashboardToggle}
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>{showDashboard ? 'View Saadhana' : 'View Progress'}</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
            onClick={handleEditToggle}
            disabled={showDashboard}
          >
            {isEditing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            {isEditing ? 'Cosmic View' : 'Edit Details'}
          </Button>
        </div>
      </div>
      <p className="text-muted-foreground font-light tracking-wide">
        Your spiritual intentions transcend dimensions through this cosmic yantra. Connect with your divine guide to manifest your desires into reality.
      </p>
    </div>
  );
};

export default SadhanaHeader;
