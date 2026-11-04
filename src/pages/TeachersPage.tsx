import React, { useState } from 'react';
import {
  Users,
  Search,
  Star,
  Mail,
  Phone,
  BookOpen,
  GraduationCap,
  Briefcase,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export const TeachersPage: React.FC = () => {
  const { teachers, showToast } = useLms();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeachers = teachers.filter((t) => {
    return (
      t.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            👨‍🏫 O‘qituvchilar va Mentorlar Jamoasi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Yuqori malakali professor-o'qituvchilar, amaliyotchi dasturchilar va tadqiqotchilar
          </p>
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="O'qituvchi yoki fanni qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Teachers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeachers.map((teacher) => (
          <div
            key={teacher.id}
            className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between space-y-5"
          >
            <div>
              <div className="flex items-start gap-4">
                <img
                  src={teacher.avatar}
                  alt={teacher.fullName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-xs"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mb-0.5">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{teacher.rating}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate">
                    {teacher.fullName}
                  </h3>
                  <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    {teacher.subject}
                  </p>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                    <Briefcase className="w-3 h-3" />
                    Tajriba: {teacher.experience}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 line-clamp-3 leading-relaxed">
                {teacher.bio}
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">Kurslar</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {teacher.coursesCount} ta
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
                  <span className="text-[10px] text-slate-400 block font-semibold">O'quvchilar</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {teacher.studentsCount}+ ta
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-2 truncate">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{teacher.phone}</span>
                </div>
              </div>

              <button
                onClick={() => showToast(`Ustoz ${teacher.fullName} ga xabar yuborish formasi ochildi.`)}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-indigo-600 hover:text-white dark:bg-slate-800 dark:hover:bg-indigo-600 dark:hover:text-white text-slate-800 dark:text-slate-200 rounded-xl font-bold text-xs transition"
              >
                Xabar yozish
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
