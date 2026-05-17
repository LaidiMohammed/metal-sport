'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

export function AnimatedLogo() {
  const [isHovered, setIsHovered] = useState(false);

  const containerVariants = {
    initial: {
      scale: 0,
      opacity: 0,
    },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: 0.2,
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  const hoverVariants = {
    hover: {
      scale: 1.15,
      rotate: 10,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover="hover"
      variants={hoverVariants}
      className="relative"
    >
      {/* Glow background */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/30 to-accent/10 blur-xl -z-10"
        animate={isHovered ? { scale: 1.2, opacity: 0.8 } : { scale: 1, opacity: 0.5 }}
        transition={{ duration: 0.3 }}
      />

      {/* Logo Image */}
      <motion.div
        variants={pulseVariants}
        animate={!isHovered ? 'animate' : 'initial'}
      >
        <Image
          src="/images/kimo-logo.jpg"
          alt="Kimo's Gym Logo"
          width={48}
          height={48}
          className="rounded-full border border-accent/50 object-cover"
          priority
        />
      </motion.div>
    </motion.div>
  );
}
