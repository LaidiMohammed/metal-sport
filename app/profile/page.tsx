'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Ruler, Weight, Calendar, Dumbbell, User, LogOut, TrendingUp, Trophy, Crown, Zap, Activity } from 'lucide-react';

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

  const stats = [
    { label: 'Height', value: user.height ? `${user.height} cm` : '-', icon: Ruler, color: '#00d4aa' },
    { label: 'Weight', value: user.weight ? `${user.weight} kg` : '-', icon: Weight, color: '#3b82f6' },
    { label: 'Age', value: user.age ?? '-', icon: Calendar, color: '#f59e0b' },
    { label: 'Sessions', value: user.sessionsLeft ?? '-', icon: Activity, color: '#a855f7' },
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

      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '64px 0 56px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <div className="absolute top-[-80px] right-[10%] w-[500px] h-[500px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 flex items-center justify-center border-2 border-accent/30">
              <User className="w-8 h-8 text-accent" />
            </div>
            <div className="flex-1">
              <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
                <h1 className="text-3xl font-bold text-foreground mb-1">{user.name}</h1>
              </motion.div>
              <p className="text-foreground/60">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1.5 ${
                  user.membership === 'elite'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : user.membership === 'premium'
                    ? 'bg-accent/20 text-accent'
                    : 'bg-foreground/10 text-foreground/70'
                }`}>
                  <Crown className="w-3.5 h-3.5" />
                  {user.membership.charAt(0).toUpperCase() + user.membership.slice(1)} Member
                </span>
              </div>
            </div>
            <Button onClick={handleLogout} variant="outline" className="border-foreground/20 text-foreground hover:bg-foreground/5 flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Sign Out
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl border border-foreground/10 bg-card hover:border-accent/20 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${s.color}15` }}>
                    <Icon className="w-5 h-5" style={{ color: s.color }} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{s.value}</p>
                <p className="text-sm text-foreground/60">{s.label}</p>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-foreground/10 bg-card p-8"
          >
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center">
                <Activity className="w-4 h-4 text-accent" />
              </div>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {[
                { date: '2024-01-15', workout: 'Upper Body Strength', duration: 60, exercises: 8 },
                { date: '2024-01-14', workout: 'Leg Day', duration: 50, exercises: 6 },
                { date: '2024-01-13', workout: 'Full Body', duration: 45, exercises: 10 },
                { date: '2024-01-12', workout: 'Cardio & Core', duration: 35, exercises: 5 },
                { date: '2024-01-11', workout: 'Push Day', duration: 55, exercises: 7 },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-foreground/10 hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-sm">{item.workout}</h3>
                      <p className="text-xs text-foreground/50">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-foreground text-sm">{item.duration}m</p>
                    <p className="text-xs text-foreground/50">{item.exercises} exercises</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-foreground/10 bg-card p-8"
          >
            <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-yellow-500/15 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-yellow-500" />
              </div>
              Personal Records
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Bench Press', value: '185 lbs', icon: Dumbbell, color: '#00d4aa' },
                { label: 'Deadlift', value: '315 lbs', icon: Zap, color: '#f59e0b' },
                { label: 'Squat', value: '275 lbs', icon: Trophy, color: '#a855f7' },
              ].map((pr, i) => {
                const Icon = pr.icon;
                return (
                  <motion.div
                    key={pr.label}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-foreground/5 border border-foreground/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${pr.color}15` }}>
                        <Icon className="w-5 h-5" style={{ color: pr.color }} />
                      </div>
                      <div>
                        <p className="text-sm text-foreground/60">{pr.label}</p>
                        <p className="text-xl font-bold text-foreground">{pr.value}</p>
                      </div>
                    </div>
                    <div className="w-2 h-2 rounded-full" style={{ background: pr.color }} />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-2xl border border-foreground/10 bg-card p-8"
          >
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center">
                <Crown className="w-4 h-4 text-accent" />
              </div>
              Membership Plan
            </h3>
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5">
                <span className="text-foreground/60 text-sm">Plan</span>
                <span className="font-bold capitalize text-foreground">{user.membership}</span>
              </div>
              {user.sessionsLeft !== undefined && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5">
                  <span className="text-foreground/60 text-sm">Sessions left</span>
                  <span className="font-bold text-foreground">{user.sessionsLeft}</span>
                </div>
              )}
              {user.expirationDate && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5">
                  <span className="text-foreground/60 text-sm">Expires</span>
                  <span className="font-bold text-foreground">{new Date(user.expirationDate).toLocaleDateString()}</span>
                </div>
              )}
              {user.joinDate && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-foreground/5">
                  <span className="text-foreground/60 text-sm">Member since</span>
                  <span className="font-bold text-foreground">{new Date(user.joinDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
            {user.membership !== 'elite' && (
              <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90 flex items-center gap-2">
                <Crown className="w-4 h-4" /> Upgrade to Elite
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="rounded-2xl border border-foreground/10 bg-card p-8"
          >
            <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/15 flex items-center justify-center">
                <Dumbbell className="w-4 h-4 text-accent" />
              </div>
              Quick Stats
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Workouts', value: '47', color: '#00d4aa' },
                { label: 'Hours', value: '42h', color: '#3b82f6' },
                { label: 'Best Streak', value: '12d', color: '#f59e0b' },
                { label: 'Level', value: 'Intermediate', color: '#a855f7' },
              ].map((qs) => (
                <div key={qs.label} className="p-4 rounded-xl bg-foreground/5 border border-foreground/10 text-center">
                  <p className="text-xl font-bold text-foreground" style={{ color: qs.color }}>{qs.value}</p>
                  <p className="text-xs text-foreground/50 mt-1">{qs.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
