
import { useState, useEffect } from 'react';
import ManifestationForm from './sadhana/ManifestationForm';
import SadhanaHeader from './sadhana/SadhanaHeader';
import SadhanaContent from './sadhana/SadhanaContent';
import SadhanaFooter from './sadhana/SadhanaFooter';
import CosmicBackgroundSimple from './sadhana/CosmicBackgroundSimple';
import { useSadhanaData } from '@/hooks/useSadhanaData';
import { useManifestationForm } from '@/hooks/useManifestationForm';
import { useSadhanaView } from '@/hooks/useSadhanaView';

const SaadhanaBoard = () => {
  // Use our custom hooks to manage state
  const { sadhanaData, paperContent } = useSadhanaData();
  const { isEditing, view3D, setIsEditing, setView3D } = useSadhanaView();
  const { showManifestationForm, setShowManifestationForm } = useManifestationForm();

  return (
    <div className="space-y-6 animate-fade-in relative">
      <CosmicBackgroundSimple />
      
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
