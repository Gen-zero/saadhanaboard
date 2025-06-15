
import ManifestationForm from './sadhana/ManifestationForm';
import SadhanaHeader from './sadhana/SadhanaHeader';
import SadhanaContent from './sadhana/SadhanaContent';
import SadhanaFooter from './sadhana/SadhanaFooter';
import CosmicBackgroundSimple from './sadhana/CosmicBackgroundSimple';
import { useSadhanaData } from '@/hooks/useSadhanaData';
import { useManifestationForm } from '@/hooks/useManifestationForm';
import { useSadhanaView } from '@/hooks/useSadhanaView';
import Dashboard from './Dashboard';

const SaadhanaBoard = () => {
  // Use our custom hooks to manage state
  const { sadhanaData, paperContent } = useSadhanaData();
  const { isEditing, view3D, showDashboard, setIsEditing, setView3D, setShowDashboard } = useSadhanaView();
  const { showManifestationForm, setShowManifestationForm } = useManifestationForm();

  return (
    <div className="space-y-8 animate-fade-in relative">
      <CosmicBackgroundSimple />
      
      <SadhanaHeader 
        isEditing={isEditing}
        showManifestationForm={showManifestationForm}
        view3D={view3D}
        showDashboard={showDashboard}
        setIsEditing={setIsEditing}
        setShowManifestationForm={setShowManifestationForm}
        setView3D={setView3D}
        setShowDashboard={setShowDashboard}
      />

      {showManifestationForm && (
        <div className="relative z-10">
          <ManifestationForm onClose={() => setShowManifestationForm(false)} />
        </div>
      )}

      {showDashboard ? (
        <Dashboard />
      ) : (
        <div className="flex justify-center">
          <div className="w-full lg:max-w-4xl">
            {/* Sadhana Paper Section */}
            <div className="space-y-6">
              <div className="backdrop-blur-sm bg-background/70 p-4 rounded-lg border border-purple-500/20">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-2">
                  Sacred Sadhana Paper
                </h2>
                <p className="text-muted-foreground text-sm">
                  Your spiritual intentions and divine practice documented
                </p>
              </div>
              
              <SadhanaContent 
                isEditing={isEditing}
                view3D={view3D}
                sadhanaData={sadhanaData}
                paperContent={paperContent}
                setView3D={setView3D}
              />
            </div>
          </div>
        </div>
      )}
      
      <SadhanaFooter />
    </div>
  );
};

export default SaadhanaBoard;
