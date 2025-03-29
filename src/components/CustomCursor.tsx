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
          width: cursorType === 'text' ? '2px' : '32px',
          height: cursorType === 'text' ? '24px' : '32px',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {cursorType === 'default' && (
          <div className="w-full h-full rounded-full bg-purple-500/30 backdrop-blur-sm border border-purple-400/50 animate-[cursor-pulse_2s_ease-in-out_infinite]">
            <div className="absolute inset-0 w-2 h-2 rounded-full bg-purple-400 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          </div>
        )}
        
        {cursorType === 'pointer' && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 animate-[cursor-pulse_1s_ease-in-out_infinite]"></div>
            <div className="absolute w-8 h-8 rounded-full border border-purple-400/70 animate-[cursor-pulse_2s_ease-in-out_infinite]"></div>
          </div>
        )}
        
        {cursorType === 'text' && (
          <div className="w-full h-full bg-purple-400 animate-[cursor-pulse_1.5s_ease-in-out_infinite]"></div>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
