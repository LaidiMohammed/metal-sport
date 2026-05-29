'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Access to exercise library',
      'Basic workout tracking',
      'Limited 3D visualizations',
      'Community access',
      'Email support',
    ],
    cta: 'Get Started',
    featured: false,
  },
  {
    name: 'Premium',
    price: 9.99,
    description: 'Most popular choice',
    features: [
      'Everything in Free',
      'Advanced workout planning',
      'Full 3D exercise models',
      '24/7 AI Coach access',
      'Personalized recommendations',
      'Priority support',
      'Ad-free experience',
      'Offline workouts',
    ],
    cta: 'Start Free Trial',
    featured: true,
  },
  {
    name: 'Elite',
    price: 19.99,
    description: 'For serious athletes',
    features: [
      'Everything in Premium',
      '1-on-1 coaching sessions',
      'Nutrition planning',
      'Advanced analytics',
      'Custom workout programs',
      'Exclusive content',
      'Early feature access',
      'VIP community',
    ],
    cta: 'Upgrade Now',
    featured: false,
  },
];

export default function MembershipPage() {
  useAuthProtected();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-accent font-semibold uppercase tracking-wider">Simple, Transparent Pricing</p>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
            Choose Your Fitness Plan
          </h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto text-balance">
            Flexible membership plans designed for every fitness level and budget
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center items-center gap-4 mb-16">
          <span className="text-foreground">Monthly</span>
          <div className="w-12 h-7 rounded-full bg-accent/20 border border-accent p-1 flex items-center cursor-pointer">
            <div className="w-5 h-5 rounded-full bg-accent ml-auto"></div>
          </div>
          <span className="text-foreground">Yearly <span className="text-accent font-bold">Save 20%</span></span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-lg p-8 transition ${
                plan.featured
                  ? 'border-2 border-accent bg-gradient-to-br from-accent/10 to-accent/5 relative scale-105 md:scale-100 md:translate-y-0'
                  : 'border border-foreground/10 bg-card'
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground px-4 py-1 rounded-full text-sm font-bold">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-foreground/60 text-sm">{plan.description}</p>
              </div>

              <div className="mb-6 pt-6 border-t border-foreground/10">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">${plan.price}</span>
                  <span className="text-foreground/60 ml-2">/month</span>
                </div>
                {plan.price > 0 && (
                  <p className="text-sm text-foreground/60 mt-2">or ${(plan.price * 9.59).toFixed(2)}/year</p>
                )}
              </div>

              <Link href="/auth" className="block mb-8">
                <Button
                  className={`w-full ${
                    plan.featured
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90'
                      : 'border border-accent/50 text-accent hover:bg-accent/10'
                  }`}
                  variant={plan.featured ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/70 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                question: 'Can I cancel my subscription anytime?',
                answer: 'Yes, you can cancel at any time without any penalties. Your access will continue until the end of your billing period.',
              },
              {
                question: 'Is there a free trial?',
                answer: 'Premium and Elite members get a 7-day free trial. No credit card required to start your trial.',
              },
              {
                question: 'What payment methods do you accept?',
                answer: 'We accept all major credit cards, PayPal, and Apple Pay. Your payment information is securely encrypted.',
              },
              {
                question: 'Can I upgrade or downgrade my plan?',
                answer: 'Yes, you can change your plan anytime. Changes take effect on your next billing cycle.',
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="border border-foreground/10 rounded-lg p-6 bg-card hover:border-accent/50 transition"
              >
                <h3 className="font-bold text-foreground mb-2">{faq.question}</h3>
                <p className="text-foreground/60 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 rounded-lg bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20 p-12 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Start Your Fitness Journey Today</h2>
          <p className="text-foreground/60 mb-8 max-w-lg mx-auto">
            Join thousands of users transforming their fitness with Kimo&apos;s Gym
          </p>
          <Link href="/auth">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 text-lg">
              Get Started Free
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
