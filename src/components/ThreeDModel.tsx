
import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useTheme } from '@/hooks/use-theme';

// Space-themed universe model with orbiting planets
const UniverseModel = () => {
  const group = useRef<THREE.Group>(null);
  const orbitRef1 = useRef<THREE.Group>(null);
  const orbitRef2 = useRef<THREE.Group>(null);
  const orbitRef3 = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  
  // Colors based on theme
  const starColor = '#F97316'; // Bright orange for the star
  const planet1Color = theme === 'dark' ? '#0EA5E9' : '#0EA5E9'; // Ocean blue
  const planet2Color = theme === 'dark' ? '#33C3F0' : '#33C3F0'; // Sky blue
  const planet3Color = theme === 'dark' ? '#0FA0CE' : '#0FA0CE'; // Bright blue
  
  useFrame((state) => {
    if (group.current) {
      // Slow rotation for the entire universe
      group.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
    
    // Different rotation speeds for each planet orbit
    if (orbitRef1.current) {
      orbitRef1.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
    
    if (orbitRef2.current) {
      orbitRef2.current.rotation.y = -state.clock.getElapsedTime() * 0.3;
    }
    
    if (orbitRef3.current) {
      orbitRef3.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });
  
  // Generate random stars for the background
  const stars = Array.from({ length: 100 }, (_, i) => {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const radius = 8 + Math.random() * 10;
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);
    return { position: [x, y, z], size: 0.01 + Math.random() * 0.03 };
  });

  return (
    <group ref={group}>
      {/* Central star */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial 
          color={starColor} 
          emissive={starColor}
          emissiveIntensity={1}
          metalness={0.3}
          roughness={0.7}
        />
      </mesh>
      
      {/* Glowing effect for the star */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[1.2, 16, 16]} />
        <meshBasicMaterial 
          color={starColor} 
          transparent={true}
          opacity={0.15}
        />
      </mesh>
      
      {/* First orbiting planet */}
      <group ref={orbitRef1}>
        <mesh position={[3, 0, 0]} castShadow>
          <sphereGeometry args={[0.4, 24, 24]} />
          <meshStandardMaterial 
            color={planet1Color}
            metalness={0.4}
            roughness={0.7}
          />
        </mesh>
        
        {/* Moon for the first planet */}
        <mesh position={[3, 0, 0.8]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial 
            color="#CCCCCC"
            metalness={0.2}
            roughness={0.8}
          />
        </mesh>
      </group>
      
      {/* Second orbiting planet */}
      <group ref={orbitRef2}>
        <mesh position={[0, 0, 5]} castShadow>
          <sphereGeometry args={[0.6, 24, 24]} />
          <meshStandardMaterial 
            color={planet2Color}
            metalness={0.4}
            roughness={0.5}
          />
        </mesh>
        
        {/* Ring around second planet */}
        <mesh position={[0, 0, 5]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.9, 0.1, 16, 32]} />
          <meshStandardMaterial 
            color="#AAAAAA" 
            transparent={true} 
            opacity={0.7}
          />
        </mesh>
      </group>
      
      {/* Third orbiting planet */}
      <group ref={orbitRef3}>
        <mesh position={[-4.5, 0.5, -2]} castShadow>
          <sphereGeometry args={[0.5, 24, 24]} />
          <meshStandardMaterial 
            color={planet3Color}
            metalness={0.5}
            roughness={0.6}
          />
        </mesh>
      </group>
      
      {/* Background stars */}
      {stars.map((star, index) => (
        <mesh key={`star-${index}`} position={[star.position[0], star.position[1], star.position[2]]}>
          <sphereGeometry args={[star.size, 8, 8]} />
          <meshBasicMaterial 
            color="#FFFFFF" 
            emissive="#FFFFFF"
            emissiveIntensity={1}
          />
        </mesh>
      ))}
      
      {/* Orbit paths (rings) */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3, 3.05, 64]} />
        <meshBasicMaterial color="#FFFFFF" transparent={true} opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[5, 5.05, 64]} />
        <meshBasicMaterial color="#FFFFFF" transparent={true} opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[4.75, 4.8, 64]} />
        <meshBasicMaterial color="#FFFFFF" transparent={true} opacity={0.05} side={THREE.DoubleSide} />
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
          camera={{ position: [0, 3, 10], fov: 45 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.3} />
          <pointLight position={[0, 0, 0]} intensity={2} color="#F97316" castShadow />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />
          
          <UniverseModel />
          
          <Environment preset="city" />
        </Canvas>
      </React.Suspense>
    </div>
  );
};

export default ThreeDModel;
