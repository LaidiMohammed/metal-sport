'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const setUser = useStore((state) => state.setUser);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[v0] Form submitted with email:', email);
    
    setError('');

    // Simple validation
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    if (!isLogin && !name.trim()) {
      setError('Please enter your full name');
      return;
    }

    setLoading(true);

    // Simulate auth delay
    setTimeout(() => {
      console.log('[v0] Logging in user:', email);
      
      const userData = isLogin
        ? {
            id: '1',
            name: email.split('@')[0],
            email,
            membership: 'premium' as const,
          }
        : {
            id: Date.now().toString(),
            name,
            email,
            membership: 'free' as const,
          };

      setUser(userData);
      setLoading(false);
      console.log('[v0] User set, redirecting to home');
      router.push('/');
    }, 500);
  };

  const handleSocialAuth = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        id: Date.now().toString(),
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        membership: 'free',
      });
      setLoading(false);
      router.push('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
        transition={{ duration: 8, repeat: Infinity }}
      />

      <motion.div
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center shadow-lg shadow-accent/40">
              <span className="text-xl font-bold text-accent-foreground">💪</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Kimo&apos;s Gym</h2>
              <p className="text-xs text-accent uppercase tracking-wider font-semibold">Premium Fitness</p>
            </div>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          className="border border-accent/20 rounded-2xl p-8 bg-card/80 backdrop-blur space-y-6 shadow-xl shadow-black/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Title */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </h1>
            <p className="text-sm text-foreground/60">
              {isLogin
                ? 'Sign in to access your fitness journey'
                : 'Create account to join our community'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Signup only) */}
            {!isLogin && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <label className="text-sm font-medium text-foreground block mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-accent/60" />
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError('');
                    }}
                    className="pl-10 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/40 focus:border-accent/50 focus:ring-accent/20 transition-all"
                  />
                </div>
              </motion.div>
            )}

            {/* Email Field */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <label className="text-sm font-medium text-foreground block mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-accent/60" />
                <Input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  className="pl-10 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/40 focus:border-accent/50 focus:ring-accent/20 transition-all"
                />
              </div>
            </motion.div>

            {/* Password Field */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <label className="text-sm font-medium text-foreground block mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-accent/60" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="pl-10 pr-10 bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/40 focus:border-accent/50 focus:ring-accent/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-accent/60 hover:text-accent transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
              >
                {error}
              </motion.div>
            )}

            {/* Remember & Forgot (Login only) */}
            {isLogin && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-accent/30 bg-foreground/5" />
                  <span className="text-foreground/70">Remember me</span>
                </label>
                <a href="#" className="text-accent hover:underline font-medium">
                  Forgot password?
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={(e) => {
                console.log('[v0] Button onClick fired');
                handleSubmit(e);
              }}
              className="w-full h-11 px-4 rounded-lg bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-medium hover:shadow-lg hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </div>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-foreground/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-foreground/60">Continue with</span>
            </div>
          </div>

          {/* Social Auth */}
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialAuth('Google')}
              disabled={loading}
              type="button"
              className="h-12 rounded-lg border border-accent/20 bg-foreground/5 hover:bg-foreground/10 transition-colors flex items-center justify-center group disabled:opacity-50"
            >
              <span className="text-lg">🔵</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialAuth('GitHub')}
              disabled={loading}
              type="button"
              className="h-12 rounded-lg border border-accent/20 bg-foreground/5 hover:bg-foreground/10 transition-colors flex items-center justify-center group disabled:opacity-50"
            >
              <span className="text-lg">⚫</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSocialAuth('Apple')}
              disabled={loading}
              type="button"
              className="h-12 rounded-lg border border-accent/20 bg-foreground/5 hover:bg-foreground/10 transition-colors flex items-center justify-center group disabled:opacity-50"
            >
              <span className="text-lg">⚪</span>
            </motion.button>
          </div>

          {/* Toggle Auth Mode */}
          <div className="text-center text-sm">
            <span className="text-foreground/60">
              {isLogin ? 'Don&apos;t have an account? ' : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setEmail('');
                setPassword('');
                setName('');
                setError('');
              }}
              className="text-accent font-medium hover:underline"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p
          className="text-center text-xs text-foreground/60 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          By continuing, you agree to our{' '}
          <a href="#" className="text-accent hover:underline font-medium">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-accent hover:underline font-medium">
            Privacy Policy
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
