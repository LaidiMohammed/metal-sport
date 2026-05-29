import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  membership: 'free' | 'premium' | 'elite';
  avatar?: string;
}

export interface WorkoutSession {
  id: string;
  exerciseId: string;
  reps: number;
  weight?: number;
  duration?: number;
  date: Date;
  completed: boolean;
}

export interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  workoutHistory: WorkoutSession[];
  selectedExercise: string | null;
  cartItems: number;
  
  // Actions
  setUser: (user: User | null) => void;
  logout: () => void;
  addWorkoutSession: (session: WorkoutSession) => void;
  setSelectedExercise: (exerciseId: string | null) => void;
  updateCartItems: (count: number) => void;
}

export const useStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      workoutHistory: [],
      selectedExercise: null,
      cartItems: 0,

      setUser: (user) => {
        // Set cookie for middleware
        if (typeof window !== 'undefined' && user) {
          document.cookie = `user_auth=${JSON.stringify(user)}; path=/; max-age=2592000`;
        } else if (typeof window !== 'undefined') {
          document.cookie = 'user_auth=; path=/; max-age=0';
        }
        
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          document.cookie = 'user_auth=; path=/; max-age=0';
        }
        set({
          user: null,
          isAuthenticated: false,
          workoutHistory: [],
        });
      },

      addWorkoutSession: (session) => set((state) => ({
        workoutHistory: [...state.workoutHistory, session],
      })),

      setSelectedExercise: (exerciseId) => set({
        selectedExercise: exerciseId,
      }),

      updateCartItems: (count) => set({
        cartItems: count,
      }),
    }),
    {
      name: 'kimo-gym-store',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        workoutHistory: state.workoutHistory,
        cartItems: state.cartItems,
      }),
    }
  )
);
