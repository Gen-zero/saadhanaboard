
import React from 'react';
import SadhanaDetails from './SadhanaDetails';
import SadhanaViewer from './SadhanaViewer';
import PaperScroll2D from './PaperScroll2D';

interface SadhanaContentProps {
  isEditing: boolean;
  view3D: boolean;
  sadhanaData: {
    purpose: string;
    goal: string;
    deity: string;
    message: string;
    offerings: string[];
  };
  paperContent: string;
  setView3D: (value: boolean) => void;
}

const SadhanaContent = ({
  isEditing,
  view3D,
  sadhanaData,
  paperContent,
  setView3D
}: SadhanaContentProps) => {
  return (
    <div className="transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
      {isEditing ? (
        <SadhanaDetails sadhanaData={sadhanaData} />
      ) : view3D ? (
        <SadhanaViewer paperContent={paperContent} />
      ) : (
        <div className="cosmic-nebula-bg rounded-lg p-6">
          <PaperScroll2D 
            content={paperContent} 
            onClick={() => {}} // Removed 3D view functionality
          />
          {/* Removed 3D view instruction */}
        </div>
      )}
    </div>
  );
};

export default SadhanaContent;
