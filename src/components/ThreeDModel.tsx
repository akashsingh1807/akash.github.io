
import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
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
      
      {/* Orbiting elements - data nodes */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {[-1, 1].map((x) => (
          <mesh key={`cube-${x}`} position={[x * 2, 0, 0]} castShadow>
            <octahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial 
              color={secondaryColor} 
              metalness={0.7} 
              roughness={0.3}
            />
          </mesh>
        ))}
      </Float>
      
      <Float speed={1.5} rotationIntensity={0.7} floatIntensity={0.2}>
        {[-1, 1].map((z) => (
          <mesh key={`sphere-${z}`} position={[0, z * 2, 0]} castShadow>
            <dodecahedronGeometry args={[0.5, 0]} />
            <meshStandardMaterial 
              color={secondaryColor} 
              metalness={0.7} 
              roughness={0.3}
            />
          </mesh>
        ))}
      </Float>
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
        <three.Canvas
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
        </three.Canvas>
      </React.Suspense>
    </div>
  );
};

export default ThreeDModel;
