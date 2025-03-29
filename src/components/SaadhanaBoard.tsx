
import { useState, useEffect } from 'react';
import { BookOpen, Edit, WandSparkles, MoonStar, Sparkles, Eye, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ManifestationForm from './sadhana/ManifestationForm';
import SadhanaDetails from './sadhana/SadhanaDetails';
import SadhanaViewer from './sadhana/SadhanaViewer';
import PaperScroll2D from './sadhana/PaperScroll2D';

const SaadhanaBoard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showManifestationForm, setShowManifestationForm] = useState(false);
  const [view3D, setView3D] = useState(false); // Toggle between 2D and 3D view
  
  const sadhanaData = {
    purpose: "To deepen my connection with the divine and cultivate inner peace.",
    goal: "Complete a 40-day meditation practice focusing on gratitude and compassion.",
    deity: "Universal Divine Consciousness",
    message: "I offer my practice with devotion and seek guidance on this spiritual journey.",
    offerings: [
      "Daily meditation for 30 minutes",
      "Weekly reading of sacred texts",
      "Acts of service in my community",
      "Abstaining from negative speech",
      "Practice of gratitude"
    ]
  };

  const paperContent = `
Purpose:
${sadhanaData.purpose}

Goal:
${sadhanaData.goal}

Divine Focus:
${sadhanaData.deity}

Message:
"${sadhanaData.message}"

My Offerings:
${sadhanaData.offerings.map((o, i) => `${i+1}. ${o}`).join('\n')}
  `;

  return (
    <div className="space-y-6 animate-fade-in relative">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-indigo-500/20 rounded-full filter blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>
      
      <div className="flex flex-col gap-2 backdrop-blur-sm bg-background/70 p-4 rounded-lg border border-purple-500/20">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
            <MoonStar className="h-7 w-7 text-purple-500" />
            <span>Saadhana Board</span>
            <span className="text-sm text-muted-foreground ml-2 italic font-normal">
              Celestial Yantra for Divine Manifestation
            </span>
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
              onClick={() => setShowManifestationForm(!showManifestationForm)}
            >
              <Sparkles className="h-4 w-4" />
              <span>Manifest Intention</span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
              </span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
              {isEditing ? 'Cosmic View' : 'Edit Details'}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
              onClick={() => setView3D(!view3D)}
            >
              <BookOpen className="h-4 w-4" />
              {view3D ? '2D View' : '3D View'}
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground font-light tracking-wide">
          Your spiritual intentions transcend dimensions through this cosmic yantra. Connect with your divine guide to manifest your desires into reality.
        </p>
      </div>

      {showManifestationForm && (
        <div className="relative z-10">
          <ManifestationForm onClose={() => setShowManifestationForm(false)} />
        </div>
      )}

      <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
        {isEditing ? (
          <SadhanaDetails sadhanaData={sadhanaData} />
        ) : view3D ? (
          <SadhanaViewer paperContent={paperContent} />
        ) : (
          <div className="cosmic-nebula-bg rounded-lg p-6">
            <PaperScroll2D 
              content={paperContent} 
              onClick={() => setView3D(true)}
            />
            <div className="text-center mt-4 italic text-sm text-muted-foreground">
              Click the scroll to view in 3D immersive mode
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gradient-to-r from-indigo-900/20 to-purple-900/20 rounded-lg border border-purple-500/20 backdrop-blur-md">
        <p className="text-center text-sm italic text-indigo-200 font-light tracking-wide">
          "The universe is not outside of you. Look inside yourself; everything that you want, you already are." — Rumi
        </p>
      </div>
    </div>
  );
};

export default SaadhanaBoard;
