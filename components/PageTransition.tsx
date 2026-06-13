'use client';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return <div style={{ animation: 'pageFadeIn 0.12s ease' }}>{children}</div>;
}
