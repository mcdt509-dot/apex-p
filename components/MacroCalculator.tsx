
import React, { useState } from 'react';
import { calculateMacros } from '../services/geminiService';

const MacroCalculator: React.FC = () => {
  const [formData, setFormData] = useState({
    weight: 85,
    height: 180,
    age: 25,
    activity: 'Highly Active',
    goal: 'Muscle Gain'
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    setLoading(true);
    try {
      const data = await calculateMacros(formData);
      setResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="grid md:grid-cols-2 gap-12 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-orange-600 shadow-[0_0_20px_rgba(234,88,12,0.5)]" />
        
        <div className="space-y-6">
          <h2 className="oswald text-3xl font-bold text-white uppercase italic tracking-wider">Precision <span className="text-orange-500">Targets</span></h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Weight (kg)</label>
              <input 
                type="number" 
                value={formData.weight}
                onChange={(e) => setFormData({...formData, weight: +e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Height (cm)</label>
              <input 
                type="number" 
                value={formData.height}
                onChange={(e) => setFormData({...formData, height: +e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Age</label>
              <input 
                type="number" 
                value={formData.age}
                onChange={(e) => setFormData({...formData, age: +e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Goal</label>
              <select 
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
              >
                <option>Muscle Gain</option>
                <option>Fat Loss</option>
                <option>Maintain</option>
                <option>Body Recomp</option>
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Activity Level</label>
            <select 
              value={formData.activity}
              onChange={(e) => setFormData({...formData, activity: e.target.value})}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-white focus:border-orange-500 outline-none"
            >
              <option>Sedentary</option>
              <option>Lightly Active</option>
              <option>Moderately Active</option>
              <option>Highly Active</option>
              <option>Elite Athlete</option>
            </select>
          </div>
          <button 
            onClick={handleCalculate}
            disabled={loading}
            className="w-full bg-orange-600 hover:bg-orange-700 py-4 rounded-xl font-black text-white oswald uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Crunching Numbers...' : 'Generate Macro Split'}
          </button>
        </div>

        <div className="bg-slate-950/50 rounded-2xl border border-slate-800 p-6 flex flex-col justify-center items-center text-center">
          {result ? (
            <div className="space-y-6 animate__animated animate__fadeIn">
              <div className="space-y-1">
                <span className="text-4xl font-black text-orange-500 oswald">{result.calories}</span>
                <span className="block text-xs text-slate-500 uppercase font-bold tracking-widest">Daily Calories</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-900 rounded-lg">
                  <span className="block text-xl font-bold text-white oswald">{result.protein}g</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Protein</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">
                  <span className="block text-xl font-bold text-white oswald">{result.carbs}g</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Carbs</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg">
                  <span className="block text-xl font-bold text-white oswald">{result.fats}g</span>
                  <span className="text-[10px] text-slate-500 font-bold uppercase">Fats</span>
                </div>
              </div>
              <p className="text-xs text-slate-400 italic leading-relaxed">
                {result.explanation}
              </p>
            </div>
          ) : (
            <div className="text-slate-600 space-y-4">
              <svg className="w-16 h-16 mx-auto opacity-20" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z"/>
              </svg>
              <p className="uppercase font-bold tracking-widest text-sm">Enter stats to unlock your biological blueprint</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MacroCalculator;
