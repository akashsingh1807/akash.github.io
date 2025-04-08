
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text3D, useGLTF, useTexture } from '@react-three/drei';
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
  
  // Performance optimization: dynamic level of detail
  const isMobile = viewport.width < 5; // Adjust based on viewport size
  const curveSegments = isMobile ? 6 : 12;
  
  // Handle interaction effects with optimized animations
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    
    // Base animation - gentle floating
    const t = clock.getElapsedTime() * 0.4;
    const baseRotationY = Math.sin(t) * 0.1;
    const baseRotationX = Math.cos(t) * 0.05;
    
    // Interactive enhancements
    let targetRotationY = baseRotationY;
    let targetRotationX = baseRotationX;
    let targetScale = 1;
    
    if (interactive) {
      if (hovered) {
        targetRotationY *= 2;
        targetRotationX *= 2;
        targetScale = 1.1;
      }
      
      if (clicked) {
        targetRotationY *= 3;
        targetRotationX *= 3;
        targetScale = 1.2;
      }
    }
    
    // Apply with smooth transitions
    mesh.current.rotation.y += (targetRotationY - mesh.current.rotation.y) * 0.1;
    mesh.current.rotation.x += (targetRotationX - mesh.current.rotation.x) * 0.1;
    
    // Scale transition
    mesh.current.scale.x = mesh.current.scale.y = mesh.current.scale.z = 
      THREE.MathUtils.lerp(mesh.current.scale.x, targetScale, 0.1);
  });
  
  // Use state for material properties to optimize re-renders
  const [materialProps, setMaterialProps] = useState({
    color: color,
    metalness: 0.3,
    roughness: 0.7,
    emissive: new THREE.Color(0x000000)
  });
  
  // Update material properties when state changes
  useEffect(() => {
    if (hovered) {
      setMaterialProps({
        ...materialProps,
        emissive: new THREE.Color(color).multiplyScalar(0.3),
        metalness: 0.5,
        roughness: 0.5
      });
    } else {
      setMaterialProps({
        ...materialProps,
        emissive: new THREE.Color(0x000000),
        metalness: 0.3,
        roughness: 0.7
      });
    }
  }, [hovered, color]);

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
        height={isMobile ? 0.1 : 0.2}
        curveSegments={curveSegments}
        bevelEnabled={!isMobile}
        bevelThickness={0.01}
        bevelSize={0.01}
        bevelOffset={0}
        bevelSegments={3}
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
