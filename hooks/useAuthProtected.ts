'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';

export function useAuthProtected() {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const isAuthenticated = useStore((state) => state.isAuthenticated);

  useEffect(() => {
    // Check if user is authenticated, redirect to auth if not
    if (!isAuthenticated && !user) {
      router.push('/auth');
    }
  }, [isAuthenticated, user, router]);

  return { user, isAuthenticated };
}
