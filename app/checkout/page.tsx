'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { Suspense, useState, useRef, useEffect } from 'react';
import { Loader2, Trash2, CreditCard, ArrowLeft } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useStore } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  useAuthProtected();
  const user = useStore((s) => s.user);
  const storeProducts = useStore((s) => s.products);
  const [loading, setLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('payment');

  const [cartItems, setCartItems] = useState<{ id: string; name: string; price: number; quantity: number }[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('checkout-cart');
    if (stored) {
      setCartItems(JSON.parse(stored));
    } else if (storeProducts.length) {
      const demo = storeProducts.slice(0, 3).map(p => ({ id: p.id, name: p.name, price: p.price, quantity: 1 }));
      setCartItems(demo);
    }
  }, [storeProducts]);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (id: string) => {
    const updated = cartItems.filter(i => i.id !== id);
    setCartItems(updated);
    localStorage.setItem('checkout-cart', JSON.stringify(updated));
  };

  const handlePayWithChargily = async () => {
    if (!user?.id || loading || cartItems.length === 0) return;
    setLoading(true);
    setPaymentError('');
    try {
      const res = await fetch('/api/chargily/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
        }),
      });
      const data = await res.json();
      if (data.url) {
        localStorage.removeItem('checkout-cart');
        window.location.href = data.url;
      } else {
        setPaymentError(data.error || 'Erreur lors de la création du paiement');
      }
    } catch {
      setPaymentError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

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

      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '64px 0 56px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <div className="absolute top-[-80px] right-[10%] w-[500px] h-[500px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
            <h1 className="text-4xl font-bold text-foreground mb-2">Paiement</h1>
          </motion.div>
          <p className="text-foreground/60">Finalisez votre achat en toute sécurité</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {paymentStatus === 'failed' && (
          <div className="mb-4 p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
            <h2 className="text-xl font-bold text-red-400">Paiement échoué</h2>
            <p className="text-foreground/60 mt-1">Le paiement a été annulé. Réessayez.</p>
          </div>
        )}
        {paymentError && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-center">
            <p className="text-red-400 text-sm">{paymentError}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Votre panier</h2>
              <Link href="/shop">
                <Button variant="ghost" size="sm" className="text-accent">
                  <ArrowLeft className="w-4 h-4 mr-1" /> Continuer
                </Button>
              </Link>
            </div>

            {cartItems.length === 0 ? (
              <div className="p-12 text-center border border-foreground/10 rounded-xl bg-card">
                <p className="text-foreground/60 mb-4">Votre panier est vide</p>
                <Link href="/shop">
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    Voir les produits
                  </Button>
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 border border-foreground/10 rounded-lg bg-card">
                  <div>
                    <h3 className="font-bold text-foreground">{item.name}</h3>
                    <p className="text-sm text-foreground/60">Qté: {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-bold text-accent">{(item.price * item.quantity).toLocaleString('fr-DZ')} DA</p>
                    <button onClick={() => removeItem(item.id)} className="text-foreground/40 hover:text-red-400 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="border border-foreground/10 rounded-lg p-6 bg-card sticky top-24 h-fit">
              <h3 className="text-xl font-bold text-foreground mb-6">Récapitulatif</h3>
              <div className="space-y-3 mb-6 border-b border-foreground/10 pb-6">
                <div className="flex justify-between text-foreground/60">
                  <span>Sous-total</span>
                  <span>{total.toLocaleString('fr-DZ')} DA</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-accent">{total.toLocaleString('fr-DZ')} DA</span>
              </div>

              <Button
                onClick={handlePayWithChargily}
                disabled={loading || cartItems.length === 0}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 mb-4"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Traitement...</>
                ) : (
                  <><CreditCard className="w-4 h-4 mr-2" /> Payer avec Chargily</>
                )}
              </Button>

              <div className="flex justify-center gap-3 mb-4">
                <div className="px-3 py-1 rounded bg-foreground/5 text-xs font-medium text-foreground/60">CIB</div>
                <div className="px-3 py-1 rounded bg-foreground/5 text-xs font-medium text-foreground/60">EDAHABIA</div>
              </div>

              <div className="space-y-2 text-sm text-foreground/60">
                <p>✓ Paiement 100% sécurisé</p>
                <p>✓ Retours gratuits sous 30 jours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
