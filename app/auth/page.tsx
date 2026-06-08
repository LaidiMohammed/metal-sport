'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  ChevronRight,
  ChevronLeft,
  Ruler,
  Weight,
  Calendar,
  Dumbbell,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

// ─── Mascot poses cycling on the left panel ──────────────────────────────────
const MASCOT_QUOTES = [
  { text: 'NO PAIN, NO GAIN — EMBRACE THE GRIND.',          img: '/images/mascot.png' },
  { text: 'IRON NEVER LIES. SHOW UP AND PROVE IT.',          img: '/images/mascot (2).png' },
  { text: 'YOUR LIMITS ARE AN ILLUSION. BREAK THEM.',        img: '/images/mascot (3).png' },
  { text: 'EVERY REP COUNTS. MAKE IT YOUR BEST.',            img: '/images/mascot (4).png' },
  { text: 'BECOME THE HARDEST WORKER IN THE ROOM.',          img: '/images/mascot (5).png' },
];

// Simple math captcha generator
function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `${a} + ${b} = ?`, answer: String(a + b) };
}

// ─── Google SVG icon (official colours) ──────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M47.532 24.552c0-1.636-.132-3.2-.384-4.704H24.48v8.928h12.992c-.56 3.008-2.256 5.552-4.8 7.264v6.032h7.776c4.544-4.192 7.168-10.368 7.168-17.52z" fill="#4285F4"/>
      <path d="M24.48 48c6.528 0 12-2.16 16-5.904l-7.776-6.032c-2.16 1.44-4.928 2.288-8.224 2.288-6.32 0-11.68-4.272-13.6-10.016H2.848v6.224C6.832 42.864 15.12 48 24.48 48z" fill="#34A853"/>
      <path d="M10.88 28.336A14.4 14.4 0 0 1 10 24c0-1.504.256-2.96.688-4.336v-6.224H2.848A23.984 23.984 0 0 0 .48 24c0 3.872.928 7.536 2.576 10.784l8.32-6.448z" fill="#FBBC05"/>
      <path d="M24.48 9.648c3.552 0 6.736 1.216 9.248 3.616l6.912-6.912C36.464 2.4 30.992 0 24.48 0 15.12 0 6.832 5.136 2.848 13.44l8.032 6.224c1.92-5.744 7.28-10.016 13.6-10.016z" fill="#EA4335"/>
    </svg>
  );
}

async function fetchProfile(userId: string) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
  if (!data) return null;
  return {
    id: data.id,
    name: data.name,
    lastName: data.last_name || '',
    email: data.email,
    membership: data.membership,
    role: data.role,
    isActive: data.is_active,
    isSpam: data.is_spam,
    height: data.height,
    weight: data.weight,
    age: data.age,
    sex: data.sex,
    joinDate: data.join_date,
    revenue: data.revenue,
    sessionsLeft: data.sessions_left,
    expirationDate: data.expiration_date,
    avatar: data.avatar,
  };
}

