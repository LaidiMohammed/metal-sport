'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Dumbbell, Timer, HeartHandshake, TrendingUp, ArrowRight, Sparkles, Shield, Users, Zap, MapPin, ShowerHead, UtensilsCrossed } from 'lucide-react';

const VALUES = [
  { icon: Dumbbell, title: 'Strength', desc: 'Build physical and mental resilience through proven training methods.', color: '#00d4aa' },
  { icon: Timer, title: 'Discipline', desc: 'Consistency over intensity. Show up every day and own the process.', color: '#00d4aa' },
  { icon: HeartHandshake, title: 'Community', desc: 'Train together, grow together. A brotherhood that pushes beyond limits.', color: '#00d4aa' },
  { icon: TrendingUp, title: 'Progress', desc: 'Track every rep, every pound, every milestone. Results speak loudest.', color: '#00d4aa' },
];

const SHOWCASE = [
  { title: 'Premium Equipment', desc: 'State-of-the-art machines, free weights, and functional training zones.', icon: Dumbbell },
  { title: 'Expert Trainers', desc: 'Certified coaches who design programs tailored to your goals.', icon: Users },
  { title: 'Group Energy', desc: 'HIIT, boxing, yoga — train with a community that fuels your fire.', icon: Zap },
];

const GYM_LINK = 'https://maps.app.goo.gl/Ag5tjnNmhYUga9NdA';

