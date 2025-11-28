import React, { useState } from 'react';
import { Sparkles, Moon, Wind, Stars } from 'lucide-react';
import DuaInput from './components/DuaInput';
import DuaResult from './components/DuaResult';
import { DuaResponse } from './types';
import { generateDua } from './services/geminiService';

const App: React.FC = () => {
  const [dua, setDua] = useState<DuaResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<'INPUT' | 'RESULT'>('INPUT');

  const handleRequest = async (query: string) => {
    setLoading(true);
    // Subtle delay to allow the "connecting" animation to breathe
    const [result] = await Promise.all([
      generateDua(query),
      new Promise(resolve => setTimeout(resolve, 1500)) 
    ]);
    
    if (result) {
      setDua(result);
      setView('RESULT');
    }
    setLoading(false);
  };

  const handleReset = () => {
    setDua(null);
    setView('INPUT');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 selection:text-amber-900 transition-colors duration-1000">
      
      {/* Heavenly Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Dynamic Gradient Sky */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-100 via-indigo-50 to-amber-50 opacity-80"></div>
        
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[20%] w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse duration-[5000ms]"></div>
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] bg-violet-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse duration-[7000ms]"></div>
        
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Main Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen items-center justify-center p-4 md:p-8">
        
        {/* Header */}
        <header className="absolute top-0 left-0 w-full p-6 flex justify-between items-center opacity-80 pointer-events-none">
          <div className="flex items-center gap-2 text-slate-600 pointer-events-auto">
            <Moon className="w-5 h-5" />
            <span className="font-serif-display font-semibold text-lg tracking-wide">DuaAI</span>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center gap-6 animate-in fade-in duration-1000">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-200 blur-xl opacity-30 animate-pulse rounded-full"></div>
              <Stars className="w-12 h-12 text-amber-500/80 animate-spin-slow duration-[10000ms]" />
            </div>
            <p className="text-xl font-serif-display text-slate-600 animate-pulse">Seeking knowledge and guidance for you...</p>
          </div>
        ) : view === 'INPUT' ? (
          <DuaInput onSubmit={handleRequest} />
        ) : (
          <DuaResult dua={dua!} onBack={handleReset} />
        )}
      </div>
    </div>
  );
};

export default App;