
import { useRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import SceneContainer from './SceneContainer';
import ViewerControls from './ViewerControls';
import ViewerFooter from './ViewerFooter';
import CosmicBackground from './CosmicBackground';

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
      <CosmicBackground />
      
      <ViewerControls 
        audioPlaying={audioPlaying} 
        toggleAudio={toggleAudio} 
        handlePrint={handlePrint} 
      />
      
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
      
      <ViewerFooter />
    </div>
  );
};

export default SadhanaViewer;