export default function AboutPage() {
  const [mapMode, setMapMode] = useState<'gym' | 'douches' | 'restaurants'>('gym');
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: missionProgress } = useScroll({ target: missionRef, offset: ['start end', 'end end'] });
  const { scrollYProgress: valuesProgress } = useScroll({ target: valuesRef, offset: ['start end', 'end end'] });

  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.85]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-14">
      <Navbar />

      {/* ─── OPENING SCENE ─── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #050505 0%, #0a1a14 30%, #0d2018 60%, #050505 100%)',
            backgroundSize: '400% 400%',
          }}
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: 'radial-gradient(circle at 25% 25%, #00d4aa 0%, transparent 50%), radial-gradient(circle at 75% 75%, #00d4aa 0%, transparent 50%)',
        }} />

        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative z-10 text-center px-6">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <Image
              src="/images/mascot.png"
              alt="Metal Sport Mascot"
              width={120}
              height={120}
              className="mx-auto drop-shadow-2xl"
              style={{ filter: 'drop-shadow(0 0 30px rgba(0,212,170,0.3))' }}
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-4"
          >
            <span className="text-white">METAL</span>{' '}
            <span className="text-[#00d4aa]">SPORT</span>
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
                className="w-1.5 h-1.5 rounded-full bg-[#00d4aa]"
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
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.3), transparent)', scaleX: missionProgress, transformOrigin: 'left' }}
        />
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              className="text-[#00d4aa] text-sm font-semibold tracking-[0.2em] uppercase mb-4 block"
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
                className="inline-block"
                initial={{ backgroundPosition: '200% 0%' }}
                whileInView={{ backgroundPosition: '0% 0%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, delay: 0.5 }}
                style={{
                  background: 'linear-gradient(90deg, #00d4aa, #22d3ee, #00d4aa)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                a gym
              </motion.span>
              <br />we are a{' '}
              <motion.span
                className="inline-block"
                style={{
                  background: 'linear-gradient(135deg, #00d4aa, #22d3ee)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00d4aa]/[0.02] to-transparent" />

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
            <span className="text-[#00d4aa] text-sm font-semibold tracking-[0.2em] uppercase">The Foundation</span>
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
                    style={{ background: 'radial-gradient(600px circle at 50% 0%, rgba(0,212,170,0.06), transparent)' }}
                  />
                  <div className="relative z-10">
                    <motion.div
                      className="w-14 h-14 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center mb-6"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(0,212,170,0.2)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon className="w-7 h-7 text-[#00d4aa]" />
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
                      className="mt-4 w-8 h-[2px] bg-[#00d4aa]"
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
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.3), transparent)' }}
        />
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#00d4aa] text-sm font-semibold tracking-[0.2em] uppercase">The Experience</span>
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
                  className="flex items-center gap-8 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#00d4aa]/20 transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl bg-[#00d4aa]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-[#00d4aa]" />
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
                    <ArrowRight className="w-5 h-5 text-[#00d4aa]" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── LOCALISATION & AMENITIES ─── */}
      <section ref={mapRef} className="relative py-32 px-6">
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.3), transparent)' }}
        />
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#00d4aa] text-sm font-semibold tracking-[0.2em] uppercase">Localisation</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">Nous Trouver</h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto">
              Situé au cœur de la ville, facilement accessible. Découvrez les commodités à proximité de notre salle.
            </p>
          </motion.div>

          {/* Map */}
          <motion.div
            className="rounded-2xl overflow-hidden border border-white/[0.08] mb-10 h-[350px] md:h-[450px] relative"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <a href={GYM_LINK} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            <iframe
              key={mapMode}
              src={mapMode === 'gym'
                ? `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.5!2d3.0588!3d36.7538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzbCsDQ1JzEzLjciTiAzwrAwMyczMS43IkU!5e0!3m2!1sfr!2sdz!4v1`
                : mapMode === 'douches'
                ? `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3197.5!2d3.0588!3d36.7538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m7!3e0!4m0!4m4!2sdouches+publiques+proches+de+36.7538,3.0588!3m3!2m2!1s0x0%3A0x0!2sHammam+%26+Douches!5e0!3m2!1sfr!2sdz!4v1`
                : `https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3197.5!2d3.0588!3d36.7538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m7!3e0!4m0!4m4!2srestaurants+proches+de+36.7538,3.0588!3m3!2m2!1s0x0%3A0x0!2sRestaurants!5e0!3m2!1sfr!2sdz!4v1`
              }
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'invert(0.9) hue-rotate(160deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Metal Sport Gym Location"
            />
            </a>
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-black/60 backdrop-blur-md rounded-xl px-5 py-3 border border-white/[0.06] pointer-events-none">
              <MapPin className="w-5 h-5 text-[#00d4aa] flex-shrink-0" />
              <span className="text-sm text-white/80">
                {mapMode === 'gym' ? 'Metal Sport Gym — Alger Centre' : mapMode === 'douches' ? 'Douches à proximité' : 'Restaurants à proximité'}
              </span>
            </div>
          </motion.div>

          {/* Amenities Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.button
              onClick={() => setMapMode(mapMode === 'douches' ? 'gym' : 'douches')}
              className={`flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 group text-left w-full ${
                mapMode === 'douches'
                  ? 'border-[#00d4aa]/30 bg-[#00d4aa]/[0.06]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-[#00d4aa]/[0.04] hover:border-[#00d4aa]/20'
              }`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                mapMode === 'douches' ? 'bg-[#00d4aa]/20' : 'bg-[#00d4aa]/10 group-hover:bg-[#00d4aa]/20'
              }`}>
                <ShowerHead className="w-7 h-7 text-[#00d4aa]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Douches à Proximité</h3>
                <p className="text-sm text-white/40">Afficher les douches et hammams autour de notre salle</p>
              </div>
              {mapMode === 'douches' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-[#00d4aa]" />
              )}
            </motion.button>

            <motion.button
              onClick={() => setMapMode(mapMode === 'restaurants' ? 'gym' : 'restaurants')}
              className={`flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 group text-left w-full ${
                mapMode === 'restaurants'
                  ? 'border-[#00d4aa]/30 bg-[#00d4aa]/[0.06]'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-[#00d4aa]/[0.04] hover:border-[#00d4aa]/20'
              }`}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                mapMode === 'restaurants' ? 'bg-[#00d4aa]/20' : 'bg-[#00d4aa]/10 group-hover:bg-[#00d4aa]/20'
              }`}>
                <UtensilsCrossed className="w-7 h-7 text-[#00d4aa]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Restaurants à Proximité</h3>
                <p className="text-sm text-white/40">Découvrir les restaurants et spécialités locales autour de nous</p>
              </div>
              {mapMode === 'restaurants' && (
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-3 h-3 rounded-full bg-[#00d4aa]" />
              )}
            </motion.button>
          </div>
        </div>
      </section>

      {/* ─── CLOSING + CTA ─── */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,170,0.08) 0%, transparent 70%)',
        }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <Image
              src="/images/mascot (2).png"
              alt="Metal Sport"
              width={100}
              height={100}
              className="mx-auto"
              onError={(e) => {
                const el = e.target as HTMLImageElement;
                el.style.display = 'none';
                const fallback = el.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#00d4aa] to-[#00b896] flex items-center justify-center shadow-xl shadow-[#00d4aa]/20 hidden">
              <span className="text-2xl font-black text-black">MS</span>
            </div>
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
                className="px-10 py-4 bg-[#00d4aa] text-black text-sm font-bold uppercase tracking-[0.15em] rounded-xl shadow-2xl shadow-[#00d4aa]/30 flex items-center gap-3 mx-auto"
                whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,212,170,0.4)' }}
                whileTap={{ scale: 0.98 }}
                animate={{ boxShadow: ['0 0 20px rgba(0,212,170,0.2)', '0 0 35px rgba(0,212,170,0.35)', '0 0 20px rgba(0,212,170,0.2)'] }}
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
