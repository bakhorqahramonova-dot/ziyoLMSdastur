import React, { useState, useRef, useEffect } from 'react';
import {
  Menu,
  Moon,
  Sun,
  Bell,
  Search,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { NavigationTab } from '../types';

interface NavbarProps {
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    settings,
    toggleTheme,
    announcements,
    courses,
    navigateToCourse,
    navigateToGame,
    navigateToQuiz,
  } = useLms();

  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const tabTitles: Record<NavigationTab, string> = {
    dashboard: 'Bosh sahifa',
    courses: 'Kurslar katalogi',
    'course-detail': 'Kurs mundarijasi va darslar',
    games: 'Interaktiv O‘yinlar',
    'game-play': 'O‘yin maydoni',
    quizzes: 'Bilimni sinash testlari',
    'quiz-play': 'Test topshirish oynasi',
    schedule: 'Haftalik dars jadvali',
    students: 'O‘quvchilar ro‘yxati',
    teachers: 'O‘qituvchilar jamoasi',
    results: 'Natijalar va tahliliy hisobot',
    announcements: 'Rasmiy e\'lonlar va yangiliklar',
    'video-lessons': 'Video Darslar va Ma\'ruzalar',
    books: 'Elektron Kutubxona va Darsliklar',
    profile: 'Mening profilim',
    settings: 'Tizim sozlamalari',
  };

  // Filtered search items
  const filteredCourses = searchQuery.trim()
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.teacher.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <>
      <header className="sticky top-0 z-30 h-20 bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          {/* Left: Mobile hamburger & Page Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileMenu}
              className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Menyuni ochish"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  {tabTitles[activeTab]}
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                Ilm olish va shaxsiy rivojlanish maydoni
              </p>
            </div>
          </div>

          {/* Center: Search button */}
          <div className="flex-1 max-w-md hidden md:block">
            <div
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 rounded-xl cursor-pointer text-slate-400 dark:text-slate-500 transition border border-transparent hover:border-slate-300 dark:hover:border-slate-700"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-medium flex-1 text-slate-500 dark:text-slate-400">
                Kurslar, o'yinlar yoki testlarni qidirish...
              </span>
              <kbd className="px-1.5 py-0.5 text-[10px] bg-white dark:bg-slate-900 rounded font-mono border border-slate-200 dark:border-slate-700 text-slate-400">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile search trigger */}
            <button
              onClick={() => setShowSearchModal(true)}
              className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Qidirish"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200/60 dark:border-slate-700/60"
              title={settings.theme === 'dark' ? 'Kunduzgi rejim' : 'Tungi rejim'}
              aria-label="Mavzuni almashtirish"
            >
              {settings.theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-indigo-600" />
              )}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition border border-slate-200/60 dark:border-slate-700/60"
                aria-label="Bildirishnomalar"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white dark:ring-slate-900" />
              </button>

              {showNotifDropdown && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900 dark:text-white">
                        Bildirishnomalar
                      </span>
                      <span className="px-2 py-0.5 text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 rounded-full font-bold">
                        {announcements.length}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setShowNotifDropdown(false);
                        setActiveTab('announcements');
                      }}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Barchasi
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto mt-2">
                    {announcements.slice(0, 3).map((ann) => (
                      <div
                        key={ann.id}
                        onClick={() => {
                          setShowNotifDropdown(false);
                          setActiveTab('announcements');
                        }}
                        className="py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl px-2 cursor-pointer transition"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                            {ann.category}
                          </span>
                          <span className="text-[11px] text-slate-400">{ann.date}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1 line-clamp-1">
                          {ann.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                          {ann.content}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar trigger */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2.5 pl-2 cursor-pointer group"
              title="Mening profilim"
            >
              <div className="relative">
                <img
                  src={userProfile.avatar}
                  alt={userProfile.firstName}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-blue-500/50 group-hover:ring-blue-500 transition"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {userProfile.firstName} {userProfile.lastName}
                </p>
                <p className="text-[11px] text-slate-400">
                  {userProfile.totalPoints} Ball
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      {showSearchModal && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={() => setShowSearchModal(false)}
        >
          <div
            className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-indigo-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Kurs, o'yin, test yoki mavzuni yozing..."
                className="w-full bg-transparent text-sm font-medium text-slate-900 dark:text-white outline-hidden placeholder:text-slate-400"
                autoFocus
              />
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-xs px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold"
              >
                ESC
              </button>
            </div>

            <div className="p-4 max-h-96 overflow-y-auto space-y-4">
              {searchQuery.trim() === '' ? (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Tezkor bo'limlar
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => {
                        setShowSearchModal(false);
                        setActiveTab('courses');
                      }}
                      className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 transition flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        📚 Kurslar katalogi
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchModal(false);
                        setActiveTab('games');
                      }}
                      className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 transition flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        🎮 Barcha o'yinlar
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchModal(false);
                        setActiveTab('quizzes');
                      }}
                      className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 transition flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        📝 Sinov testlari
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchModal(false);
                        setActiveTab('video-lessons');
                      }}
                      className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 border border-slate-100 dark:border-slate-800 transition flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        🎥 Video darslar
                      </span>
                      <ArrowRight className="w-4 h-4 text-purple-400" />
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchModal(false);
                        setActiveTab('books');
                      }}
                      className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 transition flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        📖 Kitoblar (Kutubxona)
                      </span>
                      <ArrowRight className="w-4 h-4 text-blue-400" />
                    </button>
                    <button
                      onClick={() => {
                        setShowSearchModal(false);
                        setActiveTab('schedule');
                      }}
                      className="p-3 text-left rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 border border-slate-100 dark:border-slate-800 transition flex items-center justify-between"
                    >
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                        📅 Dars jadvali
                      </span>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Topilgan natijalar ({filteredCourses.length})
                  </h4>
                  {filteredCourses.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">
                      Hech qanday ma'lumot topilmadi. Qidiruv so'zini o'zgartirib ko'ring.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {filteredCourses.map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setShowSearchModal(false);
                            navigateToCourse(c.id);
                          }}
                          className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-100 dark:border-slate-800 cursor-pointer transition flex items-center gap-3"
                        >
                          <img
                            src={c.image}
                            alt={c.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {c.title}
                            </h5>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400">
                              O'qituvchi: {c.teacher} • {c.duration}
                            </p>
                          </div>
                          <span className="text-xs text-blue-600 font-bold">Ochish →</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
