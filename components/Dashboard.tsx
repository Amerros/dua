import React from 'react';
import { Surah, UserProgress } from '../types';
import { Play, Star, Clock } from 'lucide-react';

interface DashboardProps {
  surahs: Surah[];
  progress: Record<string, UserProgress>;
  onStartSurah: (surah: Surah) => void;
  dueCount: number;
}

const Dashboard: React.FC<DashboardProps> = ({ surahs, progress, onStartSurah, dueCount }) => {
  const getSurahProgress = (surah: Surah) => {
    const totalVerses = surah.verses.length;
    const memorizedVerses = surah.verses.filter(v => {
      const p = progress[v.id];
      return p && p.box > 0;
    }).length;
    return Math.round((memorizedVerses / totalVerses) * 100);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back, Hafiz</h1>
        <p className="text-slate-500">Continue your journey to memorize the Holy Quran.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
          <div className="bg-amber-100 p-3 rounded-full text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Due for Review</p>
            <p className="text-2xl font-bold text-slate-800">{dueCount} Verses</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
           <div className="bg-emerald-100 p-3 rounded-full text-emerald-600">
            <Star size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Mastered</p>
            <p className="text-2xl font-bold text-slate-800">
              {Object.values(progress).filter((p: UserProgress) => p.box >= 4).length} Verses
            </p>
          </div>
        </div>

         <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-center">
            <p className="font-medium opacity-90">Daily Goal</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-bold">15</span>
              <span className="mb-1 opacity-75">/ 20 mins</span>
            </div>
            <div className="w-full bg-black/20 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-white h-full rounded-full w-[75%]"></div>
            </div>
        </div>
      </div>

      <h2 className="text-xl font-bold text-slate-800 mb-4">Your Surahs</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {surahs.map(surah => {
          const percent = getSurahProgress(surah);
          return (
            <div 
              key={surah.number}
              onClick={() => onStartSurah(surah)}
              className="group bg-white hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 transition-all cursor-pointer p-5 rounded-xl relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-slate-800 group-hover:text-emerald-800">{surah.englishName}</h3>
                  <p className="text-sm text-slate-400">{surah.name}</p>
                </div>
                <div className="bg-slate-100 group-hover:bg-white p-2 rounded-full text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <Play size={20} fill="currentColor" />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                  <span>{percent}% Memorized</span>
                  <span>{surah.verses.length} Verses</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;