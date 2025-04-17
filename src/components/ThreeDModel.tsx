
import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { useTheme } from '@/hooks/use-theme';

// Human model using simplified geometries
const HumanModel = () => {
  const group = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  
  // Colors based on theme
  const skinColor = theme === 'dark' ? '#8B6D5C' : '#BD9178'; // Warm skin tone
  const clothColor = theme === 'dark' ? '#4A6FA5' : '#3B82F6'; // Blue shirt/top
  const pantColor = theme === 'dark' ? '#2D3748' : '#1E293B'; // Dark pants
  const glassesColor = theme === 'dark' ? '#000000' : '#333333'; // Black glasses
  
  useFrame((state) => {
    if (group.current) {
      // Subtle idle animation
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1 + Math.PI;
      
      // Make the model face the camera slightly
      const targetRotation = Math.PI + Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
      group.current.rotation.y += (targetRotation - group.current.rotation.y) * 0.05;
    }
  });

  return (
    <group ref={group} position={[0, -0.5, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* Head */}
      <mesh position={[0, 2.7, 0]} castShadow>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial 
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      
      {/* Hair */}
      <mesh position={[0, 2.8, 0]} castShadow>
        <sphereGeometry args={[0.52, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial 
          color="#000000"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Face features */}
      {/* Eyes */}
      <mesh position={[0.15, 2.75, 0.4]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-0.15, 2.75, 0.4]} castShadow>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      
      {/* Pupils */}
      <mesh position={[0.15, 2.75, 0.47]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#553311" />
      </mesh>
      <mesh position={[-0.15, 2.75, 0.47]} castShadow>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="#553311" />
      </mesh>
      
      {/* Glasses */}
      <mesh position={[0.15, 2.75, 0.44]} castShadow>
        <ringGeometry args={[0.1, 0.12, 16]} />
        <meshStandardMaterial color={glassesColor} />
      </mesh>
      <mesh position={[-0.15, 2.75, 0.44]} castShadow>
        <ringGeometry args={[0.1, 0.12, 16]} />
        <meshStandardMaterial color={glassesColor} />
      </mesh>
      <mesh position={[0, 2.75, 0.44]} castShadow>
        <boxGeometry args={[0.2, 0.02, 0.02]} />
        <meshStandardMaterial color={glassesColor} />
      </mesh>
      
      {/* Smile */}
      <mesh position={[0, 2.60, 0.42]} castShadow rotation={[0, 0, 0]}>
        <torusGeometry args={[0.15, 0.03, 16, 32, Math.PI]} />
        <meshStandardMaterial color="#CC6666" />
      </mesh>
      
      {/* Neck */}
      <mesh position={[0, 2.35, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.12, 0.3, 16]} />
        <meshStandardMaterial 
          color={skinColor}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      
      {/* Torso/Upper body */}
      <mesh position={[0, 1.75, 0]} castShadow>
        <boxGeometry args={[0.9, 1.3, 0.5]} />
        <meshStandardMaterial 
          color={clothColor}
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>
      
      {/* Arms */}
      {/* Left Arm */}
      <group position={[-0.55, 1.9, 0]} rotation={[0, 0, -0.2]}>
        <mesh position={[0, -0.25, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.7, 16]} />
          <meshStandardMaterial color={clothColor} />
        </mesh>
        {/* Left Hand */}
        <mesh position={[0, -0.65, 0]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
      </group>
      
      {/* Right Arm */}
      <group position={[0.55, 1.9, 0]} rotation={[0, 0, 0.3]}>
        <mesh position={[0, -0.3, 0.2]} rotation={[0.5, 0, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
          <meshStandardMaterial color={clothColor} />
        </mesh>
        {/* Right Hand - holding something like a phone or device */}
        <mesh position={[0, -0.6, 0.35]} castShadow>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color={skinColor} />
        </mesh>
        <mesh position={[0, -0.6, 0.45]} castShadow>
          <boxGeometry args={[0.2, 0.3, 0.02]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      
      {/* Lower body/Pants */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.9, 0.8, 0.5]} />
        <meshStandardMaterial 
          color={pantColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      
      {/* Legs */}
      {/* Left Leg */}
      <mesh position={[-0.25, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial color={pantColor} />
      </mesh>
      
      {/* Right Leg */}
      <mesh position={[0.25, 0.1, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 1.2, 16]} />
        <meshStandardMaterial color={pantColor} />
      </mesh>
      
      {/* Feet */}
      <mesh position={[-0.25, -0.6, 0.1]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[0.25, -0.6, 0.1]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.3]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      
      {/* Add tech elements to showcase "smart" theme */}
      {/* Floating code elements */}
      {Array.from({ length: 6 }).map((_, index) => {
        const angle = (index / 6) * Math.PI * 2;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = 1.8 + Math.random() * 1.5;
        
        return (
          <group key={index} position={[x, y, z]} scale={[0.2, 0.2, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[1, 0.3, 0.1]} />
              <meshBasicMaterial color={theme === 'dark' ? "#4F8EFF" : "#3B82F6"} transparent opacity={0.7} />
            </mesh>
          </group>
        );
      })}
      
      {/* Laptop/Device on the ground */}
      <mesh position={[0, -0.5, 1]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.05, 0.5]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh position={[0, -0.55, 0.8]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 0.05, 0.4]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
      
      {/* Screen light effect */}
      <mesh position={[0, -0.52, 0.8]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.7, 0.35]} />
        <meshBasicMaterial 
          color={theme === 'dark' ? "#3B82F6" : "#60A5FA"}
          transparent
          opacity={0.7}
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
          camera={{ position: [0, 1.5, 4], fov: 45 }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.5} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={1}
            castShadow
            shadow-mapSize-width={512}
            shadow-mapSize-height={512}
          />
          <pointLight position={[0, 3, 2]} intensity={0.5} color="#ffffff" />
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
            rotateSpeed={0.5}
          />
          
          <HumanModel />
          
          <Environment preset="city" />
        </Canvas>
      </React.Suspense>
    </div>
  );
};

export default ThreeDModel;
