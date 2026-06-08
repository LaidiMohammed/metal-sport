'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
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
  LayoutDashboard,
} from 'lucide-react';

export function AnimatedProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
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
        type: 'spring' as const,
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
        type: 'spring' as const,
        stiffness: 300,
        damping: 25,
      },
    }),
  };

  const ALLOWED_EMAIL = 'hamada.laidi.14@gmail.com';
  const isDashboardAllowed = user?.email === ALLOWED_EMAIL;
  const isAdmin = user?.role === 'admin';

  const menuItems = [
    {
      section: 'user',
      items: [
        ...(isDashboardAllowed ? [{
          icon: LayoutDashboard,
          label: 'Dashboard',
          href: '/dashboard',
          action: () => {
            router.push('/dashboard');
            setIsOpen(false);
          },
          isDangerous: false,
        }] : []),
        ...(isAdmin ? [{
          icon: Shield,
          label: 'Admin Panel',
          href: '/admin',
          action: () => {
            router.push('/admin');
            setIsOpen(false);
          },
          isDangerous: false,
        }] : []),
        {
          icon: User,
          label: 'My Profile',
          href: '/profile',
          action: () => {
            router.push('/profile');
            setIsOpen(false);
          },
          isDangerous: false,
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
          isDangerous: false,
        },
        {
          icon: Clock,
          label: 'Activity History',
          href: '/workouts',
          action: () => {
            router.push('/workouts');
            setIsOpen(false);
          },
          isDangerous: false,
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
          isDangerous: false,
        },
        {
          icon: Shield,
          label: 'Privacy & Security',
          href: '/privacy',
          action: () => {
            router.push('/privacy');
            setIsOpen(false);
          },
          isDangerous: false,
        },
        {
          icon: QrCode,
          label: 'Membership QR',
          href: '#',
          action: () => {
            setShowQRCode(!showQRCode);
          },
          isDangerous: false,
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
          transition={{ type: 'spring' as const, stiffness: 400, damping: 25 }}
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
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-sm truncate">{user.name} {user.lastName || ''}</p>
                  <p className="text-xs text-foreground/60 truncate">{user.email}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <motion.span
                      className="px-2 py-0.5 text-[10px] font-semibold text-accent-foreground bg-accent/80 rounded-full"
                      whileHover={{ scale: 1.05 }}
                    >
                      {user.membership.charAt(0).toUpperCase() + user.membership.slice(1)}
                    </motion.span>
                    <span
                      onClick={() => navigator.clipboard.writeText(user.id)}
                      className="text-[9px] font-mono text-foreground/30 hover:text-accent cursor-pointer truncate"
                      title="Click to copy ID"
                    >
                      ID: {user.id}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Menu Items */}
            <div className="p-2">
              {menuItems.map((section, sectionIdx) => (
                <motion.div key={section.section} className="py-1">
                  {section.items.map((item, itemIdx) => {
                    const Icon = item.icon;
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
                            transition={{ type: 'spring' as const, stiffness: 400, damping: 20 }}
                          >
                            <Icon className="w-5 h-5" strokeWidth={2} />
                          </motion.div>
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        <motion.div
                          initial={{ x: 0, opacity: 0.5 }}
                          whileHover={{ x: 4, opacity: 1 }}
                          transition={{ type: 'spring' as const, stiffness: 300, damping: 25 }}
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

            {/* QR Code Modal */}
            <AnimatePresence>
              {showQRCode && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100]"
                  onClick={() => setShowQRCode(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-card border border-accent/20 rounded-2xl p-8 flex flex-col items-center shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="bg-white p-3 rounded-xl">
                      <QRCodeSVG value={JSON.stringify({ id: user?.id, name: user?.name, lastName: user?.lastName })} size={200} level="H" includeMargin />
                    </div>
                    <p className="text-sm font-semibold text-foreground mt-4">{user?.name}</p>
                    <p className="text-xs text-foreground/40 mt-1">Show at gym check-in</p>
                    <button
                      onClick={() => setShowQRCode(false)}
                      className="mt-4 px-6 py-2 rounded-lg bg-accent/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
                    >
                      Close
                    </button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

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
