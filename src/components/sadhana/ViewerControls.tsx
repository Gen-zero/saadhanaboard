
import React from 'react';
import { Button } from '@/components/ui/button';
import { Download, VolumeX, Volume2 } from 'lucide-react';

interface ViewerControlsProps {
  audioPlaying: boolean;
  toggleAudio: () => void;
  handlePrint: () => void;
}

const ViewerControls = ({ audioPlaying, toggleAudio, handlePrint }: ViewerControlsProps) => {
  return (
    <div className="absolute top-4 right-4 z-10 flex gap-2">
      <Button 
        variant="secondary" 
        size="sm" 
        className="backdrop-blur-md bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all btn-cosmic"
        onClick={toggleAudio}
      >
        {audioPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        <span>{audioPlaying ? "Mute" : "Play Ambient"}</span>
      </Button>
      
      <Button 
        variant="secondary" 
        size="sm" 
        className="backdrop-blur-md bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-all btn-cosmic"
        onClick={handlePrint}
      >
        <Download className="h-4 w-4" />
        <span>Download Saadhana</span>
      </Button>
    </div>
  );
};

export default ViewerControls;
