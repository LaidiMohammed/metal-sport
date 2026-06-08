'use client';

import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';
import type { Exercise } from '@/lib/exercises-data';

const CATEGORY_COLORS: Record<string, string> = {
  default: '#c45850',
  Chest: '#e85050',
  Back: '#50c8e8',
  Legs: '#50e870',
  Shoulders: '#e8c850',
  Arms: '#e88050',
  Core: '#c850e8',
};

type ExerciseAnimationType = 'press' | 'pull' | 'squat' | 'raise' | 'curl' | 'crunch' | 'swing' | 'lunge' | 'hold' | 'rotate';

const EXERCISE_ANIMATION_MAP: Record<string, ExerciseAnimationType> = {
  default: 'hold',
  'Barbell Bench Press': 'press',
  'Incline Dumbbell Press': 'press',
  'Decline Bench Press': 'press',
  'Dumbbell Flyes': 'press',
  'Cable Crossover': 'press',
  'Push-Ups': 'press',
  'Diamond Push-Ups': 'press',
  'Chest Dip': 'press',
  'Machine Chest Press': 'press',
  'Pec Deck Fly': 'press',
  'Floor Press': 'press',
  'Svend Press': 'press',
  'Incline Fly': 'press',
  'Close-Grip Bench Press': 'press',
  'Deadlift': 'pull',
  'Pull-Ups': 'pull',
  'Chin-Ups': 'pull',
  'Barbell Row': 'pull',
  'Dumbbell Row': 'pull',
  'T-Bar Row': 'pull',
  'Lat Pulldown': 'pull',
  'Seated Cable Row': 'pull',
  'Straight-Arm Pulldown': 'pull',
  'Face Pull': 'pull',
  'Barbell Shrug': 'raise',
  'Inverted Row': 'pull',
  'Back Extension': 'swing',
  'Renegade Row': 'pull',
  'Barbell Squat': 'squat',
  'Front Squat': 'squat',
  'Goblet Squat': 'squat',
  'Bulgarian Split Squat': 'lunge',
  'Leg Press': 'press',
  'Leg Extension': 'press',
  'Leg Curl': 'curl',
  'Romanian Deadlift': 'pull',
  'Walking Lunge': 'lunge',
  'Reverse Lunge': 'lunge',
  'Step-Up': 'squat',
  'Hip Thrust': 'press',
  'Glute Bridge': 'press',
  'Standing Calf Raise': 'raise',
  'Seated Calf Raise': 'raise',
  'Box Jump': 'squat',
  'Sumo Squat': 'squat',
  'Wall Sit': 'hold',
  'Overhead Press': 'press',
  'Arnold Press': 'press',
  'Lateral Raise': 'raise',
  'Front Raise': 'raise',
  'Reverse Fly': 'pull',
  'Upright Row': 'pull',
  'Push Press': 'press',
  'Landmine Press': 'press',
  'Plate Front Raise': 'raise',
  'Cable Lateral Raise': 'raise',
  'Barbell Curl': 'curl',
  'Dumbbell Hammer Curl': 'curl',
  'Preacher Curl': 'curl',
  'Concentration Curl': 'curl',
  'Cable Curl': 'curl',
  'Incline Dumbbell Curl': 'curl',
  'Tricep Pushdown': 'press',
  'Overhead Tricep Extension': 'press',
  'Skull Crusher': 'press',
  'Tricep Dip': 'press',
  'Tricep Kickback': 'press',
  'Reverse Curl': 'curl',
  'Wrist Curl': 'curl',
  'Farmer Walk': 'hold',
  'Hanging Knee Raise': 'curl',
  'Plank': 'hold',
  'Crunch': 'crunch',
  'Leg Raise': 'raise',
  'Russian Twist': 'rotate',
  'Bicycle Crunch': 'rotate',
  'Cable Crunch': 'crunch',
  'Ab Wheel Rollout': 'crunch',
  'Side Plank': 'hold',
  'V-Up': 'crunch',
  'Pallof Press': 'hold',
  'Mountain Climber': 'crunch',
  'Dead Bug': 'crunch',
  'Hanging Leg Raise': 'raise',
  'Clean and Press': 'press',
  'Kettlebell Swing': 'swing',
  'Turkish Get-Up': 'squat',
  'Thruster': 'squat',
  'Burpee': 'squat',
  'Dumbbell Snatch': 'raise',
  'Bear Crawl': 'hold',
  'Pistol Squat': 'squat',
  'Handstand Push-Up': 'press',
  'Muscle-Up': 'pull',
  'Zercher Squat': 'squat',
  'Cossack Squat': 'squat',
  'Single-Arm Dumbbell Push Press': 'press',
  'TRX Row': 'pull',
  'Medicine Ball Slam': 'swing',
  'Resistance Band Pull-Apart': 'pull',
  'Band Pull-Through': 'pull',
  'Dumbbell Pullover': 'pull',
  'Sissy Squat': 'squat',
  'Windshield Wiper': 'rotate',
  'JM Press': 'press',
  'Spider Curl': 'curl',
  'Bent-Over Two-Arm Dumbbell Row': 'pull',
  'Medicine Ball Rotational Throw': 'rotate',
  'Single-Leg Romanian Deadlift': 'pull',
  'Cross-Body Dumbbell Curl': 'curl',
};

