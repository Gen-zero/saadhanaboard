import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import SaadhanaBoard from "@/components/SaadhanaBoard";

const CosmicParticle = ({ delay }: { delay: number }) => {
  return (
    <div 
      className="absolute rounded-full bg-purple-500 opacity-0"
      style={{
        width: `${Math.random() * 3 + 1}px`,
        height: `${Math.random() * 3 + 1}px`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        animation: `float ${Math.random() * 5 + 3}s ease-in-out infinite, 
                    cosmic-pulse ${Math.random() * 4 + 2}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
        opacity: Math.random() * 0.5 + 0.2
      }}
    ></div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [cursorType, setCursorType] = useState('default');
  const [isVisible, setIsVisible] = useState(false);
  const [trailParticles, setTrailParticles] = useState<Array<{x: number, y: number, id: number}>>([]);
  
  useEffect(() => {
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
      {isVisible && (
        <div 
          className={`fixed pointer-events-none z-[10000] transition-transform duration-100 ease-out`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: cursorType === 'text' ? '2px' : '32px',
            height: cursorType === 'text' ? '24px' : '32px',
            transform: 'translate(-50%, -50%)',
            opacity: isVisible ? 1 : 0,
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
              <div className="absolute w-8 h-8 rounded-full border border-purple-400/70 animate-[cursor-pulse_2s_ease-in-out_infinite] animate-delay-500"></div>
            </div>
          )}
          
          {cursorType === 'text' && (
            <div className="w-full h-full bg-purple-400 animate-[cursor-pulse_1.5s_ease-in-out_infinite]"></div>
          )}
        </div>
      )}
    </>
  );
};

const SadhanaPage = () => {
  const [hasVisited, setHasVisited] = useState(false);
  const [cosmicParticles, setCosmicParticles] = useState<number[]>([]);
  
  useEffect(() => {
    // Create cosmic particles
    const particles = Array.from({ length: 50 }, (_, i) => i);
    setCosmicParticles(particles);
    
    // Set cosmic background
    document.body.classList.add('cosmic-bg');
    
    // Play ethereal sound on first visit
    if (!localStorage.getItem('visited-sadhana')) {
      localStorage.setItem('visited-sadhana', 'true');
      
      try {
        const audio = new Audio('/sounds/cosmic-enter.mp3');
        audio.volume = 0.2;
        audio.play();
      } catch (err) {
        console.log('Audio could not be played automatically');
      }
    }
    
    setHasVisited(true);
    
    return () => {
      document.body.classList.remove('cosmic-bg');
    };
  }, []);

  return (
    <Layout>
      {/* Custom Cursor */}
      <CustomCursor />
      
      {/* Cosmic particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {cosmicParticles.map((_, index) => (
          <CosmicParticle key={index} delay={index * 0.1} />
        ))}
      </div>
      
      {/* Entrance animation */}
      <div className={`transition-all duration-1000 transform ${hasVisited ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <SaadhanaBoard />
      </div>
    </Layout>
  );
};

export default SadhanaPage;
