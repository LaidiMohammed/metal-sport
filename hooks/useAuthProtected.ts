'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';

export function useAuthProtected() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    const checkAuth = async () => {
      if (isAuthenticated && user) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const res = await fetch('/api/profile', {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        if (res.ok) {
          const json = await res.json();
          if (json.profile) {
            setUser(json.profile);
            return;
          }
        }
      }

      router.push('/auth');
    };

    checkAuth();
  }, [isAuthenticated, user, router, setUser]);

  return { user, isAuthenticated };
}
