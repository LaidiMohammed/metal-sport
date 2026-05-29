'use client';

import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { motion } from 'framer-motion';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { Shield, Eye, Lock, AlertCircle } from 'lucide-react';

export default function PrivacyPage() {
  const { user } = useAuthProtected();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 20 },
    },
  };

  const sections = [
    {
      icon: Eye,
      title: 'Privacy Policy',
      description: 'How we collect and use your data',
      content: 'We collect data to improve your fitness experience. Your data is encrypted and never shared with third parties without your consent.',
    },
    {
      icon: Lock,
      title: 'Data Security',
      description: 'How we protect your information',
      content: 'We use industry-standard encryption and security measures to protect your personal data. All sensitive information is stored securely.',
    },
    {
      icon: Shield,
      title: 'Your Rights',
      description: 'Data access and deletion rights',
      content: 'You have the right to access, modify, or delete your personal data at any time. Contact our support team for assistance.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 rounded-lg bg-accent/20">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground">Privacy & Security</h1>
          </div>
          <p className="text-foreground/60">Your privacy is important to us</p>
        </motion.div>

        {/* Alert */}
        <motion.div
          className="p-4 rounded-lg bg-accent/10 border border-accent/30 flex gap-3 mb-8"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AlertCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-foreground">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        {/* Sections */}
        <motion.div
          className="grid gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={idx}
                className="p-6 rounded-xl border border-accent/20 bg-card hover:border-accent/40 transition-colors"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -4 }}
              >
                <div className="flex gap-4 mb-4">
                  <motion.div
                    className="p-3 rounded-lg bg-accent/20"
                    whileHover={{ rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 400 }}
                  >
                    <Icon className="w-6 h-6 text-accent" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                    <p className="text-sm text-foreground/60">{section.description}</p>
                  </div>
                </div>
                <p className="text-foreground/80 leading-relaxed">{section.content}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* FAQ */}
        <motion.div
          className="mt-12 pt-8 border-t border-accent/20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>

          <div className="space-y-4">
            {[
              {
                q: 'How long do you keep my data?',
                a: 'We keep your data for as long as your account is active. You can request deletion at any time.',
              },
              {
                q: 'Who has access to my workout data?',
                a: 'Only you have access to your private workout data. You can choose to share achievements with the community.',
              },
              {
                q: 'Do you sell my data?',
                a: 'We never sell your personal data. We may anonymize data for research purposes with your consent.',
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                className="p-4 rounded-lg border border-accent/20 bg-card/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 + idx * 0.1 }}
                whileHover={{ borderColor: 'var(--accent)' }}
              >
                <p className="font-semibold text-foreground mb-2">{faq.q}</p>
                <p className="text-foreground/70">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact */}
        <motion.div
          className="mt-12 p-6 rounded-xl bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <p className="text-foreground mb-3">Have questions about your privacy?</p>
          <motion.a
            href="mailto:privacy@kimogym.com"
            className="inline-block px-6 py-2 bg-accent text-accent-foreground font-medium rounded-lg hover:shadow-lg hover:shadow-accent/40 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Our Privacy Team
          </motion.a>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
