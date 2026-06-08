'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useState, useRef } from 'react';
import { Loader } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function CheckoutPage() {
  useAuthProtected();
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'confirmation'>('cart');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const cartItems = [
    { id: '1', name: 'Premium Dumbbell Set', price: 299, quantity: 1 },
    { id: '2', name: 'Workout Mat Pro', price: 89, quantity: 1 },
    { id: '3', name: 'Resistance Bands Kit', price: 49, quantity: 2 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;
  const shipping = 15;
  const total = subtotal + tax + shipping;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      if (step === 'shipping') {
        setStep('payment');
      } else if (step === 'payment') {
        setStep('confirmation');
      }
      setLoading(false);
    }, 1500);
  };

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'start -0.3'],
  });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="min-h-screen bg-background pt-14">
      <Navbar />

      {/* Hero banner */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '64px 0 56px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <div className="absolute top-[-80px] right-[10%] w-[500px] h-[500px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
            <h1 className="text-4xl font-bold text-foreground mb-2">Checkout</h1>
          </motion.div>
          <p className="text-foreground/60">Complete your purchase securely</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-12 overflow-x-auto">
          {['cart', 'shipping', 'payment', 'confirmation'].map((s, index) => (
            <div key={s} className="flex items-center flex-1">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm ${
                (index < ['cart', 'shipping', 'payment', 'confirmation'].indexOf(step) || s === step)
                  ? 'bg-accent text-accent-foreground'
                  : 'bg-foreground/10 text-foreground/60'
              }`}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`flex-1 h-1 mx-2 ${
                  index < ['cart', 'shipping', 'payment', 'confirmation'].indexOf(step)
                    ? 'bg-accent'
                    : 'bg-foreground/10'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {step === 'cart' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Order Summary</h2>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-4 border border-foreground/10 rounded-lg bg-card">
                    <div>
                      <h3 className="font-bold text-foreground">{item.name}</h3>
                      <p className="text-sm text-foreground/60">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-accent">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
                <Button
                  onClick={() => setStep('shipping')}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Continue to Shipping
                </Button>
              </div>
            )}

            {step === 'shipping' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Shipping Address</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="bg-foreground/5 border-foreground/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">First Name</label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="bg-foreground/5 border-foreground/10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Last Name</label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="bg-foreground/5 border-foreground/10"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Address</label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="bg-foreground/5 border-foreground/10"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">City</label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="bg-foreground/5 border-foreground/10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">State</label>
                      <Input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                        className="bg-foreground/5 border-foreground/10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">ZIP</label>
                      <Input
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="bg-foreground/5 border-foreground/10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep('cart')}
                    variant="outline"
                    className="flex-1 border-foreground/20 text-foreground hover:bg-foreground/5"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {loading ? 'Processing...' : 'Continue to Payment'}
                  </Button>
                </div>
              </form>
            )}

            {step === 'payment' && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground">Payment Method</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground block mb-2">Card Number</label>
                    <Input
                      name="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="bg-foreground/5 border-foreground/10"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">Expiry Date</label>
                      <Input
                        name="expiryDate"
                        placeholder="MM/YY"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        required
                        className="bg-foreground/5 border-foreground/10"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">CVV</label>
                      <Input
                        name="cvv"
                        placeholder="123"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        required
                        className="bg-foreground/5 border-foreground/10"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    onClick={() => setStep('shipping')}
                    variant="outline"
                    className="flex-1 border-foreground/20 text-foreground hover:bg-foreground/5"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    {loading ? <Loader className="w-4 h-4 animate-spin" /> : `Complete Purchase - $${total.toFixed(2)}`}
                  </Button>
                </div>
              </form>
            )}

            {step === 'confirmation' && (
              <div className="space-y-6 text-center">
                <div className="p-12 rounded-lg bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
                  <div className="text-5xl mb-4">✓</div>
                  <h2 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h2>
                  <p className="text-foreground/60">Thank you for your purchase</p>
                </div>
                <div className="space-y-2 text-left bg-card border border-foreground/10 p-6 rounded-lg">
                  <p className="text-foreground/60">Order Number: <span className="font-bold text-foreground">#KG-2024-001</span></p>
                  <p className="text-foreground/60">Total: <span className="font-bold text-accent text-lg">${total.toFixed(2)}</span></p>
                  <p className="text-foreground/60">Estimated Delivery: January 22, 2024</p>
                </div>
                <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  View Order
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-foreground/10 rounded-lg p-6 bg-card sticky top-24 h-fit">
              <h3 className="text-xl font-bold text-foreground mb-6">Order Summary</h3>
              <div className="space-y-3 mb-6 border-b border-foreground/10 pb-6">
                <div className="flex justify-between text-foreground/60">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/60">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground/60">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-bold text-foreground">Total</span>
                <span className="text-2xl font-bold text-accent">${total.toFixed(2)}</span>
              </div>
              <div className="space-y-2 text-sm text-foreground/60">
                <p>✓ Free returns within 30 days</p>
                <p>✓ Secure checkout</p>
                <p>✓ 100% money-back guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
