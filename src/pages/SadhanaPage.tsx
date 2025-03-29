
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
