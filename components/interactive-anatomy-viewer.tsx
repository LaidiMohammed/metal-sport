'use client';

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { CATEGORY_COLORS } from '@/lib/muscle-mapping';

// Each mesh → detailed sub-group name
const MESH_SUBGROUP: Record<string, string> = {
  MUSCLE_PECS: 'Pectorals',
  MUSCLE_LAT_1: 'Lats', MUSCLE_LAT_2: 'Lats',
  MUSCLE_TRAP_1: 'Traps', MUSCLE_TRAP_2: 'Traps',
  MUSCLE_DELTS: 'Deltoids',
  MUSCLE_BICEPS: 'Biceps', MUSCLE_TRICEPS: 'Triceps', MUSCLE_FOREARMS: 'Forearms',
  MUSCLE_ABS: 'Abs',
  MUSCLE_QUAD_1: 'Quads', MUSCLE_QUAD_2: 'Quads',
  MUSCLE_HAM_1: 'Hamstrings', MUSCLE_HAM_2: 'Hamstrings',
  MUSCLE_GLUTE_1: 'Glutes', MUSCLE_GLUTE_2: 'Glutes',
  MUSCLE_CALF_1: 'Calves', MUSCLE_CALF_2: 'Calves',
};

// Each sub-group → parent category for exercise filtering
const SUBGROUP_TO_PARENT: Record<string, string> = {
  Pectorals: 'Chest',
  Lats: 'Back', Traps: 'Back',
  Deltoids: 'Shoulders',
  Biceps: 'Arms', Triceps: 'Arms', Forearms: 'Arms',
  Abs: 'Core',
  Quads: 'Legs', Hamstrings: 'Legs', Glutes: 'Legs', Calves: 'Legs',
};

const ALL_PARENT_CATEGORIES = ['Chest', 'Back', 'Shoulders', 'Arms', 'Core', 'Legs'];

// Sub-groups listed under each parent for the detail legend
const PARENT_SUBGROUPS: Record<string, string[]> = {
  Chest: ['Pectorals'],
  Back: ['Lats', 'Traps'],
  Shoulders: ['Deltoids'],
  Arms: ['Biceps', 'Triceps', 'Forearms'],
  Core: ['Abs'],
  Legs: ['Quads', 'Hamstrings', 'Glutes', 'Calves'],
};

function createMuscleMat(color = '#8a3830'): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color,
    emissive: '#3a1810',
    emissiveIntensity: 0.06,
    metalness: 0.3,
    roughness: 0.45,
    clearcoat: 0.15,
    clearcoatRoughness: 0.3,
    reflectivity: 0.5,
    envMapIntensity: 0.6,
  });
}

const BODY_MAT = new THREE.MeshPhysicalMaterial({
  color: '#16121a',
  metalness: 0.1,
  roughness: 0.85,
  clearcoat: 0.05,
});

