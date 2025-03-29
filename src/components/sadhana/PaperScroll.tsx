
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
  const [fallbackActive, setFallbackActive] = useState(false);
  
  // Create a fallback texture in case the external one fails to load
  const createFallbackTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const context = canvas.getContext('2d');
    
    if (context) {
      // Create parchment-like background with ivory color
      const gradient = context.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 0,
        canvas.width / 2, canvas.height / 2, canvas.width / 2
      );
      gradient.addColorStop(0, '#FFFFF0'); // Ivory
      gradient.addColorStop(0.8, '#FFF8DC'); // Lighter Ivory
      gradient.addColorStop(1, '#F8F4E3'); // Slightly darker Ivory
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add some noise for texture
      for (let i = 0; i < 50000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const opacity = Math.random() * 0.1;
        
        context.fillStyle = `rgba(54, 69, 79, ${opacity})`; // Charcoal with opacity
        context.fillRect(x, y, 1, 1);
      }
      
      // Add some aging effects with crimson and gold touches
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const width = Math.random() * 100 + 50;
        const height = Math.random() * 5 + 2;
        const colorChoice = Math.random();
        const opacity = Math.random() * 0.05;
        
        if (colorChoice < 0.7) {
          context.fillStyle = `rgba(220, 20, 60, ${opacity})`; // Crimson with opacity
        } else {
          context.fillStyle = `rgba(255, 215, 0, ${opacity})`; // Gold with opacity
        }
        context.fillRect(x, y, width, height);
      }
      
      // Add subtle gold frame
      const frameWidth = 30;
      context.strokeStyle = 'rgba(255, 215, 0, 0.3)'; // Gold with opacity
      context.lineWidth = frameWidth;
      context.strokeRect(
        frameWidth / 2, 
        frameWidth / 2, 
        canvas.width - frameWidth, 
        canvas.height - frameWidth
      );
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };
  
  // Separate texture loading with error handling
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  
  useEffect(() => {
    // First attempt to load the texture directly
    const loader = new THREE.TextureLoader();
    loader.load(
      '/textures/parchment.jpg',
      // Success callback
      (loadedTexture) => {
        console.log("Texture loaded successfully");
        setTexture(loadedTexture);
      },
      // Progress callback
      undefined,
      // Error callback
      (error) => {
        console.error("Failed to load parchment texture:", error);
        setFallbackActive(true);
        setTexture(createFallbackTexture());
      }
    );
    
    // Cleanup
    return () => {
      if (texture) texture.dispose();
    };
  }, []);
  
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

  // Use fallback texture if texture loading fails or while loading
  const finalTexture = fallbackActive || !texture ? createFallbackTexture() : texture;

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
          emissive="#FFD700" // Gold emissive glow
          emissiveIntensity={0.1}
        />
      </mesh>
      
      {/* Paper content */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.2}
        maxWidth={4}
        lineHeight={1.2}
        color="#36454F" // Charcoal text color
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
