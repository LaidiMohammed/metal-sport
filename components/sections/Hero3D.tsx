'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Canvas3D } from '@/components/3d/Canvas3D';
import { Mascot3D } from '@/components/3d/Mascot3D';

export function Hero3D() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section className="hero-3d-section">
      {/* Background 3D Canvas */}
      <div className="canvas-wrapper">
        <Canvas3D cameraPosition={[0, 2, 5]} autoRotate={true}>
          <Mascot3D />
        </Canvas3D>
      </div>

      {/* Content Overlay */}
      <motion.div
        className="hero-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 variants={itemVariants} className="hero-title">
          KIMO&apos;S GYM
        </motion.h1>

        <motion.p variants={itemVariants} className="hero-subtitle">
          Transform Your Body. Elevate Your Mind.
        </motion.p>

        <motion.div variants={itemVariants} className="hero-cta">
          <button className="cta-button primary">Start Your Journey</button>
          <button className="cta-button secondary">Explore Machines</button>
        </motion.div>

        {/* Floating Stats */}
        <motion.div variants={itemVariants} className="hero-stats">
          <div className="stat-card">
            <h3>50+</h3>
            <p>Premium Machines</p>
          </div>
          <div className="stat-card">
            <h3>24/7</h3>
            <p>Access Available</p>
          </div>
          <div className="stat-card">
            <h3>AI Coach</h3>
            <p>Personal Guidance</p>
          </div>
        </motion.div>
      </motion.div>

      <style jsx>{`
        .hero-3d-section {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          background: linear-gradient(135deg, #000000 0%, #111111 100%);
        }

        .canvas-wrapper {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
        }

        .hero-content {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          z-index: 10;
          text-align: center;
          padding: 20px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(4px);
        }

        .hero-title {
          font-size: clamp(3rem, 10vw, 5rem);
          font-weight: 900;
          color: #fff;
          text-shadow: 0 0 30px rgba(220, 38, 38, 0.8);
          letter-spacing: -2px;
          margin: 0;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: #ccc;
          margin-top: 10px;
          font-weight: 300;
          text-shadow: 0 0 20px rgba(220, 38, 38, 0.3);
        }

        .hero-cta {
          display: flex;
          gap: 20px;
          margin-top: 40px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .cta-button {
          padding: 12px 30px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .cta-button.primary {
          background: linear-gradient(135deg, #DC2626 0%, #991b1b 100%);
          color: white;
          box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
        }

        .cta-button.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 50px rgba(220, 38, 38, 0.8);
        }

        .cta-button.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(220, 38, 38, 0.5);
        }

        .cta-button.secondary:hover {
          background: rgba(220, 38, 38, 0.2);
          border-color: #DC2626;
        }

        .hero-stats {
          display: flex;
          gap: 30px;
          margin-top: 60px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .stat-card {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          padding: 20px 30px;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          text-align: center;
          min-width: 150px;
        }

        .stat-card h3 {
          font-size: 2rem;
          color: #DC2626;
          margin: 0;
          font-weight: 700;
        }

        .stat-card p {
          color: #999;
          margin: 5px 0 0 0;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 2.5rem;
          }

          .hero-subtitle {
            font-size: 1.1rem;
          }

          .hero-cta {
            flex-direction: column;
            gap: 15px;
          }

          .cta-button {
            width: 100%;
            max-width: 300px;
          }

          .hero-stats {
            flex-direction: column;
            gap: 20px;
          }

          .stat-card {
            width: 100%;
            max-width: 200px;
          }
        }
      `}</style>
    </section>
  );
}

export default Hero3D;
