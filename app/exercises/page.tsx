'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InteractiveAnatomyViewer } from '@/components/interactive-anatomy-viewer';
import { exercises } from '@/lib/exercises-data';
import type { Exercise } from '@/lib/exercises-data';
import { CATEGORY_COLORS, getSubGroups, CATEGORIES as MUSCLE_CATEGORIES } from '@/lib/muscle-mapping';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Search, Trophy, Flame, Target, Sparkles, ChevronLeft, ChevronRight, X, Star, TrendingUp, Cable, Dumbbell, LayoutGrid } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

const CATEGORIES = ['All', ...MUSCLE_CATEGORIES] as const;

export default function ExercisesPage() {
  useAuthProtected();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('All');
  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [anatomyCategory, setAnatomyCategory] = useState<string | null>(null);
  const [smartFilter, setSmartFilter] = useState<string>('all');

  const filteredExercises = useMemo(() => {
    let result = exercises;
    const activeCategory = anatomyCategory || selectedMuscleGroup;
    if (activeCategory !== 'All') {
      result = result.filter((ex) => ex.category === activeCategory);
    }
    if (smartFilter === 'best') {
      const priority = ['Advanced', 'Intermediate', 'Beginner'];
      result = result.sort((a, b) => priority.indexOf(a.difficulty) - priority.indexOf(b.difficulty));
    } else if (smartFilter === 'volume') {
      const compound = ['Barbell', 'Dumbbells', 'Kettlebell'];
      result = result.filter((ex) => compound.some((e) => ex.equipment.toLowerCase().includes(e.toLowerCase())));
    } else if (smartFilter === 'cable') {
      result = result.filter((ex) => ex.equipment.toLowerCase().includes('cable'));
    } else if (smartFilter === 'dumbbell') {
      result = result.filter((ex) => ex.equipment.toLowerCase().includes('dumbbell'));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (ex) =>
          ex.name.toLowerCase().includes(q) ||
          ex.primaryMuscle.toLowerCase().includes(q) ||
          ex.equipment.toLowerCase().includes(q) ||
          ex.category.toLowerCase().includes(q)
      );
    }
    return result;
  }, [anatomyCategory, selectedMuscleGroup, smartFilter, searchQuery]);

  const totalPages = Math.ceil(filteredExercises.length / ITEMS_PER_PAGE);
  const displayExercises = filteredExercises.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const activeExercise = useMemo(() => {
    if (selectedExerciseId) return exercises.find((ex) => ex.id === selectedExerciseId) || null;
    return null;
  }, [selectedExerciseId]);

  const activeCategory = anatomyCategory || selectedMuscleGroup;
  const category = activeExercise?.category || (activeCategory !== 'All' ? activeCategory : 'default');

  const handleSelectExercise = (id: string) => {
    setSelectedExerciseId(id);
    const ex = exercises.find((e) => e.id === id);
    if (ex) { setAnatomyCategory(ex.category); setSelectedMuscleGroup(ex.category); }
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'start -0.3'],
  });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="min-h-screen bg-background text-foreground relative pt-14">
      <Navbar />

      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '48px 0 40px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 text-accent mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4aa, #00b896)' }}>
              <Sparkles className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-widest uppercase">KIMO's Interactive Studio</span>
          </div>
          <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
            <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/90 to-accent">
              Interactive Exercise Library
            </h1>
          </motion.div>
          <p className="text-foreground/50 mt-1 text-sm">
            {filteredExercises.length} exercises · Select muscle zones or search
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {/* Category filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          {CATEGORIES.map((group) => (
            <Button
              key={group}
              variant={selectedMuscleGroup === group ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setSelectedMuscleGroup(group); setPage(0); setSelectedExerciseId(null); setSmartFilter('all'); }}
              className={`rounded-full transition-all text-xs font-semibold px-4 py-1.5 shrink-0 ${
                selectedMuscleGroup === group
                  ? 'bg-accent text-accent-foreground shadow-[0_0_15px_rgba(6,182,212,0.4)] border-accent'
                  : 'border-white/10 text-foreground/75 hover:bg-white/5 hover:text-white'
              }`}
            >
              {group}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COL: Exercise list + viewer */}
          <div className="lg:col-span-8 space-y-6">
            {/* Search bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
              <Input
                placeholder="Search exercises, muscles, equipment..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(0); }}
                className="bg-[#0b0e17] border-white/10 text-foreground placeholder:text-foreground/35 pl-9 pr-4 py-2.5 text-sm rounded-xl focus:border-accent focus:ring-1 focus:ring-accent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-accent hover:text-white">
                  Clear
                </button>
              )}
            </div>

            {/* Smart filter buttons */}
            <motion.div layout className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" style={{ scrollbarWidth: 'none' }}>
              {[
                { key: 'all', label: 'All', icon: LayoutGrid },
                { key: 'best', label: 'Best', icon: Star },
                { key: 'volume', label: 'Volume', icon: TrendingUp },
                { key: 'cable', label: 'Cable', icon: Cable },
                { key: 'dumbbell', label: 'Dumbbell', icon: Dumbbell },
              ].map((f) => (
                <motion.button
                  key={f.key}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => { setSmartFilter(f.key); setPage(0); }}
                  className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-200 shrink-0 ${
                    smartFilter === f.key
                      ? 'bg-accent text-accent-foreground shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                      : 'bg-white/5 border border-white/10 text-foreground/60 hover:bg-white/10 hover:text-foreground hover:border-accent/30'
                  }`}
                >
                  {smartFilter === f.key && (
                    <motion.span layoutId="smartGlow" className="absolute inset-0 rounded-xl bg-accent" style={{ zIndex: -1 }} />
                  )}
                  <f.icon className="w-3.5 h-3.5" />
                  <span>{f.label}</span>
                </motion.button>
              ))}
            </motion.div>

            {/* Exercises grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-base font-bold flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-accent" />
                  Exercises ({filteredExercises.length})
                </h3>
                {selectedMuscleGroup !== 'All' && (
                  <span className="text-[11px] bg-accent/10 border border-accent/20 text-accent rounded-full px-3 py-1 font-semibold">
                    {selectedMuscleGroup}
                  </span>
                )}
              </div>

              {displayExercises.length === 0 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-card/50 backdrop-blur border border-border/50 rounded-2xl p-10 text-center text-foreground/40"
                >
                  <Sparkles className="w-8 h-8 mx-auto mb-3 text-accent/50 animate-pulse" />
                  <p className="font-bold text-sm text-foreground/80 mb-1">No exercises found</p>
                  <p className="text-xs text-foreground/40">Try a different muscle group or search term</p>
                </motion.div>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <AnimatePresence mode="popLayout">
                      {displayExercises.map((exercise) => {
                        const isActive = selectedExerciseId === exercise.id;
                        return (
                          <motion.div
                            key={exercise.id}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                            onClick={() => handleSelectExercise(exercise.id)}
                            className={`group relative p-3 rounded-xl border cursor-pointer text-left transition-all duration-200 ${
                              isActive
                                ? 'bg-gradient-to-br from-accent/15 via-accent/5 to-transparent border-accent shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                : 'bg-card/50 backdrop-blur border-border/50 hover:border-accent/40 hover:bg-card'
                            }`}
                          >
                            <div className="flex gap-3 items-center">
                              <span className="w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5">
                                <img
                                  src={exercise.imageUrl}
                                  alt={exercise.name}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              </span>
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-foreground text-sm tracking-wide truncate group-hover:text-accent transition-colors duration-200">
                                  {exercise.name}
                                </h4>
                                <p className="text-[11px] text-foreground/50 flex items-center gap-1.5 mt-0.5">
                                  <span className="font-semibold text-foreground/75 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">
                                    {exercise.category}
                                  </span>
                                  <span>·</span>
                                  <span>{exercise.equipment}</span>
                                </p>
                              </div>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                exercise.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                                exercise.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                                'bg-red-500/10 text-red-400'
                              }`}>
                                {exercise.difficulty}
                              </span>
                            </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-4">
                      <button
                        onClick={() => setPage(Math.max(0, page - 1))}
                        disabled={page === 0}
                        className="p-2 rounded-lg border border-white/10 disabled:opacity-30 hover:bg-white/5 transition"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => (
                        <button
                          key={i}
                          onClick={() => setPage(i)}
                          className={`w-8 h-8 rounded-lg text-xs font-bold transition ${
                            i === page
                              ? 'bg-accent text-black'
                              : 'border border-white/10 hover:bg-white/5 text-foreground/60'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                      <button
                        onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                        disabled={page >= totalPages - 1}
                        className="p-2 rounded-lg border border-white/10 disabled:opacity-30 hover:bg-white/5 transition"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Exercise widget modal */}
            <AnimatePresence>
              {activeExercise && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    onClick={() => setSelectedExerciseId(null)}
                  />
                  <motion.div
                    layoutId={activeExercise.id}
                    initial={{ opacity: 0, scale: 0.9, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 40 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    className="fixed inset-4 md:inset-x-auto md:inset-y-6 md:left-1/2 md:-translate-x-1/2 md:max-w-4xl z-50 bg-card border border-border/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3 border-b border-white/5 shrink-0">
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg overflow-hidden border border-white/10 shrink-0 bg-white/5">
                          <img src={activeExercise.imageUrl} alt={activeExercise.name} className="w-full h-full object-cover" />
                        </span>
                        <div>
                          <h2 className="font-bold text-foreground text-base">{activeExercise.name}</h2>
                          <p className="text-[11px] text-foreground/50">{activeExercise.primaryMuscle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                          activeExercise.difficulty === 'Beginner' ? 'bg-green-500/10 text-green-400' :
                          activeExercise.difficulty === 'Intermediate' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>{activeExercise.difficulty}</span>
                        <button
                          onClick={() => setSelectedExerciseId(null)}
                          className="w-8 h-8 rounded-lg border border-white/10 hover:bg-white/10 flex items-center justify-center transition"
                        >
                          <X className="w-4 h-4 text-foreground/60" />
                        </button>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
                      {/* Exercise movement demo */}
                      <div className="lg:col-span-3 space-y-4">
                        <div className="aspect-square rounded-xl overflow-hidden border border-border/50 bg-gradient-to-b from-black/40 to-black/80 flex items-center justify-center">
                          <img
                            src={activeExercise.imageUrl}
                            alt={activeExercise.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <p className="text-[10px] text-foreground/40 uppercase tracking-wider font-semibold mb-1">Equipment</p>
                            <p className="text-sm font-bold text-foreground">{activeExercise.equipment}</p>
                          </div>
                          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                            <p className="text-[10px] text-foreground/40 uppercase tracking-wider font-semibold mb-1">Duration</p>
                            <p className="text-sm font-bold text-accent">{activeExercise.durationEstimate}</p>
                          </div>
                        </div>
                      </div>

                      {/* Technique instructions */}
                      <div className="lg:col-span-2 space-y-4">
                        <div>
                          <h4 className="font-bold text-xs uppercase tracking-widest text-foreground/70 flex items-center gap-2 mb-3">
                            <Flame className="w-3.5 h-3.5 text-accent" /> Proper Form
                          </h4>
                          <ol className="space-y-2">
                            {activeExercise.instructions.map((step, idx) => (
                              <li key={idx} className="flex gap-2 text-xs leading-relaxed text-foreground/70">
                                <span className="font-bold text-accent shrink-0 bg-accent/15 w-5 h-5 rounded-full flex items-center justify-center border border-accent/20 text-[10px]">
                                  {idx + 1}
                                </span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs uppercase tracking-widest text-foreground/70 flex items-center gap-2 mb-2">
                            <Target className="w-3.5 h-3.5 text-accent" /> Target Muscles
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            <span className="text-[11px] font-bold text-accent bg-accent/15 border border-accent/20 px-2.5 py-1 rounded">
                              {activeExercise.primaryMuscle}
                            </span>
                            {activeExercise.secondaryMuscles.map((sec, idx) => (
                              <span key={idx} className="text-[11px] font-medium text-foreground/60 bg-white/5 border border-white/10 px-2.5 py-1 rounded">
                                {sec}
                              </span>
                            ))}
                          </div>
                        </div>
                        {activeExercise.videoId && (
                          <div className="bg-white/5 border border-white/10 rounded-xl p-3">
                            <iframe
                              width="100%"
                              height="160"
                              src={`https://www.youtube.com/embed/${activeExercise.videoId}`}
                              title={activeExercise.name}
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              className="rounded-lg border border-white/5"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* RIGHT COL: Interactive 3D anatomy */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-24">
            <InteractiveAnatomyViewer
              selectedCategory={anatomyCategory}
              onSelectCategory={(cat) => {
                setAnatomyCategory(cat);
                setSelectedMuscleGroup(cat || 'All');
                setPage(0);
                setSelectedExerciseId(null);
                setSmartFilter('all');
              }}
            />

            {/* Sub-groups when a category is selected */}
            {anatomyCategory && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-3"
              >
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-foreground/50 mb-2 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: CATEGORY_COLORS[anatomyCategory] }} />
                  {anatomyCategory} · Muscle Groups
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {getSubGroups(anatomyCategory).map((sg) => (
                    <button
                      key={sg}
                      onClick={() => {
                        setSearchQuery(sg.toLowerCase());
                        setPage(0);
                      }}
                      className="text-[10px] font-semibold bg-white/5 border border-white/10 hover:border-accent/30 hover:bg-white/10 px-2 py-1 rounded-md transition text-foreground/60 hover:text-foreground"
                    >
                      {sg}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-foreground/30 mt-2">Click a subgroup to filter exercises</p>
              </motion.div>
            )}

            {/* Stats card */}
            <div className="bg-card/50 backdrop-blur border border-border/50 rounded-xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground">
                  {filteredExercises.length} exercise{(filteredExercises.length !== 1) ? 's' : ''}
                </p>
                <p className="text-[10px] text-foreground/40">
                  {anatomyCategory ? `Filtered by ${anatomyCategory}` : 'Click the 3D model to filter'}
                </p>
              </div>
              {anatomyCategory && (
                <button
                  onClick={() => { setAnatomyCategory(null); setSelectedMuscleGroup('All'); setSmartFilter('all'); }}
                  className="ml-auto text-[10px] text-accent hover:text-white font-semibold flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
