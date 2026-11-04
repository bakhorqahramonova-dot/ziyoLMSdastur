import React, { useState } from 'react';
import {
  Shield,
  Key,
  User,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Lock,
  Unlock,
  Smartphone,
  ExternalLink,
  X,
  AlertTriangle,
  Sparkles,
} from 'lucide-react';
import { Student } from '../types';
import { useLms } from '../context/LmsContext';
import {
  generateSecurePassword,
  calculatePasswordStrength,
} from '../utils/security';

interface StudentCredentialsModalProps {
  student: Student;
  onClose: () => void;
}

export const StudentCredentialsModal: React.FC<StudentCredentialsModalProps> = ({
  student,
  onClose,
}) => {
  const {
    resetStudentPassword,
    updateStudentCredentials,
    toggleStudentAccountLock,
    toggleStudent2FA,
    loginAsStudent,
    showToast,
  } = useLms();

  const [showPassword, setShowPassword] = useState(false);
  const [currentPass, setCurrentPass] = useState(student.password || 'Ziyo#2024!Sec');
  const [copiedLogin, setCopiedLogin] = useState(false);
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isEditingCustom, setIsEditingCustom] = useState(false);
  const [customUsername, setCustomUsername] = useState(student.username || '');

  const strength = calculatePasswordStrength(currentPass);

  const handleCopy = (text: string, type: 'login' | 'pass' | 'all') => {
    navigator.clipboard.writeText(text);
    if (type === 'login') {
      setCopiedLogin(true);
      setTimeout(() => setCopiedLogin(false), 2000);
      showToast('Login nusxalandi!');
    } else if (type === 'pass') {
      setCopiedPass(true);
      setTimeout(() => setCopiedPass(false), 2000);
      showToast('Xavfsiz parol nusxalandi!');
    } else {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
      showToast('To‘liq kirish ma\'lumotlari nusxalandi!');
    }
  };

  const handleGenerateNewPassword = () => {
    const newPass = generateSecurePassword(12);
    setCurrentPass(newPass);
    resetStudentPassword(student.id, newPass);
  };

  const handleSaveCustomCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudentCredentials(student.id, {
      username: customUsername.trim() || student.username,
      password: currentPass,
      passwordStrength: strength.label,
    });
    setIsEditingCustom(false);
  };

  const fullCredentialsText = `🎓 ZiyoLMS Ta'lim Platformasi
Talaba: ${student.fullName}
Guruh: ${student.group}
Talaba ID: ${student.studentIdCode}
---------------------------
🔐 Login: ${student.username}
🔑 Parol: ${currentPass}
---------------------------
Tizimga kirish: https://ziyolms.uz/login`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden space-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <Shield className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Xavfsiz Kirish Ma'lumotlari
              </h3>
              <p className="text-xs text-indigo-100">
                {student.fullName} ({student.studentIdCode})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Status warning if account is locked */}
          {student.isAccountLocked && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-xs text-rose-700 dark:text-rose-300">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <div>
                <span className="font-bold block">Hisob vaqtincha bloklangan</span>
                <span>Ushbu o'quvchi tizimga kirishi cheklangan.</span>
              </div>
            </div>
          )}

          {/* Login Details Box */}
          <div className="space-y-4">
            {/* 1. Login (Username) */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" />
                  O‘quvchi Logini (Username)
                </span>
                <span className="text-[11px] text-slate-400">
                  ID: {student.studentIdCode}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-mono font-bold text-slate-900 dark:text-white select-all">
                  {student.username}
                </div>
                <button
                  onClick={() => handleCopy(student.username, 'login')}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition border border-slate-200 dark:border-slate-700"
                  title="Logindan nusxa olish"
                >
                  {copiedLogin ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* 2. Password with generator */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-emerald-500" />
                  Xavfsiz Parol (Password)
                </span>
                <span className={`text-[11px] font-extrabold ${strength.color}`}>
                  {strength.label} ({strength.score}%)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-900 dark:text-white select-all">
                    {showPassword ? currentPass : '••••••••••••'}
                  </span>
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleCopy(currentPass, 'pass')}
                  className="p-3 rounded-xl bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition border border-slate-200 dark:border-slate-700"
                  title="Paroldan nusxa olish"
                >
                  {copiedPass ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={handleGenerateNewPassword}
                  className="p-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm"
                  title="Yangi xavfsiz parol generatsiya qilish"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              {/* Password strength progress bar */}
              <div className="mt-2 space-y-1">
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full ${strength.bgColor} transition-all duration-300`}
                    style={{ width: `${strength.score}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span>Katta & kichik harflar, raqam va belgilar</span>
                  <span>12 belgi • 128-bit Entropiya</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Security Settings (2FA, Account Lock) */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Xavfsizlik Sozlamalari
            </h4>

            {/* 2FA Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Smartphone className="w-4 h-4 text-indigo-500" />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Ikki bosqichli himoya (2FA)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Kirishda SMS yoki Authenticator kodi talab qilinadi
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleStudent2FA(student.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  student.twoFactorEnabled
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                }`}
              >
                {student.twoFactorEnabled ? 'Yoqilgan ✓' : 'O\'chirilgan'}
              </button>
            </div>

            {/* Account Lock Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2.5">
                {student.isAccountLocked ? (
                  <Lock className="w-4 h-4 text-rose-500" />
                ) : (
                  <Unlock className="w-4 h-4 text-emerald-500" />
                )}
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                    Hisob holati
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Oxirgi faollik: {student.lastLogin || 'Mavjud emas'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => toggleStudentAccountLock(student.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  student.isAccountLocked
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                    : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}
              >
                {student.isAccountLocked ? 'Bloklangan' : 'Faol'}
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
            {/* Copy full credential card */}
            <button
              onClick={() => handleCopy(fullCredentialsText, 'all')}
              className="w-full sm:flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              {copiedAll ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
              <span>Ma'lumotlarni nusxalash</span>
            </button>

            {/* Login as student to test */}
            <button
              onClick={() => {
                loginAsStudent(student);
                onClose();
              }}
              className="w-full sm:flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95"
            >
              <ExternalLink className="w-4 h-4" />
              <span>O'quvchi sifatida kirish</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
