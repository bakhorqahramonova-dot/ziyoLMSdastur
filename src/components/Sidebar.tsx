import React from 'react';
import {
  Home,
  BookOpen,
  Gamepad2,
  FileCheck2,
  Calendar,
  GraduationCap,
  Users,
  BarChart3,
  Bell,
  Settings,
  Sparkles,
  X,
  ChevronRight,
  Video,
  BookMarked,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { NavigationTab } from '../types';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, userProfile } = useLms();

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'dashboard', label: 'Bosh sahifa', icon: <Home className="w-5 h-5" /> },
    { id: 'courses', label: 'Kurslar', icon: <BookOpen className="w-5 h-5" />, badge: '6 ta' },
    { id: 'video-lessons', label: 'Video darslar', icon: <Video className="w-5 h-5 text-purple-500" />, badge: '9 ta' },
    { id: 'books', label: 'Kitoblar', icon: <BookMarked className="w-5 h-5 text-sky-500" />, badge: '8 ta' },
    { id: 'games', label: 'O‘yinlar', icon: <Gamepad2 className="w-5 h-5 text-indigo-500" />, badge: '5 ta' },
    { id: 'quizzes', label: 'Testlar', icon: <FileCheck2 className="w-5 h-5 text-emerald-500" />, badge: 'Yangi' },
    { id: 'schedule', label: 'Dars jadvali', icon: <Calendar className="w-5 h-5" /> },
    { id: 'students', label: 'O‘quvchilar', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'teachers', label: 'O‘qituvchilar', icon: <Users className="w-5 h-5" /> },
    { id: 'results', label: 'Natijalar', icon: <BarChart3 className="w-5 h-5" /> },
    { id: 'announcements', label: 'E\'lonlar', icon: <Bell className="w-5 h-5" />, badge: '4' },
    { id: 'settings', label: 'Sozlamalar', icon: <Settings className="w-5 h-5" /> },
  ];

  const handleNavClick = (tabId: NavigationTab) => {
    setActiveTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 px-6 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
          <div
            onClick={() => handleNavClick('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ZiyoLMS
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 rounded-md">
                  PRO
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Zamonaviy Ta'lim Tizimi
              </p>
            </div>
          </div>

          <button
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Menyuni yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Quick Info */}
        <div className="p-4 mx-3 my-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex items-center gap-3">
          <img
            src={userProfile.avatar}
            alt={userProfile.firstName}
            className="w-11 h-11 rounded-full object-cover ring-2 ring-indigo-500/30"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {userProfile.firstName} {userProfile.lastName}
            </h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {userProfile.totalPoints} Ball • #{userProfile.rank} O'rin
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-2 overflow-y-auto space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Asosiy Bo'limlar
          </div>
          {navItems.map((item) => {
            const isActive =
              activeTab === item.id ||
              (item.id === 'courses' && activeTab === 'course-detail') ||
              (item.id === 'games' && activeTab === 'game-play') ||
              (item.id === 'quizzes' && activeTab === 'quiz-play');

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25 translate-x-1'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? 'text-white' : ''}>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full font-medium ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer Banner */}
        <div className="p-4 m-3 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 text-white rounded-2xl relative overflow-hidden shadow-lg">
          <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-indigo-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>O'quv Faolligi</span>
          </div>
          <p className="text-xs text-slate-300 mb-3">
            Bugun 1 ta o'yin va 1 ta darsni tugatdingiz. Reytingda yuqorilang!
          </p>
          <button
            onClick={() => handleNavClick('games')}
            className="w-full py-2 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 backdrop-blur-xs border border-white/10"
          >
            <span>O'yinlarni boshlash</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>
    </>
  );
};
