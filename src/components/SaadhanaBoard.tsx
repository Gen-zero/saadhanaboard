
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
import { Progress } from '@/components/ui/progress';
import { Eye, Pencil, RotateCcw, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const SaadhanaBoard = () => {
  const { 
    sadhanaState, 
    sadhanaData, 
    paperContent, 
    startSadhanaCreation,
    cancelSadhanaCreation,
    createCustomSadhana,
    selectStoreSadhana,
    createSadhana,
    updateSadhana,
    completeSadhana,
    breakSadhana,
    resetSadhana,
    canComplete,
    daysRemaining,
    daysCompleted,
    progress
  } = useSadhanaData();
  
  const { isEditing, view3D, showDashboard, setIsEditing, setView3D, setShowDashboard } = useSadhanaView();
  const { showManifestationForm, setShowManifestationForm } = useManifestationForm();

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (!isEditing) { // If turning edit mode ON
      setShowDashboard(false);
    }
  };

  const handleCompleteSadhana = () => {
    if (confirm('Are you sure you want to mark this sadhana as complete? You have successfully finished your spiritual practice!')) {
      completeSadhana();
      setIsEditing(false);
      setView3D(false);
    }
  };

  const handleBreakSadhana = () => {
    if (confirm('Are you sure you want to break this sadhana? This will end your current practice early. You can start a new sadhana afterwards.')) {
      breakSadhana();
      setIsEditing(false);
      setView3D(false);
    }
  };

  const handleResetSadhana = () => {
    if (confirm('Are you sure you want to start a new sadhana? This will clear your current practice.')) {
      resetSadhana();
      setIsEditing(false);
      setView3D(false);
    }
  };

  const getStatusMessage = () => {
    if (sadhanaState.status === 'completed') {
      return 'Sadhana completed successfully! 🎉';
    }
    if (sadhanaState.status === 'broken') {
      return 'Sadhana was ended early. You can start a new one.';
    }
    if (canComplete) {
      return `Sadhana period complete! You can now mark it as finished.`;
    }
    return `Day ${daysCompleted} of ${sadhanaData?.durationDays} • ${daysRemaining} days remaining`;
  };

  const getStatusColor = () => {
    if (sadhanaState.status === 'completed') return 'text-green-600';
    if (sadhanaState.status === 'broken') return 'text-red-600';
    if (canComplete) return 'text-blue-600';
    return 'text-muted-foreground';
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
              {sadhanaState.hasStarted && sadhanaData && (
                <div className="space-y-4">
                  {/* Sadhana Header with Progress */}
                  <div className="backdrop-blur-sm bg-background/70 p-6 rounded-lg border border-purple-500/20">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600 mb-2">
                          Your Sacred Sadhana
                        </h2>
                        <div className="flex items-center gap-4 text-sm mb-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {format(new Date(sadhanaData.startDate), 'MMM dd')} - {format(new Date(sadhanaData.endDate), 'MMM dd, yyyy')}
                          </span>
                          <span className={getStatusColor()}>
                            {getStatusMessage()}
                          </span>
                        </div>
                        
                        {/* Progress Bar */}
                        {sadhanaState.status === 'active' && (
                          <div className="space-y-2">
                            <Progress value={progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {Math.round(progress)}% complete
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 shrink-0 ml-4">
                        {sadhanaState.status === 'active' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1 bg-purple-500/10 border-purple-500/30 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300"
                              onClick={handleEditToggle}
                            >
                              {isEditing ? <Eye className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                              {isEditing ? 'View Paper' : 'Edit Details'}
                            </Button>
                            
                            {canComplete && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex items-center gap-1 bg-green-500/10 border-green-500/30 hover:bg-green-500/20 text-green-700 dark:text-green-300"
                                onClick={handleCompleteSadhana}
                              >
                                <CheckCircle className="h-4 w-4" />
                                Complete Sadhana
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex items-center gap-1 bg-red-500/10 border-red-500/30 hover:bg-red-500/20 text-red-700 dark:text-red-300"
                              onClick={handleBreakSadhana}
                            >
                              <XCircle className="h-4 w-4" />
                              Break Sadhana
                            </Button>
                          </>
                        )}
                        
                        {(sadhanaState.status === 'completed' || sadhanaState.status === 'broken') && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex items-center gap-1 bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300"
                            onClick={handleResetSadhana}
                          >
                            <RotateCcw className="h-4 w-4" />
                            Start New Sadhana
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <SadhanaContent 
                isEditing={isEditing}
                view3D={view3D}
                hasStarted={sadhanaState.hasStarted}
                isCreating={sadhanaState.isCreating}
                isSelecting={sadhanaState.isSelecting}
                sadhanaData={sadhanaData}
                paperContent={paperContent}
                setView3D={setView3D}
                onStartSadhana={startSadhanaCreation}
                onCancelSadhana={cancelSadhanaCreation}
                onCreateSadhana={createSadhana}
                onUpdateSadhana={updateSadhana}
                onSelectStoreSadhana={selectStoreSadhana}
                onCreateCustomSadhana={createCustomSadhana}
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
