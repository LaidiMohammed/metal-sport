'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MACHINE_GUIDES = [
  {
    id: 1,
    name: 'Treadmill',
    category: 'Cardio',
    difficulty: 'Beginner',
    duration: '30-60 min',
    benefits: ['Cardiovascular Health', 'Leg Strength', 'Calorie Burn'],
    instructions: [
      'Start with warm-up walk at slow pace',
      'Gradually increase speed over 2-3 minutes',
      'Maintain steady breathing pattern',
      'Use arms naturally for balance',
      'Cool down with slow walk at end',
    ],
    breathing: 'Inhale through nose, exhale through mouth',
    safety: [
      'Never jump off while treadmill is moving',
      'Keep eyes on screen, not down',
      'Hold rails only for balance, not support',
      'Stay hydrated throughout',
    ],
  },
  {
    id: 2,
    name: 'Leg Press',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: '20-30 min',
    benefits: ['Quad Development', 'Glute Activation', 'Leg Endurance'],
    instructions: [
      'Sit with back against pad',
      'Place feet at shoulder width on platform',
      'Lower weight by bending knees to 90°',
      'Push through heels to extend legs',
      'Do not lock knees at top',
    ],
    breathing: 'Exhale on push, inhale on lower',
    safety: [
      'Never go below 90° knee angle',
      'Keep head and back on pad',
      'Do not use momentum',
      'Start with light weight for form',
    ],
  },
  {
    id: 3,
    name: 'Dumbbell',
    category: 'Strength',
    difficulty: 'Beginner',
    duration: '15-45 min',
    benefits: ['Muscle Building', 'Stabilizer Training', 'Flexibility'],
    instructions: [
      'Stand with feet shoulder-width apart',
      'Hold dumbbells with neutral grip',
      'Engage core before movement',
      'Move with controlled speed',
      'Perform movement through full range',
    ],
    breathing: 'Exhale on effort, inhale on eccentric',
    safety: [
      'Use weight appropriate for form',
      'Never jerk or use momentum',
      'Maintain straight posture',
      'Warm up before heavy lifting',
    ],
  },
  {
    id: 4,
    name: 'Bench Press',
    category: 'Strength',
    difficulty: 'Intermediate',
    duration: '20-30 min',
    benefits: ['Chest Development', 'Shoulder Strength', 'Tricep Activation'],
    instructions: [
      'Lie on bench with feet flat on floor',
      'Grip bar at shoulder width',
      'Lower bar to chest in controlled manner',
      'Press bar up, focusing on chest',
      'Maintain shoulder blade retraction',
    ],
    breathing: 'Exhale on press, inhale on lower',
    safety: [
      'Use spotter for heavy lifts',
      'Do not arch back excessively',
      'Control descent fully',
      'Start with light weight',
    ],
  },
];

