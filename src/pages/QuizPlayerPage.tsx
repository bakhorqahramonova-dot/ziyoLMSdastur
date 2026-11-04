import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  Trophy,
  AlertCircle,
  Check,
  Bookmark,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { triggerCelebration } from '../utils/confetti';

export const QuizPlayerPage: React.FC = () => {
  const {
    quizzes,
    selectedQuizId,
    setActiveTab,
    addQuizResult,
    showToast,
  } = useLms();

  const quiz = quizzes.find((q) => q.id === selectedQuizId) || quizzes[0];
  const questions = quiz.questions;
  const totalQuestions = questions.length;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [qId: number]: number }>({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<{ [qId: number]: boolean }>({});
  const [secondsLeft, setSecondsLeft] = useState(quiz.timeLimitMinutes * 60);
  const [isFinished, setIsFinished] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown
  useEffect(() => {
    if (!isFinished) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleFinishQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFinished]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (optionIdx: number) => {
    const currentQ = questions[currentIndex];
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIdx,
    }));
  };

  const handleToggleFlag = (qId: number) => {
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qId]: !prev[qId],
    }));
  };

  const handleFinishQuiz = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    // Calculate score
    let correctCount = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percent = Math.round((correctCount / totalQuestions) * 100);
    const isPassed = percent >= quiz.passingScorePercent;
    const timeSpent = quiz.timeLimitMinutes * 60 - secondsLeft;

    addQuizResult({
      quizId: quiz.id,
      quizTitle: quiz.title,
      subject: quiz.subject,
      score: percent,
      total: 100,
      percent: percent,
      passed: isPassed,
      date: 'Hozirgina',
      timeSpentSeconds: timeSpent,
    });

    setIsFinished(true);
    setShowConfirmFinish(false);

    if (isPassed) {
      triggerCelebration();
    }
  };

  const handleRestartQuiz = () => {
    setUserAnswers({});
    setFlaggedQuestions({});
    setCurrentIndex(0);
    setSecondsLeft(quiz.timeLimitMinutes * 60);
    setIsFinished(false);
    setShowConfirmFinish(false);
  };

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(userAnswers).length;

  // Compute final results
  let correctCount = 0;
  questions.forEach((q) => {
    if (userAnswers[q.id] === q.correctAnswerIndex) {
      correctCount++;
    }
  });
  const percentScore = Math.round((correctCount / totalQuestions) * 100);
  const isPassed = percentScore >= quiz.passingScorePercent;

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('quizzes')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Testlar sahifasiga qaytish</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
          📝 {quiz.subject}
        </span>
      </div>

      {!isFinished ? (
        <div className="space-y-6">
          {/* Quiz Top Action Bar: Timer & Finish button */}
          <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                {quiz.title}
              </h2>
              <span className="text-xs text-slate-400">
                Javob berildi: {answeredCount} / {totalQuestions}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-extrabold text-sm border ${
                  secondsLeft < 180
                    ? 'bg-rose-50 text-rose-600 border-rose-300 animate-pulse'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{formatTime(secondsLeft)}</span>
              </div>

              <button
                onClick={() => setShowConfirmFinish(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-sm transition"
              >
                Testni yakunlash
              </button>
            </div>
          </div>

          {/* Question Jump Circles */}
          <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex items-center gap-2 overflow-x-auto">
            {questions.map((q, idx) => {
              const isAnswered = userAnswers[q.id] !== undefined;
              const isFlagged = flaggedQuestions[q.id];
              const isCurrent = idx === currentIndex;

              let circleClass =
                'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200';

              if (isAnswered) {
                circleClass = 'bg-emerald-500 text-white shadow-xs';
              }
              if (isFlagged) {
                circleClass = 'ring-2 ring-amber-400 bg-amber-100 dark:bg-amber-950 text-amber-800';
              }
              if (isCurrent) {
                circleClass += ' ring-2 ring-blue-600 font-extrabold';
              }

              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold shrink-0 transition flex items-center justify-center ${circleClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question Body */}
          <div className="p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wide block mb-1">
                  Savol #{currentIndex + 1}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h3>
              </div>

              <button
                onClick={() => handleToggleFlag(currentQ.id)}
                className={`p-2.5 rounded-xl border transition ${
                  flaggedQuestions[currentQ.id]
                    ? 'bg-amber-100 text-amber-600 border-amber-300'
                    : 'bg-slate-50 dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'
                }`}
                title="Qayta ko'rib chiqish uchun belgilash"
              >
                <Bookmark className="w-4 h-4" />
              </button>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = userAnswers[currentQ.id] === idx;

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectAnswer(idx)}
                    className={`w-full p-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all duration-150 flex items-center gap-3.5 ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Bottom Question Navigation */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40 text-slate-700 dark:text-slate-300 font-bold text-xs transition"
              >
                ← Oldingi
              </button>

              {currentIndex < totalQuestions - 1 ? (
                <button
                  onClick={() => setCurrentIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2"
                >
                  <span>Keyingi</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => setShowConfirmFinish(true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition"
                >
                  Testni yakunlash ✓
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* QUIZ RESULTS VIEW */
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-8 animate-in zoom-in-95 duration-300">
          <div className="text-center space-y-4">
            <div className="inline-block p-6 rounded-3xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 shadow-inner">
              <Trophy className="w-16 h-16 animate-bounce" />
            </div>

            <h2 className="text-3xl font-black text-slate-900 dark:text-white">
              Test Natijasi
            </h2>
            <p className="text-sm font-semibold text-slate-500 max-w-md mx-auto">
              {isPassed
                ? 'Tabriklaymiz! Siz o\'tish balini muvaffaqiyatli egalladingiz!'
                : 'Afsuski, o\'tish bali uchun ball yetarli bo\'lmadi. Qayta urinib ko\'ring!'}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
              <span className="text-xs text-emerald-600 font-semibold block">To'g'ri javoblar</span>
              <span className="text-2xl font-black text-emerald-800 dark:text-emerald-200">
                {correctCount} / {totalQuestions}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40">
              <span className="text-xs text-indigo-600 font-semibold block">Natija foizi</span>
              <span className="text-2xl font-black text-indigo-800 dark:text-indigo-200">
                {percentScore}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40">
              <span className="text-xs text-blue-600 font-semibold block">O'tish bali</span>
              <span className="text-2xl font-black text-blue-800 dark:text-blue-200">
                {quiz.passingScorePercent}%
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40">
              <span className="text-xs text-purple-600 font-semibold block">Holat</span>
              <span
                className={`text-2xl font-black ${
                  isPassed ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {isPassed ? 'O‘tdi ✓' : 'Yiqildi ✕'}
              </span>
            </div>
          </div>

          {/* Question Review Accordion */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Savollar tahlili va to'g'ri javoblar:
            </h4>

            <div className="space-y-3">
              {questions.map((q, idx) => {
                const userAns = userAnswers[q.id];
                const isCorrect = userAns === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border text-xs ${
                      isCorrect
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                        : 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                          #{idx + 1}. {q.question}
                        </span>
                        <p className="text-slate-600 dark:text-slate-400">
                          Sizning javobingiz:{' '}
                          <span className={isCorrect ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                            {userAns !== undefined ? q.options[userAns] : 'Belgilanmagan'}
                          </span>
                        </p>
                        {!isCorrect && (
                          <p className="text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                            To'g'ri javob: {q.options[q.correctAnswerIndex]}
                          </p>
                        )}
                        <p className="text-[11px] text-slate-400 mt-1 italic">
                          Izoh: {q.explanation}
                        </p>
                      </div>

                      {isCorrect ? (
                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleRestartQuiz}
              className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qayta topshirish</span>
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 transition"
            >
              <span>Testlar sahifasiga qaytish</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmFinish && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Testni yakunlaysizmi?
            </h3>
            <p className="text-xs text-slate-500">
              Siz {answeredCount} ta savolga javob berdingiz ({totalQuestions - answeredCount} ta qoldi).
              Testni yakunlaganingizdan so'ng javoblarni o'zgartirib bo'lmaydi.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setShowConfirmFinish(false)}
                className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl"
              >
                Davom ettirish
              </button>
              <button
                onClick={handleFinishQuiz}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Ha, yakunlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
