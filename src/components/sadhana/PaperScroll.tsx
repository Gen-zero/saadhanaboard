
import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text, useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface PaperProps {
  content: string;
  position: [number, number, number];
  rotation: [number, number, number];
}

const PaperScroll = ({ content, position, rotation }: PaperProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  // Load texture for the scroll
  const texture = useTexture("/textures/parchment.jpg");
  
  // Create displacement and normal maps
  const displacement = useTexture("/textures/displacement.jpg");
  displacement.wrapS = displacement.wrapT = THREE.RepeatWrapping;
  
  // Create animated glowing effect
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating
      meshRef.current.rotation.y += 0.001;
      
      // Breathing effect when hovered
      if (hovered) {
        meshRef.current.scale.x = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
        meshRef.current.scale.y = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.03;
      }
      
      // Gentle glow effect
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      if (material.emissiveIntensity !== undefined) {
        material.emissiveIntensity = 0.1 + Math.sin(state.clock.getElapsedTime()) * 0.05;
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Paper background */}
      <mesh 
        ref={meshRef} 
        castShadow
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[4.5, 6, 32, 32]} />
        <meshStandardMaterial 
          map={texture}
          displacementMap={displacement}
          displacementScale={0.03}
          roughness={0.7} 
          metalness={0.1}
          side={THREE.DoubleSide}
          transparent={true}
          opacity={0.95}
          emissive="#ffebcd"
          emissiveIntensity={0.1}
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
