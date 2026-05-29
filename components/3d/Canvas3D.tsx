'use client';

import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { motion } from 'framer-motion';

interface Canvas3DProps {
  children?: React.ReactNode;
  showControls?: boolean;
  cameraPosition?: [number, number, number];
  autoRotate?: boolean;
}

export function Canvas3D({
  children,
  showControls = true,
  cameraPosition = [0, 0, 5],
  autoRotate = true,
}: Canvas3DProps) {
  return (
    <motion.div
      className="canvas-3d-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Canvas
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #000000 0%, #111111 100%)',
        }}
        dpr={typeof window !== 'undefined' ? window.devicePixelRatio : 1}
      >
        <PerspectiveCamera makeDefault position={cameraPosition} />

        {/* Lighting setup */}
        <ambientLight intensity={0.6} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#DC2626" />

        {/* Stars background */}
        <Stars radius={100} depth={50} count={5000} factor={4} />

        {/* Render child components (3D models, etc) */}
        {children}

        {/* Orbit controls for interaction */}
        {showControls && <OrbitControls enableZoom autoRotate={autoRotate} />}
      </Canvas>

      <style jsx>{`
        .canvas-3d-container {
          width: 100%;
          height: 100%;
          position: relative;
        }
      `}</style>
    </motion.div>
  );
}
