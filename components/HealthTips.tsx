
import React, { useState, useEffect } from 'react';
import { generateHealthTip } from '../services/geminiService';
import { HealthTip } from '../types';

const HealthTips: React.FC = () => {
  const [tip, setTip] = useState<HealthTip | null>(null);
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('Hypertrophy');

  const fetchTip = async (selectedTopic: string) => {
    setLoading(true);
    try {
      const data = await generateHealthTip(selectedTopic);
      setTip(data);
    } catch (error) {
      console.error("Failed to fetch health tip:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTip('Hypertrophy');
  }, []);

  const topics = ['Protein Intake', 'Recovery', 'Pre-workout', 'Vitamin D', 'Creatine', 'Sleep', 'Progressive Overload'];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h2 className="oswald text-4xl md:text-5xl font-bold text-white mb-4 uppercase italic">
          AI PERFORMANCE <span className="text-orange-500">COACH</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Get science-backed nutrition and training advice powered by Gemini 3 Flash. 
          Knowledge is just as important as the iron you lift.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {topics.map((t) => (
          <button
            key={t}
            onClick={() => {
              setTopic(t);
              fetchTip(t);
            }}
            disabled={loading}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              topic === t 
                ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' 
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="relative bg-slate-900 rounded-3xl p-8 md:p-12 border border-slate-800 shadow-2xl min-h-[400px] flex flex-col items-center justify-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-600/10 blur-3xl -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 blur-3xl -ml-10 -mb-10" />

        {loading ? (
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-slate-800 border-t-orange-600 rounded-full animate-spin mx-auto mb-6"></div>
            <p className="oswald text-xl text-slate-500 animate-pulse uppercase">Consulting Science Databases...</p>
          </div>
        ) : tip ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full">
            <div className="flex items-center gap-2 text-orange-500 font-bold mb-6 text-sm uppercase tracking-widest">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Flash Recommendation
            </div>
            <h3 className="oswald text-3xl md:text-4xl font-black text-white mb-6 uppercase leading-tight italic">
              {tip.title}
            </h3>
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed mb-10 text-lg">
              {tip.content}
            </div>
            <div className="flex flex-wrap gap-2">
              {tip.tags.map(tag => (
                <span key={tag} className="bg-slate-800 text-slate-400 px-3 py-1 rounded text-xs font-mono">
                  #{tag.toLowerCase().replace(/\s+/g, '')}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-slate-500">Select a topic to generate your elite coaching insight.</p>
        )}
      </div>
    </div>
  );
};

export default HealthTips;
