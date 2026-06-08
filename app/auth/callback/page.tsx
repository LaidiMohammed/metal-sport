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
        // Ensure profile exists
        await fetch('/api/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: session.user.id,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || session.user.email,
          }),
        });

        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).maybeSingle();
        if (data) {
          setUser({
            id: data.id,
            name: data.name,
            lastName: data.last_name || '',
            email: data.email,
            membership: data.membership,
            role: data.role,
            isActive: data.is_active,
            isSpam: data.is_spam,
            height: data.height,
            weight: data.weight,
            age: data.age,
            sex: data.sex,
            joinDate: data.join_date,
            revenue: data.revenue,
            sessionsLeft: data.sessions_left,
            expirationDate: data.expiration_date,
            avatar: data.avatar,
          });
        }
        router.push(data?.role === 'admin' ? '/admin' : '/');
      }
    });
  }, [router, setUser]);

  return <div className="min-h-screen flex items-center justify-center text-foreground/60">Signing in...</div>;
}
