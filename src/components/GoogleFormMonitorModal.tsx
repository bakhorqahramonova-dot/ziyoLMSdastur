import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  ExternalLink,
  Copy,
  Check,
  X,
  FileSpreadsheet,
  Award,
  Filter,
  Sparkles,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { GoogleFormParticipant } from '../types';

interface GoogleFormMonitorModalProps {
  onClose: () => void;
  onOpenTest?: () => void;
}

export const GoogleFormMonitorModal: React.FC<GoogleFormMonitorModalProps> = ({
  onClose,
  onOpenTest,
}) => {
  const {
    googleFormParticipants,
    googleFormUrl,
    updateGoogleFormParticipantStatus,
    showToast,
  } = useLms();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Barchasi');
  const [copiedReport, setCopiedReport] = useState(false);

  // Statistics
  const totalCount = googleFormParticipants.length;
  const completedCount = googleFormParticipants.filter(
    (p) => p.status === 'Bajarildi'
  ).length;
  const inProgressCount = googleFormParticipants.filter(
    (p) => p.status === 'Jarayonda'
  ).length;
  const notEnteredCount = googleFormParticipants.filter(
    (p) => p.status === 'Kirmagan'
  ).length;

  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Filtered list
  const filteredList = googleFormParticipants.filter((p) => {
    const matchesFilter =
      filterStatus === 'Barchasi' || p.status === filterStatus;
    const matchesSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.group.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCopyReport = () => {
    let report = `========================================================\n`;
    report += `   GOOGLE FORMS TESTI — QATNASHUVCHILAR VA NATIJALAR     \n`;
    report += `========================================================\n\n`;
    report += `Jami o'quvchilar: ${totalCount} ta\n`;
    report += `Bajarildi (Topshirdi): ${completedCount} ta (${completionPercent}%)\n`;
    report += `Jarayonda: ${inProgressCount} ta\n`;
    report += `Hali kirmagan: ${notEnteredCount} ta\n\n`;
    report += `№ | O'quvchi F.I.SH.         | Guruh       | Holati      | Kirgan vaqti | Topshirgan  | Ball\n`;
    report += `------------------------------------------------------------------------------------------\n`;

    filteredList.forEach((p, idx) => {
      const num = (idx + 1).toString().padEnd(2, ' ');
      const name = p.studentName.padEnd(24, ' ');
      const grp = p.group.padEnd(11, ' ');
      const st = p.status.padEnd(11, ' ');
      const entered = (p.enteredAt || '-').padEnd(12, ' ');
      const submitted = (p.submittedAt || '-').padEnd(11, ' ');
      const score = p.score !== undefined ? `${p.score}` : '-';
      report += `${num} | ${name} | ${grp} | ${st} | ${entered} | ${submitted} | ${score}\n`;
    });

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2500);
    showToast('Monitoring hisoboti nusxalandi!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight">
                  Google Forms Test Monitoringi
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-400 text-slate-950">
                  Jonli Nazorat
                </span>
              </div>
              <p className="text-xs text-indigo-100 mt-0.5">
                Kimlar testga kirdi va kimlar bajarganini kuzatish paneli
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenTest && (
              <button
                onClick={onOpenTest}
                className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
              >
                <span>Testni ochish</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition"
              aria-label="Yopish"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 4 Quick Stat Cards */}
        <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200/80 dark:border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          {/* Jami */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800 shadow-xs">
            <div className="flex items-center justify-between text-slate-400 mb-1">
              <span className="text-[11px] font-bold">Jami O'quvchilar</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-xl font-black text-slate-900 dark:text-white">
              {totalCount} <span className="text-xs text-slate-400 font-normal">nafar</span>
            </div>
          </div>

          {/* Bajarildi */}
          <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 shadow-xs">
            <div className="flex items-center justify-between text-emerald-700 dark:text-emerald-300 mb-1">
              <span className="text-[11px] font-bold">Topshirganlar</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-black text-emerald-800 dark:text-emerald-200">
              {completedCount} <span className="text-xs font-bold">({completionPercent}%)</span>
            </div>
          </div>

          {/* Jarayonda */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 shadow-xs">
            <div className="flex items-center justify-between text-amber-700 dark:text-amber-300 mb-1">
              <span className="text-[11px] font-bold">Jarayonda (Ishlamoqda)</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl font-black text-amber-800 dark:text-amber-200">
              {inProgressCount} <span className="text-xs font-normal text-amber-600">faol</span>
            </div>
          </div>

          {/* Kirmaganlar */}
          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-[11px] font-bold">Hali Kirmagan</span>
              <XCircle className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-xl font-black text-slate-700 dark:text-slate-300">
              {notEnteredCount} <span className="text-xs font-normal text-slate-400">kutmoqda</span>
            </div>
          </div>
        </div>

        {/* Filter, Search & Export Bar */}
        <div className="p-4 border-b border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
          {/* Status filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['Barchasi', 'Bajarildi', 'Jarayonda', 'Kirmagan'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  filterStatus === st
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search & Export */}
          <div className="flex items-center gap-2">
            <div className="relative min-w-[200px] flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="O'quvchi yoki guruh..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white outline-hidden focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleCopyReport}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs shrink-0"
              title="Hisobotdan nusxa olish"
            >
              {copiedReport ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>Nusxalash</span>
            </button>
          </div>
        </div>

        {/* Participants Table List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 divide-y divide-slate-100 dark:divide-slate-800">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              Hech qanday o'quvchi topilmadi.
            </div>
          ) : (
            filteredList.map((participant) => (
              <div
                key={participant.studentId}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 px-3 rounded-2xl transition"
              >
                {/* Student Info */}
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={participant.avatar}
                    alt={participant.studentName}
                    className="w-11 h-11 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                        {participant.studentName}
                      </h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {participant.group}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {participant.email} • {participant.note || 'Maxsus test topshirig\'i'}
                    </p>
                  </div>
                </div>

                {/* Status & Timestamps */}
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0">
                  {/* Status Badge */}
                  <div>
                    {participant.status === 'Bajarildi' && (
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Bajarildi</span>
                        {participant.score !== undefined && (
                          <span className="font-black ml-1">({participant.score} b)</span>
                        )}
                      </span>
                    )}

                    {participant.status === 'Jarayonda' && (
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1.5 animate-pulse">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        <span>Jarayonda</span>
                      </span>
                    )}

                    {participant.status === 'Kirmagan' && (
                      <span className="px-3 py-1 rounded-xl text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 flex items-center gap-1.5">
                        <XCircle className="w-3.5 h-3.5 text-slate-400" />
                        <span>Kirmagan</span>
                      </span>
                    )}
                  </div>

                  {/* Time Info */}
                  <div className="text-right text-[11px] text-slate-500 dark:text-slate-400 min-w-[90px]">
                    {participant.status === 'Bajarildi' && (
                      <div>
                        <span className="block font-semibold text-slate-800 dark:text-slate-200">
                          {participant.submittedAt || 'Topshirildi'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Kirgan: {participant.enteredAt || '-'}
                        </span>
                      </div>
                    )}
                    {participant.status === 'Jarayonda' && (
                      <div>
                        <span className="block font-semibold text-amber-600 dark:text-amber-400">
                          Kirgan: {participant.enteredAt || 'Hozirgina'}
                        </span>
                        <span className="text-[10px] text-slate-400">Ishlamoqda...</span>
                      </div>
                    )}
                    {participant.status === 'Kirmagan' && (
                      <span className="text-slate-400 italic">Kutilmoqda</span>
                    )}
                  </div>

                  {/* Quick teacher action buttons */}
                  <div className="flex items-center gap-1">
                    {participant.status !== 'Bajarildi' ? (
                      <button
                        onClick={() =>
                          updateGoogleFormParticipantStatus(
                            participant.studentId,
                            'Bajarildi',
                            90,
                            'O\'qituvchi tomonidan tasdiqlandi'
                          )
                        }
                        className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-lg text-[10px] font-bold transition"
                        title="Topshirdi deb belgilash"
                      >
                        ✓ Bajarildi
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          updateGoogleFormParticipantStatus(
                            participant.studentId,
                            'Jarayonda'
                          )
                        }
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 rounded-lg text-[10px] font-bold transition"
                        title="Qayta topshirishga ruxsat berish"
                      >
                        Qaytarish
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
