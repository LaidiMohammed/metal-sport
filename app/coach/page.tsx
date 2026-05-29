'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useState } from 'react';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function CoachPage() {
  useAuthProtected();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hey there! I\'m your AI fitness coach. I can help you with workout plans, form corrections, nutrition advice, and personalized training. What would you like to work on today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: String(Date.now()),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        'Great question! For squats, keep your chest up and knees tracking over your toes. Would you like form tips for other exercises?',
        'I recommend a push-pull-legs split for optimal muscle growth. This allows for adequate recovery while hitting each muscle group twice per week.',
        'Protein intake should be around 0.8-1g per pound of body weight. Make sure to spread it throughout the day for better muscle protein synthesis.',
        'Recovery is just as important as training! Aim for 7-9 hours of sleep and active recovery days with light cardio or stretching.',
      ];

      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      const assistantMessage: Message = {
        id: String(Date.now() + 1),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">AI Fitness Coach</h1>
          <p className="text-foreground/60">24/7 personalized fitness guidance and training support</p>
        </div>

        {/* Chat Container */}
        <div className="flex flex-col h-[600px] border border-foreground/10 rounded-lg bg-card overflow-hidden">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-accent" />
                  </div>
                )}

                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-accent text-accent-foreground rounded-br-none'
                      : 'bg-foreground/10 text-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-accent-foreground/70' : 'text-foreground/60'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-foreground/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm">👤</span>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-accent" />
                </div>
                <div className="bg-foreground/10 text-foreground px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="border-t border-foreground/10 p-4 flex gap-2">
            <Input
              placeholder="Ask about workouts, form, nutrition..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="bg-foreground/5 border-foreground/10 text-foreground placeholder:text-foreground/40"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <p className="text-sm text-foreground/60 mb-4">Quick tips to ask about:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              'What\'s the best workout split for my goals?',
              'How do I improve my bench press form?',
              'What should I eat before and after workouts?',
              'How many days per week should I train?',
            ].map((tip, index) => (
              <Button
                key={index}
                variant="outline"
                className="text-left border-foreground/10 text-foreground hover:border-accent/50 hover:bg-foreground/5 justify-start"
                onClick={() => {
                  setInput(tip);
                }}
              >
                {tip}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
