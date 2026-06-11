'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Dumbbell, Timer, HeartHandshake, TrendingUp, ArrowRight, Sparkles, Shield, Users, Zap, MapPin, ShowerHead, UtensilsCrossed, Star, ChevronRight, Target, Brain, Activity } from 'lucide-react';

const VALUES = [
  { icon: Dumbbell, title: 'Force', desc: 'Développez une résilience physique et mentale grâce à des méthodes éprouvées.', gradient: 'from-[#00d4aa] to-[#0891b2]' },
  { icon: Timer, title: 'Discipline', desc: 'La régularité prime sur l\'intensité. Présent chaque jour pour maîtriser le processus.', gradient: 'from-[#00d4aa] to-[#0891b2]' },
  { icon: HeartHandshake, title: 'Communauté', desc: 'S\'entraîner ensemble, grandir ensemble. Une fraternité qui repousse les limites.', gradient: 'from-[#00d4aa] to-[#0891b2]' },
  { icon: TrendingUp, title: 'Progrès', desc: 'Chaque répétition, chaque kilo, chaque étape compte. Les résultats parlent d\'eux-mêmes.', gradient: 'from-[#00d4aa] to-[#0891b2]' },
];

const SHOWCASE = [
  { title: 'Équipement Premium', desc: 'Machines de pointe, poids libres et zones fonctionnelles pour tous les niveaux.', icon: Dumbbell },
  { title: 'Coach Experts', desc: 'Des entraîneurs certifiés qui conçoivent des programmes adaptés à vos objectifs.', icon: Users },
  { title: 'Énergie de Groupe', desc: 'HIIT, boxing, yoga — entraînez-vous avec une communauté qui alimente votre feu.', icon: Zap },
];

const GYM_LINK = 'https://maps.app.goo.gl/Ag5tjnNmhYUga9NdA';

const FADE_UP = { initial: { opacity: 0, y: 40 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true } };

