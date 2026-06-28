'use client';

import Link from 'next/link';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-red-500/20 mb-4">!</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Erreur inattendue</h1>
        <p className="text-foreground/50 mb-8">Un problème est survenu. Réessaie ou reviens plus tard.</p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-foreground/10 text-foreground rounded-xl font-semibold hover:bg-foreground/5 transition-all"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
