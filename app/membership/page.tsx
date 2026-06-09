'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useStore } from '@/lib/store';
import { QRCodeSVG } from 'qrcode.react';
import { Check, QrCode, Loader2 } from 'lucide-react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Suspense, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function MembershipPageWrapper() {
  return (
    <Suspense>
      <MembershipPage />
    </Suspense>
  );
}

const plans = [
  {
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Parfait pour commencer',
    features: [
      'Accès à la bibliothèque d\'exercices',
      'Suivi d\'entraînement de base',
      'Visualisations 3D limitées',
      'Accès à la communauté',
      'Support par email',
    ],
    cta: 'Commencer',
    featured: false,
  },
  {
    name: 'Premium',
    monthlyPrice: 4500,
    yearlyPrice: 3600,
    description: 'Le choix le plus populaire',
    features: [
      'Tout dans Free',
      'Planification avancée des workouts',
      'Modèles 3D complets',
      'Coach IA 24/7',
      'Recommandations personnalisées',
      'Support prioritaire',
      'Expérience sans pub',
      'Workouts hors ligne',
    ],
    cta: 'S\'abonner',
    featured: true,
  },
  {
    name: 'Elite',
    monthlyPrice: 9500,
    yearlyPrice: 7600,
    description: 'Pour les athlètes sérieux',
    features: [
      'Tout dans Premium',
      'Coaching individuel',
      'Planification nutritionnelle',
      'Analyses avancées',
      'Programmes personnalisés',
      'Contenu exclusif',
      'Accès anticipé aux fonctionnalités',
      'Communauté VIP',
    ],
    cta: 'Passer à Elite',
    featured: false,
  },
];

function da(n: number) {
  try {
    return new Intl.NumberFormat('fr-DZ').format(n);
  } catch {
    return n.toLocaleString('fr-FR');
  }
}

