'use client';

import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useStore } from '@/lib/store';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function ReceiptPage() {
  return (
    <Suspense>
      <ReceiptContent />
    </Suspense>
  );
}

function ReceiptContent() {
  useAuthProtected();
  const user = useStore((s) => s.user);
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get('checkout_id');
  const [checkout, setCheckout] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!checkoutId) { setLoading(false); return; }
    fetch(`/api/chargily/fetch-checkout?id=${checkoutId}`)
      .then(r => r.json())
      .then(d => { setCheckout(d); setLoading(false); })
      .catch(() => { setError('Erreur chargement reçu'); setLoading(false); });
  }, [checkoutId]);

  const metadata = checkout?.metadata || {};
  const amount = checkout ? checkout.amount / 100 : 0;
  const date = checkout ? new Date(checkout.created_at * 1000).toLocaleDateString('fr-DZ') : '';
  const ref = checkout?.id || checkoutId || '—';

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {!checkoutId ? (
          <div className="text-center py-20">
            <p className="text-foreground/60">Aucune référence de paiement</p>
            <Link href="/"><Button className="mt-4 bg-accent text-accent-foreground">Accueil</Button></Link>
          </div>
        ) : loading ? (
          <div className="text-center py-20 text-foreground/60">Chargement...</div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>
            <Link href="/"><Button className="mt-4 bg-accent text-accent-foreground">Accueil</Button></Link>
          </div>
        ) : (
          <div className="bg-card border border-foreground/10 rounded-2xl p-8 print:p-4 print:shadow-none print:border-none">
            {/* Header */}
            <div className="text-center mb-8 print:mb-4">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <h1 className="text-2xl font-bold text-foreground">Paiement confirmé</h1>
              <p className="text-foreground/60 text-sm">Merci pour votre achat</p>
            </div>

            {/* Receipt Details */}
            <div className="border-t border-b border-foreground/10 py-6 space-y-3 print:py-3">
              <div className="flex justify-between">
                <span className="text-foreground/60">Référence</span>
                <span className="font-mono text-sm text-foreground font-bold">{ref}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Date</span>
                <span className="text-foreground font-medium">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Client</span>
                <span className="text-foreground font-medium">{user?.name} {user?.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/60">Email</span>
                <span className="text-foreground font-medium">{user?.email}</span>
              </div>
              {metadata.type === 'membership' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Type</span>
                    <span className="text-foreground font-medium">Abonnement {metadata.plan}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Facturation</span>
                    <span className="text-foreground font-medium">{metadata.billing === 'annuel' ? 'Annuelle' : 'Mensuelle'}</span>
                  </div>
                </>
              )}
              {metadata.type === 'order' && (
                <div className="flex justify-between">
                  <span className="text-foreground/60">Type</span>
                  <span className="text-foreground font-medium">Achat boutique</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-foreground/10">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-accent">{amount.toLocaleString('fr-DZ')} DA</span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8 space-y-2 text-sm text-foreground/40 print:hidden">
              <p>Kimo&apos;s Gym - Alger</p>
              <p>Ce reçu fait office de justificatif de paiement</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-8 print:hidden">
              <Button onClick={handlePrint} className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">
                <Printer className="w-4 h-4 mr-2" /> Imprimer / PDF
              </Button>
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full border-accent/50 text-accent">
                  Accueil
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
