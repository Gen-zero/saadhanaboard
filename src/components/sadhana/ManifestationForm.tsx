
import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Stars, MoonStar, Flame } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ManifestationFormProps {
  onClose: () => void;
}

const ManifestationForm = ({ onClose }: ManifestationFormProps) => {
  const [manifestationIntent, setManifestationIntent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  // Cosmic typing effect
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Create cosmic typing sound
    const audio = new Audio('/sounds/cosmic-typing.mp3');
    audio.volume = 0.1;
    audio.play();
    
    setManifestationIntent(e.target.value);
  };

  const handleSubmitManifestation = () => {
    if (!manifestationIntent.trim()) {
      toast({
        title: "Empty Intention",
        description: "Please share your intention with the cosmos",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate sending to cosmic realm
    setTimeout(() => {
      toast({
        title: "✨ Intention Manifested",
        description: "Your intention has been sent to the divine realm",
      });
      setIsSubmitting(false);
      onClose();
    }, 2000);
  };
  
  // Add floating effect to the form
  useEffect(() => {
    if (formRef.current) {
      const handleMouseMove = (e: MouseEvent) => {
        if (!formRef.current) return;
        
        const rect = formRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Calculate the tilt
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const tiltX = (y - centerY) / 20;
        const tiltY = (centerX - x) / 20;
        
        formRef.current.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
      };
      
      const handleMouseLeave = () => {
        if (formRef.current) {
          formRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        }
      };
      
      formRef.current.addEventListener('mousemove', handleMouseMove);
      formRef.current.addEventListener('mouseleave', handleMouseLeave);
      
      return () => {
        if (formRef.current) {
          formRef.current.removeEventListener('mousemove', handleMouseMove);
          formRef.current.removeEventListener('mouseleave', handleMouseLeave);
        }
      };
    }
  }, []);

  return (
    <Card 
      ref={formRef}
      className="border-primary/20 bg-gradient-to-br from-indigo-950/90 via-purple-900/90 to-indigo-950/90 backdrop-blur-md shadow-lg text-white transition-all duration-500"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 overflow-hidden rounded-lg -z-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/30 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/30 rounded-full filter blur-3xl"></div>
      </div>
      
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-fuchsia-200 to-purple-300">
          <Sparkles className="h-5 w-5 text-purple-300" />
          <span>Manifest Your Cosmic Intention</span>
        </CardTitle>
        <CardDescription className="text-indigo-200">
          Send your sacred intention through the ethereal planes to manifest in your reality
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2 relative">
          <Label htmlFor="manifestation" className="text-indigo-200 flex items-center gap-1">
            <Stars className="h-3 w-3" />
            <span>Your Divine Intention</span>
          </Label>
          <div className="relative group">
            <Textarea 
              id="manifestation" 
              value={manifestationIntent}
              onChange={handleTextChange}
              placeholder="Write your intention with clarity and devotion..."
              className="min-h-[150px] bg-indigo-950/50 border-purple-500/30 placeholder:text-indigo-300/50 
              text-indigo-100 focus-visible:ring-purple-500/50 resize-none transition-all group-hover:border-purple-400/50"
            />
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute top-0 left-0 w-full h-full flex">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent transform -translate-y-0.5"></div>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent transform translate-y-0.5"></div>
              </div>
              <div className="absolute top-0 left-0 h-full w-full flex items-center">
                <div className="h-full w-px bg-gradient-to-b from-transparent via-purple-500/70 to-transparent transform -translate-x-0.5"></div>
              </div>
              <div className="absolute top-0 right-0 h-full w-full flex items-center justify-end">
                <div className="h-full w-px bg-gradient-to-b from-transparent via-purple-500/70 to-transparent transform translate-x-0.5"></div>
              </div>
            </div>
          </div>
          <p className="text-xs text-indigo-300/70 italic flex items-center gap-1">
            <Flame className="h-3 w-3" />
            <span>Write with pure intention. Your deity will receive this message and help manifest it into reality.</span>
          </p>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-indigo-200 hover:text-white hover:bg-indigo-500/20"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitManifestation}
            disabled={isSubmitting}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
          >
            {isSubmitting ? (
              <>
                <div className="flex space-x-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-white"></div>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-white" style={{ animationDelay: '0.4s' }}></div>
                </div>
                <span className="ml-2">Sending...</span>
              </>
            ) : (
              <>
                <MoonStar className="h-4 w-4 mr-1" />
                <span>Send to Divine Realm</span>
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManifestationForm;
