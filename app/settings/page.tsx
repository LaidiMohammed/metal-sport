'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useRouter } from 'next/navigation';
import { Settings, Lock, User, Bell, ChevronRight } from 'lucide-react';
import { useState } from 'react';

export default function SettingsPage() {
  useAuthProtected();
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');

  if (!user) {
    router.push('/auth');
    return null;
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-accent/20">
              <Settings className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Settings</h1>
          </div>
          <p className="text-foreground/60">Manage your account and preferences</p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex gap-2 mb-8 bg-foreground/5 p-1 rounded-lg w-fit"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/40'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={itemVariants}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            );
          })}
        </motion.div>

        {/* Content */}
        <motion.div
          className="space-y-8"
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="p-6 rounded-xl border border-accent/20 bg-card" variants={itemVariants}>
                <h2 className="text-xl font-bold text-foreground mb-4">Account Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-2 rounded-lg bg-foreground/5 border border-accent/20 text-foreground placeholder:text-foreground/40"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">Email Address</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 rounded-lg bg-foreground/5 border border-accent/20 text-foreground placeholder:text-foreground/40"
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div className="p-6 rounded-xl border border-accent/20 bg-card" variants={itemVariants}>
                <h2 className="text-xl font-bold text-foreground mb-4">Membership</h2>
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <div>
                    <p className="font-semibold text-foreground text-lg capitalize">{user.membership} Plan</p>
                    <p className="text-sm text-foreground/60">Your current membership tier</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">
                    Active
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Privacy & Security */}
          {activeTab === 'privacy' && (
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="p-6 rounded-xl border border-accent/20 bg-card" variants={itemVariants}>
                <h2 className="text-xl font-bold text-foreground mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Make profile visible to other members', default: true },
                    { label: 'Show workout achievements publicly', default: false },
                    { label: 'Allow community messaging', default: true },
                  ].map((setting, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <label className="text-foreground cursor-pointer">{setting.label}</label>
                      <input
                        type="checkbox"
                        defaultChecked={setting.default}
                        className="w-5 h-5 rounded border-accent/30 bg-foreground/5 cursor-pointer"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="p-6 rounded-xl border border-accent/20 bg-card" variants={itemVariants}>
                <h2 className="text-xl font-bold text-foreground mb-4">Password & Security</h2>
                <div className="space-y-4">
                  <motion.button
                    className="w-full px-4 py-3 rounded-lg border border-accent/30 text-accent font-medium hover:bg-accent/10 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Change Password
                  </motion.button>
                  <p className="text-sm text-foreground/60">Last changed 3 months ago</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <motion.div
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div className="p-6 rounded-xl border border-accent/20 bg-card" variants={itemVariants}>
                <h2 className="text-xl font-bold text-foreground mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Workout reminders', default: true },
                    { label: 'Weekly progress reports', default: true },
                    { label: 'New feature announcements', default: false },
                    { label: 'Marketing emails', default: false },
                  ].map((notif, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <label className="text-foreground cursor-pointer">{notif.label}</label>
                      <input
                        type="checkbox"
                        defaultChecked={notif.default}
                        className="w-5 h-5 rounded border-accent/30 bg-foreground/5 cursor-pointer"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex gap-4 mt-12 pt-8 border-t border-accent/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <motion.button
            className="px-6 py-2 rounded-lg bg-accent text-accent-foreground font-medium hover:shadow-lg hover:shadow-accent/40 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Save Changes
          </motion.button>
          <motion.button
            className="px-6 py-2 rounded-lg border border-accent/30 text-foreground font-medium hover:bg-foreground/5 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Cancel
          </motion.button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