export default function AuthPage() {
  const router  = useRouter();
  const setUser = useStore((s) => s.setUser);

  // ── Mode ──────────────────────────────────────────────────────────────────
  const [isLogin, setIsLogin] = useState(true);
  const [step,    setStep]    = useState(1); // 1 or 2 for sign-up

  // ── Step 1 fields ─────────────────────────────────────────────────────────
  const [firstName,   setFirstName]   = useState('');
  const [lastName,    setLastName]    = useState('');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [captcha,     setCaptcha]     = useState(generateCaptcha);
  const [captchaVal,  setCaptchaVal]  = useState('');

  // ── Step 2 fields ─────────────────────────────────────────────────────────
  const [age,         setAge]         = useState('');
  const [height,      setHeight]      = useState('');
  const [weight,      setWeight]      = useState('');
  const [gymLevel,    setGymLevel]    = useState('');

  // ── Email verification ────────────────────────────────────────────────────
  const [verifyStep,  setVerifyStep]  = useState(false);
  const [verifyCode,  setVerifyCode]  = useState('');
  const [userCode,    setUserCode]    = useState(['','','','','','']);
  const [verifyEmail, setVerifyEmail] = useState('');
  const [verifyName,  setVerifyName]  = useState('');
  const [sendingCode, setSendingCode] = useState(false);
  const [showDebugCode, setShowDebugCode] = useState(false);

  // ── Shared ────────────────────────────────────────────────────────────────
  const [loginEmail,  setLoginEmail]  = useState('');
  const [loginPass,   setLoginPass]   = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState('');

  // ── Mascot quote cycling ──────────────────────────────────────────────────
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setQuoteIdx((i) => (i + 1) % MASCOT_QUOTES.length), 4000);
    return () => clearInterval(t);
  }, []);

  // ── Supabase Auth session listener ───────────────────────────────────────
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) setUser(profile);
      } else {
        setUser(null);
      }
    });
    // Check existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) setUser(profile);
      }
    });
    return () => subscription.unsubscribe();
  }, [setUser]);

  // ── Auth logic ────────────────────────────────────────────────────────────
  const performLogin = async (loginEmailAddr: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email: loginEmailAddr, password });
      if (error) throw error;
      if (data.user) {
        const profile = await fetchProfile(data.user.id);
        if (profile) setUser(profile);
      }
      const isAdmin = loginEmailAddr === 'hamada.laidi.14@gmail.com';
      setTimeout(() => router.push(isAdmin ? '/admin' : '/?justLoggedIn=true'), 300);
    } catch (e: any) {
      setError(e.message || 'Invalid email or password');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!loginEmail || !loginPass) { setError('Please fill in all fields'); return; }
    await performLogin(loginEmail, loginPass);
  };

  const handleVerifyCode = async () => {
    if (userCode.join('') === verifyCode) {
      setVerifyStep(false);
      setLoading(true);
      // Sign in the user that just signed up
      await performLogin(verifyEmail, password);
    } else {
      setError('Incorrect code. Please try again.');
    }
  };

  const resendCode = async () => {
    setSendingCode(true);
    setError('');
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setVerifyCode(code);
    console.log(`[DEV] Resent verification code for ${verifyEmail}: ${code}`);
    try {
      const res = await fetch('/api/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: verifyEmail, code }),
      });
      if (!res.ok) { const body = await res.json().catch(()=>({})); throw new Error(body?.error || 'Server error'); }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Server error');
      setSendingCode(false);
      setUserCode(['','','','','','']);
      return;
    }
    setSendingCode(false);
    setUserCode(['','','','','','']);
  };

  const handleStep1 = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (captchaVal !== captcha.answer) { setError('Incorrect answer — try again'); setCaptchaVal(''); setCaptcha(generateCaptcha()); return; }
    setStep(2);
  };

  const handleStep2 = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!age || !height || !weight || !gymLevel) { setError('Please fill in all fields'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: firstName, lastName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      // Auto sign in after signup
      await performLogin(email, password);
    } catch (e: any) {
      setError(e.message || 'Signup failed');
    }
    setLoading(false);
  };

  const quickAdminLogin = async () => {
    await performLogin('hamada.laidi.14@gmail.com', 'ldldld');
  };

  const gymLevels = [
    { value: 'never',    label: 'Never trained',      emoji: '🧘' },
    { value: 'beginner', label: 'Less than a month',   emoji: '🌱' },
    { value: 'novice',   label: '1 – 6 months',        emoji: '💪' },
    { value: 'inter',    label: '6 months – 2 years',  emoji: '🏋️' },
    { value: 'advanced', label: '2+ years',             emoji: '🔥' },
  ];

  // ── Shared input wrapper ──────────────────────────────────────────────────
  const inputCls = 'w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all text-sm';
  const labelCls = 'block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5';

  return (
    <div className="flex min-h-screen w-full bg-white text-slate-800 font-sans">

      {/* ── LEFT PANEL ─────────────────────────────────────────────────────── */}
      <div className="hidden md:flex md:w-[45%] lg:w-[48%] bg-gradient-to-br from-[#060913] to-[#0d1a2d] flex-col relative overflow-hidden text-white">

        {/* Background glows */}
        <div className="absolute top-0 left-0 w-[70%] h-[50%] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[60%] h-[50%] rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />

        {/* Logo */}
        <div className="flex items-center gap-3 px-10 pt-10 relative z-10">
          <div className="w-10 h-10 rounded-full border border-emerald-500/40 overflow-hidden flex-shrink-0">
            <Image src="/images/logo.jpg" alt="Metal Sport Gym" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-black text-sm tracking-tight leading-none">METAL SPORT GYM</div>
            <div className="text-[9px] font-bold text-emerald-400 tracking-widest uppercase mt-0.5">Premium Fitness</div>
          </div>
        </div>

        {/* Mascot */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={quoteIdx}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <div className="relative w-60 h-60" style={{ filter: 'drop-shadow(0 0 30px rgba(5,150,105,0.3)) drop-shadow(0 20px 40px rgba(0,0,0,0.4))' }}>
                <Image
                  src={MASCOT_QUOTES[quoteIdx].img}
                  alt="Kimo Mascot"
                  fill
                  sizes="240px"
                  className="object-contain scale-110"
                  priority
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Cycling quote */}
          <motion.p
            key={`q-${quoteIdx}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 text-center text-white text-lg font-bold uppercase tracking-widest leading-tight max-w-xs px-2"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            &ldquo;{MASCOT_QUOTES[quoteIdx].text}&rdquo;
          </motion.p>

          {/* Quote dots */}
          <div className="flex gap-1.5 mt-4">
            {MASCOT_QUOTES.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-500 ${i === quoteIdx ? 'w-5 bg-emerald-400' : 'w-1.5 bg-slate-600'}`}
              />
            ))}
          </div>
        </div>

        {/* Bottom footer */}
        <div className="px-10 pb-8 text-[10px] text-slate-600 relative z-10">
          © 2025 Metal Sport Gym · All rights reserved
        </div>
      </div>

      {/* ── RIGHT PANEL ────────────────────────────────────────────────────── */}
      <div className="w-full md:w-[55%] lg:w-[52%] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[400px]"
        >

          {/* ══ LOGIN ══════════════════════════════════════════════════════ */}
              {isLogin && !verifyStep && (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Welcome back 👋</h1>
                <p className="text-sm text-slate-400 mt-1.5">Sign in to your gym workspace</p>
              </div>

              {/* Google */}
              <button
                type="button"
                onClick={async () => {
                  await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin + '/auth/callback' } });
                }}
                disabled={loading}
                className="flex items-center justify-center gap-3 w-full py-2.5 px-4 bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 disabled:opacity-50"
              >
                <GoogleIcon />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">or</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>

              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                {/* Email */}
                <div>
                  <label htmlFor="login-email" className={labelCls}>Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input id="login-email" type="email" placeholder="you@example.com" value={loginEmail}
                      onChange={(e) => { setLoginEmail(e.target.value); setError(''); }}
                      required className={inputCls} />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label htmlFor="login-password" className={labelCls}>Password</label>
                    <a href="#" className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700">Forgot?</a>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    <input id="login-password" type={showLoginPass ? 'text' : 'password'}
                      placeholder="••••••••" value={loginPass}
                      onChange={(e) => { setLoginPass(e.target.value); setError(''); }}
                      required className={`${inputCls} pr-11`} />
                    <button type="button" onClick={() => setShowLoginPass(!showLoginPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button type="submit" disabled={loading || sendingCode}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 shadow-lg shadow-emerald-600/20 mt-1 flex items-center justify-center gap-2">
                  {sendingCode || loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner size="sm" className="border-white/40 border-t-white" />
                      {sendingCode ? 'Sending code…' : 'Signing in…'}
                    </span>
                  ) : 'Sign In'}
                </button>
              </form>

              {/* Admin shortcut */}
              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-slate-100" />
                <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">admin</span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
              <button type="button" onClick={quickAdminLogin} disabled={loading}
                className="w-full py-2 px-4 border border-red-200 hover:bg-red-50 text-red-500 rounded-xl text-xs font-semibold transition-all active:scale-[0.98]">
                Admin Quick Access
              </button>

              <p className="text-center text-sm text-slate-500 mt-6">
                Don&apos;t have an account?{' '}
                <button type="button" onClick={() => { setIsLogin(false); setStep(1); setError(''); }}
                  className="font-bold text-emerald-600 hover:text-emerald-700">
                  Sign up
                </button>
              </p>
            </>
          )}

          {/* ══ EMAIL VERIFICATION ════════════════════════════════════════ */}
          {verifyStep && (
            <>
              <div className="mb-7">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Check your email ✉️</h1>
                <p className="text-sm text-slate-400 mt-1.5">
                  We sent a 6-digit code to <strong className="text-slate-700">{verifyEmail}</strong>
                </p>
              </div>

              {/* Sent email notice */}
              <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 mb-4">
                <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">M31</div>
                      <div>
                        <div className="text-sm font-bold text-slate-800">metal.sport.31</div>
                        <div className="text-xs text-slate-400">metal.sport@resend.dev</div>
                      </div>
                </div>
                <div className="text-xs text-slate-400 border-b border-slate-200 py-2 mt-2 mb-2">
                  To: <span className="text-slate-600">{verifyEmail}</span>
                </div>
                <p className="text-sm text-slate-600">
                  ✉️ A 6-digit verification code has been sent to <strong className="text-slate-800">{verifyEmail}</strong>. Check your inbox (and spam folder).
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                {/* 6 code inputs */}
                <div className="flex gap-2">
                  {userCode.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      inputMode="numeric"
                      pattern="[0-9]"
                      value={digit}
                      autoFocus={i === 0}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '');
                        const next = [...userCode];
                        next[i] = val;
                        setUserCode(next);
                        if (val && i < 5) {
                          const nextInput = document.getElementById(`code-${i + 1}`);
                          nextInput?.focus();
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !userCode[i] && i > 0) {
                          const prev = document.getElementById(`code-${i - 1}`);
                          prev?.focus();
                        }
                        if (e.key === 'Enter' && userCode.every(d => d)) {
                          handleVerifyCode();
                        }
                      }}
                      id={`code-${i}`}
                      className="w-12 h-14 text-center text-xl font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                    />
                  ))}
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2 w-full text-center">
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  onClick={handleVerifyCode}
                  disabled={!userCode.every(d => d) || loading}
                  className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Spinner size="sm" className="border-white/40 border-t-white" />
                      Verifying…
                    </span>
                  ) : isLogin ? 'Verify & Sign In' : 'Verify & Create Account'}
                </button>

                <p className="text-sm text-slate-500">
                  Didn&apos;t receive the code?{' '}
                  <button type="button" onClick={resendCode} disabled={sendingCode}
                    className="font-bold text-emerald-600 hover:text-emerald-700">
                    {sendingCode ? 'Sending…' : 'Resend'}
                  </button>
                </p>

                <button type="button" onClick={() => setShowDebugCode(!showDebugCode)}
                  className="text-[11px] text-slate-300 hover:text-slate-500 underline">
                  {showDebugCode ? 'Hide code' : 'Show code'}
                </button>

                {showDebugCode && (
                  <div className="text-center text-xs font-mono bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-700">
                    Debug code: <strong>{verifyCode}</strong>
                  </div>
                )}

                <button type="button" onClick={() => { setVerifyStep(false); setError(''); setVerifyCode(''); setVerifyName(''); }}
                  className="text-xs text-slate-400 hover:text-slate-600 underline">
                  {isLogin ? 'Back to sign in' : 'Back to sign up'}
                </button>
              </div>
            </>
          )}

          {/* ══ SIGN UP ════════════════════════════════════════════════════ */}
          {!isLogin && (
            <>
              {/* Progress bar */}
              <div className="mb-7">
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        step >= n ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 scale-100' : 'bg-slate-100 text-slate-400 scale-90'
                      }`}>
                        {step > n ? '✓' : n}
                      </div>
                      {n < 3 && (
                        <div className={`w-14 h-[2px] rounded-full transition-all duration-300 ${step > n ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {step === 1 ? 'Create Account' : step === 2 ? 'Your Fitness Profile' : 'Verify Your Email'}
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                  {step === 1 ? 'Fill in your details to get started' : step === 2 ? 'Help us personalize your experience' : 'Enter the 6-digit code sent to your email'}
                </p>
              </div>

              {/* ── STEP 1 ─────────────────────────────────────────────── */}
              {step === 1 && (
                <form onSubmit={handleStep1} className="flex flex-col gap-4">
                  {/* First + Last name row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="reg-first" className={labelCls}>First Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input id="reg-first" type="text" placeholder="John" value={firstName}
                          onChange={(e) => { setFirstName(e.target.value); setError(''); }}
                          required className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reg-last" className={labelCls}>Last Name</label>
                      <div className="relative">
                        <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input id="reg-last" type="text" placeholder="Doe" value={lastName}
                          onChange={(e) => { setLastName(e.target.value); setError(''); }}
                          required className={inputCls} />
                      </div>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="reg-email" className={labelCls}>Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input id="reg-email" type="email" placeholder="you@example.com" value={email}
                        onChange={(e) => { setEmail(e.target.value); setError(''); }}
                        required className={inputCls} />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="reg-password" className={labelCls}>Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input id="reg-password" type={showPass ? 'text' : 'password'}
                        placeholder="Min. 6 characters" value={password}
                        onChange={(e) => { setPassword(e.target.value); setError(''); }}
                        required className={`${inputCls} pr-11`} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                        {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Captcha */}
                  <div>
                    <label htmlFor="reg-captcha" className={labelCls}>
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verification — {captcha.question}
                      </span>
                    </label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <input id="reg-captcha" type="text" placeholder="Your answer" value={captchaVal}
                        onChange={(e) => { setCaptchaVal(e.target.value); setError(''); }}
                        required className={inputCls} />
                      <button type="button" onClick={() => { setCaptcha(generateCaptcha()); setCaptchaVal(''); }}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-500 transition-colors"
                        title="New question">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button type="submit"
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all duration-200 shadow-lg shadow-emerald-600/20 mt-1 flex items-center justify-center gap-2">
                    Continue <ChevronRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-sm text-slate-500">
                    Already have an account?{' '}
                    <button type="button" onClick={() => { setIsLogin(true); setError(''); }}
                      className="font-bold text-emerald-600 hover:text-emerald-700">
                      Sign in
                    </button>
                  </p>
                </form>
              )}

              {/* ── STEP 2 ─────────────────────────────────────────────── */}
              {step === 2 && (
                <form onSubmit={handleStep2} className="flex flex-col gap-4">
                  {/* Age / Height / Weight */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label htmlFor="reg-age" className={labelCls}>Age</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input id="reg-age" type="number" min="10" max="100" placeholder="25" value={age}
                          onChange={(e) => { setAge(e.target.value); setError(''); }}
                          required className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reg-height" className={labelCls}>Height (cm)</label>
                      <div className="relative">
                        <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input id="reg-height" type="number" min="100" max="250" placeholder="175" value={height}
                          onChange={(e) => { setHeight(e.target.value); setError(''); }}
                          required className={inputCls} />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="reg-weight" className={labelCls}>Weight (kg)</label>
                      <div className="relative">
                        <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        <input id="reg-weight" type="number" min="30" max="300" placeholder="70" value={weight}
                          onChange={(e) => { setWeight(e.target.value); setError(''); }}
                          required className={inputCls} />
                      </div>
                    </div>
                  </div>

                  {/* Gym experience */}
                  <div>
                    <label className={`${labelCls} flex items-center gap-1.5 mb-3`}>
                      <Dumbbell className="w-3.5 h-3.5" />
                      How long have you been training?
                    </label>
                    <div className="flex flex-col gap-2">
                      {gymLevels.map((lvl) => (
                        <button
                          key={lvl.value}
                          type="button"
                          onClick={() => setGymLevel(lvl.value)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all text-left ${
                            gymLevel === lvl.value
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm shadow-emerald-500/10'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white'
                          }`}
                        >
                          <span className="text-lg">{lvl.emoji}</span>
                          <span>{lvl.label}</span>
                          {gymLevel === lvl.value && (
                            <span className="ml-auto w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                              </svg>
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <div className="flex gap-3 mt-1">
                    <button type="button" onClick={() => { setStep(1); setError(''); }}
                      className="flex items-center gap-1.5 px-5 py-3 border border-slate-200 hover:bg-slate-50 rounded-xl text-sm font-semibold text-slate-600 transition-all duration-200">
                      <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                    <button type="submit" disabled={loading}
                      className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <Spinner size="sm" className="border-white/40 border-t-white" />
                          Creating…
                        </span>
                      ) : 'Create Account'}
                    </button>
                  </div>
                </form>
              )}

              {/* ── STEP 3: Email Verification ──────────────────────────── */}
              {step === 3 && (
                <div className="flex flex-col gap-4">
                  {/* Email notice card */}
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">M31</div>
                      <div>
                        <div className="text-sm font-bold text-emerald-800">metal.sport.31</div>
                        <div className="text-xs text-emerald-500">metal.sport@resend.dev</div>
                      </div>
                    </div>
                    <div className="text-xs text-emerald-500 border-b border-emerald-200 py-2 mb-2">
                      To: <span className="text-emerald-700 font-medium">{verifyEmail}</span>
                    </div>
                    <p className="text-sm text-emerald-700">
                      <span className="text-base">✉️</span> A 6-digit code has been sent to <strong>{verifyEmail}</strong>. Check your inbox (and spam folder).
                    </p>
                  </div>

                  {/* 6 code inputs */}
                  <div className="flex justify-center gap-2">
                    {userCode.map((digit, i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        inputMode="numeric"
                        pattern="[0-9]"
                        value={digit}
                        autoFocus={i === 0}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '');
                          const next = [...userCode];
                          next[i] = val;
                          setUserCode(next);
                          if (val && i < 5) {
                            const nextInput = document.getElementById(`reg-code-${i + 1}`);
                            nextInput?.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !userCode[i] && i > 0) {
                            const prev = document.getElementById(`reg-code-${i - 1}`);
                            prev?.focus();
                          }
                          if (e.key === 'Enter' && userCode.every(d => d)) {
                            handleVerifyCode();
                          }
                        }}
                        id={`reg-code-${i}`}
                        className="w-11 h-13 text-center text-lg font-bold text-slate-900 bg-white border border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                        style={{ width: 44, height: 52, fontSize: 20 }}
                      />
                    ))}
                  </div>

                  <AnimatePresence>
                    {error && (
                      <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        className="text-red-500 text-xs font-medium bg-red-50 border border-red-100 rounded-lg px-3 py-2 w-full text-center">
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={handleVerifyCode}
                    disabled={!userCode.every(d => d) || loading}
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-60 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Spinner size="sm" className="border-white/40 border-t-white" />
                        Verifying…
                      </span>
                    ) : 'Verify & Create Account'}
                  </button>

                  <p className="text-sm text-slate-500 text-center">
                    Didn&apos;t receive the code?{' '}
                    <button type="button" onClick={resendCode} disabled={sendingCode}
                      className="font-bold text-emerald-600 hover:text-emerald-700">
                      {sendingCode ? 'Sending…' : 'Resend'}
                    </button>
                  </p>

                  <button type="button" onClick={() => setShowDebugCode(!showDebugCode)}
                    className="text-[11px] text-slate-300 hover:text-slate-500 underline text-center w-full">
                    {showDebugCode ? 'Hide code' : 'Show code'}
                  </button>

                  {showDebugCode && (
                    <div className="text-center text-xs font-mono bg-slate-100 border border-slate-200 rounded-lg px-4 py-2 text-slate-700">
                      Debug code: <strong>{verifyCode}</strong>
                    </div>
                  )}

                  <button type="button" onClick={() => { setStep(2); setError(''); setUserCode(['','','','','','']); }}
                    className="flex items-center justify-center gap-1 text-xs text-slate-400 hover:text-slate-600 underline">
                    <ChevronLeft className="w-3 h-3" /> Back to profile
                  </button>
                </div>
              )}
            </>
          )}

        </motion.div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@300;400;700;900&display=swap');
      `}</style>
    </div>
  );
}
