
import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text3D } from '@react-three/drei';

interface AnimatedText3DProps {
  text: string;
  position?: [number, number, number];
  color?: string;
  size?: number;
}

const AnimatedText3D: React.FC<AnimatedText3DProps> = ({
  text,
  position = [0, 0, 0],
  color = '#5a67d8',
  size = 1
}) => {
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (mesh.current) {
      mesh.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.2;
      mesh.current.rotation.x = Math.cos(clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  return (
    <mesh ref={mesh} position={position}>
      <Text3D 
        font="/fonts/helvetiker_regular.typeface.json"
        size={size}
        height={0.2}
        curveSegments={12}
      >
        {text}
        <meshStandardMaterial color={color} />
      </Text3D>
    </mesh>
  );
};

export default AnimatedText3D;
