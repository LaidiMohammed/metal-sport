import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-black text-accent/20 mb-4">404</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Page introuvable</h1>
        <p className="text-foreground/50 mb-8">Cette page n'existe pas ou a été déplacée.</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-accent-foreground rounded-xl font-semibold hover:bg-accent/90 transition-all"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