function getAnimationType(exerciseName: string): ExerciseAnimationType {
  return EXERCISE_ANIMATION_MAP[exerciseName] || EXERCISE_ANIMATION_MAP.default;
}

interface MovementConfig {
  rotX: { amp: number; speed: number; offset: number };
  rotY: { amp: number; speed: number; offset: number };
  rotZ: { amp: number; speed: number; offset: number };
  posY: { amp: number; speed: number; offset: number };
  swayX: { amp: number; speed: number; offset: number };
  scaleX: { amp: number; speed: number };
  label: string;
}

const MOVEMENT_PRESETS: Record<ExerciseAnimationType, MovementConfig> = {
  press: {
    rotX: { amp: 0.08, speed: 0.8, offset: 0 },
    rotY: { amp: 0.12, speed: 0.15, offset: 1.2 },
    posY: { amp: 0.03, speed: 0.8, offset: 0 },
    rotZ: { amp: 0, speed: 0, offset: 0 },
    swayX: { amp: 0.02, speed: 1.6, offset: 0.5 },
    scaleX: { amp: 0.005, speed: 0.8 },
    label: 'Pressing',
  },
  pull: {
    rotX: { amp: -0.08, speed: 0.7, offset: 0.3 },
    rotY: { amp: 0.15, speed: 0.15, offset: 1.5 },
    posY: { amp: 0.02, speed: 0.7, offset: 0.3 },
    rotZ: { amp: 0, speed: 0, offset: 0 },
    swayX: { amp: 0.03, speed: 1.4, offset: 1 },
    scaleX: { amp: 0.004, speed: 0.7 },
    label: 'Pulling',
  },
  squat: {
    rotX: { amp: 0.02, speed: 0.9, offset: 0 },
    rotY: { amp: 0.1, speed: 0.12, offset: 2 },
    posY: { amp: 0.15, speed: 0.9, offset: 0 },
    rotZ: { amp: 0, speed: 0, offset: 0 },
    swayX: { amp: 0.01, speed: 1.8, offset: 0.5 },
    scaleX: { amp: 0.01, speed: 0.9 },
    label: 'Squatting',
  },
  raise: {
    rotX: { amp: 0.06, speed: 0.75, offset: 0.2 },
    rotY: { amp: 0.1, speed: 0.1, offset: 1 },
    posY: { amp: 0.05, speed: 0.75, offset: 0.2 },
    rotZ: { amp: 0, speed: 0, offset: 0 },
    swayX: { amp: 0.02, speed: 1.5, offset: 0 },
    scaleX: { amp: 0.006, speed: 0.75 },
    label: 'Raising',
  },
  curl: {
    rotX: { amp: 0.04, speed: 1, offset: 0 },
    rotY: { amp: 0.08, speed: 0.1, offset: 1.5 },
    posY: { amp: 0.02, speed: 1, offset: 0 },
    rotZ: { amp: 0.06, speed: 1, offset: 0.5 },
    swayX: { amp: 0.015, speed: 2, offset: 0.3 },
    scaleX: { amp: 0.003, speed: 1 },
    label: 'Curling',
  },
  crunch: {
    rotX: { amp: 0.15, speed: 0.85, offset: 0 },
    rotY: { amp: 0.08, speed: 0.1, offset: 2 },
    posY: { amp: 0.04, speed: 0.85, offset: 0.3 },
    rotZ: { amp: 0, speed: 0, offset: 0 },
    swayX: { amp: 0.01, speed: 1.7, offset: 0.8 },
    scaleX: { amp: 0.008, speed: 0.85 },
    label: 'Crunching',
  },
  swing: {
    rotX: { amp: 0.1, speed: 0.95, offset: 0 },
    rotY: { amp: 0.2, speed: 0.95, offset: 0.5 },
    posY: { amp: 0.06, speed: 0.95, offset: 0 },
    rotZ: { amp: 0.04, speed: 0.95, offset: 1 },
    swayX: { amp: 0.08, speed: 0.95, offset: 0.7 },
    scaleX: { amp: 0.01, speed: 0.95 },
    label: 'Swinging',
  },
  lunge: {
    rotX: { amp: 0.05, speed: 0.6, offset: 0 },
    rotY: { amp: 0.12, speed: 0.1, offset: 1.5 },
    posY: { amp: 0.18, speed: 0.6, offset: 0 },
    rotZ: { amp: 0.03, speed: 0.6, offset: 0.5 },
    swayX: { amp: 0.06, speed: 0.6, offset: 0.8 },
    scaleX: { amp: 0.012, speed: 0.6 },
    label: 'Lunging',
  },
  hold: {
    rotX: { amp: 0.01, speed: 0.3, offset: 0 },
    rotY: { amp: 0.15, speed: 0.08, offset: 2 },
    posY: { amp: 0.01, speed: 0.3, offset: 0 },
    rotZ: { amp: 0, speed: 0, offset: 0 },
    swayX: { amp: 0.005, speed: 0.6, offset: 0 },
    scaleX: { amp: 0, speed: 0 },
    label: 'Holding',
  },
  rotate: {
    rotX: { amp: 0.1, speed: 0.7, offset: 0 },
    rotY: { amp: 0.25, speed: 0.7, offset: 0.8 },
    posY: { amp: 0.02, speed: 0.7, offset: 0.2 },
    rotZ: { amp: 0.06, speed: 0.7, offset: 0.5 },
    swayX: { amp: 0.04, speed: 1.4, offset: 0.3 },
    scaleX: { amp: 0.007, speed: 0.7 },
    label: 'Rotating',
  },
};

