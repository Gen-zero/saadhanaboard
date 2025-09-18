import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { usePsychologicalLevers } from "@/hooks/usePsychologicalLevers";
import { DEITIES } from "@/data";

interface InitiationModalProps {
  open: boolean;
  onClose: () => void;
}

const InitiationModal = ({ open, onClose }: InitiationModalProps) => {
  const { psychologicalProfile, setInitiation } = usePsychologicalLevers();
  const [selectedDeity, setSelectedDeity] = useState(psychologicalProfile.initiatedDeity || "");
  const [sankalpa, setSankalpa] = useState(psychologicalProfile.sankalpa || "");
  const [otherDeity, setOtherDeity] = useState("");

  const handleSubmit = () => {
    const deity = selectedDeity === "other" ? otherDeity : selectedDeity;
    if (deity && sankalpa) {
      setInitiation(deity, sankalpa);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
            Spiritual Initiation
          </DialogTitle>
          <DialogDescription>
            Set your iṣṭa-devatā (chosen deity) and take a sacred sankalpa (vow) to begin your spiritual journey.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="deity" className="text-base font-medium">
              Choose Your Iṣṭa-Devatā
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Select the deity you wish to dedicate your practice to
            </p>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2">
              {DEITIES.map((deity) => (
                <div
                  key={deity.value}
                  onClick={() => setSelectedDeity(deity.value)}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center ${
                    selectedDeity === deity.value
                      ? "border-purple-500 bg-purple-500/10 scale-105"
                      : "border-border hover:border-purple-500/50 hover:bg-purple-500/5"
                  }`}
                >
                  <div className="text-2xl mb-1">{deity.emoji}</div>
                  <div className="text-xs text-center">{deity.label}</div>
                </div>
              ))}
              
              <div
                onClick={() => setSelectedDeity("other")}
                className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 flex flex-col items-center ${
                  selectedDeity === "other"
                    ? "border-purple-500 bg-purple-500/10 scale-105"
                    : "border-border hover:border-purple-500/50 hover:bg-purple-500/5"
                }`}
              >
                <div className="text-2xl mb-1">✨</div>
                <div className="text-xs text-center">Other</div>
              </div>
            </div>
            
            {selectedDeity === "other" && (
              <div className="mt-3">
                <Input
                  placeholder="Enter deity name"
                  value={otherDeity}
                  onChange={(e) => setOtherDeity(e.target.value)}
                  className="bg-background/50 border-purple-500/20 focus:border-purple-500/50"
                />
              </div>
            )}
          </div>
          
          <div>
            <Label htmlFor="sankalpa" className="text-base font-medium">
              Sacred Sankalpa (Vow)
            </Label>
            <p className="text-sm text-muted-foreground mb-3">
              Set your spiritual intention for this journey
            </p>
            <Textarea
              id="sankalpa"
              placeholder="I vow to dedicate my practice to the pursuit of spiritual growth and self-realization..."
              value={sankalpa}
              onChange={(e) => setSankalpa(e.target.value)}
              className="min-h-[100px] bg-background/50 border-purple-500/20 focus:border-purple-500/50"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={(!selectedDeity || selectedDeity === "other" && !otherDeity) || !sankalpa}
              className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
            >
              Take Sankalpa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InitiationModal;