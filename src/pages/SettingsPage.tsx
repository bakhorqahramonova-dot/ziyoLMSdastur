import React, { useState } from 'react';
import {
  Settings,
  User,
  Lock,
  Globe,
  Bell,
  Moon,
  Sun,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';

export const SettingsPage: React.FC = () => {
  const {
    userProfile,
    updateUserProfile,
    settings,
    updateSettings,
    toggleTheme,
    showToast,
  } = useLms();

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Quick Profile state
  const [fullName, setFullName] = useState(`${userProfile.firstName} ${userProfile.lastName}`);
  const [phone, setPhone] = useState(userProfile.phone);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    const parts = fullName.trim().split(' ');
    const fName = parts[0] || userProfile.firstName;
    const lName = parts.slice(1).join(' ') || userProfile.lastName;
    updateUserProfile({ firstName: fName, lastName: lName, phone });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (newPassword.length < 6) {
      setPasswordError('Yangi parol kamida 6 ta belgidan iborat bo‘lishi kerak!');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Yangi parollar bir-biriga mos kelmadi!');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Parol muvaffaqiyatli o‘zgartirildi!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          ⚙️ Tizim Sozlamalari
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Hisob xavfsizligi, interfeys rejimi, til va bildirishnomalarni boshqarish
        </p>
      </div>

      {/* 1. Tungi rejim / Dark mode sozlamasi */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
              {settings.theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-amber-500" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Mavzu rejimi (Dark mode)
              </h3>
              <p className="text-xs text-slate-500">
                Ko'zingizni toliqtirmaslik uchun kunduzgi yoki tungi interfeysni tanlang
              </p>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 border ${
              settings.theme === 'dark'
                ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
            }`}
          >
            {settings.theme === 'dark' ? 'Tungi rejim faol' : 'Kunduzgi rejim faol'}
          </button>
        </div>
      </div>

      {/* 2. Til (Language) sozlamasi */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Tizim tili
            </h3>
            <p className="text-xs text-slate-500">
              Platforma interfeysi va dars materiallari uchun asosiy til
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { id: 'uz', name: 'O‘zbekcha (Lotin)', desc: 'Asosiy til' },
            { id: 'ru', name: 'Русский', desc: 'Qo\'shimcha' },
            { id: 'en', name: 'English', desc: 'International' },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => {
                updateSettings({ language: lang.id as 'uz' | 'ru' | 'en' });
                showToast(`Til "${lang.name}"ga o'zgartirildi!`);
              }}
              className={`p-4 rounded-2xl border-2 text-left transition flex items-center justify-between ${
                settings.language === lang.id
                  ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-slate-900 dark:text-white shadow-xs'
                  : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300'
              }`}
            >
              <div>
                <span className="text-xs font-bold block">{lang.name}</span>
                <span className="text-[11px] text-slate-400">{lang.desc}</span>
              </div>
              {settings.language === lang.id && (
                <Check className="w-4 h-4 text-indigo-600 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Bildirishnomalar (Notifications) */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Bildirishnomalar
            </h3>
            <p className="text-xs text-slate-500">
              Muhim xabarlar va dars vaqtlari haqida eslatmalar
            </p>
          </div>
        </div>

        <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Email orqali xabarnomalar
              </h4>
              <p className="text-[11px] text-slate-400">
                Kurs yangiliklari va imtihon sanalari pochtaga yuborilsin
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={(e) =>
                updateSettings({ emailNotifications: e.target.checked })
              }
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Brauzer Push bildirishnomalari
              </h4>
              <p className="text-[11px] text-slate-400">
                O'yin natijalari va yangi e'lonlar haqida pop-up xabarlar
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.pushNotifications}
              onChange={(e) =>
                updateSettings({ pushNotifications: e.target.checked })
              }
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Dars jadvali eslatmalari
              </h4>
              <p className="text-[11px] text-slate-400">
                Dars boshlanishidan 15 daqiqa oldin eslatma olish
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.lessonReminders}
              onChange={(e) =>
                updateSettings({ lessonReminders: e.target.checked })
              }
              className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Parolni o‘zgartirish */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Parolni o‘zgartirish
            </h3>
            <p className="text-xs text-slate-500">
              Hisobingiz xavfsizligi uchun kuchli paroldan foydalaning
            </p>
          </div>
        </div>

        {passwordError && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 font-semibold">
            {passwordError}
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
            Parol muvaffaqiyatli saqlandi!
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Hozirgi parol
            </label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Yangi parol
            </label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Kamida 6 ta belgi"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
              Yangi parolni tasdiqlash
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Qayta kiriting"
              className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Parolni yangilash
          </button>
        </form>
      </div>
    </div>
  );
};