const EQUIPMENT_EMOJIS: Record<string, string> = {
  Barbell: '🏋️',
  Dumbbells: '🏋️',
  Bodyweight: '💪',
  Machine: '⚙️',
  Cable: '🪢',
  Kettlebell: '🔔',
  'EZ Bar': '🏋️',
  'Pull-up Bar': '🤸',
  'Ab Wheel': '⚙️',
  Plate: '🏋️',
  'Medicine Ball': '💣',
  'Resistance Bands': '🔄',
  TRX: '🪢',
};

const EXERCISE_EQUIPMENT_OBJECTS: Record<string, string> = {};

function AnimatingBody({ exercise }: { exercise: Exercise }) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF('/models/body.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const timeRef = useRef(0);
  const animType = getAnimationType(exercise.name);
  const config = MOVEMENT_PRESETS[animType];
  const pulseColor = new THREE.Color(CATEGORY_COLORS[exercise.category] || CATEGORY_COLORS.default);

  useEffect(() => {
    if (!clone) return;
    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        meshRef.current = child;
        child.material = new THREE.MeshStandardMaterial({
          color: new THREE.Color('#8a3830'),
          emissive: pulseColor,
          emissiveIntensity: 0.08,
          metalness: 0.2,
          roughness: 0.55,
        });
        child.castShadow = true;
      }
    });
  }, [clone, pulseColor]);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (groupRef.current) {
      const rx = Math.sin(t * config.rotX.speed + config.rotX.offset) * config.rotX.amp;
      const ry = t * config.rotY.speed + config.rotY.offset;
      const rz = Math.sin(t * config.rotZ.speed + config.rotZ.offset) * config.rotZ.amp;
      const py = Math.sin(t * config.posY.speed + config.posY.offset) * config.posY.amp;
      const sx = 1 + Math.sin(t * config.swayX.speed + config.swayX.offset) * config.swayX.amp;
      const scaleExtraX = Math.sin(t * config.scaleX.speed) * config.scaleX.amp;

      groupRef.current.position.y = -0.6 + py;

      const pivotX = 0;
      const pivotZ = 0.3;
      groupRef.current.position.x = pivotX + Math.sin(t * config.swayX.speed + config.swayX.offset) * config.swayX.amp * 0.3;

      const euler = new THREE.Euler(rx, ry, rz, 'YXZ');
      groupRef.current.quaternion.setFromEuler(euler);

      const animScale = 1.1 + scaleExtraX;
      groupRef.current.scale.setScalar(animScale);
    }

    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial;
      const pulse = 0.08 + Math.sin(t * 0.6) * 0.06;
      mat.emissiveIntensity = pulse;
      mat.emissive.lerp(pulseColor, 0.02);
    }
  });

  return <primitive ref={groupRef} object={clone} scale={1.1} position={[0, -0.6, 0]} />;
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#c45850" wireframe />
    </mesh>
  );
}

