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
  logout: () => void;
  addWorkoutSession: (session: WorkoutSession) => void;
  setSelectedExercise: (exerciseId: string | null) => void;
  updateCartItems: (count: number) => void;
  addUser: (user: User) => void;
  toggleUserActive: (userId: string) => void;
  markUserAsSpam: (userId: string) => void;
  removeSpam: (userId: string) => void;
  deleteUser: (userId: string) => void;
  updateUserInfo: (userId: string, info: Partial<User>) => void;
  setUserRole: (userId: string, role: 'user' | 'admin') => void;
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

      addUser: (user) => set((state) => ({
        allUsers: [...state.allUsers, user],
      })),

      toggleUserActive: (userId) => set((state) => ({
        allUsers: state.allUsers.map((user) =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        ),
      })),

      markUserAsSpam: (userId) => set((state) => ({
        allUsers: state.allUsers.map((user) =>
          user.id === userId ? { ...user, isSpam: true } : user
        ),
      })),

      removeSpam: (userId) => set((state) => ({
        allUsers: state.allUsers.map((user) =>
          user.id === userId ? { ...user, isSpam: false } : user
        ),
      })),

      deleteUser: (userId) => set((state) => ({
        allUsers: state.allUsers.filter((user) => user.id !== userId),
      })),

      updateUserInfo: (userId, info) => set((state) => ({
        allUsers: state.allUsers.map((user) =>
          user.id === userId ? { ...user, ...info } : user
        ),
      })),

      setUserRole: (userId, role) => set((state) => ({
        allUsers: state.allUsers.map((u) =>
          u.id === userId ? { ...u, role } : u
        ),
      })),

      getAllUsers: () => get().allUsers,

      fetchUsers: async () => {
        try {
          const { supabase } = await import('@/lib/supabase');
          const { data, error } = await supabase.from('profiles').select('*');
          if (!error && data) {
            const users: User[] = data.map((p: any) => ({
              id: p.id,
              name: p.name,
              lastName: p.last_name,
              email: p.email,
              membership: p.membership,
              role: p.role,
              isActive: p.is_active,
              isSpam: p.is_spam,
              height: p.height,
              weight: p.weight,
              age: p.age,
              sex: p.sex,
              joinDate: p.join_date,
              revenue: p.revenue,
              sessionsLeft: p.sessions_left,
              expirationDate: p.expiration_date,
              avatar: p.avatar,
            }));
            set({ allUsers: users });
          }
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
