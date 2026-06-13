'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const gradients = [
  'radial-gradient(ellipse at 20% 50%, #00d4aa 0%, #0891b2 30%, #0a0a0f 60%)',
  'radial-gradient(ellipse at 80% 20%, #7c3aed 0%, #00d4aa 25%, #0a0a0f 55%)',
  'radial-gradient(ellipse at 50% 80%, #0ea5e9 0%, #00d4aa 20%, #0a0a0f 50%)',
  'radial-gradient(ellipse at 80% 80%, #00d4aa 0%, #0284c7 25%, #0a0a0f 55%)',
];

const easing = [0.22, 1, 0.36, 1];

function getGradientIndex(path: string): number {
  const hash = path.split('').reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0);
  return Math.abs(hash) % gradients.length;
}

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [entered, setEntered] = useState(false);
  const bgGradient = gradients[getGradientIndex(pathname)];

  useEffect(() => { setEntered(false); }, [pathname]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        key={`bg-${pathname}`}
        className="fixed inset-0 z-0"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: easing }}
        style={{ background: bgGradient }}
      />
      <AnimatePresence>
        <motion.div
          key={pathname}
          className={`relative z-10 min-h-screen ${entered ? 'page-entered' : ''}`}
          initial={{ x: '100vw', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '-100vw', opacity: 0 }}
          transition={{ duration: 0.55, ease: easing }}
          onAnimationComplete={() => setEntered(true)}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
