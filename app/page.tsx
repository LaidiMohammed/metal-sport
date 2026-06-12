'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const FEATURES = [
  { n: '01', title: '3D Exercise Library', desc: 'Full-body 3D visualization of every movement. See muscle activation and correct form in real time.' },
  { n: '02', title: 'AI Coach', desc: 'Your AI trainer adapts programs based on performance data and progressive overload principles.' },
  { n: '03', title: 'Custom Workouts', desc: 'Build splits, supersets, and periodization blocks. Log every rep with smart progression alerts.' },
  { n: '04', title: 'Analytics', desc: 'Deep stats on volume, strength curves, and body composition. Track what moves the needle.' },
  { n: '05', title: 'Premium Shop', desc: 'Curated gear, supplements, and apparel sourced for athletes who demand performance.' },
  { n: '06', title: 'Community', desc: 'Challenges, leaderboards, and athlete profiles. Train alone — compete together.' },
];

const S = (d: string, vb = '0 0 48 48') => `<svg viewBox="${vb}" fill="none"><path d="${d}" fill="currentColor"/></svg>`;

const sponsors = [
  // ── Équipement ──
  { name: 'Technogym', logo: S('M8 8h32v4H8zm0 10h32v4H8zm0 10h32v4H8zm0 10h32v4H8z', '0 0 48 48') },
  { name: 'Hammer Strength', logo: S('M6 6h36v36H6zM14 14h20v4H14zm0 8h24v4H14zm0 8h20v4H14z') },
  { name: 'Life Fitness', logo: S('M14 8c4 0 8 4 8 12s-4 12-8 12c-5 0-8-4-8-12S9 8 14 8zm0 4c-2 0-4 3-4 8s2 8 4 8 4-3 4-8-2-8-4-8zM28 8h6v32h-6zM36 8h6v32h-6z') },
  { name: 'Panatta', logo: S('M8 6h32v4H8zm0 12h26v4H8zm2 12h28v4H10zm-2 12h32v4H8z') },
  { name: 'Matrix', logo: S('M8 6l16 18L8 42h8l12-14-12-14H8zm16 0l16 18-16 18h8l16-18L40 6h-8z') },
  { name: 'Realleader', logo: S('M8 6h20a8 8 0 014 15 8 8 0 01-4 15H8V6zm20 11a4 4 0 000-8H16v8h12zm-12 4v8h16a4 4 0 000-8H16z') },
  { name: 'Kettler', logo: S('M8 8h12v32H8zM24 8h4v32h-4zM32 8h4v32h-4zM40 8h4v32h-4zM8 8h36v6H8z') },
  { name: 'Proform', logo: S('M8 6h20a10 10 0 014 19.5 10 10 0 01-4 19.5H8V6zm20 16a6 6 0 000-12H16v12h12zm-12 4v12h12a6 6 0 000-12H16z') },
  { name: 'NordicTrack', logo: S('M4 12h8l6 12 6-12h8l6 12 6-12h8M12 36h8l4-8 4 8h8') },
  { name: 'BH Fitness', logo: S('M6 8h16v6H12v8h10v6H12v12H6V8zM26 8h6v32h-6zM34 8h8v6h-8zm0 10h8v6h-8zm0 10h8v6h-8z') },
  { name: 'Gym80', logo: S('M6 6h36v36H6zm4 4h28v28H10zM18 14h4v20h-4zM26 14h4v20h-4zM14 18h20v4H14zM14 26h20v4H14z') },
  { name: 'Adidas', color: '#003264', logo: S('M0 28L10 2h6L4 28H0zm12 0L24 2h6L16 28h-4zm14 0L38 2h6L30 28h-4z', '0 0 48 30') },
  { name: 'Nike', color: '#c8c8c8', logo: S('M48 2C32 10 10 22 0 30c16-6 34-16 48-28z', '0 0 48 30') },
  { name: 'Hummel', color: '#c83232', logo: S('M2 4h10l4 8 4-8h10l-8 16H20l-4-8-4 8H0l2-4h4l2-4H4l2-4h4l2-4H2V4zm32 0h12l-6 16h-6l2-4h2l2-4h-6l2-4h6l-2-4h-6V4z', '0 0 48 30') },
  // ── Nutrition ──
  { name: 'Optimum Nutrition', logo: S('M8 8h32v6H8zm0 10h28v4H8zm0 10h32v4H8zm0 10h28v4H8z') },
  { name: 'Scitec Nutrition', logo: S('M8 6h6l10 18L34 6h6v36h-8V20l-8 14-8-14v22H8V6z') },
  { name: 'QNT', logo: S('M6 6h16a12 12 0 018 22l-8 14H6V6zm16 10a6 6 0 000-12H14v12h8z') },
  { name: 'MyProtein', logo: S('M4 8h12v6H4zm0 10h12v6H4zm0 10h12v6H4zM22 8h6v32h-6zM32 8h12v6H32zm0 10h12v6H32zm0 10h12v6H32z') },
  { name: 'Weider', logo: S('M4 6h12l8 14L32 6h12L28 28v14h-8V28L4 6z') },
  { name: 'BioTech USA', logo: S('M8 8h12v6H8zm0 10h10v6H8zm0 10h12v6H8zM24 8h6v32h-6zM34 8h10v6H34zm0 32V8l10 6v6l-6 4 6 4v6l-10 8z') },
  { name: 'Nutrend', logo: S('M4 6h40v8H4zm0 14h36v8H4zm0 14h40v8H4z') },
  { name: 'Dymatize', logo: S('M6 8h36v8H6zm0 12h32v8H6zm0 12h36v8H6z') },
  { name: 'BSN', logo: S('M4 8h14v6H4zm0 10h14v6H4zm0 10h14v6H4zM24 8h6v32h-6zM34 8h12v6H34zm0 10h12v6H34zm0 10h12v6H34z') },
  { name: 'Gaspari', logo: S('M8 6h20v8H16v8h12v8H16v12H8V6zM32 6h10v8H32zm0 12h10v8H32zm0 12h10v8H32z') },
  { name: 'Applied Nutrition', logo: S('M6 6h8v36H6zM18 6h24v6H18zm0 10h20v6H18zm0 10h24v6H18zm0 10h20v6H18z') },
  { name: 'MuscleTech', logo: S('M4 8h18v8H4zm0 12h18v20H4zM26 8h18v6H26zm0 10h18v6H26zm0 10h18v6H26z') },
  { name: 'Macroh', logo: S('M4 6h16v12H4zm0 16h16v22H4zM24 6h6v36h-6zM34 6h14v8H34zm0 12h14v8H34zm0 12h14v8H34z') },
  { name: 'F&H Nutrition', logo: S('M4 8h10v32H4zM18 8h6v32h-6zM28 8h18v8H28zm0 12h18v8H28zm0 12h18v8H28z') },
  { name: 'Creapure', logo: S('M8 8a16 16 0 010 32 16 16 0 010-32zm0 6a10 10 0 100 20 10 10 0 000-20zM30 8h18v8H30zm0 10h14v8H30zm0 10h18v8H30z') },
  { name: 'Mark Nutrition', logo: S('M4 8h14v6H4zm0 10h14v6H4zm0 10h14v6H4zM22 8h6v32h-6zM32 8h14v8H32zm0 12h14v8H32zm0 12h14v8H32z') },
  { name: 'Power Fitness', logo: S('M8 6h20v8H8zm0 12h32v8H8zm0 12h20v8H8zM32 6h12v8H32zm0 12h12v20H32z') },
  { name: 'On Sport', logo: S('M6 8h12v16H6zm16-2h14v8H22zm0 12h14v24H22zM40 6h6v36h-6z') },
  { name: 'Izem', logo: S('M8 8h12v32H8zM24 8h6v32h-6zM34 8h12v8H34zm0 12h12v8H34zm0 12h12v8H34z') },
  // ── Boissons ──
  { name: 'RedBull', color: '#c80000', logo: S('M16 4l8 18-8 22h6l10-22-10-18h-6zM4 14l4 10-4 10h4l6-10-6-10H4zM40 14l-4 10 4 10h-4l-6-10 6-10h4z') },
  { name: 'Monster Energy', logo: S('M12 6L8 42h8l2-16 4 16h8l2-16 4 16h8l-4-36h-8l-2 14-4-14h-8l-2 14-4-14h-8z') },
  { name: 'Gatorade', logo: S('M4 6h40L32 42H16L4 6zm8 6l8 26h16l8-26H12z') },
  { name: 'Burn', logo: S('M24 4c6 0 12 4 14 10l-6 16h6l-4 12H20l6-16h-6l4-12c2-6 8-10 14-10zM4 20l4 8-4 8h4l6-8-6-8H4zM40 20l4 8-4 8h-4l-6-8 6-8h4z') },
  { name: 'Powerade', logo: S('M6 8h8l10 16L34 8h8v32h-8V22l-8 14-8-14v18H6V8z') },
  { name: 'Coca-Cola', logo: S('M12 8h10l14 32h-8L24 18 8 40H4l16-32zM34 8h10l2 6h-6l2 6h6l2 6H32l2-18z') },
  { name: 'Pepsi', logo: S('M24 4a20 20 0 0114 35l-8-14c6-3 8-8 6-13s-7-6-12-4-6 7-4 12l-8 14A20 20 0 0124 4z') },
  { name: 'Schweppes', logo: S('M4 8h40v8H4zm0 12h36v8H4zm0 12h40v8H4z') },
  { name: 'Fanta', logo: S('M8 4h32l-4 8H12l-4-8zm4 12h24l-4 8H16l-4-8zm2 12h20l-4 8H18l-4-8zm2 12h16l-2 8H16l-2-8z') },
  { name: 'Sprite', logo: S('M10 4h28l-6 12h-8l10 28H18l6-12h8L10 4z') },
  { name: 'Miranda', logo: S('M8 4h32v8H8zm2 12h28v8H10zm2 12h24v8H12zm2 12h20v8H14z') },
  { name: 'Oasis', logo: S('M8 8h32v6H8zm0 10h6l10 14 10-14h6v22h-8V28l-8 12-8-12v12H8V8z') },
  { name: 'Bougelaz', logo: S('M8 8h12v32H8zm0 0l14 16v16L8 8zM24 8h16v6H24zm0 10h16v6H24zm0 10h16v6H24z') },
  { name: 'Ifri', logo: S('M8 4h32v40H8zm4 4v32h6V20l4 8 4-8v20h6V8h-6l-4 10-4-10h-6z') },
  { name: 'Azro', logo: S('M8 6l16 36H12L4 6h4zm8 0l8 20 8-20h4L24 30 12 6h4zM36 6l4 36h-8l-4-36h8z') },
  { name: 'Lala Khdija', logo: S('M8 6h10l6 14 6-14h10v36h-8V18l-8 18-8-18v24H8V6z') },
  { name: 'Reborn', logo: S('M24 4c-8 0-14 6-14 14v16c0 8 6 14 14 14s14-6 14-14V18c0-8-6-14-14-14zm0 8c4 0 6 3 6 6v16c0 3-2 6-6 6s-6-3-6-6V18c0-3 2-6 6-6z') },
];

