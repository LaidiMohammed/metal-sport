'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Canvas3D } from '@/components/3d/Canvas3D';
import { Machine3D } from '@/components/3d/Machine3D';

const MACHINES = [
  {
    id: 1,
    name: 'Treadmill Pro',
    type: 'treadmill' as const,
    category: 'Cardio',
    color: '#DC2626',
    description: 'High-performance cardio training',
    targetMuscles: ['Legs', 'Glutes', 'Cardiovascular'],
  },
  {
    id: 2,
    name: 'Dumbbell Set',
    type: 'dumbbell' as const,
    category: 'Strength',
    color: '#EF4444',
    description: 'Versatile weight training',
    targetMuscles: ['All Muscles', 'Stabilizers'],
  },
  {
    id: 3,
    name: 'Weight Bench',
    type: 'bench' as const,
    category: 'Strength',
    color: '#991b1b',
    description: 'Essential strength training',
    targetMuscles: ['Chest', 'Shoulders', 'Triceps'],
  },
  {
    id: 4,
    name: 'Leg Press',
    type: 'leg-press' as const,
    category: 'Strength',
    color: '#DC2626',
    description: 'Lower body power building',
    targetMuscles: ['Quads', 'Hamstrings', 'Glutes'],
  },
];

export function MachineGrid() {
  const [selectedMachine, setSelectedMachine] = useState<typeof MACHINES[0] | null>(null);

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
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="machine-grid-section">
      <div className="section-header">
        <h2>Discover Our Machines</h2>
        <p>Explore our premium equipment selection with 3D visualization</p>
      </div>

      <div className="machines-container">
        {/* Grid of machines */}
        <motion.div
          className="machines-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {MACHINES.map((machine) => (
            <motion.div
              key={machine.id}
              variants={itemVariants}
              className={`machine-card ${selectedMachine?.id === machine.id ? 'selected' : ''}`}
              onClick={() => setSelectedMachine(machine)}
              whileHover={{ scale: 1.05, translateY: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <div className="machine-preview">
                <Canvas3D cameraPosition={[0, 1, 3]} showControls={false} autoRotate={true}>
                  <Machine3D machineType={machine.type} color={machine.color} />
                </Canvas3D>
              </div>

              <div className="machine-info">
                <div className="category-badge">{machine.category}</div>
                <h3>{machine.name}</h3>
                <p>{machine.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Selected machine details */}
        {selectedMachine && (
          <motion.div
            className="machine-details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button className="close-btn" onClick={() => setSelectedMachine(null)}>
              ×
            </button>

            <div className="details-header">
              <h3>{selectedMachine.name}</h3>
              <span className="category-badge">{selectedMachine.category}</span>
            </div>

            <div className="target-muscles">
              <h4>Target Muscles</h4>
              <div className="muscle-tags">
                {selectedMachine.targetMuscles.map((muscle) => (
                  <span key={muscle} className="muscle-tag">
                    {muscle}
                  </span>
                ))}
              </div>
            </div>

            <div className="instructions">
              <h4>Instructions</h4>
              <ol>
                <li>Position yourself correctly on the machine</li>
                <li>Adjust seat height and backrest if available</li>
                <li>Select appropriate weight resistance</li>
                <li>Perform controlled movements with proper form</li>
                <li>Breathe steadily throughout the exercise</li>
              </ol>
            </div>

            <button className="action-btn">Start Exercise</button>
          </motion.div>
        )}
      </div>

      <style jsx>{`
        .machine-grid-section {
          padding: 80px 20px;
          background: linear-gradient(135deg, #000000 0%, #111111 100%);
          min-height: 100vh;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .section-header h2 {
          font-size: 3rem;
          font-weight: 900;
          color: #fff;
          margin: 0 0 10px 0;
          text-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
        }

        .section-header p {
          font-size: 1.1rem;
          color: #999;
        }

        .machines-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          max-width: 1400px;
          margin: 0 auto;
          align-items: start;
        }

        .machines-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .machine-card {
          background: rgba(220, 38, 38, 0.05);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 12px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .machine-card.selected {
          border-color: #DC2626;
          background: rgba(220, 38, 38, 0.15);
          box-shadow: 0 0 30px rgba(220, 38, 38, 0.3);
        }

        .machine-card:hover {
          border-color: rgba(220, 38, 38, 0.5);
          background: rgba(220, 38, 38, 0.1);
        }

        .machine-preview {
          width: 100%;
          height: 250px;
          background: rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .machine-info {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .category-badge {
          display: inline-block;
          background: linear-gradient(135deg, #DC2626 0%, #991b1b 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          width: fit-content;
          margin-bottom: 10px;
        }

        .machine-info h3 {
          font-size: 1.3rem;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .machine-info p {
          color: #999;
          font-size: 0.9rem;
          margin: 0;
        }

        .machine-details {
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 12px;
          padding: 30px;
          position: relative;
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          color: #999;
          font-size: 2rem;
          cursor: pointer;
          transition: color 0.2s;
        }

        .close-btn:hover {
          color: #DC2626;
        }

        .details-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          gap: 20px;
        }

        .details-header h3 {
          font-size: 1.8rem;
          color: #fff;
          margin: 0;
        }

        .target-muscles,
        .instructions {
          margin-bottom: 25px;
        }

        .target-muscles h4,
        .instructions h4 {
          color: #DC2626;
          font-size: 1rem;
          margin: 0 0 15px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .muscle-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .muscle-tag {
          background: rgba(220, 38, 38, 0.2);
          color: #DC2626;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.85rem;
          border: 1px solid rgba(220, 38, 38, 0.4);
        }

        .instructions ol {
          color: #ccc;
          padding-left: 20px;
          margin: 0;
        }

        .instructions li {
          margin-bottom: 10px;
          line-height: 1.6;
        }

        .action-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #DC2626 0%, #991b1b 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 10px;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(220, 38, 38, 0.5);
        }

        @media (max-width: 1200px) {
          .machines-container {
            grid-template-columns: 1fr;
          }

          .machines-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .machines-grid {
            grid-template-columns: 1fr;
          }

          .machine-details {
            margin-top: 30px;
          }

          .section-header h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  );
}

export default MachineGrid;
