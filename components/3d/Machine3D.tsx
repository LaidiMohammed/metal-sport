'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';

interface Machine3DProps {
  machineType: 'treadmill' | 'dumbbell' | 'bench' | 'leg-press';
  color?: string;
}

export function Machine3D({ machineType, color = '#DC2626' }: Machine3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  // Different machine geometries
  const getMachineGeometry = () => {
    switch (machineType) {
      case 'treadmill':
        return <boxGeometry args={[2, 1, 1]} />;
      case 'dumbbell':
        return <boxGeometry args={[0.3, 2, 0.3]} />;
      case 'bench':
        return <boxGeometry args={[2, 0.5, 1]} />;
      case 'leg-press':
        return <boxGeometry args={[2, 2, 1.5]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  return (
    <group ref={groupRef}>
      <mesh castShadow receiveShadow>
        {getMachineGeometry()}
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Frame/Base */}
      <mesh position={[0, -0.8, 0]} castShadow>
        <boxGeometry args={[2.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#222222" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Accent light */}
      <pointLight position={[1, 1, 1]} intensity={1.5} color={color} />
    </group>
  );
}

export default Machine3D;
