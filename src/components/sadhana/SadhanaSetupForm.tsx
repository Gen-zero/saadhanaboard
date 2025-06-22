
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, ArrowLeft, Sparkles } from 'lucide-react';
import { SadhanaData } from '@/hooks/useSadhanaData';

interface SadhanaSetupFormProps {
  onCreateSadhana: (data: SadhanaData) => void;
  onCancel: () => void;
}

const SadhanaSetupForm = ({ onCreateSadhana, onCancel }: SadhanaSetupFormProps) => {
  const [formData, setFormData] = useState<SadhanaData>({
    purpose: '',
    goal: '',
    deity: '',
    message: '',
    offerings: ['']
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAddOffering = () => {
    setFormData(prev => ({
      ...prev,
      offerings: [...prev.offerings, '']
    }));
  };

  const handleRemoveOffering = (index: number) => {
    setFormData(prev => ({
      ...prev,
      offerings: prev.offerings.filter((_, i) => i !== index)
    }));
  };

  const handleOfferingChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      offerings: prev.offerings.map((offering, i) => i === index ? value : offering)
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Purpose is required';
    }
    if (!formData.goal.trim()) {
      newErrors.goal = 'Goal is required';
    }
    if (!formData.deity.trim()) {
      newErrors.deity = 'Divine focus is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    const validOfferings = formData.offerings.filter(o => o.trim());
    if (validOfferings.length === 0) {
      newErrors.offerings = 'At least one offering is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const validOfferings = formData.offerings.filter(o => o.trim());
      onCreateSadhana({
        ...formData,
        offerings: validOfferings
      });
    }
  };

  return (
    <div className="cosmic-nebula-bg rounded-lg p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-600">
              Create Your Sacred Sadhana
            </h2>
            <p className="text-muted-foreground">Fill in your spiritual intentions and divine commitments</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purpose & Goal</CardTitle>
                <CardDescription>Why you're on this spiritual journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose *</Label>
                  <Textarea 
                    id="purpose" 
                    value={formData.purpose}
                    onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
                    placeholder="What is the purpose of your spiritual practice?"
                    className="min-h-[100px]"
                  />
                  {errors.purpose && <p className="text-sm text-destructive">{errors.purpose}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Goal *</Label>
                  <Textarea 
                    id="goal" 
                    value={formData.goal}
                    onChange={(e) => setFormData(prev => ({ ...prev, goal: e.target.value }))}
                    placeholder="What is your specific spiritual goal?"
                    className="min-h-[100px]"
                  />
                  {errors.goal && <p className="text-sm text-destructive">{errors.goal}</p>}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  <span>Divine Connection</span>
                </CardTitle>
                <CardDescription>Your chosen deity or spiritual focus</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deity">Deity or Spiritual Focus *</Label>
                  <Input 
                    id="deity" 
                    value={formData.deity}
                    onChange={(e) => setFormData(prev => ({ ...prev, deity: e.target.value }))}
                    placeholder="Who or what is your spiritual focus?"
                  />
                  {errors.deity && <p className="text-sm text-destructive">{errors.deity}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message *</Label>
                  <Textarea 
                    id="message" 
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="What message would you like to share with your deity?"
                    className="min-h-[100px]"
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Offerings & Practices</CardTitle>
              <CardDescription>What you'll be doing or offering for your spiritual practice</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {formData.offerings.map((offering, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      value={offering} 
                      onChange={(e) => handleOfferingChange(index, e.target.value)}
                      placeholder={`Offering or practice ${index + 1}`}
                    />
                    {formData.offerings.length > 1 && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="shrink-0"
                        onClick={() => handleRemoveOffering(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                {errors.offerings && <p className="text-sm text-destructive">{errors.offerings}</p>}
                
                <Button variant="outline" className="w-full mt-2" onClick={handleAddOffering}>
                  + Add New Offering
                </Button>
                
                <Button 
                  className="w-full mt-6 bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600"
                  onClick={handleSubmit}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Begin Sacred Sadhana
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SadhanaSetupForm;
