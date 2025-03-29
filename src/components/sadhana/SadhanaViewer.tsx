
import { Canvas } from '@react-three/fiber';
import { Button } from '@/components/ui/button';
import SceneContainer from './SceneContainer';

interface SadhanaViewerProps {
  paperContent: string;
}

const SadhanaViewer = ({ paperContent }: SadhanaViewerProps) => {
  return (
    <div className="w-full bg-gray-950 rounded-lg overflow-hidden shadow-2xl relative h-[600px]">
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <Button variant="secondary" size="sm" className="bg-gray-800/50 text-white hover:bg-gray-700/50">
          <span>Print Saadhana</span>
        </Button>
      </div>
      
      <Canvas shadows dpr={[1, 2]} className="h-full w-full">
        <SceneContainer paperContent={paperContent} />
      </Canvas>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
        <p className="text-sm opacity-75">
          Your Saadhana details on a sacred scroll, empowered by the yantra for manifestation
        </p>
      </div>
    </div>
  );
};

export default SadhanaViewer;
