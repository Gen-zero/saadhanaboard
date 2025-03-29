
import { PerspectiveCamera, Environment } from '@react-three/drei';
import SacredYantra from './SacredYantra';
import PaperScroll from './PaperScroll';

interface SceneContainerProps {
  paperContent: string;
}

const SceneContainer = ({ paperContent }: SceneContainerProps) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={45} />
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Add glowing yantra behind the paper */}
      <SacredYantra position={[0, 0, -0.5]} scale={0.9} />
      
      {/* Paper with intentions */}
      <PaperScroll 
        content={paperContent} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]} 
      />
      
      <Environment preset="night" />
    </>
  );
};

export default SceneContainer;
