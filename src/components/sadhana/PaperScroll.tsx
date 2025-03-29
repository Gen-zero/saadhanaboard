
import { useRef, useState, useEffect } from 'react';
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
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [fallbackActive, setFallbackActive] = useState(false);
  
  // Create a fallback texture in case the external one fails to load
  const createFallbackTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Create parchment-like background
      const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, '#f5e7d3');
      gradient.addColorStop(0.8, '#e8d4b7');
      gradient.addColorStop(1, '#d8c4a7');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some noise for texture
      for (let i = 0; i < 50000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const opacity = Math.random() * 0.1;
        
        context.fillStyle = `rgba(0, 0, 0, ${opacity})`;
        context.fillRect(x, y, 1, 1);
      }
      
      // Add some aging effects
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 100 + 50;
        const height = Math.random() * 5 + 2;
        const opacity = Math.random() * 0.05;
        
        context.fillStyle = `rgba(139, 69, 19, ${opacity})`;
        context.fillRect(x, y, width, height);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };
  
  // Use the useTexture hook correctly with proper error handling
  const parchmentTexture = useTexture(
    '/textures/parchment.jpg',
    (texture) => {
      // Success callback
      setTextureLoaded(true);
      console.log("Texture loaded successfully");
    }
  );
  
  // Handle texture loading error
  useEffect(() => {
    const handleError = () => {
      console.error("Failed to load parchment texture");
      setFallbackActive(true);
    };
    
    // Add error event listener to the texture's source
    if (parchmentTexture && parchmentTexture.source) {
      const image = parchmentTexture.source.data;
      if (image instanceof HTMLImageElement) {
        image.addEventListener('error', handleError);
        return () => {
          image.removeEventListener('error', handleError);
        };
      }
    }
  }, [parchmentTexture]);
  
  // Create final texture based on load status
  const finalTexture = fallbackActive ? createFallbackTexture() : parchmentTexture;
  
  // Create displacement map
  const createDisplacementMap = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    
    if (context) {
      context.fillStyle = '#888888';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some random noise for displacement
      for (let i = 0; i < 10000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const grayValue = Math.floor(Math.random() * 40 + 100);
        context.fillStyle = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
        context.fillRect(x, y, 3, 3);
      }
    }
    
    const displacementTexture = new THREE.CanvasTexture(canvas);
    displacementTexture.wrapS = displacementTexture.wrapT = THREE.RepeatWrapping;
    return displacementTexture;
  };
  
  const displacement = createDisplacementMap();
  
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
          map={finalTexture}
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
