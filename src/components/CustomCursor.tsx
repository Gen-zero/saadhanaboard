
import { useState, useEffect } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [trailParticles, setTrailParticles] = useState<Array<{x: number, y: number, id: number}>>([]);
  
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      
      // Add trail particle
      const newParticle = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now()
      };
      
      setTrailParticles(prev => {
        const updated = [...prev, newParticle];
        // Keep only the most recent particles
        if (updated.length > 5) {
          return updated.slice(updated.length - 5);
        }
        return updated;
      });
      
      // Check what element is being hovered
      const element = document.elementFromPoint(e.clientX, e.clientY);
      if (element) {
        if (element.tagName === 'BUTTON' || 
            element.closest('button') || 
            element.closest('a') ||
            element.hasAttribute('role') && element.getAttribute('role') === 'button' ||
            getComputedStyle(element).cursor === 'pointer') {
          setCursorType('pointer');
        } else if (element.tagName === 'INPUT' || 
                 element.tagName === 'TEXTAREA' ||
                 getComputedStyle(element).cursor === 'text') {
          setCursorType('text');
        } else {
          setCursorType('default');
        }
      }
    };
    
    const handleMouseLeave = () => {
      setIsVisible(false);
    };
    
    const handleMouseEnter = () => {
      setIsVisible(true);
    };
    
    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    
    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <>
      {/* Trail particles */}
      {trailParticles.map((particle, index) => (
        <div 
          key={particle.id}
          className="fixed rounded-full pointer-events-none mix-blend-screen z-[9999]"
          style={{
            left: `${particle.x}px`,
            top: `${particle.y}px`,
            width: '8px',
            height: '8px',
            opacity: 0.8 - (index * 0.15),
            background: 'radial-gradient(circle, rgba(147,51,234,0.5) 0%, rgba(139,92,246,0.2) 70%, rgba(0,0,0,0) 100%)',
            transform: `scale(${1 - index * 0.15})`,
            transition: 'opacity 100ms linear, transform 100ms linear',
          }}
        />
      ))}
      
      {/* Main cursor */}
      <div 
        className={`fixed pointer-events-none z-[10000] cursor-appear`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: cursorType === 'text' ? '2px' : '40px',
          height: cursorType === 'text' ? '24px' : '40px',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {cursorType === 'default' && (
          <div className="w-full h-full rounded-full bg-purple-500/20 backdrop-blur-sm border-2 border-purple-400/70 animate-[cursor-pulse_2s_ease-in-out_infinite]">
            {/* Large center point for better visibility */}
            <div className="absolute inset-0 w-4 h-4 rounded-full bg-purple-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[cursor-pulse_1s_ease-in-out_infinite] shadow-lg shadow-purple-400/50"></div>
            {/* Outer glow ring */}
            <div className="absolute inset-0 w-6 h-6 rounded-full border border-purple-300/60 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-[cursor-pulse_2s_ease-in-out_infinite_reverse]"></div>
          </div>
        )}
        
        {cursorType === 'pointer' && (
          <div className="w-full h-full flex items-center justify-center">
            {/* Larger center point for click indication */}
            <div className="w-6 h-6 rounded-full bg-purple-500 animate-[cursor-pulse_1s_ease-in-out_infinite] shadow-lg shadow-purple-500/50"></div>
            <div className="absolute w-10 h-10 rounded-full border-2 border-purple-400/70 animate-[cursor-pulse_2s_ease-in-out_infinite]"></div>
            {/* Additional click indicator */}
            <div className="absolute w-14 h-14 rounded-full border border-purple-300/40 animate-[cursor-pulse_3s_ease-in-out_infinite]"></div>
          </div>
        )}
        
        {cursorType === 'text' && (
          <div className="w-full h-full bg-purple-400 animate-[cursor-pulse_1.5s_ease-in-out_infinite] shadow-lg shadow-purple-400/50"></div>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
