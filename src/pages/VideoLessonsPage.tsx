import React, { useState, useMemo, useRef } from 'react';
import {
  Video,
  Play,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  Search,
  Plus,
  X,
  Sparkles,
  FileText,
  Download,
  Check,
  ChevronRight,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { VideoLessonItem } from '../types';

export const VideoLessonsPage: React.FC = () => {
  const {
    videoLessons,
    toggleVideoLessonCompletion,
    addVideoLesson,
    showToast,
    selectedVideoLessonId,
    setSelectedVideoLessonId,
  } = useLms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [selectedLevel, setSelectedLevel] = useState<string>('Barchasi');
  const [showAddModal, setShowAddModal] = useState(false);

  // Active video lesson selection
  const [activeVideoId, setActiveVideoId] = useState<string>(
    videoLessons[0]?.id || 'vid-1'
  );

  const videoPlayerRef = useRef<HTMLDivElement>(null);

  // If externally selected
  React.useEffect(() => {
    if (selectedVideoLessonId) {
      setActiveVideoId(selectedVideoLessonId);
      setSelectedVideoLessonId(null);
      videoPlayerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedVideoLessonId, setSelectedVideoLessonId]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    videoLessons.forEach((v) => set.add(v.category));
    return ['Barchasi', ...Array.from(set)];
  }, [videoLessons]);

  // Filtered videos
  const filteredVideos = useMemo(() => {
    return videoLessons.filter((v) => {
      const matchesCategory =
        selectedCategory === 'Barchasi' || v.category === selectedCategory;
      const matchesLevel =
        selectedLevel === 'Barchasi' || v.level === selectedLevel;
      const matchesSearch =
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesLevel && matchesSearch;
    });
  }, [videoLessons, selectedCategory, selectedLevel, searchQuery]);

  // Active video object
  const activeVideo = useMemo(() => {
    return (
      videoLessons.find((v) => v.id === activeVideoId) || videoLessons[0]
    );
  }, [videoLessons, activeVideoId]);

  // Select video and scroll to player
  const handleSelectVideo = (video: VideoLessonItem) => {
    setActiveVideoId(video.id);
    if (window.innerWidth < 1024) {
      videoPlayerRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Completed count
  const completedCount = videoLessons.filter((v) => v.isCompleted).length;

  // New video lesson form state
  const [newTitle, setNewTitle] = useState('');
  const [newTeacher, setNewTeacher] = useState('Azizbek Rahimov');
  const [newCategory, setNewCategory] = useState<
    | 'Dasturlash'
    | 'Sun\'iy Intellekt'
    | 'Kiberxavfsizlik'
    | 'Dizayn'
    | 'Xorijiy Tillar'
    | 'Aniq Fanlar'
  >('Dasturlash');
  const [newDuration, setNewDuration] = useState('28:40');
  const [newLevel, setNewLevel] = useState<
    'Boshlang\'ich' | 'O\'rta' | 'Mukammal'
  >('Boshlang\'ich');
  const [newThumb, setNewThumb] = useState(
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  );
  const [newVideoUrl, setNewVideoUrl] = useState(
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  );
  const [newSummary, setNewSummary] = useState('');

  const handleCreateVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showToast('Iltimos, video dars nomini kiriting!');
      return;
    }

    addVideoLesson({
      title: newTitle.trim(),
      category: newCategory,
      courseName: 'ZiyoLMS Mustaqil Ta\'lim',
      teacher: newTeacher,
      teacherRole: 'Yetakchi O\'qituvchi',
      teacherAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      duration: newDuration || '25:00',
      thumbnail: newThumb,
      videoUrl: newVideoUrl,
      summary:
        newSummary.trim() ||
        'Ushbu amaliy darsda real loyihalar ustida ishlash uslublari o\'rganiladi.',
      keyTakeaways: [
        'Mavzuni to\'liq o\'zlashtirish',
        'Amaliy kod yozish va testlash',
        'Dars yakunidagi topshiriqni bajarish',
      ],
      level: newLevel,
      date: 'Bugun',
      isCompleted: false,
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewSummary('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-pink-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              <Video className="w-4 h-4 text-pink-200" />
              <span>ZiyoLMS Video Akademiya</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Video Darslar va Ma'ruzalar
            </h2>
            <p className="text-sm sm:text-base text-purple-100/90 leading-relaxed">
              Yetakchi soha mutaxassislari tomonidan yozilgan professional video
              darslar. Videolarni ko‘ring, asosiy xulosalarni o‘rganing va har bir
              yakunlangan dars uchun qo‘shimcha ballarga ega bo‘ling!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 rounded-2xl bg-white text-purple-700 font-bold text-sm shadow-lg hover:bg-purple-50 transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-purple-600" />
              <span>Dars qo‘shish</span>
            </button>
          </div>
        </div>

        {/* Mini stats */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15 text-white">
          <div>
            <div className="text-2xl sm:text-3xl font-black">{videoLessons.length} ta</div>
            <div className="text-xs text-purple-200">Mavjud video darslar</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black">{completedCount} ta</div>
            <div className="text-xs text-purple-200">Yakunlangan darslar</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black">120+ soat</div>
            <div className="text-xs text-purple-200">Umumiy ta'lim davomiyligi</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black">8 ta</div>
            <div className="text-xs text-purple-200">Yetakchi o'qituvchilar</div>
          </div>
        </div>
      </div>

      {/* Main Video Showcase Section */}
      {activeVideo && (
        <div
          ref={videoPlayerRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
        >
          {/* Main Player & Details (2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
              {/* Responsive Video Container */}
              <div className="relative w-full aspect-video bg-black flex items-center justify-center">
                <video
                  key={activeVideo.id}
                  src={activeVideo.videoUrl}
                  poster={activeVideo.thumbnail}
                  controls
                  playsInline
                  className="w-full h-full object-contain"
                >
                  Sizning brauzeringiz video tegini qo'llab-quvvatlamaydi.
                </video>
              </div>

              {/* Player Header / Action Bar */}
              <div className="p-5 sm:p-6 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold">
                        {activeVideo.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium">
                        {activeVideo.level} daraja
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white">
                      {activeVideo.title}
                    </h2>
                  </div>

                  {/* Mark complete button */}
                  <button
                    onClick={() => toggleVideoLessonCompletion(activeVideo.id)}
                    className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition cursor-pointer shrink-0 active:scale-95 ${
                      activeVideo.isCompleted
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-md shadow-purple-500/20'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {activeVideo.isCompleted
                        ? 'Dars yakunlandi (Bajarildi)'
                        : 'Darsni yakunladim (+15 Ball)'}
                    </span>
                  </button>
                </div>

                {/* Teacher & Stats bar */}
                <div className="pt-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeVideo.teacherAvatar}
                      alt={activeVideo.teacher}
                      className="w-11 h-11 rounded-2xl object-cover ring-2 ring-purple-500/30"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {activeVideo.teacher}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {activeVideo.teacherRole || 'ZiyoLMS Katta O\'qituvchisi'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-purple-500" />
                      {activeVideo.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-blue-500" />
                      {activeVideo.viewsCount} ko‘rish
                    </span>
                  </div>
                </div>

                {/* Description & Key takeaways */}
                <div className="mt-6 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Dars haqida qisqacha
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {activeVideo.summary}
                    </p>
                  </div>

                  {activeVideo.keyTakeaways && activeVideo.keyTakeaways.length > 0 && (
                    <div className="p-4 rounded-2xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30">
                      <h4 className="text-xs font-bold text-purple-900 dark:text-purple-300 flex items-center gap-2 mb-2.5">
                        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        Ushbu darsda o‘rganiladigan asosiy bilimlar:
                      </h4>
                      <ul className="space-y-2">
                        {activeVideo.keyTakeaways.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300"
                          >
                            <span className="w-4 h-4 rounded-full bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Lesson materials download */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() =>
                        showToast(`"${activeVideo.title}" konspekti yuklab olindi (PDF)`)
                      }
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Dars konspekti (.PDF)</span>
                    </button>
                    <button
                      onClick={() =>
                        showToast("Dars manba kodi (GitHub repository) ochildi")
                      }
                      className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Amaliy kod namunalari (.ZIP)</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist & Sidebar list (1 column) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-purple-600" />
                <span>Barcha video darslar</span>
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300">
                {videoLessons.length} ta dars
              </span>
            </div>

            {/* Quick playlist scroll */}
            <div className="space-y-2.5 max-h-[640px] overflow-y-auto pr-1">
              {videoLessons.map((item, index) => {
                const isActive = item.id === activeVideo.id;

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectVideo(item)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 group ${
                      isActive
                        ? 'bg-purple-50 dark:bg-purple-950/40 border-purple-500/50 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    {/* Thumbnail with duration */}
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-200 dark:bg-slate-700">
                      <img
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded-md bg-black/80 text-[10px] font-bold text-white">
                        {item.duration}
                      </span>
                      {item.isCompleted && (
                        <div className="absolute top-1 left-1 bg-emerald-500 text-white rounded-full p-0.5">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>

                    {/* Meta */}
                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                      <div>
                        <h4
                          className={`text-xs font-bold line-clamp-2 ${
                            isActive
                              ? 'text-purple-600 dark:text-purple-400'
                              : 'text-slate-900 dark:text-white group-hover:text-purple-600'
                          }`}
                        >
                          {index + 1}. {item.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {item.teacher}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{item.category}</span>
                        {isActive && (
                          <span className="font-bold text-purple-600 dark:text-purple-400">
                            Ko‘rilmoqda
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Filter and Video Cards Grid */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Video darslar, mavzular yoki o'qituvchi bo'yicha qidiruv..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <Filter className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const isPlaying = video.id === activeVideo.id;

            return (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className={`group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  isPlaying
                    ? 'border-purple-500 ring-2 ring-purple-500/20'
                    : 'border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-700'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/40 transition-colors" />

                  {/* Play button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/90 text-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 ml-0.5 fill-purple-600 text-purple-600" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded-lg bg-black/80 backdrop-blur-xs text-[11px] font-bold text-white flex items-center gap-1">
                    <Clock className="w-3 h-3 text-purple-300" />
                    {video.duration}
                  </span>

                  {/* Category badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/80 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                    {video.category}
                  </span>

                  {video.isCompleted && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded-lg bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Bajarildi
                    </span>
                  )}
                </div>

                {/* Video Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[11px] font-semibold text-purple-600 dark:text-purple-400">
                        {video.level}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">•</span>
                      <span className="text-[11px] text-slate-500">
                        {video.viewsCount} ko‘rildi
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                      {video.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={video.teacherAvatar}
                        alt={video.teacher}
                        className="w-7 h-7 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                        {video.teacher}
                      </span>
                    </div>

                    <button className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>Darsni ko‘rish</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add New Video Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Yangi Video Dars Qo‘shish
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVideo} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Video dars nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Tailwind CSS v4 Asoslari"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    O‘qituvchi
                  </label>
                  <input
                    type="text"
                    required
                    value={newTeacher}
                    onChange={(e) => setNewTeacher(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Kategoriya
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) =>
                      setNewCategory(
                        e.target.value as
                          | 'Dasturlash'
                          | 'Sun\'iy Intellekt'
                          | 'Kiberxavfsizlik'
                          | 'Dizayn'
                          | 'Xorijiy Tillar'
                          | 'Aniq Fanlar'
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                  >
                    <option value="Dasturlash">Dasturlash</option>
                    <option value="Sun'iy Intellekt">Sun'iy Intellekt</option>
                    <option value="Kiberxavfsizlik">Kiberxavfsizlik</option>
                    <option value="Dizayn">Dizayn</option>
                    <option value="Xorijiy Tillar">Xorijiy Tillar</option>
                    <option value="Aniq Fanlar">Aniq Fanlar</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Davomiyligi (MM:SS)
                  </label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="25:00"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Daraja
                  </label>
                  <select
                    value={newLevel}
                    onChange={(e) =>
                      setNewLevel(
                        e.target.value as 'Boshlang\'ich' | 'O\'rta' | 'Mukammal'
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                  >
                    <option value="Boshlang'ich">Boshlang'ich</option>
                    <option value="O'rta">O'rta</option>
                    <option value="Mukammal">Mukammal</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Video fayl havolasi (.mp4)
                </label>
                <input
                  type="url"
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Muqova rasmi (URL)
                </label>
                <input
                  type="url"
                  value={newThumb}
                  onChange={(e) => setNewThumb(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Qisqacha tavsif
                </label>
                <textarea
                  rows={3}
                  value={newSummary}
                  onChange={(e) => setNewSummary(e.target.value)}
                  placeholder="Dars mavzulari va mazmuni..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 outline-hidden resize-none"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition cursor-pointer"
                >
                  Darsni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
