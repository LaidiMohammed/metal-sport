'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MetalSportLogo } from '@/components/3d/MetalSportLogo';
import { AnimatedProfileMenu } from '@/components/animated-profile-menu';
import { useStore } from '@/lib/store';
import { usePathname } from 'next/navigation';
import { Menu, X, Crown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const user = useStore((state) => state.user);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/auth') return null;

  const navLinks = [
    ...(user && user.role === 'admin' ? [{ href: '/admin', label: 'Admin' }] : []),
    { href: '/exercises', label: 'Exercises' },
    { href: '/workouts', label: 'Workouts' },
    { href: '/shop', label: 'Shop' },
    { href: '/membership', label: 'Membership' },
    { href: '/coach', label: 'AI Coach' },
    { href: '/about', label: 'About Us' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 border-b border-foreground/[0.06]'
          : 'bg-background'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex-shrink-0 flex items-center gap-2">
            <Image src="/images/logo.jpg" alt="Metal Sport" width={24} height={24} className="w-6 h-6 rounded bg-accent" />
            <MetalSportLogo variant="navbar" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center h-full gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative flex items-center px-4 h-full group"
                >
                  <span
                    className={`relative z-10 text-[13px] font-medium tracking-wide uppercase transition-colors duration-200 ${
                      isActive ? 'text-accent' : 'text-foreground/50 group-hover:text-foreground'
                    }`}
                  >
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="navbar-underline"
                      className="absolute bottom-0 left-3 right-3 h-[2px] bg-accent rounded-full"
                      transition={{ type: 'spring', stiffness: 250, damping: 25 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="flex items-center gap-1">
            {user ? (
              <div className="flex items-center gap-1">
                {user.role === 'admin' && <Crown className="w-4 h-4 text-yellow-400" strokeWidth={1.5} />}
                <AnimatedProfileMenu />
              </div>
            ) : (
              <div className="hidden lg:flex items-center gap-1">
                <Link
                  href="/auth"
                  className="px-4 py-2 text-[13px] font-medium text-foreground/50 hover:text-foreground transition-colors duration-200 tracking-wide rounded-lg hover:bg-foreground/[0.04]"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth"
                  className="ml-1 px-5 py-2 text-[13px] font-semibold text-background bg-accent hover:bg-accent/90 transition-all duration-200 tracking-wide uppercase rounded-lg hover:shadow-lg hover:shadow-accent/20"
                >
                  Join Now
                </Link>
              </div>
            )}

            {/* Mobile toggle */}
            <button
              className="lg:hidden p-2 -mr-2 rounded-lg hover:bg-foreground/[0.05] transition-colors duration-200"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <motion.span
                  className="absolute top-[3px] left-0 w-full h-[2px] rounded-full bg-foreground origin-center"
                  animate={isOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="absolute top-[9px] left-0 w-full h-[2px] rounded-full bg-foreground"
                  animate={isOpen ? { opacity: 0, x: 10 } : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="absolute bottom-[3px] left-0 w-full h-[2px] rounded-full bg-foreground origin-center"
                  animate={isOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="lg:hidden overflow-hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="py-2 border-t border-foreground/[0.06]">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium tracking-wide transition-colors duration-200 rounded-lg mx-1 ${
                        isActive
                          ? 'text-accent bg-accent/[0.06]'
                          : 'text-foreground/50 hover:text-foreground hover:bg-foreground/[0.04]'
                      }`}
                    >
                      {isActive && <span className="w-1 h-1 rounded-full bg-accent" />}
                      {link.label}
                    </Link>
                  );
                })}

                {!user && (
                  <div className="mt-2 pt-2 border-t border-foreground/[0.06] px-4 space-y-1">
                    <Link
                      href="/auth"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm font-medium text-foreground/50 hover:text-foreground text-center rounded-lg hover:bg-foreground/[0.04] transition-colors duration-200"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2.5 text-sm font-semibold text-background bg-accent hover:bg-accent/90 text-center rounded-lg transition-all duration-200 uppercase tracking-wide"
                    >
                      Join Now
                    </Link>
                  </div>
                )}

                {user && (
                  <div className="mt-2 pt-2 border-t border-foreground/[0.06] px-4">
                    <AnimatedProfileMenu />
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
