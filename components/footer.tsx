'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4">
              <Image src="/images/logo.jpg" alt="Metal Sport" width={28} height={28} className="w-7 h-7 rounded-full bg-accent object-cover" />
              <span className="text-foreground">Metal Sport Gym</span>
            </Link>
            <p className="text-sm text-foreground/60">
              Advanced fitness platform with 3D visualization and AI coaching.
            </p>
            <div className="mt-4 w-16 h-16 opacity-40">
              <Image
                src="/images/mascot (2).png"
                alt="Mascot"
                width={64}
                height={64}
                className="w-full h-auto"
                style={{ animation: 'mascotFloat 7s ease-in-out infinite' }}
              />
            </div>
            <style>{`
              @keyframes mascotFloat {
                0%,100% { transform: translateY(0) rotate(-.5deg); }
                50%     { transform: translateY(-8px) rotate(.5deg); }
              }
            `}</style>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/exercises" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Exercises
                </Link>
              </li>
              <li>
                <Link href="/workouts" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Workouts
                </Link>
              </li>
              <li>
                <Link href="/coach" className="text-sm text-foreground/60 hover:text-foreground transition">
                  AI Coach
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="text-sm text-foreground/60 hover:text-foreground transition">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Equipment
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Apparel
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                  New Arrivals
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-foreground mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                  Cookies
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm text-foreground/60 hover:text-foreground transition">
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-foreground/10 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-foreground/60">
            &copy; 2024 Kimo&apos;s Gym. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              aria-label="GitHub"
              className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-accent hover:text-accent-foreground transition"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-accent hover:text-accent-foreground transition"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-accent hover:text-accent-foreground transition"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Email"
              className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-accent hover:text-accent-foreground transition"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
