'use client';

import Link from 'next/link';
import { ProfessionalLogo } from '@/components/professional-logo';
import { AnimatedProfileMenu } from '@/components/animated-profile-menu';
import { useStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const user = useStore((state) => state.user);
  const pathname = usePathname();

  // Hide navbar on auth pages
  if (pathname === '/auth') {
    return null;
  }

  const navLinks = [
    { href: '/exercises', label: 'Exercises' },
    { href: '/workouts', label: 'Workouts' },
    { href: '/shop', label: 'Shop' },
    { href: '/membership', label: 'Membership' },
    { href: '/coach', label: 'AI Coach' },
  ];

  return (
    <motion.nav 
      className="sticky top-0 z-50 w-full border-b border-accent/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <ProfessionalLogo />

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05, duration: 0.3 }}
              >
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground/70 hover:text-accent transition-colors relative group"
                >
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-accent to-accent/60 group-hover:w-full"
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Profile Menu or Auth Buttons */}
          <div className="flex items-center gap-4">
            {user ? (
              <AnimatedProfileMenu />
            ) : (
              <motion.div
                className="hidden md:flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth"
                    className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth"
                    className="px-4 py-2 text-sm font-medium text-accent-foreground bg-gradient-to-r from-accent to-accent/80 hover:shadow-lg hover:shadow-accent/40 rounded-lg transition-all"
                  >
                    Join Now
                  </Link>
                </motion.div>
              </motion.div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              className="md:hidden p-2"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isOpen ? (
                <X className="w-6 h-6 text-foreground" />
              ) : (
                <Menu className="w-6 h-6 text-foreground" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            className="md:hidden pb-4 space-y-2 border-t border-accent/20 pt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks.map((link, idx) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-foreground/70 hover:text-accent hover:bg-accent/10 rounded-lg transition-all"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            {!user && (
              <div className="pt-2 space-y-2 border-t border-accent/20">
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-foreground/70 hover:text-accent text-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-accent-foreground bg-gradient-to-r from-accent to-accent/80 rounded-lg text-center"
                >
                  Join Now
                </Link>
              </div>
            )}

            {user && (
              <div className="pt-2 border-t border-accent/20">
                <AnimatedProfileMenu />
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
