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
  addProduct: (product: Product) => void;
  updateProduct: (productId: string, updates: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
}

export const useStore = create<UserStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      workoutHistory: [],
      selectedExercise: null,
      cartItems: 0,
      allUsers: [
        {
          id: '1',
          name: 'Hamada',
          lastName: 'Laidi',
          email: 'hamada.laidi.14@gmail.com',
          membership: 'elite',
          role: 'admin',
          isActive: true,
          isSpam: false,
          height: 178,
          weight: 72,
          age: 30,
          sex: 'male',
          joinDate: '2024-01-01',
          revenue: 0,
          sessionsLeft: 24,
          expirationDate: '2026-12-31',
        },
        {
          id: '2',
          name: 'Karim',
          lastName: 'Ahmed',
          email: 'karim@gym.com',
          membership: 'premium',
          role: 'user',
          isActive: true,
          isSpam: false,
          height: 180,
          weight: 75,
          age: 28,
          sex: 'male',
          joinDate: '2024-01-15',
          revenue: 2999,
          sessionsLeft: 8,
          expirationDate: '2026-08-15',
        },
        {
          id: '3',
          name: 'Fatima',
          lastName: 'Belhadj',
          email: 'fatima@gym.com',
          membership: 'elite',
          role: 'user',
          isActive: true,
          isSpam: false,
          height: 165,
          weight: 58,
          age: 26,
          sex: 'female',
          joinDate: '2024-02-20',
          revenue: 3499,
          sessionsLeft: 18,
          expirationDate: '2027-02-20',
        },
        {
          id: '4',
          name: 'Amin',
          lastName: 'Boukerch',
          email: 'amin@gym.com',
          membership: 'free',
          role: 'user',
          isActive: false,
          isSpam: false,
          height: 175,
          weight: 70,
          age: 32,
          sex: 'male',
          joinDate: '2024-01-10',
          revenue: 0,
          sessionsLeft: 0,
          expirationDate: '2026-01-10',
        },
      ],

      products: [
        { id: 'p1', name: 'Whey Protein Gold', description: '100% pure whey protein isolate. 25g protein per serving. Ideal for muscle recovery and growth.', price: 4500, category: 'complements', images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2c1cf?w=400'], stock: 50, specs: ['25g protein', '2.5g carbs', 'Vanilla/Chocolate', '2kg tub'], createdAt: '2025-01-01' },
        { id: 'p2', name: 'Creatine Monohydrate', description: 'Micronized creatine monohydrate for maximum strength and power output.', price: 2800, category: 'complements', images: ['https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400'], stock: 30, specs: ['Micronized', 'Unflavored', '500g', 'Pure creatine'], createdAt: '2025-01-01' },
        { id: 'p3', name: 'BCAA 4:1:1', description: 'Essential branched-chain amino acids for muscle preservation during training.', price: 3200, category: 'complements', images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], stock: 40, specs: ['4:1:1 ratio', 'Fruit punch', '400g', '60 servings'], createdAt: '2025-01-01' },
        { id: 'p4', name: 'L-Carnitine Liquid', description: 'Liquid L-carnitine for fat metabolism and energy production during workouts.', price: 1800, category: 'complements', images: ['https://images.unsplash.com/photo-1550572017-edd951b55104?w=400'], stock: 25, specs: ['3000mg', 'Lemon flavor', '1000ml', '33 servings'], createdAt: '2025-01-01' },
        { id: 'p5', name: 'Haltères Réglables 20kg', description: 'Set d\'haltères réglables en acier chromé. De 2kg à 20kg par paire. Idéal pour tous les niveaux.', price: 15000, category: 'materiel', images: ['https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'], stock: 15, specs: ['Acier chromé', '2-20kg réglable', 'Paire', 'Caoutchouc antidérapant'], createdAt: '2025-01-01' },
        { id: 'p6', name: 'Barre de Curl EZ', description: 'Barre EZ professionnelle pour curls et extensions triceps. Prise ergonomique.', price: 5500, category: 'materiel', images: ['https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400'], stock: 20, specs: ['Acier trempé', '120cm', 'Prise ergonomique', '25kg max'], createdAt: '2025-01-01' },
        { id: 'p7', name: 'Élastiques de Résistance', description: 'Set de 5 élastiques de résistance différents niveaux. Du débutant au confirmé.', price: 2500, category: 'materiel', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400'], stock: 40, specs: ['5 niveaux', 'Latex naturel', 'Lot de 5', 'Sac inclus'], createdAt: '2025-01-01' },
        { id: 'p8', name: 'Tapis de Sol Premium', description: 'Tapis de fitness 15mm d\'épaisseur. Antidérapant et facile à nettoyer. 183x61cm.', price: 3500, category: 'materiel', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'], stock: 30, specs: ['15mm épais', '183x61cm', 'NBR', 'Antidérapant'], createdAt: '2025-01-01' },
        { id: 'p9', name: 'Abonnement Mensuel', description: 'Accès illimité à la salle. Cours collectifs inclus. Piscine et sauna disponibles.', price: 4500, category: 'abonnement', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'], stock: 999, specs: ['Accès illimité', 'Cours collectifs', 'Piscine', 'Sauna'], createdAt: '2025-01-01' },
        { id: 'p10', name: 'Abonnement Annuel', description: 'Notre meilleur rapport qualité-prix. 2 mois offerts. Accès prioritaire aux nouvelles machines.', price: 42000, category: 'abonnement', images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400'], stock: 999, specs: ['Économisez 35%', 'Accès prioritaire', 'Coaching offert', '1 séance perso/mois'], createdAt: '2025-01-01' },
        { id: 'p11', name: 'Pack 3 Mois', description: 'Abonnement trimestriel avec évaluation physique gratuite et plan personnalisé.', price: 12000, category: 'abonnement', images: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400'], stock: 999, specs: ['3 mois', 'Évaluation gratuite', 'Plan personnalisé', 'Suivi mensuel'], createdAt: '2025-01-01' },
        { id: 'p12', name: 'Pack Coaching + Salle', description: 'Abonnement mensuel + 8 séances de coaching personnel avec un de nos experts.', price: 12000, category: 'abonnement', images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], stock: 50, specs: ['8 séances coaching', 'Plan sur mesure', 'Suivi nutrition', 'Prioritaire'], createdAt: '2025-01-01' },
        { id: 'p13', name: 'T-Shirt Kimo\'s Gym', description: 'T-shirt en coton bio premium. Logo brodé. Coupe athlétique.', price: 2500, category: 'vetements', images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400'], stock: 60, specs: ['Coton bio', 'Logo brodé', 'Coupe athlétique', 'Noir/Blanc'], createdAt: '2025-01-01' },
        { id: 'p14', name: 'Short de Sport Pro', description: 'Short léger et respirant pour les entraînements intenses. Tissu évacuant la transpiration.', price: 2200, category: 'vetements', images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400'], stock: 45, specs: ['Tissu respirant', 'Poches zippées', 'Taille élastique', 'Anti-transpiration'], createdAt: '2025-01-01' },
        { id: 'p15', name: 'Débardeur Kimo\'s', description: 'Débardeur en maille respirante pour un maximum de confort pendant vos séances.', price: 1800, category: 'vetements', images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'], stock: 55, specs: ['Maille respirante', 'Coupe large', 'Logo imprimé', 'Gris/Noir'], createdAt: '2025-01-01' },
        { id: 'p16', name: 'Gourde Aluminum 1L', description: 'Gourde en aluminium isolée. Garde vos boissons froides 24h. Bouchon sport.', price: 1800, category: 'accessoires', images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'], stock: 80, specs: ['Aluminium', '1L', 'Isolée 24h', 'Bouchon sport'], createdAt: '2025-01-01' },
        { id: 'p17', name: 'Gants de Musculation', description: 'Gants renforcés avec protection palmaire et poignets ajustables.', price: 2200, category: 'accessoires', images: ['https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400'], stock: 35, specs: ['Cuir synthétique', 'Protection palmaire', 'Poignet velcro', 'Taille M-L'], createdAt: '2025-01-01' },
        { id: 'p18', name: 'Serviette Microfibre', description: 'Serviette microfibre ultra-absorbante. Format sac de sport. Anti-bactérienne.', price: 1200, category: 'accessoires', images: ['https://images.unsplash.com/photo-1603188573736-f8e14c132e2e?w=400'], stock: 100, specs: ['Microfibre', '75x150cm', 'Anti-bactérienne', 'Sac inclus'], createdAt: '2025-01-01' },
      ],

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
    }),
    {
      name: 'kimo-gym-store',
      version: 2,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        workoutHistory: state.workoutHistory,
        cartItems: state.cartItems,
        allUsers: state.allUsers,
        products: state.products,
      }),
      migrate: (persisted: unknown, version: number) => {
        const state = persisted as Partial<UserStore>;
        if (version < 2) {
          // Re-initialize with mock products for old data
          return {
            ...state,
            products: [
              { id: 'p1', name: 'Whey Protein Gold', description: '100% pure whey protein isolate. 25g protein per serving.', price: 4500, category: 'complements', images: ['https://images.unsplash.com/photo-1593095948071-474c5cc2c1cf?w=400'], stock: 50, specs: ['25g protein', '2.5g carbs', 'Vanilla/Chocolate', '2kg tub'], createdAt: '2025-01-01' },
              { id: 'p2', name: 'Creatine Monohydrate', description: 'Micronized creatine monohydrate for maximum strength.', price: 2800, category: 'complements', images: ['https://images.unsplash.com/photo-1581009137042-c552e485697a?w=400'], stock: 30, specs: ['Micronized', 'Unflavored', '500g'], createdAt: '2025-01-01' },
              { id: 'p3', name: 'BCAA 4:1:1', description: 'Essential branched-chain amino acids.', price: 3200, category: 'complements', images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], stock: 40, specs: ['4:1:1 ratio', 'Fruit punch', '400g'], createdAt: '2025-01-01' },
              { id: 'p4', name: 'L-Carnitine Liquid', description: 'Liquid L-carnitine for fat metabolism.', price: 1800, category: 'complements', images: ['https://images.unsplash.com/photo-1550572017-edd951b55104?w=400'], stock: 25, specs: ['3000mg', 'Lemon flavor', '1000ml'], createdAt: '2025-01-01' },
              { id: 'p5', name: 'Haltères Réglables 20kg', description: 'Set d\'haltères réglables en acier chromé.', price: 15000, category: 'materiel', images: ['https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400'], stock: 15, specs: ['Acier chromé', '2-20kg', 'Paire'], createdAt: '2025-01-01' },
              { id: 'p6', name: 'Barre de Curl EZ', description: 'Barre EZ professionnelle.', price: 5500, category: 'materiel', images: ['https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400'], stock: 20, specs: ['Acier trempé', '120cm', 'Ergonomique'], createdAt: '2025-01-01' },
              { id: 'p7', name: 'Élastiques de Résistance', description: 'Set de 5 élastiques de résistance.', price: 2500, category: 'materiel', images: ['https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400'], stock: 40, specs: ['5 niveaux', 'Latex', 'Lot de 5'], createdAt: '2025-01-01' },
              { id: 'p8', name: 'Tapis de Sol Premium', description: 'Tapis de fitness 15mm d\'épaisseur.', price: 3500, category: 'materiel', images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400'], stock: 30, specs: ['15mm', '183x61cm', 'NBR'], createdAt: '2025-01-01' },
              { id: 'p9', name: 'Abonnement Mensuel', description: 'Accès illimité à la salle.', price: 4500, category: 'abonnement', images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'], stock: 999, specs: ['Accès illimité', 'Cours collectifs'], createdAt: '2025-01-01' },
              { id: 'p10', name: 'Abonnement Annuel', description: 'Notre meilleur rapport qualité-prix.', price: 42000, category: 'abonnement', images: ['https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400'], stock: 999, specs: ['Économisez 35%', 'Coaching offert'], createdAt: '2025-01-01' },
              { id: 'p11', name: 'Pack 3 Mois', description: 'Abonnement trimestriel avec évaluation.', price: 12000, category: 'abonnement', images: ['https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400'], stock: 999, specs: ['3 mois', 'Évaluation gratuite'], createdAt: '2025-01-01' },
              { id: 'p12', name: 'Pack Coaching + Salle', description: 'Abonnement + 8 séances coaching.', price: 12000, category: 'abonnement', images: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'], stock: 50, specs: ['8 séances coaching', 'Plan sur mesure'], createdAt: '2025-01-01' },
              { id: 'p13', name: 'T-Shirt Kimo\'s Gym', description: 'T-shirt coton bio premium.', price: 2500, category: 'vetements', images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400'], stock: 60, specs: ['Coton bio', 'Logo brodé'], createdAt: '2025-01-01' },
              { id: 'p14', name: 'Short de Sport Pro', description: 'Short léger et respirant.', price: 2200, category: 'vetements', images: ['https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400'], stock: 45, specs: ['Tissu respirant', 'Poches zippées'], createdAt: '2025-01-01' },
              { id: 'p15', name: 'Débardeur Kimo\'s', description: 'Débardeur en maille respirante.', price: 1800, category: 'vetements', images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'], stock: 55, specs: ['Maille respirante', 'Coupe large'], createdAt: '2025-01-01' },
              { id: 'p16', name: 'Gourde Aluminum 1L', description: 'Gourde en aluminium isolée.', price: 1800, category: 'accessoires', images: ['https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400'], stock: 80, specs: ['Aluminium', '1L', 'Isolée 24h'], createdAt: '2025-01-01' },
              { id: 'p17', name: 'Gants de Musculation', description: 'Gants renforcés avec protection palmaire.', price: 2200, category: 'accessoires', images: ['https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400'], stock: 35, specs: ['Cuir synthétique', 'Poignet velcro'], createdAt: '2025-01-01' },
              { id: 'p18', name: 'Serviette Microfibre', description: 'Serviette microfibre ultra-absorbante.', price: 1200, category: 'accessoires', images: ['https://images.unsplash.com/photo-1603188573736-f8e14c132e2e?w=400'], stock: 100, specs: ['Microfibre', '75x150cm'], createdAt: '2025-01-01' },
            ] as Product[],
          };
        }
        return state as UserStore;
      },
    }
  )
);
