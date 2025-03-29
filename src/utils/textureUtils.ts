
import * as THREE from 'three';

/**
 * Creates a fallback parchment texture when the external one fails to load
 */
export const createFallbackTexture = (): THREE.Texture => {
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

/**
 * Creates a displacement map for the parchment
 */
export const createDisplacementMap = (): THREE.Texture => {
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
