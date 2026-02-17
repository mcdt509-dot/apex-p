
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { getProductExpertInsight } from '../services/geminiService';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

interface ExpertInsight {
  verdict: string;
  benefits: string[];
  proTip: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [insight, setInsight] = useState<ExpertInsight | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const [isAdded, setIsAdded] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  const fetchInsight = async () => {
    if (insight) {
      setShowAnalysis(!showAnalysis);
      return;
    }
    
    setIsLoadingInsight(true);
    setShowAnalysis(true);
    try {
      const data = await getProductExpertInsight(product.name, product.category);
      setInsight(data);
    } catch (error) {
      console.error("Failed to fetch expert insight:", error);
      setShowAnalysis(false);
    } finally {
      setIsLoadingInsight(false);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showAnalysis) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left) / width) * 100;
    const y = ((e.pageY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: 'scale(1.8)',
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transformOrigin: 'center center', transform: 'scale(1)' });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  return (
    <div className="bg-slate-900/40 border-2 border-slate-900 rounded-[2.5rem] overflow-hidden hover:border-orange-500/40 transition-all duration-500 group flex flex-col h-full hover-glow backdrop-blur-md relative">
      {/* Badge Ribbon */}
      {product.badge && (
        <div className="absolute top-8 left-[-35px] bg-orange-600 text-white py-1 px-10 -rotate-45 z-30 oswald text-[10px] font-black uppercase tracking-widest shadow-xl">
          {product.badge}
        </div>
      )}

      <div 
        className="relative aspect-[4/5] overflow-hidden m-3 rounded-[2rem] cursor-zoom-in group/img"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <img 
          ref={imageRef}
          src={product.image} 
          alt={product.name}
          style={zoomStyle}
          className={`w-full h-full object-cover transition-transform duration-200 ease-out ${showAnalysis ? 'blur-sm opacity-30 scale-110' : ''}`}
        />
        
        {/* Overlay for Analysis */}
        {showAnalysis && (
          <div className="absolute inset-0 p-6 flex flex-col justify-center animate__animated animate__fadeIn z-10 bg-slate-950/40 backdrop-blur-sm">
            {isLoadingInsight ? (
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="oswald text-xs text-orange-500 uppercase font-black tracking-widest animate-pulse">Scanning Bio-Composition...</p>
              </div>
            ) : insight ? (
              <div className="space-y-4 overflow-y-auto max-h-full pr-2 custom-scrollbar">
                <div className="space-y-1">
                  <span className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em]">The Verdict</span>
                  <p className="text-xs text-white leading-relaxed font-medium italic">"{insight.verdict}"</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] text-orange-500 font-black uppercase tracking-[0.2em]">Core Benefits</span>
                  <ul className="space-y-1.5">
                    {insight.benefits.map((b, i) => (
                      <li key={i} className="text-[10px] text-slate-300 flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">⚡</span> {b}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-3 bg-orange-600/10 border border-orange-600/20 rounded-xl">
                  <span className="text-[9px] text-orange-400 font-black uppercase block mb-1">Coach's Pro Tip</span>
                  <p className="text-[10px] text-slate-200 leading-snug">{insight.proTip}</p>
                </div>
              </div>
            ) : null}
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none" />
        
        <div className="absolute top-5 right-5 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-black text-orange-500 border border-slate-800 flex items-center gap-1.5 z-20 pointer-events-none">
          <span className="text-orange-400">★</span> {product.rating}
        </div>
        
        <div className="absolute bottom-5 left-5 flex flex-col gap-2 z-20">
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-orange-500 px-4 py-2 bg-slate-950/90 backdrop-blur-md rounded-full border border-orange-500/20 pointer-events-none">
                {product.category}
            </span>
            {product.stockStatus && (
              <span className={`text-[8px] uppercase font-black tracking-[0.2em] px-3 py-1 rounded-full border ${product.stockStatus === 'In Stock' ? 'text-green-500 bg-green-500/10 border-green-500/20' : 'text-red-500 bg-red-500/10 border-red-500/20'}`}>
                ● {product.stockStatus}
              </span>
            )}
        </div>

        <button 
          onClick={(e) => { e.stopPropagation(); fetchInsight(); }}
          className={`absolute bottom-5 right-5 p-3 rounded-full border transition-all z-20 ${showAnalysis ? 'bg-orange-600 border-orange-500 text-white' : 'bg-slate-950/90 border-slate-800 text-orange-500 hover:border-orange-500'}`}
          title="AI Analysis"
        >
          {!showAnalysis && <div className="absolute inset-0 rounded-full animate-ping bg-orange-500/20" />}
          <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9l-.707.707M16.243 16.243l-.707.707M12 21v-1m0-11a3 3 0 100 6 3 3 0 000-6z" />
          </svg>
        </button>
      </div>
      
      <div className="p-8 flex-grow flex flex-col">
        <h3 className="syncopate text-xl font-black mb-3 group-hover:text-orange-500 transition-colors uppercase tracking-tight leading-tight">
          {product.name}
        </h3>
        <p className="text-slate-500 text-sm mb-8 line-clamp-2 font-medium leading-relaxed">
          {product.description}
        </p>
        
        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="block text-[10px] uppercase font-black text-slate-600 tracking-widest">Investment</span>
            <span className="text-2xl font-black text-white oswald">
              ${product.price.toFixed(2)}
            </span>
          </div>
          <button 
            onClick={handleAddToCart}
            className={`font-black py-4 px-6 rounded-2xl flex items-center gap-2 transition-all active:scale-90 shadow-lg min-w-[120px] justify-center ${
              isAdded 
                ? 'bg-green-600 text-white shadow-green-600/20' 
                : 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/10 group-hover:shadow-orange-600/30'
            }`}
          >
            {isAdded ? (
              <div className="flex items-center gap-2 animate__animated animate__pulse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-xs uppercase tracking-widest">ADDED</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs uppercase tracking-widest">ADD</span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
