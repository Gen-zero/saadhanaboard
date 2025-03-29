
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import SacredYantra from './SacredYantra';

interface YantraProps {
  position: [number, number, number];
  scale: number;
  rotation: [number, number, number];
  color: string;
}

interface YantraGroupProps {
  yantras: YantraProps[];
}

const YantraGroup = ({ yantras }: YantraGroupProps) => {
  const groupRef = useRef<THREE.Group>(null);

  // Animation for the yantra group
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle rotation of the scene
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.1;
      
      // Gentle floating up and down
      groupRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {yantras.map((yantra, index) => (
        <SacredYantra 
          key={index}
          position={yantra.position} 
          scale={yantra.scale} 
          rotation={yantra.rotation}
          color={yantra.color}
        />
      ))}
    </group>
  );
};

export default YantraGroup;
