'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { AnimatedLogo } from '@/components/animated-logo';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl">
            <AnimatedLogo />
            <span className="text-foreground">Kimo&apos;s Gym</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/exercises" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
              Exercises
            </Link>
            <Link href="/workouts" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
              Workouts
            </Link>
            <Link href="/shop" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
              Shop
            </Link>
            <Link href="/coach" className="text-sm font-medium text-foreground/70 hover:text-foreground transition">
              AI Coach
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90">
                Join Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link href="/exercises" className="block px-2 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-card rounded">
              Exercises
            </Link>
            <Link href="/workouts" className="block px-2 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-card rounded">
              Workouts
            </Link>
            <Link href="/shop" className="block px-2 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-card rounded">
              Shop
            </Link>
            <Link href="/coach" className="block px-2 py-2 text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-card rounded">
              AI Coach
            </Link>
            <div className="pt-2 space-y-2 border-t border-border">
              <Link href="/auth" className="block">
                <Button variant="ghost" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth" className="block">
                <Button size="sm" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Join Now
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
