
import { useRef, useEffect } from 'react';
import { PerspectiveCamera, Environment, useGLTF, useTexture, Sparkles } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import SacredYantra from './SacredYantra';
import PaperScroll from './PaperScroll';

interface SceneContainerProps {
  paperContent: string;
}

const SceneContainer = ({ paperContent }: SceneContainerProps) => {
  const { camera } = useThree();
  const groupRef = useRef<THREE.Group>(null);
  
  // Create multiple yantras for a more complex visual experience
  const yantras = [
    { position: [0, 0, -0.2], scale: 1.2, rotation: [0, 0, 0], color: "#f5b042" }, // Main yantra closer and larger
    { position: [2.5, 1.2, -1.5], scale: 0.4, rotation: [0.5, 0.2, 0], color: "#ff719A" },
    { position: [-2.5, -1.2, -1.5], scale: 0.5, rotation: [-0.3, -0.5, 0], color: "#9D4EDD" },
    { position: [0, 2.5, -2.5], scale: 0.6, rotation: [0.7, 0, 0.2], color: "#00B4D8" },
    { position: [0, -2.5, -2.5], scale: 0.7, rotation: [-0.7, 0, -0.2], color: "#FFD60A" },
  ];

  // Auto-rotation of the entire scene
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation of the scene
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
      
      // Gentle floating up and down
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
    
    // Camera slight movement for more immersion
    camera.position.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 4.8]} fov={45} /> {/* Closer camera position */}
      <ambientLight intensity={0.3} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Add volumetric light rays */}
      <fog attach="fog" args={['#070423', 8, 20]} />
      
      {/* Cosmic particles */}
      <Sparkles count={300} scale={10} size={0.6} speed={0.3} color="#ffffff" />
      <Sparkles count={100} scale={10} size={0.3} speed={0.2} color="#f5b042" />
      
      <group ref={groupRef}>
        {/* Multiple yantras */}
        {yantras.map((yantra, index) => (
          <SacredYantra 
            key={index}
            position={yantra.position as [number, number, number]} 
            scale={yantra.scale} 
            rotation={yantra.rotation as [number, number, number]}
            color={yantra.color}
          />
        ))}
        
        {/* Paper with intentions */}
        <PaperScroll 
          content={paperContent} 
          position={[0, 0, 0]} 
          rotation={[0, 0, 0]} 
        />
      </group>
      
      <Environment preset="night" />
    </>
  );
};

export default SceneContainer;
