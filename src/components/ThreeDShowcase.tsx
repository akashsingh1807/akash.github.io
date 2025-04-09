import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';

// Witty code snippet component
const WittyCodeSnippet = () => {
  const codeRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!codeRef.current) return;
    
    // Get the parent group element for 3D transformations
    const group = codeRef.current.parentElement?.parentElement;
    if (!group) return;
    
    // Gentle floating animation
    group.style.transform = `translateY(${Math.sin(state.clock.elapsedTime * 0.5) * 10}px)`;
    
    // Subtle rotation
    group.style.transform += ` rotateY(${Math.sin(state.clock.elapsedTime * 0.2) * 5}deg)`;
    
    // Hover effect
    if (hovered) {
      group.style.transform += ' scale(1.05)';
    } else {
      group.style.transform = group.style.transform.replace(' scale(1.05)', '');
    }
  });
  
  return (
    <group position={[0, 0, 0]}>
      <Html
        ref={codeRef}
        position={[0, 0, 0]}
        transform
        occlude
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <div className="bg-black/80 p-4 rounded-lg border border-primary/30 shadow-lg shadow-primary/20 max-w-md">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="text-xs text-gray-400 ml-2">developer_life.js</div>
          </div>
          <pre className="text-xs text-gray-300 overflow-x-auto">
            <code>{`// My life as a developer
class DeveloperLife {
  constructor() {
    this.coffee = 0;
    this.bugs = [];
    this.deadlines = [];
  }

  startDay() {
    while (this.coffee < 3) {
      console.log("Need more coffee...");
      this.coffee++;
    }
  }

  debug() {
    try {
      // Try to fix the bug
      this.bugs.forEach(bug => {
        console.log("Fixing bug:", bug);
        // If it doesn't work, it's a feature
        if (Math.random() > 0.7) {
          console.log("It's not a bug, it's a feature!");
          this.bugs = this.bugs.filter(b => b !== bug);
        }
      });
    } catch (error) {
      console.log("Have you tried turning it off and on again?");
    }
  }

  meetDeadline() {
    // Add more hours to the day
    const extraHours = this.deadlines.length * 2;
    console.log(\`Adding \${extraHours} hours to today\`);
    
    // When in doubt, add more comments
    return {
      approach: "console.log('here')",
      solution: "It works on my machine 🤷‍♂️",
      finalAnswer: "We'll fix it in production"
    };
  }
}

// TODO: Remove this code before production
// FIXME: This is a temporary fix
// HACK: This is a permanent fix`}</code>
          </pre>
        </div>
      </Html>
    </group>
  );
};

const ThreeDShowcase = () => {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.8} />
        <WittyCodeSnippet />
        <OrbitControls 
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default ThreeDShowcase; 