import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import * as THREE from 'three';
import { useResumeStore } from '../../store/useResumeStore';

// Highly optimized wave grid using direct buffer attribute updates in vertex loop
function DisplacedGrid({ color }: { color: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const geomRef = useRef<THREE.PlaneGeometry>(null);
  const targetRotation = useRef({ x: -Math.PI / 3, y: 0, z: Math.PI / 10 });

  useFrame((state) => {
    // 1. Slow, organic landscape wave displacement
    const geom = geomRef.current;
    if (geom) {
      const pos = geom.attributes.position;
      const time = state.clock.getElapsedTime();
      
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        
        // Multi-frequency sine-cosine landscape wave formula for realistic fluid rhythm
        const z = 
          Math.sin(x * 0.15 + time * 0.3) * Math.cos(y * 0.15 + time * 0.25) * 0.8 +
          Math.sin(x * 0.08 - time * 0.15) * Math.sin(y * 0.08 + time * 0.2) * 0.5;
        
        pos.setZ(i, z);
      }
      pos.needsUpdate = true;
    }

    // 2. Smooth physical cursor parallax follow with dampening
    if (meshRef.current) {
      const pointer = state.pointer; // Normalized [-1, 1]
      
      // Calculate micro-rotations relative to the tilted base plane
      const targetZ = Math.PI / 10 + pointer.x * 0.06;
      const targetX = -Math.PI / 2.8 + pointer.y * 0.04;
      
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, targetZ, 0.05);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetX, 0.05);
    }
  });

  return (
    <mesh 
      ref={meshRef} 
      position={[0, -2, -3]} 
      rotation={[-Math.PI / 2.8, 0, Math.PI / 10]}
    >
      <planeGeometry ref={geomRef} args={[28, 22, 35, 30]} />
      <meshBasicMaterial 
        color={color} 
        wireframe 
        transparent 
        opacity={0.12} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// Gentle ambient sparkles moving around the fluid lattice
function AmbientParticles({ color }: { color: string }) {
  return (
    <Sparkles 
      count={45} 
      scale={[15, 10, 10]} 
      size={1.5} 
      speed={0.2} 
      color={color} 
      opacity={0.25}
    />
  );
}

export function AestheticBackdrop() {
  const { settings } = useResumeStore();
  const show3DBackdrop = settings.show3DBackdrop;

  // Resolve current active theme color dynamically to match the grid styling
  const themeHexColor = useMemo(() => {
    if (settings.themeColor === 'custom' && settings.customColor) {
      return settings.customColor;
    }
    const colorMap: Record<string, string> = {
      blue: '#3b82f6',
      emerald: '#10b981',
      slate: '#64748b',
      indigo: '#6366f1',
      crimson: '#e11d48',
      amber: '#f59e0b',
      teal: '#0d9488',
      bronze: '#b45309'
    };
    return colorMap[settings.themeColor] || '#6366f1';
  }, [settings.themeColor, settings.customColor]);

  if (!show3DBackdrop) return null;

  return (
    <div 
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{ 
        background: 'radial-gradient(circle at 50% 120%, rgba(99, 102, 241, 0.02) 0%, rgba(248, 250, 252, 0) 70%)',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 60 }}
        dpr={[1, 1.5]} // Capped for low energy consumption & superb rendering speed
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <DisplacedGrid color={themeHexColor} />
        <AmbientParticles color={themeHexColor} />
      </Canvas>
    </div>
  );
}