function Scene({ exercise }: { exercise: Exercise }) {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffccbb" />
      <directionalLight position={[4, 8, 5]} intensity={0.7} color="#ffeedd" />
      <directionalLight position={[-3, 5, -4]} intensity={0.3} color="#6688ff" />
      <pointLight position={[0, 2, 3]} intensity={0.5} color="#ff8866" />
      <hemisphereLight intensity={0.12} color="#ffccbb" groundColor="#0a0a1a" />
      <React.Suspense fallback={<LoadingFallback />}>
        <AnimatingBody exercise={exercise} />
      </React.Suspense>
      <OrbitControls
        enablePan={false} enableZoom={true}
        minDistance={1.8} maxDistance={4.5}
        autoRotate autoRotateSpeed={0.2}
        target={[0, 0.4, 0]}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 1.8}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.3, 0]}>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#06060e" transparent opacity={0.6} />
      </mesh>
    </>
  );
}

interface Exercise3DViewerProps {
  exercise: Exercise;
}

export function Exercise3DViewer({ exercise }: Exercise3DViewerProps) {
  const animType = getAnimationType(exercise.name);
  const config = MOVEMENT_PRESETS[animType];
  const accent = CATEGORY_COLORS[exercise.category] || CATEGORY_COLORS.default;
  const equipEmoji = EQUIPMENT_EMOJIS[exercise.equipment] || '🏋️';

  return (
    <div className="w-full h-[400px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#06060e] to-[#020206] border border-white/[0.06] shadow-2xl relative">
      <Canvas camera={{ position: [0, 0.3, 2.5], fov: 30 }}>
        <color attach="background" args={['#06060e']} />
        <Scene exercise={exercise} />
      </Canvas>
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{exercise.category}</span>
        </div>
        <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] flex items-center gap-1.5">
          <span className="text-[10px]">{equipEmoji}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/60">{exercise.equipment}</span>
        </div>
      </div>
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08]">
          <span className="text-[10px] font-bold text-white/80">{exercise.name}</span>
        </div>
      </div>
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/[0.06] flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent, boxShadow: `0 0 6px ${accent}` }} />
        <span className="text-[9px] font-semibold text-white/50 tracking-wider uppercase">{config.label} · Drag to inspect</span>
      </div>
    </div>
  );
}
