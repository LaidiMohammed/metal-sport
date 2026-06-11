'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/navbar';
import { InteractiveAnatomyViewer } from '@/components/interactive-anatomy-viewer';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Dumbbell, Clock, Flame, Target, Plus, Trash2, Play, Pencil,
  ChevronRight, CheckCircle2, XCircle, BarChart3, Calendar,
  Zap, Award, TrendingUp, X, Timer, ChevronLeft,
  Activity, Shield, Search, Move, List, Check,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { exercises } from '@/lib/exercises-data';

// ── Types ─────────────────────────────────────────────────────────────────────
interface WorkoutPlan {
  id: string;
  name: string;
  duration: number;
  exercises: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  gradient: string;
  icon: string;
  calories: number;
  muscles: string[];
  exerciseIds?: string[];
}

interface WorkoutLog {
  id: string;
  name: string;
  date: string;
  duration: number;
  exercises: number;
  completed: boolean;
  calories: number;
}

interface ScheduledWorkout {
  id: string;
  date: string;
  time: string;
  planId: string;
  name: string;
  exerciseIds: string[];
}

// ── Lucide icon map for plans ──────────────────────────────────────────────
const PLAN_ICONS: Record<string, React.ComponentType<any>> = {
  '1': Dumbbell, '2': Zap, '3': Activity, '4': Target, '5': TrendingUp, '6': Shield, 'List': List,
};

// ── Data ──────────────────────────────────────────────────────────────────────
const PLANS: WorkoutPlan[] = [
  {
    id: '1', name: 'Upper Body Strength', duration: 60, exercises: 8,
    difficulty: 'Intermediate', category: 'Strength',
    gradient: 'linear-gradient(135deg, #00d4aa 0%, #0891b2 100%)',
    icon: 'Dumbbell', calories: 420, muscles: ['Chest', 'Back', 'Shoulders'],
  },
  {
    id: '2', name: 'Lower Body Power', duration: 50, exercises: 6,
    difficulty: 'Advanced', category: 'Power',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
    icon: 'Zap', calories: 510, muscles: ['Quads', 'Glutes', 'Hamstrings'],
  },
  {
    id: '3', name: 'Full Body HIIT', duration: 35, exercises: 10,
    difficulty: 'Beginner', category: 'HIIT',
    gradient: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
    icon: 'Activity', calories: 380, muscles: ['Full Body'],
  },
  {
    id: '4', name: 'Core & Stability', duration: 30, exercises: 7,
    difficulty: 'Beginner', category: 'Core',
    gradient: 'linear-gradient(135deg, #22c55e 0%, #059669 100%)',
    icon: 'Target', calories: 250, muscles: ['Abs', 'Obliques', 'Lower Back'],
  },
  {
    id: '5', name: 'Chest & Triceps', duration: 55, exercises: 9,
    difficulty: 'Intermediate', category: 'Strength',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
    icon: 'TrendingUp', calories: 390, muscles: ['Chest', 'Triceps'],
  },
  {
    id: '6', name: 'Back & Biceps', duration: 60, exercises: 8,
    difficulty: 'Advanced', category: 'Strength',
    gradient: 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
    icon: 'Shield', calories: 450, muscles: ['Lats', 'Biceps', 'Rear Delts'],
  },
];

const INITIAL_LOGS: WorkoutLog[] = [
  { id: '1', name: 'Chest Day', date: '2024-01-15', duration: 52, exercises: 7, completed: true, calories: 390 },
  { id: '2', name: 'Leg Day', date: '2024-01-14', duration: 48, exercises: 6, completed: true, calories: 470 },
  { id: '3', name: 'Back & Biceps', date: '2024-01-13', duration: 55, exercises: 8, completed: false, calories: 420 },
  { id: '4', name: 'Shoulder Press', date: '2024-01-12', duration: 40, exercises: 5, completed: true, calories: 310 },
  { id: '5', name: 'Core Blast', date: '2024-01-11', duration: 30, exercises: 7, completed: true, calories: 240 },
];

const DIFFICULTY_STYLE: Record<string, { bg: string; text: string }> = {
  Beginner:     { bg: 'rgba(34,197,94,0.15)',  text: '#4ade80' },
  Intermediate: { bg: 'rgba(245,158,11,0.15)', text: '#fbbf24' },
  Advanced:     { bg: 'rgba(239,68,68,0.15)',  text: '#f87171' },
};

const TABS = ['My Plans', 'Planner', 'History', 'Statistics'];

