'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ─── Pulsing ring for logo version (rendered inside Canvas) ────────────────

function LogoPulse() {
  const ring1 = useRef<THREE.Mesh>(null);
  const ring2 = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ring1.current) {
      const s = 1 + 0.08 * Math.sin(t * 2);
      ring1.current.scale.setScalar(s);
      const mat = ring1.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.opacity = 0.5 + 0.3 * Math.sin(t * 2);
    }
    if (ring2.current) {
      const s = 1 + 0.05 * Math.sin(t * 2 + Math.PI);
      ring2.current.scale.setScalar(s);
      const mat = ring2.current.material as THREE.MeshStandardMaterial;
      if (mat) mat.opacity = 0.3 + 0.2 * Math.sin(t * 2 + Math.PI);
    }
  });

  return (
    <group position={[0, -0.70, 0]}>
      <mesh ref={ring1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.025, 6, 48]} />
        <meshStandardMaterial
          color="#00d4aa"
          emissive="#00d4aa"
          emissiveIntensity={1.5}
          transparent
          opacity={0.5}
        />
      </mesh>
      <mesh ref={ring2} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.015, 6, 48]} />
        <meshStandardMaterial
          color="#00d4aa"
          emissive="#00d4aa"
          emissiveIntensity={1.0}
          transparent
          opacity={0.3}
        />
      </mesh>
    </group>
  );
}

// ─── 3D Model: Muscular Flexing Dumbbell Gym Mascot ────────────────────────

interface MascotModelProps {
  interactive?: boolean;
}

