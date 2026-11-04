import React from 'react';
import {
  BookOpen,
  Gamepad2,
  FileCheck2,
  Calendar,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Play,
  CheckCircle2,
  CalendarDays,
  Target,
  Video,
  BookMarked,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export const DashboardPage: React.FC = () => {
  const {
    userProfile,
    courses,
    gameResults,
    quizResults,
    schedule,
    videoLessons,
    books,
    setActiveTab,
    navigateToCourse,
    navigateToGame,
    navigateToQuiz,
  } = useLms();

  // Metrics
  const totalCoursesCount = courses.length;
  const inProgressCourses = courses.filter((c) => !c.isCompleted);
  const completedCourses = courses.filter((c) => c.isCompleted);
  const totalGamesCount = 5;

  // Average Score calculation
  const allPercents = [
    ...courses.map((c) => c.progressPercent),
    ...quizResults.map((q) => q.percent),
    ...gameResults.map((g) => g.percent),
  ];
  const averageScore =
    allPercents.length > 0
      ? Math.round(allPercents.reduce((a, b) => a + b, 0) / allPercents.length)
      : 88;

  // Today's classes (e.g. Dushanba)
  const todayClasses = schedule.filter((s) => s.day === 'Dushanba');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white p-6 sm:p-8 lg:p-10 shadow-xl shadow-indigo-950/10">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold mb-3 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ZiyoLMS — Bilim va mahorat maydoni</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight">
              Xush kelibsiz, {userProfile.firstName} {userProfile.lastName}! 👋
            </h2>
            <p className="mt-2 text-sm sm:text-base text-indigo-100 max-w-xl">
              Bugun o'rganish uchun ajoyib kun. Rejangizdagi darslarni davom ettiring,
              intellektual o'yinlarda ball to'plang va bilimingizni mustahkamlang!
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => setActiveTab('courses')}
                className="px-5 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 rounded-xl text-sm font-bold shadow-md transition flex items-center gap-2 active:scale-95"
              >
                <span>Kurslarga kirish</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('games')}
                className="px-5 py-2.5 bg-indigo-600/60 hover:bg-indigo-600/80 text-white rounded-xl text-sm font-bold border border-white/20 backdrop-blur-xs transition flex items-center gap-2 active:scale-95"
              >
                <Gamepad2 className="w-4 h-4 text-amber-300" />
                <span>O‘yinlarni boshlash</span>
              </button>
            </div>
          </div>

          {/* Quick Profile Summary Badge */}
          <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 sm:p-5 flex items-center gap-4 lg:w-80">
            <img
              src={userProfile.avatar}
              alt={userProfile.firstName}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30"
            />
            <div className="min-w-0">
              <span className="text-xs text-indigo-200 font-medium">Foydalanuvchi</span>
              <h3 className="text-base font-bold text-white truncate">
                {userProfile.firstName} {userProfile.lastName}
              </h3>
              <p className="text-xs text-indigo-100 truncate">{userProfile.grade}</p>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-300">
                  ★ {userProfile.totalPoints} Ball
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/20">
                  Reyting: #{userProfile.rank}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Main Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Total Courses */}
        <div
          onClick={() => setActiveTab('courses')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-blue-400 dark:hover:border-blue-600"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Jami kurslar
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalCoursesCount}
            </span>
            <span className="text-xs text-slate-400">ta</span>
          </div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => setActiveTab('courses')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-amber-400 dark:hover:border-amber-600"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            O‘tilayotgan kurslar
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {inProgressCourses.length}
            </span>
            <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Faol</span>
          </div>
        </div>

        {/* Completed Courses */}
        <div
          onClick={() => setActiveTab('courses')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-emerald-400 dark:hover:border-emerald-600"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Tugatilgan kurslar
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {completedCourses.length}
            </span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">Bitirilgan</span>
          </div>
        </div>

        {/* Average Score */}
        <div
          onClick={() => setActiveTab('results')}
          className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-purple-400 dark:hover:border-purple-600"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            O‘rtacha natija
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {averageScore}%
            </span>
            <span className="text-xs text-purple-600 dark:text-purple-400 font-semibold">A'lo</span>
          </div>
        </div>

        {/* Games count */}
        <div
          onClick={() => setActiveTab('games')}
          className="col-span-2 sm:col-span-1 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition cursor-pointer group hover:border-pink-400 dark:hover:border-pink-600"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            O‘yinlar soni
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {totalGamesCount}
            </span>
            <span className="text-xs text-pink-600 dark:text-pink-400 font-semibold">Interaktiv</span>
          </div>
        </div>
      </div>

      {/* Tezkor Kirish Tugmalari */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          Tezkor kirish tugmalari
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {/* Kurslarga kirish */}
          <button
            onClick={() => setActiveTab('courses')}
            className="group p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all text-left flex flex-col justify-between"
          >
            <div>
              <BookOpen className="w-6 h-6 mb-2 text-blue-100 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold">Kurslarga kirish</h4>
              <p className="text-xs text-blue-100/90 mt-0.5">Barcha darslar</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-blue-100">
              <span>{courses.length} kurs</span>
              <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Video darslar */}
          <button
            onClick={() => setActiveTab('video-lessons')}
            className="group p-4 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 transition-all text-left flex flex-col justify-between"
          >
            <div>
              <Video className="w-6 h-6 mb-2 text-purple-100 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold">Video darslar</h4>
              <p className="text-xs text-purple-100/90 mt-0.5">Videoma'ruzalar</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-purple-100">
              <span>{videoLessons.length} dars</span>
              <ArrowRight className="w-4 h-4 text-purple-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Kitoblar */}
          <button
            onClick={() => setActiveTab('books')}
            className="group p-4 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all text-left flex flex-col justify-between"
          >
            <div>
              <BookMarked className="w-6 h-6 mb-2 text-sky-100 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold">Kutubxona</h4>
              <p className="text-xs text-sky-100/90 mt-0.5">Elektron kitoblar</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-sky-100">
              <span>{books.length} kitob</span>
              <ArrowRight className="w-4 h-4 text-sky-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* O‘yinlarni boshlash */}
          <button
            onClick={() => setActiveTab('games')}
            className="group p-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-600 text-white shadow-md shadow-pink-500/20 hover:shadow-lg hover:shadow-pink-500/30 transition-all text-left flex flex-col justify-between"
          >
            <div>
              <Gamepad2 className="w-6 h-6 mb-2 text-pink-100 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold">O‘yinlar</h4>
              <p className="text-xs text-pink-100/90 mt-0.5">5 ta interaktiv</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-pink-100">
              <span>Bellashuvlar</span>
              <ArrowRight className="w-4 h-4 text-pink-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Test ishlash */}
          <button
            onClick={() => setActiveTab('quizzes')}
            className="group p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all text-left flex flex-col justify-between"
          >
            <div>
              <FileCheck2 className="w-6 h-6 mb-2 text-emerald-100 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold">Test ishlash</h4>
              <p className="text-xs text-emerald-100/90 mt-0.5">Sinov va baholash</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-emerald-100">
              <span>Bilimni tekshirish</span>
              <ArrowRight className="w-4 h-4 text-emerald-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Dars jadvali */}
          <button
            onClick={() => setActiveTab('schedule')}
            className="group p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 transition-all text-left flex flex-col justify-between"
          >
            <div>
              <Calendar className="w-6 h-6 mb-2 text-amber-100 group-hover:scale-110 transition-transform" />
              <h4 className="text-sm font-bold">Dars jadvali</h4>
              <p className="text-xs text-amber-100/90 mt-0.5">Haftalik reja</p>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-amber-100">
              <span>6 kunlik</span>
              <ArrowRight className="w-4 h-4 text-amber-200 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Two-Column Grid: Continuing Courses & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: In-Progress Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                O‘rganishni davom ettiring
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Siz faol qatnashayotgan eng so'nggi kurslar
              </p>
            </div>
            <button
              onClick={() => setActiveTab('courses')}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>Barcha kurslar</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {courses.slice(0, 3).map((course) => (
              <div
                key={course.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center gap-5"
              >
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full sm:w-36 h-24 rounded-xl object-cover"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
                      {course.category}
                    </span>
                    <span className="text-xs text-slate-400">• {course.duration}</span>
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                    {course.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    O'qituvchi: {course.teacher}
                  </p>

                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium">O'zlashtirish foizi:</span>
                      <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
                        {course.progressPercent}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
                        style={{ width: `${course.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => navigateToCourse(course.id)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-indigo-600 dark:hover:bg-indigo-500 dark:hover:text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-2 shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Kursga kirish</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Recent Activities & Today's Schedule */}
        <div className="space-y-6">
          {/* Today's Schedule card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                Bugungi dars jadvali
              </h3>
              <button
                onClick={() => setActiveTab('schedule')}
                className="text-xs text-blue-600 font-bold hover:underline"
              >
                Jadval →
              </button>
            </div>

            <div className="space-y-2.5">
              {todayClasses.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-xl border-l-4 ${item.color} bg-slate-50/50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800/60`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.subject}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {item.startTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>{item.teacher}</span>
                    <span className="font-medium text-indigo-600 dark:text-indigo-400">
                      {item.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Oxirgi faoliyatlar */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-500" />
              Oxirgi faoliyatlar
            </h3>

            <div className="space-y-3">
              {/* Game Activity */}
              {gameResults.slice(0, 2).map((gr, idx) => (
                <div
                  key={`gr-${idx}`}
                  onClick={() => navigateToGame(gr.gameId)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center shrink-0">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {gr.gameTitle}
                      </h4>
                      <span className="text-[10px] text-slate-400">{gr.date}</span>
                    </div>
                    <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                      +{gr.score} ball ({gr.percent}%)
                    </p>
                  </div>
                </div>
              ))}

              {/* Quiz Activity */}
              {quizResults.slice(0, 2).map((qr, idx) => (
                <div
                  key={`qr-${idx}`}
                  onClick={() => navigateToQuiz(qr.quizId)}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer flex items-center gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                    <FileCheck2 className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                        {qr.quizTitle}
                      </h4>
                      <span className="text-[10px] text-slate-400">{qr.date}</span>
                    </div>
                    <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
                      Natija: {qr.percent}% • Muvaffaqiyatli
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
