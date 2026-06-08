'use client';

import React, { useState } from 'react';
import type { MuscleGroup } from './body-muscle-selector';

interface Props {
  selected: MuscleGroup;
  onSelect: (muscle: MuscleGroup) => void;
}

const MUSCLE_COLORS: Record<Exclude<MuscleGroup, 'All'>, string> = {
  Chest: '#00ffff',
  Back: '#00ff88',
  Shoulders: '#cc44ff',
  Arms: '#ff8800',
  Core: '#ffdd00',
  Legs: '#ff3344',
};

export function RealisticBody3D({ selected, onSelect }: Props) {
  const [hoveredGroup, setHoveredGroup] = useState<MuscleGroup | null>(null);

  const getThemeColor = () => {
    if (hoveredGroup && hoveredGroup !== 'All') return MUSCLE_COLORS[hoveredGroup];
    if (selected && selected !== 'All') return MUSCLE_COLORS[selected as Exclude<MuscleGroup, 'All'>];
    return '#00d4aa';
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 select-none relative">
      <div className="w-full h-[460px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#07090e] to-[#030406] border border-white/10 shadow-2xl relative">
        <iframe
          title="Ecorche Male Anatomy"
          className="w-full h-full border-none opacity-90 hover:opacity-100 transition-opacity duration-300"
          src="https://sketchfab.com/models/33162ec759e04d2985dbbdf4ec908d66/embed?autostart=1&preload=1&ui_controls=0&ui_infos=0&ui_inspector=0&ui_stop=0&ui_watermark=0&ui_hint=0&ui_ar=0&ui_help=0&ui_vr=0&ui_fullscreen=0&ui_settings=0&transparent=1&dpr=2"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        />
      </div>

      <div className="w-full text-right px-1">
        <a 
          href="https://sketchfab.com/3d-models/ecorche-male-musclenames-anatomy-33162ec759e04d2985dbbdf4ec908d66"
          target="_blank" 
          rel="noopener noreferrer"
          className="text-[9px] text-white/20 hover:text-white/40 font-mono transition-colors duration-200"
        >
          Model by Sketchfab | CC Attribution
        </a>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {(Object.keys(MUSCLE_COLORS) as Exclude<MuscleGroup, 'All'>[]).map((muscle) => {
          const isActive = selected === muscle;
          const isHovered = hoveredGroup === muscle;
          return (
            <button
              key={muscle}
              onClick={() => onSelect(isActive ? 'All' : muscle)}
              onMouseEnter={() => setHoveredGroup(muscle)}
              onMouseLeave={() => setHoveredGroup(null)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-300 backdrop-blur-md cursor-pointer"
              style={
                isActive
                  ? { borderColor: MUSCLE_COLORS[muscle], background: `${MUSCLE_COLORS[muscle]}18`, color: MUSCLE_COLORS[muscle], boxShadow: `0 0 10px ${MUSCLE_COLORS[muscle]}25` }
                  : isHovered
                  ? { borderColor: `${MUSCLE_COLORS[muscle]}60`, background: 'rgba(255,255,255,0.03)', color: '#ffffff' }
                  : { borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.15)', color: 'rgba(255,255,255,0.5)' }
              }
            >
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: MUSCLE_COLORS[muscle], boxShadow: `0 0 8px ${MUSCLE_COLORS[muscle]}` }} />
              {muscle}
            </button>
          );
        })}
      </div>
    </div>
  );
}
