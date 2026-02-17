
import React from 'react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  onCartClick: () => void;
  cartAnimate?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, cartCount, onCartClick, cartAnimate }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/60 backdrop-blur-2xl border-b border-slate-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center transform group-hover:rotate-[20deg] group-hover:scale-110 transition-all duration-500 shadow-lg shadow-orange-600/20">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14 4.14 5.57 2 7.71 3.43 9.14 2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22 14.86 20.57 18.43 17 22 13.43z" />
            </svg>
          </div>
          <div className="flex flex-col -space-y-1">
            <span className="syncopate text-xl font-black tracking-tighter text-white uppercase italic">
              Apex<span className="text-orange-500">Physique</span>
            </span>
            <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] ml-0.5">Tactical Nutrition</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {[
            { id: 'home', label: 'Command' },
            { id: 'shop', label: 'The Stash' },
            { id: 'coach', label: 'AI Intel' },
            { id: 'tips', label: 'Archive' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`uppercase text-[10px] font-black tracking-[0.3em] hover:text-orange-500 transition-all relative py-2 ${
                activeTab === tab.id ? 'text-orange-500' : 'text-slate-500'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-600 rounded-full shadow-[0_0_10px_rgba(234,88,12,0.8)]" />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden xl:flex items-center gap-3 bg-slate-900/50 border border-slate-800 px-4 py-1.5 rounded-full">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Secure</span>
          </div>

          <button 
            onClick={onCartClick}
            className={`relative p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 hover:text-white hover:border-orange-500/50 transition-all group active:scale-90 ${cartAnimate ? 'cart-animate border-orange-500 text-orange-500' : ''}`}
          >
            <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-xl shadow-lg shadow-orange-600/40 animate__animated animate__heartBeat animate__infinite">
                {cartCount}
              </span>
            )}
          </button>
          
          <button className="hidden sm:block bg-orange-600 hover:bg-orange-700 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-orange-600/20 active:scale-95">
            Join Elite
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
