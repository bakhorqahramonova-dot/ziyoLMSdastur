import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Award,
  Gamepad2,
  FileCheck2,
  Edit3,
  Check,
  X,
  Camera,
  GraduationCap,
  Sparkles,
  Key,
  Shield,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export const ProfilePage: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    courses,
    gameResults,
    quizResults,
    navigateToCourse,
    navigateToGame,
    navigateToQuiz,
  } = useLms();

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState(userProfile.firstName);
  const [lastName, setLastName] = useState(userProfile.lastName);
  const [email, setEmail] = useState(userProfile.email);
  const [phone, setPhone] = useState(userProfile.phone);
  const [grade, setGrade] = useState(userProfile.grade);
  const [school, setSchool] = useState(userProfile.school);
  const [bio, setBio] = useState(userProfile.bio);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      firstName,
      lastName,
      email,
      phone,
      grade,
      school,
      bio,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFirstName(userProfile.firstName);
    setLastName(userProfile.lastName);
    setEmail(userProfile.email);
    setPhone(userProfile.phone);
    setGrade(userProfile.grade);
    setSchool(userProfile.school);
    setBio(userProfile.bio);
    setIsEditing(false);
  };

  const inProgressCourses = courses.filter((c) => !c.isCompleted);

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar with status */}
          <div className="relative group shrink-0">
            <img
              src={userProfile.avatar}
              alt={userProfile.firstName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-indigo-500/30 shadow-lg"
            />
            <span className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {userProfile.firstName} {userProfile.lastName}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                  {userProfile.role} • {userProfile.school}
                </p>
              </div>

              {/* “Profilni tahrirlash” tugmasi */}
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 self-center sm:self-auto border border-indigo-200 dark:border-indigo-800"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Profilni tahrirlash</span>
                </button>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {userProfile.bio}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {userProfile.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {userProfile.phone}
              </span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                {userProfile.grade}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Quick Badges Bar */}
        <div className="grid grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Umumiy ball</span>
            <span className="text-lg font-black text-amber-500">
              ★ {userProfile.totalPoints}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Guruhdagi o'rin</span>
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              #{userProfile.rank}
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60">
            <span className="text-[10px] text-slate-400 block font-semibold">Kurslar soni</span>
            <span className="text-lg font-black text-emerald-600">
              {courses.length} ta
            </span>
          </div>
        </div>
      </div>

      {/* Editing Form */}
      {isEditing && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-600" />
              Profil ma'lumotlarini tahrirlash
            </h3>
            <button onClick={handleCancel} className="text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ism
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Familiya
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Ta'lim muassasasi
                </label>
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Bosqich / Guruh
                </label>
                <input
                  type="text"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Shaxsiy bio (Men haqimda)
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
              >
                Bekor qilish
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Saqlash ✓
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 1. O‘qiyotgan kurslari */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-600" />
          O‘qiyotgan kurslari
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inProgressCourses.map((c) => (
            <div
              key={c.id}
              onClick={() => navigateToCourse(c.id)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-700 cursor-pointer transition flex items-center gap-3.5"
            >
              <img
                src={c.image}
                alt={c.title}
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {c.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Ustoz: {c.teacher}
                </p>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-blue-600 font-extrabold">
                    {c.progressPercent}% yakunlandi
                  </span>
                  <span className="text-slate-400">{c.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security and Credentials Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-500" />
            Kirish Logini va Xavfsizlik Holati
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            Himoyalangan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <span className="text-[11px] text-slate-400 block font-semibold">Tizim logini</span>
            <span className="text-sm font-mono font-bold text-slate-800 dark:text-slate-100">
              j.rustamov24
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <span className="text-[11px] text-slate-400 block font-semibold">Talaba ID kodi</span>
            <span className="text-sm font-mono font-bold text-indigo-600 dark:text-indigo-400">
              STU-2024-001
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
            <span className="text-[11px] text-slate-400 block font-semibold">Parol darajasi</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
              Juda xavfsiz (12 belgi)
            </span>
          </div>
        </div>
      </div>

      {/* 2. O‘yin natijalari & Test natijalari Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* O'yin natijalari */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-indigo-600" />
            O‘yin natijalari
          </h3>

          <div className="space-y-3">
            {gameResults.map((gr, idx) => (
              <div
                key={idx}
                onClick={() => navigateToGame(gr.gameId)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {gr.gameTitle}
                  </h4>
                  <span className="text-[11px] text-slate-400">{gr.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-amber-500">
                    +{gr.score} Ball
                  </span>
                  <span className="text-[10px] text-emerald-600 block">
                    {gr.percent}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Test natijalari */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-emerald-600" />
            Test natijalari
          </h3>

          <div className="space-y-3">
            {quizResults.map((qr, idx) => (
              <div
                key={idx}
                onClick={() => navigateToQuiz(qr.quizId)}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[180px]">
                    {qr.quizTitle}
                  </h4>
                  <span className="text-[11px] text-slate-400">{qr.date}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-emerald-600">
                    {qr.percent}%
                  </span>
                  <span className="text-[10px] text-indigo-500 block">
                    {qr.passed ? 'Muvaffaqiyatli' : 'Yiqildi'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