function MuscleModel({
  selectedSubGroup,
  onSelectSubGroup,
  hoveredSubGroup,
  setHoveredSubGroup,
}: {
  selectedSubGroup: string | null;
  onSelectSubGroup: (sg: string | null) => void;
  hoveredSubGroup: string | null;
  setHoveredSubGroup: (sg: string | null) => void;
}) {
  const { scene } = useGLTF('/models/bodyMuscles.glb');
  const clone = useMemo(() => scene.clone(true), [scene]);
  const groupRef = useRef<THREE.Group>(null);
  const [ready, setReady] = useState(false);

  useMemo(() => {
    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const sg = MESH_SUBGROUP[child.name];
      if (sg) {
        child.material = createMuscleMat();
        child.userData.subGroup = sg;
        child.userData.parentCategory = SUBGROUP_TO_PARENT[sg];
        child.castShadow = true;
        child.receiveShadow = true;
      } else if (child.name === 'BODY') {
        child.material = BODY_MAT;
        child.castShadow = true;
        child.receiveShadow = true;
      } else {
        child.visible = false;
      }
    });
    setReady(true);
  }, [clone]);

  useMemo(() => {
    if (!ready) return;

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      const sg = child.userData.subGroup as string | undefined;
      if (!sg) return;
      const mat = child.material as THREE.MeshPhysicalMaterial;
      const parent = SUBGROUP_TO_PARENT[sg];

      // Dim non-selected groups when something is selected
      if (selectedSubGroup && sg !== selectedSubGroup) {
        mat.color.set('#2a1510');
        mat.emissive.set('#1a0a08');
        mat.emissiveIntensity = 0.01;
        mat.opacity = 0.2;
        mat.transparent = true;
        mat.roughness = 0.7;
        mat.clearcoat = 0;
      } else {
        mat.color.set('#8a3830');
        mat.emissive.set('#3a1810');
        mat.emissiveIntensity = 0.06;
        mat.opacity = 1;
        mat.transparent = false;
        mat.roughness = 0.45;
        mat.clearcoat = 0.15;
      }

      // Highlight hovered or selected sub-group
      if (hoveredSubGroup === sg || selectedSubGroup === sg) {
        const color = new THREE.Color(CATEGORY_COLORS[parent] || '#ffffff');
        mat.color.copy(color);
        mat.emissive.copy(color);
        mat.emissiveIntensity = sg === selectedSubGroup ? 0.4 : 0.25;
        mat.opacity = 1;
        mat.transparent = false;
        mat.clearcoat = 0.3;
        mat.roughness = 0.3;
      }
    });
  }, [selectedSubGroup, hoveredSubGroup, ready]);

  const handleClick = useCallback((e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    const sg = mesh.userData.subGroup as string | undefined;
    if (sg) onSelectSubGroup(sg === selectedSubGroup ? null : sg);
  }, [selectedSubGroup, onSelectSubGroup]);

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const mesh = e.object as THREE.Mesh;
    const sg = mesh.userData.subGroup as string | undefined;
    if (sg) setHoveredSubGroup(sg);
    document.body.style.cursor = 'pointer';
  }, [setHoveredSubGroup]);

  const handlePointerOut = useCallback(() => {
    setHoveredSubGroup(null);
    document.body.style.cursor = 'default';
  }, [setHoveredSubGroup]);

  return (
    <group ref={groupRef}>
      <primitive
        object={clone}
        scale={1.5}
        position={[0, -0.65, 0]}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      />
    </group>
  );
}

function ZoomControls({ controlsRef }: { controlsRef: React.MutableRefObject<any> }) {
  const zoom = (dir: number) => {
    if (!controlsRef.current) return;
    const c = controlsRef.current;
    const dirVec = c.object.position.clone().sub(c.target).normalize();
    const d = c.object.position.distanceTo(c.target);
    const factor = dir > 0 ? 0.8 : 1.25;
    const newD = Math.max(0.8, Math.min(5.0, d * factor));
    const startPos = c.object.position.clone();
    const endPos = c.target.clone().add(dirVec.multiplyScalar(newD));
    const duration = 200;
    const t0 = performance.now();
    function animate(t: number) {
      const p = Math.min(1, (t - t0) / duration);
      const ease = 1 - Math.pow(1 - p, 3);
      c.object.position.lerpVectors(startPos, endPos, ease);
      c.update();
      if (p < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  };

  return (
    <div className="absolute bottom-3 right-3 z-20 flex flex-col gap-1.5">
      <button onClick={() => zoom(1)} className="w-8 h-8 bg-black/70 backdrop-blur-md rounded-lg border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
      <button onClick={() => zoom(-1)} className="w-8 h-8 bg-black/70 backdrop-blur-md rounded-lg border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:bg-black/90 transition">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
      </button>
    </div>
  );
}

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshPhysicalMaterial color="#c45850" wireframe metalness={0.5} roughness={0.2} />
    </mesh>
  );
}

