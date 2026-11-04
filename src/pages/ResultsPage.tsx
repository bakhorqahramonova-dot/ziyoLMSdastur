import React from 'react';
import {
  Trophy,
  Award,
  TrendingUp,
  FileCheck2,
  Gamepad2,
  BookOpen,
  Calendar,
  CheckCircle2,
  Zap,
  Sparkles,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export const ResultsPage: React.FC = () => {
  const {
    userProfile,
    courses,
    gameResults,
    quizResults,
    navigateToGame,
    navigateToQuiz,
  } = useLms();

  // Calculations
  const totalCourses = courses.length;
  const completedCourses = courses.filter((c) => c.isCompleted).length;
  const avgCourseProgress = Math.round(
    courses.reduce((acc, c) => acc + c.progressPercent, 0) / (totalCourses || 1)
  );

  const totalQuizzesTaken = quizResults.length;
  const avgQuizScore = totalQuizzesTaken > 0
    ? Math.round(quizResults.reduce((acc, q) => acc + q.percent, 0) / totalQuizzesTaken)
    : 85;

  const totalGamesPlayed = gameResults.length;
  const totalGamePoints = gameResults.reduce((acc, g) => acc + g.score, 0);

  // Overall average
  const overallPerformance = Math.round((avgCourseProgress + avgQuizScore) / 2);

  // Mock monthly performance data for visual SVG chart
  const performanceTrend = [
    { month: 'Yanvar', score: 65 },
    { month: 'Fevral', score: 72 },
    { month: 'Mart', score: 80 },
    { month: 'Aprel', score: 88 },
    { month: 'May', score: 94 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-xs font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>O'quv ko'rsatkichlari tahlili</span>
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              📊 Shaxsiy Natijalar va Reyting
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-indigo-100 max-w-xl">
              Kurslar, testlar va o'yinlar bo'yicha erishgan yutuqlaringiz, to'plangan umumiy ballar va tahliliy hisobotlar
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xl shadow-md">
              👑
            </div>
            <div>
              <p className="text-xs text-indigo-200">Guruhdagi o'rningiz</p>
              <h3 className="text-2xl font-black text-white">
                #{userProfile.rank} O'rinda
              </h3>
              <p className="text-[11px] text-amber-300 font-semibold">
                Umumiy ball: {userProfile.totalPoints}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Big Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {/* Umumiy ball */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center mb-3">
            <Award className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400">Umumiy Ball</span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {userProfile.totalPoints}
          </h4>
          <span className="text-[11px] text-emerald-600 font-semibold">+150 bu hafta</span>
        </div>

        {/* Reyting */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center mb-3">
            <Trophy className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400">Guruh Reytingi</span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            #{userProfile.rank}
          </h4>
          <span className="text-[11px] text-indigo-600 font-semibold">Top 5% ichida</span>
        </div>

        {/* O'zlashtirish foizi */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400">O'rtacha o'zlashtirish</span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {overallPerformance}%
          </h4>
          <span className="text-[11px] text-emerald-600 font-semibold">A'lo darajada</span>
        </div>

        {/* Tugatilgan kurslar */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center mb-3">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400">Tugatilgan kurslar</span>
          <h4 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            {completedCourses} / {totalCourses}
          </h4>
          <span className="text-[11px] text-blue-600 font-semibold">{totalCourses - completedCourses} ta davom etmoqda</span>
        </div>
      </div>

      {/* Visual Chart Section: SVG Growth Curve & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dynamic Growth Chart */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                📈 Oylik Bilim O'sish Dinamikasi
              </h3>
              <p className="text-xs text-slate-400">
                Oylar kesimida testlar va vazifalar o'rtacha natijasi
              </p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              +29% O'sish
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-6">
            <div className="h-48 flex items-end justify-between gap-3 px-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              {performanceTrend.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition">
                    {item.score}%
                  </span>
                  <div className="w-full max-w-[48px] rounded-t-xl bg-slate-100 dark:bg-slate-800 h-40 flex items-end p-1">
                    <div
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-indigo-500 transition-all duration-700 group-hover:from-indigo-600 group-hover:to-purple-500"
                      style={{ height: `${item.score}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Yutuqlar va Medallar (Badges) */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            Yutuqlar va Nishonlar
          </h3>

          <div className="space-y-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
              <span className="text-2xl">⚡️</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tezkor Fikrlovchi
                </h4>
                <p className="text-[11px] text-slate-400">
                  O'yinda barcha savollarga 15 soniyada javob berildi
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Aniq Natija
                </h4>
                <p className="text-[11px] text-slate-400">
                  React testidan 90% dan yuqori ball olindi
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Kitobxon Talaba
                </h4>
                <p className="text-[11px] text-slate-400">
                  2 ta to'liq kurs darslari yakunlandi
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Tables of Records: Test Results, Course Results, Game Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Natijalari */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-emerald-600" />
              Test natijalari
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{quizResults.length} ta</span>
          </div>

          <div className="space-y-3">
            {quizResults.map((qr, idx) => (
              <div
                key={idx}
                onClick={() => navigateToQuiz(qr.quizId)}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {qr.quizTitle}
                  </h4>
                  <span className="text-xs font-extrabold text-emerald-600">
                    {qr.percent}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>{qr.subject}</span>
                  <span>{qr.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kurs Natijalari */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Kurs natijalari
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{courses.length} ta</span>
          </div>

          <div className="space-y-3">
            {courses.slice(0, 4).map((c) => (
              <div
                key={c.id}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {c.title}
                  </h4>
                  <span className="text-xs font-extrabold text-blue-600">
                    {c.progressPercent}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${c.progressPercent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* O'yin Natijalari */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gamepad2 className="w-4 h-4 text-purple-600" />
              O‘yin natijalari
            </h3>
            <span className="text-xs text-slate-400 font-semibold">{gameResults.length} ta</span>
          </div>

          <div className="space-y-3">
            {gameResults.map((gr, idx) => (
              <div
                key={idx}
                onClick={() => navigateToGame(gr.gameId)}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                    {gr.gameTitle}
                  </h4>
                  <span className="text-xs font-extrabold text-amber-500">
                    +{gr.score} b
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                  <span>To'g'ri: {gr.correctAnswers} / Xato: {gr.wrongAnswers}</span>
                  <span>{gr.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
