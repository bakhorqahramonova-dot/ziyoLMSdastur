import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Star,
  Users,
  Play,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export const CoursesPage: React.FC = () => {
  const { courses, navigateToCourse } = useLms();
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'Barchasi',
    'Axborot Texnologiyalari',
    'Sun\'iy Intellekt',
    'Kiberxavfsizlik',
    'Dizayn',
    'Xorijiy Tillar',
    'Aniq Fanlar',
  ];

  const filteredCourses = courses.filter((c) => {
    const matchesCategory =
      selectedCategory === 'Barchasi' || c.category === selectedCategory;
    const matchesSearch =
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            📚 Barcha Ta'lim Kurslari
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Yetakchi soha mutaxassislari tomonidan tayyorlangan video darslar, amaliy mashg'ulotlar va loyihalar
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs">
            Jami: {courses.length} ta kurs
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Kurs yoki o'qituvchini qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-hidden focus:border-blue-500"
          />
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group"
          >
            {/* Kurs Rasmi */}
            <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-900 dark:text-white backdrop-blur-md shadow-xs">
                  {course.category}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <div className="flex items-center gap-1 font-semibold">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>{course.rating}</span>
                </div>
                <div className="flex items-center gap-1 opacity-90">
                  <Users className="w-3.5 h-3.5" />
                  <span>{course.studentsCount} o'quvchi</span>
                </div>
              </div>
            </div>

            {/* Kurs Ma'lumotlari */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                {/* O'qituvchi */}
                <div className="flex items-center gap-2.5 mb-2">
                  <img
                    src={course.teacherAvatar}
                    alt={course.teacher}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                      {course.teacher}
                    </p>
                  </div>
                </div>

                {/* Kurs Nomi */}
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {course.title}
                </h3>

                {/* Kurs haqida ma'lumot */}
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Davomiyligi */}
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <span>Davomiyligi:</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {course.duration}
                  </span>
                </div>

                {/* O‘zlashtirish foizi */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500 dark:text-slate-400 font-medium">
                      O‘zlashtirish foizi:
                    </span>
                    <span className="font-extrabold text-blue-600 dark:text-blue-400">
                      {course.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        course.progressPercent === 100
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-blue-600 to-indigo-600'
                      }`}
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* “Kursga kirish” tugmasi */}
                <button
                  onClick={() => navigateToCourse(course.id)}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-blue-600 dark:bg-white dark:hover:bg-blue-500 text-white dark:text-slate-900 dark:hover:text-white rounded-xl font-bold text-xs shadow-sm transition flex items-center justify-center gap-2 active:scale-98"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Kursga kirish</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
