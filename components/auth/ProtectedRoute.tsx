'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const user = useStore((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to auth page
      router.push('/auth');
    } else {
      setIsChecking(false);
    }
  }, [user, router]);

  // Show loading while checking auth
  if (isChecking || !user) {
    return (
      <motion.div
        className="protected-route-loading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading Experience...</p>
        </div>

        <style jsx>{`
          .protected-route-loading {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #000000 0%, #111111 100%);
          }

          .loading-spinner {
            text-align: center;
          }

          .spinner {
            width: 60px;
            height: 60px;
            border: 3px solid rgba(220, 38, 38, 0.2);
            border-top-color: #DC2626;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
            margin: 0 auto 20px;
          }

          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }

          p {
            color: #888;
            font-size: 14px;
            margin-top: 10px;
          }
        `}</style>
      </motion.div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;
