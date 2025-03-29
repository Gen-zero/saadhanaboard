
import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BookOpen, Edit, Heart, BookHeart, Wand, WandSparkles } from 'lucide-react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, PerspectiveCamera, Environment, useTexture, Center } from '@react-three/drei';
import * as THREE from 'three';

// Sacred Yantra component for Three.js scene
const SacredYantra = ({ position = [0, 0, 0], rotation = [0, 0, 0], scale = 1, color = "#f5b042" }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing effect
      meshRef.current.scale.x = scale * (1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05);
      meshRef.current.scale.y = scale * (1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.05);
      meshRef.current.rotation.z += 0.0005;
    }
  });

  // Create the yantra shape
  const createYantraShape = () => {
    const shape = new THREE.Shape();
    
    // Outer circle
    const segments = 64;
    const radius = 2;
    
    // Start point
    shape.moveTo(radius, 0);
    
    // Create circle
    for (let i = 1; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      shape.lineTo(
        Math.cos(theta) * radius,
        Math.sin(theta) * radius
      );
    }
    
    // Create inner triangle
    const triangleShape = new THREE.Shape();
    const triangleSize = radius * 0.8;
    triangleShape.moveTo(0, triangleSize);
    triangleShape.lineTo(-triangleSize * Math.sqrt(3)/2, -triangleSize/2);
    triangleShape.lineTo(triangleSize * Math.sqrt(3)/2, -triangleSize/2);
    triangleShape.lineTo(0, triangleSize);
    
    // Create inner hexagon
    const hexagonShape = new THREE.Shape();
    const hexRadius = radius * 0.5;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const x = Math.cos(angle) * hexRadius;
      const y = Math.sin(angle) * hexRadius;
      if (i === 0) hexagonShape.moveTo(x, y);
      else hexagonShape.lineTo(x, y);
    }
    hexagonShape.closePath();
    
    shape.holes.push(triangleShape);
    shape.holes.push(hexagonShape);
    
    return shape;
  };

  return (
    <group position={position} rotation={rotation}>
      <mesh ref={meshRef} castShadow>
        <shapeGeometry args={[createYantraShape()]} />
        <meshStandardMaterial 
          color={color}
          metalness={0.4}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

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

// Scene component that contains both yantra and paper
const SceneContainer = ({ paperContent }) => {
  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 5.5]} fov={45} />
      <ambientLight intensity={0.2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={0.8} castShadow />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Add glowing yantra behind the paper */}
      <SacredYantra position={[0, 0, -0.5]} scale={0.9} />
      
      {/* Paper with intentions */}
      <Paper 
        content={paperContent} 
        position={[0, 0, 0]} 
        rotation={[0, 0, 0]} 
      />
      
      <Environment preset="night" />
    </>
  );
};

const SaadhanaBoard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [manifestationIntent, setManifestationIntent] = useState("");
  const [showManifestationForm, setShowManifestationForm] = useState(false);
  
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

  const handleSubmitManifestation = () => {
    // In a real app, this would save to a database
    // For now, we'll just close the form and show a success message
    setShowManifestationForm(false);
    // Here you would typically use a toast notification
    console.log("Manifestation intent sent to the divine realm");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <span>Saadhana Board</span>
            <span className="text-sm text-muted-foreground ml-2 italic font-normal">
              Digital Yantra for Manifestation
            </span>
          </h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setShowManifestationForm(!showManifestationForm)}
            >
              <WandSparkles className="h-4 w-4" />
              Manifest Intention
            </Button>
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
        </div>
        <p className="text-muted-foreground">
          Your spiritual intentions, goals, and devotional practice. Connect with your deity to manifest ideas into reality.
        </p>
      </div>

      {showManifestationForm && (
        <Card className="border-primary/20 bg-background/95 backdrop-blur-sm shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WandSparkles className="h-5 w-5 text-primary" />
              <span>Manifest Your Intention</span>
            </CardTitle>
            <CardDescription>Communicate your intention to your deity for manifestation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="manifestation">Your Sacred Intention</Label>
              <Textarea 
                id="manifestation" 
                value={manifestationIntent}
                onChange={(e) => setManifestationIntent(e.target.value)}
                placeholder="Write your intention with clarity and devotion..."
                className="min-h-[150px]"
              />
              <p className="text-xs text-muted-foreground italic">
                Write with pure intention. Your deity will receive this message and help manifest it into reality.
              </p>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="ghost" onClick={() => setShowManifestationForm(false)}>Cancel</Button>
              <Button onClick={handleSubmitManifestation}>Send to Divine Realm</Button>
            </div>
          </CardContent>
        </Card>
      )}

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
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <Button variant="secondary" size="sm" className="bg-gray-800/50 text-white hover:bg-gray-700/50">
              <span>Print Saadhana</span>
            </Button>
          </div>
          
          <Canvas shadows dpr={[1, 2]} className="h-full w-full">
            <SceneContainer paperContent={paperContent} />
          </Canvas>
          
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white text-center">
            <p className="text-sm opacity-75">
              Your Saadhana details on a sacred scroll, empowered by the yantra for manifestation
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaadhanaBoard;
