'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Dumbbell, ShoppingBag, Crown,
  Settings as SettingsIcon, ChevronLeft,
  Flame, Clock, Target, Award, Home,
  Menu, X, Activity, BarChart3, CheckCircle2, Play,
  Users, TrendingUp, Phone, Mail, Briefcase, Calendar,
  LineChart, Goal, Star, Zap, Search,
} from 'lucide-react';
import Link from 'next/link';

type DashboardSection = 'overview' | 'workers';

interface Worker {
  id: string;
  name: string;
  age: number;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'off' | 'break';
  salary: number;
  joinDate: string;
  rating: number;
  specialties: string[];
}

const workersData: Worker[] = [
  { id: 'w1', name: 'Yacine Merabet', age: 34, role: 'Head Coach', email: 'yacine@metalsport.dz', phone: '+213 555 12 34 56', status: 'active', salary: 85000, joinDate: '2022-03-01', rating: 4.9, specialties: ['Strength Training', 'Powerlifting'] },
  { id: 'w2', name: 'Sofia Lounici', age: 29, role: 'Coach', email: 'sofia@metalsport.dz', phone: '+213 555 23 45 67', status: 'active', salary: 65000, joinDate: '2023-01-15', rating: 4.7, specialties: ['Yoga', 'Flexibility'] },
  { id: 'w3', name: 'Rami Bensalem', age: 27, role: 'Coach', email: 'rami@metalsport.dz', phone: '+213 555 34 56 78', status: 'break', salary: 60000, joinDate: '2023-06-01', rating: 4.5, specialties: ['HIIT', 'CrossFit'] },
  { id: 'w4', name: 'Ines Hamdi', age: 31, role: 'Nutritionist', email: 'ines@metalsport.dz', phone: '+213 555 45 67 89', status: 'active', salary: 70000, joinDate: '2022-09-01', rating: 4.8, specialties: ['Nutrition Planning', 'Dietetics'] },
  { id: 'w5', name: 'Lamine Zaidi', age: 26, role: 'Junior Coach', email: 'lamine@metalsport.dz', phone: '+213 555 56 78 90', status: 'active', salary: 45000, joinDate: '2024-02-01', rating: 4.2, specialties: ['Cardio', 'Endurance'] },
  { id: 'w6', name: 'Amel Kaci', age: 33, role: 'Physiotherapist', email: 'amel@metalsport.dz', phone: '+213 555 67 89 01', status: 'off', salary: 75000, joinDate: '2022-06-15', rating: 4.9, specialties: ['Rehab', 'Massage Therapy'] },
];

const sidebarLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/workouts', label: 'Workouts', icon: Dumbbell },
  { href: '/exercises', label: 'Exercises', icon: Activity },
  { href: '/shop', label: 'Shop', icon: ShoppingBag },
  { href: '/membership', label: 'Membership', icon: Crown },
  { href: '/settings', label: 'Settings', icon: SettingsIcon },
];

const monthlyGoals = [
  { label: 'Workouts Goal', current: 18, target: 25, unit: 'sessions' },
  { label: 'Hours Tracked', current: 22, target: 30, unit: 'hours' },
  { label: 'Calories Burn', current: 18400, target: 30000, unit: 'cal' },
  { label: 'Water Intake', current: 65, target: 90, unit: 'liters' },
];

const achievements = [
  { name: '7-Day Streak', icon: Zap, achieved: true, desc: 'Work out 7 days in a row' },
  { name: 'Iron Will', icon: Award, achieved: true, desc: 'Complete 50 workouts' },
  { name: 'Early Bird', icon: Star, achieved: false, desc: '10 morning workouts' },
  { name: 'Century Club', icon: Target, achieved: false, desc: 'Log 100 hours training' },
];

const bodyMetricsData = [
  { month: 'Jan', weight: 82, bf: 18 },
  { month: 'Feb', weight: 80.5, bf: 17 },
  { month: 'Mar', weight: 79, bf: 16.5 },
  { month: 'Apr', weight: 78, bf: 15.8 },
  { month: 'May', weight: 77.5, bf: 15.2 },
  { month: 'Jun', weight: 76, bf: 14.5 },
];

const workoutDistribution = [
  { label: 'Strength', percentage: 45, color: '#00b4d8' },
  { label: 'Cardio', percentage: 25, color: '#4ade80' },
  { label: 'Flexibility', percentage: 15, color: '#f59e0b' },
  { label: 'HIIT', percentage: 15, color: '#ef4444' },
];

