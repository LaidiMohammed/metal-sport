import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  lastName?: string;
  email: string;
  membership: 'free' | 'premium' | 'elite';
  avatar?: string;
  role?: 'user' | 'admin';
  isActive?: boolean;
  isSpam?: boolean;
  height?: number;
  weight?: number;
  age?: number;
  sex?: 'male' | 'female' | 'other';
  joinDate?: string;
  revenue?: number;
  qrCode?: string;
  sessionsLeft?: number;
  expirationDate?: string;
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

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'complements' | 'materiel' | 'abonnement' | 'vetements' | 'accessoires';
  images: string[];
  stock: number;
  specs: string[];
  createdAt: string;
}

export interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  workoutHistory: WorkoutSession[];
  selectedExercise: string | null;
  cartItems: number;
  allUsers: User[];
  products: Product[];
  
  // Actions
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  addWorkoutSession: (session: WorkoutSession) => void;
  setSelectedExercise: (exerciseId: string | null) => void;
  updateCartItems: (count: number) => void;
  getAuthHeaders: () => Promise<Record<string, string> | null>;
  addUser: (user: Partial<User>) => Promise<void>;
  toggleUserActive: (userId: string) => Promise<void>;
  markUserAsSpam: (userId: string) => Promise<void>;
  removeSpam: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  updateUserInfo: (userId: string, info: Partial<User>) => Promise<void>;
  setUserRole: (userId: string, role: 'user' | 'admin') => Promise<void>;
  getAllUsers: () => User[];
  fetchUsers: () => Promise<void>;
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  fetchProducts: () => Promise<void>;
}

export const useStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      workoutHistory: [],
      selectedExercise: null,
      cartItems: 0,
      allUsers: [],
      products: [],

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

      logout: async () => {
        try { const { supabase } = await import('@/lib/supabase'); await supabase.auth.signOut(); } catch {}
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

      getAuthHeaders: async () => {
        const { supabase } = await import('@/lib/supabase');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.access_token) return null;
        return { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' };
      },

      addUser: async (user) => {
        const headers = await get().getAuthHeaders();
        if (!headers) return;
        try {
          const res = await fetch('/api/users', { method: 'POST', headers, body: JSON.stringify(user) });
          if (!res.ok) return;
          const { user: created } = await res.json();
          if (created) set((state) => ({ allUsers: [...state.allUsers, created] }));
        } catch {}
      },

      toggleUserActive: async (userId) => {
        const headers = await get().getAuthHeaders();
        if (!headers) return;
        const user = get().allUsers.find((u) => u.id === userId);
        if (!user) return;
        try {
          await fetch(`/api/users/${userId}`, { method: 'PATCH', headers, body: JSON.stringify({ isActive: !user.isActive }) });
          set((state) => ({
            allUsers: state.allUsers.map((u) => u.id === userId ? { ...u, isActive: !u.isActive } : u),
          }));
        } catch {}
      },

      markUserAsSpam: async (userId) => {
        const headers = await get().getAuthHeaders();
        if (!headers) return;
        try {
          await fetch(`/api/users/${userId}`, { method: 'PATCH', headers, body: JSON.stringify({ isSpam: true }) });
          set((state) => ({
            allUsers: state.allUsers.map((u) => u.id === userId ? { ...u, isSpam: true } : u),
          }));
        } catch {}
      },

      removeSpam: async (userId) => {
        const headers = await get().getAuthHeaders();
        if (!headers) return;
        try {
          await fetch(`/api/users/${userId}`, { method: 'PATCH', headers, body: JSON.stringify({ isSpam: false }) });
          set((state) => ({
            allUsers: state.allUsers.map((u) => u.id === userId ? { ...u, isSpam: false } : u),
          }));
        } catch {}
      },

      deleteUser: async (userId) => {
        const headers = await get().getAuthHeaders();
        if (!headers) return;
        try {
          const res = await fetch(`/api/users/${userId}`, { method: 'DELETE', headers });
          if (!res.ok) return;
          set((state) => ({
            allUsers: state.allUsers.filter((u) => u.id !== userId),
          }));
        } catch {}
      },

      updateUserInfo: async (userId, info) => {
        const headers = await get().getAuthHeaders();
        if (!headers) return;
        try {
          await fetch(`/api/users/${userId}`, { method: 'PATCH', headers, body: JSON.stringify(info) });
          set((state) => ({
            allUsers: state.allUsers.map((u) => u.id === userId ? { ...u, ...info } : u),
          }));
        } catch {}
      },

      setUserRole: async (userId, role) => {
        const headers = await get().getAuthHeaders();
        if (!headers) return;
        try {
          await fetch(`/api/users/${userId}`, { method: 'PATCH', headers, body: JSON.stringify({ role }) });
          set((state) => ({
            allUsers: state.allUsers.map((u) => u.id === userId ? { ...u, role } : u),
          }));
        } catch {}
      },

      getAllUsers: () => get().allUsers,

      fetchUsers: async () => {
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data: { session } } = await supabase.auth.getSession();
          if (!session?.access_token) return;
          const res = await fetch('/api/users', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (!res.ok) return;
          const json = await res.json();
          if (json.users) set({ allUsers: json.users });
        } catch {}
      },

      addProduct: (product) => set((state) => ({
        products: [...state.products, product],
      })),

      updateProduct: (productId, updates) => set((state) => ({
        products: state.products.map((p) =>
          p.id === productId ? { ...p, ...updates } : p
        ),
      })),

      deleteProduct: (productId) => set((state) => ({
        products: state.products.filter((p) => p.id !== productId),
      })),

      fetchProducts: async () => {
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: true });
          if (!error && data) {
            const products: Product[] = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              category: p.category,
              images: p.images || [],
              stock: p.stock,
              specs: p.specs || [],
              createdAt: p.created_at,
            }));
            set({ products });
          }
        } catch {}
      },
    }),
    {
      name: 'kimo-gym-store',
      version: 3,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        workoutHistory: state.workoutHistory,
        cartItems: state.cartItems,
      }),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Partial<UserStore>;
        if (version < 3) {
          return {
            ...state,
            products: [],
            allUsers: [],
          };
        }
        return state as UserStore;
      },
    }
  )
);
