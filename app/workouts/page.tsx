'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

interface WorkoutPlan {
  id: string;
  name: string;
  duration: number;
  exercises: number;
  difficulty: string;
  color: string;
}

const workoutPlans: WorkoutPlan[] = [
  { id: '1', name: 'Upper Body Strength', duration: 60, exercises: 8, difficulty: 'Intermediate', color: 'bg-blue-500' },
  { id: '2', name: 'Lower Body Power', duration: 50, exercises: 6, difficulty: 'Advanced', color: 'bg-red-500' },
  { id: '3', name: 'Full Body Conditioning', duration: 45, exercises: 10, difficulty: 'Beginner', color: 'bg-green-500' },
  { id: '4', name: 'Core & Stability', duration: 30, exercises: 5, difficulty: 'Beginner', color: 'bg-yellow-500' },
];

const recentWorkouts = [
  { id: '1', name: 'Chest Day', date: '2024-01-15', duration: 52, exercises: 7, completed: true },
  { id: '2', name: 'Leg Day', date: '2024-01-14', duration: 48, exercises: 6, completed: true },
  { id: '3', name: 'Back & Biceps', date: '2024-01-13', duration: 55, exercises: 8, completed: false },
];

export default function WorkoutsPage() {
  useAuthProtected();
  const [userWorkouts, setUserWorkouts] = useState<typeof recentWorkouts>(recentWorkouts);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleDeleteWorkout = (id: string) => {
    setUserWorkouts(userWorkouts.filter((w) => w.id !== id));
  };

  const handleStartWorkout = (planId: string) => {
    setSelectedPlan(planId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Workouts</h1>
          <p className="text-foreground/60">Build and track your personalized workout routines</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="p-6 rounded-lg border border-foreground/10 bg-card">
            <p className="text-sm text-foreground/60 mb-2">Total Workouts</p>
            <p className="text-3xl font-bold text-foreground">{userWorkouts.length}</p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-card">
            <p className="text-sm text-foreground/60 mb-2">Completed</p>
            <p className="text-3xl font-bold text-accent">{userWorkouts.filter((w) => w.completed).length}</p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-card">
            <p className="text-sm text-foreground/60 mb-2">Total Duration</p>
            <p className="text-3xl font-bold text-foreground">{userWorkouts.reduce((sum, w) => sum + w.duration, 0)}m</p>
          </div>
          <div className="p-6 rounded-lg border border-foreground/10 bg-card">
            <p className="text-sm text-foreground/60 mb-2">Completion Rate</p>
            <p className="text-3xl font-bold text-accent">{Math.round((userWorkouts.filter((w) => w.completed).length / userWorkouts.length) * 100)}%</p>
          </div>
        </div>

        {/* Workout Plans */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-6">Preset Workout Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workoutPlans.map((plan) => (
              <button
                key={plan.id}
                onClick={() => handleStartWorkout(plan.id)}
                className={`p-6 rounded-lg border transition text-left ${
                  selectedPlan === plan.id
                    ? 'border-accent bg-accent/10'
                    : 'border-foreground/10 bg-card hover:border-accent/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-lg ${plan.color} mb-4`}></div>
                <h3 className="font-bold text-foreground mb-2">{plan.name}</h3>
                <div className="space-y-1 text-sm text-foreground/60">
                  <p>{plan.exercises} exercises</p>
                  <p>{plan.duration}m duration</p>
                  <p>{plan.difficulty}</p>
                </div>
                <Button size="sm" className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">
                  Start
                </Button>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Workouts */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-foreground">Your Workouts</h2>
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Plus className="w-4 h-4 mr-2" />
              New Workout
            </Button>
          </div>

          <div className="space-y-3">
            {userWorkouts.map((workout) => (
              <div key={workout.id} className="flex items-center gap-4 p-4 rounded-lg border border-foreground/10 bg-card hover:border-accent/50 transition">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-foreground">{workout.name}</h3>
                    {workout.completed && (
                      <span className="px-2 py-1 text-xs bg-green-500/20 text-green-400 rounded">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-foreground/60">{workout.date} • {workout.duration}m • {workout.exercises} exercises</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-foreground/60 hover:text-destructive"
                  onClick={() => handleDeleteWorkout(workout.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Workout Details */}
        {selectedPlan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-card border border-accent/20 rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-foreground mb-4">Start Workout</h2>
              <p className="text-foreground/60 mb-6">
                {workoutPlans.find((p) => p.id === selectedPlan)?.name}
              </p>
              <div className="space-y-3 mb-6">
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Begin Workout
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-foreground/20 text-foreground hover:bg-foreground/5"
                  onClick={() => setSelectedPlan(null)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
