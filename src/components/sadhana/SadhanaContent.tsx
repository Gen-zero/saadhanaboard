
import React from 'react';
import SadhanaDetails from './SadhanaDetails';
import SadhanaViewer from './SadhanaViewer';
import PaperScroll2D from './PaperScroll2D';
import SadhanaWelcome from './SadhanaWelcome';
import SadhanaSetupForm from './SadhanaSetupForm';
import { SadhanaData } from '@/hooks/useSadhanaData';

interface SadhanaContentProps {
  isEditing: boolean;
  view3D: boolean;
  hasStarted: boolean;
  isCreating: boolean;
  sadhanaData: SadhanaData | null;
  paperContent: string;
  setView3D: (value: boolean) => void;
  onStartSadhana: () => void;
  onCancelSadhana: () => void;
  onCreateSadhana: (data: SadhanaData) => void;
  onUpdateSadhana: (data: SadhanaData) => void;
}

const SadhanaContent = ({
  isEditing,
  view3D,
  hasStarted,
  isCreating,
  sadhanaData,
  paperContent,
  setView3D,
  onStartSadhana,
  onCancelSadhana,
  onCreateSadhana,
  onUpdateSadhana
}: SadhanaContentProps) => {
  // If no sadhana has been started, show welcome screen
  if (!hasStarted && !isCreating) {
    return (
      <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
        <SadhanaWelcome onStartSadhana={onStartSadhana} />
      </div>
    );
  }

  // If user is creating a sadhana, show the setup form
  if (isCreating) {
    return (
      <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
        <SadhanaSetupForm 
          onCreateSadhana={onCreateSadhana}
          onCancel={onCancelSadhana}
        />
      </div>
    );
  }

  // If sadhana exists and user is editing, show details form
  if (hasStarted && sadhanaData && isEditing) {
    return (
      <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
        <SadhanaDetails 
          sadhanaData={sadhanaData} 
          onUpdateSadhana={onUpdateSadhana}
        />
      </div>
    );
  }

  // If sadhana exists and user wants 3D view, show viewer
  if (hasStarted && view3D) {
    return (
      <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
        <SadhanaViewer paperContent={paperContent} />
      </div>
    );
  }

  // Default: show the 2D paper scroll
  return (
    <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
      <div className="cosmic-nebula-bg rounded-lg p-6">
        <PaperScroll2D 
          content={paperContent} 
          onClick={() => {}} 
        />
      </div>
    </div>
  );
};

export default SadhanaContent;
