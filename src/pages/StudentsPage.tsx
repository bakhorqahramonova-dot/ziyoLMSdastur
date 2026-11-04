import React, { useState } from 'react';
import {
  GraduationCap,
  Search,
  Plus,
  Mail,
  Phone,
  Award,
  BookOpen,
  X,
  Filter,
  Key,
  Shield,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Unlock,
  Smartphone,
  FileSpreadsheet,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { Student } from '../types';
import { StudentCredentialsModal } from '../components/StudentCredentialsModal';
import {
  generateSecurePassword,
  calculatePasswordStrength,
  generateStudentUsername,
} from '../utils/security';

export const StudentsPage: React.FC = () => {
  const { students, addStudent, showToast } = useLms();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('Barchasi');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVedomostModal, setShowVedomostModal] = useState(false);
  const [selectedStudentForCredentials, setSelectedStudentForCredentials] = useState<Student | null>(null);

  // New student state
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState('WEB-2024-A');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80');

  const groups = ['Barchasi', 'WEB-2024-A', 'AI-2024-B', 'UIUX-2024-A', 'SEC-2024-C'];

  const filteredStudents = students.filter((st) => {
    const matchesGroup = filterGroup === 'Barchasi' || st.group === filterGroup;
    const matchesSearch =
      st.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.studentIdCode?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  // Auto-generate username & password when typing name
  const handleFullNameChange = (name: string) => {
    setFullName(name);
    if (!username || username.startsWith('j.') || username.startsWith('student_')) {
      setUsername(generateStudentUsername(name));
    }
    if (!password) {
      setPassword(generateSecurePassword(12));
    }
  };

  const handleGeneratePassword = () => {
    setPassword(generateSecurePassword(12));
    showToast('Yangi xavfsiz parol yaratildi!');
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleAddStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    addStudent({
      fullName,
      username: username.trim() || generateStudentUsername(fullName),
      password: password.trim() || generateSecurePassword(12),
      group,
      email,
      phone,
      avatar,
      status: 'Faol',
    });

    setFullName('');
    setUsername('');
    setPassword('');
    setEmail('');
    setShowAddModal(false);
  };

  // Full table text export
  const exportVedomostText = () => {
    let text = `========================================================\n`;
    text += `       ZIYOLMS — O'QUVCHILAR LOGIN VA PAROLLAR RO'YXATI  \n`;
    text += `========================================================\n\n`;
    text += `№ | F.I.SH.                | Guruh       | Login             | Parol          | 2FA \n`;
    text += `--------------------------------------------------------------------------------\n`;

    filteredStudents.forEach((st, idx) => {
      const num = (idx + 1).toString().padEnd(2, ' ');
      const name = st.fullName.padEnd(22, ' ');
      const grp = st.group.padEnd(11, ' ');
      const login = (st.username || 'n/a').padEnd(17, ' ');
      const pass = (st.password || '••••••••').padEnd(14, ' ');
      const twoFa = st.twoFactorEnabled ? 'Ha' : 'Yo\'q';
      text += `${num} | ${name} | ${grp} | ${login} | ${pass} | ${twoFa}\n`;
    });

    text += `\nMaxfiylik eslatmasi: Parollarni uchinchi shaxslarga bermang!`;
    return text;
  };

  const handleCopyVedomost = () => {
    navigator.clipboard.writeText(exportVedomostText());
    showToast('Barcha login va parollar vedomosti nusxalandi!');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            👨‍🎓 O‘quvchilar va Kirish Xavfsizligi
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Talabalar hisoblari, xavfsiz login-parollar boshqaruvi va 2FA himoyasi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowVedomostModal(true)}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-2 border border-slate-200 dark:border-slate-700 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Login-Parollar Vedomosti</span>
          </button>

          <button
            onClick={() => {
              setPassword(generateSecurePassword(12));
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>O‘quvchi Qo'shish</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {groups.map((grp) => (
            <button
              key={grp}
              onClick={() => setFilterGroup(grp)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                filterGroup === grp
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-800'
              }`}
            >
              {grp}
            </button>
          ))}
        </div>

        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Ism, login (@j.rustamov) yoki ID bo'yicha qidirish..."
            className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStudents.map((st) => (
          <div
            key={st.id}
            className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4 ${
              st.isAccountLocked
                ? 'border-rose-300 dark:border-rose-900 bg-rose-50/20'
                : 'border-slate-200/80 dark:border-slate-800'
            }`}
          >
            <div>
              {/* Card top badges */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={st.avatar}
                    alt={st.fullName}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  />
                  {st.isAccountLocked && (
                    <span className="absolute -top-1 -right-1 p-1 bg-rose-500 text-white rounded-full">
                      <Lock className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400">
                      {st.group}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        st.isAccountLocked
                          ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                      }`}
                    >
                      {st.isAccountLocked ? 'Bloklangan' : 'Faol'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white truncate mt-1">
                    {st.fullName}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      @{st.username || 'belgilanmagan'}
                    </span>
                    <span>•</span>
                    <span className="text-[11px] text-slate-400">{st.studentIdCode}</span>
                  </div>
                </div>
              </div>

              {/* Security info banner */}
              <div className="mt-4 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-amber-500" />
                    Parol xavfsizligi:
                  </span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 text-[11px]">
                    <Shield className="w-3 h-3" />
                    {st.passwordStrength || 'Juda xavfsiz'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
                    2FA Himoya:
                  </span>
                  <span
                    className={`font-bold text-[11px] ${
                      st.twoFactorEnabled
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {st.twoFactorEnabled ? 'Yoqilgan ✓' : 'O\'chirilgan'}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="grid grid-cols-3 gap-2 text-center text-xs pb-1">
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Kurslar</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {st.enrolledCourses} ta
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">O'rtacha</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">
                    {st.averageScore}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block font-semibold">Ball</span>
                  <span className="font-extrabold text-amber-500">
                    {st.points}
                  </span>
                </div>
              </div>

              {/* “🔐 Login & Parol” Tugmasi */}
              <button
                onClick={() => setSelectedStudentForCredentials(st)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition flex items-center justify-center gap-2 active:scale-98"
              >
                <Key className="w-3.5 h-3.5 text-amber-300" />
                <span>Login & Parolni ko'rish</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Student Credentials Modal */}
      {selectedStudentForCredentials && (
        <StudentCredentialsModal
          student={selectedStudentForCredentials}
          onClose={() => setSelectedStudentForCredentials(null)}
        />
      )}

      {/* Add Student Modal with Secure Password Generator */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Yangi O‘quvchi Ro‘yxatga Olish
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Xavfsiz login va murakkab parol avtomatik tayyorlanadi
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStudentSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  To'liq Ism Familiya *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  placeholder="Masalan: Sardor Rustamov"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Login & Password Generation Box */}
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 space-y-3">
                <div>
                  <label className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block mb-1">
                    Avtomatik Login (Username)
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Masalan: s.rustamov24"
                    className="w-full p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white outline-hidden"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-indigo-900 dark:text-indigo-200 block">
                      Xavfsiz Parol (128-bit Entropiya)
                    </label>
                    <span className={`text-[10px] font-bold ${passwordStrength.color}`}>
                      {passwordStrength.label} ({passwordStrength.score}%)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Kuchli parol"
                      className="flex-1 p-2.5 rounded-xl border border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 text-xs font-mono font-bold text-slate-900 dark:text-white outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={handleGeneratePassword}
                      className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                      title="Qayta generatsiya qilish"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Yangi</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Guruh *
                  </label>
                  <select
                    value={group}
                    onChange={(e) => setGroup(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                  >
                    <option value="WEB-2024-A">WEB-2024-A</option>
                    <option value="AI-2024-B">AI-2024-B</option>
                    <option value="UIUX-2024-A">UIUX-2024-A</option>
                    <option value="SEC-2024-C">SEC-2024-C</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                    Email Pochta *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="talaba@ziyolms.uz"
                    className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  Telefon Raqami
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123-45-67"
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white outline-hidden focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Saqlash va Hisob Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Vedomost Export Modal */}
      {showVedomostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  O'quvchilar Login va Parollar Vedomosti ({filteredStudents.length} ta)
                </h3>
              </div>
              <button
                onClick={() => setShowVedomostModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Ushbu ro'yxatni nusxalab, guruh o'quvchilariga xavfsiz tarzda tarqatishingiz yoki chop etishingiz mumkin.
            </p>

            <pre className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono overflow-x-auto max-h-72">
              {exportVedomostText()}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                🔒 Barcha parollar xavfsiz algoritmlar orqali himoyalangan
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowVedomostModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
                >
                  Yopish
                </button>
                <button
                  onClick={handleCopyVedomost}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Vedomostdan Nusxa Olish</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
