'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Settings,
  LogOut,
  Menu,
  Home,
  Dumbbell,
  ShoppingBag,
  Zap,
  Shield,
  QrCode,
  ChevronRight,
  Clock,
} from 'lucide-react';

export function AnimatedProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const router = useRouter();

  if (!user) {
    return null;
  }

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push('/auth');
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: -10,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.05,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    }),
  };

  const menuItems = [
    {
      section: 'user',
      items: [
        {
          icon: User,
          label: 'My Profile',
          href: '/profile',
          action: () => {
            router.push('/profile');
            setIsOpen(false);
          },
        },
      ],
    },
    {
      section: 'activity',
      items: [
        {
          icon: Dumbbell,
          label: 'My Workouts',
          href: '/workouts',
          action: () => {
            router.push('/workouts');
            setIsOpen(false);
          },
        },
        {
          icon: Clock,
          label: 'Activity History',
          href: '/workouts',
          action: () => {
            router.push('/workouts');
            setIsOpen(false);
          },
        },
      ],
    },
    {
      section: 'account',
      items: [
        {
          icon: Settings,
          label: 'Settings',
          href: '/settings',
          action: () => {
            router.push('/settings');
            setIsOpen(false);
          },
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          href: '/privacy',
          action: () => {
            router.push('/privacy');
            setIsOpen(false);
          },
        },
        {
          icon: QrCode,
          label: 'Membership QR',
          href: '#',
          action: () => {
            alert('Your Membership QR Code: [QR_CODE_PLACEHOLDER]');
          },
        },
      ],
    },
    {
      section: 'logout',
      items: [
        {
          icon: LogOut,
          label: 'Sign Out',
          href: '#',
          action: handleLogout,
          isDangerous: true,
        },
      ],
    },
  ];

  return (
    <div className="relative">
      {/* Profile Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/10 hover:bg-accent/20 transition-colors group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Avatar Circle */}
        <motion.div
          className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-xs font-bold text-accent-foreground shadow-md"
          whileHover={{ scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          {initials}
        </motion.div>

        {/* Menu Icon */}
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Menu className="w-5 h-5 text-foreground group-hover:text-accent transition-colors" />
        </motion.div>
      </motion.button>

      {/* Mobile Hamburger Menu Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-accent/30 bg-accent/10 hover:bg-accent/20 transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <Menu className="w-5 h-5 text-foreground" />
        </motion.div>
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute right-0 top-full mt-2 w-64 bg-card border border-accent/20 rounded-xl shadow-xl shadow-black/30 overflow-hidden z-50"
          >
            {/* Header with User Info */}
            <motion.div
              className="bg-gradient-to-r from-accent/20 to-accent/10 p-4 border-b border-accent/20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-3">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center text-sm font-bold text-accent-foreground shadow-lg"
                  whileHover={{ scale: 1.1 }}
                >
                  {initials}
                </motion.div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground text-sm">{user.name}</p>
                  <p className="text-xs text-foreground/60">{user.email}</p>
                  <motion.span
                    className="inline-block mt-1 px-2 py-0.5 text-xs font-semibold text-accent-foreground bg-accent/80 rounded-full"
                    whileHover={{ scale: 1.05 }}
                  >
                    {user.membership.charAt(0).toUpperCase() + user.membership.slice(1)}
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((section, sectionIdx) => (
                <motion.div key={section.section} className="py-1">
                  {section.items.map((item, itemIdx) => {
                    const Icon = item.icon;
                    const isLastSection = sectionIdx === menuItems.length - 1;
                    const isDanger = item.isDangerous;

                    return (
                      <motion.button
                        key={item.label}
                        custom={itemIdx}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        onClick={item.action}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all group ${
                          isDanger
                            ? 'hover:bg-red-500/20 text-red-500 hover:text-red-400'
                            : 'hover:bg-accent/10 text-foreground hover:text-accent'
                        }`}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          <motion.div
                            whileHover={{ scale: 1.2, rotate: 10 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                          >
                            <Icon className="w-5 h-5" strokeWidth={2} />
                          </motion.div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <motion.div
                          initial={{ x: 0, opacity: 0.5 }}
                          whileHover={{ x: 4, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        >
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </motion.div>
                      </motion.button>
                    );
                  })}

                  {/* Divider between sections */}
                  {sectionIdx < menuItems.length - 1 && (
                    <motion.div
                      className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent my-1"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.2 + sectionIdx * 0.05 }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Footer Info */}
            <motion.div
              className="border-t border-accent/20 p-3 bg-foreground/5 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-xs text-foreground/60">v1.0 • Premium Member</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-40"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
