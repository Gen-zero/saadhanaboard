
import ManifestationForm from './sadhana/ManifestationForm';
import SadhanaHeader from './sadhana/SadhanaHeader';
import SadhanaContent from './sadhana/SadhanaContent';
import SadhanaFooter from './sadhana/SadhanaFooter';
import CosmicBackgroundSimple from './sadhana/CosmicBackgroundSimple';
import { useSadhanaData } from '@/hooks/useSadhanaData';
import { useManifestationForm } from '@/hooks/useManifestationForm';
import { useSadhanaView } from '@/hooks/useSadhanaView';
import Dashboard from './Dashboard';
import { Button } from '@/components/ui/button';
import { Eye, Pencil } from 'lucide-react';

const SaadhanaBoard = () => {
  // Use our custom hooks to manage state
  const { sadhanaData, paperContent } = useSadhanaData();
  const { isEditing, view3D, showDashboard, setIsEditing, setView3D, setShowDashboard } = useSadhanaView();
  const { showManifestationForm, setShowManifestationForm } = useManifestationForm();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) { // If turning edit mode ON
      setShowDashboard(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      <CosmicBackgroundSimple />
      
      <SadhanaHeader 
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
              <div className="flex justify-between items-start backdrop-blur-sm bg-background/70 p-4 rounded-lg border border-purple-500/20">
                <div>
                  <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-2">
                    Sacred Sadhana Paper
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Your spiritual intentions and divine practice documented
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 shrink-0 ml-4"
                  onClick={handleEditToggle}
                >
                  {isEditing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                  {isEditing ? 'Cosmic View' : 'Edit Details'}
                </Button>
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
