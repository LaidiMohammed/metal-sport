'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useRouter } from 'next/navigation';
import { Settings, Lock, User, Bell, ChevronRight, Save, Key, Eye, EyeOff, Loader2, Check } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function SettingsPage() {
  useAuthProtected();
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [height, setHeight] = useState(user?.height?.toString() || '');
  const [weight, setWeight] = useState(user?.weight?.toString() || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [sex, setSex] = useState(user?.sex || 'male');

  // Password
  const [showPwd, setShowPwd] = useState(false);
  const [curPwd, setCurPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState('');

  // Toggles
  const [profileVisible, setProfileVisible] = useState(true);
  const [showAchievements, setShowAchievements] = useState(false);
  const [allowMessaging, setAllowMessaging] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [progressReports, setProgressReports] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    const prefs = localStorage.getItem('kimo-settings-prefs');
    if (prefs) {
      try {
        const p = JSON.parse(prefs);
        setProfileVisible(p.profileVisible ?? true);
        setShowAchievements(p.showAchievements ?? false);
        setAllowMessaging(p.allowMessaging ?? true);
        setReminders(p.reminders ?? true);
        setProgressReports(p.progressReports ?? true);
        setMarketing(p.marketing ?? false);
      } catch {}
    }
  }, []);

  const savePrefs = () => {
    localStorage.setItem('kimo-settings-prefs', JSON.stringify({
      profileVisible, showAchievements, allowMessaging, reminders, progressReports, marketing,
    }));
  };

  const saveProfile = async () => {
    setSaving(true); setError(''); setSaved(false);
    let accessToken = '';
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      accessToken = session?.access_token || '';
    } catch {}
    if (!accessToken) { setError('Not authenticated'); setSaving(false); return; }
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, lastName, height: height ? Number(height) : undefined, weight: weight ? Number(weight) : undefined, age: age ? Number(age) : undefined, sex }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.profile) setUser({ ...user, name: data.profile.name, lastName: data.profile.last_name, height: data.profile.height, weight: data.profile.weight, age: data.profile.age, sex: data.profile.sex });
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        const e = await res.json();
        setError(e.error || 'Save failed');
      }
    } catch { setError('Network error'); }
    setSaving(false);
  };

  const changePassword = async () => {
    if (!newPwd || newPwd.length < 6) { setPwdMsg('Minimum 6 characters'); return; }
    setPwdSaving(true); setPwdMsg('');
    try {
      const { supabase } = await import('@/lib/supabase');
      const { error } = await supabase.auth.updateUser({ password: newPwd });
      if (error) { setPwdMsg(error.message); } else { setPwdMsg('Password updated!'); setNewPwd(''); }
    } catch { setPwdMsg('Error changing password'); }
    setPwdSaving(false);
  };

  if (!user) { router.push('/auth'); return null; }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'privacy', label: 'Privacy & Security', icon: Lock },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'start -0.3'] });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="min-h-screen bg-background pt-14">
      <Navbar />

      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '64px 0 56px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <div className="absolute top-[-80px] right-[10%] w-[500px] h-[500px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center gap-2 text-accent mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4aa, #00b896)' }}>
              <Settings className="w-4 h-4 text-black" />
            </div>
            <span className="text-sm font-semibold tracking-widest uppercase">Account</span>
          </div>
          <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
            <h1 className="text-4xl font-bold text-foreground mb-2">Settings</h1>
          </motion.div>
          <p className="text-foreground/60">Manage your account and preferences</p>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-foreground/5 p-1 rounded-lg w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-accent text-accent-foreground shadow-lg shadow-accent/40'
                    : 'text-foreground/60 hover:text-foreground'
                }`}
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">

          {/* ── Profile ── */}
          {activeTab === 'profile' && (
            <>
              <div className="p-6 rounded-xl border border-accent/20 bg-card">
                <h2 className="text-xl font-bold text-foreground mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">First Name</label>
                    <input type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-foreground/5 border border-accent/20 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">Last Name</label>
                    <input type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-foreground/5 border border-accent/20 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">Email</label>
                    <input type="email" value={user.email || ''} disabled
                      className="w-full px-4 py-2.5 rounded-lg bg-foreground/[0.02] border border-foreground/10 text-foreground/40 cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">Sex</label>
                    <select value={sex} onChange={e => setSex(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-foreground/5 border border-accent/20 text-foreground focus:outline-none focus:border-accent/50">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">Age</label>
                    <input type="number" value={age} onChange={e => setAge(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-foreground/5 border border-accent/20 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">Height (cm)</label>
                    <input type="number" value={height} onChange={e => setHeight(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-foreground/5 border border-accent/20 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/50" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">Weight (kg)</label>
                    <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-foreground/5 border border-accent/20 text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/50" />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-xl border border-accent/20 bg-card">
                <h2 className="text-xl font-bold text-foreground mb-4">Membership</h2>
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <div>
                    <p className="font-semibold text-foreground text-lg capitalize">{user.membership} Plan</p>
                    <p className="text-sm text-foreground/60">Your current membership tier</p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-semibold">Active</span>
                </div>
              </div>

              {/* Save button */}
              <div className="flex items-center gap-3">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={saveProfile} disabled={saving}
                  className="px-6 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:shadow-lg hover:shadow-accent/40 transition-all disabled:opacity-50 flex items-center gap-2">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save Changes'}
                </motion.button>
                {saved && (
                  <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-emerald-400 text-sm flex items-center gap-1">
                    <Check className="w-4 h-4" /> Saved
                  </motion.span>
                )}
                {error && <span className="text-red-400 text-sm">{error}</span>}
              </div>
            </>
          )}

          {/* ── Privacy & Security ── */}
          {activeTab === 'privacy' && (
            <>
              <div className="p-6 rounded-xl border border-accent/20 bg-card">
                <h2 className="text-xl font-bold text-foreground mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  {[
                    { label: 'Make profile visible to other members', val: profileVisible, set: setProfileVisible },
                    { label: 'Show workout achievements publicly', val: showAchievements, set: setShowAchievements },
                    { label: 'Allow community messaging', val: allowMessaging, set: setAllowMessaging },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                      <label className="text-foreground cursor-pointer text-sm">{item.label}</label>
                      <button
                        onClick={() => { item.set(!item.val); setTimeout(savePrefs, 0); }}
                        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${item.val ? 'bg-accent' : 'bg-foreground/20'}`}
                      >
                        <div className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-md transition-transform duration-200 ${item.val ? 'translate-x-5' : 'translate-x-0'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-xl border border-accent/20 bg-card">
                <h2 className="text-xl font-bold text-foreground mb-4">Change Password</h2>
                <div className="space-y-4 max-w-sm">
                  <div className="relative">
                    <label className="text-sm font-medium text-foreground/60 block mb-2">Current Password</label>
                    <input type={showPwd ? 'text' : 'password'} value={curPwd} onChange={e => setCurPwd(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-foreground/5 border border-accent/20 text-foreground focus:outline-none focus:border-accent/50 pr-10" />
                    <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-[38px] text-foreground/40 hover:text-foreground">
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60 block mb-2">New Password</label>
                    <input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg bg-foreground/5 border border-accent/20 text-foreground focus:outline-none focus:border-accent/50" placeholder="Min 6 characters" />
                  </div>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={changePassword} disabled={pwdSaving || !newPwd}
                    className="px-5 py-2.5 rounded-lg bg-accent text-accent-foreground font-medium hover:shadow-lg hover:shadow-accent/40 transition-all disabled:opacity-50 flex items-center gap-2">
                    {pwdSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Key className="w-4 h-4" />}
                    {pwdSaving ? 'Updating...' : 'Update Password'}
                  </motion.button>
                  {pwdMsg && (
                    <p className={`text-sm ${pwdMsg.includes('updated') ? 'text-emerald-400' : 'text-red-400'}`}>{pwdMsg}</p>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ── Notifications ── */}
          {activeTab === 'notifications' && (
            <div className="p-6 rounded-xl border border-accent/20 bg-card">
              <h2 className="text-xl font-bold text-foreground mb-4">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: 'Workout reminders', val: reminders, set: setReminders },
                  { label: 'Weekly progress reports', val: progressReports, set: setProgressReports },
                  { label: 'Marketing emails', val: marketing, set: setMarketing },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg hover:bg-foreground/5 transition-colors">
                    <label className="text-foreground cursor-pointer text-sm">{item.label}</label>
                    <button
                      onClick={() => { item.set(!item.val); setTimeout(savePrefs, 0); }}
                      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${item.val ? 'bg-accent' : 'bg-foreground/20'}`}
                    >
                      <div className={`absolute top-[2px] left-[2px] w-[20px] h-[20px] rounded-full bg-white shadow-md transition-transform duration-200 ${item.val ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-xs text-foreground/40 mt-6">Preferences saved locally on this device.</p>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
