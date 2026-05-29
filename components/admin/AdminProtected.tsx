'use client';

import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function AdminProtected({ children }: { children: React.ReactNode }) {
  const user = useStore((state) => state.user);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    if (user.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setIsLoading(false);
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#111111] to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-red-600/20 border-t-red-600 rounded-full"
        />
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return null;
  }

  return <>{children}</>;
}