// ── Page ──────────────────────────────────────────────────────────────────────
export default function WorkoutsPage() {
  useAuthProtected();
  const user = useStore((s) => s.user);

  const [logs, setLogs] = useState<WorkoutLog[]>(INITIAL_LOGS);
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [anatomyCategory, setAnatomyCategory] = useState<string | null>(null);

  // Workout modal state
  const [workoutRunning, setWorkoutRunning] = useState(false);
  const [workoutElapsed, setWorkoutElapsed] = useState(0);
  const [workoutCompleted, setWorkoutCompleted] = useState<string[]>([]);
  const workoutTimerRef = useRef<any>(null);

  // Custom plan state
  const [showCustomPlanner, setShowCustomPlanner] = useState(false);
  const [customPlans, setCustomPlans] = useState<WorkoutPlan[]>([]);
  const [customName, setCustomName] = useState('');
  const [customExIds, setCustomExIds] = useState<string[]>([]);
  const [customSearch, setCustomSearch] = useState('');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('kimo-custom-plans');
      if (stored) setCustomPlans(JSON.parse(stored));
    } catch {}
  }, []);

  const saveCustomPlan = () => {
    if (!customName.trim() || customExIds.length === 0) return;
    const matched = exercises.filter(e => customExIds.includes(e.id));
    const muscles = [...new Set(matched.map(e => e.primaryMuscle))];
    const newPlan: WorkoutPlan = {
      id: 'custom_' + Date.now(),
      name: customName.trim(),
      duration: customExIds.length * 5,
      exercises: customExIds.length,
      difficulty: 'Beginner',
      category: 'Custom',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
      icon: 'List',
      calories: customExIds.length * 50,
      muscles: muscles.length > 0 ? muscles : ['Custom'],
      exerciseIds: customExIds,
    };
    const updated = [...customPlans, newPlan];
    setCustomPlans(updated);
    localStorage.setItem('kimo-custom-plans', JSON.stringify(updated));
    setCustomName(''); setCustomExIds([]); setCustomSearch('');
    setShowCustomPlanner(false);
  };

  const deleteCustomPlan = (id: string) => {
    const updated = customPlans.filter(p => p.id !== id);
    setCustomPlans(updated);
    localStorage.setItem('kimo-custom-plans', JSON.stringify(updated));
  };

  // Merge preset + custom plans
  const allPlans = [...PLANS, ...customPlans];

  useEffect(() => {
    if (workoutRunning) { workoutTimerRef.current = setInterval(() => setWorkoutElapsed(p => p + 1), 1000); }
    else clearInterval(workoutTimerRef.current);
    return () => clearInterval(workoutTimerRef.current);
  }, [workoutRunning]);

  // Planner state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [scheduled, setScheduled] = useState<ScheduledWorkout[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState('09:00');
  const [editingScheduleId, setEditingScheduleId] = useState<string | null>(null);
  const [editingExerciseIds, setEditingExerciseIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Stats state (fetched from API) ───────────────────────────────────────
  const [workoutStats, setWorkoutStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const fetchStats = async () => {
    if (!user?.id) return;
    setStatsLoading(true);
    try {
      const res = await fetch(`/api/workouts/stats?userId=${user.id}`);
      if (res.ok) setWorkoutStats(await res.json());
    } catch {} finally { setStatsLoading(false); }
  };

  useEffect(() => { fetchStats(); }, [user?.id]);

  // ── Supabase sync ────────────────────────────────────────────────────────
  const fetchWorkouts = async () => {
    if (!user?.id) return;
    try {
      const res = await fetch(`/api/workouts?userId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        const completed = data.filter((w: any) => w.completed).map((w: any) => ({
          id: w.id,
          name: w.exercise_id,
          date: w.date?.split('T')[0] || '',
          duration: w.duration || 0,
          exercises: 1,
          completed: true,
          calories: 0,
        }));
        const planned = data.filter((w: any) => !w.completed).map((w: any) => ({
          id: w.id,
          date: w.date?.split('T')[0] || '',
          time: '09:00',
          planId: '1',
          name: w.exercise_id,
          exerciseIds: [],
        }));
        if (completed.length) setLogs(completed);
        if (planned.length) setScheduled(planned);
      }
    } catch {}
  };

  const saveCompletedWorkout = async (name: string, duration: number) => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          exercise_id: name,
          duration,
          reps: 0,
          completed: true,
          date: new Date().toISOString(),
        }),
      });
      if (res.ok) fetchWorkouts();
    } catch {}
  };

  const saveScheduledWorkout = async (date: string, name: string) => {
    if (!user?.id) return;
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          exercise_id: name,
          duration: 0,
          reps: 0,
          completed: false,
          date,
        }),
      });
      if (res.ok) fetchWorkouts();
    } catch {}
  };

  useEffect(() => { fetchWorkouts(); }, [user?.id]);

  const getExercisesForPlan = (plan: WorkoutPlan) => {
    if (plan.exerciseIds && plan.exerciseIds.length > 0) {
      return exercises.filter(e => plan.exerciseIds!.includes(e.id));
    }
    const keywords = plan.muscles.flatMap(m => m.toLowerCase().split(' & ').flatMap(s => s.split(' ')));
    return exercises.filter(e => {
      const target = (e.primaryMuscle + ' ' + e.category + ' ' + e.name).toLowerCase();
      return keywords.some(k => target.includes(k));
    }).slice(0, 8);
  };

  const calFirst = new Date(calYear, calMonth, 1);
  const calLast = new Date(calYear, calMonth + 1, 0);
  const calStartDay = calFirst.getDay();
  const calDays = calLast.getDate();
  const calGrid: (number | null)[] = Array(calStartDay).fill(null);
  for (let d = 1; d <= calDays; d++) calGrid.push(d);
  while (calGrid.length % 7) calGrid.push(null);

  const calMonths = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const scheduleForDate = (dateStr: string) => scheduled.filter(s => s.date === dateStr);

  const formatDate = (d: Date) => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;

  const addSchedule = () => {
    if (!selectedDate || !selectedPlanId) return;
    const plan = PLANS.find(p => p.id === selectedPlanId);
    if (!plan) return;
    const newSched: ScheduledWorkout = {
      id: editingScheduleId || Date.now().toString(),
      date: selectedDate,
      time: selectedTime,
      planId: selectedPlanId,
      name: plan.name,
      exerciseIds: editingExerciseIds,
    };
    if (editingScheduleId) {
      fetch(`/api/workouts?id=${editingScheduleId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ exercise_id: plan.name, date: selectedDate }) });
    } else {
      saveScheduledWorkout(selectedDate, plan.name);
    }
    setScheduled(editingScheduleId ? scheduled.map(s => s.id === editingScheduleId ? newSched : s) : [...scheduled, newSched]);
    setEditingScheduleId(null);
    setSelectedPlanId(null);
    setEditingExerciseIds([]);
    setSearchQuery('');
  };

  const deleteSchedule = async (id: string) => {
    const res = await fetch(`/api/workouts?id=${id}`, { method: 'DELETE' });
    if (res.ok) setScheduled(scheduled.filter(s => s.id !== id));
  };
  const editSchedule = (s: ScheduledWorkout) => {
    setSelectedDate(s.date);
    setSelectedPlanId(s.planId);
    setSelectedTime(s.time);
    setEditingScheduleId(s.id);
    setEditingExerciseIds(s.exerciseIds);
  };

  const filteredPlans = useMemo(() => {
    const source = [...PLANS, ...customPlans];
    if (!anatomyCategory) return source;
    return source.filter((plan) =>
      plan.muscles.some((m) =>
        m.toLowerCase().includes(anatomyCategory.toLowerCase()) ||
        (anatomyCategory === 'Arms' && ['Biceps', 'Triceps', 'Forearms'].some((a) => m.toLowerCase().includes(a.toLowerCase()))) ||
        (anatomyCategory === 'Core' && ['Abs', 'Obliques'].some((c) => c.toLowerCase().includes(c.toLowerCase()))) ||
        (anatomyCategory === 'Legs' && ['Quads', 'Glutes', 'Hamstrings', 'Calves'].some((l) => l.toLowerCase().includes(l.toLowerCase()))) ||
        (anatomyCategory === 'Back' && ['Lats', 'Traps'].some((b) => b.toLowerCase().includes(b.toLowerCase()))) ||
        (anatomyCategory === 'Chest' && m.toLowerCase().includes('chest'))
      )
    );
  }, [anatomyCategory, customPlans]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "start -0.15"],
  });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const subtitleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  const totalDuration   = logs.reduce((s, w) => s + w.duration, 0);
  const completedCount  = logs.filter((w) => w.completed).length;
  const totalCalories   = logs.reduce((s, w) => s + w.calories, 0);
  const completionRate  = logs.length ? Math.round((completedCount / logs.length) * 100) : 0;

  const stats = [
    { label: 'Total Workouts', value: logs.length,      icon: Dumbbell,  color: '#00d4aa', suffix: '' },
    { label: 'Completed',      value: completedCount,   icon: CheckCircle2, color: '#4ade80', suffix: '' },
    { label: 'Total Time',     value: totalDuration,    icon: Clock,     color: '#f59e0b', suffix: 'm' },
    { label: 'Calories Burned',value: totalCalories,    icon: Flame,     color: '#ef4444', suffix: '' },
  ];

  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekActivity = [1, 1, 0, 1, 0, 1, 1]; // 1 = worked out

  return (
    <div className="min-h-screen bg-background pt-14">
      <Navbar />

      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '64px 0 56px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <motion.div
          className="hidden md:block"
          style={{
            position: 'absolute', top: -80, right: '10%',
            width: 500, height: 500,
            background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', position: 'relative' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00d4aa, #00b896)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell style={{ width: 16, height: 16, color: '#000' }} />
              </div>
              <span style={{ color: '#00d4aa', fontSize: 13, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                My Workouts
              </span>
            </div>
            <motion.h1 style={{ color: '#fff', fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 10, scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
              Train Hard,<br />
              <span style={{ background: 'linear-gradient(90deg, #00d4aa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Get Results
              </span>
            </motion.h1>
            <motion.p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16, y: subtitleY, opacity: subtitleOpacity }}>
              Welcome back{user?.name ? `, ${user.name}` : ''}! Keep pushing your limits.
            </motion.p>
          </motion.div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-9">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                style={{
                  padding: '20px', borderRadius: 16,
                  background: 'rgba(var(--card-rgb, 18,18,18), 0.5)',
                  border: '1px solid var(--border)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {s.label}
                  </span>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon style={{ width: 16, height: 16, color: s.color }} />
                  </div>
                </div>
                <p style={{ color: '#fff', fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em' }}>
                  {s.value}<span style={{ color: s.color, fontSize: 16 }}>{s.suffix}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', border: '1px solid var(--border)', borderRadius: 14, marginBottom: 36, width: 'fit-content' }}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '10px 24px', borderRadius: 10, border: 'none', cursor: 'pointer',
                fontWeight: 600, fontSize: 14, transition: 'all 0.2s',
                background: activeTab === i ? 'linear-gradient(135deg, #00d4aa, #00b896)' : 'transparent',
                color: activeTab === i ? '#000' : 'rgba(255,255,255,0.5)',
                boxShadow: activeTab === i ? '0 4px 14px rgba(0,212,170,0.3)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* ── TAB 0: My Plans ───────────────────────────────────────────── */}
          {activeTab === 0 && (
            <motion.div key="plans" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
              {/* 3D viewer + plans grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-8">
                {/* Left: 3D interactive body */}
                <div>
                  <InteractiveAnatomyViewer
                    selectedCategory={anatomyCategory}
                    onSelectCategory={(cat) => setAnatomyCategory(cat)}
                  />
                  {anatomyCategory && (
                    <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontWeight: 600 }}>
                        Showing plans for <span style={{ color: '#00d4aa' }}>{anatomyCategory}</span>
                      </span>
                      <button
                        onClick={() => setAnatomyCategory(null)}
                        style={{
                          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: 8, padding: '4px 10px', cursor: 'pointer',
                          color: 'rgba(255,255,255,0.5)', fontSize: 11, fontWeight: 600,
                        }}
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                {/* Right: plan list */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>
                      {anatomyCategory ? `${filteredPlans.length} Plans` : 'Preset Plans'}
                    </h2>
                    <motion.button
                      whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                      onClick={() => { setCustomName(''); setCustomExIds([]); setCustomSearch(''); setShowCustomPlanner(true); }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '10px 20px', borderRadius: 10, border: 'none',
                        background: 'linear-gradient(135deg, #00d4aa, #00b896)',
                        color: '#000', fontWeight: 700, fontSize: 14, cursor: 'pointer',
                      }}
                    >
                      <Plus style={{ width: 16, height: 16 }} />
                      Custom
                    </motion.button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 460, overflowY: 'auto', paddingRight: 4 }}>
                    {filteredPlans.length === 0 ? (
                      <div style={{ padding: 40, textAlign: 'center', borderRadius: 20, background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', border: '1px solid var(--border)' }}>
                        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>No plans for this muscle group yet</p>
                      </div>
                    ) : (
                      filteredPlans.map((plan, i) => {
                        const diff = DIFFICULTY_STYLE[plan.difficulty];
                        return (
                          <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ scale: 1.01, transition: { duration: 0.15 } }}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px',
                              borderRadius: 16, border: '1px solid var(--border)',
                              background: 'rgba(var(--card-rgb, 18,18,18), 0.5)',
                              cursor: 'pointer',
                            }}
                            onClick={() => setActivePlan(plan)}
                          >
                            {/* Gradient bar */}
                            <div style={{ width: 4, height: 48, borderRadius: 99, background: plan.gradient, flexShrink: 0 }} />

                            <div style={{ width: 40, height: 40, borderRadius: 10, background: `${plan.gradient}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              {(() => { const Icon = PLAN_ICONS[plan.id]; return Icon ? <Icon style={{ width: 18, height: 18, color: '#fff' }} /> : null; })()}
                            </div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                <h3 style={{ color: '#fff', fontWeight: 800, fontSize: 15, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{plan.name}</h3>
                                <span style={{ padding: '2px 8px', borderRadius: 20, fontSize: 10, fontWeight: 700, background: diff.bg, color: diff.text, whiteSpace: 'nowrap' }}>
                                  {plan.difficulty}
                                </span>
                              </div>
                              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{plan.muscles.join(' · ')}</p>
                              <div style={{ display: 'flex', gap: 14, marginTop: 6 }}>
                                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Clock style={{ width: 11, height: 11 }} /> {plan.duration}m
                                </span>
                                <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                                  <Flame style={{ width: 11, height: 11 }} /> {plan.calories} kcal
                                </span>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              onClick={(e) => { e.stopPropagation(); setActivePlan(plan); }}
                              style={{
                                width: 36, height: 36, borderRadius: 10, border: 'none',
                                background: plan.gradient, color: '#fff', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                              }}
                            >
                              <Play style={{ width: 14, height: 14 }} />
                            </motion.button>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── TAB 1: Planner ──────────────────────────────────────────── */}
          {activeTab === 1 && (
            <motion.div key="planner" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                {/* Calendar */}
                <div style={{ padding: 24, borderRadius: 20, background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <button onClick={() => { if (calMonth === 0) { setCalYear(calYear-1); setCalMonth(11); } else setCalMonth(calMonth-1); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4 }}>
                      <ChevronLeft style={{ width: 18, height: 18 }} />
                    </button>
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>{calMonths[calMonth]} {calYear}</h3>
                    <button onClick={() => { if (calMonth === 11) { setCalYear(calYear+1); setCalMonth(0); } else setCalMonth(calMonth+1); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: 4 }}>
                      <ChevronRight style={{ width: 18, height: 18 }} />
                    </button>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
                    {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => <div key={d} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, padding: '4px 0' }}>{d}</div>)}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
                    {calGrid.map((day, i) => {
                      if (day === null) return <div key={`e${i}`} />;
                      const dateStr = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
                      const scheds = scheduleForDate(dateStr);
                      const plan = scheds.length ? PLANS.find(p => p.id === scheds[0].planId) : null;
                      const isToday = dateStr === formatDate(today);
                      const isSelected = dateStr === selectedDate;
                      return (
                        <motion.button
                          key={dateStr}
                          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedDate(dateStr)}
                          style={{
                            aspectRatio: '1', borderRadius: 10, border: 'none', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
                            background: isSelected ? 'linear-gradient(135deg, #00d4aa, #00b896)' : isToday ? 'rgba(0,212,170,0.12)' : 'transparent',
                            color: isSelected ? '#000' : isToday ? '#00d4aa' : 'rgba(255,255,255,0.7)',
                            fontWeight: isSelected || isToday ? 700 : 500, fontSize: 13,
                          }}
                        >
                          {day}
                          {plan && <div style={{ width: 5, height: 5, borderRadius: '50%', background: plan.gradient }} />}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Schedule form */}
                <div style={{ padding: 24, borderRadius: 20, background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', border: '1px solid var(--border)' }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
                    {editingScheduleId ? 'Edit Schedule' : selectedDate ? `Schedule — ${selectedDate}` : 'Select a day'}
                  </h3>
                  {selectedDate && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {/* Plan picker */}
                      <div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Choose Program</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxHeight: 180, overflowY: 'auto' }}>
                          {[...PLANS, ...customPlans].map(p => (
                            <motion.button
                              key={p.id}
                              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                              onClick={() => { setSelectedPlanId(p.id); if (editingScheduleId) setEditingExerciseIds(getExercisesForPlan(p).map(e => e.id)); }}
                              style={{
                                flex: '1 0 calc(50% - 3px)', padding: '10px', borderRadius: 10, border: '2px solid',
                                cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', minWidth: 0,
                                background: selectedPlanId === p.id ? p.gradient : 'rgba(var(--card-rgb, 18,18,18), 0.5)',
                                borderColor: selectedPlanId === p.id ? 'transparent' : 'var(--border)',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                {(() => { const Icon = PLAN_ICONS[p.id]; return Icon ? <Icon style={{ width: 16, height: 16, color: selectedPlanId === p.id ? '#fff' : 'rgba(255,255,255,0.5)' }} /> : null; })()}
                                <span style={{ color: selectedPlanId === p.id ? '#fff' : 'rgba(255,255,255,0.7)', fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</span>
                              </div>
                              <p style={{ color: selectedPlanId === p.id ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.3)', fontSize: 10, marginTop: 2 }}>{p.duration}min · {p.exercises} exercises</p>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      {/* Time picker */}
                      <div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>Time</p>
                        <input type="time" value={selectedTime} onChange={e => setSelectedTime(e.target.value)}
                          style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)',
                            background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', color: '#fff', fontSize: 14, outline: 'none' }}
                        />
                      </div>
                      {/* Exercise list with add/remove */}
                      {selectedPlanId && (() => {
                        const plan = PLANS.find(p => p.id === selectedPlanId);
                        if (!plan) return null;
                        const matched = getExercisesForPlan(plan);
                        if (!editingScheduleId && editingExerciseIds.length === 0) {
                          setEditingExerciseIds(matched.map(e => e.id));
                        }
                        const selectedExercises = editingExerciseIds.map(id => exercises.find(e => e.id === id)).filter(Boolean) as typeof exercises;
                        const searchFiltered = searchQuery ? exercises.filter(e =>
                          e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.primaryMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.equipment.toLowerCase().includes(searchQuery.toLowerCase())
                        ).filter(e => !editingExerciseIds.includes(e.id)) : [];
                        return (
                          <div>
                            {/* Selected exercises */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Selected Exercises ({selectedExercises.length})
                              </p>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8 }}>
                              {selectedExercises.map((e, idx) => (
                                <motion.div key={e.id} layout
                                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 8, background: 'rgba(0,212,170,0.06)', border: '1px solid rgba(0,212,170,0.15)' }}
                                >
                                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, fontWeight: 700, minWidth: 14 }}>{idx + 1}</span>
                                  <span style={{ width: 22, height: 22, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}>
                                    <img src={e.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(ev) => { (ev.target as HTMLImageElement).style.display = 'none'; }} />
                                  </span>
                                  <span style={{ color: '#fff', fontSize: 12, fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</span>
                                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{e.equipment}</span>
                                  <motion.button whileTap={{ scale: 0.85 }}
                                    onClick={() => setEditingExerciseIds(editingExerciseIds.filter(id => id !== e.id))}
                                    style={{ background: 'rgba(239,68,68,0.15)', border: 'none', borderRadius: 6, cursor: 'pointer', padding: 3, display: 'flex', lineHeight: 0 }}
                                  >
                                    <X style={{ width: 12, height: 12, color: '#ef4444' }} />
                                  </motion.button>
                                </motion.div>
                              ))}
                            </div>
                            {/* Search to add */}
                            <div style={{ position: 'relative' }}>
                              <input
                                placeholder="Search exercises to add…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                style={{
                                  width: '100%', padding: '8px 10px 8px 30px', borderRadius: 8, fontSize: 12, outline: 'none',
                                  border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: '#fff',
                                }}
                              />
                              <Search style={{ position: 'absolute', left: 9, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.2)', width: 14, height: 14, pointerEvents: 'none' }} />
                            </div>
                            {searchFiltered.length > 0 && (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginTop: 6, maxHeight: 130, overflowY: 'auto', padding: '4px 0' }}>
                                {searchFiltered.slice(0, 12).map(e => (
                                  <motion.div key={e.id} layout initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                                    onClick={() => { setEditingExerciseIds([...editingExerciseIds, e.id]); setSearchQuery(''); }}
                                    style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 6, cursor: 'pointer', background: 'rgba(255,255,255,0.03)', border: '1px solid transparent', transition: 'all 0.1s' }}
                                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                                  >
                                    <span style={{ width: 20, height: 20, borderRadius: 4, overflow: 'hidden', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }}>
                                      <img src={e.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(ev) => { (ev.target as HTMLImageElement).style.display = 'none'; }} />
                                    </span>
                                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.name}</span>
                                    <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, whiteSpace: 'nowrap' }}>{e.equipment}</span>
                                    <Plus style={{ width: 12, height: 12, color: '#00d4aa', flexShrink: 0 }} />
                                  </motion.div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })()}
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={addSchedule}
                        disabled={!selectedPlanId}
                        style={{
                          padding: '12px', borderRadius: 12, border: 'none', cursor: selectedPlanId ? 'pointer' : 'not-allowed',
                          background: selectedPlanId ? 'linear-gradient(135deg, #00d4aa, #00b896)' : 'rgba(255,255,255,0.08)',
                          color: selectedPlanId ? '#000' : 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 14,
                        }}
                      >
                        {editingScheduleId ? 'Update Schedule' : 'Add to Calendar'}
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>

              {/* Scheduled list */}
              {scheduled.length > 0 && (
                <div style={{ padding: 24, borderRadius: 20, background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', border: '1px solid var(--border)' }}>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Upcoming Workouts ({scheduled.length})</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[...scheduled].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time)).map((s) => {
                      const plan = PLANS.find(p => p.id === s.planId);
                      const exNames = s.exerciseIds.map(id => exercises.find(e => e.id === id)?.name).filter(Boolean);
                      return (
                        <motion.div key={s.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                          style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}
                        >
                          <div style={{ width: 4, height: 36, borderRadius: 99, background: plan?.gradient || 'var(--border)', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>{s.name}</span>
                              {(() => { if (!plan) return <Dumbbell style={{ width: 16, height: 16, color: 'rgba(255,255,255,0.3)' }} />; const Icon = PLAN_ICONS[plan.id]; return Icon ? <Icon style={{ width: 16, height: 16 }} /> : null; })()}
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'flex', gap: 12, marginTop: 2 }}>
                              <span>{s.date}</span>
                              <span>{s.time}</span>
                              <span>{exNames.length} exercises</span>
                            </p>
                          </div>
                          <button onClick={() => editSchedule(s)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4 }}>
                            <Pencil style={{ width: 14, height: 14 }} />
                          </button>
                          <button onClick={() => deleteSchedule(s.id)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4 }}>
                            <Trash2 style={{ width: 14, height: 14 }} />
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ── TAB 2: History ────────────────────────────────────────────── */}
          {activeTab === 2 && (
            <motion.div key="history" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
                <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800 }}>Workout History</h2>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>{logs.length} sessions logged</span>
              </div>

              {/* Weekly calendar strip */}
              <div style={{
                display: 'flex', gap: 8, padding: '16px 20px', marginBottom: 24,
                background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', borderRadius: 16,
                border: '1px solid var(--border)',
              }}>
                {weekDays.map((day, i) => (
                  <div key={day} style={{ flex: 1, textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 8 }}>{day}</p>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%', margin: '0 auto',
                      background: weekActivity[i] ? 'linear-gradient(135deg, #00d4aa, #00b896)' : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {weekActivity[i] ? <CheckCircle2 style={{ width: 16, height: 16, color: '#000' }} /> : null}
                    </div>
                  </div>
                ))}
              </div>

              {/* Completion bar */}
              <div style={{ marginBottom: 28, padding: '16px 20px', background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', borderRadius: 16, border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 600 }}>Weekly Completion Rate</span>
                  <span style={{ color: '#00d4aa', fontSize: 13, fontWeight: 700 }}>{completionRate}%</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 99, overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                    style={{ height: '100%', background: 'linear-gradient(90deg, #00d4aa, #22d3ee)', borderRadius: 99 }}
                  />
                </div>
              </div>

              {/* Log list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {logs.map((log, i) => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '18px 20px',
                      background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', borderRadius: 14,
                      border: `1px solid ${log.completed ? 'rgba(0,212,170,0.15)' : 'var(--border)'}`,
                    }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: log.completed ? 'rgba(0,212,170,0.12)' : 'rgba(239,68,68,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {log.completed
                        ? <CheckCircle2 style={{ width: 22, height: 22, color: '#00d4aa' }} />
                        : <XCircle style={{ width: 22, height: 22, color: '#f87171' }} />
                      }
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{log.name}</h3>
                        <span style={{
                          padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                          background: log.completed ? 'rgba(0,212,170,0.15)' : 'rgba(239,68,68,0.15)',
                          color: log.completed ? '#00d4aa' : '#f87171',
                        }}>
                          {log.completed ? 'Completed' : 'Missed'}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        {[
                          { icon: Calendar, text: log.date },
                          { icon: Clock,    text: `${log.duration}m` },
                          { icon: Target,   text: `${log.exercises} exercises` },
                          { icon: Flame,    text: `${log.calories} kcal` },
                        ].map((m) => (
                          <span key={m.text} style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>
                            <m.icon style={{ width: 12, height: 12 }} />
                            {m.text}
                          </span>
                        ))}
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={async () => { await fetch(`/api/workouts?id=${log.id}`, { method: 'DELETE' }); setLogs(logs.filter((l) => l.id !== log.id)); }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.25)', padding: 8, borderRadius: 8 }}
                    >
                      <Trash2 style={{ width: 16, height: 16 }} />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── TAB 3: Statistics ─────────────────────────────────────────── */}
          {activeTab === 3 && (
            <motion.div key="stats" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}>
              <h2 style={{ color: '#fff', fontSize: 22, fontWeight: 800, marginBottom: 24 }}>Your Progress</h2>
              {statsLoading ? (
                <p style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center', padding: 40 }}>Loading stats...</p>
              ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8">
                {/* Personal Bests */}
                <div style={{ padding: 24, borderRadius: 20, background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <Award style={{ width: 20, height: 20, color: '#f59e0b' }} />
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Personal Bests</h3>
                  </div>
                  {(workoutStats?.personalBests?.length ?? 0) > 0 ? workoutStats.personalBests.map((pb: any) => (
                    <div key={pb.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>{pb.label}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ color: '#fff', fontWeight: 700, fontSize: 15 }}>{pb.value}</span>
                      </div>
                    </div>
                  )) : (
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No personal records yet. Start logging!</p>
                  )}
                </div>

                {/* Volume trend */}
                <div style={{ padding: 24, borderRadius: 20, background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <BarChart3 style={{ width: 20, height: 20, color: '#00d4aa' }} />
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Weekly Volume</h3>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120, marginBottom: 4 }}>
                    {(workoutStats?.weeklyVolume ?? [{ day: 'Mon', pct: 0 }, { day: 'Tue', pct: 0 }, { day: 'Wed', pct: 0 }, { day: 'Thu', pct: 0 }, { day: 'Fri', pct: 0 }, { day: 'Sat', pct: 0 }, { day: 'Sun', pct: 0 }]).map((d: any, i: number) => (
                      <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${d.pct}%` }}
                          transition={{ delay: i * 0.06, duration: 0.6, ease: 'easeOut' }}
                          style={{
                            width: '100%', borderRadius: '4px 4px 0 0',
                            background: i === 6 ? 'linear-gradient(180deg, #00d4aa, #00b896)' : 'rgba(0,212,170,0.25)',
                          }}
                        />
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10 }}>{d.day.slice(0, 1)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Streak + Goals */}
                <div style={{ padding: 24, borderRadius: 20, background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <Zap style={{ width: 20, height: 20, color: '#f59e0b' }} />
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Streak & Goals</h3>
                  </div>
                  <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <Flame style={{ width: 56, height: 56, color: '#f59e0b', margin: '0 auto 8px' }} />
                    <p style={{ color: '#fff', fontSize: 42, fontWeight: 900, letterSpacing: '-0.03em' }}>{workoutStats?.streak ?? 0}</p>
                    <p style={{ color: '#f59e0b', fontSize: 14, fontWeight: 600 }}>Day Streak</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, marginTop: 8 }}>Best: {workoutStats?.bestStreak ?? 0} days</p>
                  </div>
                </div>

                {/* Muscle distribution */}
                <div style={{ padding: 24, borderRadius: 20, background: 'rgba(var(--card-rgb, 18,18,18), 0.5)', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                    <TrendingUp style={{ width: 20, height: 20, color: '#a855f7' }} />
                    <h3 style={{ color: '#fff', fontWeight: 700, fontSize: 16 }}>Muscle Focus</h3>
                  </div>
                  {(workoutStats?.muscleFocus?.length ?? 0) > 0 ? workoutStats.muscleFocus.map((m: any) => (
                    <div key={m.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13 }}>{m.label}</span>
                        <span style={{ color: m.color, fontSize: 13, fontWeight: 600 }}>{m.pct}%</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.08)', borderRadius: 99 }}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.pct}%` }}
                          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
                          style={{ height: '100%', background: m.color, borderRadius: 99 }}
                        />
                      </div>
                    </div>
                  )) : (
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: '16px 0' }}>No data yet. Complete some workouts!</p>
                  )}
                </div>
              </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Workout Modal (exercises + stopwatch + save) ───────────────────── */}
      <AnimatePresence>
        {activePlan && (() => {
          const planExercises = getExercisesForPlan(activePlan);
          const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
          const toggleEx = (id: string) => setWorkoutCompleted(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
          const finishWorkout = async () => {
            if (!activePlan) return;
            for (const ex of planExercises) {
              if (workoutCompleted.includes(ex.id)) {
                await fetch('/api/workouts', {
                  method: 'POST', headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ user_id: user?.id, exercise_id: `${activePlan.name} — ${ex.name}`, duration: Math.round(workoutElapsed / planExercises.length), reps: 12, completed: true, date: new Date().toISOString() }),
                });
              }
            }
            if (workoutCompleted.length > 0) await saveCompletedWorkout(activePlan.name, workoutElapsed);
            setWorkoutRunning(false); setWorkoutElapsed(0); setWorkoutCompleted([]); setActivePlan(null);
          };

          return (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
              onClick={() => { if (!workoutRunning) { setActivePlan(null); setWorkoutElapsed(0); setWorkoutCompleted([]); } }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 30 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 30 }}
                transition={{ type: 'spring', damping: 22, stiffness: 260 }}
                style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, maxWidth: 500, width: '100%', maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${activePlan.gradient}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {(() => { const Icon = PLAN_ICONS[activePlan.id]; return Icon ? <Icon style={{ width: 22, height: 22, color: '#fff' }} /> : null; })()}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>{activePlan.name}</h2>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{activePlan.muscles.join(' • ')} · {planExercises.length} exercises</p>
                  </div>
                  <button onClick={() => { setActivePlan(null); setWorkoutRunning(false); setWorkoutElapsed(0); setWorkoutCompleted([]); }} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff' }}>
                    <X style={{ width: 16, height: 16 }} />
                  </button>
                </div>

                {/* Stopwatch */}
                <div style={{ padding: '16px 24px', background: 'rgba(0,212,170,0.05)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Timer style={{ width: 18, height: 18, color: '#00d4aa' }} />
                    <span style={{ color: '#fff', fontSize: 28, fontWeight: 800, fontFamily: 'monospace', letterSpacing: '0.05em' }}>{fmt(workoutElapsed)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {!workoutRunning ? (
                      <button onClick={() => setWorkoutRunning(true)} style={{ padding: '8px 18px', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg, #00d4aa, #00b896)', color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                        <Play style={{ width: 14, height: 14 }} /> Démarrer
                      </button>
                    ) : (
                      <button onClick={() => setWorkoutRunning(false)} style={{ padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 13, cursor: 'pointer' }}>
                        Pause
                      </button>
                    )}
                    {workoutElapsed > 0 && !workoutRunning && (
                      <button onClick={() => { setWorkoutElapsed(0); setWorkoutCompleted([]); }} style={{ padding: '8px', borderRadius: 8, border: 'none', background: 'rgba(255,255,255,0.08)', color: '#fff', cursor: 'pointer' }}>
                        <X style={{ width: 14, height: 14 }} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Exercise list */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '12px 24px 20px' }}>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>{workoutCompleted.length}/{planExercises.length} Exercise{planExercises.length > 1 ? 's' : ''} completed</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {planExercises.map((ex, i) => {
                      const done = workoutCompleted.includes(ex.id);
                      return (
                        <motion.div
                          key={ex.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                          onClick={() => workoutRunning && toggleEx(ex.id)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 12, cursor: workoutRunning ? 'pointer' : 'default',
                            background: done ? 'rgba(0,212,170,0.08)' : 'rgba(255,255,255,0.03)',
                            border: `1px solid ${done ? 'rgba(0,212,170,0.2)' : 'var(--border)'}`,
                            transition: 'all 0.15s',
                          }}
                        >
                          <div style={{ width: 36, height: 36, borderRadius: 8, overflow: 'hidden', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
                            <img src={ex.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(ev) => { (ev.target as HTMLImageElement).style.display = 'none'; }} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                              <span style={{ color: done ? '#00d4aa' : '#fff', fontWeight: 700, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.name}</span>
                              <span style={{ padding: '1px 6px', borderRadius: 10, fontSize: 9, fontWeight: 600, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap' }}>{ex.equipment}</span>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 1 }}>{ex.primaryMuscle} · {ex.difficulty}</p>
                          </div>
                          <div style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: done ? '#00d4aa' : 'rgba(255,255,255,0.08)', border: `2px solid ${done ? '#00d4aa' : 'rgba(255,255,255,0.15)'}`, transition: 'all 0.2s' }}>
                            {done && <Check style={{ width: 14, height: 14, color: '#000' }} />}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={finishWorkout} disabled={workoutCompleted.length === 0}
                    style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: workoutCompleted.length > 0 ? 'linear-gradient(135deg, #00d4aa, #00b896)' : 'rgba(255,255,255,0.08)', color: workoutCompleted.length > 0 ? '#000' : 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 14, cursor: workoutCompleted.length > 0 ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <Check style={{ width: 16, height: 16 }} /> Terminer ({workoutCompleted.length}/{planExercises.length})
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => { setActivePlan(null); setWorkoutRunning(false); setWorkoutElapsed(0); setWorkoutCompleted([]); }}
                    style={{ padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                    Fermer
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* ── Custom Plan Creator Modal ── */}
      <AnimatePresence>
        {showCustomPlanner && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={() => setShowCustomPlanner(false)}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              style={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 24, maxWidth: 480, width: '100%', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(168,85,247,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <List style={{ width: 20, height: 20, color: '#a855f7' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h2 style={{ color: '#fff', fontWeight: 800, fontSize: 17 }}>Custom Plan</h2>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Create your own workout routine</p>
                </div>
                <button onClick={() => setShowCustomPlanner(false)} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: '#fff' }}>
                  <X style={{ width: 16, height: 16 }} />
                </button>
              </div>

              <div style={{ padding: '16px 24px', overflowY: 'auto', flex: 1 }}>
                {/* Plan name */}
                <div style={{ marginBottom: 16 }}>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Plan Name</p>
                  <input value={customName} onChange={e => setCustomName(e.target.value)} placeholder="e.g. My Push Day"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: 14, outline: 'none' }} />
                </div>

                {/* Exercise search */}
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Exercises ({customExIds.length} selected)
                </p>
                <div style={{ position: 'relative', marginBottom: 8 }}>
                  <input value={customSearch} onChange={e => setCustomSearch(e.target.value)} placeholder="Search exercises…"
                    style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: 8, fontSize: 12, outline: 'none', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.04)', color: '#fff' }} />
                  <Search style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 13, height: 13, color: 'rgba(255,255,255,0.2)' }} />
                </div>

                {/* Exercise list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5, maxHeight: 260, overflowY: 'auto', paddingRight: 4 }}>
                  {exercises.filter(e => !customSearch || e.name.toLowerCase().includes(customSearch.toLowerCase()) || e.primaryMuscle.toLowerCase().includes(customSearch.toLowerCase())).map((ex, i) => {
                    const selected = customExIds.includes(ex.id);
                    return (
                      <motion.div key={ex.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.01 }}
                        onClick={() => setCustomExIds(p => selected ? p.filter(id => id !== ex.id) : [...p, ex.id])}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 10, cursor: 'pointer', background: selected ? 'rgba(168,85,247,0.12)' : 'rgba(255,255,255,0.03)', border: `1px solid ${selected ? 'rgba(168,85,247,0.25)' : 'transparent'}`, transition: 'all 0.12s' }}
                        onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; }}
                        onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'; }}
                      >
                        <div style={{ width: 28, height: 28, borderRadius: 6, overflow: 'hidden', background: 'rgba(255,255,255,0.06)', flexShrink: 0 }}>
                          <img src={ex.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                        </div>
                        <span style={{ color: selected ? '#c084fc' : 'rgba(255,255,255,0.8)', fontWeight: 600, fontSize: 12, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{ex.name}</span>
                        <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, whiteSpace: 'nowrap' }}>{ex.equipment}</span>
                        <div style={{ width: 22, height: 22, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: selected ? '#a855f7' : 'rgba(255,255,255,0.1)', border: `2px solid ${selected ? '#a855f7' : 'rgba(255,255,255,0.15)'}` }}>
                          {selected && <Check style={{ width: 12, height: 12, color: '#000' }} />}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border)', display: 'flex', gap: 10 }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={saveCustomPlan} disabled={!customName.trim() || customExIds.length === 0}
                  style={{ flex: 1, padding: '12px', borderRadius: 12, border: 'none', background: customName.trim() && customExIds.length > 0 ? 'linear-gradient(135deg, #a855f7, #6366f1)' : 'rgba(255,255,255,0.08)', color: customName.trim() && customExIds.length > 0 ? '#fff' : 'rgba(255,255,255,0.3)', fontWeight: 700, fontSize: 14, cursor: customName.trim() && customExIds.length > 0 ? 'pointer' : 'not-allowed' }}>
                  <Plus style={{ display: 'inline', width: 14, height: 14, marginRight: 6 }} /> Create Plan
                </motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCustomPlanner(false)} style={{ padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 600, fontSize: 14, cursor: 'pointer' }}>
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
