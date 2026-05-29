'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { Hero3D } from '@/components/sections/Hero3D';
import { MachineGrid } from '@/components/sections/MachineGrid';

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <main className="dashboard-main">
        <Navbar />
        <Hero3D />
        <MachineGrid />
        <Footer />
      </main>
    </ProtectedRoute>
  );
}
