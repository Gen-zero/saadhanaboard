
import { useState, useEffect } from 'react';
import ManifestationForm from './sadhana/ManifestationForm';
import SadhanaHeader from './sadhana/SadhanaHeader';
import SadhanaContent from './sadhana/SadhanaContent';
import SadhanaFooter from './sadhana/SadhanaFooter';

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
      
      <SadhanaHeader 
        isEditing={isEditing}
        showManifestationForm={showManifestationForm}
        view3D={view3D}
        setIsEditing={setIsEditing}
        setShowManifestationForm={setShowManifestationForm}
        setView3D={setView3D}
      />

      {showManifestationForm && (
        <div className="relative z-10">
          <ManifestationForm onClose={() => setShowManifestationForm(false)} />
        </div>
      )}

      <SadhanaContent 
        isEditing={isEditing}
        view3D={view3D}
        sadhanaData={sadhanaData}
        paperContent={paperContent}
        setView3D={setView3D}
      />
      
      <SadhanaFooter />
    </div>
  );
};

export default SaadhanaBoard;
