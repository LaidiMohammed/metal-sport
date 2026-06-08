'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Send, RefreshCw, Plus, X, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  timestamp: Date;
}

const WELCOME = 'Hey there! I\'m your AI fitness coach. Upload a photo for form/technique analysis, or ask about workouts, nutrition, and training.';

export default function CoachPage() {
  useAuthProtected();
  const user = useStore((s) => s.user);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'start -0.3'],
  });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: WELCOME, timestamp: new Date() },
  ]);

  // Load chat history from Supabase
  useEffect(() => {
    if (!user?.id) return;
    fetch(`/api/coach-messages?userId=${user.id}`)
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (data.length) {
          setMessages(data.map((m: any) => ({
            id: m.id,
            role: m.role,
            content: m.content,
            image: m.image || undefined,
            timestamp: new Date(m.created_at),
          })));
        }
      })
      .catch(() => {});
  }, [user?.id]);

  const saveMessage = async (msg: Message) => {
    if (!user?.id) return;
    try {
      await fetch('/api/coach-messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          role: msg.role,
          content: msg.content,
          image: msg.image,
        }),
      });
    } catch {}
  };
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSelectedImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const promptText = input || (selectedImage ? 'Analyze this image and give me feedback on form, technique, and tips' : '');

    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: promptText,
      image: selectedImage || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    saveMessage(userMessage);
    setInput('');
    setSelectedImage(null);
    setLoading(true);

    try {
      const history = messages.map((m) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      }));

      const apiRes = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptText,
          image: selectedImage,
          history,
        }),
      });

      const data = await apiRes.json();
      const reply: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: data.reply || 'Sorry, I could not process that.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, reply]);
      saveMessage(reply);
    } catch {
      const errMsg: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: 'Sorry, I ran into an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      saveMessage(errMsg);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden pt-14">
      <Navbar />

      {/* Hero banner */}
      <div ref={heroRef} className="relative overflow-hidden flex-shrink-0" style={{ padding: '28px 24px 20px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <motion.div
          className="hidden md:block"
          style={{
            position: 'absolute', top: -60, right: '5%',
            width: 400, height: 400,
            background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)',
            borderRadius: '50%', filter: 'blur(60px)',
          }}
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <div className="absolute bottom-0 left-[5%] w-[250px] h-[250px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="flex items-center justify-between relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #00d4aa, #00b896)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles style={{ width: 14, height: 14, color: '#000' }} />
              </div>
              <span style={{ color: '#00d4aa', fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                AI Coach
              </span>
            </div>
            <motion.h1 style={{ color: '#fff', fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1, scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
              Train Smarter,<br />
              <span style={{ background: 'linear-gradient(90deg, #00d4aa, #22d3ee)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Get Expert Advice
              </span>
            </motion.h1>
          </motion.div>

          <button
            onClick={() => { setMessages([{ id: '1', role: 'assistant', content: WELCOME, timestamp: new Date() }]); setSelectedImage(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-foreground/50 hover:text-foreground hover:bg-foreground/[0.05] transition-colors duration-200 flex-shrink-0 self-start mt-1"
          >
            <RefreshCw className="w-3 h-3" /> New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 pb-2">
        <div className="max-w-3xl mx-auto space-y-3 pt-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
              )}

              <div
                className={`max-w-md px-4 py-2.5 rounded-xl text-sm shadow-sm ${
                  message.role === 'user'
                    ? 'bg-accent text-accent-foreground rounded-br-sm'
                    : 'bg-card text-foreground rounded-bl-sm border border-border/50'
                }`}
              >
                {message.image && (
                  <div className="mb-2 rounded-lg overflow-hidden border border-foreground/10 max-w-[200px]">
                    <img src={message.image} alt="Uploaded" className="w-full h-auto" />
                  </div>
                )}
                <p className="whitespace-pre-wrap">{message.content}</p>
                <p className={`text-[10px] mt-1 opacity-60 ${message.role === 'user' ? 'text-right' : ''}`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>

              {message.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-foreground/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs">👤</span>
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div className="bg-card px-4 py-3 rounded-xl rounded-bl-sm border border-border/50 shadow-sm">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce delay-100" />
                  <div className="w-1.5 h-1.5 rounded-full bg-foreground/60 animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}

          {/* Welcome suggestions */}
          {messages.length === 1 && messages[0].role === 'assistant' && (
            <div className="flex gap-2 pt-1 pl-10">
              {[
                { label: 'Workout plan', icon: '💪', prompt: 'Create a workout plan for ' },
                { label: 'Nutrition tips', icon: '🥗', prompt: 'Give me nutrition tips for ' },
              ].map((s) => (
                <button
                  key={s.label}
                  onClick={() => { setInput(s.prompt); }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-foreground/[0.04] text-foreground/60 hover:text-foreground hover:bg-foreground/[0.08] border border-foreground/[0.06] hover:border-accent/30 transition-all duration-200"
                >
                  <span>{s.icon}</span> {s.label}
                </button>
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-foreground/[0.06] bg-background">
        {selectedImage && (
          <div className="px-4 pt-1.5 flex items-center gap-2">
            <div className="relative w-7 h-7 rounded-lg overflow-hidden border border-foreground/10">
              <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-foreground/60">Image attached</span>
            <button
              onClick={() => setSelectedImage(null)}
              className="ml-auto p-1 rounded-md hover:bg-foreground/[0.05] text-foreground/50 hover:text-foreground transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <form onSubmit={handleSendMessage} className="flex gap-1.5 items-center px-3 py-1">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loading}
            className="min-h-[44px] min-w-[44px] h-10 w-10 rounded-lg border border-foreground/[0.08] flex items-center justify-center text-foreground/40 hover:text-accent hover:border-accent/40 transition-all duration-200 flex-shrink-0 disabled:opacity-40"
          >
            <Plus className="w-5 h-5" />
          </button>
          <input
            placeholder="Ask about workouts, form, nutrition..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 min-h-[44px] h-10 px-2.5 rounded-lg text-sm bg-foreground/[0.04] border border-foreground/[0.08] text-foreground placeholder:text-foreground/40 focus:outline-none focus:border-accent/40"
          />
          <Button
            type="submit"
            variant="primary"
            size="icon"
            disabled={loading || (!input.trim() && !selectedImage)}
            className="min-h-[44px] min-w-[44px] h-10 w-10 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
