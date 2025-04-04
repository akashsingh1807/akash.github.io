
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, useGLTF, Environment } from '@react-three/drei';

// Simple 3D Text component
export const AnimatedText3D = ({ text }: { text: string }) => {
  return (
    <mesh position={[0, 0, 0]}>
      <textGeometry args={[text, { size: 1, height: 0.2 }]} />
      <meshStandardMaterial color="#5a67d8" />
    </mesh>
  );
};

// Simple 3D Model component (placeholder)
const Model = () => {
  return (
    <mesh position={[0, 0, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#5a67d8" metalness={0.5} roughness={0.2} />
    </mesh>
  );
};

export const ThreeDShowcasePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl">
              3D Showcase
            </h1>
            <p className="mt-4 text-xl text-muted-foreground">
              Interactive 3D visualizations and models
            </p>
          </div>

          <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-xl">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              <Model />
              <OrbitControls />
              <Environment preset="city" />
            </Canvas>
          </div>

          <div className="mt-12 prose prose-lg max-w-3xl mx-auto">
            <h2>About This Showcase</h2>
            <p>
              This page demonstrates integration of 3D graphics using Three.js with React through the React Three Fiber library.
              The 3D models and animations on this page are interactive - try dragging to rotate the view!
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ThreeDShowcasePage;
