'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Exercise3DViewer } from '@/components/exercise-3d-viewer';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useState } from 'react';

const exercises = [
  { id: '1', name: 'Barbell Squat', category: 'Legs', difficulty: 'Intermediate', image: '🦵', model: 'squat' },
  { id: '2', name: 'Bench Press', category: 'Chest', difficulty: 'Beginner', image: '💪', model: 'bench' },
  { id: '3', name: 'Deadlift', category: 'Back', difficulty: 'Advanced', image: '🏋️', model: 'deadlift' },
  { id: '4', name: 'Lateral Pulldown', category: 'Back', difficulty: 'Intermediate', image: '💪', model: 'squat' },
  { id: '5', name: 'Leg Press', category: 'Legs', difficulty: 'Beginner', image: '🦵', model: 'squat' },
  { id: '6', name: 'Shoulder Press', category: 'Shoulders', difficulty: 'Intermediate', image: '💪', model: 'bench' },
  { id: '7', name: 'Bicep Curl', category: 'Arms', difficulty: 'Beginner', image: '💪', model: 'deadlift' },
  { id: '8', name: 'Tricep Dips', category: 'Arms', difficulty: 'Intermediate', image: '💪', model: 'bench' },
];

const categories = ['All', 'Chest', 'Back', 'Legs', 'Arms', 'Shoulders'];

export default function ExercisesPage() {
  useAuthProtected();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All' || ex.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">Exercise Library</h1>
          <p className="text-foreground/60">Browse and visualize 500+ exercises with detailed form guidance</p>
        </div>

        {/* Search and Filters */}
        <div className="space-y-6 mb-12">
          <Input
            placeholder="Search exercises..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-card border-foreground/10 text-foreground placeholder:text-foreground/40"
          />

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat)}
                className={category === cat ? 'bg-accent text-accent-foreground' : 'border-foreground/20 text-foreground'}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {/* Exercises Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {filteredExercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => setSelectedExercise(exercise.id)}
              className={`p-4 rounded-lg border transition cursor-pointer text-left ${
                selectedExercise === exercise.id
                  ? 'border-accent bg-accent/10'
                  : 'border-foreground/10 bg-card hover:border-accent/50'
              }`}
            >
              <div className="text-4xl mb-3">{exercise.image}</div>
              <h3 className="font-bold text-foreground">{exercise.name}</h3>
              <p className="text-sm text-foreground/60">{exercise.category}</p>
              <div className="mt-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  exercise.difficulty === 'Beginner'
                    ? 'bg-green-500/20 text-green-400'
                    : exercise.difficulty === 'Intermediate'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-red-500/20 text-red-400'
                }`}>
                  {exercise.difficulty}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* 3D Viewer Section */}
        {selectedExercise && (
          <div className="border border-foreground/10 rounded-lg p-8 bg-card">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {exercises.find((ex) => ex.id === selectedExercise)?.name}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 3D Viewer */}
              <div className="md:col-span-2">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <Exercise3DViewer 
                    exerciseType={exercises.find((ex) => ex.id === selectedExercise)?.model || 'squat'}
                    exerciseName={exercises.find((ex) => ex.id === selectedExercise)?.name || ''}
                  />
                </div>
              </div>

              {/* Exercise Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="font-bold text-foreground mb-2">Instructions</h3>
                  <ol className="text-sm text-foreground/70 space-y-2 list-decimal list-inside">
                    <li>Set up with proper form</li>
                    <li>Execute movement with control</li>
                    <li>Maintain steady breathing</li>
                    <li>Complete full range of motion</li>
                  </ol>
                </div>

                <div>
                  <h3 className="font-bold text-foreground mb-2">Muscle Groups</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-foreground/70">Primary: Quadriceps</div>
                    <div className="text-sm text-foreground/70">Secondary: Glutes</div>
                  </div>
                </div>

                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Add to Workout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
