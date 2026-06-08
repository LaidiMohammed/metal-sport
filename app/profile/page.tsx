'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function ProfilePage() {
  useAuthProtected();
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-14">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please sign in</h1>
          <p className="text-foreground/60 mb-6">You need to be signed in to view your profile.</p>
          <Link href="/auth">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Stats from profile
  const stats = [
    { label: 'Height', value: user.height ? `${user.height} cm` : '-', icon: '📏' },
    { label: 'Weight', value: user.weight ? `${user.weight} kg` : '-', icon: '⚖️' },
    { label: 'Age', value: user.age ?? '-', icon: '🎂' },
    { label: 'Sessions Left', value: user.sessionsLeft ?? '-', icon: '🏋️' },
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'start -0.3'],
  });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="min-h-screen bg-background pt-14">
      <Navbar />

      {/* Hero banner */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '64px 0 56px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <div className="absolute top-[-80px] right-[10%] w-[500px] h-[500px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center border-2 border-accent/30">
              <span className="text-3xl">👤</span>
            </div>
            <div className="flex-1">
              <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
                <h1 className="text-3xl font-bold text-foreground mb-1">{user.name}</h1>
              </motion.div>
              <p className="text-foreground/60">{user.email}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user.membership === 'elite'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : user.membership === 'premium'
                    ? 'bg-accent/20 text-accent'
                    : 'bg-foreground/10 text-foreground/70'
                }`}>
                  {user.membership.charAt(0).toUpperCase() + user.membership.slice(1)} Member
                </span>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/5">
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid from profile data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s) => (
            <div key={s.label} className="p-6 rounded-lg border border-foreground/10 bg-card">
              <p className="text-sm text-foreground/60 mb-2">{s.icon} {s.label}</p>
              <p className="text-3xl font-bold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="border border-foreground/10 rounded-lg p-8 bg-card mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { date: '2024-01-15', workout: 'Upper Body Strength', duration: 60, exercises: 8 },
              { date: '2024-01-14', workout: 'Leg Day', duration: 50, exercises: 6 },
              { date: '2024-01-13', workout: 'Full Body', duration: 45, exercises: 10 },
              { date: '2024-01-12', workout: 'Cardio & Core', duration: 35, exercises: 5 },
              { date: '2024-01-11', workout: 'Push Day', duration: 55, exercises: 7 },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-accent/50 transition">
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{item.workout}</h3>
                  <p className="text-sm text-foreground/60">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">{item.duration}m</p>
                  <p className="text-sm text-foreground/60">{item.exercises} exercises</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Membership & Billing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="border border-foreground/10 rounded-lg p-8 bg-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Membership Plan</h3>
            <div className="space-y-3 mb-6">
              <p className="text-foreground">Current: <span className="font-bold capitalize">{user.membership} Plan</span></p>
              {user.sessionsLeft !== undefined && <p className="text-foreground/60">Sessions remaining: <span className="font-bold text-foreground">{user.sessionsLeft}</span></p>}
              {user.expirationDate && <p className="text-foreground/60">Expires: {new Date(user.expirationDate).toLocaleDateString()}</p>}
              {user.joinDate && <p className="text-foreground/60">Member since: {new Date(user.joinDate).toLocaleDateString()}</p>}
            </div>
            {user.membership !== 'elite' && (
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                Upgrade to Elite
              </Button>
            )}
          </div>

          <div className="border border-foreground/10 rounded-lg p-8 bg-card">
            <h3 className="text-xl font-bold text-foreground mb-4">Personal Records</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Bench Press</p>
                <p className="text-2xl font-bold text-accent">185 lbs</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Deadlift</p>
                <p className="text-2xl font-bold text-accent">315 lbs</p>
              </div>
              <div>
                <p className="text-sm text-foreground/60 mb-1">Squat</p>
                <p className="text-2xl font-bold text-accent">275 lbs</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