export default function Home() {
  const [showCinematic, setShowCinematic] = useState(false);
  const sectionRefs = useRef<(HTMLElement | HTMLDivElement | null)[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'start -0.3'],
  });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('justLoggedIn') === 'true') {
        setShowCinematic(true);
        window.history.replaceState({}, '', '/');
        setTimeout(() => setShowCinematic(false), 800);
      }
    }

    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.1 }
    );
    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const addRef = (el: HTMLElement | HTMLDivElement | null, i: number) => {
    sectionRefs.current[i] = el;
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden pt-14">
      {/* Cinematic login transition */}
      {showCinematic && (
        <motion.div
          className="fixed inset-0 z-50 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-accent via-accent/50 to-transparent"
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-accent via-accent/50 to-transparent"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-2 border-transparent border-t-accent-foreground border-r-accent-foreground animate-spin" />
              <p className="text-accent-foreground font-semibold text-lg tracking-widest animate-pulse">
                ENTERING YOUR WORLD
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}

      <Navbar />

      {/* ─── HERO ─── */}
      <section ref={heroRef} className="relative min-h-[640px] flex items-end overflow-hidden text-white" style={{ background: '#050a08' }}>
        {/* Animated blue blur blobs */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="animate-blob absolute rounded-full" style={{ width: '55%', height: '70%', top: '10%', left: '-10%', background: 'radial-gradient(circle, rgba(0,100,255,0.22) 0%, rgba(0,60,180,0.10) 50%, transparent 75%)', filter: 'blur(60px)' }} />
          <div className="animate-blob delay-2000 absolute rounded-full" style={{ width: '45%', height: '60%', top: '-5%', right: '5%', background: 'radial-gradient(circle, rgba(0,160,255,0.18) 0%, rgba(0,80,220,0.08) 50%, transparent 75%)', filter: 'blur(55px)' }} />
          <div className="animate-blob delay-3500 absolute rounded-full" style={{ width: '50%', height: '65%', top: '30%', left: '25%', background: 'radial-gradient(circle, rgba(40,0,200,0.14) 0%, rgba(20,0,150,0.07) 50%, transparent 75%)', filter: 'blur(70px)' }} />
          <div className="animate-blob delay-5000 absolute rounded-full" style={{ width: '40%', height: '55%', bottom: '-10%', right: '15%', background: 'radial-gradient(circle, rgba(0,200,255,0.15) 0%, rgba(0,120,200,0.07) 50%, transparent 75%)', filter: 'blur(50px)' }} />
          <div className="animate-blob delay-6500 absolute rounded-full" style={{ width: '38%', height: '50%', bottom: '0%', left: '10%', background: 'radial-gradient(circle, rgba(0,40,160,0.18) 0%, rgba(0,20,120,0.08) 50%, transparent 75%)', filter: 'blur(65px)' }} />
        </div>

        {/* Vignette overlays */}
        <div className="absolute inset-0 z-[1] pointer-events-none" style={{ background: 'radial-gradient(ellipse at 30% 60%, transparent 30%, rgba(5,10,8,0.75) 100%)' }} />
        <div className="absolute top-0 left-0 bottom-0 z-[1] pointer-events-none" style={{ width: '55%', background: 'linear-gradient(to right, rgba(5,10,8,0.92) 60%, transparent 100%)' }} />
        <div className="absolute bottom-0 left-0 right-0 z-[2] pointer-events-none" style={{ height: 120, background: 'linear-gradient(to top, rgba(5,10,8,1) 0%, transparent 100%)' }} />

        {/* Scan line + corners */}
        <div className="scan-line" />
        <div className="corner-tl" /><div className="corner-tr" />
        <div className="corner-bl" /><div className="corner-br" />

        {/* Mascot */}
        <div className="absolute right-[14%] bottom-0 z-[4] flex items-end justify-center pointer-events-none hidden md:block" style={{ width: '28%', maxWidth: 260 }}>
          <div className="relative w-full">
            <Image
              src="/images/mascot.png"
              alt="Kimo Mascot"
              width={260}
              height={260}
              className="mascot-img w-full h-auto object-contain object-bottom"
              priority
              style={{ filter: 'drop-shadow(0 0 28px rgba(0,200,160,0.35)) drop-shadow(0 0 55px rgba(0,200,160,0.12))' }}
            />
            <div className="glow-floor absolute pointer-events-none" style={{ bottom: -2, left: '50%', transform: 'translateX(-50%)', width: '68%', height: 22, background: 'radial-gradient(ellipse, rgba(0,200,160,0.65) 0%, transparent 70%)', filter: 'blur(9px)' }} />
          </div>
        </div>

        {/* Hero content */}
        <div className="hero-content relative z-[10] pb-[50px] pt-[52px] px-[30px] max-w-2xl">
          <div className="inline-flex items-center gap-[7px] mb-5 px-3 py-1 border text-[10px] tracking-[3.5px] uppercase font-semibold" style={{ background: 'rgba(0,200,160,0.07)', borderColor: 'rgba(0,200,160,0.2)', color: '#00c8a0', fontFamily: "'Barlow Condensed', sans-serif" }}>
            <span className="badge-dot" style={{ width: 5, height: 5, background: '#00c8a0', borderRadius: '50%', display: 'inline-block' }} />
            Premium Fitness &middot; Est. 2024
          </div>

          <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left center' }} className="mb-[6px]">
            {['FORGE', 'YOUR'].map((word, i) => (
              <div key={word} className={`tl-${i + 1} overflow-hidden`} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(54px,9.5vw,96px)', lineHeight: 0.88, letterSpacing: 2 }}>
                <span>{word}</span>
              </div>
            ))}
            <div className="tl-3 overflow-hidden" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(54px,9.5vw,96px)', lineHeight: 0.88, letterSpacing: 2 }}>
              <span>LEGEND</span>
            </div>
          </motion.div>

          <p className="tag-line" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 300, letterSpacing: 6, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', margin: '13px 0 18px' }}>
            Metal Sport Gym
          </p>
          <p className="desc-text" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, maxWidth: 350, marginBottom: 26, fontWeight: 300 }}>
            Advanced 3D exercise visualization, AI-powered coaching, and premium fitness gear — all in one elite platform built for serious athletes.
          </p>

          <div className="btns-row flex gap-[11px] flex-wrap mb-[30px]">
            <Link href="/exercises">
              <button className="btn-primary transition-all duration-200 hover:-translate-y-0.5" style={{ background: '#00c8a0', color: '#050505', padding: '12px 25px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
                Start Training
              </button>
            </Link>
            <Link href="/workouts">
              <button className="btn-secondary transition-all duration-200" style={{ background: 'transparent', color: 'rgba(255,255,255,.55)', padding: '11px 21px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 12, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.14)', cursor: 'pointer' }}>
                View Programs
              </button>
            </Link>
          </div>

          <div className="stats-row flex gap-[22px] pt-[18px]" style={{ borderTop: '1px solid rgba(255,255,255,.06)' }}>
            {[['3D', 'Exercise Viz'], ['200+', 'Exercises'], ['AI', 'Coach'], ['24/7', 'Access']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 27, color: '#00c8a0', lineHeight: 1 }}>{n}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,.28)', textTransform: 'uppercase', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll cue */}
      <div className="scroll-cue text-center py-2" style={{ background: '#050a08' }}>
        <div className="sc-bar mx-auto" style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, transparent, #00c8a0)' }} />
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,.28)', textTransform: 'uppercase', marginTop: 5 }}>Scroll</p>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,.04)' }} />

      {/* ─── FEATURES ─── */}
      <section ref={(el) => addRef(el, 0)} className="reveal text-white" style={{ padding: '56px 30px', background: '#050a08' }}>
        <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: '#00c8a0', marginBottom: 11 }}>What we offer</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px,4.5vw,50px)', lineHeight: 0.95, letterSpacing: 2, marginBottom: 32 }}>BUILT FOR<br />CHAMPIONS</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {FEATURES.map((f, i) => (
            <div key={f.n} ref={(el) => addRef(el, i + 1)} className="feat-card relative overflow-hidden" style={{ background: '#050a08', padding: '24px 18px', transitionDelay: `${i * 0.08}s` }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: 'rgba(0,200,160,0.1)', lineHeight: 1, marginBottom: 9 }}>{f.n}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 14, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: '#fff', marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.36)', lineHeight: 1.65, fontWeight: 300 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <div style={{ height: 1, background: 'rgba(255,255,255,.04)' }} />

      {/* ─── MASCOT SECTION ─── */}
      <div ref={(el) => addRef(el, 7)} className="reveal text-white flex items-center gap-8" style={{ padding: '48px 30px', background: 'rgba(0,200,160,0.015)', borderTop: '1px solid rgba(0,200,160,0.06)', borderBottom: '1px solid rgba(0,200,160,0.06)' }}>
        <div className="w-[100px] flex-shrink-0 hidden md:block" style={{ filter: 'drop-shadow(0 0 16px rgba(0,200,160,0.22))' }}>
          <Image
            src="/images/mascot.png"
            alt="Kimo"
            width={100}
            height={100}
            className="w-full h-auto"
            style={{ animation: 'mFloat 7s ease-in-out infinite' }}
          />
        </div>
        <div>
          <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: 4, textTransform: 'uppercase', color: '#00c8a0', marginBottom: 11 }}>Meet your coach</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px,4.5vw,50px)', lineHeight: 0.95, letterSpacing: 2, marginBottom: 9 }}>
            TRAIN WITH<br /><span style={{ color: '#00c8a0' }}>KIMO — YOUR AI</span><br />GUIDE
          </h2>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,.4)', lineHeight: 1.75, fontWeight: 300, maxWidth: 300, marginBottom: 16 }}>
            Kimo is the face of Metal Sport — a symbol of peak performance, discipline, and relentless improvement. Your AI coach, always by your side.
          </p>
          <div className="flex gap-5">
            {[['100%', 'Personalized'], ['∞', 'Motivation'], ['0', 'Excuses']].map(([n, l]) => (
              <div key={l}>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#00c8a0' }}>{n}</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 10, letterSpacing: 2, color: 'rgba(255,255,255,.28)', textTransform: 'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: 'rgba(255,255,255,.04)' }} />

      {/* ─── CTA ─── */}
      <section ref={(el) => addRef(el, 8)} className="reveal text-center relative overflow-hidden text-white" style={{ padding: '68px 30px', background: '#050a08' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full" style={{ width: 460, height: 460, background: 'radial-gradient(circle, rgba(0,200,160,0.04) 0%, transparent 70%)' }} />
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px,6vw,74px)', lineHeight: 0.9, letterSpacing: 3, marginBottom: 13 }}>
          READY TO<br /><span style={{ color: '#00c8a0' }}>DOMINATE</span>?
        </h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,.36)', fontWeight: 300, marginBottom: 24, letterSpacing: 1 }}>
          Join thousands of athletes already training smarter with Metal Sport.
        </p>
        <Link href="/membership">
          <button className="btn-primary transition-all duration-200 hover:-translate-y-0.5" style={{ background: '#00c8a0', color: '#050505', padding: '14px 40px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
            Start Free Trial
          </button>
        </Link>
      </section>

      {/* ─── SPONSORS 3 ROWS ─── */}
      {(() => {
        const machineRow = sponsors.slice(0, 14);
        const nutritionRow = sponsors.slice(14, 33);
        const boissonRow = sponsors.slice(33);
        const rows = [
          { items: machineRow, label: 'Équipement', speed: 20 },
          { items: nutritionRow, label: 'Nutrition', speed: 24 },
          { items: boissonRow, label: 'Boissons', speed: 18 },
        ];
        return (
          <section style={{ padding: '24px 0 8px', background: 'rgba(5,10,8,0.95)', borderTop: '1px solid rgba(0,200,160,0.08)', borderBottom: '1px solid rgba(0,200,160,0.08)', overflow: 'hidden' }}>
            <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 9, letterSpacing: 4, textTransform: 'uppercase', color: 'rgba(0,200,160,0.3)', textAlign: 'center', marginBottom: 16 }}>Official Partners</p>
            {rows.map(({ items, label, speed }, ri) => (
              <div key={ri} style={{ marginBottom: ri < 2 ? 10 : 0 }}>
                <div style={{ overflow: 'hidden', maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)' }}>
                  <motion.div
                    style={{ display: 'flex', gap: 32, padding: '0 20px', whiteSpace: 'nowrap', alignItems: 'center' }}
                    animate={{ x: ri % 2 === 0 ? ['0%', '-50%'] : ['-50%', '0%'] }}
                    transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
                  >
                    {[...items, ...items].map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px', borderRight: '1px solid rgba(255,255,255,0.04)' }}>
                        {s.logo ? (
                          <div style={{ width: 32, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color || 'rgba(255,255,255,0.25)' }} dangerouslySetInnerHTML={{ __html: s.logo }} />
                          </div>
                        ) : (
                          <span style={{ fontSize: 14, fontWeight: 700, fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: 1.5, color: s.color, opacity: 0.4 }}>{s.name}</span>
                        )}
                        {s.logo && <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: s.color, opacity: 0.35 }}>{s.name}</span>}
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            ))}
          </section>
        );
      })()}

      <Footer />

      {/* ─── INJECT KEYFRAMES ─── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;700&family=Barlow:wght@300;400&display=swap');

        @keyframes blob {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(40px,-30px) scale(1.08); }
          66%      { transform: translate(-25px,20px) scale(0.95); }
        }
        @keyframes scan {
          0%   { top:-1px; opacity:0; }
          8%   { opacity:1; }
          92%  { opacity:.5; }
          100% { top:100%; opacity:0; }
        }
        @keyframes mUp    { to { opacity:1; transform:translateY(0); } }
        @keyframes mFloat {
          0%,100% { transform:translateY(0) rotate(-.5deg); }
          50%     { transform:translateY(-14px) rotate(.5deg); }
        }
        @keyframes gf {
          0%   { opacity:.3; transform:translateX(-50%) scaleX(.65); }
          100% { opacity:1;  transform:translateX(-50%) scaleX(1.45); }
        }
        @keyframes cf { to { opacity:1; } }
        @keyframes tlU { to { opacity:1; transform:translateY(0); } }
        @keyframes fi { to { opacity:1; } }
        @keyframes ci { to { opacity:1; transform:translateY(0); } }
        @keyframes scB {
          0%,100% { opacity:0; transform:scaleY(0); transform-origin:top; }
          55%     { opacity:1; transform:scaleY(1); transform-origin:top; }
        }
        @keyframes bd { 0%,100%{opacity:1} 50%{opacity:.1} }

        .animate-blob   { animation: blob 8s ease-in-out infinite; }
        .delay-2000     { animation-delay: 2s; }
        .delay-3500     { animation-delay: 3.5s; }
        .delay-5000     { animation-delay: 5s; }
        .delay-6500     { animation-delay: 6.5s; }

        .scan-line      { animation: scan 6s linear infinite; position:absolute; top:0; left:0; right:0; height:1px;
                          background:rgba(0,200,160,0.45); box-shadow:0 0 12px rgba(0,200,160,0.6); z-index:5; }
        .corner-tl      { animation: cf 1s ease 0.4s forwards; opacity:0; position:absolute; top:18px; left:18px; width:24px; height:24px; border-top:1px solid rgba(0,200,160,0.6); border-left:1px solid rgba(0,200,160,0.6); z-index:5; }
        .corner-tr      { animation: cf 1s ease 0.5s forwards; opacity:0; position:absolute; top:18px; right:18px; width:24px; height:24px; border-top:1px solid rgba(0,200,160,0.6); border-right:1px solid rgba(0,200,160,0.6); z-index:5; }
        .corner-bl      { animation: cf 1s ease 0.6s forwards; opacity:0; position:absolute; bottom:18px; left:18px; width:24px; height:24px; border-bottom:1px solid rgba(0,200,160,0.6); border-left:1px solid rgba(0,200,160,0.6); z-index:5; }
        .corner-br      { animation: cf 1s ease 0.7s forwards; opacity:0; position:absolute; bottom:18px; right:18px; width:24px; height:24px; border-bottom:1px solid rgba(0,200,160,0.6); border-right:1px solid rgba(0,200,160,0.6); z-index:5; }

        .mascot-img     { animation: mUp 1.3s cubic-bezier(0.22,1,0.36,1) 0.2s forwards, mFloat 7s ease-in-out 1.5s infinite; opacity:0; transform:translateY(90px); }
        .glow-floor     { animation: gf 3.5s ease-in-out infinite alternate; }
        .hero-content   { animation: ci 0.9s ease 0.05s forwards; opacity:0; transform:translateY(22px); }

        .tl-1 span { animation: tlU 0.72s cubic-bezier(0.22,1,0.36,1) 0.14s forwards; opacity:0; transform:translateY(108%); display:block; }
        .tl-2 span { animation: tlU 0.72s cubic-bezier(0.22,1,0.36,1) 0.26s forwards; opacity:0; transform:translateY(108%); display:block; }
        .tl-3 span { animation: tlU 0.72s cubic-bezier(0.22,1,0.36,1) 0.38s forwards; opacity:0; transform:translateY(108%); display:block; color:#00c8a0; }

        .tag-line   { animation: fi 0.7s ease 0.6s forwards;  opacity:0; }
        .desc-text  { animation: fi 0.7s ease 0.75s forwards; opacity:0; }
        .btns-row   { animation: fi 0.7s ease 0.9s forwards;  opacity:0; }
        .stats-row  { animation: fi 0.7s ease 1s forwards;    opacity:0; }
        .scroll-cue { animation: fi 1s ease 2.2s forwards;    opacity:0; }
        .badge-dot  { animation: bd 1.6s ease-in-out infinite; }
        .sc-bar     { animation: scB 2s ease-in-out infinite; }

        .reveal             { opacity:0; transform:translateY(32px); transition:opacity .7s ease, transform .7s ease; }
        .reveal.is-visible  { opacity:1; transform:translateY(0); }
        .feat-card          { opacity:0; transform:translateY(26px); transition:opacity .55s ease, transform .55s ease, background .25s; }
        .feat-card.is-visible { opacity:1; transform:translateY(0); }
        .feat-card::after   { content:''; position:absolute; bottom:0; left:0; width:0; height:2px; background:#00c8a0; transition:width .35s; }
        .feat-card:hover::after { width:100%; }
        .feat-card:hover    { background:rgba(0,200,160,0.03); }

        .btn-primary { clip-path: polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px)); }
        .btn-secondary { clip-path: polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px)); }
      `}</style>
    </div>
  );
}