export function InteractiveAnatomyViewer({
  selectedCategory,
  onSelectCategory,
}: {
  selectedCategory: string | null;
  onSelectCategory: (c: string | null) => void;
}) {
  const [hoveredSubGroup, setHoveredSubGroup] = useState<string | null>(null);
  const [selectedSubGroup, setSelectedSubGroup] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);

  // Derive active parent from selected sub-group
  const activeParent = selectedSubGroup ? SUBGROUP_TO_PARENT[selectedSubGroup] : null;
  const hoveredParent = hoveredSubGroup ? SUBGROUP_TO_PARENT[hoveredSubGroup] : null;

  const displayName = selectedSubGroup || hoveredSubGroup || 'Full Body';
  const displayParent = selectedCategory || activeParent || hoveredParent || null;
  const accent = displayParent ? CATEGORY_COLORS[displayParent] : '#c45850';

  const handleSelectSubGroup = useCallback((sg: string | null) => {
    setSelectedSubGroup(sg);
    onSelectCategory(sg ? SUBGROUP_TO_PARENT[sg] : null);
  }, [onSelectCategory]);

  return (
    <div className="w-full h-[420px] sm:h-[520px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#06060e] to-[#020206] border border-white/[0.06] shadow-2xl relative">
      <Canvas camera={{ position: [0, 0.0, 2.8], fov: 42 }}>
        <color attach="background" args={['#08060e']} />
        <ambientLight intensity={0.3} color="#ffddcc" />
        <directionalLight position={[6, 10, 8]} intensity={1.2} color="#ffeee0" />
        <directionalLight position={[-5, 7, -6]} intensity={0.5} color="#8899ff" />
        <directionalLight position={[0, -3, 4]} intensity={0.25} color="#4466aa" />
        <pointLight position={[0, 4, 3]} intensity={0.3} color="#ff8866" />
        <hemisphereLight intensity={0.1} color="#ffccbb" groundColor="#0a0a1a" />
        <React.Suspense fallback={<LoadingFallback />}>
          <MuscleModel
            selectedSubGroup={selectedSubGroup}
            onSelectSubGroup={handleSelectSubGroup}
            hoveredSubGroup={hoveredSubGroup}
            setHoveredSubGroup={setHoveredSubGroup}
          />
          <Environment preset="studio" />
        </React.Suspense>
        <ContactShadows position={[0, -0.85, 0]} opacity={0.35} scale={4} blur={2.5} far={1.5} />
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          zoomSpeed={0.8}
          minDistance={1.0}
          maxDistance={5.0}
          autoRotate={!hoveredSubGroup && !selectedSubGroup}
          autoRotateSpeed={0.35}
          target={[0, 0.15, 0]}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>

      {/* Top-left badge */}
      <div className="absolute top-3 left-3 z-10">
        <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/[0.08] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-white/70">{displayName}</span>
        </div>
      </div>

      {/* Right-side legend: parent categories with expandable sub-groups */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        {ALL_PARENT_CATEGORIES.map((parent) => {
          const isParentActive = parent === activeParent;
          const isParentHovered = parent === hoveredParent;
          const color = CATEGORY_COLORS[parent];
          const subs = PARENT_SUBGROUPS[parent];
          return (
            <div key={parent} className="relative">
              {/* Parent button */}
              <button
                onClick={() => {
                  // If clicking the same parent, toggle off
                  if (activeParent === parent) { setSelectedSubGroup(null); onSelectCategory(null); }
                  else { setSelectedSubGroup(subs[0]); onSelectCategory(parent); }
                }}
                onMouseEnter={() => setHoveredSubGroup(subs[0])}
                onMouseLeave={() => setHoveredSubGroup(null)}
                className={`
                  flex items-center gap-2 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-wider rounded-md transition-all duration-200
                  backdrop-blur-sm border w-full
                  ${isParentActive
                    ? 'bg-black/85 text-white shadow-lg'
                    : isParentHovered
                      ? 'bg-black/65 text-white/80'
                      : 'bg-black/40 text-white/40 hover:text-white/70'
                  }
                `}
                style={{
                  borderColor: isParentActive || isParentHovered ? `${color}60` : 'rgba(255,255,255,0.04)',
                  boxShadow: isParentActive ? `0 0 12px ${color}30` : undefined,
                }}
              >
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 4px ${color}` }} />
                {parent}
              </button>

              {/* Sub-group pills when parent is active or hovered */}
              {(isParentActive || isParentHovered) && subs.length > 1 && (
                <div className="flex flex-wrap gap-1 mt-1 ml-1">
                  {subs.map((sub) => {
                    const isSubActive = selectedSubGroup === sub;
                    const isSubHovered = hoveredSubGroup === sub;
                    return (
                      <button
                        key={sub}
                        onClick={() => setSelectedSubGroup(isSubActive ? null : sub)}
                        onMouseEnter={() => setHoveredSubGroup(sub)}
                        onMouseLeave={() => setHoveredSubGroup(null)}
                        className={`
                          text-[8px] font-semibold uppercase tracking-wider rounded px-1.5 py-0.5 transition-all border
                          ${isSubActive
                            ? 'bg-black/80 text-white border-white/20'
                            : isSubHovered
                              ? 'bg-black/60 text-white/80 border-white/10'
                              : 'bg-black/30 text-white/50 border-transparent hover:text-white/70'
                          }
                        `}
                        style={{
                          borderColor: isSubActive || isSubHovered ? `${color}40` : undefined,
                        }}
                      >
                        {sub}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Zoom controls */}
      <ZoomControls controlsRef={controlsRef} />

      {/* Bottom hint */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/[0.06]">
        <span className="text-[9px] font-semibold text-white/40 tracking-wider uppercase">
          {selectedSubGroup ? 'Click again to deselect' : 'Click a muscle group'}
        </span>
      </div>
    </div>
  );
}
