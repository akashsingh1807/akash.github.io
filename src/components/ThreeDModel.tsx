
import React, { useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useTheme } from '@/hooks/use-theme';
import { useIsMobile } from '@/hooks/use-mobile';

// Simple mobile-optimized model
const MobileCodeStructure = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  
  const color = theme === 'dark' ? '#0EA5E9' : '#0EA5E9';
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[1.2, 16, 16]} />
      <meshStandardMaterial 
        color={color} 
        wireframe={true}
        transparent={true}
        opacity={0.8}
      />
    </mesh>
  );
};

// Desktop optimized model
const DesktopCodeStructure = () => {
  const group = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  
  const mainColor = theme === 'dark' ? '#0EA5E9' : '#0EA5E9';
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1.3, 32, 32]} />
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
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  return (
    <div className={`w-full h-full min-h-[250px] md:min-h-[300px] ${className}`}>
      <Suspense 
        fallback={
          <div className="w-full h-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
            <div className="text-muted-foreground text-sm">Loading 3D Model...</div>
          </div>
        }
      >
        <Canvas
          camera={{ 
            position: isMobile ? [0, 0, 3.5] : [0, 0, 5], 
            fov: isMobile ? 50 : 45 
          }}
          className="w-full h-full"
          dpr={isMobile ? 1 : [1, 2]}
          performance={{ min: 0.5 }}
          gl={{ 
            antialias: !isMobile,
            alpha: true,
            powerPreference: isMobile ? "low-power" : "high-performance"
          }}
        >
          <ambientLight intensity={0.6} />
          <pointLight 
            position={[10, 10, 10]} 
            intensity={isMobile ? 0.8 : 1} 
          />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
            autoRotate={!isMobile}
            autoRotateSpeed={isMobile ? 0.3 : 0.5}
            enableDamping={true}
            dampingFactor={0.05}
          />
          
          {isMobile ? <MobileCodeStructure /> : <DesktopCodeStructure />}
        </Canvas>
      </Suspense>
    </div>
  );
};

export default ThreeDModel;
