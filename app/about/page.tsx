'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Dumbbell, Timer, HeartHandshake, TrendingUp, ArrowRight, Sparkles, Shield, Users, Zap } from 'lucide-react';

const VALUES = [
  { icon: Dumbbell, title: 'Strength', desc: 'Build physical and mental resilience through proven training methods.', color: '#E63946' },
  { icon: Timer, title: 'Discipline', desc: 'Consistency over intensity. Show up every day and own the process.', color: '#E63946' },
  { icon: HeartHandshake, title: 'Community', desc: 'Train together, grow together. A brotherhood that pushes beyond limits.', color: '#E63946' },
  { icon: TrendingUp, title: 'Progress', desc: 'Track every rep, every pound, every milestone. Results speak loudest.', color: '#E63946' },
];

const SHOWCASE = [
  { title: 'Premium Equipment', desc: 'State-of-the-art machines, free weights, and functional training zones.', icon: Dumbbell },
  { title: 'Expert Trainers', desc: 'Certified coaches who design programs tailored to your goals.', icon: Users },
  { title: 'Group Energy', desc: 'HIIT, boxing, yoga — train with a community that fuels your fire.', icon: Zap },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: missionProgress } = useScroll({ target: missionRef, offset: ['start end', 'end end'] });
  const { scrollYProgress: valuesProgress } = useScroll({ target: valuesRef, offset: ['start end', 'end end'] });
  const { scrollYProgress: showcaseProgress } = useScroll({ target: showcaseRef, offset: ['start end', 'end end'] });

  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.85]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const [logoRevealed, setLogoRevealed] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLogoRevealed(true), 500); return () => clearTimeout(t); }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-14">
      <Navbar />

      {/* ─── OPENING SCENE ─── */}
      <section ref={heroRef} className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 30%, #2C2C2C 60%, #0a0a0a 100%)',
            backgroundSize: '400% 400%',
          }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #E63946 0%, transparent 50%), radial-gradient(circle at 75% 75%, #E63946 0%, transparent 50%)',
        }} />

        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative z-10 text-center px-6">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#E63946] to-[#b81f2f] flex items-center justify-center shadow-2xl shadow-[#E63946]/20 relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <span className="text-3xl font-black tracking-tight text-white">MS</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-4"
          >
            <span className="text-white">METAL</span>{' '}
            <span className="text-[#E63946]">SPORT</span>
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-white/40 font-light tracking-wide max-w-xl mx-auto"
          >
            Built for those who push beyond limits.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-10"
          >
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-white/20 mx-auto flex items-start justify-center pt-2"
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full bg-[#E63946]"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── MISSION STATEMENT ─── */}
      <section ref={missionRef} className="relative py-32 px-6 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.3), transparent)', scaleX: missionProgress, transformOrigin: 'left' }}
        />
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="text-[#E63946] text-sm font-semibold tracking-[0.2em] uppercase mb-4 block"
              initial={{ x: -40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              Our Mission
            </motion.span>

            <motion.h2
              className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-8"
              initial={{ x: -80, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
            >
              We are more than{' '}
              <motion.span
                className="text-[#E63946] inline-block"
                initial={{ backgroundPosition: '200% 0%' }}
                whileInView={{ backgroundPosition: '0% 0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5 }}
                style={{
                  background: 'linear-gradient(90deg, #E63946, #ff6b6b, #E63946)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                a gym
              </motion.span>
              <br />we are a{' '}
              <motion.span
                className="text-transparent bg-clip-text"
                style={{
                  background: 'linear-gradient(135deg, #E63946, #ff6b6b)',
                }}
              >
                community.
              </motion.span>
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-white/40 leading-relaxed max-w-2xl"
              initial={{ x: -60, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              At Metal Sport Gym, we don&apos;t just build bodies — we forge character. Every drop of sweat, every
              rep, every early morning is a step toward becoming unstoppable.
            </motion.p>
          </motion.div>
        </div>

        {/* Animated silhouettes */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-96 opacity-[0.03] hidden lg:block">
          {[40, 60, 80].map((h, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 w-16 bg-white rounded-t-full"
              style={{ left: `${20 + i * 25}%`, height: h }}
              initial={{ height: 0 }}
              whileInView={{ height: h }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5 + i * 0.15 }}
            />
          ))}
        </div>
      </section>

      {/* ─── CORE VALUES ─── */}
      <section ref={valuesRef} className="relative py-32 px-6">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#E63946]/[0.02] to-transparent" />

        <motion.div
          className="max-w-6xl mx-auto"
          style={{ opacity: valuesProgress, y: useTransform(valuesProgress, [0, 1], [60, 0]) }}
        >
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#E63946] text-sm font-semibold tracking-[0.2em] uppercase">The Foundation</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">Core Values</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                  className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500"
                >
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(600px circle at 50% 0%, rgba(230,57,70,0.06), transparent)`,
                    }}
                  />
                  <div className="relative z-10">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-[#E63946]/10 flex items-center justify-center mb-6"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(230,57,70,0.2)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon className="w-7 h-7 text-[#E63946]" />
                    </motion.div>
                    <motion.h3
                      className="text-2xl font-black mb-3"
                      initial={{ x: -20, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.2 }}
                    >
                      {v.title}
                    </motion.h3>
                    <p className="text-white/40 text-sm leading-relaxed">{v.desc}</p>
                    <motion.div
                      className="mt-4 w-8 h-[2px] bg-[#E63946]"
                      initial={{ width: 0 }}
                      whileInView={{ width: 32 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: i * 0.25 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ─── GYM EXPERIENCE SHOWCASE ─── */}
      <section ref={showcaseRef} className="relative py-32 px-6 overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(230,57,70,0.3), transparent)' }}
        />
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#E63946] text-sm font-semibold tracking-[0.2em] uppercase">The Experience</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">Train Like Never Before</h2>
          </motion.div>

          <div className="space-y-8">
            {SHOWCASE.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.15 }}
                  className="flex items-center gap-8 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#E63946]/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#E63946]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-[#E63946]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    <p className="text-white/40">{item.desc}</p>
                  </div>
                  <motion.div
                    className="ml-auto flex-shrink-0"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5 text-[#E63946]" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CLOSING + CTA ─── */}
      <section ref={ctaRef} className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(230,57,70,0.08) 0%, transparent 70%)',
        }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <motion.div
              className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#E63946] to-[#b81f2f] flex items-center justify-center shadow-xl shadow-[#E63946]/20"
              animate={{ boxShadow: ['0 0 20px rgba(230,57,70,0.2)', '0 0 40px rgba(230,57,70,0.4)', '0 0 20px rgba(230,57,70,0.2)'] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="text-2xl font-black text-white">MS</span>
            </motion.div>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-black tracking-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Metal Sport Gym
          </motion.h2>
          <motion.p
            className="text-xl text-white/50 mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Your Premium Fitness Experience
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/auth">
              <motion.button
                className="px-10 py-4 bg-[#E63946] text-white text-sm font-bold uppercase tracking-[0.15em] rounded-xl shadow-2xl shadow-[#E63946]/30 flex items-center gap-3 mx-auto"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(230,57,70,0.4)' }}
                whileTap={{ scale: 0.98 }}
                animate={{ boxShadow: ['0 0 20px rgba(230,57,70,0.2)', '0 0 35px rgba(230,57,70,0.35)', '0 0 20px rgba(230,57,70,0.2)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                Join Us Today
                <Sparkles className="w-4 h-4" />
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
      `}</style>
    </div>
  );
}
