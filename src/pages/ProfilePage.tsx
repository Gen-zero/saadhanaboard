
import Layout from "@/components/Layout";
import DeityInterface from "@/components/DeityInterface";
import ShadowSelfMonitor from "@/components/ShadowSelfMonitor";
import { useState } from "react";

const DeityPage = () => {
  // Mock data for shadow and perfect being traits
  const [shadowTraits] = useState([
    'Procrastination',
    'Self-doubt',
    'Impatience',
    'Fear of failure'
  ]);
  
  const [perfectTraits] = useState([
    'Unwavering discipline',
    'Compassionate presence',
    'Inner peace',
    'Wisdom in action'
  ]);
  
  return (
    <Layout>
      <div className="space-y-8">
        <DeityInterface />
        <ShadowSelfMonitor 
          shadowTraits={shadowTraits} 
          perfectTraits={perfectTraits} 
        />
      </div>
    </Layout>
  );
};

export default DeityPage;
