import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Center, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const ThreeDText = () => {
  const textRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [position] = useState([0, 0, 0]);

  const wittyTexts = [
    "Java is my coffee",
    "Stack Overflow is my Bible",
    "Bug? What Bug?",
    "Ctrl + C, Ctrl + V",
    "It works on my machine",
    "Full Stack & Chill",
    "Java > JavaScript",
    "Spring Boot = Life",
    "Coffee ☕ = Code",
    "NullPointerException? Never heard of it"
  ];

  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % wittyTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state) => {
    if (!textRef.current) return;

    // Full 360-degree rotation on all axes
    textRef.current.rotation.x = state.clock.elapsedTime * 0.3;
    textRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    textRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    
    // Floating animation
    textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.2;
    
    // Hover effect
    if (hovered) {
      textRef.current.scale.set(1.2, 1.2, 1.2);
      // Faster rotation on hover
      textRef.current.rotation.x *= 2;
      textRef.current.rotation.y *= 2;
    } else {
      textRef.current.scale.set(1, 1, 1);
    }
  });

  return (
    <Center>
      <Text
        ref={textRef}
        fontSize={0.5}
        maxWidth={5}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxK.ttf"
        anchorX="center"
        anchorY="middle"
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        {wittyTexts[textIndex]}
        <meshStandardMaterial 
          color="#0ea5e9" 
          metalness={0.8} 
          roughness={0.2} 
          emissive="#0ea5e9" 
          emissiveIntensity={0.2} 
        />
      </Text>
    </Center>
  );
};

const ThreeDShowcase = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <ThreeDText />
        <OrbitControls enableZoom={false} />
      </Canvas>
    </div>
  );
};

export default ThreeDShowcase; 