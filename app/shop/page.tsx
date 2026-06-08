'use client';

import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { useAuthProtected } from '@/hooks/useAuthProtected';
import { useState, useRef } from 'react';
import { ShoppingCart, FlaskRound, Dumbbell, Crown, Shirt, Backpack, Plus, Minus, Trash2, X, ImageOff } from 'lucide-react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useStore, Product } from '@/lib/store';

const CATEGORIES: { key: Product['category'] | 'all'; label: string; icon: typeof FlaskRound }[] = [
  { key: 'all', label: 'Tout', icon: ShoppingCart },
  { key: 'complements', label: 'Compléments', icon: FlaskRound },
  { key: 'materiel', label: 'Matériel', icon: Dumbbell },
  { key: 'abonnement', label: 'Abonnements', icon: Crown },
  { key: 'vetements', label: 'Vêtements', icon: Shirt },
  { key: 'accessoires', label: 'Accessoires', icon: Backpack },
];

export default function ShopPage() {
  useAuthProtected();
  const products = useStore((s) => s.products);
  const [category, setCategory] = useState<Product['category'] | 'all'>('all');
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const filtered = category === 'all' ? products : products.filter((p) => p.category === category);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.product.id === product.id);
      if (existing) {
        return prev.map((c) =>
          c.product.id === product.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((c) => c.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart((prev) =>
      prev.map((c) => {
        if (c.product.id !== productId) return c;
        const newQty = c.quantity + delta;
        return newQty <= 0 ? null : { ...c, quantity: newQty };
      }).filter(Boolean) as typeof prev
    );
  };

  const totalPrice = cart.reduce((sum, c) => sum + c.product.price * c.quantity, 0);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'start -0.3'] });
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 0.7]);
  const titleOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);

  return (
    <div className="min-h-screen bg-background pt-14">
      <Navbar />

      {/* Hero */}
      <div ref={heroRef} className="relative overflow-hidden" style={{ padding: '64px 0 56px' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,216,0.15) 0%, rgba(0,180,216,0.06) 40%, rgba(0,180,216,0.02) 70%, transparent 100%)' }} />
        <div className="absolute top-[-80px] right-[10%] w-[500px] h-[500px] rounded-full hidden md:block" style={{ background: 'radial-gradient(circle, rgba(0,212,170,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-0 left-[10%] w-[300px] h-[300px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,180,216,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 text-accent mb-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00d4aa, #00b896)' }}>
                  <ShoppingCart className="w-4 h-4 text-black" />
                </div>
                <span className="text-sm font-semibold tracking-widest uppercase">Boutique</span>
              </div>
              <motion.div style={{ scale: titleScale, opacity: titleOpacity, transformOrigin: 'left' }}>
                <h1 className="text-4xl font-bold text-foreground mb-2">Shop</h1>
              </motion.div>
              <p className="text-foreground/60">Équipement, compléments et abonnements</p>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur px-4 py-2 rounded-lg border border-border">
              <ShoppingCart className="w-5 h-5 text-accent" />
              <span className="font-bold text-foreground">{cart.reduce((s, c) => s + c.quantity, 0)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = category === cat.key;
            return (
              <Button
                key={cat.key}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCategory(cat.key)}
                className={isActive ? 'bg-accent text-accent-foreground' : 'border-foreground/20 text-foreground'}
              >
                <Icon className="w-4 h-4 mr-1.5" />
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filtered.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-foreground/10 rounded-xl overflow-hidden bg-card hover:border-accent/40 hover:shadow-lg hover:shadow-accent/5 transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedProduct(product)}
            >
              <div className="relative h-48 bg-foreground/[0.03] overflow-hidden">
                {product.images[0] && !imgErrors[product.id] ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={() => setImgErrors((p) => ({ ...p, [product.id]: true }))}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-foreground/20">
                    <ImageOff className="w-12 h-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    product.stock > 10 ? 'bg-green-500/20 text-green-400' :
                    product.stock > 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {product.stock > 10 ? 'En stock' : product.stock > 0 ? 'Stock limité' : 'Rupture'}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wider">
                    {CATEGORIES.find(c => c.key === product.category)?.label}
                  </span>
                </div>
                <h3 className="font-semibold text-foreground text-sm mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-foreground/50 line-clamp-2 mb-3">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-accent">{product.price.toLocaleString()} DA</span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-accent/30 text-accent hover:bg-accent hover:text-accent-foreground text-xs px-3"
                    onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Ajouter
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <div className="border-t border-foreground/10 pt-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">Panier</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-foreground/10">
                    <div className="w-14 h-14 rounded-lg bg-foreground/[0.05] overflow-hidden flex-shrink-0">
                      {item.product.images[0] && !imgErrors[item.product.id + 'cart'] ? (
                        <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover"
                          onError={() => setImgErrors((p) => ({ ...p, [item.product.id + 'cart']: true }))} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-foreground/20"><ImageOff className="w-6 h-6" /></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{item.product.name}</p>
                      <p className="text-xs text-foreground/50">{item.product.price.toLocaleString()} DA</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="w-7 h-7 rounded-lg border border-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-foreground/5"><Minus className="w-3 h-3" /></button>
                      <span className="w-8 text-center text-sm font-medium text-foreground">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="w-7 h-7 rounded-lg border border-foreground/10 flex items-center justify-center text-foreground/60 hover:bg-foreground/5"><Plus className="w-3 h-3" /></button>
                    </div>
                    <span className="text-sm font-bold text-accent w-20 text-right">{(item.product.price * item.quantity).toLocaleString()} DA</span>
                    <button onClick={() => removeFromCart(item.product.id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-foreground/30 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-accent/20 rounded-xl p-6 space-y-4 h-fit">
                <div>
                  <p className="text-sm text-foreground/60 mb-1">Total articles</p>
                  <p className="text-2xl font-bold text-foreground">{cart.reduce((s, c) => s + c.quantity, 0)}</p>
                </div>
                <div className="border-t border-foreground/10 pt-4">
                  <p className="text-sm text-foreground/60 mb-1">Total commande</p>
                  <p className="text-3xl font-bold text-accent">{totalPrice.toLocaleString()} DA</p>
                </div>
                <Link href="/checkout">
                  <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">Procéder au paiement</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-card border border-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Images */}
              <div className="relative">
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {selectedProduct.images.map((img, i) => (
                    <div key={i} className="w-full h-48 rounded-xl overflow-hidden bg-foreground/[0.03] flex-shrink-0">
                      <img src={img} alt={selectedProduct.name} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase tracking-wider">
                    {CATEGORIES.find(c => c.key === selectedProduct.category)?.label}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-foreground">{selectedProduct.name}</h2>
                <p className="text-sm text-foreground/60 leading-relaxed">{selectedProduct.description}</p>

                {/* Specs */}
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Caractéristiques</h4>
                  <ul className="space-y-1">
                    {selectedProduct.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-foreground/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
                        {spec}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stock + Price */}
                <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
                  <div>
                    <span className={`text-xs font-semibold ${
                      selectedProduct.stock > 10 ? 'text-green-400' :
                      selectedProduct.stock > 0 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {selectedProduct.stock > 10 ? 'En stock' : selectedProduct.stock > 0 ? 'Stock limité' : 'Rupture de stock'}
                    </span>
                    <p className="text-3xl font-bold text-accent mt-1">{selectedProduct.price.toLocaleString()} DA</p>
                  </div>
                  <Button
                    className="bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  >
                    <Plus className="w-4 h-4 mr-1.5" /> Ajouter au panier
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