export default function AboutPage() {
  const [mapMode, setMapMode] = useState<'gym' | 'douches' | 'restaurants'>('gym');
  const heroRef = useRef<HTMLDivElement>(null);
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const { scrollYProgress: missionProgress } = useScroll({ target: missionRef, offset: ['start end', 'end end'] });
  const { scrollYProgress: valuesProgress } = useScroll({ target: valuesRef, offset: ['start end', 'end end'] });

  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.85]);
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0]);

  const tealGlow = 'radial-gradient(circle at 50% 0%, rgba(0,212,170,0.06) 0%, transparent 70%)';

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
        <div className="absolute inset-0 opacity-[0.06]" style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, #00d4aa 0%, transparent 50%), radial-gradient(circle at 80% 70%, #00d4aa 0%, transparent 50%)',
        }} />
        <motion.div
          className="absolute top-[15%] left-[10%] w-32 h-32 rounded-full border border-[#00d4aa]/10"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-[20%] right-[15%] w-20 h-20 rounded-full border border-[#00d4aa]/10"
          animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, delay: 1 }}
        />
        <motion.div
          className="absolute top-[40%] right-[25%] w-2 h-2 rounded-full bg-[#00d4aa]/30"
          animate={{ scale: [0, 2, 0], opacity: [0, 0.8, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
        />

        <motion.div style={{ scale: heroScale, opacity: heroOpacity }} className="relative z-10 text-center px-6">
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 rounded-2xl bg-[#00d4aa]/20 blur-xl"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <Image
                src="/images/mascot.png"
                alt="Metal Sport Mascot"
                width={130}
                height={130}
                className="relative z-10 drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 0 40px rgba(0,212,170,0.4))' }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
          </motion.div>

          <motion.h1
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-3"
          >
            <span className="text-white">METAL</span>{' '}
            <span className="text-[#00d4aa]" style={{ textShadow: '0 0 30px rgba(0,212,170,0.3)' }}>SPORT</span>
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-base md:text-lg text-white/30 font-light tracking-[0.15em] uppercase max-w-xl mx-auto"
          >
            Boukli — Oran
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-10"
          >
            <motion.div
              className="w-6 h-10 rounded-full border-2 border-white/10 mx-auto flex items-start justify-center pt-2"
              animate={{ opacity: [0.2, 0.6, 0.2] }}
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
        <div className="absolute inset-0" style={{ background: tealGlow }} />
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), transparent)', scaleX: missionProgress, transformOrigin: 'left' }}
        />
        <div className="max-w-5xl mx-auto relative">
          <motion.span
            className="text-[#00d4aa] text-sm font-semibold tracking-[0.25em] uppercase mb-4 block"
            {...FADE_UP} transition={{ duration: 0.6 }}
          >
            Notre Mission
          </motion.span>

          <motion.h2
            className="text-4xl md:text-6xl font-black leading-[1.05] tracking-tight mb-8"
            initial={{ x: -80, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            On est plus qu&apos;une{' '}
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
              salle de sport
            </motion.span>
            ,<br />on est une{' '}
            <motion.span
              className="inline-block"
              style={{
                background: 'linear-gradient(135deg, #00d4aa, #22d3ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              famille.
            </motion.span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-white/40 leading-relaxed max-w-2xl"
            initial={{ x: -60, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Au Metal Sport Gym Boukli, on ne construit pas que des corps — on forge le caractère.
            Chaque goutte de sueur, chaque répétition, chaque lever matinal est un pas de plus
            vers devenir imbattable.
          </motion.p>

          <motion.div
            className="flex gap-4 mt-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {['#00d4aa', '#0891b2', '#00b896'].map((c, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ background: c }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </div>

        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-80 opacity-[0.04] hidden lg:block pointer-events-none"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
        >
          <svg viewBox="0 0 200 200" fill="none" className="w-full">
            <circle cx="100" cy="100" r="80" stroke="#00d4aa" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="60" stroke="#00d4aa" strokeWidth="0.5" />
            <circle cx="100" cy="100" r="40" stroke="#00d4aa" strokeWidth="0.5" />
          </svg>
        </motion.div>
      </section>

      {/* ─── STATS BANNER ─── */}
      <section className="relative py-20 px-6 border-y border-white/[0.04]">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,212,170,0.03), transparent, rgba(0,212,170,0.03))' }} />
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Membres Actifs', icon: Users },
            { value: '5+', label: 'Années d\'Expérience', icon: Star },
            { value: '50+', label: 'Équipements', icon: Dumbbell },
            { value: '15+', label: 'Coach Pro', icon: Brain },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Icon className="w-6 h-6 text-[#00d4aa] mx-auto mb-3 opacity-60" />
                <p className="text-3xl md:text-4xl font-black text-white mb-1">{s.value}</p>
                <p className="text-xs text-white/30 uppercase tracking-widest">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ─── CORE VALUES ─── */}
      <section ref={valuesRef} className="relative py-32 px-6">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,170,0.02) 50%, transparent 100%)' }} />

        <motion.div className="max-w-6xl mx-auto" style={{ opacity: valuesProgress, y: useTransform(valuesProgress, [0, 1], [60, 0]) }}>
          <motion.div className="text-center mb-20" {...FADE_UP} transition={{ duration: 0.6 }}>
            <span className="text-[#00d4aa] text-sm font-semibold tracking-[0.25em] uppercase">Nos Valeurs</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">Ce Qui Nous Définit</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.title}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.12 }}
                  className="group relative p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500"
                >
                  <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" style={{
                    background: 'radial-gradient(600px circle at 50% 0%, rgba(0,212,170,0.08), transparent)',
                    boxShadow: 'inset 0 1px 0 rgba(0,212,170,0.1)',
                  }} />
                  <motion.div
                    className="relative z-10 w-14 h-14 rounded-xl flex items-center justify-center mb-6"
                    style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.12), rgba(0,212,170,0.04))' }}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <Icon className="w-7 h-7 text-[#00d4aa]" />
                  </motion.div>
                  <h3 className="relative z-10 text-2xl font-black mb-3">{v.title}</h3>
                  <p className="relative z-10 text-white/40 text-sm leading-relaxed">{v.desc}</p>
                  <motion.div
                    className="relative z-10 mt-5 w-0 h-[2px] bg-[#00d4aa] group-hover:w-full transition-all duration-500"
                  />
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* ─── GYM EXPERIENCE SHOWCASE ─── */}
      <section className="relative py-32 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{ background: tealGlow }} />
        <motion.div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), transparent)' }} />
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-20" {...FADE_UP} transition={{ duration: 0.6 }}>
            <span className="text-[#00d4aa] text-sm font-semibold tracking-[0.25em] uppercase">L&apos;Expérience</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">Entraînez-vous Comme Jamais</h2>
          </motion.div>

          <div className="space-y-6">
            {SHOWCASE.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -80 : 80 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.12 }}
                  className="group flex items-center gap-8 p-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:border-[#00d4aa]/20 hover:bg-[#00d4aa]/[0.02] transition-all duration-300"
                >
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110" style={{ background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(0,212,170,0.05))' }}>
                    <Icon className="w-8 h-8 text-[#00d4aa]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-white/40">{item.desc}</p>
                  </div>
                  <motion.div
                    className="flex-shrink-0 w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center group-hover:border-[#00d4aa]/30 group-hover:bg-[#00d4aa]/[0.04] transition-all"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ChevronRight className="w-5 h-5 text-[#00d4aa]" />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── LOCALISATION & AMENITIES ─── */}
      <section ref={mapRef} className="relative py-32 px-6">
        <div className="absolute inset-0" style={{ background: tealGlow }} />
        <motion.div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,170,0.4), transparent)' }} />
        <div className="max-w-6xl mx-auto relative">
          <motion.div className="text-center mb-12" {...FADE_UP} transition={{ duration: 0.6 }}>
            <span className="text-[#00d4aa] text-sm font-semibold tracking-[0.25em] uppercase">Localisation</span>
            <h2 className="text-4xl md:text-5xl font-black mt-4 tracking-tight">Nous Trouver</h2>
            <p className="text-white/40 mt-4 max-w-lg mx-auto">
              Situé à Boukli, Oran — facilement accessible. Découvrez les commodités à proximité.
            </p>
          </motion.div>

          <motion.div
            className="rounded-2xl overflow-hidden border border-white/[0.08] mb-10 h-[350px] md:h-[450px] relative group"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <a href={GYM_LINK} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              <iframe
                key={mapMode}
                src={mapMode === 'gym'
                  ? 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.5!2d-0.6349!3d35.6958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzXCsDQxJzQ0LjkiTiAwwrAzOCcwNS42Ilc!5e0!3m2!1sfr!2sdz!4v1'
                  : mapMode === 'douches'
                  ? 'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3197.5!2d-0.6349!3d35.6958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m7!3e0!4m0!4m4!2sHammams+et+douches+Boukli+Oran!3m3!2m2!1s0x0%3A0x0!2sHammam!5e0!3m2!1sfr!2sdz!4v1'
                  : 'https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d3197.5!2d-0.6349!3d35.6958!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m7!3e0!4m0!4m4!2sRestaurants+Boukli+Oran!3m3!2m2!1s0x0%3A0x0!2sRestaurants!5e0!3m2!1sfr!2sdz!4v1'
                }
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'invert(0.9) hue-rotate(160deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Metal Sport Boukli Oran"
              />
            </a>
            <motion.div
              className="absolute bottom-4 left-4 right-4 flex items-center gap-3 bg-black/70 backdrop-blur-md rounded-xl px-5 py-3 border border-white/[0.06]"
              animate={{ y: [0, -2, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <MapPin className="w-5 h-5 text-[#00d4aa] flex-shrink-0" />
              <span className="text-sm text-white/80 font-medium">
                {mapMode === 'gym' ? 'Metal Sport Boukli — Oran' : mapMode === 'douches' ? 'Douches & Hammams à proximité' : 'Restaurants à proximité'}
              </span>
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <motion.button
              onClick={() => setMapMode(mapMode === 'douches' ? 'gym' : 'douches')}
              className={`flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 group text-left w-full ${
                mapMode === 'douches'
                  ? 'border-[#00d4aa]/40 bg-[#00d4aa]/[0.06] shadow-lg shadow-[#00d4aa]/5'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-[#00d4aa]/[0.04] hover:border-[#00d4aa]/20'
              }`}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                mapMode === 'douches' ? 'bg-[#00d4aa]/20 scale-110' : 'bg-[#00d4aa]/10 group-hover:bg-[#00d4aa]/20 group-hover:scale-105'
              }`}>
                <ShowerHead className="w-7 h-7 text-[#00d4aa]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Douches & Hammams</h3>
                <p className="text-sm text-white/40">Trouver les douches et hammams les plus proches de notre salle</p>
              </div>
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  mapMode === 'douches' ? 'bg-[#00d4aa] text-black' : 'bg-white/[0.04] text-white/30'
                }`}
                animate={mapMode === 'douches' ? { rotate: [0, 360] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>

            <motion.button
              onClick={() => setMapMode(mapMode === 'restaurants' ? 'gym' : 'restaurants')}
              className={`flex items-center gap-5 p-6 rounded-2xl border transition-all duration-300 group text-left w-full ${
                mapMode === 'restaurants'
                  ? 'border-[#00d4aa]/40 bg-[#00d4aa]/[0.06] shadow-lg shadow-[#00d4aa]/5'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-[#00d4aa]/[0.04] hover:border-[#00d4aa]/20'
              }`}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                mapMode === 'restaurants' ? 'bg-[#00d4aa]/20 scale-110' : 'bg-[#00d4aa]/10 group-hover:bg-[#00d4aa]/20 group-hover:scale-105'
              }`}>
                <UtensilsCrossed className="w-7 h-7 text-[#00d4aa]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg">Restaurants</h3>
                <p className="text-sm text-white/40">Découvrir les restaurants et spécialités locales autour de nous</p>
              </div>
              <motion.div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  mapMode === 'restaurants' ? 'bg-[#00d4aa] text-black' : 'bg-white/[0.04] text-white/30'
                }`}
                animate={mapMode === 'restaurants' ? { rotate: [0, 360] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <ChevronRight className="w-4 h-4" />
              </motion.div>
            </motion.button>
          </div>
        </div>
      </section>

      {/* ─── CLOSING + CTA ─── */}
      <section className="relative py-40 px-6 overflow-hidden">
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,212,170,0.1) 0%, transparent 70%)',
        }} />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#00d4aa]/5"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full border border-[#00d4aa]/10"
          animate={{ scale: [1.2, 1, 1.2], rotate: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.div
                className="absolute inset-0 rounded-2xl bg-[#00d4aa]/30 blur-2xl"
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <Image
                src="/images/mascot (2).png"
                alt="Metal Sport"
                width={110}
                height={110}
                className="relative z-10 mx-auto"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  const fb = el.nextElementSibling as HTMLElement;
                  if (fb) fb.style.display = 'flex';
                }}
              />
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#00d4aa] to-[#00b896] items-center justify-center shadow-xl shadow-[#00d4aa]/20 hidden">
                <span className="text-2xl font-black text-black">MS</span>
              </div>
            </div>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-6xl font-black tracking-tight mb-3"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Metal Sport{' '}
            <span className="text-[#00d4aa]" style={{ textShadow: '0 0 30px rgba(0,212,170,0.3)' }}>Boukli</span>
          </motion.h2>
          <motion.p
            className="text-lg text-white/40 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Oran — Votre salle de sport premium
          </motion.p>
          <motion.p
            className="text-sm text-white/20 tracking-[0.2em] uppercase mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25 }}
          >
            Prêt à rejoindre la famille ?
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Link href="/auth">
              <motion.button
                className="px-10 py-4 bg-[#00d4aa] text-black text-sm font-bold uppercase tracking-[0.15em] rounded-xl shadow-2xl shadow-[#00d4aa]/30 flex items-center gap-3 mx-auto relative overflow-hidden"
                whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0,212,170,0.5)' }}
                whileTap={{ scale: 0.98 }}
                animate={{ boxShadow: ['0 0 20px rgba(0,212,170,0.2)', '0 0 40px rgba(0,212,170,0.4)', '0 0 20px rgba(0,212,170,0.2)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  animate={{ x: ['-100%', '200%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                />
                <span className="relative z-10">Rejoins Nous</span>
                <Sparkles className="w-4 h-4 relative z-10" />
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
