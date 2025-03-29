
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface PaperProps {
  content: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

const PaperScroll = ({ content, position, rotation }: PaperProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Paper background */}
      <mesh ref={meshRef} castShadow>
        <planeGeometry args={[4.5, 6, 1]} />
        <meshStandardMaterial 
          color="#f5f0e0" 
          roughness={0.7} 
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Paper content */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.2}
        maxWidth={4}
        lineHeight={1.2}
        color="#331c0c"
        anchorX="center"
        anchorY="middle"
        font="/fonts/poppins-v20-latin-regular.woff"
      >
        {content}
      </Text>
    </group>
  );
};

export default PaperScroll;
