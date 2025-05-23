
import React, { useRef  } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';

// Abstract code-themed model
const CodeStructure = () => {
  const group = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const isMobile = useIsMobile();
  
  const mainColor = theme === 'dark' ? '#0EA5E9' : '#0EA5E9';
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * (isMobile ? 0.1 : 0.15);
    }
  });

  return (
    <group ref={group}>
      {/* Main sphere - smaller on mobile */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[isMobile ? 1.0 : 1.3, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
        <meshStandardMaterial 
          color={mainColor} 
          emissive={mainColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          wireframe={true}
        />
      </mesh>
    </group>
  );
};

interface ThreeDModelProps {
  className?: string;
}

const ThreeDModel: React.FC<ThreeDModelProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`w-full h-full min-h-[300px] ${className}`}>
      <ThreeCanvas />
    </div>
  );
};

const ThreeCanvas = () => {
  const { theme } = useTheme();
  const isMobile = useIsMobile();

  return (
    <div className="w-full h-full">
      <React.Suspense fallback={<div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" />}>
        <Canvas
          shadows={!isMobile}
          camera={{ position: [0, 0, isMobile ? 4 : 5], fov: 45 }}
          className="w-full h-full"
          dpr={isMobile ? 1 : [1, 2]}
          performance={{ min: 0.5 }}
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow={!isMobile} />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate={!isMobile}
            autoRotateSpeed={0.5}
          />
          
          <CodeStructure />
          
          {!isMobile && <Environment preset="city" />}
        </Canvas>
      </React.Suspense>
    </div>
  );
};

export default ThreeDModel;
