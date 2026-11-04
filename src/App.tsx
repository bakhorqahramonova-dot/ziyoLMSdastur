/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LmsProvider, useLms } from './context/LmsContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { GamesPage } from './pages/GamesPage';
import { GamePlayerPage } from './pages/GamePlayerPage';
import { QuizzesPage } from './pages/QuizzesPage';
import { QuizPlayerPage } from './pages/QuizPlayerPage';
import { SchedulePage } from './pages/SchedulePage';
import { StudentsPage } from './pages/StudentsPage';
import { TeachersPage } from './pages/TeachersPage';
import { ResultsPage } from './pages/ResultsPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { BooksPage } from './pages/BooksPage';
import { VideoLessonsPage } from './pages/VideoLessonsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const LmsMainLayout: React.FC = () => {
  const { activeTab, toastMessage } = useLms();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage />;
      case 'courses':
        return <CoursesPage />;
      case 'course-detail':
        return <CourseDetailPage />;
      case 'video-lessons':
        return <VideoLessonsPage />;
      case 'books':
        return <BooksPage />;
      case 'games':
        return <GamesPage />;
      case 'game-play':
        return <GamePlayerPage />;
      case 'quizzes':
        return <QuizzesPage />;
      case 'quiz-play':
        return <QuizPlayerPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'students':
        return <StudentsPage />;
      case 'teachers':
        return <TeachersPage />;
      case 'results':
        return <ResultsPage />;
      case 'announcements':
        return <AnnouncementsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Toast feedback notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
          <div className="px-4 py-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 dark:border-slate-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex-1 flex flex-col min-w-0">
        <Navbar onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActivePage()}
        </main>

        {/* Professional Footer */}
        <footer className="mt-auto border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-6 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-2 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ZiyoLMS — Barcha huquqlar himoyalangan © 2026</span>
            </div>

            <div className="flex items-center gap-6 font-medium">
              <span>Platforma versiyasi: v2.5 Pro</span>
              <span>•</span>
              <span>O'zbekiston Respublikasi ta'lim standarti</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <LmsProvider>
      <LmsMainLayout />
    </LmsProvider>
  );
}
