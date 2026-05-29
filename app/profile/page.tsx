'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
      <div className="min-h-screen bg-background">
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

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile Header */}
        <div className="border border-foreground/10 rounded-lg p-8 bg-card mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-6">
            <div className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center">
              <span className="text-3xl">👤</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.name}</h1>
              <p className="text-foreground/60">{user.email}</p>
              <div className="mt-3">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="p-6 rounded-lg border border-foreground/10 bg-card">
            <p className="text-sm text-foreground/60 mb-2">Total Workouts</p>
            <p className="text-3xl font-bold text-foreground">24</p>
            <p className="text-xs text-foreground/50 mt-2">+3 this week</p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-card">
            <p className="text-sm text-foreground/60 mb-2">Workout Streak</p>
            <p className="text-3xl font-bold text-accent">7 days</p>
            <p className="text-xs text-foreground/50 mt-2">Keep it up!</p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-card">
            <p className="text-sm text-foreground/60 mb-2">Total Duration</p>
            <p className="text-3xl font-bold text-foreground">52h 30m</p>
            <p className="text-xs text-foreground/50 mt-2">Goal: 60h</p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-card">
            <p className="text-sm text-foreground/60 mb-2">Calories Burned</p>
            <p className="text-3xl font-bold text-foreground">12,450</p>
            <p className="text-xs text-foreground/50 mt-2">This month</p>
          </div>
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
              <p className="text-foreground/60">Renews on February 15, 2024</p>
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
