
import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text3D } from '@react-three/drei';
import { useTheme } from '@/hooks/use-theme';

// Code-themed 3D model with focus on programmer aesthetic
const CodeModel = () => {
  const group = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  
  const mainColor = theme === 'dark' ? '#0EA5E9' : '#0EA5E9';
  const secondaryColor = theme === 'dark' ? '#6B7280' : '#9CA3AF';
  const textColor = theme === 'dark' ? '#FFFFFF' : '#111111';
  
  useFrame((state) => {
    if (group.current) {
      // Gently rotate the entire model
      group.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <group ref={group}>
      {/* Central code sphere */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={mainColor} 
          emissive={mainColor}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
          wireframe={true}
        />
      </mesh>
      
      {/* Code brackets orbiting the sphere */}
      <mesh position={[1.8, 0, 0]} castShadow>
        <Text3D 
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
        >
          {'{'}
          <meshStandardMaterial 
            color={secondaryColor} 
            emissive={secondaryColor}
            emissiveIntensity={0.3}
          />
        </Text3D>
      </mesh>
      
      <mesh position={[-1.8, 0, 0]} castShadow rotation={[0, Math.PI, 0]}>
        <Text3D 
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.5}
          height={0.1}
          curveSegments={12}
        >
          {'}'}
          <meshStandardMaterial 
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={0.3}
          />
        </Text3D>
      </mesh>
      
      {/* Nerdy glasses frame as an accent */}
      <mesh position={[0, 0.8, 1]} castShadow>
        <torusGeometry args={[0.3, 0.03, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 0.8, 1]} castShadow>
        <torusGeometry args={[0.3, 0.03, 16, 32, Math.PI]} rotation={[0, 0, Math.PI]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0, 0.8, 1]} castShadow>
        <boxGeometry args={[0.1, 0.03, 0.03]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* T-shirt outline representing merch */}
      <mesh position={[0, -0.8, 0]} castShadow rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.05, 16, 32, Math.PI * 1.3]} rotation={[Math.PI/2, 0, 0]} />
        <meshStandardMaterial 
          color={mainColor}
          emissive={mainColor}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      {/* Code floating around */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh 
          key={i} 
          position={[
            Math.sin(i * Math.PI * 0.4) * 2, 
            Math.cos(i * Math.PI * 0.4) * 2, 
            Math.sin(i * Math.PI * 0.2) * 2
          ]} 
          castShadow
          scale={0.15}
        >
          <Text3D 
            font="/fonts/helvetiker_regular.typeface.json"
            size={1}
            height={0.1}
            curveSegments={4}
          >
            {i % 2 === 0 ? '</' : '<>'}
            <meshStandardMaterial 
              color={textColor}
              emissive={mainColor}
              emissiveIntensity={0.1}
            />
          </Text3D>
        </mesh>
      ))}
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
          
          <CodeModel />
          
          <Environment preset="city" />
        </Canvas>
      </React.Suspense>
    </div>
  );
};

export default ThreeDModel;
