import React, { useState } from 'react';
import {
  FileCheck2,
  Clock,
  HelpCircle,
  Play,
  Award,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Users,
  CheckCircle2,
  Sparkles,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { GoogleFormTestModal } from '../components/GoogleFormTestModal';
import { GoogleFormMonitorModal } from '../components/GoogleFormMonitorModal';

export const QuizzesPage: React.FC = () => {
  const {
    quizzes,
    navigateToQuiz,
    quizResults,
    googleFormUrl,
    googleFormParticipants,
  } = useLms();

  const [selectedSubject, setSelectedSubject] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [showGoogleFormModal, setShowGoogleFormModal] = useState(false);
  const [showMonitorModal, setShowMonitorModal] = useState(false);

  // Google Form participant summary
  const completedCount = googleFormParticipants.filter(
    (p) => p.status === 'Bajarildi'
  ).length;
  const inProgressCount = googleFormParticipants.filter(
    (p) => p.status === 'Jarayonda'
  ).length;
  const totalParticipants = googleFormParticipants.length;

  const subjects = ['Barchasi', 'Web Dasturlash', 'Sun\'iy Intellekt', 'Kiberxavfsizlik'];

  const filteredQuizzes = quizzes.filter((q) => {
    const matchesSubject = selectedSubject === 'Barchasi' || q.subject === selectedSubject;
    const matchesSearch =
      q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            📝 Bilimni Sinash Testlari
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Mavzular bo'yicha mustaqil nazorat testlarini topshiring va o'zlashtirish darajangizni aniqlang
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
            Topshirilgan: {quizResults.length} marta
          </span>
        </div>
      </div>

      {/* FEATURED SPECIAL GOOGLE FORMS TEST CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/15">
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-bold border border-white/15">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Maxsus Onlayn Nazorat Testi (Google Forms)</span>
            </div>

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight leading-tight">
              Talabalar Bilimini Baholash: Maxsus Google Forms Testi
            </h3>

            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed max-w-xl">
              Ushbu maxsus Google Forms so‘rovnoma-testi barcha talabalar uchun majburiy hisoblanadi.
              Tugmani bosib testga kiring. O‘qituvchi kimlar kirgani va kimlar bajarganini real vaqt rejimida kuzatib boradi.
            </p>

            {/* Quick Live Participation Status Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                <span>{completedCount} ta talaba topshirdi</span>
              </span>

              <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-200 border border-amber-400/30 flex items-center gap-1.5 font-bold">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>{inProgressCount} ta jarayonda</span>
              </span>

              <span className="px-3 py-1 rounded-xl bg-white/10 text-slate-200 border border-white/10 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-300" />
                <span>Jami ro'yxatda: {totalParticipants} ta</span>
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="pt-3 flex flex-wrap items-center gap-3">
              {/* Main Button 1: Testga Kirish */}
              <button
                onClick={() => setShowGoogleFormModal(true)}
                className="px-6 py-3.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-2xl font-black text-xs sm:text-sm shadow-lg shadow-black/10 transition flex items-center gap-2 transform active:scale-95"
              >
                <Play className="w-4 h-4 fill-current text-indigo-600" />
                <span>Google Form Testiga Kirish</span>
              </button>

              {/* Main Button 2: Monitoring - Kimlar Kirdi va Bajardi */}
              <button
                onClick={() => setShowMonitorModal(true)}
                className="px-5 py-3.5 bg-indigo-600/60 hover:bg-indigo-600 text-white rounded-2xl font-bold text-xs sm:text-sm border border-white/20 backdrop-blur-xs transition flex items-center gap-2 active:scale-95"
              >
                <BarChart3 className="w-4 h-4 text-amber-300" />
                <span>Kimlar bajardi? (Monitoring)</span>
              </button>

              {/* Direct Link External Fallback */}
              <a
                href={googleFormUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-xs border border-white/10 transition flex items-center gap-1.5"
                title="To'g'ridan-to'g'ri yangi oynada ochish"
              >
                <span>To'g'ridan-to'g'ri havola</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right Miniature Preview Card */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-3xl p-5 lg:w-80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-200">Test Holati</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>

            <div>
              <span className="text-2xl font-black text-white">
                {Math.round((completedCount / (totalParticipants || 1)) * 100)}%
              </span>
              <p className="text-xs text-indigo-200 mt-0.5">Topshirganlik ko'rsatkichi</p>
              <div className="w-full h-2 rounded-full bg-white/15 mt-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-300 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.round((completedCount / (totalParticipants || 1)) * 100)}%`,
                  }}
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 text-xs space-y-1">
              <span className="text-slate-300 font-medium block">Forma manzili:</span>
              <p className="font-mono text-[11px] text-amber-200 truncate">
                docs.google.com/forms/...
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedSubject === sub
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Test nomini qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Standard LMS Quizzes List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredQuizzes.map((quiz) => (
          <div
            key={quiz.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between p-6 space-y-5"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  {quiz.subject}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  {quiz.difficulty}
                </span>
              </div>

              {/* Test Nomi */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {quiz.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                {quiz.description}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Savollar soni */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Savollar:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {quiz.questionsCount} ta
                    </span>
                  </div>
                </div>

                {/* Vaqt */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <div>
                    <span className="text-[10px] text-slate-400 block">Vaqt:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {quiz.timeLimitMinutes} daqiqa
                    </span>
                  </div>
                </div>
              </div>

              {/* Boshlash tugmasi */}
              <button
                onClick={() => navigateToQuiz(quiz.id)}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-500/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Testni boshlash</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Google Forms Interactive Modal */}
      {showGoogleFormModal && (
        <GoogleFormTestModal
          onClose={() => setShowGoogleFormModal(false)}
          onOpenMonitoring={() => {
            setShowGoogleFormModal(false);
            setShowMonitorModal(true);
          }}
        />
      )}

      {/* Google Forms Submissions & Attendance Monitor Modal */}
      {showMonitorModal && (
        <GoogleFormMonitorModal
          onClose={() => setShowMonitorModal(false)}
          onOpenTest={() => {
            setShowMonitorModal(false);
            setShowGoogleFormModal(true);
          }}
        />
      )}
    </div>
  );
};
