import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  CheckCircle2,
  X,
  Clock,
  Award,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { triggerCelebration } from '../utils/confetti';

interface GoogleFormTestModalProps {
  onClose: () => void;
  onOpenMonitoring?: () => void;
}

export const GoogleFormTestModal: React.FC<GoogleFormTestModalProps> = ({
  onClose,
  onOpenMonitoring,
}) => {
  const {
    googleFormUrl,
    userProfile,
    googleFormParticipants,
    recordGoogleFormEntry,
    recordGoogleFormSubmission,
  } = useLms();

  const currentParticipant = googleFormParticipants.find(
    (p) => p.studentId === userProfile.id || p.email === userProfile.email
  );

  const [showScoreInput, setShowScoreInput] = useState(false);
  const [inputScore, setInputScore] = useState<number>(90);

  // When modal opens, register entry if not already registered
  useEffect(() => {
    recordGoogleFormEntry(
      userProfile.id,
      `${userProfile.firstName} ${userProfile.lastName}`
    );
  }, []);

  const handleMarkSubmitted = () => {
    recordGoogleFormSubmission(userProfile.id, inputScore);
    triggerCelebration();
    setShowScoreInput(false);
  };

  const isAlreadyCompleted = currentParticipant?.status === 'Bajarildi';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-5xl h-[92vh] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-xl shadow-xs">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">
                  Google Forms Onlayn Nazorat Testi
                </h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-400 text-slate-950">
                  Faol Test
                </span>
              </div>
              <p className="text-xs text-indigo-100 flex items-center gap-2 mt-0.5">
                <span>Topshiruvchi: {userProfile.firstName} {userProfile.lastName}</span>
                <span>•</span>
                <span className="font-semibold text-amber-300">
                  Holat: {currentParticipant?.status || 'Jarayonda'}
                </span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Open in new tab button */}
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 border border-white/20"
              title="Yangi oynada ochish"
            >
              <span>Yangi oynada ochish</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* Monitoring modal trigger */}
            {onOpenMonitoring && (
              <button
                onClick={onOpenMonitoring}
                className="hidden sm:flex px-3.5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-xl text-xs font-black transition items-center gap-1.5 shadow-sm"
              >
                <span>Kimlar bajardi?</span>
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

        {/* Status Notification Banner */}
        <div className="px-4 py-2.5 bg-indigo-50 dark:bg-indigo-950/50 border-b border-indigo-100 dark:border-indigo-900/60 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-200">
            <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin" />
            <span>
              Sizning testga kirishingiz tizimda qayd etildi. Testni to'ldirib, quyidagi tasdiqlash tugmasini bosing.
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAlreadyCompleted ? (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Test topshirildi (Baho: {currentParticipant?.score ?? 90})
              </span>
            ) : (
              <button
                onClick={() => setShowScoreInput(true)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition flex items-center gap-1.5 active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Men testni topshirdim ✓</span>
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area with Embedded Google Form */}
        <div className="flex-1 relative bg-slate-100 dark:bg-slate-950 overflow-hidden flex flex-col">
          <iframe
            src={googleFormUrl}
            title="Google Forms Test"
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />

          {/* Fallback prompt bar */}
          <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">
              Agar Google Form bu yerda to'liq ko'rinmasa, to'g'ridan-to'g'ri havoladan foydalaning:
            </span>
            <a
              href={googleFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
            >
              <span>Google Formga o'tish</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Score confirmation popup */}
      {showScoreInput && (
        <div className="fixed inset-0 z-60 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Testni muvaffaqiyatli topshirdingizmi?
              </h3>
              <p className="text-xs text-slate-500">
                Sizning natijangiz tizimda "Bajarildi" holatiga o'tkaziladi va o'qituvchi monitoringida ko'rinadi.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                To'plagan ball yoki foiz (ixtiyoriy):
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={inputScore}
                onChange={(e) => setInputScore(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-900 dark:text-white outline-hidden focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowScoreInput(false)}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleMarkSubmitted}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md"
              >
                Tasdiqlash ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