export function MachineGuide() {
  const [selectedGuide, setSelectedGuide] = useState<typeof MACHINE_GUIDES[0]>(MACHINE_GUIDES[0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <section className="machine-guide-section">
      <div className="guide-container">
        <motion.div className="guide-header" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h2>Machine Guide & Instructions</h2>
          <p>Learn proper form and technique for each machine</p>
        </motion.div>

        <div className="guide-content">
          {/* Sidebar with machine list */}
          <motion.div
            className="guide-sidebar"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {MACHINE_GUIDES.map((guide) => (
              <motion.button
                key={guide.id}
                className={`guide-button ${selectedGuide.id === guide.id ? 'active' : ''}`}
                onClick={() => setSelectedGuide(guide)}
                variants={itemVariants}
                whileHover={{ scale: 1.02, translateX: 10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="guide-button-title">{guide.name}</div>
                <div className="guide-button-category">{guide.category}</div>
              </motion.button>
            ))}
          </motion.div>

          {/* Main guide content */}
          <motion.div
            className="guide-details"
            key={selectedGuide.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="details-header">
              <h3>{selectedGuide.name}</h3>
              <div className="header-badges">
                <span className="badge difficulty">{selectedGuide.difficulty}</span>
                <span className="badge duration">{selectedGuide.duration}</span>
              </div>
            </div>

            {/* Benefits */}
            <div className="section-block">
              <h4>Key Benefits</h4>
              <div className="benefits-grid">
                {selectedGuide.benefits.map((benefit, idx) => (
                  <motion.div
                    key={idx}
                    className="benefit-card"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                  >
                    <div className="benefit-icon">✓</div>
                    <div className="benefit-text">{benefit}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="section-block">
              <h4>Step-by-Step Instructions</h4>
              <div className="instructions-list">
                {selectedGuide.instructions.map((instruction, idx) => (
                  <motion.div
                    key={idx}
                    className="instruction-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="instruction-number">{idx + 1}</div>
                    <div className="instruction-text">{instruction}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Breathing Technique */}
            <div className="section-block breathing-block">
              <h4>Breathing Technique</h4>
              <div className="breathing-content">
                <div className="breathing-icon">💨</div>
                <p>{selectedGuide.breathing}</p>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="section-block safety-block">
              <h4>Safety Tips</h4>
              <div className="safety-list">
                {selectedGuide.safety.map((tip, idx) => (
                  <motion.div
                    key={idx}
                    className="safety-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <span className="safety-icon">⚠️</span>
                    <span className="safety-text">{tip}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              className="start-exercise-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start {selectedGuide.name} Exercise
            </motion.button>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        .machine-guide-section {
          padding: 80px 20px;
          background: linear-gradient(135deg, #000000 0%, #111111 100%);
          min-height: 100vh;
        }

        .guide-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        .guide-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .guide-header h2 {
          font-size: 3rem;
          font-weight: 900;
          color: white;
          margin: 0 0 10px 0;
          text-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
        }

        .guide-header p {
          font-size: 1.1rem;
          color: #999;
          margin: 0;
        }

        .guide-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 40px;
          align-items: start;
        }

        .guide-sidebar {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .guide-button {
          background: rgba(220, 38, 38, 0.05);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 8px;
          padding: 15px 20px;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
        }

        .guide-button:hover {
          background: rgba(220, 38, 38, 0.1);
          border-color: rgba(220, 38, 38, 0.4);
        }

        .guide-button.active {
          background: rgba(220, 38, 38, 0.2);
          border-color: #DC2626;
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.2);
        }

        .guide-button-title {
          color: white;
          font-weight: 600;
          margin-bottom: 5px;
        }

        .guide-button-category {
          color: #DC2626;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .guide-details {
          background: rgba(220, 38, 38, 0.05);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 12px;
          padding: 40px;
        }

        .details-header {
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(220, 38, 38, 0.2);
        }

        .details-header h3 {
          font-size: 2.2rem;
          color: white;
          margin: 0 0 15px 0;
        }

        .header-badges {
          display: flex;
          gap: 10px;
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .badge.difficulty {
          background: linear-gradient(135deg, #DC2626 0%, #991b1b 100%);
          color: white;
        }

        .badge.duration {
          background: rgba(220, 38, 38, 0.2);
          color: #DC2626;
          border: 1px solid rgba(220, 38, 38, 0.4);
        }

        .section-block {
          margin-bottom: 40px;
        }

        .section-block h4 {
          font-size: 1.2rem;
          color: #DC2626;
          margin: 0 0 20px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .benefit-card {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 8px;
          padding: 15px;
          text-align: center;
          transition: all 0.3s;
        }

        .benefit-card:hover {
          background: rgba(220, 38, 38, 0.15);
          border-color: #DC2626;
        }

        .benefit-icon {
          font-size: 1.5rem;
          color: #4ade80;
          margin-bottom: 8px;
        }

        .benefit-text {
          color: white;
          font-weight: 500;
          font-size: 0.9rem;
        }

        .instructions-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .instruction-item {
          display: grid;
          grid-template-columns: 40px 1fr;
          gap: 15px;
          background: rgba(0, 0, 0, 0.2);
          padding: 15px;
          border-radius: 8px;
          align-items: center;
        }

        .instruction-number {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #DC2626 0%, #991b1b 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          flex-shrink: 0;
        }

        .instruction-text {
          color: #ccc;
          line-height: 1.6;
        }

        .breathing-block {
          background: rgba(220, 38, 38, 0.08);
          border-left: 3px solid #DC2626;
          padding: 20px;
          border-radius: 8px;
        }

        .breathing-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .breathing-icon {
          font-size: 2rem;
        }

        .breathing-content p {
          color: #ccc;
          margin: 0;
          font-size: 1rem;
          line-height: 1.6;
        }

        .safety-block {
          background: rgba(220, 38, 38, 0.08);
          border-left: 3px solid #FCA5A5;
          padding: 20px;
          border-radius: 8px;
        }

        .safety-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .safety-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }

        .safety-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .safety-text {
          color: #ccc;
          line-height: 1.5;
        }

        .start-exercise-btn {
          width: 100%;
          padding: 15px;
          background: linear-gradient(135deg, #DC2626 0%, #991b1b 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.3s;
          margin-top: 20px;
        }

        .start-exercise-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
        }

        @media (max-width: 1024px) {
          .guide-content {
            grid-template-columns: 1fr;
          }

          .guide-sidebar {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 10px;
          }

          .guide-button {
            flex: 1;
            min-width: 150px;
          }
        }

        @media (max-width: 768px) {
          .guide-header h2 {
            font-size: 2rem;
          }

          .guide-details {
            padding: 20px;
          }

          .details-header h3 {
            font-size: 1.5rem;
          }

          .benefits-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }
        }
      `}</style>
    </section>
  );
}

export default MachineGuide;
