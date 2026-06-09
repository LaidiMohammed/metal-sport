'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useStore } from '@/lib/store';

export default function AuthCallback() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
          }),
        });

        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const json = await res.json();
        if (json.profile) setUser(json.profile);
        router.push(json.profile?.role === 'admin' ? '/admin' : '/');
      }
    });
  }, [router, setUser]);

  return <div className="min-h-screen flex items-center justify-center text-foreground/60">Signing in...</div>;
}
