import React, { useState } from 'react';
import {
  Gamepad2,
  Trophy,
  Flame,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { gamesList } from '../data/initialData';
import { GameType } from '../types';

export const GamesPage: React.FC = () => {
  const { navigateToGame, userProfile, gameResults } = useLms();
  const [filterCategory, setFilterCategory] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Barchasi', 'Umumiy Intellekt', 'Tezkor Hisoblash', 'Lug\'at va IT Terminlar', 'Algoritmik Ketma-ketlik', 'Tashkilotchilik va Mantiq'];

  const filteredGames = gamesList.filter((g) => {
    const matchesCategory = filterCategory === 'Barchasi' || g.category === filterCategory;
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-purple-700 to-pink-700 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>O'yin orqali samarali ta'lim (Gamification)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              🎮 Interaktiv Ta'limiy O‘yinlar
            </h2>
            <p className="mt-2 text-sm sm:text-base text-indigo-100 max-w-xl">
              Qiziqarli o'yinlar orqali intellektingizni sinang, mantiqiy fikrlashni charxlang
              va shaxsiy ballaringizni ko'paytirib, LMS reytingida 1-o'ringa ko'tariling!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xl shadow-md">
              🏆
            </div>
            <div>
              <p className="text-xs text-indigo-200">To'plangan o'yin ballari</p>
              <h3 className="text-xl font-extrabold text-white">
                {userProfile.totalPoints} Ball
              </h3>
              <p className="text-[11px] text-amber-300 font-semibold">
                O'ynalgan o'yinlar: {gameResults.length} marta
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filterCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/25'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O'yin nomini qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Games Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGames.map((game) => (
          <div
            key={game.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
          >
            {/* Card Header Gradient */}
            <div className={`p-6 bg-gradient-to-r ${game.colorScheme} text-white relative`}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl filter drop-shadow">{game.icon}</span>
                <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-white/20 backdrop-blur-md">
                  {game.difficulty}
                </span>
              </div>
              <h3 className="text-xl font-black tracking-tight">{game.title}</h3>
              <p className="text-xs text-white/80 mt-1 font-medium">{game.category}</p>
            </div>

            {/* Card Body */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {game.description}
              </p>

              <div className="grid grid-cols-3 gap-2 py-3 px-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Savollar</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {game.totalQuestions} ta
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Vaqt/savol</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {game.timeLimitSeconds} sek
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Mukofot</span>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                    +{game.rewardPoints} ball
                  </span>
                </div>
              </div>

              {/* “O‘yinga kirish” tugmasi - Bosilganda haqiqiy o'yin ochiladi */}
              <button
                onClick={() => navigateToGame(game.id as GameType)}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl font-bold text-sm shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 group-hover:scale-[1.02] active:scale-[0.98]"
              >
                <Gamepad2 className="w-4 h-4 text-amber-300" />
                <span>O‘yinga kirish</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
