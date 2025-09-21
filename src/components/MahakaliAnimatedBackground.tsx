import React, { Suspense, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html, useTexture, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { KernelSize, BlendFunction } from 'postprocessing';
import { preprocessYantraImage } from '@/utils/textureUtils';
import * as THREE from 'three';

// Uniforms record type for shader materials
type UniformsRecord = Record<string, { value: unknown }>;

export interface MahakaliAnimatedBackgroundProps {
  intensity?: number;
  enableParticles?: boolean;
  enableBloom?: boolean;
  enablePostFX?: boolean;
  className?: string;
}

const MahakaliScene: React.FC<{ intensity: number; enableParticles: boolean; enableBloom: boolean; enablePostFX?: boolean }> = ({ intensity, enableParticles, enableBloom, enablePostFX }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  // Use useTexture so Suspense will suspend until the texture is ready
  const yantraMap = useTexture('/icons/mahakali-yantra.png') as THREE.Texture;

  // Ensure the texture has correct orientation, encoding and mipmaps
  useEffect(() => {
    if (yantraMap) {
      try {
        preprocessYantraImage(yantraMap);
      } catch (err) {
        // preprocessing may not be available in all environments; log for visibility
        console.warn('preprocessYantraImage failed:', err);
      }
    }
  }, [yantraMap]);

  // Yantra shader material
  const yantraMaterial = useMemo(() => {
  const uniforms: UniformsRecord = {
      time: { value: 0 },
      yantraTexture: { value: yantraMap },
      pulseIntensity: { value: intensity },
      glowColor: { value: new THREE.Color('#dc2626') },
      triangleThreshold: { value: 0.35 },
      triangleSoftness: { value: 0.08 }
    };

  const vertexShader = `varying vec2 vUv; void main(){ vUv = vec2(uv.x, 1.0 - uv.y); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

    const fragmentShader = `
      uniform sampler2D yantraTexture;
      uniform float time;
      uniform float pulseIntensity;
      uniform vec3 glowColor;
      varying vec2 vUv;
      uniform float triangleThreshold;
      uniform float triangleSoftness;
      void main(){
        vec2 center = vec2(0.5);
        vec4 tex = texture2D(yantraTexture, vUv);
        float dist = distance(vUv, center);
        float pulse = 0.5 + 0.5 * sin(time * 2.0);
        // compute luminance and a triangle mask to focus glow on triangular regions
        float lum = dot(tex.rgb, vec3(0.299,0.587,0.114));
        float triMask = smoothstep(triangleThreshold - triangleSoftness, triangleThreshold + triangleSoftness, lum);
        // central glow falls off with distance and is masked by triangle areas
        float glow = smoothstep(0.4, 0.0, dist) * pulse * pulseIntensity * triMask;
        // boost glow contribution for stronger bloom
        vec3 glowCol = glowColor * (glow * 1.5);
        vec3 base = tex.rgb;
        // Mix texture with stronger glow, clamp to avoid oversaturation
        vec3 final = clamp(base + glowCol, 0.0, 1.0);
        // Reduce the base alpha and glow contribution for more transparency
        float alpha = tex.a * 0.7; // Reduced from full alpha to 70%
        gl_FragColor = vec4(final, clamp(alpha + glow * 0.6, 0.0, 0.8)); // Reduced glow contribution and max alpha
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false
    });
    // mark as not tone-mapped so bloom treats it as glowing
    (mat as unknown as { toneMapped?: boolean }).toneMapped = false;
    return mat;
  }, [yantraMap, intensity]);

  // Energy waves material
  const wavesMaterial = useMemo(() => {
  const uniforms: UniformsRecord = {
      time: { value: 0 },
      waveSpeed: { value: 2.0 },
      waveIntensity: { value: 0.35 }
    };

  const vertexShader = `varying vec2 vUv; void main(){ vUv = vec2(uv.x, 1.0 - uv.y); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

    const fragmentShader = `
      uniform float time;
      uniform float waveSpeed;
      uniform float waveIntensity;
      varying vec2 vUv;
      void main(){
        vec2 center = vec2(0.5);
        float dist = distance(vUv, center);
        float waves = sin(dist * 20.0 - time * waveSpeed);
        float fade = smoothstep(0.0, 0.9, 1.0 - dist);
        float intensity = waves * 0.5 * waveIntensity * fade;
        vec3 color = vec3(0.86, 0.08, 0.08) * max(0.0, intensity);
        // Reduce the alpha for more transparency
        float alpha = max(0.0, intensity) * 0.7; // 30% more transparent
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    // mark waves as not tone-mapped to enhance bloom responsiveness
    (mat as unknown as { toneMapped?: boolean }).toneMapped = false;
    return mat;
  }, []);

  // --------------------------- Eclipse Aura Shader ---------------------------
  const eclipseMaterial = useMemo(() => {
    const uniforms: UniformsRecord = {
      time: { value: 0 },
      intensity: { value: 0.8 },
      innerRadius: { value: 0.3 },
      outerRadius: { value: 1.2 }
    };

    const vertexShader = `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`;

    const fragmentShader = `
      varying vec2 vUv;
      uniform float time;
      uniform float intensity;
      uniform float innerRadius;
      uniform float outerRadius;
      void main(){
        vec2 center = vec2(0.5);
        float d = distance(vUv, center);
        float pulse = 0.6 + sin(time * 0.8) * 0.2;
        float t = smoothstep(innerRadius, outerRadius, d);
        // inner core crimson, mid ember, outer fade to transparent
        vec3 inner = vec3(0.545, 0.0, 0.0); // #8b0000
        vec3 mid = vec3(1.0, 0.42, 0.21); // #ff6b35
        vec3 color = mix(inner, mid, smoothstep(innerRadius, (innerRadius+outerRadius)/2.0, d));
        // Reduce the alpha for more transparency
        float alpha = (1.0 - t) * intensity * pulse * smoothstep(outerRadius, innerRadius, d) * 0.7; // 30% more transparent
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    // ensure bloom sees this as HDR-like
  // mark as not tone mapped so bloom treats it as glowing
  (mat as unknown as { toneMapped?: boolean }).toneMapped = false;
    return mat;
  }, []);

  // Light refs for dynamic lighting
  const dirLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.PointLight | null>(null);
  const emberLightsRef = useRef<THREE.PointLight[]>([]);


  // --------------------------- Helper components ---------------------------

  // Skull mesh: cranium sphere + simple eye sockets and nasal cavity approximation
  const SkullMesh: React.FC<{
    index: number;
    radius: number;
    speed: number;
    z: number;
    offset: number;
    intensity: number;
  }> = ({ index, radius, speed, z, offset, intensity }) => {
    const ref = useRef<THREE.Group | null>(null);
    const eyeLightRef = useRef<THREE.PointLight | null>(null);

    const craniumGeo = useMemo(() => new THREE.SphereGeometry(0.45, 24, 24), []);
    const eyeGeo = useMemo(() => new THREE.CylinderGeometry(0.08, 0.08, 0.02, 8), []);
    const nasalGeo = useMemo(() => new THREE.ConeGeometry(0.06, 0.12, 6), []);

    const skullMat = useMemo(
      () =>
        new THREE.MeshStandardMaterial({ color: '#f5f5dc', roughness: 0.8, metalness: 0.02, transparent: true, opacity: 0.7 }), // Added transparency
      []
    );

    // soft emissive cracks material (shader-like flicker using onFrame)
    const crackMat = useMemo(
      () =>
        new THREE.MeshStandardMaterial({ color: '#6b0000', emissive: '#330000', emissiveIntensity: 0.0, roughness: 1, transparent: true, opacity: 0.6 }), // Added transparency
      []
    );

    useEffect(() => {
      return () => {
        craniumGeo.dispose();
        eyeGeo.dispose();
        nasalGeo.dispose();
        skullMat.dispose();
        crackMat.dispose();
      };
    }, [craniumGeo, eyeGeo, nasalGeo, skullMat, crackMat]);

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      const ang = t * speed + offset;
      const x = radius * Math.cos(ang + index);
      const y = Math.sin(t * 2 + offset) * 0.15;
      if (ref.current) {
        ref.current.position.set(x, y, z);
        ref.current.rotation.y = t * 0.2 + index;
        ref.current.rotation.x = Math.sin(t * 0.3 + index) * 0.15;
      }
      if (eyeLightRef.current) {
        // flicker intensity per skull
        eyeLightRef.current.intensity = (0.06 + Math.abs(Math.sin(t * 3 + index)) * 0.10) * intensity; // Reduced from 0.08/0.12 to 0.06/0.10
      }
      // update crack emissive intensity (simulate intermittent glow)
      // increased animated emissive range for stronger crack glow
      const emiss = 0.15 + Math.abs(Math.sin(t * 2 + index)) * 0.6; // Reduced from 0.2/0.8 to 0.15/0.6
      crackMat.emissiveIntensity = emiss * intensity;
    });

    return (
      <group ref={ref}>
        <mesh geometry={craniumGeo} material={skullMat} castShadow receiveShadow>
          {/* subtle cracks overlay as a slightly larger transparent mesh */}
        </mesh>
        <mesh geometry={nasalGeo} material={crackMat} position={[0, -0.06, 0.4]} rotation={[-Math.PI / 2, 0, 0]} />
        <mesh geometry={eyeGeo} material={crackMat} position={[0.15, 0.08, 0.35]} rotation={[Math.PI / 2, 0, 0]} />
        <mesh geometry={eyeGeo} material={crackMat} position={[-0.15, 0.08, 0.35]} rotation={[Math.PI / 2, 0, 0]} />
        <pointLight ref={eyeLightRef} color={'#ff4444'} distance={1.2} intensity={0.06} /> {/* Reduced from 0.08 to 0.06 */}
      </group>
    );
  };

  // Bone mesh - simple tapered cylinder
  const BoneMesh: React.FC<{ matrix: THREE.Matrix4; material: THREE.Material }> = ({ matrix, material }) => {
    // not used as a standalone mesh when using instancing; kept for clarity
    return (
      <mesh matrix={matrix} material={material} />
    );
  };

  // Floating skulls group
  const FloatingSkullsGroup: React.FC<{ count?: number; intensity: number }> = ({ count = 10, intensity }) => {
    const groupRef = useRef<THREE.Group>(null);
    const items = useMemo(() => {
      const arr = [] as { radius: number; speed: number; z: number; offset: number }[];
      for (let i = 0; i < count; i++) {
        arr.push({ radius: 1.5 + Math.random() * 3.5, speed: 0.05 + Math.random() * 0.25, z: -1 - Math.random() * 2, offset: Math.random() * Math.PI * 2 });
      }
      return arr;
    }, [count]);

    return (
      <group ref={groupRef} renderOrder={1}>
        {items.map((it, i) => (
          <SkullMesh key={i} index={i} radius={it.radius} speed={it.speed} z={it.z} offset={it.offset} intensity={intensity} />
        ))}
      </group>
    );
  };

  // Floating bones group implemented using InstancedMesh for performance
  const FloatingBonesGroup: React.FC<{ count?: number }> = ({ count = 18 }) => {
    const instRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const boneGeo = useMemo(() => new THREE.CylinderGeometry(0.06, 0.08, 0.9, 8), []);
    const boneMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#efe6d6', roughness: 0.9, transparent: true, opacity: 0.6 }), []); // Added transparency

    useEffect(() => {
      return () => {
        boneGeo.dispose();
        boneMat.dispose();
      };
    }, [boneGeo, boneMat]);

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      if (!instRef.current) return;
      for (let i = 0; i < count; i++) {
        const speed = 0.03 + (i % 5) * 0.01;
        const a = t * speed + i;
        const rx = Math.cos(a * 0.7) * (1.2 + (i % 3) * 0.4);
        const ry = Math.sin(a * 1.1) * (0.6 + (i % 4) * 0.3);
        const rz = -0.5 - ((i % 6) * 0.2);
        dummy.position.set(rx, ry - 0.2, rz);
        dummy.rotation.set(t * 0.5 + i, t * 0.3 + i * 0.2, t * 0.2 + i * 0.1);
        dummy.updateMatrix();
        instRef.current.setMatrixAt(i, dummy.matrix);
      }
      instRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
      <instancedMesh ref={instRef} args={[boneGeo, boneMat, count]} castShadow receiveShadow renderOrder={1}>
      </instancedMesh>
    );
  };

  // Particles group: smoke, embers, ash using Sparkles + simple transforms
  const ParticlesGroup: React.FC<{ enabled: boolean }> = ({ enabled }) => {
    const smokeRef = useRef<THREE.Group>(null);
    const embersRef = useRef<THREE.Group>(null);
    const ashRef = useRef<THREE.Group>(null);

    useFrame(({ clock }) => {
      const t = clock.getElapsedTime();
      if (smokeRef.current) {
        smokeRef.current.position.y = Math.sin(t * 0.2) * 0.05;
      }
      if (embersRef.current) {
        embersRef.current.rotation.z = Math.sin(t * 0.6) * 0.1;
      }
      if (ashRef.current) {
        ashRef.current.position.x = Math.sin(t * 0.15) * 0.02;
      }
    });

    if (!enabled) return null;

    return (
      <>
        <group ref={smokeRef} position={[0, -0.2, -2]} renderOrder={-2}>
          <Sparkles count={500} scale={15} size={0.8} speed={0.1} color="#2a2a2a" noise={1.0} opacity={0.4} /> {/* Reduced from 0.6 to 0.4 */}
        </group>
        <group ref={embersRef} position={[0, -0.1, -1]} renderOrder={0}>
          <Sparkles count={200} scale={8} size={0.3} speed={0.4} color="#ff6b35" noise={2.0} opacity={0.7} /> {/* Reduced from 0.95 to 0.7 */}
        </group>
        <group ref={ashRef} position={[0, 0.2, -1.5]} renderOrder={-1}>
          <Sparkles count={300} scale={12} size={0.15} speed={0.05} color="#8a8a8a" noise={0.8} opacity={0.3} /> {/* Reduced from 0.5 to 0.3 */}
        </group>
      </>
    );
  };


  // clone inner material to avoid sharing state
  const innerMaterial = useMemo(() => {
    const mat = yantraMaterial.clone();
    // Make the inner layer more transparent for a subtle hypnotic effect
    mat.transparent = true;
    mat.opacity = 0.5; // Set opacity to 50% for the inner layer
    return mat;
  }, [yantraMaterial]);
  // ensure inner clone is not tone-mapped so bloom works uniformly
  (innerMaterial as unknown as { toneMapped?: boolean }).toneMapped = false;

  // group ref for eclipse mesh
  const eclipseRef = useRef<THREE.Mesh | null>(null);

  // cleanup shader materials when component unmounts
  useEffect(() => {
    return () => {
      if (typeof yantraMaterial?.dispose === 'function') yantraMaterial.dispose();
      if (typeof wavesMaterial?.dispose === 'function') wavesMaterial.dispose();
      if (typeof innerMaterial?.dispose === 'function') innerMaterial.dispose();
      if (typeof eclipseMaterial?.dispose === 'function') eclipseMaterial.dispose();
    };
  }, [yantraMaterial, wavesMaterial, innerMaterial, eclipseMaterial]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    // precise 40-second rotation: full rotation = 2PI over 40 seconds
    const rot = (elapsed * Math.PI * 2) / 40;
    if (meshRef.current) {
      meshRef.current.rotation.z = rot;
      meshRef.current.rotation.x = Math.sin(elapsed * 0.1) * 0.02 * intensity;
      const mat = meshRef.current.material as THREE.Material & { uniforms?: UniformsRecord };
      if (mat.uniforms?.time) {
        (mat.uniforms.time.value as number) = elapsed;
      }
    }
    if (innerRef.current) {
      // inner triangle rotates at a different rate for hypnotic effect
      innerRef.current.rotation.z = rot * -1.25;
      const imat = innerRef.current.material as THREE.Material & { uniforms?: UniformsRecord };
      if (imat.uniforms?.time) {
        (imat.uniforms.time.value as number) = elapsed * 1.2;
      }
    }
    // update shader uniforms for waves
    const wmat = wavesMaterial as THREE.ShaderMaterial & { uniforms?: UniformsRecord };
    if (wmat.uniforms?.time) {
      (wmat.uniforms.time.value as number) = elapsed;
    }

    // update eclipse aura
    if (eclipseRef.current) {
      const mat = eclipseRef.current.material as THREE.ShaderMaterial & { uniforms?: UniformsRecord };
      if (mat.uniforms?.time) mat.uniforms.time.value = elapsed;
      eclipseRef.current.rotation.z = elapsed * 0.02;
    }

    // dynamic lighting updates
    if (dirLightRef.current) {
      // respect global intensity prop
      dirLightRef.current.intensity = (0.6 + Math.sin(elapsed * 1.5) * 0.2) * intensity; // Reduced from 0.8/0.3 to 0.6/0.2
    }
    if (rimLightRef.current) {
      // respect global intensity prop
      rimLightRef.current.intensity = (0.15 + Math.sin(elapsed * 0.6) * 0.04) * intensity; // Reduced from 0.18/0.05 to 0.15/0.04
    }
    // ember lights orbital motion
    emberLightsRef.current.forEach((l, i) => {
      const ang = elapsed * (0.5 + i * 0.15) + i;
      const r = 1.0 + (i % 2) * 0.6;
      l.position.set(Math.cos(ang) * r, Math.sin(ang * 0.7) * 0.4, Math.sin(ang) * 0.6 - 0.2);
      // ember intensity scaled by global intensity
      l.intensity = (0.2 + Math.abs(Math.sin(elapsed * (1.0 + i * 0.2))) * 0.5) * intensity; // Reduced from 0.3/0.6 to 0.2/0.5
    });
  });

  return (
    <>
      <ambientLight intensity={0.12 * intensity} />
      {/* Primary dynamic crimson directional light */}
      <directionalLight ref={dirLightRef} position={[3, 4, 2]} color="#dc2626" intensity={0.6 * intensity} />
      {/* atmospheric rim light behind scene */}
      <pointLight ref={rimLightRef} position={[0, 0, -5]} color="#4a0e0e" intensity={0.15 * intensity} />
      {/* Ember orbital lights (created and managed in useFrame) */}
      {Array.from({ length: 4 }).map((_, i) => (
        <pointLight key={i} ref={(el) => { if (el) emberLightsRef.current[i] = el; }} color={i % 2 ? '#ff6b35' : '#ff4444'} intensity={0.2 * intensity} distance={3} />
      ))}

      <group position={[0, 0, 0]}> 
        {/* Energy waves behind yantra */}
        <mesh position={[0, 0, -0.5]} renderOrder={-1}>
          <planeGeometry args={[8, 8]} />
          <primitive object={wavesMaterial} attach="material" />
        </mesh>

        {/* Eclipse aura behind yantra */}
        <mesh ref={eclipseRef} position={[0, 0, -1.5]} renderOrder={-3}>
          <planeGeometry args={[10, 10]} />
          <primitive object={eclipseMaterial} attach="material" />
        </mesh>

        {/* Central yantra plane */}
        <mesh ref={meshRef} position={[0, 0, 0]} renderOrder={0}>
          <planeGeometry args={[3, 3, 1, 1]} />
          {/* attach shader material */}
          <primitive object={yantraMaterial} attach="material" />
        </mesh>

        {/* Inner rotating layer for hypnotic effect */}
        <mesh ref={innerRef} position={[0, 0, 0.01]} renderOrder={1}>
          <planeGeometry args={[1.2, 1.2]} />
          <primitive object={innerMaterial} attach="material" />
        </mesh>

        {/* Placeholder geometry for future elements */}
        {/* Floating bones and skull groups - ensure they render after yantra */}
        <FloatingBonesGroup count={18} />
        <group renderOrder={1}>
          <FloatingSkullsGroup count={10} intensity={intensity} />
        </group>

        {/* Particles: smoke, embers, ash (conditional) */}
        <ParticlesGroup enabled={enableParticles} />

      </group>
      {/* Post-processing composer (decoupled gating) */}
      {((enablePostFX ?? enableBloom) && (
        <EffectComposer multisampling={4} enableNormalPass={false}>
          {/* Bloom is optional and respects enableBloom; reduce threshold for stronger glow */}
          {enableBloom && <Bloom intensity={1.2} luminanceThreshold={0.6} luminanceSmoothing={0.025} kernelSize={KernelSize.LARGE} mipmapBlur />}
          {/* Noise and Vignette are part of the broader post FX and are enabled when enablePostFX is true */}
          <Noise opacity={0.03} premultiply blendFunction={(BlendFunction.SCREEN as unknown) as number} />
          <Vignette eskil={false} offset={0.15} darkness={1.3} />
        </EffectComposer>
      ))}
    </>
  );
};

const MahakaliAnimatedBackground: React.FC<MahakaliAnimatedBackgroundProps> = ({ intensity = 1, enableParticles = true, enableBloom = false, enablePostFX = true, className }) => {
  return (
    <div className={className ?? 'fixed inset-0 z-0'}>
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }} frameloop="always" dpr={[1, 2]} gl={{ antialias: true }}>
        <Suspense fallback={<Html center>Loading background…</Html>}>
          <MahakaliScene intensity={intensity} enableParticles={!!enableParticles} enableBloom={!!enableBloom} enablePostFX={enablePostFX} />
        </Suspense>
        <OrbitControls enabled={false} enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

export default MahakaliAnimatedBackground;
