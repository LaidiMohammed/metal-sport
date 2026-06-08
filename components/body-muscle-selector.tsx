'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export type MuscleGroup = 'All' | 'Chest' | 'Back' | 'Legs' | 'Arms' | 'Shoulders' | 'Core';

interface Props {
  selected: MuscleGroup;
  onSelect: (muscle: MuscleGroup) => void;
}

const MUSCLE_CONFIG: Record<Exclude<MuscleGroup, 'All'>, { color: string; label: string }> = {
  Chest:     { color: '#06b6d4', label: 'Chest' },
  Back:      { color: '#22c55e', label: 'Back' },
  Shoulders: { color: '#a855f7', label: 'Shoulders' },
  Arms:      { color: '#f97316', label: 'Arms' },
  Core:      { color: '#eab308', label: 'Core' },
  Legs:      { color: '#ef4444', label: 'Legs' },
};

export function BodyMuscleSelector({ selected, onSelect }: Props) {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [hovered, setHovered] = useState<MuscleGroup | null>(null);

  const handleClick = (muscle: MuscleGroup) => {
    onSelect(selected === muscle ? 'All' : muscle);
  };

  const getColor = (muscle: Exclude<MuscleGroup, 'All'>) =>
    MUSCLE_CONFIG[muscle].color;

  const getFill = (muscle: Exclude<MuscleGroup, 'All'>) => {
    if (hovered === muscle) return getColor(muscle);
    if (selected === muscle) return getColor(muscle);
    if (selected === 'All') return getColor(muscle);
    return '#1e293b';
  };

  const getOpacity = (muscle: Exclude<MuscleGroup, 'All'>) => {
    if (hovered === muscle) return 0.95;
    if (selected === muscle) return 0.88;
    if (selected === 'All') return 0.55;
    return 0.18;
  };

  const getGlow = (muscle: Exclude<MuscleGroup, 'All'>) => {
    if (hovered === muscle || selected === muscle) {
      return `drop-shadow(0 0 8px ${getColor(muscle)}) drop-shadow(0 0 16px ${getColor(muscle)}60)`;
    }
    if (selected === 'All') return `drop-shadow(0 0 3px ${getColor(muscle)}50)`;
    return 'none';
  };

  const muscleProps = (muscle: Exclude<MuscleGroup, 'All'>) => ({
    fill: getFill(muscle),
    fillOpacity: getOpacity(muscle),
    stroke: getColor(muscle),
    strokeWidth: (selected === muscle || hovered === muscle) ? 1.5 : 0.8,
    strokeOpacity: (selected === muscle || hovered === muscle) ? 1 : 0.35,
    style: {
      cursor: 'pointer',
      filter: getGlow(muscle),
      transition: 'fill 0.25s ease, fill-opacity 0.25s ease, stroke-width 0.2s ease',
    },
    onClick: () => handleClick(muscle),
    onMouseEnter: () => setHovered(muscle),
    onMouseLeave: () => setHovered(null),
  });

  return (
    <div className="flex flex-col items-center gap-5 w-full select-none">
      {/* Front / Back toggle */}
      <div className="flex bg-black/30 rounded-full p-1 border border-white/10 gap-1">
        {(['front', 'back'] as const).map((v) => (
          <motion.button
            key={v}
            onClick={() => setView(v)}
            className={`relative px-5 py-1.5 rounded-full text-xs font-semibold transition-colors z-10 ${
              view === v ? 'text-black' : 'text-foreground/50 hover:text-foreground/80'
            }`}
          >
            {view === v && (
              <motion.div
                layoutId="view-pill"
                className="absolute inset-0 bg-accent rounded-full -z-10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </motion.button>
        ))}
      </div>

      {/* SVG Body */}
      <div className="relative flex items-center justify-center">
        <svg
          viewBox="0 0 200 430"
          width="190"
          height="400"
          xmlns="http://www.w3.org/2000/svg"
          className="overflow-visible drop-shadow-2xl"
        >
          <defs>
            <radialGradient id="bodyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="1" />
            </radialGradient>
          </defs>

          {/* ── Body silhouette ── */}
          <g opacity="0.12" fill="#94a3b8">
            {/* Head */}
            <circle cx="100" cy="28" r="22" />
            {/* Neck */}
            <rect x="90" y="49" width="20" height="18" rx="4" />
            {/* Torso */}
            <path d="M62,67 Q100,60 138,67 L145,200 Q100,210 55,200 Z" />
            {/* Left upper arm */}
            <path d="M62,78 Q44,84 28,158 L40,162 Q56,92 72,86 Z" />
            {/* Right upper arm */}
            <path d="M138,78 Q156,84 172,158 L160,162 Q144,92 128,86 Z" />
            {/* Left leg */}
            <path d="M62,200 Q52,228 56,378 L82,380 Q86,228 90,202 Z" />
            {/* Right leg */}
            <path d="M138,200 Q148,228 144,378 L118,380 Q114,228 110,202 Z" />
          </g>

          {/* ── FRONT VIEW ── */}
          <AnimatePresence mode="wait">
            {view === 'front' && (
              <motion.g
                key="front"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Head */}
                <circle cx="100" cy="28" r="20" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                {/* Neck */}
                <rect x="91" y="48" width="18" height="16" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />

                {/* === SHOULDERS === */}
                {/* Left deltoid */}
                <ellipse cx="50" cy="84" rx="20" ry="14" {...muscleProps('Shoulders')} />
                {/* Right deltoid */}
                <ellipse cx="150" cy="84" rx="20" ry="14" {...muscleProps('Shoulders')} />
                {/* Trapezius */}
                <path d="M92,50 L108,50 L136,74 L118,82 L100,78 L82,82 L64,74 Z" {...muscleProps('Shoulders')} />

                {/* === CHEST === */}
                {/* Left pec */}
                <ellipse cx="82" cy="106" rx="20" ry="24" {...muscleProps('Chest')} />
                {/* Right pec */}
                <ellipse cx="118" cy="106" rx="20" ry="24" {...muscleProps('Chest')} />

                {/* === ARMS === */}
                {/* Left bicep */}
                <ellipse cx="36" cy="122" rx="11" ry="30" transform="rotate(-5,36,122)" {...muscleProps('Arms')} />
                {/* Right bicep */}
                <ellipse cx="164" cy="122" rx="11" ry="30" transform="rotate(5,164,122)" {...muscleProps('Arms')} />
                {/* Left forearm */}
                <ellipse cx="28" cy="176" rx="9" ry="26" transform="rotate(-3,28,176)" {...muscleProps('Arms')} />
                {/* Right forearm */}
                <ellipse cx="172" cy="176" rx="9" ry="26" transform="rotate(3,172,176)" {...muscleProps('Arms')} />

                {/* === CORE === */}
                {/* Abs row 1 */}
                <rect x="86" y="132" width="13" height="17" rx="4" {...muscleProps('Core')} />
                <rect x="101" y="132" width="13" height="17" rx="4" {...muscleProps('Core')} />
                {/* Abs row 2 */}
                <rect x="86" y="153" width="13" height="17" rx="4" {...muscleProps('Core')} />
                <rect x="101" y="153" width="13" height="17" rx="4" {...muscleProps('Core')} />
                {/* Abs row 3 */}
                <rect x="87" y="174" width="12" height="16" rx="4" {...muscleProps('Core')} />
                <rect x="101" y="174" width="12" height="16" rx="4" {...muscleProps('Core')} />
                {/* Left oblique */}
                <ellipse cx="70" cy="162" rx="10" ry="36" transform="rotate(-6,70,162)" {...muscleProps('Core')} />
                {/* Right oblique */}
                <ellipse cx="130" cy="162" rx="10" ry="36" transform="rotate(6,130,162)" {...muscleProps('Core')} />

                {/* === LEGS === */}
                {/* Hip/groin junction */}
                <path d="M88,200 Q100,207 112,200 L115,226 Q100,232 85,226 Z" {...muscleProps('Legs')} />
                {/* Left quad */}
                <ellipse cx="80" cy="262" rx="21" ry="54" {...muscleProps('Legs')} />
                {/* Right quad */}
                <ellipse cx="120" cy="262" rx="21" ry="54" {...muscleProps('Legs')} />
                {/* Left calf */}
                <ellipse cx="78" cy="348" rx="14" ry="30" {...muscleProps('Legs')} />
                {/* Right calf */}
                <ellipse cx="122" cy="348" rx="14" ry="30" {...muscleProps('Legs')} />

                {/* Hover tooltip label */}
                {hovered && hovered !== 'All' && (
                  <text
                    x="100" y="420"
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="600"
                    fill={getColor(hovered as Exclude<MuscleGroup,'All'>)}
                  >
                    {MUSCLE_CONFIG[hovered as Exclude<MuscleGroup,'All'>].label}
                  </text>
                )}
              </motion.g>
            )}

            {/* ── BACK VIEW ── */}
            {view === 'back' && (
              <motion.g
                key="back"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
              >
                {/* Head */}
                <circle cx="100" cy="28" r="20" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                {/* Neck */}
                <rect x="91" y="48" width="18" height="16" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />

                {/* === SHOULDERS (rear delts) === */}
                <ellipse cx="50" cy="86" rx="22" ry="15" {...muscleProps('Shoulders')} />
                <ellipse cx="150" cy="86" rx="22" ry="15" {...muscleProps('Shoulders')} />

                {/* === BACK === */}
                {/* Trapezius (upper back) */}
                <path d="M92,50 L108,50 L148,88 L100,108 L52,88 Z" {...muscleProps('Back')} />
                {/* Left lat */}
                <path d="M60,92 Q44,126 54,172 Q68,178 80,168 Q76,128 78,96 Z" {...muscleProps('Back')} />
                {/* Right lat */}
                <path d="M140,92 Q156,126 146,172 Q132,178 120,168 Q124,128 122,96 Z" {...muscleProps('Back')} />
                {/* Rhomboids / spine */}
                <path d="M83,110 L117,110 L114,162 L86,162 Z" {...muscleProps('Back')} />
                {/* Lower back / lumbar */}
                <ellipse cx="100" cy="185" rx="22" ry="18" {...muscleProps('Back')} />

                {/* === ARMS (triceps) === */}
                <ellipse cx="36" cy="122" rx="11" ry="30" transform="rotate(-5,36,122)" {...muscleProps('Arms')} />
                <ellipse cx="164" cy="122" rx="11" ry="30" transform="rotate(5,164,122)" {...muscleProps('Arms')} />
                {/* Forearms */}
                <ellipse cx="28" cy="176" rx="9" ry="26" {...muscleProps('Arms')} />
                <ellipse cx="172" cy="176" rx="9" ry="26" {...muscleProps('Arms')} />

                {/* === LEGS (glutes + hamstrings) === */}
                {/* Left glute */}
                <ellipse cx="82" cy="216" rx="26" ry="22" {...muscleProps('Legs')} />
                {/* Right glute */}
                <ellipse cx="118" cy="216" rx="26" ry="22" {...muscleProps('Legs')} />
                {/* Left hamstring */}
                <ellipse cx="80" cy="272" rx="20" ry="50" {...muscleProps('Legs')} />
                {/* Right hamstring */}
                <ellipse cx="120" cy="272" rx="20" ry="50" {...muscleProps('Legs')} />
                {/* Left calf (back) */}
                <ellipse cx="78" cy="348" rx="14" ry="30" {...muscleProps('Legs')} />
                {/* Right calf (back) */}
                <ellipse cx="122" cy="348" rx="14" ry="30" {...muscleProps('Legs')} />

                {/* Hover tooltip label */}
                {hovered && hovered !== 'All' && (
                  <text
                    x="100" y="420"
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="sans-serif"
                    fontWeight="600"
                    fill={getColor(hovered as Exclude<MuscleGroup,'All'>)}
                  >
                    {MUSCLE_CONFIG[hovered as Exclude<MuscleGroup,'All'>].label}
                  </text>
                )}
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Muscle legend chips */}
      <div className="grid grid-cols-3 gap-2 w-full">
        {(Object.keys(MUSCLE_CONFIG) as Exclude<MuscleGroup,'All'>[]).map((muscle) => {
          const isActive = selected === muscle;
          return (
            <motion.button
              key={muscle}
              onClick={() => handleClick(muscle)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                isActive ? 'text-white' : 'border-white/10 text-foreground/50 hover:border-white/25 hover:text-foreground/80'
              }`}
              style={isActive ? {
                borderColor: MUSCLE_CONFIG[muscle].color,
                background: `${MUSCLE_CONFIG[muscle].color}18`,
                color: MUSCLE_CONFIG[muscle].color,
                boxShadow: `0 0 8px ${MUSCLE_CONFIG[muscle].color}30`,
              } : {}}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: MUSCLE_CONFIG[muscle].color }}
              />
              {muscle}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
