
import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Edit, Heart } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera, Environment } from '@react-three/drei';
import * as THREE from 'three';

// Paper component for Three.js scene
const Paper = ({ content, position, rotation }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Paper background */}
      <mesh ref={meshRef} castShadow>
        <planeGeometry args={[4.5, 6, 1]} />
        <meshStandardMaterial 
          color="#f5f0e0" 
          roughness={0.7} 
          metalness={0.1}
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Paper content */}
      <Text
        position={[0, 0, 0.01]}
        fontSize={0.2}
        maxWidth={4}
        lineHeight={1.2}
        color="#331c0c"
        anchorX="center"
        anchorY="middle"
        font="/fonts/poppins-v20-latin-regular.woff"
      >
        {content}
      </Text>
    </group>
  );
};

const SaadhanaBoard = () => {
  const [isEditing, setIsEditing] = useState(false);
  
  // Mock data for sadhana board
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
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <span>Saadhana Board</span>
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4" />
            {isEditing ? 'View Mode' : 'Edit Details'}
          </Button>
        </div>
        <p className="text-muted-foreground">
          Your spiritual intentions, goals, and devotional practice.
        </p>
      </div>

      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Purpose & Goal</CardTitle>
                <CardDescription>Why you're on this spiritual journey</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="purpose">Purpose</Label>
                  <Textarea 
                    id="purpose" 
                    defaultValue={sadhanaData.purpose} 
                    placeholder="What is the purpose of your spiritual practice?"
                    className="min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Goal</Label>
                  <Textarea 
                    id="goal" 
                    defaultValue={sadhanaData.goal} 
                    placeholder="What is your specific spiritual goal?"
                    className="min-h-[100px]"
                  />
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
                  <Label htmlFor="deity">Deity or Spiritual Focus</Label>
                  <Input 
                    id="deity" 
                    defaultValue={sadhanaData.deity} 
                    placeholder="Who or what is your spiritual focus?"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Your Message</Label>
                  <Textarea 
                    id="message" 
                    defaultValue={sadhanaData.message} 
                    placeholder="What message would you like to share with your deity?"
                    className="min-h-[100px]"
                  />
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
                {sadhanaData.offerings.map((offering, index) => (
                  <div key={index} className="flex gap-2">
                    <Input 
                      defaultValue={offering} 
                      placeholder={`Offering or practice ${index + 1}`}
                    />
                    <Button variant="ghost" size="icon" className="shrink-0">×</Button>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">+ Add New Offering</Button>
              </div>
              <Button className="w-full mt-6">Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="w-full bg-gray-950 rounded-lg overflow-hidden shadow-2xl relative h-[600px]">
          <div className="absolute top-4 right-4 z-10">
            <Button variant="secondary" size="sm" className="bg-gray-800/50 text-white hover:bg-gray-700/50">
              <span>Print Saadhana</span>
            </Button>
          </div>
          
          <Canvas shadows dpr={[1, 2]} className="h-full w-full">
            <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />
            <ambientLight intensity={0.2} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />
            <Paper 
              content={paperContent} 
              position={[0, 0, 0]} 
              rotation={[0, 0, 0]} 
            />
            <Environment preset="sunset" />
          </Canvas>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
            <p className="text-sm opacity-75">Your Saadhana details on a sacred scroll</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaadhanaBoard;
