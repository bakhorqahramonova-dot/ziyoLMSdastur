import React, { useState } from 'react';
import {
  ArrowLeft,
  Play,
  CheckCircle,
  FileText,
  Download,
  Award,
  Video,
  ListOrdered,
  Send,
  Sparkles,
  ExternalLink,
  BookOpen,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { triggerCelebration } from '../utils/confetti';

export const CourseDetailPage: React.FC = () => {
  const {
    courses,
    selectedCourseId,
    setActiveTab,
    toggleLessonCompletion,
    submitCourseAssignment,
    navigateToQuiz,
    showToast,
  } = useLms();

  const course = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Active internal tab: 'lessons' | 'video' | 'files' | 'quizzes' | 'assignments' | 'results'
  const [currentTab, setCurrentTab] = useState<
    'lessons' | 'video' | 'files' | 'quizzes' | 'assignments' | 'results'
  >('lessons');

  const [activeLessonId, setActiveLessonId] = useState<string>(
    course.lessons[0]?.id || ''
  );

  // Assignment submission form state
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [assignmentAnswer, setAssignmentAnswer] = useState<string>('');

  const activeLesson =
    course.lessons.find((l) => l.id === activeLessonId) || course.lessons[0];

  const handleCompleteLesson = (lessonId: string) => {
    toggleLessonCompletion(course.id, lessonId);
  };

  const handleSendAssignment = (assignmentId: string) => {
    if (!assignmentAnswer.trim()) {
      showToast('Iltimos, topshiriq matni yoki havolasini yozing!');
      return;
    }
    submitCourseAssignment(course.id, assignmentId);
    setSubmittingAssignmentId(null);
    setAssignmentAnswer('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Bar with Back Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          onClick={() => setActiveTab('courses')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kurslar ro‘yxatiga qaytish</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
            {course.category}
          </span>
          <span className="text-xs font-extrabold text-slate-700 dark:text-slate-300">
            O'zlashtirish: {course.progressPercent}%
          </span>
        </div>
      </div>

      {/* Course Hero Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {course.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Ustoz: {course.teacher} ({course.teacherRole})
            </span>
            <span>•</span>
            <span>{course.duration}</span>
            <span>•</span>
            <span>{course.lessons.length} ta dars mavzusi</span>
          </div>
        </div>

        {/* Progress Circular Badge */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center shrink-0 w-full md:w-44">
          <span className="text-xs font-bold text-slate-400 block mb-1">
            Kurs natijasi
          </span>
          <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
            {course.progressPercent}%
          </span>
          <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-2 overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{ width: `${course.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Internal Navigation Tabs (Darslar, Videolar, Fayllar, Testlar, Topshiriqlar, Kurs natijasi) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setCurrentTab('lessons')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            currentTab === 'lessons'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <ListOrdered className="w-4 h-4" />
          <span>Darslar ({course.lessons.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('video')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            currentTab === 'video'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Videolar</span>
        </button>

        <button
          onClick={() => setCurrentTab('files')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            currentTab === 'files'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Fayllar va Konspektlar</span>
        </button>

        <button
          onClick={() => setCurrentTab('quizzes')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            currentTab === 'quizzes'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Oraliq Testlar</span>
        </button>

        <button
          onClick={() => setCurrentTab('assignments')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            currentTab === 'assignments'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Topshiriqlar ({course.assignments.length})</span>
        </button>

        <button
          onClick={() => setCurrentTab('results')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-2 ${
            currentTab === 'results'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Kurs natijasi & Sertifikat</span>
        </button>
      </div>

      {/* TAB 1: DARSLAR */}
      {currentTab === 'lessons' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Dars mashg'ulotlari ro'yxati
            </h3>

            <div className="space-y-3">
              {course.lessons.map((lesson, idx) => (
                <div
                  key={lesson.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    activeLessonId === lesson.id
                      ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-400 dark:border-blue-600 ring-2 ring-blue-500/10'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleCompleteLesson(lesson.id)}
                        className={`mt-0.5 w-6 h-6 rounded-lg flex items-center justify-center transition ${
                          lesson.isCompleted
                            ? 'bg-emerald-500 text-white shadow-xs'
                            : 'border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 text-transparent'
                        }`}
                        title={lesson.isCompleted ? 'Tugatildi deb belgilangan' : 'Tugatildi deb belgilash'}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>

                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {lesson.summary}
                        </p>
                        <span className="text-[11px] font-semibold text-slate-400 mt-2 inline-block">
                          ⏱ {lesson.duration}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setActiveLessonId(lesson.id);
                          setCurrentTab('video');
                        }}
                        className="px-3 py-1.5 bg-slate-900 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Ko'rish</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar: Syllabus Overview */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4 h-fit">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Kurs o'quv dasturi (Syllabus)
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
              {course.syllabusOverview.map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* TAB 2: VIDEOLAR */}
      {currentTab === 'video' && (
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative max-w-4xl mx-auto shadow-2xl flex items-center justify-center">
            {activeLesson.videoUrl ? (
              <video
                key={activeLesson.videoUrl}
                src={activeLesson.videoUrl}
                controls
                className="w-full h-full object-cover"
                poster={course.image}
              />
            ) : (
              <div className="text-center text-white space-y-2 p-6">
                <Video className="w-12 h-12 mx-auto text-blue-400 opacity-80" />
                <h4 className="text-base font-bold">Video darslik yuklanmoqda...</h4>
                <p className="text-xs text-slate-400">Internet ulanishingizni tekshiring.</p>
              </div>
            )}
          </div>

          <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs text-blue-600 font-bold uppercase tracking-wider block">
                Hozirgi Dars
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                {activeLesson.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">{activeLesson.summary}</p>
            </div>

            <button
              onClick={() => handleCompleteLesson(activeLesson.id)}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 ${
                activeLesson.isCompleted
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>{activeLesson.isCompleted ? 'Dars tugatildi ✓' : 'Darsni tugatdim'}</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: FAYLLAR */}
      {currentTab === 'files' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Yuklab olinadigan qo'shimcha materiallar
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {course.lessons.flatMap((l) => l.resources || []).length > 0 ? (
              course.lessons.flatMap((l) => l.resources || []).map((res, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                      {res.type}
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                        {res.name}
                      </h4>
                      <span className="text-[11px] text-slate-400">{res.size}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => showToast(`"${res.name}" yuklab olinmoqda...`)}
                    className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white transition text-slate-700 dark:text-slate-200"
                    title="Yuklab olish"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-2 p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <FileText className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                <p className="text-xs text-slate-500">
                  Ushbu kurs uchun qo'shimcha konspektlar tayyorlanmoqda.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: TESTLAR */}
      {currentTab === 'quizzes' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Kurs bo'yicha oraliq nazorat testi
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
            Kursni muvaffaqiyatli yakunlab, xalqaro sertifikat olish uchun oraliq nazorat testidan kamida 70% to'plashingiz lozim.
          </p>

          <div className="p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                {course.title} — Yakuniy Test Sinovi
              </h4>
              <p className="text-xs text-slate-500 mt-1">10 ta savol • 15 daqiqa vaqt</p>
            </div>

            <button
              onClick={() => navigateToQuiz('quiz-1')}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs shadow-md transition flex items-center gap-2"
            >
              <span>Testni boshlash</span>
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
          </div>
        </div>
      )}

      {/* TAB 5: TOPSHIRIQLAR */}
      {currentTab === 'assignments' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Amaliy vazifalar va topshiriqlar
          </h3>

          <div className="space-y-4">
            {course.assignments.map((asg) => (
              <div
                key={asg.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {asg.title}
                  </h4>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400">
                    Muxlat: {asg.deadline}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {asg.description}
                </p>

                {asg.submitted ? (
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                    <div>
                      <span className="font-bold block">Topshirilgan ✓ Baho: {asg.grade}</span>
                      <span className="text-[11px] opacity-90">{asg.feedback}</span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {submittingAssignmentId === asg.id ? (
                      <div className="mt-3 space-y-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                        <textarea
                          value={assignmentAnswer}
                          onChange={(e) => setAssignmentAnswer(e.target.value)}
                          placeholder="GitHub repozitoriy havolasi yoki topshiriq yechimini yozing..."
                          rows={3}
                          className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-medium text-slate-800 dark:text-white outline-hidden focus:border-blue-500"
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSendAssignment(asg.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition"
                          >
                            Yuborish
                          </button>
                          <button
                            onClick={() => setSubmittingAssignmentId(null)}
                            className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg"
                          >
                            Bekor qilish
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSubmittingAssignmentId(asg.id)}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Vazifani topshirish</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: KURS NATIJASI & SERTIFIKAT */}
      {currentTab === 'results' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 mx-auto flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Sertifikat holati
            </h3>
            <p className="text-xs text-slate-500">
              Kursni 100% tugatganingizda rasmiy tekshiruvdan o'tgan raqamli sertifikat taqdim etiladi.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 max-w-sm mx-auto">
            <div className="flex justify-between text-xs font-bold mb-1">
              <span>Hozirgi ko'rsatkich:</span>
              <span className="text-blue-600">{course.progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${course.progressPercent}%` }}
              />
            </div>
          </div>

          {course.progressPercent === 100 ? (
            <div>
              <button
                onClick={() => {
                  triggerCelebration();
                  showToast('Sertifikat PDF formati yuklab olinmoqda...');
                }}
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-md transition inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Raqamli Sertifikatni Yuklab Olish (PDF)</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
              Sertifikatni olish uchun qolgan darslar va topshiriqlarni yakunlang!
            </p>
          )}
        </div>
      )}
    </div>
  );
};
