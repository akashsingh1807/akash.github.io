
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment, Float } from '@react-three/drei';
import { useTheme } from '@/hooks/use-theme';

// Simple cube model
const CubeModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial 
        color={theme === 'dark' ? '#0EA5E9' : '#0EA5E9'} 
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  );
};

// Abstract code-themed model
const CodeStructure = () => {
  const group = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  
  const mainColor = theme === 'dark' ? '#0EA5E9' : '#0EA5E9';
  const secondaryColor = theme === 'dark' ? '#6B7280' : '#9CA3AF';
  
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={group}>
      {/* Main sphere */}
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
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className={`w-full h-full min-h-[400px] ${className}`}>
      <ThreeCanvas />
    </div>
  );
};


const ThreeCanvas = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full h-full">
      <React.Suspense fallback={<div className="w-full h-full bg-muted/20 animate-pulse rounded-lg" />}>
        <Canvas
          shadows
          camera={{ position: [0, 0, 5], fov: 45 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} castShadow />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
          />
          
          <CodeStructure />
          
          <Environment preset="city" />
        </Canvas>
      </React.Suspense>
    </div>
  );
};

export default ThreeDModel;
