
import React, { useState, useEffect, useMemo } from 'react';
import { Product, CartItem, Category } from './types';
import { PRODUCTS } from './constants';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';
import HealthTips from './components/HealthTips';
import PerformanceCoach from './components/PerformanceCoach';
import MacroCalculator from './components/MacroCalculator';

const SPONSORS = [
  "IRON TITAN", "BIO-CORE LABS", "OLYMPIA GEAR", "TITAN GRIP", 
  "ZENITH NUTRITION", "VELOCITY KINETICS", "APEX TRAINING", "QUANTUM GAINS"
];

const TESTIMONIALS = [
  { name: "SGT. R. MILLER", rank: "ELITE", text: "The Nitro-Whey Isolate is the only thing that gets me through a double session. Purity is 10/10.", img: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" },
  { name: "JESSICA VANE", rank: "COMMANDER", text: "Apex Gear changed my squat sessions. The lifting belt is rock solid. No compromises.", img: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=200" },
  { name: "MARCUS THORNE", rank: "PRO", text: "Creatine monohydrate here is the cleanest I've ever tested. Gains are measurable and real.", img: "https://images.unsplash.com/photo-1574680096145-d05b474e2158?auto=format&fit=crop&q=80&w=200" }
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [filter, setFilter] = useState<Category | 'All'>('All');
  const [sortBy, setSortBy] = useState<'default' | 'price-low' | 'price-high' | 'rating'>('default');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [cartAnimate, setCartAnimate] = useState(false);
  const [emailInput, setEmailInput] = useState('');

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setCartAnimate(true);
    setTimeout(() => setCartAnimate(false), 400);
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleCheckout = () => {
    setIsCheckoutSuccess(true);
    setCartItems([]);
    setTimeout(() => setIsCheckoutSuccess(false), 5000);
    setIsCartOpen(false);
  };

  const resetFilters = () => {
    setFilter('All');
    setSearchQuery('');
    setSortBy('default');
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS.filter(p => {
      const matchesCategory = filter === 'All' || p.category === filter;
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [filter, searchQuery, sortBy]);

  const getCategoryPhoto = (cat: Category) => {
    switch (cat) {
      case Category.PROTEIN: return 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&q=80&w=800';
      case Category.VITAMINS: return 'https://images.unsplash.com/photo-1550572017-ed20bb79d6ec?auto=format&fit=crop&q=80&w=800';
      case Category.SUPPLEMENTS: return 'https://images.unsplash.com/photo-1594882645126-14020914d58d?auto=format&fit=crop&q=80&w=800';
      case Category.GEAR: return 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800';
      default: return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800';
    }
  };

  const renderHome = () => (
    <div className="space-y-32 pb-32">
      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=2000" 
            alt="Gym Background" 
            className="w-full h-full object-cover opacity-40 grayscale brightness-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-6xl animate__animated animate__fadeInUp">
          <div className="inline-block px-4 py-1 bg-orange-600/20 border border-orange-600/40 rounded-full text-orange-500 font-black text-xs tracking-[0.3em] uppercase mb-8">
            The Elite Arsenal
          </div>
          <h1 className="syncopate text-6xl md:text-8xl lg:text-9xl font-black text-white uppercase tracking-tighter leading-[0.85] mb-8 text-glow">
            UNLEASH <br/><span className="text-orange-500">POWER</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-2xl mx-auto mb-12 leading-relaxed opacity-80">
            Professional-grade bio-hacking supplements and peak performance gear for the dedicated 1%.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button 
              onClick={() => setActiveTab('shop')}
              className="bg-orange-600 hover:bg-orange-700 text-white font-black px-12 py-6 rounded-full text-xl oswald uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:scale-105 active:scale-95"
            >
              Shop Inventory
            </button>
            <button 
              onClick={() => setActiveTab('coach')}
              className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white border border-white/20 font-black px-12 py-6 rounded-full text-xl oswald uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
            >
              Consult AI Coach
            </button>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7-7-7m14-8l-7 7-7-7" />
          </svg>
        </div>
      </header>

      {/* Sponsor Ticker */}
      <section className="bg-slate-950 border-y border-slate-900 overflow-hidden py-10 relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-950 to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-950 to-transparent z-10" />
        <div className="flex animate-ticker whitespace-nowrap">
          {[...SPONSORS, ...SPONSORS].map((sponsor, idx) => (
            <div key={idx} className="flex items-center gap-4 mx-12">
              <div className="w-2 h-2 bg-orange-600 rounded-full" />
              <span className="syncopate text-2xl font-black text-slate-700 hover:text-orange-500 transition-colors cursor-default uppercase tracking-widest italic">{sponsor}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Grid with Calculator */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="oswald text-4xl md:text-6xl font-black text-white uppercase italic mb-4">Precision <span className="text-orange-500">Bio-Metrics</span></h2>
          <p className="text-slate-400">Calculate your path to dominance.</p>
        </div>
        <MacroCalculator />
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center mb-16">
          <span className="text-orange-500 font-black uppercase text-xs tracking-[0.5em] mb-4">Field Intelligence</span>
          <h2 className="syncopate text-4xl font-bold text-white uppercase italic">Combat <span className="text-orange-500">Reports</span></h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="bg-slate-900/50 border border-slate-800 p-8 rounded-[3rem] space-y-6 hover:border-orange-600 transition-all duration-500 group">
              <div className="flex items-center gap-4">
                <img src={t.img} className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all" />
                <div>
                  <h4 className="syncopate text-sm font-black text-white uppercase">{t.name}</h4>
                  <span className="text-[10px] text-orange-500 font-black uppercase tracking-widest">{t.rank}</span>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed italic">"{t.text}"</p>
              <div className="flex text-orange-500 gap-1 text-xs">
                {Array(5).fill(0).map((_, i) => <span key={i}>★</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-slate-800 rounded-[4rem] p-12 md:p-24 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-orange-600/5 blur-[120px] rounded-full" />
          <div className="relative z-10 space-y-8">
            <h2 className="syncopate text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">JOIN THE <span className="text-orange-500">BRIEFING</span></h2>
            <p className="text-slate-400 max-w-xl mx-auto text-lg">Receive classified nutritional updates, early stash drops, and AI-optimized training protocols.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input 
                type="email" 
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="YOUR.COMM@EMAIL.COM" 
                className="flex-grow bg-slate-950/80 border border-slate-800 rounded-full px-8 py-5 text-white focus:border-orange-500 outline-none transition-all uppercase text-xs font-black tracking-widest"
              />
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-black px-10 py-5 rounded-full oswald uppercase tracking-widest transition-all shadow-xl active:scale-95">Deploy</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col selection:bg-orange-500 selection:text-white">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
        cartAnimate={cartAnimate}
      />

      <main className="flex-grow">
        {activeTab === 'home' && renderHome()}
        {activeTab === 'shop' && (
          <div className="max-w-7xl mx-auto px-4 py-32">
            <div className="flex flex-col gap-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                     <span className="w-12 h-1 bg-orange-600" />
                     <span className="text-orange-500 font-black uppercase text-xs tracking-widest">Inventory List</span>
                  </div>
                  <h2 className="syncopate text-4xl md:text-6xl font-bold text-white uppercase">THE <span className="text-orange-500">STASH</span></h2>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Sort By</span>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-xs font-bold text-white outline-none focus:border-orange-500 transition-all cursor-pointer"
                  >
                    <option value="default">Release Date</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-12">
                <aside className="space-y-10">
                  <div className="space-y-6">
                    <h3 className="syncopate text-xs font-black text-white uppercase tracking-widest">Search Arsenal</h3>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Keyword..."
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:border-orange-500 outline-none transition-all pr-10"
                      />
                      <svg className="w-5 h-5 text-slate-500 absolute right-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="syncopate text-xs font-black text-white uppercase tracking-widest">Class Filter</h3>
                    <div className="flex flex-col gap-2">
                      <button 
                        onClick={() => setFilter('All')}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filter === 'All' ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                      >
                        All Items
                      </button>
                      {Object.values(Category).map(cat => (
                        <button 
                          key={cat}
                          onClick={() => setFilter(cat)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all border ${filter === cat ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {(filter !== 'All' || searchQuery !== '' || sortBy !== 'default') && (
                    <button 
                      onClick={resetFilters}
                      className="w-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-orange-500 transition-all flex items-center justify-center gap-2 group"
                    >
                      <svg className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset All Filters
                    </button>
                  )}
                </aside>

                <div className="space-y-8">
                  {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                      {filteredProducts.map(product => (
                        <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-slate-900/50 border border-slate-800 border-dashed rounded-[3rem] py-32 text-center">
                      <h3 className="syncopate text-xl font-bold text-white uppercase">No Gear Found</h3>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'coach' && <PerformanceCoach />}
        {activeTab === 'tips' && <HealthTips />}
      </main>

      <footer className="bg-slate-950 border-t border-slate-900 py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-orange-600/5 blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2" />
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 relative z-10">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center rotate-6">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 18.43 17 22 13.43z" />
                </svg>
              </div>
              <span className="syncopate text-2xl font-black text-white uppercase italic">Apex<span className="text-orange-500">Physique</span></span>
            </div>
            <p className="text-slate-500 text-lg leading-relaxed max-w-md font-medium">
              Join the elite. We provide the science, the tools, and the nutrition. You provide the work.
            </p>
          </div>
          <div className="space-y-8">
            <h4 className="syncopate text-sm font-black text-white uppercase tracking-widest">Navigation</h4>
            <ul className="space-y-4 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
              <li><button onClick={() => setActiveTab('home')} className="hover:text-orange-500 transition-colors text-left">Commander Center</button></li>
              <li><button onClick={() => setActiveTab('shop')} className="hover:text-orange-500 transition-colors text-left">The Stash</button></li>
              <li><button onClick={() => setActiveTab('coach')} className="hover:text-orange-500 transition-colors text-left">AI Intelligence</button></li>
              <li><button onClick={() => setActiveTab('tips')} className="hover:text-orange-500 transition-colors text-left">The Archive</button></li>
            </ul>
          </div>
          <div className="space-y-8">
            <h4 className="syncopate text-sm font-black text-white uppercase tracking-widest">Legal Stack</h4>
            <ul className="space-y-4 text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">
              <li><a href="#" className="hover:text-orange-500 transition-colors">Supply Line Policy</a></li>
              <li><a href="#" className="hover:text-orange-500 transition-colors">Refund Protocol</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-24 pt-12 border-t border-slate-900/50 flex flex-col md:flex-row justify-between items-center gap-8 text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">
          <p>© 2024 Apex Physique HQ. NO EXCUSES.</p>
          <div className="flex items-center gap-4">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>SYSTEM STATUS: OPTIMAL</span>
          </div>
        </div>
      </footer>

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cartItems} 
        onRemove={removeFromCart} 
        onUpdateQuantity={updateQuantity}
        onCheckout={handleCheckout}
      />

      {isCheckoutSuccess && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] bg-orange-600 text-white px-10 py-5 rounded-2xl shadow-2xl animate__animated animate__bounceIn oswald uppercase font-black tracking-widest text-center border-2 border-white/20">
          <p className="text-2xl mb-1">TRANSACTION SECURED!</p>
          <p className="text-xs opacity-80">Profits routed to the commander.</p>
        </div>
      )}
    </div>
  );
};

export default App;
