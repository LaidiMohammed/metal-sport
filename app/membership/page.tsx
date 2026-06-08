'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useStore } from '@/lib/store';
import { QRCodeSVG } from 'qrcode.react';
import { Check, QrCode } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useState, useRef } from 'react';

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Perfect for getting started',
    features: [
      'Access to exercise library',
      'Basic workout tracking',
      'Limited 3D visualizations',
      'Community access',
      'Email support',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Premium',
    monthlyPrice: 9.99,
    yearlyPrice: 7.99,
    description: 'Most popular choice',
    features: [
      'Everything in Free',
      'Advanced workout planning',
      'Full 3D exercise models',
      '24/7 AI Coach access',
      'Personalized recommendations',
      'Priority support',
      'Ad-free experience',
      'Offline workouts',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Elite',
    monthlyPrice: 19.99,
    yearlyPrice: 15.99,
    description: 'For serious athletes',
    features: [
      'Everything in Premium',
      '1-on-1 coaching sessions',
      'Nutrition planning',
      'Advanced analytics',
      'Custom workout programs',
      'Exclusive content',
      'Early feature access',
      'VIP community',
    ],
    cta: 'Upgrade Now',
    featured: false,
  },
];

export default function MembershipPage() {
  useAuthProtected();
  const user = useStore((s) => s.user);
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>('Premium');
  const [showQR, setShowQR] = useState(true);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'start -0.3'],
  });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="min-h-screen bg-background pt-14">
      <Navbar />



      {/* Hero banner */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '64px 0 56px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <div className="absolute top-[-80px] right-[10%] w-[500px] h-[500px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <p className="text-accent font-semibold uppercase tracking-wider mb-3">Simple, Transparent Pricing</p>
          <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
              Choose Your Fitness Plan
            </h1>
          </motion.div>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto text-balance mt-2">
            Flexible membership plans designed for every fitness level and budget
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Toggle + QR */}
        <div className="flex items-center justify-center mb-16 relative">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-foreground/40'}`}>Monthly</span>
            <button
              onClick={() => setIsYearly(!isYearly)}
              className={`relative w-12 h-7 rounded-full border-2 transition-colors duration-300 ${
                isYearly ? 'bg-accent border-accent' : 'bg-foreground/10 border-foreground/20'
              }`}
            >
              <div
                className={`absolute top-[2px] w-[22px] h-[22px] rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isYearly ? 'translate-x-[22px]' : 'translate-x-[2px]'
                }`}
              />
            </button>
            <span className={`text-sm font-medium transition-colors ${isYearly ? 'text-foreground' : 'text-foreground/40'}`}>
              Yearly <span className="text-accent font-bold">Save 20%</span>
            </span>
          </div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setShowQR(!showQR)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-card hover:bg-accent/10 transition-all cursor-pointer"
            >
              <motion.div animate={{ rotate: showQR ? 180 : 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }}>
                <QrCode className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
              </motion.div>
              <span className="text-xs font-semibold text-accent">{showQR ? 'Hide' : 'QR Code'}</span>
            </button>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: showQR ? 1 : 0, height: showQR ? 'auto' : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden absolute right-0 top-full mt-2 z-10"
            >
              <div className="rounded-2xl border border-foreground/10 bg-card p-4 flex flex-col items-center shadow-xl">
                <div className="bg-white p-3 rounded-xl">
                  <QRCodeSVG value={JSON.stringify({ id: user?.id, name: user?.name, lastName: user?.lastName })} size={160} level="H" includeMargin />
                </div>
                <p className="text-[10px] text-foreground/40 mt-2 whitespace-normal sm:whitespace-nowrap">Show at the gym to check in</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-start">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isSelected = selectedPlan === plan.name;

            return (
              <div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`rounded-2xl p-8 transition-all duration-300 cursor-pointer relative ${
                  isSelected
                    ? 'border-2 border-accent bg-accent/[0.04] shadow-xl shadow-accent/15'
                    : plan.featured
                    ? 'border border-accent/30 bg-card hover:border-accent/50'
                    : 'border border-foreground/10 bg-card hover:border-foreground/20'
                }`}
              >
                {/* Radio indicator */}
                <div className={`absolute top-6 right-6 w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                  isSelected ? 'border-accent bg-accent' : 'border-foreground/30'
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>

                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent to-emerald-400 text-accent-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-accent/25">
                    MOST POPULAR
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-foreground/60 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6 pt-6 border-t border-foreground/10">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-foreground">${price}</span>
                    <span className="text-foreground/60 ml-2">/month</span>
                  </div>
                  {plan.yearlyPrice > 0 && (
                    <p className="text-sm text-foreground/60 mt-2">
                      {isYearly
                        ? `$${(price * 12).toFixed(2)} billed yearly`
                        : `or $${(plan.yearlyPrice * 12).toFixed(2)}/year (save 20%)`
                      }
                    </p>
                  )}
                </div>

                <Link href="/auth" className="block mb-8" onClick={(e) => e.stopPropagation()}>
                  <Button
                    className={`w-full transition-all ${
                      isSelected
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20'
                        : plan.featured
                        ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                        : 'border border-accent/50 text-accent hover:bg-accent/10'
                    }`}
                    variant={isSelected || plan.featured ? 'default' : 'outline'}
                  >
                    {plan.cta}
                  </Button>
                </Link>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isSelected ? 'text-accent' : 'text-accent/60'}`} />
                      <span className="text-foreground/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Plan Summary */}
        {selectedPlan && (
          <div className="max-w-2xl mx-auto mb-16 p-6 rounded-2xl border border-accent/30 bg-accent/[0.04]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/60 mb-1">Your Selection</p>
                <h3 className="text-xl font-bold text-foreground">{selectedPlan} Plan</h3>
                <p className="text-sm text-foreground/60 mt-1">
                  {isYearly ? 'Yearly billing' : 'Monthly billing'}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-accent">
                  ${isYearly
                    ? plans.find(p => p.name === selectedPlan)!.yearlyPrice
                    : plans.find(p => p.name === selectedPlan)!.monthlyPrice
                  }
                </p>
                <p className="text-sm text-foreground/60">/month</p>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel at any time without any penalties. Your access will continue until the end of your billing period.',
              },
              {
                question: 'Is there a free trial?',
                answer: 'Premium and Elite members get a 7-day free trial. No credit card required to start your trial.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and Apple Pay. Your payment information is securely encrypted.',
              },
              {
                question: 'Can I upgrade or downgrade my plan?',
                answer: 'Yes, you can change your plan anytime. Changes take effect on your next billing cycle.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-foreground/10 rounded-lg p-6 bg-card hover:border-accent/50 transition"
              >
                <h3 className="font-bold text-foreground mb-2">{faq.question}</h3>
                <p className="text-foreground/60 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Start Your Fitness Journey Today</h2>
          <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
            Join thousands of users transforming their fitness with Kimo&apos;s Gym
          </p>
          <Link href="/auth">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 text-lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