function MembershipPage() {
  useAuthProtected();
  const user = useStore((s) => s.user);
  const [isYearly, setIsYearly] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [paymentError, setPaymentError] = useState('');

  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'start -0.3'],
  });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  const handlePayment = async (plan: string) => {
    if (plan === 'Free' || loadingPlan) return;
    setLoadingPlan(plan);
    setPaymentError('');
    try {
      const res = await fetch('/api/chargily/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          membershipPlan: plan,
          billing: isYearly ? 'annuel' : 'mensuel',
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else setPaymentError(data.error || 'Erreur lors de la création du paiement');
    } catch {
      setPaymentError('Erreur de connexion au serveur');
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-14">
      <Navbar />

      {/* Hero banner */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '64px 0 56px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <div className="absolute top-[-80px] right-[10%] w-[500px] h-[500px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center">
          <p className="text-accent font-semibold uppercase tracking-wider mb-3">Prix simples et transparents</p>
          <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
              Choisissez votre plan
            </h1>
          </motion.div>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto text-balance mt-2">
            Des abonnements flexibles pour tous les niveaux
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Toggle + QR */}
        <div className="flex items-center justify-center mb-16 relative">
          <div className="flex items-center gap-4">
            <span className={`text-sm font-medium transition-colors ${!isYearly ? 'text-foreground' : 'text-foreground/40'}`}>Mensuel</span>
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
              Annuel <span className="text-accent font-bold">-20%</span>
            </span>
          </div>
          {user?.id && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-accent/30 bg-card hover:bg-accent/10 transition-all cursor-pointer"
              >
                <motion.div animate={{ rotate: showQR ? 180 : 0 }} transition={{ duration: 0.35, ease: 'easeInOut' }}>
                  <QrCode className="w-3.5 h-3.5" style={{ color: 'var(--accent)' }} />
                </motion.div>
                <span className="text-xs font-semibold text-accent">{showQR ? 'Cacher' : 'QR Code'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Payment Status */}
        {paymentStatus === 'failed' && (
          <div className="max-w-lg mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
            <p className="text-red-400 font-bold">Paiement annulé ou échoué. Réessayez.</p>
          </div>
        )}
        {paymentError && (
          <div className="max-w-lg mx-auto mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
            <p className="text-red-400 text-sm">{paymentError}</p>
          </div>
        )}

        {/* QR Code Modal */}
        <AnimatePresence>
          {showQR && user?.id && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
              onClick={() => setShowQR(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-card border border-accent/20 rounded-2xl p-8 flex flex-col items-center shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white p-4 rounded-xl">
                  <QRCodeSVG value={JSON.stringify({ id: user?.id, name: user?.name, lastName: user?.lastName })} size={240} level="H" includeMargin />
                </div>
                <p className="text-sm font-semibold text-foreground mt-4">{user?.name} {user?.lastName}</p>
                <p className="text-xs text-foreground/40 mt-1">Montrez à l&apos;accueil pour pointer</p>
                <button
                  onClick={() => setShowQR(false)}
                  className="mt-4 px-6 py-2 rounded-lg bg-accent/10 text-accent text-sm font-semibold hover:bg-accent/20 transition-colors"
                >
                  Fermer
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 items-start">
          {plans.map((plan) => {
            const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
            const isLoading = loadingPlan === plan.name;

            return (
              <div
                key={plan.name}
                className={`rounded-2xl p-8 transition-all duration-300 relative ${
                  plan.featured
                    ? 'border-2 border-accent bg-accent/[0.04] shadow-xl shadow-accent/15'
                    : 'border border-foreground/10 bg-card hover:border-foreground/20'
                }`}
              >
                {plan.featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-accent to-emerald-400 text-accent-foreground px-4 py-1 rounded-full text-sm font-bold shadow-lg shadow-accent/25">
                    LE PLUS POPULAIRE
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                  <p className="text-foreground/60 text-sm">{plan.description}</p>
                </div>

                <div className="mb-6 pt-6 border-t border-foreground/10">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-foreground">{da(price)}</span>
                    <span className="text-foreground/60 ml-2">DA/mois</span>
                  </div>
                  {plan.yearlyPrice > 0 && (
                    <p className="text-sm text-foreground/60 mt-2">
                      {isYearly
                        ? `${da(price * 12)} DA facturés annuellement`
                        : `ou ${da(plan.yearlyPrice * 12)} DA/an (économisez 20%)`
                      }
                    </p>
                  )}
                </div>

                <div className="mb-8">
                  {plan.name === 'Free' ? (
                    <Button
                      onClick={() => window.location.href = '/auth'}
                      className="w-full border border-accent/50 text-accent hover:bg-accent/10"
                      variant="outline"
                    >
                      {plan.cta}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handlePayment(plan.name)}
                      disabled={isLoading}
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-md shadow-accent/20"
                    >
                      {isLoading ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Paiement...</>
                      ) : (
                        `S'abonner ${da(price)} DA/mois`
                      )}
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {plan.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check className="w-5 h-5 flex-shrink-0 mt-0.5 text-accent/60" />
                      <span className="text-foreground/70 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Questions fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                question: 'Puis-je annuler mon abonnement à tout moment ?',
                answer: 'Oui, vous pouvez annuler à tout moment sans pénalité. Votre accès reste actif jusqu\'à la fin de la période facturée.',
              },
              {
                question: 'Comment payer mon abonnement ?',
                answer: 'Le paiement se fait directement via Chargily par CIB ou EDAHABIA. Une fois le paiement confirmé, votre abonnement est activé immédiatement.',
              },
              {
                question: 'Quels moyens de paiement acceptez-vous ?',
                answer: 'Nous acceptons les paiements via Chargily : CIB (cartes interbancaires) et EDAHABIA. Paiement 100% sécurisé.',
              },
              {
                question: 'Puis-je changer de formule ?',
                answer: 'Oui, vous pouvez changer de formule à tout moment. Les changements prennent effet au prochain cycle de facturation.',
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
          <h2 className="text-3xl font-bold text-foreground mb-4">Commencez votre transformation dès aujourd&apos;hui</h2>
          <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
            Rejoignez des milliers d&apos;utilisateurs qui transforment leur fitness avec Kimo&apos;s Gym
          </p>
          <Button
            onClick={() => {
              const premium = plans.find(p => p.name === 'Premium');
              if (premium) handlePayment(premium.name);
            }}
            className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 text-lg"
          >
            S&apos;abonner maintenant
          </Button>
        </div>
      </div>
    </div>
  );
}
