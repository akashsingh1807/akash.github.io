
import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Text3D, useGLTF, Center } from '@react-three/drei';
import { useTheme } from '@/hooks/use-theme';

// Code-themed developer model
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
  
  // Generate random code lines positions
  const codeLines = Array.from({ length: 10 }, (_, i) => {
    const x = (Math.random() - 0.5) * 3;
    const y = (Math.random() - 0.5) * 3;
    const z = (Math.random() - 0.5) * 3;
    const scale = 0.1 + Math.random() * 0.2;
    const rotate = Math.random() * Math.PI * 2;
    return { position: [x, y, z], scale, rotate };
  });

  return (
    <group ref={group}>
      {/* Code Matrix */}
      {codeLines.map((line, index) => (
        <mesh 
          key={index}
          position={[line.position[0], line.position[1], line.position[2]]}
          rotation={[0, line.rotate, 0]}
        >
          <boxGeometry args={[2, 0.05, 0.5]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? mainColor : secondaryColor}
            emissive={index % 2 === 0 ? mainColor : secondaryColor}
            emissiveIntensity={0.5}
            transparent={true}
            opacity={0.8}
          />
        </mesh>
      ))}
      
      {/* Central cube with code symbols */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial 
          color={mainColor}
          metalness={0.8}
          roughness={0.2}
          wireframe={true}
        />
      </mesh>

      {/* Orbiting brackets */}
      <group rotation={[0, 0, Math.PI / 2]}>
        <mesh position={[0, 2, 0]} scale={[0.3, 1, 0.1]}>
          <torusGeometry args={[1, 0.2, 16, 32, Math.PI]} />
          <meshStandardMaterial color={secondaryColor} emissive={secondaryColor} emissiveIntensity={0.3} />
        </mesh>
      </group>
      
      <group rotation={[0, Math.PI / 2, Math.PI / 2]}>
        <mesh position={[0, 2, 0]} scale={[0.3, 1, 0.1]}>
          <torusGeometry args={[1, 0.2, 16, 32, Math.PI]} />
          <meshStandardMaterial color={mainColor} emissive={mainColor} emissiveIntensity={0.3} />
        </mesh>
      </group>
      
      {/* Binary particles */}
      {Array.from({ length: 20 }, (_, i) => {
        const theta = Math.random() * Math.PI * 2;
        const radius = 1.5 + Math.random() * 1;
        const x = Math.sin(theta) * radius;
        const y = (Math.random() - 0.5) * 3;
        const z = Math.cos(theta) * radius;
        return { position: [x, y, z], size: 0.05 + Math.random() * 0.1 };
      }).map((particle, index) => (
        <mesh key={`particle-${index}`} position={[particle.position[0], particle.position[1], particle.position[2]]}>
          <sphereGeometry args={[particle.size, 8, 8]} />
          <meshStandardMaterial 
            color={index % 2 === 0 ? '#ffffff' : mainColor} 
            emissive={index % 2 === 0 ? '#ffffff' : mainColor}
            emissiveIntensity={0.7}
          />
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
          
          <CodeStructure />
          
          <Environment preset="city" />
        </Canvas>
      </React.Suspense>
    </div>
  );
};

export default ThreeDModel;
