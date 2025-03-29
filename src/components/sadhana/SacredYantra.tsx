
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SacredYantraProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  color?: string;
}

const SacredYantra = ({ 
  position = [0, 0, 0], 
  rotation = [0, 0, 0], 
  scale = 1, 
  color = "#f5b042" 
}: SacredYantraProps) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing effect
      meshRef.current.scale.x = scale * (1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05);
      meshRef.current.scale.y = scale * (1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05);
      meshRef.current.rotation.z += 0.0005;
    }
  });

  // Create the yantra shape
  const createYantraShape = () => {
    const shape = new THREE.Shape();
    
    // Outer circle
    const segments = 64;
    const radius = 2;
    
    // Start point
    shape.moveTo(radius, 0);
    
    // Create circle
    for (let i = 1; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      shape.lineTo(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius
      );
    }
    
    // Create inner triangle
    const triangleShape = new THREE.Shape();
    const triangleSize = radius * 0.8;
    triangleShape.moveTo(0, triangleSize);
    triangleShape.lineTo(-triangleSize * Math.sqrt(3)/2, -triangleSize/2);
    triangleShape.lineTo(triangleSize * Math.sqrt(3)/2, -triangleSize/2);
    triangleShape.lineTo(0, triangleSize);
    
    // Create inner hexagon
    const hexagonShape = new THREE.Shape();
    const hexRadius = radius * 0.5;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * hexRadius;
      const y = Math.sin(angle) * hexRadius;
      if (i === 0) hexagonShape.moveTo(x, y);
      else hexagonShape.lineTo(x, y);
    }
    hexagonShape.closePath();
    
    shape.holes.push(triangleShape);
    shape.holes.push(hexagonShape);
    
    return shape;
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} castShadow>
        <shapeGeometry args={[createYantraShape()]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.4}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default SacredYantra;
