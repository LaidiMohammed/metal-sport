'use client';

import { motion } from 'framer-motion';
import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

export function ProfessionalLogo() {
  return (
    <Link href="/" className="flex items-center gap-3 font-bold text-2xl group">
      {/* Animated Dumbbell Icon */}
      <motion.div
        className="relative w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/40"
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        >
          <Dumbbell className="w-6 h-6 text-accent-foreground" strokeWidth={2.5} />
        </motion.div>
      </motion.div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <motion.span
          className="text-foreground font-bold tracking-tight"
          whileHover={{ letterSpacing: '0.05em' }}
          transition={{ duration: 0.3 }}
        >
          Metal Sport
        </motion.span>
        <span className="text-xs text-accent uppercase font-semibold tracking-widest leading-none">
          Gym
        </span>
      </div>
    </Link>
  );
}
