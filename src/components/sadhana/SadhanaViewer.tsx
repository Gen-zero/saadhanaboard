
import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Button } from '@/components/ui/button';
import { Download, VolumeX, Volume2 } from 'lucide-react';
import SceneContainer from './SceneContainer';

interface SadhanaViewerProps {
  paperContent: string;
}

const SadhanaViewer = ({ paperContent }: SadhanaViewerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  
  useEffect(() => {
    // Create ambient sound
    const audio = new Audio('/sounds/ambient.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  const toggleAudio = () => {
    if (audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };
  
  const handlePrint = () => {
    // Implementation for printing functionality
    console.log('Printing sadhana');
  };

  return (
    <div className="w-full bg-gradient-to-br from-indigo-950 via-purple-900 to-indigo-950 rounded-lg overflow-hidden shadow-2xl relative h-[600px]">
      {/* Cosmic background elements using theme colors */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl animate-pulse-slow bg-primary/50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full filter blur-3xl animate-pulse-slow bg-accent/50" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full filter blur-3xl animate-pulse-slow bg-secondary/60" style={{ animationDelay: '2s' }}></div>
      </div>
      
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
      
      <Canvas 
        shadows 
        dpr={[1, 2]} 
        className="h-full w-full"
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <SceneContainer paperContent={paperContent} />
      </Canvas>
      
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-purple-900/50 to-transparent text-white text-center">
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-sm font-light tracking-wider opacity-90">
            Your Saadhana details inscribed upon the cosmic scroll, empowered by the sacred yantra to manifest your intentions across dimensions
          </p>
          <div className="flex justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div 
                key={dot} 
                className="w-1.5 h-1.5 bg-white rounded-full opacity-70"
                style={{ 
                  animation: `pulse 2s infinite`,
                  animationDelay: `${dot * 0.3}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SadhanaViewer;
