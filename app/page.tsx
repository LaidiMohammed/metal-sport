'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedMascot } from '@/components/animated-mascot';
import { ScrollReveal } from '@/components/scroll-reveal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div 
            className="flex flex-col gap-6"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="space-y-4">
              <motion.p 
                className="text-sm font-semibold text-accent uppercase tracking-wider"
                variants={itemVariants}
              >
                Premium Fitness Experience
              </motion.p>
              <motion.h1 
                className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance"
                variants={itemVariants}
              >
                Transform Your Body with Kimo
              </motion.h1>
              <motion.p 
                className="text-lg text-foreground/70 text-balance"
                variants={itemVariants}
              >
                Advanced 3D exercise visualization, AI-powered coaching, and premium fitness gear all in one platform.
              </motion.p>
            </div>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 pt-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Link href="/exercises">
                  <Button size="lg" className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 transition-all hover:scale-105">
                    Explore Exercises
                  </Button>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link href="/membership">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-accent/50 text-foreground hover:bg-accent/10 transition-all hover:scale-105">
                    View Membership
                  </Button>
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats with Stagger Animation */}
            <motion.div 
              className="grid grid-cols-3 gap-4 pt-8 border-t border-foreground/10"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {[
                { value: '500+', label: 'Exercises' },
                { value: '50+', label: 'Workouts' },
                { value: '24/7', label: 'AI Coach' },
              ].map((stat, index) => (
                <motion.div key={index} className="space-y-1" variants={itemVariants}>
                  <p className="text-2xl font-bold text-accent">{stat.value}</p>
                  <p className="text-sm text-foreground/60">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right - Mascot */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="flex justify-center"
          >
            <AnimatedMascot size="lg" animated={true} />
          </motion.div>
        </div>
      </section>

      {/* Features Section with Scroll Reveal */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-foreground/10">
        <ScrollReveal direction="up">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">Why Choose Kimo&apos;s Gym</h2>
            <p className="text-lg text-foreground/60">Everything you need for your fitness journey</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: '3D Visualization', 
              description: 'Watch detailed 3D models of every exercise from multiple angles',
              icon: '🎯'
            },
            { 
              title: 'AI Coaching', 
              description: 'Get personalized workout plans and real-time form correction',
              icon: '🤖'
            },
            { 
              title: 'Premium Gear', 
              description: 'Access our curated collection of top-tier fitness equipment',
              icon: '💪'
            },
          ].map((feature, index) => (
            <ScrollReveal key={index} direction={index % 2 === 0 ? 'left' : 'right'} delay={index * 0.1}>
              <motion.div 
                className="p-6 rounded-xl border border-foreground/10 bg-card hover:border-accent/50 transition-all hover:shadow-lg hover:shadow-accent/20"
                whileHover={{ scale: 1.05, translateY: -8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground/60">{feature.description}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-foreground/10">
        <ScrollReveal direction="up">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground">What Our Users Say</h2>
            <p className="text-lg text-foreground/60">Join thousands of satisfied fitness enthusiasts</p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { quote: 'The 3D visualization changed how I perform exercises!', author: 'Alex M.' },
            { quote: 'Best AI coach I\'ve used. Feels like having a personal trainer.', author: 'Sarah K.' },
            { quote: 'Quality equipment and amazing community support!', author: 'John D.' },
          ].map((testimonial, index) => (
            <ScrollReveal key={index} direction="up" delay={index * 0.15}>
              <motion.div 
                className="p-6 rounded-xl border border-accent/20 bg-card/50 backdrop-blur"
                whileHover={{ scale: 1.05 }}
              >
                <p className="text-foreground/80 italic mb-4">&quot;{testimonial.quote}&quot;</p>
                <p className="text-sm text-accent font-semibold">{testimonial.author}</p>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-foreground/10">
        <ScrollReveal direction="up">
          <motion.div
            className="rounded-2xl bg-gradient-to-r from-accent/15 via-accent/10 to-transparent border border-accent/30 p-12 text-center space-y-6 overflow-hidden relative"
            whileHover={{ scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Animated background elements */}
            <motion.div
              className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl"
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">Ready to Transform?</h2>
              <p className="text-foreground/70 max-w-md mx-auto text-lg">
                Join thousands of fitness enthusiasts achieving their goals with Kimo&apos;s Gym
              </p>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link href="/membership">
                  <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg px-8">
                    Start Free Trial Today
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </ScrollReveal>
      </section>

      {/* Floating Particles Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent rounded-full"
            animate={{
              y: [0, -500, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <Footer />
    </div>
  );
}
