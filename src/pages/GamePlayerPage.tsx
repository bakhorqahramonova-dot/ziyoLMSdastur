import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  Award,
  ArrowRight,
  RotateCcw,
  CheckCircle,
  XCircle,
  Play,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  Check,
  AlertCircle,
  Trophy,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import {
  gamesList,
  quizBattleQuestions,
  mathGameQuestions,
  wordScrambleQuestions,
  logicPuzzleTasks,
  scheduleBuilderTasks,
} from '../data/initialData';
import { triggerCelebration } from '../utils/confetti';
import { GameType } from '../types';

export const GamePlayerPage: React.FC = () => {
  const {
    selectedGameId,
    setActiveTab,
    addGameResult,
    showToast,
  } = useLms();

  const gameInfo = gamesList.find((g) => g.id === selectedGameId) || gamesList[0];

  // Game States: 'intro' | 'playing' | 'result'
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(gameInfo.timeLimitSeconds);
  const [startTime, setStartTime] = useState<number>(0);

  // For Word Scramble game state
  const [scrambleLetters, setScrambleLetters] = useState<string[]>([]);
  const [userFormedWord, setUserFormedWord] = useState<string[]>([]);

  // For Logic Puzzle state
  const [currentOrder, setCurrentOrder] = useState<string[]>([]);

  // For Schedule Builder state
  const [assignedSlots, setAssignedSlots] = useState<{ [slotId: string]: string }>({});

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize specific game questions
  const getQuestionsList = () => {
    switch (gameInfo.id) {
      case 'quiz_battle':
        return quizBattleQuestions;
      case 'math_challenge':
        return mathGameQuestions;
      case 'word_scramble':
        return wordScrambleQuestions;
      case 'logic_puzzle':
        return logicPuzzleTasks;
      case 'schedule_builder':
        return scheduleBuilderTasks;
      default:
        return quizBattleQuestions;
    }
  };

  const questions = getQuestionsList();
  const totalQuestions = questions.length;

  // Reset when game changes
  useEffect(() => {
    setGameState('intro');
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswersCount(0);
    setWrongAnswersCount(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTimeLeft(gameInfo.timeLimitSeconds);
  }, [selectedGameId]);

  // Setup Word Scramble or Logic Puzzle on question change
  useEffect(() => {
    if (gameState === 'playing') {
      const q = questions[currentQuestionIndex];
      if (gameInfo.id === 'word_scramble' && q && 'scrambled' in q) {
        const letters = (q.scrambled as string).split('');
        setScrambleLetters(letters);
        setUserFormedWord([]);
      }
      if (gameInfo.id === 'logic_puzzle' && q && 'correctOrder' in q) {
        // shuffle for puzzle
        const shuffled = [...(q.correctOrder as string[])].sort(() => Math.random() - 0.5);
        setCurrentOrder(shuffled);
      }
      if (gameInfo.id === 'schedule_builder') {
        setAssignedSlots({});
      }
    }
  }, [currentQuestionIndex, gameState, gameInfo.id]);

  // Timer countdown hook
  useEffect(() => {
    if (gameState === 'playing' && !isAnswerSubmitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeExpired();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState, isAnswerSubmitted, currentQuestionIndex]);

  const handleTimeExpired = () => {
    if (!isAnswerSubmitted) {
      setIsAnswerSubmitted(true);
      setWrongAnswersCount((prev) => prev + 1);
      showToast('Vaqt tugadi!');
    }
  };

  // Start Game
  const handleStartGame = () => {
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswersCount(0);
    setWrongAnswersCount(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setTimeLeft(gameInfo.timeLimitSeconds);
    setStartTime(Date.now());
  };

  // Standard Multiple Choice answer check (Quiz Battle & Math Challenge)
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
    setIsAnswerSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = questions[currentQuestionIndex] as {
      correctAnswerIndex: number;
      explanation?: string;
    };

    if (idx === currentQ.correctAnswerIndex) {
      setScore((prev) => prev + 10);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setWrongAnswersCount((prev) => prev + 1);
    }
  };

  // Word Scramble actions
  const handleAddLetter = (letter: string, indexInAvailable: number) => {
    if (isAnswerSubmitted) return;
    setUserFormedWord((prev) => [...prev, letter]);
    const updated = [...scrambleLetters];
    updated.splice(indexInAvailable, 1);
    setScrambleLetters(updated);
  };

  const handleRemoveLetter = (indexInFormed: number) => {
    if (isAnswerSubmitted) return;
    const removedLetter = userFormedWord[indexInFormed];
    const updatedFormed = [...userFormedWord];
    updatedFormed.splice(indexInFormed, 1);
    setUserFormedWord(updatedFormed);
    setScrambleLetters((prev) => [...prev, removedLetter]);
  };

  const handleSubmitWordScramble = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = questions[currentQuestionIndex] as { word: string };
    const userWord = userFormedWord.join('');

    if (userWord.toUpperCase() === currentQ.word.toUpperCase()) {
      setScore((prev) => prev + 10);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setWrongAnswersCount((prev) => prev + 1);
    }
  };

  // Logic Puzzle actions
  const handleMovePuzzleItem = (index: number, direction: 'up' | 'down') => {
    if (isAnswerSubmitted) return;
    const newItems = [...currentOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;
    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setCurrentOrder(newItems);
  };

  const handleSubmitLogicPuzzle = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = questions[currentQuestionIndex] as { correctOrder: string[] };
    const isCorrect = currentOrder.every((item, i) => item === currentQ.correctOrder[i]);

    if (isCorrect) {
      setScore((prev) => prev + 20);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setWrongAnswersCount((prev) => prev + 1);
    }
  };

  // Schedule Builder actions
  const handleAssignSlot = (slotId: string, subject: string) => {
    if (isAnswerSubmitted) return;
    setAssignedSlots((prev) => ({
      ...prev,
      [slotId]: subject,
    }));
  };

  const handleSubmitSchedule = () => {
    if (isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);

    const currentQ = questions[currentQuestionIndex] as {
      slots: { id: string; requiredSubject: string }[];
    };
    const allMatch = currentQ.slots.every(
      (slot) => assignedSlots[slot.id] === slot.requiredSubject
    );

    if (allMatch) {
      setScore((prev) => prev + 20);
      setCorrectAnswersCount((prev) => prev + 1);
    } else {
      setWrongAnswersCount((prev) => prev + 1);
    }
  };

  // Move to Next Question or Finish
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
      setTimeLeft(gameInfo.timeLimitSeconds);
    } else {
      handleFinishGame();
    }
  };

  // Finish Game & Record Results
  const handleFinishGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const timeSpent = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const percent = Math.round((correctAnswersCount / totalQuestions) * 100);

    // Record results
    addGameResult({
      gameId: gameInfo.id,
      gameTitle: gameInfo.title,
      score: score,
      correctAnswers: correctAnswersCount,
      wrongAnswers: wrongAnswersCount,
      percent: percent,
      date: 'Hozirgina',
      timeSpentSeconds: timeSpent,
    });

    setGameState('result');

    if (percent >= 60) {
      triggerCelebration();
    }
  };

  // Feedback message based on percentage
  const getFeedbackMessage = (pct: number) => {
    if (pct === 100) return 'Daholarcha natija! Barcha savollarga xatosiz to\'g\'ri javob berdingiz! 🌟';
    if (pct >= 80) return 'Ajoyib natija! Siz juda yuqori intellektual salohiyat namoyish etdingiz! 🚀';
    if (pct >= 60) return 'Yaxshi natija! Bilimlaringiz mustahkamlanib bormoqda. Mashq qilishda davom eting! 👍';
    return 'Boshlanishiga yomon emas! Mavzuni yana bir bor takrorlab, qayta sinab ko\'ring! 💪';
  };

  // Render question component
  const currentQ = questions[currentQuestionIndex];
  const progressPercent = Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('games')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>O‘yinlar sahifasiga qaytish</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
          🎮 {gameInfo.title}
        </span>
      </div>

      {/* 1. INTRO SCREEN */}
      {gameState === 'intro' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-8">
          <div className="inline-block p-6 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg text-5xl">
            {gameInfo.icon}
          </div>

          <div className="max-w-xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              {gameInfo.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              {gameInfo.description}
            </p>
          </div>

          {/* Game Rules / Parameters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block">Savollar</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {totalQuestions} ta
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block">Vaqt chegarasi</span>
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {gameInfo.timeLimitSeconds} soniya
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block">Ball/savol</span>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                +10 Ball
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-semibold block">Qiyinchilik</span>
              <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
                {gameInfo.difficulty}
              </span>
            </div>
          </div>

          {/* Boshlash tugmasi */}
          <div className="pt-4">
            <button
              onClick={handleStartGame}
              className="px-10 py-4 bg-gradient-to-r from-indigo-600 via-blue-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-2xl font-extrabold text-base shadow-lg shadow-indigo-500/30 transition transform hover:scale-105 active:scale-95 inline-flex items-center gap-3"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>O‘yinni Boshlash</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. PLAYING SCREEN */}
      {gameState === 'playing' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden">
          {/* Header Bar: Score, Timer, Progress */}
          <div className="p-5 sm:p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{gameInfo.icon}</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {gameInfo.title}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  Savol: {currentQuestionIndex + 1} / {totalQuestions}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Ball */}
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-extrabold text-sm border border-amber-200 dark:border-amber-800">
                <Award className="w-4 h-4 text-amber-600" />
                <span>{score} Ball</span>
              </div>

              {/* Timer */}
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-extrabold text-sm border transition ${
                  timeLeft <= 5
                    ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 animate-pulse'
                    : 'bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{timeLeft} s</span>
              </div>

              {/* O'yinni tugatish tugmasi */}
              <button
                onClick={handleFinishGame}
                className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
              >
                O‘yinni tugatish
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Question Body */}
          <div className="p-6 sm:p-10 space-y-8">
            {/* --- TYPE 1: Multiple Choice Questions (Bilimlar bellashuvi & Matematik o'yin) --- */}
            {'options' in currentQ && (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50">
                  <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-relaxed">
                    {currentQ.question}
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctAnswerIndex;

                    let btnStyle =
                      'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-400 dark:hover:border-indigo-500';

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        btnStyle =
                          'bg-emerald-500 text-white border-emerald-600 ring-2 ring-emerald-500/50 shadow-md shadow-emerald-500/20';
                      } else if (isSelected && !isCorrect) {
                        btnStyle =
                          'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-500/50 shadow-md shadow-rose-500/20';
                      } else {
                        btnStyle = 'opacity-50 bg-slate-100 dark:bg-slate-800 text-slate-400 border-transparent';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectOption(idx)}
                        disabled={isAnswerSubmitted}
                        className={`p-4 rounded-2xl border-2 text-left font-semibold text-sm transition-all duration-200 flex items-start justify-between gap-3 ${btnStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                              isAnswerSubmitted && isCorrect
                                ? 'bg-white text-emerald-600'
                                : isAnswerSubmitted && isSelected && !isCorrect
                                ? 'bg-white text-rose-600'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="leading-snug">{option}</span>
                        </div>

                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle className="w-5 h-5 shrink-0 text-white" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 shrink-0 text-white" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation feedback */}
                {isAnswerSubmitted && (
                  <div
                    className={`p-4 rounded-2xl border flex items-start gap-3 animate-in fade-in duration-200 ${
                      selectedOption === currentQ.correctAnswerIndex
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 text-rose-800 dark:text-rose-300'
                    }`}
                  >
                    {selectedOption === currentQ.correctAnswerIndex ? (
                      <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h5 className="font-bold text-xs uppercase tracking-wide">
                        {selectedOption === currentQ.correctAnswerIndex
                          ? 'To‘g‘ri javob! (+10 ball)'
                          : `Noto‘g‘ri! To'g'ri javob: ${currentQ.options[currentQ.correctAnswerIndex]}`}
                      </h5>
                      <p className="text-xs mt-1 leading-relaxed opacity-90">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* --- TYPE 2: Word Scramble (So'z topish) --- */}
            {gameInfo.id === 'word_scramble' && 'scrambled' in currentQ && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/40 text-center">
                  <span className="text-xs font-bold text-purple-600 uppercase tracking-wider block mb-1">
                    Ko'rsatma va Izoh
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                    "{currentQ.hint}"
                  </p>
                </div>

                {/* Formed Word Slots */}
                <div>
                  <span className="text-xs font-semibold text-slate-400 block mb-2 text-center">
                    Siz tergan so'z:
                  </span>
                  <div className="flex flex-wrap justify-center gap-2 min-h-16 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700">
                    {userFormedWord.length === 0 ? (
                      <span className="text-xs text-slate-400 self-center">
                        Quyidagi harflarni bosib so'zni yig'ing...
                      </span>
                    ) : (
                      userFormedWord.map((letter, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleRemoveLetter(idx)}
                          disabled={isAnswerSubmitted}
                          className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-black text-xl shadow-md hover:bg-rose-500 transition cursor-pointer flex items-center justify-center active:scale-95"
                          title="O'chirish uchun bosing"
                        >
                          {letter}
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Available letters bank */}
                {!isAnswerSubmitted && (
                  <div>
                    <span className="text-xs font-semibold text-slate-400 block mb-2 text-center">
                      Mavjud harflar:
                    </span>
                    <div className="flex flex-wrap justify-center gap-2">
                      {scrambleLetters.map((letter, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddLetter(letter, idx)}
                          className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-indigo-100 dark:hover:bg-indigo-950 text-slate-800 dark:text-white font-extrabold text-lg border border-slate-300 dark:border-slate-600 shadow-xs transition hover:scale-105 active:scale-95"
                        >
                          {letter}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit word button */}
                {!isAnswerSubmitted && userFormedWord.length > 0 && (
                  <div className="text-center">
                    <button
                      onClick={handleSubmitWordScramble}
                      className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition"
                    >
                      So'zni tekshirish
                    </button>
                  </div>
                )}

                {/* Scramble result feedback */}
                {isAnswerSubmitted && (
                  <div
                    className={`p-4 rounded-2xl border text-center ${
                      userFormedWord.join('').toUpperCase() === currentQ.word.toUpperCase()
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                    }`}
                  >
                    <h5 className="font-bold text-sm">
                      {userFormedWord.join('').toUpperCase() === currentQ.word.toUpperCase()
                        ? 'Barakalla! So\'z to\'g\'ri topildi (+10 ball) 🎉'
                        : `Afsuski noto'g'ri. To'g'ri javob: "${currentQ.word}"`}
                    </h5>
                  </div>
                )}
              </div>
            )}

            {/* --- TYPE 3: Logic Puzzle (Ketma-ketlik) --- */}
            {gameInfo.id === 'logic_puzzle' && 'correctOrder' in currentQ && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentQ.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Bloklarni strelkalar yordamida to'g'ri mantiqiy tartibda (1-dan oxirigacha) joylashtiring.
                  </p>
                </div>

                <div className="space-y-2">
                  {currentOrder.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {step}
                        </span>
                      </div>

                      {!isAnswerSubmitted && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleMovePuzzleItem(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:bg-indigo-500 hover:text-white transition"
                          >
                            ↑
                          </button>
                          <button
                            onClick={() => handleMovePuzzleItem(idx, 'down')}
                            disabled={idx === currentOrder.length - 1}
                            className="p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-30 hover:bg-indigo-500 hover:text-white transition"
                          >
                            ↓
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {!isAnswerSubmitted && (
                  <div className="text-center pt-2">
                    <button
                      onClick={handleSubmitLogicPuzzle}
                      className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs shadow-md transition"
                    >
                      Tartibni tekshirish
                    </button>
                  </div>
                )}

                {isAnswerSubmitted && (
                  <div
                    className={`p-4 rounded-2xl border text-center ${
                      currentOrder.every((item, i) => item === currentQ.correctOrder[i])
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                    }`}
                  >
                    <h5 className="font-bold text-sm">
                      {currentOrder.every((item, i) => item === currentQ.correctOrder[i])
                        ? 'Mukammal mantiq! Barcha qadamlar to\'g\'ri terildi (+20 ball) 🌟'
                        : 'Xatolik mavjud. Qadamlar to\'g\'ri ketma-ketlikda emas edi.'}
                    </h5>
                  </div>
                )}
              </div>
            )}

            {/* --- TYPE 4: Schedule Builder --- */}
            {gameInfo.id === 'schedule_builder' && 'slots' in currentQ && (
              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/30 border border-cyan-200 dark:border-cyan-900/40">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    {currentQ.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">{currentQ.instructions}</p>
                </div>

                <div className="space-y-3">
                  {currentQ.slots.map((slot) => (
                    <div
                      key={slot.id}
                      className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 block">
                          ⏰ {slot.time}
                        </span>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Kutilayotgan o'qituvchi: {slot.expectedTeacher} ({slot.expectedRoom})
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {currentQ.availableItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleAssignSlot(slot.id, item.subject)}
                            disabled={isAnswerSubmitted}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                              assignedSlots[slot.id] === item.subject
                                ? 'bg-cyan-600 text-white shadow-sm'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300'
                            }`}
                          >
                            {item.subject}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {!isAnswerSubmitted && Object.keys(assignedSlots).length > 0 && (
                  <div className="text-center pt-2">
                    <button
                      onClick={handleSubmitSchedule}
                      className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl font-bold text-xs shadow-md transition"
                    >
                      Jadvalni tekshirish
                    </button>
                  </div>
                )}

                {isAnswerSubmitted && (
                  <div
                    className={`p-4 rounded-2xl border text-center ${
                      currentQ.slots.every((s) => assignedSlots[s.id] === s.requiredSubject)
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                        : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:text-rose-300'
                    }`}
                  >
                    <h5 className="font-bold text-sm">
                      {currentQ.slots.every((s) => assignedSlots[s.id] === s.requiredSubject)
                        ? 'Ajoyib tashkilotchilik! Dars jadvali to\'qnashuvsiz tuzildi (+20 ball) 📅'
                        : 'Darslar noto\'g\'ri xona yoki o\'qituvchiga biriktirilgan.'}
                    </h5>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions: Keyingi tugmasi */}
            <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs text-slate-400 font-medium">
                To'g'ri: {correctAnswersCount} | Noto'g'ri: {wrongAnswersCount}
              </span>

              <button
                onClick={handleNextQuestion}
                disabled={!isAnswerSubmitted}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
              >
                <span>{currentQuestionIndex < totalQuestions - 1 ? 'Keyingi' : 'Natijani ko\'rish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. RESULT SCREEN (Natija sahifasi) */}
      {gameState === 'result' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/80 dark:border-slate-800 shadow-xl text-center space-y-8 animate-in zoom-in-95 duration-300">
          <div className="inline-block p-6 rounded-3xl bg-amber-100 dark:bg-amber-950/50 text-amber-500 shadow-inner">
            <Trophy className="w-16 h-16 animate-bounce" />
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              O‘yin Yakunlandi!
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-medium max-w-lg mx-auto">
              {getFeedbackMessage(Math.round((correctAnswersCount / totalQuestions) * 100))}
            </p>
          </div>

          {/* Results Summary Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40">
              <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold block">
                Umumiy ball
              </span>
              <span className="text-2xl font-black text-amber-800 dark:text-amber-200">
                +{score}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40">
              <span className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold block">
                To‘g‘ri javoblar
              </span>
              <span className="text-2xl font-black text-emerald-800 dark:text-emerald-200">
                {correctAnswersCount} ta
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40">
              <span className="text-xs text-rose-700 dark:text-rose-400 font-semibold block">
                Noto‘g‘ri javoblar
              </span>
              <span className="text-2xl font-black text-rose-800 dark:text-rose-200">
                {wrongAnswersCount} ta
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40">
              <span className="text-xs text-indigo-700 dark:text-indigo-400 font-semibold block">
                O'zlashtirish foizi
              </span>
              <span className="text-2xl font-black text-indigo-800 dark:text-indigo-200">
                {Math.round((correctAnswersCount / totalQuestions) * 100)}%
              </span>
            </div>
          </div>

          {/* Buttons: Qayta o‘ynash va O‘yinlar sahifasiga qaytish */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleStartGame}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qayta o‘ynash</span>
            </button>

            <button
              onClick={() => setActiveTab('games')}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-2xl font-bold text-sm border border-slate-200 dark:border-slate-700 transition active:scale-95"
            >
              <span>O‘yinlar sahifasiga qaytish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
