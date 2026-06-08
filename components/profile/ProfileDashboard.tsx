'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { QRCodeSVG } from 'qrcode.react';

export function ProfileDashboard() {
  const user = useStore((state) => state.user);
  const [showQR, setShowQR] = useState(false);

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

  const subscriptionPlans = [
    {
      id: 1,
      name: 'Musculation',
      price: '2,999',
      duration: '30 days',
      focus: 'Strength Training',
      color: '#DC2626',
    },
    {
      id: 2,
      name: 'Cardio',
      price: '2,499',
      duration: '30 days',
      focus: 'Cardio & Endurance',
      color: '#991b1b',
    },
    {
      id: 3,
      name: 'Mix',
      price: '3,499',
      duration: '30 days',
      focus: 'Complete Training',
      color: '#EF4444',
    },
    {
      id: 4,
      name: 'Feminine Zumba',
      price: '1,999',
      duration: '30 days',
      focus: 'Dance & Fitness',
      color: '#FCA5A5',
    },
  ];

  return (
    <section className="profile-dashboard">
      <div className="profile-container">
        {/* User Header */}
        <motion.div
          className="profile-header"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="user-card">
            <div className="avatar">
              <div className="avatar-initial">
                {user?.name?.[0]?.toUpperCase() || 'K'}
              </div>
            </div>

            <div className="user-info">
              <h2>{user?.name || 'Fitness Enthusiast'} {user?.lastName || ''}</h2>
              <p className="email">{user?.email}</p>
              <div className="membership-status">
                <span className="badge">{user?.membership || 'free'}</span>
                <span className="status">{user?.isActive ? 'Active' : 'Expired'}</span>
              </div>
            </div>

            <motion.button
              className="qr-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowQR(!showQR)}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="4" height="4" />
              </svg>
              QR Code
            </motion.button>
          </motion.div>

          {/* QR Code Display */}
          {showQR && (
            <motion.div
              className="qr-display"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <QRCodeSVG
                value={JSON.stringify({ id: user?.id, name: user?.name, lastName: user?.lastName })}
                size={200}
                level="H"
                includeMargin={true}
                fgColor="#DC2626"
                bgColor="#000000"
              />
              <p>Scan to view your profile</p>
            </motion.div>
          )}
        </motion.div>

        {/* Verification Section — QR + ID + Subscription */}
        <motion.div variants={itemVariants} style={{
          background: 'rgba(0,212,170,0.04)', border: '1px solid rgba(0,212,170,0.15)',
          borderRadius: 12, padding: '16px 20px', marginTop: 16,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
            Verification & Subscription
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>QR Code</p>
              <p style={{ fontSize: 12, color: '#00d4aa', fontWeight: 600 }}>Scan at gym desk</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member ID</p>
              <code
                onClick={() => { navigator.clipboard.writeText(user?.id || ''); }}
                style={{
                  fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer',
                  background: 'rgba(255,255,255,0.06)', padding: '3px 8px', borderRadius: 4,
                  display: 'inline-block', fontFamily: 'monospace',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
                title="Click to copy"
              >
                {user?.id || '—'}
              </code>
              <p style={{ fontSize: 8, color: 'rgba(255,255,255,0.2)', marginTop: 2 }}>Click to copy — give to admin</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sessions Left</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: (user?.sessionsLeft || 0) > 5 ? '#4ade80' : (user?.sessionsLeft || 0) > 0 ? '#fbbf24' : '#ef4444' }}>
                {user?.sessionsLeft ?? '-'}
              </p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '10px 12px' }}>
              <p style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', marginBottom: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Expires</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: user?.isActive ? '#fff' : '#ef4444' }}>
                {user?.expirationDate || '-'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="stats-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {[
            { label: 'Workouts', value: '12', unit: 'this month' },
            { label: 'Total Hours', value: '48', unit: 'trained' },
            { label: 'Streak', value: '7', unit: 'days' },
            { label: 'Calories', value: '2.4k', unit: 'burned' },
          ].map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} className="stat-card">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-unit">{stat.unit}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Subscription Plans */}
        <motion.div
          className="subscription-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h3>Choose Your Plan</h3>
          <p>Select the membership that fits your fitness goals</p>

          <div className="plans-grid">
            {subscriptionPlans.map((plan) => (
              <motion.div
                key={plan.id}
                className="plan-card"
                style={{ borderTopColor: plan.color }}
                whileHover={{ scale: 1.05, translateY: -10 }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="plan-header">
                  <h4>{plan.name}</h4>
                  <span className="plan-focus">{plan.focus}</span>
                </div>

                <div className="plan-pricing">
                  <span className="price">DA {plan.price}</span>
                  <span className="duration">{plan.duration}</span>
                </div>

                <div className="plan-features">
                  <ul>
                    <li>✓ Full machine access</li>
                    <li>✓ AI coaching</li>
                    <li>✓ Workout plans</li>
                    <li>✓ Progress tracking</li>
                  </ul>
                </div>

                <motion.button
                  className="subscribe-btn"
                  style={{
                    background: `linear-gradient(135deg, ${plan.color} 0%, ${plan.color}dd 100%)`,
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          className="activity-section"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <h3>Recent Activity</h3>

          <div className="activity-list">
            {[
              { date: 'Today', activity: 'Completed Leg Day Workout', duration: '45 min' },
              { date: 'Yesterday', activity: 'Upper Body Strength Training', duration: '52 min' },
              { date: '2 days ago', activity: 'Cardio & Endurance Session', duration: '38 min' },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="activity-item"
                variants={itemVariants}
              >
                <div className="activity-date">{item.date}</div>
                <div className="activity-details">
                  <p className="activity-name">{item.activity}</p>
                  <p className="activity-duration">{item.duration}</p>
                </div>
                <div className="activity-icon">→</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .profile-dashboard {
          padding: 40px 20px;
          background: linear-gradient(135deg, #000000 0%, #111111 100%);
          min-height: 100vh;
        }

        .profile-container {
          max-width: 1200px;
          margin: 0 auto;
          space-y: 40px;
        }

        .profile-header {
          margin-bottom: 60px;
        }

        .user-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 30px;
          background: rgba(220, 38, 38, 0.1);
          border: 1px solid rgba(220, 38, 38, 0.3);
          border-radius: 16px;
          padding: 30px;
          margin-bottom: 20px;
        }

        .avatar {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: linear-gradient(135deg, #DC2626 0%, #991b1b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: bold;
          color: white;
        }

        .avatar-initial {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-info h2 {
          font-size: 1.8rem;
          color: white;
          margin: 0 0 5px 0;
        }

        .email {
          color: #999;
          margin: 0;
          font-size: 0.95rem;
        }

        .membership-status {
          display: flex;
          gap: 10px;
          margin-top: 10px;
        }

        .badge {
          display: inline-block;
          background: linear-gradient(135deg, #DC2626 0%, #991b1b 100%);
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status {
          display: inline-block;
          color: #4ade80;
          font-weight: 600;
          font-size: 0.8rem;
        }

        .qr-button {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(220, 38, 38, 0.2);
          border: 1px solid rgba(220, 38, 38, 0.4);
          border-radius: 8px;
          color: #DC2626;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 600;
        }

        .qr-button:hover {
          background: rgba(220, 38, 38, 0.3);
          border-color: #DC2626;
        }

        .qr-display {
          grid-column: span 3;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
          padding: 20px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .qr-display p {
          color: #999;
          margin: 0;
          font-size: 0.9rem;
        }

        .stats-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 60px;
        }

        .stat-card {
          background: rgba(220, 38, 38, 0.05);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .stat-card:hover {
          border-color: rgba(220, 38, 38, 0.5);
          background: rgba(220, 38, 38, 0.1);
        }

        .stat-value {
          font-size: 2.5rem;
          font-weight: bold;
          color: #DC2626;
        }

        .stat-label {
          color: white;
          font-weight: 600;
          margin-top: 5px;
        }

        .stat-unit {
          color: #666;
          font-size: 0.85rem;
          margin-top: 3px;
        }

        .subscription-section {
          margin-bottom: 60px;
        }

        .subscription-section h3 {
          font-size: 2rem;
          color: white;
          margin: 0 0 10px 0;
        }

        .subscription-section > p {
          color: #666;
          margin: 0 0 30px 0;
        }

        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .plan-card {
          background: rgba(220, 38, 38, 0.05);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-top: 3px solid;
          border-radius: 12px;
          padding: 25px;
          display: flex;
          flex-direction: column;
          transition: all 0.3s;
        }

        .plan-card:hover {
          background: rgba(220, 38, 38, 0.1);
          border-color: rgba(220, 38, 38, 0.5);
        }

        .plan-header {
          margin-bottom: 15px;
        }

        .plan-header h4 {
          font-size: 1.3rem;
          color: white;
          margin: 0;
        }

        .plan-focus {
          display: inline-block;
          background: rgba(220, 38, 38, 0.2);
          color: #DC2626;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.75rem;
          margin-top: 5px;
        }

        .plan-pricing {
          display: flex;
          align-items: baseline;
          gap: 10px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(220, 38, 38, 0.2);
        }

        .price {
          font-size: 1.8rem;
          font-weight: bold;
          color: #DC2626;
        }

        .duration {
          color: #666;
          font-size: 0.9rem;
        }

        .plan-features ul {
          list-style: none;
          padding: 0;
          margin: 0 0 20px 0;
          flex: 1;
        }

        .plan-features li {
          color: #ccc;
          padding: 8px 0;
          font-size: 0.9rem;
        }

        .subscribe-btn {
          padding: 12px;
          border: none;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-transform: uppercase;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }

        .subscribe-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
        }

        .activity-section {
          margin-bottom: 40px;
        }

        .activity-section h3 {
          font-size: 1.5rem;
          color: white;
          margin: 0 0 20px 0;
        }

        .activity-list {
          space: 15px;
        }

        .activity-item {
          display: grid;
          grid-template-columns: 80px 1fr 50px;
          align-items: center;
          gap: 20px;
          background: rgba(220, 38, 38, 0.05);
          border: 1px solid rgba(220, 38, 38, 0.2);
          border-left: 3px solid #DC2626;
          border-radius: 8px;
          padding: 15px 20px;
          margin-bottom: 15px;
          transition: all 0.3s;
        }

        .activity-item:hover {
          background: rgba(220, 38, 38, 0.1);
          border-color: rgba(220, 38, 38, 0.5);
        }

        .activity-date {
          color: #666;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .activity-details {
          padding: 0;
        }

        .activity-name {
          color: white;
          margin: 0;
          font-weight: 500;
        }

        .activity-duration {
          color: #666;
          margin: 3px 0 0 0;
          font-size: 0.85rem;
        }

        .activity-icon {
          text-align: center;
          color: #DC2626;
          font-size: 1.2rem;
          font-weight: bold;
        }

        @media (max-width: 768px) {
          .user-card {
            grid-template-columns: 1fr;
            gap: 20px;
          }

          .qr-display {
            grid-column: auto;
          }

          .activity-item {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .subscription-section h3 {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </section>
  );
}

export default ProfileDashboard;
