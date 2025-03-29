
import { Sparkles } from '@react-three/drei';

const EnvironmentEffects = () => {
  return (
    <>
      {/* Add volumetric light rays */}
      <fog attach="fog" args={['#070423', 8, 20]} />
      
      {/* Cosmic particles */}
      <Sparkles count={300} scale={10} size={0.6} speed={0.3} color="#ffffff" />
      <Sparkles count={100} scale={10} size={0.3} speed={0.2} color="#f5b042" />
    </>
  );
};

export default EnvironmentEffects;