function MascotModel({ interactive = false }: MascotModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  const glassesRef = useRef<THREE.Mesh>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse move listener for interactive tilting
  React.useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [interactive]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      if (interactive) {
        const targetRotY = mousePos.x * 1.5;
        const targetRotX = mousePos.y * 1.0;
        groupRef.current.rotation.y += (targetRotY - groupRef.current.rotation.y) * 0.08;
        groupRef.current.rotation.x += (targetRotX - groupRef.current.rotation.x) * 0.08;
      } else {
        // Smooth idle rotation
        groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.4;
      }
      // Hover floating effect
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.06;
    }

    if (glassesRef.current) {
      const mat = glassesRef.current.material as THREE.MeshStandardMaterial;
      if (mat) {
        mat.emissiveIntensity = 0.8 + 0.4 * Math.sin(t * 3);
      }
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.15, 0]}>
      {/* ─── HEAD, JAW, HAIR & GLASSES ─── */}
      <group position={[0, 0.65, 0]}>
        {/* Neck */}
        <mesh position={[0, -0.11, 0]} castShadow receiveShadow>
          <capsuleGeometry args={[0.045, 0.08, 4, 16]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>
        
        {/* Head Base */}
        <mesh position={[0, 0.02, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.15, 32, 32]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>

        {/* Masculine Jaw/Chin */}
        <mesh position={[0, -0.05, 0.03]} rotation={[0.15, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.13, 0.09, 0.13]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>

        {/* Smiling White Teeth */}
        <mesh position={[0, -0.05, 0.095]} castShadow receiveShadow>
          <boxGeometry args={[0.07, 0.016, 0.01]} />
          <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.0} />
        </mesh>
        {/* Smile Mouth Background */}
        <mesh position={[0, -0.05, 0.091]}>
          <boxGeometry args={[0.08, 0.024, 0.01]} />
          <meshStandardMaterial color="#5c0606" roughness={0.8} />
        </mesh>

        {/* Hair Base */}
        <mesh position={[0, 0.06, -0.02]} scale={[1.05, 1.02, 1.08]} castShadow receiveShadow>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#111827" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Hair Top (Slicked pompadour) */}
        <mesh position={[0, 0.14, 0.03]} rotation={[0.1, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.15, 0.12, 0.15]} />
          <meshStandardMaterial color="#111827" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Hair front lock 1 */}
        <mesh position={[-0.04, 0.17, 0.09]} rotation={[-0.2, 0.1, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.03, 0.06, 0.05]} />
          <meshStandardMaterial color="#111827" roughness={0.8} metalness={0.1} />
        </mesh>
        {/* Hair front lock 2 */}
        <mesh position={[0.04, 0.17, 0.09]} rotation={[-0.2, -0.1, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.03, 0.06, 0.05]} />
          <meshStandardMaterial color="#111827" roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Sunglasses Frame */}
        <mesh position={[0, 0.04, 0.11]} castShadow receiveShadow>
          <boxGeometry args={[0.22, 0.045, 0.03]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Sunglasses Lens Left */}
        <mesh ref={glassesRef} position={[-0.055, 0.035, 0.12]}>
          <boxGeometry args={[0.075, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={1.0}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
        {/* Sunglasses Lens Right */}
        <mesh position={[0.055, 0.035, 0.12]}>
          <boxGeometry args={[0.075, 0.04, 0.02]} />
          <meshStandardMaterial
            color="#00d4aa"
            emissive="#00d4aa"
            emissiveIntensity={1.0}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </group>

      {/* ─── TORSO / TANK TOP ─── */}
      <group position={[0, 0.22, 0]}>
        {/* Main Chest (V-Shape Cylinder) */}
        <mesh position={[0, 0.08, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.23, 0.16, 0.32, 24]} />
          <meshStandardMaterial color="#00b8d4" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Pectoral Bulge Left */}
        <mesh position={[-0.09, 0.15, 0.07]} scale={[1.1, 1.0, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#00b8d4" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Pectoral Bulge Right */}
        <mesh position={[0.09, 0.15, 0.07]} scale={[1.1, 1.0, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.11, 16, 16]} />
          <meshStandardMaterial color="#00b8d4" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Upper Chest Skin */}
        <mesh position={[0, 0.22, 0.06]} scale={[1.1, 1.0, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>

        {/* 3D Dumbbell Logo on Chest */}
        <group position={[0, 0.14, 0.14]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.05, 0.012, 0.015]} />
            <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[-0.025, 0, 0]} rotation={[Math.PI/2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.015, 8]} />
            <meshStandardMaterial color="#00d4aa" />
          </mesh>
          <mesh position={[0.025, 0, 0]} rotation={[Math.PI/2, 0, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.015, 8]} />
            <meshStandardMaterial color="#00d4aa" />
          </mesh>
        </group>

        {/* Tank Top Left Strap */}
        <mesh position={[-0.14, 0.25, 0.01]} rotation={[Math.PI / 12, 0, 0.1]} castShadow receiveShadow>
          <boxGeometry args={[0.035, 0.11, 0.17]} />
          <meshStandardMaterial color="#00b8d4" roughness={0.4} metalness={0.2} />
        </mesh>
        {/* Tank Top Right Strap */}
        <mesh position={[0.14, 0.25, 0.01]} rotation={[Math.PI / 12, 0, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[0.035, 0.11, 0.17]} />
          <meshStandardMaterial color="#00b8d4" roughness={0.4} metalness={0.2} />
        </mesh>
        
        {/* Abdomen / Waist */}
        <mesh position={[0, -0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.14, 0.14, 24]} />
          <meshStandardMaterial color="#00b8d4" roughness={0.4} metalness={0.2} />
        </mesh>

        {/* Abs Muscle Definition */}
        {/* Upper Abs */}
        <mesh position={[-0.045, -0.11, 0.115]} scale={[1.3, 0.7, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#00839c" roughness={0.4} />
        </mesh>
        <mesh position={[0.045, -0.11, 0.115]} scale={[1.3, 0.7, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#00839c" roughness={0.4} />
        </mesh>
        {/* Mid Abs */}
        <mesh position={[-0.045, -0.15, 0.12]} scale={[1.3, 0.7, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#00839c" roughness={0.4} />
        </mesh>
        <mesh position={[0.045, -0.15, 0.12]} scale={[1.3, 0.7, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#00839c" roughness={0.4} />
        </mesh>
        {/* Lower Abs */}
        <mesh position={[-0.04, -0.19, 0.115]} scale={[1.3, 0.7, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#00839c" roughness={0.4} />
        </mesh>
        <mesh position={[0.04, -0.19, 0.115]} scale={[1.3, 0.7, 0.7]} castShadow receiveShadow>
          <sphereGeometry args={[0.02, 8, 8]} />
          <meshStandardMaterial color="#00839c" roughness={0.4} />
        </mesh>
      </group>

      {/* ─── LOWER BODY / SHORTS & LEGS ─── */}
      <group position={[0, -0.14, 0]}>
        {/* Waist Belt/Top of Shorts */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.16, 0.05, 24]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Pelvis/Shorts */}
        <mesh position={[0, -0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.29, 0.14, 0.21]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Shorts Leg Left */}
        <mesh position={[-0.08, -0.14, 0]} rotation={[0, 0, -0.05]} castShadow receiveShadow>
          <cylinderGeometry args={[0.10, 0.09, 0.12, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
        </mesh>
        {/* Shorts Leg Right */}
        <mesh position={[0.08, -0.14, 0]} rotation={[0, 0, 0.05]} castShadow receiveShadow>
          <cylinderGeometry args={[0.10, 0.09, 0.12, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.1} />
        </mesh>

        {/* Muscular Thigh Left (Smooth Capsule) */}
        <mesh position={[-0.08, -0.25, 0.01]} castShadow receiveShadow>
          <capsuleGeometry args={[0.065, 0.11, 4, 16]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>
        {/* Muscular Thigh Right */}
        <mesh position={[0.08, -0.25, 0.01]} castShadow receiveShadow>
          <capsuleGeometry args={[0.065, 0.11, 4, 16]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>
        
        {/* Calf Left */}
        <mesh position={[-0.08, -0.40, 0.02]} castShadow receiveShadow>
          <capsuleGeometry args={[0.05, 0.11, 4, 16]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>
        {/* Calf Right */}
        <mesh position={[0.08, -0.40, 0.02]} castShadow receiveShadow>
          <capsuleGeometry args={[0.05, 0.11, 4, 16]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>

        {/* Detailed Athletic Sneaker Left */}
        <group position={[-0.08, -0.51, 0.04]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.07, 0.055, 0.14]} />
            <meshStandardMaterial color="#00b8d4" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* White Toe Cap */}
          <mesh position={[0, -0.005, 0.06]} scale={[1, 0.8, 1]} castShadow receiveShadow>
            <sphereGeometry args={[0.036, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          {/* Sneaker Laces block */}
          <mesh position={[0, 0.02, 0.025]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.01, 0.05]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Sneaker Sole */}
          <mesh position={[0, -0.033, 0.015]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.015, 0.15]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.0} />
          </mesh>
        </group>
        
        {/* Detailed Athletic Sneaker Right */}
        <group position={[0.08, -0.51, 0.04]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.07, 0.055, 0.14]} />
            <meshStandardMaterial color="#00b8d4" roughness={0.4} metalness={0.2} />
          </mesh>
          {/* White Toe Cap */}
          <mesh position={[0, -0.005, 0.06]} scale={[1, 0.8, 1]} castShadow receiveShadow>
            <sphereGeometry args={[0.036, 12, 12]} />
            <meshStandardMaterial color="#ffffff" roughness={0.8} />
          </mesh>
          {/* Sneaker Laces block */}
          <mesh position={[0, 0.02, 0.025]} castShadow receiveShadow>
            <boxGeometry args={[0.04, 0.01, 0.05]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} />
          </mesh>
          {/* Sneaker Sole */}
          <mesh position={[0, -0.033, 0.015]} castShadow receiveShadow>
            <boxGeometry args={[0.08, 0.015, 0.15]} />
            <meshStandardMaterial color="#ffffff" roughness={0.9} metalness={0.0} />
          </mesh>
        </group>
      </group>

      {/* ─── LEFT ARM (FLEXING BICEP) ─── */}
      <group position={[-0.28, 0.33, 0]}>
        {/* Deltoid muscle (Shoulder) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.095, 24, 24]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>
        {/* Flexing Upper Arm (Smooth Capsule) */}
        <group rotation={[0, 0, Math.PI / 5]}>
          <mesh position={[-0.10, 0.06, 0.01]} castShadow receiveShadow>
            <capsuleGeometry args={[0.06, 0.11, 4, 16]} />
            <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
          </mesh>
          {/* Big Peak Bicep Bulge */}
          <mesh position={[-0.10, 0.11, 0.02]} scale={[1.2, 1.4, 1.1]} castShadow receiveShadow>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
          </mesh>
        </group>
        {/* Forearm (Smooth Capsule) */}
        <group position={[-0.14, 0.14, 0.05]} rotation={[0.4, 0, -Math.PI / 4]}>
          <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.05, 0.11, 4, 16]} />
            <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
          </mesh>
          {/* Hand & Fingers wrapping handle */}
          <group position={[0, 0.18, 0]}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
            </mesh>
            {/* Thumb */}
            <mesh position={[-0.018, 0.01, 0.015]} rotation={[0, 0.4, 0]}>
              <boxGeometry args={[0.012, 0.025, 0.02]} />
              <meshStandardMaterial color="#f0b28a" />
            </mesh>
            {/* Fingers block wrapping */}
            <mesh position={[0.01, 0.0, 0.015]}>
              <boxGeometry args={[0.035, 0.03, 0.03]} />
              <meshStandardMaterial color="#f0b28a" />
            </mesh>
          </group>

          {/* Premium Heavy Dumbbell */}
          <group position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
            {/* Handle bar */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.25, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.95} />
            </mesh>
            {/* Left Weights Stack */}
            {/* Inner Plate */}
            <mesh position={[0, -0.06, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.025, 24]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Middle Glowing Ring Plate */}
            <mesh position={[0, -0.088, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.024, 24]} />
              <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.8} roughness={0.2} />
            </mesh>
            {/* Outer Heavy Plate */}
            <mesh position={[0, -0.115, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.026, 24]} />
              <meshStandardMaterial color="#090d16" roughness={0.5} metalness={0.8} />
            </mesh>
            {/* End Cap Nut */}
            <mesh position={[0, -0.13, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.95} />
            </mesh>

            {/* Right Weights Stack */}
            {/* Inner Plate */}
            <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.025, 24]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Middle Glowing Ring Plate */}
            <mesh position={[0, 0.088, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.024, 24]} />
              <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.8} roughness={0.2} />
            </mesh>
            {/* Outer Heavy Plate */}
            <mesh position={[0, 0.115, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.026, 24]} />
              <meshStandardMaterial color="#090d16" roughness={0.5} metalness={0.8} />
            </mesh>
            {/* End Cap Nut */}
            <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.95} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ─── RIGHT ARM (FLEXING BICEP) ─── */}
      <group position={[0.28, 0.33, 0]}>
        {/* Deltoid muscle (Shoulder) */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.095, 24, 24]} />
          <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
        </mesh>
        {/* Flexing Upper Arm (Smooth Capsule) */}
        <group rotation={[0, 0, -Math.PI / 5]}>
          <mesh position={[0.10, 0.06, 0.01]} castShadow receiveShadow>
            <capsuleGeometry args={[0.06, 0.11, 4, 16]} />
            <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
          </mesh>
          {/* Big Peak Bicep Bulge */}
          <mesh position={[0.10, 0.11, 0.02]} scale={[1.2, 1.4, 1.1]} castShadow receiveShadow>
            <sphereGeometry args={[0.045, 16, 16]} />
            <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
          </mesh>
        </group>
        {/* Forearm (Smooth Capsule) */}
        <group position={[0.14, 0.14, 0.05]} rotation={[0.4, 0, Math.PI / 4]}>
          <mesh position={[0, 0.09, 0]} castShadow receiveShadow>
            <capsuleGeometry args={[0.05, 0.11, 4, 16]} />
            <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
          </mesh>
          {/* Hand & Fingers wrapping handle */}
          <group position={[0, 0.18, 0]}>
            <mesh castShadow receiveShadow>
              <sphereGeometry args={[0.04, 12, 12]} />
              <meshStandardMaterial color="#f0b28a" roughness={0.55} metalness={0.1} />
            </mesh>
            {/* Thumb */}
            <mesh position={[0.018, 0.01, 0.015]} rotation={[0, -0.4, 0]}>
              <boxGeometry args={[0.012, 0.025, 0.02]} />
              <meshStandardMaterial color="#f0b28a" />
            </mesh>
            {/* Fingers block wrapping */}
            <mesh position={[-0.01, 0.0, 0.015]}>
              <boxGeometry args={[0.035, 0.03, 0.03]} />
              <meshStandardMaterial color="#f0b28a" />
            </mesh>
          </group>

          {/* Premium Heavy Dumbbell */}
          <group position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
            {/* Handle bar */}
            <mesh castShadow receiveShadow>
              <cylinderGeometry args={[0.015, 0.015, 0.25, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.95} />
            </mesh>
            {/* Left Weights Stack */}
            {/* Inner Plate */}
            <mesh position={[0, -0.06, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.025, 24]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Middle Glowing Ring Plate */}
            <mesh position={[0, -0.088, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.024, 24]} />
              <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.8} roughness={0.2} />
            </mesh>
            {/* Outer Heavy Plate */}
            <mesh position={[0, -0.115, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.026, 24]} />
              <meshStandardMaterial color="#090d16" roughness={0.5} metalness={0.8} />
            </mesh>
            {/* End Cap Nut */}
            <mesh position={[0, -0.13, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.95} />
            </mesh>

            {/* Right Weights Stack */}
            {/* Inner Plate */}
            <mesh position={[0, 0.06, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.09, 0.09, 0.025, 24]} />
              <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.6} />
            </mesh>
            {/* Middle Glowing Ring Plate */}
            <mesh position={[0, 0.088, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.11, 0.11, 0.024, 24]} />
              <meshStandardMaterial color="#00d4aa" emissive="#00d4aa" emissiveIntensity={0.8} roughness={0.2} />
            </mesh>
            {/* Outer Heavy Plate */}
            <mesh position={[0, 0.115, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.12, 0.12, 0.026, 24]} />
              <meshStandardMaterial color="#090d16" roughness={0.5} metalness={0.8} />
            </mesh>
            {/* End Cap Nut */}
            <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.025, 0.025, 0.01, 12]} />
              <meshStandardMaterial color="#cbd5e1" roughness={0.15} metalness={0.95} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ─── SHIELD / GYM PLATFORM BASE ─── */}
      <mesh position={[0, -0.71, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.32, 0.40, 0.08, 6]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Ground plane for receiving shadows below the base */}
      <mesh position={[0, -0.76, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <shadowMaterial transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// ─── Main Component wrapping R3F Canvas ───────────────────────────────────

interface MetalMascot3DProps {
  size?: 'sm' | 'md' | 'lg';
  showRing?: boolean;
  interactive?: boolean;
}

export function MetalMascot3D({
  size = 'md',
  showRing = true,
  interactive = false,
}: MetalMascot3DProps) {
  const sizeMap = {
    sm: { width: 44, height: 44, cameraZ: 2.8 },
    md: { width: 160, height: 160, cameraZ: 3.2 },
    lg: { width: 340, height: 340, cameraZ: 3.4 },
  };

  const current = sizeMap[size];

  return (
    <div
      style={{
        width: current.width,
        height: current.height,
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.15, current.cameraZ], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{
          width: '100%',
          height: '100%',
          background: 'transparent',
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
      >
        {/* Lights */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 8, 5]} 
          intensity={2.2} 
          color="#ffffff" 
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.001}
        />
        <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#00d4aa" />
        <pointLight position={[0, 0.5, 2]} intensity={1.2} color="#00d4aa" />

        {/* Mascot */}
        <MascotModel interactive={interactive} />

        {/* Pulsing ring inside scene */}
        {showRing && <LogoPulse />}
      </Canvas>
    </div>
  );
}

export default MetalMascot3D;
