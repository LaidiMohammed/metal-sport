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

const sponsors = [
  { name: 'Technogym', color: '#0050c8' },
  { name: 'Hammer Strength', color: '#c83232' },
  { name: 'Life Fitness', color: '#009664' },
  { name: 'Panatta', color: '#c80000' },
  { name: 'Matrix', color: '#3232c8' },
  { name: 'Realleader', color: '#c86400' },
  { name: 'Kettler', color: '#006496' },
  { name: 'Proform', color: '#9632c8' },
  { name: 'NordicTrack', color: '#329632' },
  { name: 'BH Fitness', color: '#c89600' },
  { name: 'Gym80', color: '#969696' },
  { name: 'Adidas', color: '#003264', logo: `<svg viewBox="0 0 48 30" fill="none"><path d="M0 28L10 2h6L4 28H0zm12 0L24 2h6L16 28h-4zm14 0L38 2h6L30 28h-4z" fill="currentColor"/></svg>` },
  { name: 'Nike', color: '#c8c8c8', logo: `<svg viewBox="0 0 48 30" fill="none"><path d="M48 2C32 10 10 22 0 30c16-6 34-16 48-28z" fill="currentColor"/></svg>` },
  { name: 'Hummel', color: '#c83232', logo: `<svg viewBox="0 0 48 30" fill="none"><path d="M2 4h10l4 8 4-8h10l-8 16H20l-4-8-4 8H0l2-4h4l2-4H4l2-4h4l2-4H2V4zm32 0h12l-6 16h-6l2-4h2l2-4h-6l2-4h6l-2-4h-6V4z" fill="currentColor"/></svg>` },
  { name: 'Optimum Nutrition', color: '#c89600' },
  { name: 'Scitec Nutrition', color: '#6400c8' },
  { name: 'QNT', color: '#00c864' },
  { name: 'MyProtein', color: '#c80064' },
  { name: 'Weider', color: '#3232c8' },
  { name: 'BioTech USA', color: '#0096c8' },
  { name: 'Nutrend', color: '#96c800' },
  { name: 'Dymatize', color: '#c83296' },
  { name: 'BSN', color: '#3296c8' },
  { name: 'Gaspari', color: '#c86432' },
  { name: 'Applied Nutrition', color: '#006464' },
  { name: 'MuscleTech', color: '#6464c8' },
  { name: 'Macroh', color: '#00b478' },
  { name: 'F&H Nutrition', color: '#6632c8' },
  { name: 'Creapure', color: '#32c8c8' },
  { name: 'Mark Nutrition', color: '#ff5050' },
  { name: 'Power Fitness', color: '#ff3232' },
  { name: 'On Sport', color: '#ffc832' },
  { name: 'Izem', color: '#ffb400' },
  { name: 'RedBull', color: '#c80000', logo: `<svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="currentColor" stroke-width="3"/><path d="M16 28l4-14h4l-2 10h4l-4 14h-4l2-10h-4z" fill="currentColor"/></svg>` },
  { name: 'Bougelaz', color: '#4a9eff' },
  { name: 'Ifri', color: '#00c8a0' },
  { name: 'Azro', color: '#ff6a33' },
  { name: 'Lala Khdija', color: '#c83264' },
  { name: 'Reborn', color: '#c8c832' },
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
