'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface AnimatedMascotProps {
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function AnimatedMascot({ size = 'md', animated = true }: AnimatedMascotProps) {
  const sizes = {
    sm: { container: 120, image: 100 },
    md: { container: 200, image: 180 },
    lg: { container: 400, image: 360 },
  };

  const bounceVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const breatheVariants = {
    animate: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2.5,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const containerVariants = {
    animate: {
      rotateZ: [0, 2, -2, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut' as const,
      },
    },
  };

  const currentSize = sizes[size];

  return (
    <motion.div
      className="flex items-center justify-center"
      variants={animated ? containerVariants : {}}
      animate={animated ? 'animate' : 'initial'}
      initial="initial"
    >
      <motion.div
        className="relative flex items-center justify-center"
        style={{
          width: currentSize.container,
          height: currentSize.container,
        }}
        variants={animated ? breatheVariants : {}}
        animate={animated ? 'animate' : 'initial'}
        initial="initial"
      >
        {/* Glow effect */}
        {animated && (
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 via-accent/10 to-transparent blur-2xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut' as const,
            }}
          />
        )}

        {/* Mascot Image */}
        <motion.div
          variants={animated ? bounceVariants : {}}
          animate={animated ? 'animate' : 'initial'}
          initial="initial"
          className="relative z-10"
        >
          <Image
            src="/images/mascot.png"
            alt="Kimo - Gym Mascot"
            width={currentSize.image}
            height={currentSize.image}
            className="rounded-full object-cover border-2 border-accent"
            priority
          />
        </motion.div>

        {/* Floating particles effect */}
        {animated && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-accent rounded-full"
                animate={{
                  y: [0, -60, 0],
                  x: [0, 40, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2 + i * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut' as const,
                  delay: i * 0.3,
                }}
                style={{
                  left: `${50 + Math.cos((i * 120 * Math.PI) / 180) * 30}%`,
                  top: `${50 + Math.sin((i * 120 * Math.PI) / 180) * 30}%`,
                }}
              />
            ))}
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
