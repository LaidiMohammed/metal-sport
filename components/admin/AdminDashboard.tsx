'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useStore, User, Product } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { QRCodeSVG } from 'qrcode.react';
import {
  Search, Eye, EyeOff, AlertCircle, QrCode, LayoutDashboard,
  Users, TrendingUp, DollarSign, Shield, ChevronLeft, ChevronRight,
  Home, Briefcase, Star, Phone, Mail, Activity, UserCheck, Crown, Clock, Scan,
  Menu, Trash2, Plus, X, UserPlus, Package,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

type Section = 'dashboard' | 'clients' | 'admins' | 'analytics' | 'revenue' | 'security' | 'workers' | 'scanner' | 'products';

interface Worker {
  id: string;
  name: string;
  age: number;
  role: string;
  email: string;
  phone: string;
  status: 'active' | 'off' | 'break';
  salary: number;
  joinDate: string;
  rating: number;
  specialties: string[];
}

const workersData: Worker[] = [
  { id: 'w1', name: 'Yacine Merabet', age: 34, role: 'Head Coach', email: 'yacine@metalsport.dz', phone: '+213 555 12 34 56', status: 'active', salary: 85000, joinDate: '2022-03-01', rating: 4.9, specialties: ['Strength Training', 'Powerlifting'] },
  { id: 'w2', name: 'Sofia Lounici', age: 29, role: 'Coach', email: 'sofia@metalsport.dz', phone: '+213 555 23 45 67', status: 'active', salary: 65000, joinDate: '2023-01-15', rating: 4.7, specialties: ['Yoga', 'Flexibility'] },
  { id: 'w3', name: 'Rami Bensalem', age: 27, role: 'Coach', email: 'rami@metalsport.dz', phone: '+213 555 34 56 78', status: 'break', salary: 60000, joinDate: '2023-06-01', rating: 4.5, specialties: ['HIIT', 'CrossFit'] },
  { id: 'w4', name: 'Ines Hamdi', age: 31, role: 'Nutritionist', email: 'ines@metalsport.dz', phone: '+213 555 45 67 89', status: 'active', salary: 70000, joinDate: '2022-09-01', rating: 4.8, specialties: ['Nutrition Planning', 'Dietetics'] },
  { id: 'w5', name: 'Lamine Zaidi', age: 26, role: 'Junior Coach', email: 'lamine@metalsport.dz', phone: '+213 555 56 78 90', status: 'active', salary: 45000, joinDate: '2024-02-01', rating: 4.2, specialties: ['Cardio', 'Endurance'] },
  { id: 'w6', name: 'Amel Kaci', age: 33, role: 'Physiotherapist', email: 'amel@metalsport.dz', phone: '+213 555 67 89 01', status: 'off', salary: 75000, joinDate: '2022-06-15', rating: 4.9, specialties: ['Rehab', 'Massage Therapy'] },
];

const sidebarLinks: { section: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { section: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { section: 'clients', label: 'Clients', icon: Users },
  { section: 'workers', label: 'Workers', icon: Briefcase },
  { section: 'admins', label: 'Admins', icon: UserCheck },
  { section: 'analytics', label: 'Analytics', icon: TrendingUp },
  { section: 'revenue', label: 'Revenue', icon: DollarSign },
  { section: 'scanner', label: 'Scanner', icon: Scan },
  { section: 'products', label: 'Products', icon: Package },
  { section: 'security', label: 'Security', icon: Shield },
];

export function AdminDashboard() {
  const allUsers = useStore((state) => state.allUsers);
  const toggleUserActive = useStore((state) => state.toggleUserActive);
  const markUserAsSpam = useStore((state) => state.markUserAsSpam);
  const removeSpam = useStore((state) => state.removeSpam);
  const deleteUser = useStore((state) => state.deleteUser);
  const addUser = useStore((state) => state.addUser);
  const setUserRole = useStore((state) => state.setUserRole);
  const currentUser = useStore((state) => state.user);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [timeframe, setTimeframe] = useState<'month' | 'year'>('month');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminSearch, setAdminSearch] = useState('');
  const [workerSearch, setWorkerSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [headerScrolled, setHeaderScrolled] = useState(false);
  const [scannedUserId, setScannedUserId] = useState<string>('');
  const [scannedRaw, setScannedRaw] = useState<Record<string,string>>({});
  const [scanning, setScanning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const scannerRef = useRef<any>(null);
  const scannerContainerRef = useRef<HTMLDivElement>(null);
  const scannerStartingRef = useRef(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClient, setNewClient] = useState({
    name: '', lastName: '', email: '', membership: 'free' as 'free' | 'premium' | 'elite',
    age: '', sex: 'male' as 'male' | 'female' | 'other', height: '', weight: '',
    sessionsLeft: '', expirationDate: '', revenue: '',
  });

  const products = useStore((state) => state.products);
  const addProduct = useStore((state) => state.addProduct);
  const updateProduct = useStore((state) => state.updateProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [productSearch, setProductSearch] = useState('');
  const [productCategory, setProductCategory] = useState<string>('all');
  const [expandedCat, setExpandedCat] = useState<string | null>('abonnement');

  const filteredProducts = (products || []).filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.description.toLowerCase().includes(productSearch.toLowerCase());
    const matchCategory = productCategory === 'all' || p.category === productCategory;
    return matchSearch && matchCategory;
  });

  const startScanner = useCallback(async () => {
    if (scannerStartingRef.current) return;
    scannerStartingRef.current = true;
    setScanning(true);
    await new Promise(r => setTimeout(r, 150));
    try {
      if (!scannerStartingRef.current) { setScanning(false); scannerStartingRef.current = false; return; }
      const { Html5Qrcode } = await import('html5-qrcode');
      if (!scannerStartingRef.current) { setScanning(false); scannerStartingRef.current = false; return; }
      if (!scannerContainerRef.current) { setScanning(false); scannerStartingRef.current = false; return; }
      const el = scannerContainerRef.current;
      el.innerHTML = '';
      const scanner = new Html5Qrcode(el.id || 'qr-reader-el');
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText: string) => {
          let raw: Record<string,string> = {};
          try { raw = JSON.parse(decodedText); } catch { raw = { id: decodedText }; }
          setScannedRaw(raw);
          setScannedUserId(decodedText);
          const pool = [...allUsers, currentUser].filter(Boolean) as User[];
          let id = decodedText;
          try { const p = JSON.parse(decodedText); if (p.id) id = p.id; } catch {}
          const foundUser = pool.find(u => u.id === id) || null;
          setSelectedUser(foundUser);
          scanner.stop().then(() => {}).catch(() => {});
          setScanning(false);
          scannerStartingRef.current = false;
        },
        () => {}
      );
    } catch (e) {
      setScanning(false);
    }
    scannerStartingRef.current = false;
  }, [allUsers, currentUser]);

  const stopScanner = useCallback(async () => {
    scannerStartingRef.current = false;
    if (scannerRef.current) {
      try { await scannerRef.current.stop(); } catch {}
      scannerRef.current = null;
    }
    setScanning(false);
    if (scannerContainerRef.current) scannerContainerRef.current.innerHTML = '';
  }, []);

  useEffect(() => {
    if (activeSection === 'scanner') {
      startScanner();
      return () => { stopScanner(); };
    } else {
      stopScanner();
    }
  }, [activeSection, startScanner, stopScanner]);

  useEffect(() => {
    const handleHeaderScroll = () => {
      const main = document.querySelector('.admin-main');
      if (main) setHeaderScrolled(main.scrollTop > 30);
      else setHeaderScrolled(window.scrollY > 30);
    };
    const main = document.querySelector('.admin-main');
    if (main) main.addEventListener('scroll', handleHeaderScroll, { passive: true });
    else window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    return () => {
      if (main) main.removeEventListener('scroll', handleHeaderScroll);
      else window.removeEventListener('scroll', handleHeaderScroll);
    };
  }, []);

  const clientUsers = allUsers.filter((u) => u.role === 'user' || !u.role);
  const adminUsers = allUsers.filter((u) => u.role === 'admin');
  const activeClients = clientUsers.filter((u) => u.isActive).length;
  const inactiveClients = clientUsers.filter((u) => !u.isActive).length;
  const spamClients = clientUsers.filter((u) => u.isSpam).length;

  const userActivityData = [
    { name: 'Active', value: activeClients, color: '#4ade80' },
    { name: 'Inactive', value: inactiveClients, color: '#ef4444' },
  ];

  const monthlyRevenueData = [
    { month: 'Jan', revenue: 8000 },
    { month: 'Feb', revenue: 9500 },
    { month: 'Mar', revenue: 12000 },
    { month: 'Apr', revenue: 11500 },
    { month: 'May', revenue: 15000 },
    { month: 'Jun', revenue: 18000 },
  ];

  const yearlyRevenueData = [
    { month: '2022', revenue: 120000 },
    { month: '2023', revenue: 185000 },
    { month: '2024', revenue: 95000 },
  ];

  const revenueData = timeframe === 'month' ? monthlyRevenueData : yearlyRevenueData;

  const findUser = (text: string): User | null => {
    if (!text) return null;
    let id = text;
    let decodedName = '';
    let decodedLastName = '';
    try { const p = JSON.parse(text); if (p.id) id = p.id; if (p.name) decodedName = p.name; if (p.lastName) decodedLastName = p.lastName; } catch {}
    const pool = [...allUsers, currentUser].filter(Boolean) as User[];
    const byId = pool.find(u => u.id === id);
    if (byId) return byId;
    const q = text.toLowerCase();
    const byName = pool.find(u => u.name.toLowerCase().includes(q) || (u.lastName || '').toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    return byName || null;
  };

  const filteredClients = clientUsers.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isSuperAdmin = currentUser?.email === 'hamada.laidi.14@gmail.com';

  const filteredAdmins = adminUsers.filter((u) =>
    u.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const filteredWorkers = workersData.filter(w =>
    w.name.toLowerCase().includes(workerSearch.toLowerCase()) ||
    w.role.toLowerCase().includes(workerSearch.toLowerCase())
  );

  const activeWorkerCount = workersData.filter(w => w.status === 'active').length;
  const avgWorkerRating = (workersData.reduce((s, w) => s + w.rating, 0) / workersData.length).toFixed(1);

  const statCards = [
    { label: 'Total Clients', value: clientUsers.length, color: 'rgba(0,180,216,0.1)', icon: Users },
    { label: 'Active Clients', value: activeClients, color: 'rgba(74,222,128,0.1)', icon: Users },
    { label: 'Inactive Clients', value: inactiveClients, color: 'rgba(239,68,68,0.1)', icon: Users },
    { label: 'Spam Reports', value: spamClients, color: 'rgba(234,179,8,0.1)', icon: AlertCircle },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <motion.aside
        animate={{ width: mobileSidebar ? 280 : sidebarOpen ? 240 : 64 }}
        className={`fixed lg:relative z-50 h-screen bg-card border-r border-foreground/10 flex flex-col flex-shrink-0 transition-colors ${
          mobileSidebar ? 'left-0 shadow-2xl' : '-left-full lg:left-0'
        }`}
      >
        <div className="flex items-center justify-between h-14 px-4 border-b border-foreground/10">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Link href="/" className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors text-foreground/50 hover:text-foreground" title="Home">
                <Home className="w-4 h-4" strokeWidth={1.5} />
              </Link>
              {isSuperAdmin && <Crown className="w-4 h-4 text-yellow-400" strokeWidth={1.5} />}
              <span className="text-sm font-bold tracking-wider text-foreground uppercase">Admin</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            {!sidebarOpen && (
              <Link href="/" className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors text-foreground/50 hover:text-foreground" title="Home">
                <Home className="w-4 h-4" strokeWidth={1.5} />
              </Link>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors text-foreground/50"
            >
              <ChevronLeft className={`w-4 h-4 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
            </button>
          </div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {sidebarLinks.map((link) => {
            const isActive = activeSection === link.section;
            return (
              <button
                key={link.section}
                onClick={() => setActiveSection(link.section)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                  isActive
                    ? 'text-accent bg-accent/[0.08]'
                    : 'text-foreground/50 hover:text-foreground hover:bg-foreground/[0.03]'
                }`}
              >
                <link.icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.5} />
                {sidebarOpen && <span className="truncate">{link.label}</span>}
                {isActive && (
                  <motion.span
                    layoutId="admin-sidebar-active"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-accent rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </motion.aside>

      {mobileSidebar && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileSidebar(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 h-screen overflow-hidden overflow-y-auto admin-main">
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-md border-b border-foreground/10 transition-shadow duration-300" style={{ boxShadow: headerScrolled ? '0 1px 8px rgba(0,0,0,0.2)' : 'none' }}>
          <div className="flex items-center justify-between h-14 px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebar(!mobileSidebar)}
                className="lg:hidden p-2 rounded-lg hover:bg-foreground/5 text-foreground/60"
              >
                <Menu className="w-5 h-5" />
              </button>
              <motion.h1
                animate={{ scale: headerScrolled ? 0.85 : 1, opacity: headerScrolled ? 0.7 : 1 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-lg font-bold text-foreground capitalize origin-left"
              >
                Admin {activeSection}
              </motion.h1>
            </div>
            <motion.p
              animate={{ opacity: headerScrolled ? 0 : 1, y: headerScrolled ? -8 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-sm text-foreground/50"
            >
              Manage users, analytics, and system health
            </motion.p>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {activeSection === 'dashboard' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-xl p-5 bg-card border border-foreground/10 hover:border-accent/30 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">{stat.label}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.color }}>
                        <stat.icon className="w-4 h-4 text-foreground" strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-card border border-foreground/10 rounded-xl p-6"
                >
                  <h2 className="text-sm font-bold text-foreground mb-4">New Clients (Monthly)</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={[
                      { month: 'Jan', signups: 8, returning: 4 },
                      { month: 'Feb', signups: 10, returning: 5 },
                      { month: 'Mar', signups: 7, returning: 11 },
                      { month: 'Apr', signups: 14, returning: 8 },
                      { month: 'May', signups: 12, returning: 16 },
                      { month: 'Jun', signups: 18, returning: 17 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis stroke="rgba(255,255,255,0.2)" />
                      <YAxis stroke="rgba(255,255,255,0.2)" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Legend />
                      <Bar dataKey="signups" name="New Signups" fill="#00b4d8" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="returning" name="Returning" fill="#4ade80" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="bg-card border border-foreground/10 rounded-xl p-6"
                >
                  <h2 className="text-sm font-bold text-foreground mb-4">Platform Activity</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={[
                      { month: 'Jan', workouts: 120, visits: 340 },
                      { month: 'Feb', workouts: 150, visits: 400 },
                      { month: 'Mar', workouts: 180, visits: 480 },
                      { month: 'Apr', workouts: 220, visits: 520 },
                      { month: 'May', workouts: 280, visits: 610 },
                      { month: 'Jun', workouts: 350, visits: 750 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis stroke="rgba(255,255,255,0.2)" />
                      <YAxis stroke="rgba(255,255,255,0.2)" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Legend />
                      <Area type="monotone" dataKey="visits" name="Gym Visits" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
                      <Area type="monotone" dataKey="workouts" name="Workouts Logged" stroke="#00b4d8" fill="#00b4d8" fillOpacity={0.2} strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </div>
            </>
          )}

          {activeSection === 'clients' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-foreground/10 rounded-xl p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-sm font-bold text-foreground">Clients ({clientUsers.length})</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    <input
                      type="text"
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50 transition-colors"
                    />
                  </div>
                  <button onClick={() => setShowAddModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-accent/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors whitespace-nowrap">
                    <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                    Add
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Email</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Membership</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Status</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Age</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Revenue</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.map((user, idx) => (
                      <motion.tr
                        key={user.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.03 }}
                        className="border-b border-foreground/[0.04] hover:bg-foreground/[0.02] transition-colors"
                      >
                        <td className="py-3 px-4 text-foreground font-medium">{user.name}</td>
                        <td className="py-3 px-4 text-foreground/60">{user.email}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                            user.membership === 'elite' ? 'bg-purple-500/10 text-purple-400' :
                            user.membership === 'premium' ? 'bg-accent/10 text-accent' :
                            'bg-foreground/[0.05] text-foreground/40'
                          }`}>{user.membership}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                            user.isSpam ? 'bg-yellow-500/10 text-yellow-400' :
                            user.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                          }`}>
                            {user.isSpam ? 'Spam' : user.isActive ? 'Active' : 'Désactivé'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-foreground/60">{user.age || '-'}</td>
                        <td className="py-3 px-4 text-foreground font-medium">{user.revenue || 0} DA</td>
                        <td className="py-3 px-4">
                          <div className="flex gap-1">
                            <button onClick={() => toggleUserActive(user.id)} className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors" title={user.isActive ? 'Désactiver' : 'Activer'}>
                              {user.isActive ? <EyeOff className="w-4 h-4 text-red-400" /> : <Eye className="w-4 h-4 text-green-400" />}
                            </button>
                            {user.isSpam ? (
                              <button onClick={() => removeSpam(user.id)} className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors" title="Remove spam">
                                <AlertCircle className="w-4 h-4 text-green-400" />
                              </button>
                            ) : (
                              <button onClick={() => markUserAsSpam(user.id)} className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors" title="Mark as spam">
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                              </button>
                            )}
                            <button onClick={() => setProfileUser(user)} className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors" title="View profile">
                              <QrCode className="w-4 h-4 text-blue-400" />
                            </button>
                            <button onClick={() => { if (confirm(`Delete client ${user.name}?`)) deleteUser(user.id); }} className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors" title="Delete">
                              <Trash2 className="w-4 h-4 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Client Modal */}
              {showAddModal && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  onClick={() => setShowAddModal(false)}
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-card border border-foreground/10 rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-foreground">Add Client</h3>
                      <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded-lg hover:bg-foreground/[0.05] transition-colors text-foreground/50">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Name</label>
                          <input value={newClient.name} onChange={(e) => setNewClient({...newClient, name: e.target.value})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50" placeholder="First name" />
                        </div>
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Last Name</label>
                          <input value={newClient.lastName} onChange={(e) => setNewClient({...newClient, lastName: e.target.value})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50" placeholder="Last name" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-foreground/50 mb-1 block">Email</label>
                        <input type="email" value={newClient.email} onChange={(e) => setNewClient({...newClient, email: e.target.value})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50" placeholder="client@email.com" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Membership</label>
                          <select value={newClient.membership} onChange={(e) => setNewClient({...newClient, membership: e.target.value as 'free'|'premium'|'elite'})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50">
                            <option value="free">Free</option>
                            <option value="premium">Premium</option>
                            <option value="elite">Elite</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Sex</label>
                          <select value={newClient.sex} onChange={(e) => setNewClient({...newClient, sex: e.target.value as 'male'|'female'|'other'})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50">
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Age</label>
                          <input type="number" value={newClient.age} onChange={(e) => setNewClient({...newClient, age: e.target.value})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50" />
                        </div>
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Height (cm)</label>
                          <input type="number" value={newClient.height} onChange={(e) => setNewClient({...newClient, height: e.target.value})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50" />
                        </div>
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Weight (kg)</label>
                          <input type="number" value={newClient.weight} onChange={(e) => setNewClient({...newClient, weight: e.target.value})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Sessions</label>
                          <input type="number" value={newClient.sessionsLeft} onChange={(e) => setNewClient({...newClient, sessionsLeft: e.target.value})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50" placeholder="30" />
                        </div>
                        <div>
                          <label className="text-xs text-foreground/50 mb-1 block">Expiration Date</label>
                          <input type="date" value={newClient.expirationDate} onChange={(e) => setNewClient({...newClient, expirationDate: e.target.value})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50" />
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-foreground/50 mb-1 block">Revenue (DA)</label>
                        <input type="number" value={newClient.revenue} onChange={(e) => setNewClient({...newClient, revenue: e.target.value})} className="w-full px-3 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground focus:outline-none focus:border-accent/50" placeholder="0" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 rounded-lg border border-foreground/10 text-foreground/70 text-sm font-semibold hover:bg-foreground/[0.05] transition-colors">
                        Cancel
                      </button>
                      <button onClick={() => {
                        if (!newClient.name.trim() || !newClient.email.trim()) return;
                        addUser({
                          id: `${Date.now()}`,
                          name: newClient.name.trim(),
                          lastName: newClient.lastName.trim() || undefined,
                          email: newClient.email.trim(),
                          membership: newClient.membership,
                          role: 'user',
                          isActive: true,
                          isSpam: false,
                          age: newClient.age ? Number(newClient.age) : undefined,
                          sex: newClient.sex,
                          height: newClient.height ? Number(newClient.height) : undefined,
                          weight: newClient.weight ? Number(newClient.weight) : undefined,
                          sessionsLeft: newClient.sessionsLeft ? Number(newClient.sessionsLeft) : 30,
                          expirationDate: newClient.expirationDate || new Date(Date.now() + 365*24*60*60*1000).toISOString().split('T')[0],
                          revenue: newClient.revenue ? Number(newClient.revenue) : 0,
                          joinDate: new Date().toISOString().split('T')[0],
                        });
                        setShowAddModal(false);
                        setNewClient({ name: '', lastName: '', email: '', membership: 'free', age: '', sex: 'male', height: '', weight: '', sessionsLeft: '', expirationDate: '', revenue: '' });
                      }} className="flex-1 py-2.5 rounded-lg bg-accent/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors">
                        Add Client
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
          )}

          {activeSection === 'scanner' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-card border border-foreground/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Scan style={{ width: 18, height: 18, color: '#00d4aa' }} />
                <h2 className="text-sm font-bold text-foreground">QR Scanner — Membership Check</h2>
              </div>
              <p className="text-xs text-foreground/50 mb-5">Scan a member&apos;s QR code or type their name to see their subscription status</p>

              <div style={{ maxWidth: 600, margin: '0 auto' }}>
                {/* Top row: search + scan button */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 14, position: 'relative' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', width: 15, height: 15, color: 'rgba(255,255,255,0.2)' }} />
                    <input
                      type="text" placeholder="Search by name…"
                      value={searchQuery}
                      onFocus={() => setShowSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          const user = findUser(searchQuery.trim());
                          if (user) {
                            setSelectedUser(user);
                            setScannedUserId(searchQuery.trim());
                            setSearchQuery('');
                            setShowSuggestions(false);
                          }
                        }
                      }}
                      style={{
                        width: '100%', padding: '11px 14px 11px 38px', fontSize: 14, outline: 'none',
                        borderRadius: 10, border: '1px solid var(--border)',
                        background: 'rgba(255,255,255,0.03)', color: '#fff',
                      }}
                    />
                    {/* Suggestions dropdown */}
                    {showSuggestions && searchQuery.trim() && (
                      <div style={{
                        position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 50,
                        marginTop: 4, borderRadius: 10, overflow: 'hidden',
                        border: '1px solid var(--border)', background: '#1a1a1a',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                      }}>
                        {(() => {
                          const pool = [...allUsers, currentUser].filter(Boolean) as User[];
                          const q = searchQuery.toLowerCase();
                          const matches = pool.filter(u =>
                            u.name.toLowerCase().includes(q) ||
                            (u.lastName || '').toLowerCase().includes(q) ||
                            u.email.toLowerCase().includes(q)
                          ).slice(0, 8);
                          return matches.length ? matches.map((u) => (
                            <div
                              key={u.id}
                              onMouseDown={() => {
                                setSelectedUser(u);
                                setScannedUserId(u.id);
                                setSearchQuery('');
                                setShowSuggestions(false);
                              }}
                              style={{
                                padding: '10px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10,
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,212,170,0.08)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                              <div style={{
                                width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                                background: u.isActive ? 'rgba(0,212,170,0.2)' : 'rgba(239,68,68,0.2)',
                                color: u.isActive ? '#00d4aa' : '#ef4444',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: 12,
                              }}>
                                {u.name?.charAt(0)}{u.lastName?.charAt(0)}
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ color: '#fff', fontWeight: 600, fontSize: 13 }}>{u.name} {u.lastName || ''}</div>
                                <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>{u.email} · {u.membership}</div>
                              </div>
                              <span style={{
                                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                                background: u.isActive ? 'rgba(74,222,128,0.15)' : 'rgba(239,68,68,0.15)',
                                color: u.isActive ? '#4ade80' : '#ef4444',
                              }}>
                                {u.isActive ? 'Active' : 'Expired'}
                              </span>
                            </div>
                          )) : (
                            <div style={{ padding: '14px', textAlign: 'center', color: 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                              No members found
                            </div>
                          );
                        })()}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={scanning ? stopScanner : startScanner}
                    style={{
                      padding: '11px 16px', borderRadius: 10, border: 'none', cursor: 'pointer',
                      background: scanning ? 'rgba(239,68,68,0.15)' : 'rgba(0,212,170,0.12)',
                      color: scanning ? '#ef4444' : '#00d4aa',
                      fontWeight: 700, fontSize: 12, whiteSpace: 'nowrap',
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}
                  >
                    {scanning ? '⏹ Stop' : '📷 Scan'}
                  </button>
                </div>

                {/* Camera viewfinder (always in DOM, hidden when not scanning) */}
                <div style={{ display: scanning ? 'block' : 'none', marginBottom: 14, borderRadius: 12, overflow: 'hidden', maxWidth: 400 }}>
                  <div ref={scannerContainerRef} id="qr-reader-el" style={{ width: '100%' }} />
                </div>

                {/* QR paste area */}
                <div style={{ marginBottom: 14 }}>
                  <textarea
                    placeholder="Or paste QR code text here (JSON or plain ID)…"
                    rows={2}
                    value={scannedUserId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setScannedUserId(val);
                      let raw: Record<string,string> = {};
                      try { raw = JSON.parse(val); } catch { raw = { id: val }; }
                      setScannedRaw(raw);
                      setSelectedUser(findUser(val));
                    }}
                    style={{
                      width: '100%', padding: 10, fontSize: 12, outline: 'none',
                      borderRadius: 10, border: '1px solid var(--border)', fontFamily: 'monospace',
                      background: 'rgba(255,255,255,0.02)', color: 'rgba(255,255,255,0.5)', resize: 'none',
                    }}
                  />
                </div>

                {/* RESULT — two-column: left=profile, right=QR+stats */}
                {selectedUser && (
                  <div className="w-full mx-auto bg-zinc-900 rounded-xl overflow-hidden" style={{ border: `2px solid ${selectedUser.isActive ? '#00d4aa' : '#ef4444'}` }}>
                    {/* Colored status bar */}
                    <div style={{ height: 4, background: selectedUser.isActive ? '#00d4aa' : '#ef4444' }} />
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* LEFT DIV: User Profile Details */}
                    <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Member Profile</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs text-zinc-500">Name</span>
                          <span className="text-sm font-semibold text-white">{selectedUser.name} {selectedUser.lastName || ''}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs text-zinc-500">Email</span>
                          <span className="text-sm text-white">{selectedUser.email}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs text-zinc-500">Age</span>
                          <span className="text-sm font-semibold text-white">{selectedUser.age || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs text-zinc-500">Sex</span>
                          <span className="text-sm font-semibold text-white capitalize">{selectedUser.sex || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs text-zinc-500">Height</span>
                          <span className="text-sm font-semibold text-white">{selectedUser.height || '-'}cm</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs text-zinc-500">Weight</span>
                          <span className="text-sm font-semibold text-white">{selectedUser.weight || '-'}kg</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs text-zinc-500">Membership</span>
                          <span className="text-sm font-semibold text-white capitalize">{selectedUser.membership || '-'}</span>
                        </div>
                        <div className="flex justify-between border-b border-zinc-800 pb-2">
                          <span className="text-xs text-zinc-500">Joined</span>
                          <span className="text-sm font-semibold text-white">{selectedUser.joinDate || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-zinc-500">Revenue</span>
                          <span className="text-sm font-semibold text-white">{selectedUser.revenue || 0} DA</span>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT DIV: QR Code and Status */}
                    <div className="bg-zinc-950 p-6 rounded-lg border border-zinc-800 flex flex-col items-center justify-between gap-4">
                      <div className="flex flex-col items-center">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Member QR Code</h3>
                        <div className="bg-white p-3 rounded-xl">
                          <QRCodeSVG value={JSON.stringify({ id: selectedUser.id, name: selectedUser.name, lastName: selectedUser.lastName })} size={160} level="H" includeMargin />
                        </div>
                      </div>

                      <div style={{
                        width: '100%', borderRadius: 8, padding: 12,
                        background: selectedUser.isActive ? 'rgba(0,212,170,0.08)' : 'rgba(239,68,68,0.08)',
                        border: `1px solid ${selectedUser.isActive ? 'rgba(0,212,170,0.25)' : 'rgba(239,68,68,0.25)'}`,
                      }}>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-zinc-500">Status</span>
                          <span style={{
                            padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 800,
                            background: selectedUser.isActive ? '#00d4aa' : '#ef4444', color: '#000',
                          }}>
                            {selectedUser.isActive ? 'ACTIVE' : 'EXPIRED'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-zinc-500">Sessions</span>
                          <span style={{
                            fontSize: 24, fontWeight: 900,
                            color: (selectedUser.sessionsLeft || 0) > 10 ? '#4ade80' : (selectedUser.sessionsLeft || 0) > 3 ? '#fbbf24' : (selectedUser.sessionsLeft || 0) > 0 ? '#fb923c' : '#ef4444',
                          }}>
                            {selectedUser.sessionsLeft ?? '—'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-zinc-500">Expires</span>
                          <span className="text-sm font-semibold" style={{ color: selectedUser.isActive ? '#fff' : '#ef4444' }}>
                            {selectedUser.expirationDate || '—'}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => { setSelectedUser(null); setScannedUserId(''); setScannedRaw({}); setSearchQuery(''); }}
                        className="w-full py-2 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                        style={{
                          border: '2px solid', borderColor: selectedUser.isActive ? 'rgba(0,212,170,0.3)' : 'rgba(239,68,68,0.3)',
                          color: selectedUser.isActive ? '#00d4aa' : '#ef4444',
                          background: selectedUser.isActive ? 'rgba(0,212,170,0.05)' : 'rgba(239,68,68,0.05)',
                        }}
                      >
                        Close
                      </button>
                    </div>
                    </div>
                  </div>
                )}

                {!selectedUser && scannedUserId.trim() && !scanning && (
                  <div style={{ padding: 40, textAlign: 'center', borderRadius: 16, border: '2px solid rgba(239,68,68,0.3)' }}>
                    <AlertCircle style={{ width: 32, height: 32, color: '#ef4444', margin: '0 auto 12px' }} />
                    <p style={{ color: '#ef4444', fontSize: 13, fontWeight: 700 }}>Not recognized</p>
                    <p style={{ color: 'rgba(239,68,68,0.5)', fontSize: 11, marginTop: 4 }}>Try a different name or scan their QR code</p>
                  </div>
                )}

                {!selectedUser && !scannedUserId.trim() && !scanning && (
                  <div style={{ padding: 40, textAlign: 'center', borderRadius: 16, border: '1px solid var(--border)' }}>
                    <Scan style={{ width: 36, height: 36, color: 'rgba(255,255,255,0.06)', margin: '0 auto 12px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.15)', fontSize: 12 }}>Scan a QR code or type a name to check membership</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'admins' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-foreground/10 rounded-xl p-6"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-sm font-bold text-foreground">Admins ({adminUsers.length})</h2>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                  <input type="text" placeholder="Search admins..." value={adminSearch} onChange={(e) => setAdminSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10">
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Name</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Email</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Role</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Joined</th>
                      <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((user, idx) => (
                      <motion.tr key={user.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }} className="border-b border-foreground/[0.04] hover:bg-foreground/[0.02] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[11px] font-bold text-accent">{user.name.charAt(0)}</div>
                            <span className="text-foreground font-medium">{user.name}{user.id === currentUser?.id ? <span className="text-[10px] text-accent ml-1">(you)</span> : ''}{isSuperAdmin && user.id === currentUser?.id && <Crown className="w-3.5 h-3.5 text-yellow-400 inline ml-1" strokeWidth={1.5} />}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-foreground/60">{user.email}</td>
                        <td className="py-3 px-4"><span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-accent/10 text-accent"><Shield className="w-3 h-3" strokeWidth={1.5} /> Admin</span></td>
                        <td className="py-3 px-4 text-foreground/60">{user.joinDate || '-'}</td>
                        <td className="py-3 px-4"><span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium ${user.isActive ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredAdmins.length === 0 && <div className="text-center py-10 text-foreground/40 text-sm">No admins found</div>}
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Stats row */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Clients', value: clientUsers.length, icon: Users, color: '#00b4d8', suffix: 'registered' },
                  { label: 'Active Rate', value: clientUsers.length > 0 ? Math.round((activeClients / clientUsers.length) * 100) + '%' : '0%', icon: Activity, color: '#4ade80', suffix: 'currently active' },
                  { label: 'Avg Session Time', value: '42 min', icon: Clock, color: '#f59e0b', suffix: 'per workout' },
                  { label: 'Retention Rate', value: '78%', icon: TrendingUp, color: '#a78bfa', suffix: 'monthly' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card border border-foreground/10 rounded-xl p-5 hover:border-accent/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">{stat.label}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.color + '20' }}>
                        <stat.icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-foreground/40 mt-1">{stat.suffix}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-foreground/10 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-foreground mb-4">Client Activity Distribution</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                      <Pie data={userActivityData} cx="50%" cy="50%" innerRadius={65} outerRadius={105} paddingAngle={5} dataKey="value">
                        {userActivityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-card border border-foreground/10 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-foreground mb-4">Monthly Growth Trend</h2>
                  <ResponsiveContainer width="100%" height={280}>
                    <LineChart data={[
                      { month: 'Jan', clients: 12, revenue: 8000 },
                      { month: 'Feb', clients: 15, revenue: 9500 },
                      { month: 'Mar', clients: 18, revenue: 12000 },
                      { month: 'Apr', clients: 22, revenue: 11500 },
                      { month: 'May', clients: 28, revenue: 15000 },
                      { month: 'Jun', clients: 35, revenue: 18000 },
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis stroke="rgba(255,255,255,0.2)" />
                      <YAxis stroke="rgba(255,255,255,0.2)" />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)' }} />
                      <Legend />
                      <Line type="monotone" dataKey="clients" stroke="#00b4d8" strokeWidth={2} dot={{ fill: '#00b4d8', r: 4 }} name="Clients" />
                      <Line type="monotone" dataKey="revenue" stroke="#4ade80" strokeWidth={2} dot={{ fill: '#4ade80', r: 4 }} name="Revenue ($)" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Membership breakdown + Peak hours */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-foreground/10 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-foreground mb-4">Membership Breakdown</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Elite', count: clientUsers.filter(u => u.membership === 'elite').length, color: '#a78bfa', pct: clientUsers.length > 0 ? Math.round((clientUsers.filter(u => u.membership === 'elite').length / clientUsers.length) * 100) : 0 },
                      { label: 'Premium', count: clientUsers.filter(u => u.membership === 'premium').length, color: '#00b4d8', pct: clientUsers.length > 0 ? Math.round((clientUsers.filter(u => u.membership === 'premium').length / clientUsers.length) * 100) : 0 },
                      { label: 'Free', count: clientUsers.filter(u => u.membership === 'free').length, color: '#f59e0b', pct: clientUsers.length > 0 ? Math.round((clientUsers.filter(u => u.membership === 'free').length / clientUsers.length) * 100) : 0 },
                    ].map((tier, i) => (
                      <div key={tier.label}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-foreground/60">{tier.label}</span>
                          <span className="text-foreground font-medium">{tier.count} clients ({tier.pct}%)</span>
                        </div>
                        <div className="h-3 bg-foreground/[0.05] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${tier.pct}%` }} transition={{ delay: 0.2 + i * 0.08, duration: 0.5 }} className="h-full rounded-full" style={{ background: tier.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-card border border-foreground/10 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-foreground mb-4">Peak Hours</h2>
                  <div className="space-y-2">
                    {[
                      { hour: '6-8 AM', pct: 25, label: 'Morning Rush' },
                      { hour: '8-12 PM', pct: 15, label: 'Late Morning' },
                      { hour: '12-2 PM', pct: 20, label: 'Lunch Break' },
                      { hour: '2-5 PM', pct: 10, label: 'Afternoon' },
                      { hour: '5-8 PM', pct: 40, label: 'Evening Peak' },
                      { hour: '8-10 PM', pct: 15, label: 'Night' },
                    ].map((slot, i) => (
                      <div key={slot.hour} className="flex items-center gap-3">
                        <span className="text-[10px] text-foreground/40 w-14">{slot.hour}</span>
                        <div className="flex-1 h-5 bg-foreground/[0.05] rounded-full overflow-hidden relative">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${slot.pct}%` }} transition={{ delay: 0.2 + i * 0.04, duration: 0.4 }} className="h-full rounded-full" style={{ background: slot.pct >= 30 ? 'linear-gradient(90deg, #f59e0b, #ef4444)' : 'linear-gradient(90deg, rgba(0,180,216,0.3), rgba(0,180,216,0.7))' }} />
                        </div>
                        <span className="text-[10px] text-foreground/60 w-20 text-right">{slot.pct}% · {slot.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Demographics + Performance */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-card border border-foreground/10 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-foreground mb-4">Client Demographics</h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-foreground/50 mb-2">Age Groups</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: '18-24', count: Math.round(clientUsers.length * 0.25), color: '#00b4d8' },
                          { label: '25-34', count: Math.round(clientUsers.length * 0.35), color: '#4ade80' },
                          { label: '35-44', count: Math.round(clientUsers.length * 0.22), color: '#f59e0b' },
                          { label: '45+', count: Math.round(clientUsers.length * 0.18), color: '#a78bfa' },
                        ].map((g) => (
                          <div key={g.label} className="p-3 rounded-lg bg-foreground/[0.03] text-center">
                            <p className="text-lg font-bold text-foreground">{g.count}</p>
                            <p className="text-[10px] text-foreground/50">{g.label} years</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-foreground/50 mb-2">Gender Split</p>
                      <div className="flex gap-3">
                        <div className="flex-1 p-3 rounded-lg bg-accent/10 text-center">
                          <p className="text-lg font-bold text-accent">{Math.round(clientUsers.length * 0.6)}</p>
                          <p className="text-[10px] text-foreground/50">Male</p>
                        </div>
                        <div className="flex-1 p-3 rounded-lg bg-pink-500/10 text-center">
                          <p className="text-lg font-bold text-pink-400">{Math.round(clientUsers.length * 0.4)}</p>
                          <p className="text-[10px] text-foreground/50">Female</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-card border border-foreground/10 rounded-xl p-6">
                  <h2 className="text-sm font-bold text-foreground mb-4">Key Performance Indicators</h2>
                  <div className="space-y-4">
                    {[
                      { label: 'Monthly Active Clients', value: activeClients, target: clientUsers.length, unit: 'clients', color: '#00b4d8' },
                      { label: 'Avg Workouts/Week', value: 3.2, target: 5, unit: 'sessions', color: '#4ade80' },
                      { label: 'Client Satisfaction', value: 92, target: 100, unit: '%', color: '#f59e0b' },
                      { label: 'Staff Utilization', value: 78, target: 100, unit: '%', color: '#a78bfa' },
                    ].map((kpi, i) => {
                      const pct = Math.min(100, Math.round((kpi.value / kpi.target) * 100));
                      return (
                        <div key={kpi.label}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-foreground/60">{kpi.label}</span>
                            <span className="text-foreground font-medium">{kpi.value}/{kpi.target} {kpi.unit}</span>
                          </div>
                          <div className="h-2.5 bg-foreground/[0.05] rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.2 + i * 0.06, duration: 0.5 }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${kpi.color}88, ${kpi.color})` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'revenue' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="bg-card border border-foreground/10 rounded-xl p-6 lg:col-span-2">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-foreground">Revenue Overview</h2>
                  <div className="flex gap-1 bg-foreground/[0.05] p-0.5 rounded-lg">
                    {(['month', 'year'] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => setTimeframe(t)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                          timeframe === t ? 'bg-accent text-accent-foreground' : 'text-foreground/50 hover:text-foreground'
                        }`}
                      >
                        {t === 'month' ? 'Month' : 'Year'}
                      </button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis stroke="rgba(255,255,255,0.2)" />
                    <YAxis stroke="rgba(255,255,255,0.2)" />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid rgba(255,255,255,0.1)' }} />
                    <Legend />
                    <Line type="monotone" dataKey="revenue" stroke="#00b4d8" strokeWidth={2} dot={{ fill: '#00b4d8', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-card border border-foreground/10 rounded-xl p-6">
                <h2 className="text-sm font-bold text-foreground mb-4">Revenue Breakdown</h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Memberships</span>
                    <span className="text-sm font-bold text-foreground">$12,400</span>
                  </div>
                  <div className="h-2 bg-foreground/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-accent rounded-full" style={{ width: '68%' }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Shop Sales</span>
                    <span className="text-sm font-bold text-foreground">$3,200</span>
                  </div>
                  <div className="h-2 bg-foreground/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-green-400 rounded-full" style={{ width: '18%' }} />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-foreground/60">Coaching</span>
                    <span className="text-sm font-bold text-foreground">$2,400</span>
                  </div>
                  <div className="h-2 bg-foreground/[0.05] rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: '14%' }} />
                  </div>
                </div>
              </div>
              <div className="bg-card border border-foreground/10 rounded-xl p-6">
                <h2 className="text-sm font-bold text-foreground mb-4">Summary</h2>
                <div className="space-y-4">
                  <div className="p-4 bg-foreground/[0.03] rounded-lg">
                    <p className="text-xs text-foreground/40 uppercase tracking-wider">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground mt-1">$18,000</p>
                  </div>
                  <div className="p-4 bg-foreground/[0.03] rounded-lg">
                    <p className="text-xs text-foreground/40 uppercase tracking-wider">Avg Revenue/User</p>
                    <p className="text-2xl font-bold text-foreground mt-1">${allUsers.length > 0 ? Math.round(18000 / allUsers.length) : 0}</p>
                  </div>
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-xs text-green-400 uppercase tracking-wider">Growth</p>
                    <p className="text-2xl font-bold text-green-400 mt-1">+12.5%</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              <div className="bg-card border border-foreground/10 rounded-xl p-6">
                <h2 className="text-sm font-bold text-foreground mb-4">Security Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-foreground/[0.03] rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">2FA Enforcement</p>
                      <p className="text-xs text-foreground/40">Require two-factor auth for all users</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-500/10 text-green-400">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-foreground/[0.03] rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Session Timeout</p>
                      <p className="text-xs text-foreground/40">Auto logout after inactivity</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-500/10 text-green-400">30 min</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-foreground/[0.03] rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">Password Policy</p>
                      <p className="text-xs text-foreground/40">Min 8 chars, special chars required</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-green-500/10 text-green-400">Strong</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-foreground/[0.03] rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-foreground">API Rate Limiting</p>
                      <p className="text-xs text-foreground/40">Requests per minute per user</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/10 text-blue-400">100/min</span>
                  </div>
                </div>
              </div>
              <div className="bg-card border border-foreground/10 rounded-xl p-6">
                <h2 className="text-sm font-bold text-foreground mb-4">Recent Activity Log</h2>
                <div className="space-y-3">
                  {[
                    { action: 'Login from new device', user: 'John D.', time: '2 min ago', type: 'info' },
                    { action: 'Password change request', user: 'Sarah M.', time: '15 min ago', type: 'warning' },
                    { action: 'Failed login attempt', user: 'Unknown IP', time: '1 hour ago', type: 'error' },
                    { action: 'Admin permission granted', user: 'Admin', time: '3 hours ago', type: 'info' },
                    { action: 'Account suspended', user: 'Mark T.', time: '5 hours ago', type: 'error' },
                  ].map((log, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-foreground/[0.02] transition-colors">
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                        log.type === 'error' ? 'bg-red-400' :
                        log.type === 'warning' ? 'bg-yellow-400' : 'bg-accent'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{log.action}</p>
                        <p className="text-xs text-foreground/40">{log.user} · {log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'products' && (
  <div className="p-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-xl font-bold text-foreground">Products Management</h2>
      <Button onClick={() => { setShowAddProduct(true); setEditProduct(null); }} className="bg-accent text-accent-foreground hover:bg-accent/90 text-sm">
        <Plus className="w-4 h-4 mr-1.5" /> Add Product
      </Button>
    </div>

    {/* Search + Category Filter */}
    <div className="flex items-center gap-3 mb-4">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
        <input
          value={productSearch}
          onChange={(e) => setProductSearch(e.target.value)}
          placeholder="Search products..."
          className="w-full h-9 pl-9 pr-3 rounded-lg text-sm bg-card border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/40"
          style={{ colorScheme: 'dark' }}
        />
      </div>
      <select
        value={productCategory}
        onChange={(e) => setProductCategory(e.target.value)}
        className="h-9 px-3 rounded-lg text-sm bg-foreground/[0.04] border border-foreground/[0.08] text-foreground focus:outline-none focus:border-accent/40"
        style={{ colorScheme: 'dark' }}
      >
        <option value="all" className="bg-card text-foreground">All Categories</option>
        <option value="complements" className="bg-card text-foreground">Compléments</option>
        <option value="materiel" className="bg-card text-foreground">Matériel</option>
        <option value="abonnement" className="bg-card text-foreground">Abonnements</option>
        <option value="vetements" className="bg-card text-foreground">Vêtements</option>
        <option value="accessoires" className="bg-card text-foreground">Accessoires</option>
      </select>
      <span className="text-xs text-foreground/50">{filteredProducts.length} products</span>
    </div>

    {/* Products by Category (collapsible) */}
    <div className="space-y-3">
      {(['complements', 'materiel', 'abonnement', 'vetements', 'accessoires'] as const).map((cat) => {
        const catProducts = filteredProducts.filter((p) => p.category === cat);
        if (catProducts.length === 0 && productCategory !== 'all') return null;
        if (catProducts.length === 0 && productCategory === 'all') return null;

        const catLabels: Record<string, string> = {
          complements: 'Compléments',
          materiel: 'Matériel',
          abonnement: 'Abonnements',
          vetements: 'Vêtements',
          accessoires: 'Accessoires',
        };

        return (
          <div key={cat} className="bg-card rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setExpandedCat(expandedCat === cat ? null : cat)}
              className="w-full flex items-center justify-between px-4 py-3 bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2">
                <ChevronRight className={`w-4 h-4 text-foreground/40 transition-transform ${expandedCat === cat ? 'rotate-90' : ''}`} />
                <span className="text-sm font-semibold text-foreground">{catLabels[cat]}</span>
                <span className="text-xs text-foreground/40">({catProducts.length})</span>
              </div>
            </button>
            {expandedCat === cat && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-t border-border text-left text-xs text-foreground/50 uppercase tracking-wider">
                      <th className="py-2.5 px-4">Product</th>
                      <th className="py-2.5 px-4 hidden sm:table-cell">Price</th>
                      <th className="py-2.5 px-4">Stock</th>
                      <th className="py-2.5 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catProducts.map((product) => (
                      <tr key={product.id} className="border-t border-border/50 hover:bg-foreground/[0.02] transition-colors">
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-foreground/[0.05] overflow-hidden flex-shrink-0">
                              {product.images[0] ? (
                                <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-foreground/20"><Package className="w-5 h-5" /></div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                              <p className="text-xs text-foreground/50 truncate max-w-[160px] sm:max-w-[240px]">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-2.5 px-4 text-sm font-medium text-foreground hidden sm:table-cell">{product.price.toLocaleString()} DA</td>
                        <td className="py-2.5 px-4">
                          <span className={`text-xs font-semibold ${
                            product.stock > 10 ? 'text-green-400' :
                            product.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                          }`}>
                            {product.stock > 10 ? 'In Stock' : product.stock > 0 ? 'Low' : 'Out'}
                          </span>
                        </td>
                        <td className="py-2.5 px-4">
                          <div className="flex items-center gap-1">
                            <button onClick={() => { setEditProduct(product); setShowAddProduct(true); }} className="p-1.5 rounded-lg hover:bg-foreground/5 text-foreground/50 hover:text-accent transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button onClick={() => deleteProduct(product.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-foreground/50 hover:text-red-400 transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        );
      })}
    </div>

    {/* Add/Edit Product Modal */}
    <AddProductModal
      isOpen={showAddProduct}
      onClose={() => { setShowAddProduct(false); setEditProduct(null); }}
      editProduct={editProduct}
    />
  </div>
)}

          {/* Workers Section */}
          {activeSection === 'workers' && (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {[
                  { label: 'Total Staff', value: workersData.length, icon: Briefcase, color: '#00b4d8', suffix: 'team members' },
                  { label: 'Active Now', value: activeWorkerCount, icon: Activity, color: '#4ade80', suffix: 'on duty' },
                  { label: 'Avg Rating', value: avgWorkerRating, icon: Star, color: '#f59e0b', suffix: '/ 5.0' },
                  { label: 'Avg Salary', value: `${Math.round(workersData.reduce((s, w) => s + w.salary, 0) / workersData.length).toLocaleString()} DA`, icon: TrendingUp, color: '#ef4444', suffix: 'monthly' },
                ].map((stat, i) => (
                  <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-card border border-foreground/10 rounded-xl p-5 hover:border-accent/30 transition-all duration-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-medium text-foreground/50 uppercase tracking-wider">{stat.label}</span>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: stat.color + '20' }}>
                        <stat.icon className="w-4 h-4" style={{ color: stat.color }} strokeWidth={1.5} />
                      </div>
                    </div>
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-foreground/40 mt-1">{stat.suffix}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-card border border-foreground/10 rounded-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-sm font-bold text-foreground">Staff Directory</h2>
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
                    <input type="text" placeholder="Search by name or role..." value={workerSearch} onChange={(e) => setWorkerSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-foreground/[0.05] border border-foreground/10 rounded-lg text-sm text-foreground placeholder-foreground/30 focus:outline-none focus:border-accent/50 transition-colors" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-foreground/10">
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Name</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Age</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Role</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Email</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Phone</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Salary</th>
                        <th className="text-left py-3 px-4 text-foreground/40 font-medium text-xs uppercase tracking-wider">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredWorkers.map((w, idx) => (
                        <motion.tr key={w.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.03 }}
                          className="border-b border-foreground/[0.04] hover:bg-foreground/[0.02] transition-colors cursor-pointer"
                          onClick={() => setSelectedWorker(w)}
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-[11px] font-bold text-accent">{w.name.split(' ').map(n => n[0]).join('')}</div>
                              <span className="text-foreground font-medium">{w.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-foreground/60">{w.age}</td>
                          <td className="py-3 px-4 text-foreground">{w.role}</td>
                          <td className="py-3 px-4 text-foreground/60">{w.email}</td>
                          <td className="py-3 px-4 text-foreground/60">{w.phone}</td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${w.status === 'active' ? 'bg-green-500/10 text-green-400' : w.status === 'break' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-400'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${w.status === 'active' ? 'bg-green-400' : w.status === 'break' ? 'bg-yellow-400' : 'bg-red-400'}`} />
                              {w.status.charAt(0).toUpperCase() + w.status.slice(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-foreground font-medium">{w.salary.toLocaleString()} DA</td>
                          <td className="py-3 px-4"><span className="flex items-center gap-1 text-foreground"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" strokeWidth={1.5} />{w.rating}</span></td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {filteredWorkers.length === 0 && <div className="text-center py-10 text-foreground/40 text-sm">No staff members found</div>}
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card border border-foreground/10 rounded-xl p-6">
                <h2 className="text-sm font-bold text-foreground mb-4">Specialties Overview</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    { name: 'Strength Training', coaches: 3, color: '#00b4d8' },
                    { name: 'Cardio & HIIT', coaches: 2, color: '#ef4444' },
                    { name: 'Yoga & Flexibility', coaches: 2, color: '#4ade80' },
                    { name: 'Nutrition', coaches: 1, color: '#f59e0b' },
                    { name: 'Rehab & Therapy', coaches: 1, color: '#a78bfa' },
                    { name: 'CrossFit', coaches: 1, color: '#f472b6' },
                  ].map((spec, i) => (
                    <motion.div key={spec.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 + i * 0.04 }} className="p-3 rounded-lg border border-foreground/10 text-center hover:border-accent/30 transition-all">
                      <p className="text-lg font-bold" style={{ color: spec.color }}>{spec.coaches}</p>
                      <p className="text-[10px] text-foreground/50 mt-0.5">{spec.name}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {/* Worker Detail Modal */}
          <AnimatePresence>
            {selectedWorker && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedWorker(null)}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-card border border-foreground/10 rounded-xl p-6 max-w-md w-full" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-accent/20 flex items-center justify-center text-lg font-bold text-accent">{selectedWorker.name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">{selectedWorker.name}</h3>
                      <p className="text-sm text-foreground/60">{selectedWorker.role}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" strokeWidth={1.5} />
                        <span className="text-xs text-foreground/60">{selectedWorker.rating} rating</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: 'Age', value: `${selectedWorker.age} years` },
                      { label: 'Email', value: selectedWorker.email },
                      { label: 'Phone', value: selectedWorker.phone },
                      { label: 'Salary', value: `${selectedWorker.salary.toLocaleString()} DA` },
                      { label: 'Joined', value: selectedWorker.joinDate },
                    ].map((f) => (
                      <div key={f.label} className="flex justify-between text-sm p-3 bg-foreground/[0.03] rounded-lg">
                        <span className="text-foreground/50">{f.label}</span>
                        <span className="text-foreground font-medium">{f.value}</span>
                      </div>
                    ))}
                    <div className="p-3 bg-foreground/[0.03] rounded-lg">
                      <span className="text-sm text-foreground/50 block mb-2">Specialties</span>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorker.specialties.map(s => (
                          <span key={s} className="px-2.5 py-1 text-[11px] font-medium bg-accent/10 text-accent rounded-full">{s}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedWorker(null)} className="w-full mt-6 bg-accent hover:bg-accent/90 text-accent-foreground font-medium py-2.5 rounded-lg transition-colors text-sm">Close</button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* User Profile Modal (clients table only) */}
          {profileUser && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setProfileUser(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card border border-foreground/10 rounded-xl p-6 max-w-md w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-lg font-bold text-foreground mb-6">User Profile</h3>
                <div className="space-y-4">
                  {[
                    { label: 'Name', value: profileUser.name },
                    { label: 'Email', value: profileUser.email },
                    { label: 'Age', value: `${profileUser.age} years` },
                    { label: 'Sex', value: profileUser.sex ? profileUser.sex.charAt(0).toUpperCase() + profileUser.sex.slice(1) : '-' },
                    { label: 'Height', value: `${profileUser.height} cm` },
                    { label: 'Weight', value: `${profileUser.weight} kg` },
                    { label: 'Membership', value: profileUser.membership?.charAt(0).toUpperCase() + profileUser.membership?.slice(1) || '-' },
                    { label: 'Join Date', value: profileUser.joinDate || '-' },
                    { label: 'Revenue', value: `${profileUser.revenue || 0} DA` },
                  ].map((field) => (
                    <div key={field.label} className="flex justify-between items-center">
                      <span className="text-sm text-foreground/50">{field.label}</span>
                      <span className="text-sm text-foreground font-medium">{field.value}</span>
                    </div>
                  ))}
                  <div className="pt-4 border-t border-foreground/10">
                    <p className="text-sm text-foreground/50 mb-3">QR Code</p>
                    <div className="bg-white p-3 rounded-lg flex items-center justify-center mx-auto w-fit">
                      <QRCodeSVG value={profileUser.id} size={120} level="H" includeMargin />
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setProfileUser(null)}
                  className="mt-6 w-full py-2.5 rounded-lg bg-accent/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function AddProductModal({ isOpen, onClose, editProduct }: { isOpen: boolean; onClose: () => void; editProduct: Product | null }) {
  const addProduct = useStore((s) => s.addProduct);
  const updateProduct = useStore((s) => s.updateProduct);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 0,
    category: 'complements' as Product['category'],
    images: '',
    stock: 0,
    specs: '',
  });

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name,
        description: editProduct.description,
        price: editProduct.price,
        category: editProduct.category,
        images: editProduct.images.join('\n'),
        stock: editProduct.stock,
        specs: editProduct.specs.join('\n'),
      });
    } else {
      setForm({ name: '', description: '', price: 0, category: 'complements', images: '', stock: 0, specs: '' });
    }
  }, [editProduct, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) return;
    const product: Product = {
      id: editProduct?.id || String(Date.now()),
      name: form.name,
      description: form.description,
      price: form.price,
      category: form.category,
      images: form.images.split('\n').filter(Boolean),
      stock: form.stock,
      specs: form.specs.split('\n').filter(Boolean),
      createdAt: editProduct?.createdAt || new Date().toISOString().split('T')[0],
    };
    if (editProduct) {
      updateProduct(editProduct.id, product);
    } else {
      addProduct(product);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-foreground">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-foreground/5 text-foreground/50"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground/60 block mb-1">Name *</label>
            <input className="w-full h-9 px-3 rounded-lg text-sm bg-card border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/40" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required style={{ colorScheme: 'dark' }} />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60 block mb-1">Description</label>
            <textarea className="w-full px-3 py-2 rounded-lg text-sm bg-card border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/40" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ colorScheme: 'dark' }} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground/60 block mb-1">Price (DA) *</label>
              <input type="number" className="w-full h-9 px-3 rounded-lg text-sm bg-card border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/40" value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} required min={0} style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground/60 block mb-1">Stock</label>
              <input type="number" className="w-full h-9 px-3 rounded-lg text-sm bg-card border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/40" value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} min={0} style={{ colorScheme: 'dark' }} />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60 block mb-1">Category</label>
            <select className="w-full h-9 px-3 rounded-lg text-sm bg-card border border-border text-foreground focus:outline-none focus:border-accent/40" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Product['category'] })} style={{ colorScheme: 'dark' }}>
              <option value="complements" className="bg-card text-foreground">Compléments</option>
              <option value="materiel" className="bg-card text-foreground">Matériel</option>
              <option value="abonnement" className="bg-card text-foreground">Abonnements</option>
              <option value="vetements" className="bg-card text-foreground">Vêtements</option>
              <option value="accessoires" className="bg-card text-foreground">Accessoires</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60 block mb-1">Image URLs (one per line)</label>
            <textarea className="w-full px-3 py-2 rounded-lg text-sm bg-card border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/40" rows={2} value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })} style={{ colorScheme: 'dark' }} />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground/60 block mb-1">Specifications (one per line)</label>
            <textarea className="w-full px-3 py-2 rounded-lg text-sm bg-card border border-border text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/40" rows={3} value={form.specs} onChange={(e) => setForm({ ...form, specs: e.target.value })} style={{ colorScheme: 'dark' }} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">{editProduct ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
