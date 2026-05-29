'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';

const products = [
  { id: '1', name: 'Premium Dumbbell Set', price: 299, category: 'Equipment', emoji: '🏋️' },
  { id: '2', name: 'Workout Mat Pro', price: 89, category: 'Mats', emoji: '🧘' },
  { id: '3', name: 'Resistance Bands Kit', price: 49, category: 'Bands', emoji: '🎯' },
  { id: '4', name: 'Gym Towel Collection', price: 34, category: 'Apparel', emoji: '🏳️' },
  { id: '5', name: 'Water Bottle (1L)', price: 29, category: 'Accessories', emoji: '💧' },
  { id: '6', name: 'Training Gloves Pro', price: 59, category: 'Apparel', emoji: '🧤' },
  { id: '7', name: 'Foam Roller Elite', price: 79, category: 'Recovery', emoji: '🔄' },
  { id: '8', name: 'Protein Shaker', price: 24, category: 'Accessories', emoji: '🥤' },
];

const categories = ['All', 'Equipment', 'Apparel', 'Accessories', 'Recovery', 'Mats', 'Bands'];

export default function ShopPage() {
  useAuthProtected();
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState<{ id: string; name: string; price: number }[]>([]);

  const filteredProducts = category === 'All' 
    ? products 
    : products.filter((p) => p.category === category);

  const handleAddToCart = (product: typeof products[0]) => {
    setCart([...cart, { id: product.id, name: product.name, price: product.price }]);
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Shop</h1>
            <p className="text-foreground/60">Premium fitness equipment and apparel</p>
          </div>
          <div className="flex items-center gap-2 bg-card px-4 py-2 rounded-lg border border-foreground/10">
            <ShoppingCart className="w-5 h-5 text-accent" />
            <span className="font-bold text-foreground">{cart.length}</span>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-12">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={category === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCategory(cat)}
              className={category === cat ? 'bg-accent text-accent-foreground' : 'border-foreground/20 text-foreground'}
            >
              {cat}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="border border-foreground/10 rounded-lg p-4 bg-card hover:border-accent/50 transition"
            >
              <div className="text-5xl mb-4 text-center">{product.emoji}</div>
              <h3 className="font-bold text-foreground mb-2">{product.name}</h3>
              <p className="text-sm text-foreground/60 mb-4">{product.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-accent">${product.price}</span>
                <Button
                  size="sm"
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => handleAddToCart(product)}
                >
                  Add
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="border-t border-foreground/10 pt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Cart Summary</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-4 bg-card rounded-lg border border-foreground/10">
                      <span className="text-foreground">{item.name}</span>
                      <span className="text-accent font-bold">${item.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-card border border-accent/20 rounded-lg p-6 space-y-4 h-fit">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Total Items</p>
                  <p className="text-2xl font-bold text-foreground">{cart.length}</p>
                </div>
                <div className="border-t border-foreground/10 pt-4">
                  <p className="text-sm text-foreground/60 mb-1">Order Total</p>
                  <p className="text-3xl font-bold text-accent">${totalPrice}</p>
                </div>
                <Link href="/checkout" className="block">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
