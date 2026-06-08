'use client';

import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import * as THREE from 'three';

export function Mascot3D() {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  // Rotation animation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(Date.now() * 0.001) * 0.001;
    }
  });

  // GSAP scroll trigger effect
  useEffect(() => {
    if (typeof window !== 'undefined' && groupRef.current) {
      gsap.registerPlugin();
      // Scroll-based animation can be added here with ScrollTrigger
    }
  }, []);

  return (
    <group ref={groupRef}>
      {/* Placeholder: Rotating torus knot (represents mascot) */}
      <mesh ref={meshRef} castShadow receiveShadow>
        {/* Create a composite shape representing the mascot */}
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="#DC2626" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Glow effect */}
      <pointLight position={[0, 0, 2]} intensity={2} color="#DC2626" />

      {/* Shadow casting plane */}
      <mesh position={[0, -1.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <shadowMaterial transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

export default Mascot3D;
