
import { useState } from 'react';
import { BookOpen, Edit, WandSparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ManifestationForm from './sadhana/ManifestationForm';
import SadhanaDetails from './sadhana/SadhanaDetails';
import SadhanaViewer from './sadhana/SadhanaViewer';

const SaadhanaBoard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showManifestationForm, setShowManifestationForm] = useState(false);
  
  // Mock data for sadhana board
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <span>Saadhana Board</span>
            <span className="text-sm text-muted-foreground ml-2 italic font-normal">
              Digital Yantra for Manifestation
            </span>
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowManifestationForm(!showManifestationForm)}
            >
              <WandSparkles className="h-4 w-4" />
              Manifest Intention
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit className="h-4 w-4" />
              {isEditing ? 'View Mode' : 'Edit Details'}
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Your spiritual intentions, goals, and devotional practice. Connect with your deity to manifest ideas into reality.
        </p>
      </div>

      {showManifestationForm && (
        <ManifestationForm onClose={() => setShowManifestationForm(false)} />
      )}

      {isEditing ? (
        <SadhanaDetails sadhanaData={sadhanaData} />
      ) : (
        <SadhanaViewer paperContent={paperContent} />
      )}
    </div>
  );
};

export default SaadhanaBoard;
