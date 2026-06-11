import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 });

    const { data, error } = await supabaseAdmin
      .from('workout_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data || data.length === 0) {
      return NextResponse.json({
        totalWorkouts: 0, totalDuration: 0, totalCalories: 0,
        streak: 0, bestStreak: 0,
        personalBests: [],
        weeklyVolume: [0, 0, 0, 0, 0, 0, 0],
        muscleFocus: [],
      });
    }

    const completed = data.filter((s) => s.completed);

    const totalWorkouts = completed.length;
    const totalDuration = completed.reduce((sum, s) => sum + (s.duration || 0), 0);
    const totalCalories = completed.reduce((sum, s) => sum + (s.calories || Math.round((s.duration || 0) * 7.5)), 0);

    const dates = [...new Set(completed.map((s) => s.date?.split('T')[0] || ''))].filter(Boolean).sort();
    let streak = 0;
    let bestStreak = 0;
    let currentRun = 0;
    const today = new Date().toISOString().split('T')[0];
    for (let i = dates.length - 1; i >= 0; i--) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - (dates.length - 1 - i));
      const expectedStr = expected.toISOString().split('T')[0];
      if (dates[i] === expectedStr) {
        currentRun++;
        bestStreak = Math.max(bestStreak, currentRun);
      } else {
        currentRun = 0;
      }
    }
    streak = currentRun;

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weeklyVolume = dayNames.map(() => 0);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    completed.forEach((s) => {
      const d = new Date(s.date);
      if (d >= weekAgo) {
        const dayIdx = d.getDay();
        weeklyVolume[dayIdx] += s.duration || 1;
      }
    });

    const todayFormatted = new Date().toISOString().split('T')[0];
    const rotated = [...weeklyVolume.slice(1), weeklyVolume[0]];
    const dayOrder = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const maxVol = Math.max(...rotated, 1);
    const weeklyPercentages = rotated.map((v) => ({ day: dayOrder[rotated.indexOf(v)], value: v, pct: Math.round((v / maxVol) * 100) }));

    const dayMap = { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 0: 'Sun' };

    const muscleKeywords: Record<string, string[]> = {
      Chest: ['bench', 'chest', 'press', 'fly', 'pec'],
      Back: ['row', 'pull', 'back', 'lat', 'rear'],
      Legs: ['squat', 'leg', 'quad', 'hamstring', 'glute', 'lunge'],
      Shoulders: ['shoulder', 'ohp', 'overhead', 'lateral', 'front raise'],
      Arms: ['curl', 'tricep', 'bicep', 'arm', 'skull'],
      Core: ['crunch', 'plank', 'ab', 'core', 'leg raise'],
    };
    const muscleCounts: Record<string, number> = {};
    completed.forEach((s) => {
      const name = (s.exercise_id || s.name || '').toLowerCase();
      for (const [muscle, keywords] of Object.entries(muscleKeywords)) {
        if (keywords.some((k) => name.includes(k))) {
          muscleCounts[muscle] = (muscleCounts[muscle] || 0) + 1;
          break;
        }
      }
    });
    const totalMuscle = Object.values(muscleCounts).reduce((a, b) => a + b, 0) || 1;
    const muscleColors: Record<string, string> = {
      Chest: '#00d4aa', Back: '#3b82f6', Legs: '#f59e0b',
      Shoulders: '#a855f7', Arms: '#ef4444', Core: '#ec4899',
    };
    const muscleFocus = Object.entries(muscleCounts).map(([label, count]) => ({
      label, pct: Math.round((count / totalMuscle) * 100), color: muscleColors[label] || '#00d4aa',
    }));

    const pbMap: Record<string, { value: number; unit: string }> = {};
    completed.forEach((s) => {
      if (s.weight && s.exercise_id) {
        const key = s.exercise_id.toLowerCase();
        if (!pbMap[key] || s.weight > pbMap[key].value) {
          pbMap[key] = { value: s.weight, unit: 'kg' };
        }
      }
    });
    const personalBests = Object.entries(pbMap).slice(0, 6).map(([label, val]) => ({
      label: label.charAt(0).toUpperCase() + label.slice(1),
      value: `${val.value} ${val.unit}`,
    }));

    return NextResponse.json({
      totalWorkouts,
      totalDuration,
      totalCalories,
      streak,
      bestStreak,
      personalBests,
      weeklyVolume: weeklyPercentages,
      muscleFocus,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
