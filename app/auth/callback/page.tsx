'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export default function AuthCallback() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    const init = async () => {
      const { supabase } = await import('@/lib/supabase');
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          try {
            await fetch('/api/auth/callback', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: session.user.id,
                email: session.user.email,
                name: session.user.user_metadata?.full_name || session.user.email,
              }),
            });
          } catch {}

          try {
            const res = await fetch('/api/profile', {
              headers: { Authorization: `Bearer ${session.access_token}` },
            });
            const json = await res.json();
            if (json.profile) setUser(json.profile);
            router.push(json.profile?.role === 'admin' ? '/admin' : '/');
            return;
          } catch {}
          router.push('/');
        }
      });
    };
    init();
  }, [router, setUser]);

  return <div className="min-h-screen flex items-center justify-center text-foreground/60">Signing in...</div>;
}