const weeklySchedule = [
  { day: 'Monday', workout: 'Upper Body', time: '9:00 AM', coach: 'Yacine' },
  { day: 'Tuesday', workout: 'Cardio', time: '7:00 AM', coach: 'Rami' },
  { day: 'Wednesday', workout: 'Lower Body', time: '9:00 AM', coach: 'Yacine' },
  { day: 'Thursday', workout: 'Yoga', time: '8:00 AM', coach: 'Sofia' },
  { day: 'Friday', workout: 'Full Body', time: '9:00 AM', coach: 'Lamine' },
  { day: 'Saturday', workout: 'Rest', time: '-', coach: '-' },
  { day: 'Sunday', workout: 'Rest', time: '-', coach: '-' },
];

const ALLOWED_EMAIL = 'hamada.laidi.14@gmail.com';

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [section, setSection] = useState<DashboardSection>('overview');
  const [workerSearch, setWorkerSearch] = useState('');
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const user = useStore((state) => state.user);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user && user.email !== ALLOWED_EMAIL) {
      router.replace('/');
    }
  }, [user, router]);

  if (!user || user.email !== ALLOWED_EMAIL) return null;

  const statCards = [
    { label: 'Total Workouts', value: '47', icon: Flame, suffix: 'this month', color: '#00b4d8' },
    { label: 'Workout Streak', value: '12', icon: Award, suffix: 'days', color: '#4ade80' },
    { label: 'Total Hours', value: '68h', icon: Clock, suffix: 'tracked', color: '#f59e0b' },
    { label: 'Calories', value: '26,450', icon: Target, suffix: 'burned', color: '#ef4444' },
  ];

  const weeklyActivity = [
    { day: 'Mon', hours: 1.2 },
    { day: 'Tue', hours: 0.8 },
    { day: 'Wed', hours: 1.5 },
    { day: 'Thu', hours: 0.5 },
    { day: 'Fri', hours: 1.8 },
    { day: 'Sat', hours: 2.2 },
    { day: 'Sun', hours: 0 },
  ];

  const recentWorkouts = [
    { name: 'Upper Body Strength', date: 'Today', duration: '60 min', exercises: 8, completed: true },
    { name: 'Leg Day Power', date: 'Yesterday', duration: '50 min', exercises: 6, completed: true },
    { name: 'Full Body HIIT', date: '2 days ago', duration: '35 min', exercises: 10, completed: true },
    { name: 'Core & Cardio', date: '3 days ago', duration: '40 min', exercises: 5, completed: false },
    { name: 'Upper Body Strength', date: '5 days ago', duration: '55 min', exercises: 8, completed: true },
  ];

  const personalBests = [
    { label: 'Bench Press', value: '185 lbs', trend: '+5 lbs' },
    { label: 'Squat', value: '275 lbs', trend: '+10 lbs' },
    { label: 'Deadlift', value: '315 lbs', trend: '+15 lbs' },
    { label: 'Pull-ups', value: '15 reps', trend: '+3 reps' },
  ];

  const maxActivityHours = Math.max(...weeklyActivity.map(d => d.hours));
  const maxWeight = Math.max(...bodyMetricsData.map(d => d.weight));
  const minWeight = Math.min(...bodyMetricsData.map(d => d.weight));
  const weightRange = maxWeight - minWeight || 1;

  const filteredWorkers = workersData.filter(w =>
    w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.role.toLowerCase().includes(workerSearch.toLowerCase())
  );

  const activeWorkerCount = workersData.filter(w => w.status === 'active').length;
  const avgRating = (workersData.reduce((s, w) => s + w.rating, 0) / workersData.length).toFixed(1);

  return (
    <div className={`min-h-screen bg-background flex ${mobileSidebar ? 'overflow-hidden' : ''}`}>
      <AnimatePresence>
        {mobileSidebar && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={() => setMobileSidebar(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 64 }}
        className={`fixed lg:relative z-50 h-screen bg-card border-r border-foreground/10 flex flex-col transition-all duration-300 ${
          mobileSidebar ? 'left-0' : '-left-full lg:left-0'
        } lg:left-0`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-foreground/10">
          <div className="flex items-center gap-1">
            <Link href="/" className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors text-foreground/50 hover:text-foreground" title="Home">
              <Home className="w-4 h-4" strokeWidth={1.5} />
            </Link>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm font-bold tracking-wider text-foreground uppercase"
              >
                Metal Sport
              </motion.span>
            )}
          </div>
          <button
            onClick={() => { setSidebarOpen(!sidebarOpen); setMobileSidebar(false); }}
            className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors text-foreground/50 hover:text-foreground"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
          </button>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {sidebarLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileSidebar(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'text-accent bg-accent/[0.08]'
                    : 'text-foreground/50 hover:text-foreground hover:bg-foreground/[0.03]'
                }`}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="truncate">
                    {link.label}
                  </motion.span>
                )}
                {isActive && (
                  <motion.span
                    layoutId="sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {user && sidebarOpen && (
          <div className="p-3 border-t border-foreground/10">
            <div className="flex items-center gap-3 px-1">
              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent">
                {user.name?.charAt(0) || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                <p className="text-xs text-foreground/40 capitalize">{user.membership} Plan</p>
              </div>
            </div>
          </div>
        )}
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/10">
          <div className="flex items-center justify-between h-14 px-4 lg:px-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebar(true)} className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-foreground/[0.05] transition-colors">
                <Menu className="w-5 h-5 text-foreground/70" />
              </button>
              <h1 className="text-lg font-bold text-foreground">Dashboard</h1>
              <div className="hidden sm:flex ml-4 gap-1 bg-foreground/[0.04] p-0.5 rounded-lg">
                <button onClick={() => setSection('overview')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${section === 'overview' ? 'bg-accent text-accent-foreground' : 'text-foreground/50 hover:text-foreground'}`}>
                  <LayoutDashboard className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Overview
                </button>
                <button onClick={() => setSection('workers')} className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${section === 'workers' ? 'bg-accent text-accent-foreground' : 'text-foreground/50 hover:text-foreground'}`}>
                  <Users className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Workers
                </button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-foreground/50 hidden sm:block">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
              <Link href="/profile" className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-accent hover:bg-accent/30 transition-colors">
                {user?.name?.charAt(0) || 'U'}
              </Link>
            </div>
          </div>

          {/* Mobile section tabs */}
          <div className="sm:hidden flex px-4 pb-2 gap-1">
            <button onClick={() => setSection('overview')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all text-center ${section === 'overview' ? 'bg-accent/10 text-accent' : 'text-foreground/40'}`}>
              Overview
            </button>
            <button onClick={() => setSection('workers')} className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all text-center ${section === 'workers' ? 'bg-accent/10 text-accent' : 'text-foreground/40'}`}>
              Workers
            </button>
          </div>
        </header>

        <div className="p-4 lg:p-6 space-y-6">

          {/* ============ OVERVIEW SECTION ============ */}
          {section === 'overview' && (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {statCards.map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="bg-card border border-foreground/10 rounded-xl p-4 lg:p-5 hover:border-accent/30 transition-all duration-200 group cursor-default"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">{stat.label}</span>
                      <div className="w-8 h-8 rounded-lg bg-foreground/[0.03] flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <stat.icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-foreground/40 mt-1">{stat.suffix}</p>
                  </motion.div>
                ))}
              </div>

              {/* Weekly Activity + Personal Bests */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15, duration: 0.4 }}
                  className="lg:col-span-2 bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-sm font-bold text-foreground">Weekly Activity</h2>
                      <p className="text-xs text-foreground/40 mt-0.5">Your workout hours this week</p>
                    </div>
                    <BarChart3 className="w-5 h-5 text-accent/60" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-end gap-2 h-36">
                    {weeklyActivity.map((day, i) => {
                      const height = maxActivityHours > 0 ? (day.hours / maxActivityHours) * 100 : 0;
                      return (
                        <div key={day.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                          <span className="text-[10px] text-foreground/40 font-medium">{`${day.hours}h`}</span>
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `${height}%` }}
                            transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full rounded-md relative overflow-hidden"
                            style={{
                              background: day.hours > 0
                                ? 'linear-gradient(180deg, rgba(0,180,216,0.7) 0%, rgba(0,180,216,0.2) 100%)'
                                : 'transparent',
                              minHeight: day.hours > 0 ? '4px' : '0',
                            }}
                          >
                            {day.hours > 0 && (
                              <div className="absolute inset-0 opacity-30" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)', transform: 'skewX(-20deg)' }} />
                            )}
                          </motion.div>
                          <span className="text-[10px] text-foreground/30 font-medium">{day.day}</span>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.4 }}
                  className="bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-foreground">Personal Bests</h2>
                    <Award className="w-5 h-5 text-accent/60" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-4">
                    {personalBests.map((pb, i) => (
                      <motion.div
                        key={pb.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.25 + i * 0.08 }}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-foreground/50">{pb.label}</span>
                          <span className="text-[10px] font-semibold text-accent">{pb.trend}</span>
                        </div>
                        <p className="text-sm font-bold text-foreground">{pb.value}</p>
                        {i < personalBests.length - 1 && <div className="h-px bg-foreground/[0.06] mt-3" />}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Body Metrics + Goals + Schedule row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Body Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.4 }}
                  className="bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-foreground">Body Metrics</h2>
                    <TrendingUp className="w-5 h-5 text-accent/60" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1 mb-4">
                    {bodyMetricsData.map((m, i) => {
                      const weightPercent = ((m.weight - minWeight) / weightRange) * 100;
                      return (
                        <div key={m.month} className="flex items-center gap-3">
                          <span className="text-[10px] text-foreground/40 w-8">{m.month}</span>
                          <div className="flex-1 h-4 bg-foreground/[0.05] rounded-full overflow-hidden relative">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${weightPercent}%` }}
                              transition={{ delay: 0.3 + i * 0.04, duration: 0.4 }}
                              className="h-full rounded-full"
                              style={{ background: 'linear-gradient(90deg, rgba(0,180,216,0.3), rgba(0,180,216,0.7))' }}
                            />
                          </div>
                          <span className="text-[10px] text-foreground/60 w-12 text-right">{m.weight} kg</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-[10px] text-foreground/40 pt-2 border-t border-foreground/10">
                    <span>Body Fat: {bodyMetricsData[bodyMetricsData.length-1].bf}%</span>
                    <span className="text-accent">-{bodyMetricsData[0].weight - bodyMetricsData[bodyMetricsData.length-1].weight} kg</span>
                  </div>
                </motion.div>

                {/* Monthly Goals */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-foreground">Monthly Goals</h2>
                    <Goal className="w-5 h-5 text-accent/60" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-4">
                    {monthlyGoals.map((g, i) => {
                      const pct = Math.min(100, Math.round((g.current / g.target) * 100));
                      return (
                        <motion.div
                          key={g.label}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 + i * 0.06 }}
                        >
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-foreground/60">{g.label}</span>
                            <span className="text-foreground font-medium">{g.current}/{g.target} {g.unit}</span>
                          </div>
                          <div className="h-2 bg-foreground/[0.05] rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${pct}%` }}
                              transition={{ delay: 0.35 + i * 0.06, duration: 0.5 }}
                              className="h-full rounded-full"
                              style={{ background: pct >= 80 ? 'linear-gradient(90deg, #00b4d8, #4ade80)' : pct >= 50 ? 'linear-gradient(90deg, #f59e0b, #00b4d8)' : 'linear-gradient(90deg, #ef4444, #f59e0b)' }}
                            />
                          </div>
                          <span className="text-[10px] text-foreground/40">{pct}% complete</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>

                {/* Weekly Schedule */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 0.4 }}
                  className="bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-foreground">Weekly Schedule</h2>
                    <Calendar className="w-5 h-5 text-accent/60" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-1">
                    {weeklySchedule.map((d, i) => (
                      <div key={d.day} className={`flex items-center gap-2 text-xs p-1.5 rounded ${d.workout === 'Rest' ? 'opacity-30' : 'hover:bg-foreground/[0.03]'}`}>
                        <span className="w-14 text-foreground/40 font-medium">{d.day.slice(0, 3)}</span>
                        <span className="flex-1 text-foreground">{d.workout}</span>
                        <span className="text-foreground/40">{d.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Workout Distribution + Achievements */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.4 }}
                  className="bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
                >
                  <h2 className="text-sm font-bold text-foreground mb-4">Workout Distribution</h2>
                  <div className="space-y-3">
                    {workoutDistribution.map((w, i) => (
                      <motion.div
                        key={w.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.06 }}
                      >
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground/60">{w.label}</span>
                          <span className="text-foreground font-medium">{w.percentage}%</span>
                        </div>
                        <div className="h-2.5 bg-foreground/[0.05] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${w.percentage}%` }}
                            transition={{ delay: 0.45 + i * 0.06, duration: 0.5 }}
                            className="h-full rounded-full"
                            style={{ background: w.color }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
                >
                  <h2 className="text-sm font-bold text-foreground mb-4">Achievements</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {achievements.map((a, i) => (
                      <motion.div
                        key={a.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.45 + i * 0.06 }}
                        className={`p-3 rounded-lg border text-center transition-all ${a.achieved ? 'bg-accent/[0.06] border-accent/20' : 'bg-foreground/[0.02] border-foreground/10 opacity-40'}`}
                      >
                        <a.icon className={`w-5 h-5 mx-auto mb-1.5 ${a.achieved ? 'text-accent' : 'text-foreground/30'}`} strokeWidth={1.5} />
                        <p className="text-xs font-medium text-foreground">{a.name}</p>
                        <p className="text-[9px] text-foreground/40 mt-0.5 leading-tight">{a.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Recent Workouts */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-sm font-bold text-foreground">Recent Workouts</h2>
                    <p className="text-xs text-foreground/40 mt-0.5">Your latest training sessions</p>
                  </div>
                  <Link href="/workouts" className="text-xs font-medium text-accent hover:text-accent/80 transition-colors">View All</Link>
                </div>
                <div className="space-y-2">
                  {recentWorkouts.map((w, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.55 + i * 0.04 }}
                      className="flex items-center gap-4 p-3 rounded-lg hover:bg-foreground/[0.02] transition-colors border border-transparent hover:border-foreground/[0.06]"
                    >
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${w.completed ? 'bg-accent/10' : 'bg-foreground/[0.05]'}`}>
                        {w.completed ? <CheckCircle2 className="w-4 h-4 text-accent" strokeWidth={1.5} /> : <X className="w-4 h-4 text-foreground/30" strokeWidth={1.5} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{w.name}</p>
                        <p className="text-xs text-foreground/40">{w.date} · {w.duration} · {w.exercises} exercises</p>
                      </div>
                      <div className={`px-2 py-0.5 rounded text-[10px] font-medium ${w.completed ? 'bg-accent/10 text-accent' : 'bg-foreground/[0.05] text-foreground/40'}`}>
                        {w.completed ? 'Done' : 'Missed'}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Start CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.4 }}
                className="relative overflow-hidden rounded-xl p-6"
                style={{ background: 'linear-gradient(135deg, rgba(0,180,216,0.12) 0%, rgba(0,180,216,0.04) 100%)', border: '1px solid rgba(0,180,216,0.2)' }}
              >
                <div className="absolute top-[-40px] right-[10%] w-[200px] h-[200px] rounded-full opacity-30" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
                <div className="relative">
                  <h2 className="text-lg font-bold text-foreground mb-1">Ready for today&apos;s workout?</h2>
                  <p className="text-sm text-foreground/50 mb-4">You have 3 workouts scheduled this week. Keep your streak going!</p>
                  <div className="flex gap-3">
                    <Link href="/workouts" className="px-5 py-2.5 text-sm font-semibold text-background bg-accent hover:bg-accent/90 rounded-lg transition-all duration-200 inline-flex items-center gap-2 active:scale-[0.98]">
                      <Play className="w-4 h-4" />
                      Start Workout
                    </Link>
                    <Link href="/exercises" className="px-5 py-2.5 text-sm font-medium text-foreground/60 hover:text-foreground border border-foreground/20 hover:border-foreground/40 rounded-lg transition-all duration-200 inline-flex items-center gap-2">
                      Browse Exercises
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}

          {/* ============ WORKERS SECTION ============ */}
          {section === 'workers' && (
            <>
              {/* Workers Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {[
                  { label: 'Total Staff', value: workersData.length, icon: Users, color: '#00b4d8', suffix: 'team members' },
                  { label: 'Active Now', value: activeWorkerCount, icon: Activity, color: '#4ade80', suffix: 'on duty' },
                  { label: 'Avg Rating', value: avgRating, icon: Star, color: '#f59e0b', suffix: '/ 5.0' },
                  { label: 'Avg Salary', value: `${Math.round(workersData.reduce((s, w) => s + w.salary, 0) / workersData.length).toLocaleString()} DA`, icon: TrendingUp, color: '#ef4444', suffix: 'monthly' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="bg-card border border-foreground/10 rounded-xl p-4 lg:p-5 hover:border-accent/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">{stat.label}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.color + '20' }}>
                        <stat.icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-foreground/40 mt-1">{stat.suffix}</p>
                  </motion.div>
                ))}
              </div>

              {/* Workers Table */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-sm font-bold text-foreground">All Staff Members</h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    <input
                      type="text"
                      placeholder="Search by name or role..."
                      value={workerSearch}
                      onChange={(e) => setWorkerSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-foreground/10">
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Name</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Age</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Role</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Contact</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Rating</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorkers.map((worker, idx) => (
                        <motion.tr
                          key={worker.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.03 }}
                          className="border-b border-foreground/[0.04] hover:bg-foreground/[0.02] transition-colors cursor-pointer"
                          onClick={() => setSelectedWorker(worker)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[11px] font-bold text-accent">
                                {worker.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="text-foreground font-medium">{worker.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-foreground/60">{worker.age}</td>
                          <td className="py-3 px-4">
                            <span className="text-foreground">{worker.role}</span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-foreground/60 flex items-center gap-1">
                                <Mail className="w-3 h-3" strokeWidth={1.5} /> {worker.email}
                              </span>
                              <span className="text-foreground/60 flex items-center gap-1">
                                <Phone className="w-3 h-3" strokeWidth={1.5} /> {worker.phone}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                              worker.status === 'active' ? 'bg-green-500/10 text-green-400' :
                              worker.status === 'break' ? 'bg-yellow-500/10 text-yellow-400' :
                              'bg-red-500/10 text-red-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                worker.status === 'active' ? 'bg-green-400' :
                                worker.status === 'break' ? 'bg-yellow-400' :
                                'bg-red-400'
                              }`} />
                              {worker.status.charAt(0).toUpperCase() + worker.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" strokeWidth={1.5} />
                              <span className="text-foreground font-medium">{worker.rating}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedWorker(worker); }}
                              className="px-3 py-1.5 text-[11px] font-medium text-accent bg-accent/10 hover:bg-accent/20 rounded-lg transition-colors"
                            >
                              View Profile
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredWorkers.length === 0 && (
                  <div className="text-center py-10 text-foreground/40 text-sm">No staff members found</div>
                )}
              </motion.div>

              {/* Specialties Overview */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card border border-foreground/10 rounded-xl p-5 lg:p-6"
              >
                <h2 className="text-sm font-bold text-foreground mb-4">Coaching Specialties</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { name: 'Strength Training', coaches: 3, color: '#00b4d8' },
                    { name: 'Cardio & HIIT', coaches: 2, color: '#ef4444' },
                    { name: 'Yoga & Flexibility', coaches: 2, color: '#4ade80' },
                    { name: 'Nutrition', coaches: 1, color: '#f59e0b' },
                    { name: 'Rehab & Therapy', coaches: 1, color: '#a78bfa' },
                    { name: 'CrossFit', coaches: 1, color: '#f472b6' },
                  ].map((spec, i) => (
                    <motion.div
                      key={spec.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.25 + i * 0.04 }}
                      className="p-3 rounded-lg border border-foreground/10 text-center hover:border-accent/30 transition-all"
                    >
                      <p className="text-lg font-bold" style={{ color: spec.color }}>{spec.coaches}</p>
                      <p className="text-[10px] text-foreground/50 mt-0.5">{spec.name}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}
        </div>
      </div>

      {/* Worker Detail Modal */}
      <AnimatePresence>
        {selectedWorker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedWorker(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card border border-foreground/10 rounded-xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold text-accent">
                  {selectedWorker.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{selectedWorker.name}</h3>
                  <p className="text-sm text-foreground/60">{selectedWorker.role}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" strokeWidth={1.5} />
                    <span className="text-xs text-foreground/60">{selectedWorker.rating} rating</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm p-3 bg-foreground/[0.03] rounded-lg">
                  <span className="text-foreground/50">Age</span>
                  <span className="text-foreground font-medium">{selectedWorker.age} years</span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-foreground/[0.03] rounded-lg">
                  <span className="text-foreground/50">Email</span>
                  <span className="text-foreground font-medium">{selectedWorker.email}</span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-foreground/[0.03] rounded-lg">
                  <span className="text-foreground/50">Phone</span>
                  <span className="text-foreground font-medium">{selectedWorker.phone}</span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-foreground/[0.03] rounded-lg">
                  <span className="text-foreground/50">Salary</span>
                  <span className="text-accent font-medium">{selectedWorker.salary.toLocaleString()} DA</span>
                </div>
                <div className="flex justify-between text-sm p-3 bg-foreground/[0.03] rounded-lg">
                  <span className="text-foreground/50">Joined</span>
                  <span className="text-foreground font-medium">{selectedWorker.joinDate}</span>
                </div>
                <div className="p-3 bg-foreground/[0.03] rounded-lg">
                  <span className="text-sm text-foreground/50 block mb-2">Specialties</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedWorker.specialties.map(s => (
                      <span key={s} className="px-2.5 py-1 text-[11px] font-medium bg-accent/10 text-accent rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorker(null)}
                className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2.5 rounded-lg transition-colors text-sm"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
