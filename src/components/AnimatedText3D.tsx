
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';
import * as THREE from 'three';

interface AnimatedText3DProps {
  text: string;
  position?: [number, number, number];
  color?: string;
  size?: number;
  interactive?: boolean;
  font?: string;
}

const AnimatedText3D: React.FC<AnimatedText3DProps> = ({
  text,
  position = [0, 0, 0],
  color = '#5a67d8',
  size = 1,
  interactive = true,
  font = "/fonts/helvetiker_regular.typeface.json"
}) => {
  const mesh = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  
  // Significant performance optimizations
  const isMobile = viewport.width < 5;
  const curveSegments = isMobile ? 3 : 6; // Even lower polygon count
  
  // Much simpler animation approach
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    // Only animate every other frame to improve performance
    if (clock.elapsedTime % 0.1 > 0.05) return;
    
    // Simpler animations
    const t = clock.getElapsedTime() * 0.2; // Slower animation
    mesh.current.rotation.y = Math.sin(t) * 0.05;
    
    // Only apply hover effects if interactive
    if (interactive && hovered) {
      mesh.current.scale.setScalar(1.05);
    } else {
      mesh.current.scale.setScalar(1);
    }
  });
  
  // Memoize material properties to avoid unnecessary re-renders
  const materialProps = useMemo(() => ({
    color: color,
    metalness: 0.2,
    roughness: 0.8,
    emissive: hovered ? new THREE.Color(color).multiplyScalar(0.2) : new THREE.Color(0x000000)
  }), [color, hovered]);

  return (
    <mesh 
      ref={mesh} 
      position={position}
      onPointerOver={() => interactive && setHovered(true)}
      onPointerOut={() => interactive && setHovered(false)}
      onPointerDown={() => interactive && setClicked(true)}
      onPointerUp={() => interactive && setClicked(false)}
    >
      <Text3D 
        font={font}
        size={size}
        height={isMobile ? 0.05 : 0.1} // Thinner text
        curveSegments={curveSegments}
        bevelEnabled={false} // Remove bevel for better performance
      >
        {text}
        <meshStandardMaterial 
          color={materialProps.color}
          metalness={materialProps.metalness}
          roughness={materialProps.roughness}
          emissive={materialProps.emissive}
        />
      </Text3D>
    </mesh>
  );
};

export default AnimatedText3D;
