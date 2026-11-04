import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  BookMarked,
  Search,
  Download,
  Star,
  FileText,
  Filter,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { useLms } from '../context/LmsContext';
import { Book } from '../types';

export const BooksPage: React.FC = () => {
  const { books, addBook, showToast, selectedBookId, setSelectedBookId } = useLms();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Barchasi');
  const [readingBook, setReadingBook] = useState<Book | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>('base');
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['book-1', 'book-3']);

  // If a book was targeted externally (e.g. from context)
  React.useEffect(() => {
    if (selectedBookId) {
      const b = books.find((x) => x.id === selectedBookId);
      if (b) {
        setReadingBook(b);
        setCurrentChapterIndex(0);
      }
      setSelectedBookId(null);
    }
  }, [selectedBookId, books, setSelectedBookId]);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    books.forEach((b) => set.add(b.category));
    return ['Barchasi', ...Array.from(set)];
  }, [books]);

  // Filtered books
  const filteredBooks = useMemo(() => {
    return books.filter((b) => {
      const matchesCategory =
        selectedCategory === 'Barchasi' || b.category === selectedCategory;
      const matchesSearch =
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchQuery]);

  // Download handler simulation
  const handleDownload = (book: Book, e: React.MouseEvent) => {
    e.stopPropagation();
    showToast(`"${book.title}" kitobi yuklab olindi (PDF formatida)`);
  };

  // Bookmark toggle
  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        showToast("Kitob saqlanganlar ro'yxatidan olib tashlandi");
        return prev.filter((bId) => bId !== id);
      } else {
        showToast("Kitob saqlanganlar ro'yxatiga qo'shildi!");
        return [...prev, id];
      }
    });
  };

  // Open Reader
  const handleOpenReader = (book: Book) => {
    setReadingBook(book);
    setCurrentChapterIndex(0);
  };

  // New book form state
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newCategory, setNewCategory] = useState<
    | 'Dasturlash'
    | 'Sun\'iy Intellekt'
    | 'Kiberxavfsizlik'
    | 'Dizayn'
    | 'Xorijiy Tillar'
    | 'Aniq Fanlar'
    | 'Psixologiya & Rivojlanish'
  >('Dasturlash');
  const [newPages, setNewPages] = useState(250);
  const [newCover, setNewCover] = useState(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80'
  );
  const [newDescription, setNewDescription] = useState('');

  const handleCreateBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newAuthor.trim()) {
      showToast('Iltimos, kitob nomi va muallifini kiriting!');
      return;
    }

    addBook({
      title: newTitle.trim(),
      author: newAuthor.trim(),
      category: newCategory,
      coverImage: newCover,
      pagesCount: Number(newPages) || 150,
      fileSize: '4.8 MB',
      year: 2026,
      language: "O'zbekcha",
      readTime: '6 soat',
      description:
        newDescription.trim() ||
        'Ushbu zamonaviy darslik ta’lim oluvchilarga amaliy bilim berish uchun tuzilgan.',
      tableOfContents: [
        '1-bob. Kirish va asosiy tushunchalar',
        '2-bob. Nazariy qoidalar va metodologiya',
        '3-bob. Amaliy misollar va tavsiyalar',
      ],
      sampleContent: [
        {
          chapter: '1-bob. Kirish va asosiy tushunchalar',
          text: 'Ushbu kitob muvaffaqiyatli ilm olish, zamonaviy ko\'nikmalarni shakllantirish va mustahkam poydevor yaratish uchun maxsus tayyorlangan. Har bir mavzu hayotiy misollar va sodda tushuntirishlar orqali bayon etiladi.',
        },
        {
          chapter: '2-bob. Nazariy qoidalar va metodologiya',
          text: 'Nazariyani chuqur anglash amaliyotdagi xatolarni kamaytiradi. Tizimli yondashuv orqali eng murakkab masalalarni ham qadam-baqadam yechish mumkin.',
        },
        {
          chapter: '3-bob. Amaliy misollar va tavsiyalar',
          text: 'Bilimlarni mustahkamlash uchun berilgan topshiriqlarni mustaqil bajarib ko\'ring. Olingan bilimlarni doimiy ravishda sinab boring.',
        },
      ],
    });

    setShowAddModal(false);
    setNewTitle('');
    setNewAuthor('');
    setNewDescription('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-700 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-sm border border-white/20">
              <BookMarked className="w-4 h-4 text-sky-200" />
              <span>ZiyoLMS Elektron Kutubxonasi</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
              Kitoblar va O‘quv Qo‘llanmalar
            </h2>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed">
              Dasturlash, sun'iy intellekt, xorijiy tillar, dizayn va aniq fanlar
              bo‘yicha eng sara elektron kitoblar. To‘g‘ridan-to‘g‘ri brauzerda
              o‘qing yoki PDF formatda yuklab oling!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-5 py-3 rounded-2xl bg-white text-blue-700 font-bold text-sm shadow-lg hover:bg-blue-50 transition-all flex items-center gap-2 shrink-0 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Kitob qo‘shish</span>
            </button>
          </div>
        </div>

        {/* Mini stats inside banner */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/15 text-white">
          <div>
            <div className="text-2xl sm:text-3xl font-black">{books.length} ta</div>
            <div className="text-xs text-blue-200">Kutubxonadagi kitoblar</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black">2,450+</div>
            <div className="text-xs text-blue-200">Jami o‘qilgan sahifalar</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black">{bookmarkedIds.length} ta</div>
            <div className="text-xs text-blue-200">Saqlab qo‘yilganlar</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-black">1,820+</div>
            <div className="text-xs text-blue-200">Yuklab olishlar soni</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Kitob nomi, muallif yoki kalit so‘z bo‘yicha qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              Tozalash
            </button>
          )}
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 ml-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Books Grid */}
      {filteredBooks.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Mos keluvchi kitoblar topilmadi
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Qidiruv so‘zini o‘zgartirib yoki boshqa toifani tanlab ko‘ring.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('Barchasi');
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-50 text-blue-600 font-semibold text-xs hover:bg-blue-100 transition"
          >
            Filtrni tozalash
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const isBookmarked = bookmarkedIds.includes(book.id);

            return (
              <div
                key={book.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300"
              >
                {/* Book Cover */}
                <div className="relative h-60 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  {/* Category badge */}
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-900/70 backdrop-blur-md text-[11px] font-bold text-white border border-white/20">
                    {book.category}
                  </span>

                  {/* Bookmark button */}
                  <button
                    onClick={(e) => toggleBookmark(book.id, e)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/60 backdrop-blur-md text-white hover:bg-white hover:text-blue-600 transition"
                    title={isBookmarked ? 'Saqlangan' : 'Saqlab qo‘yish'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isBookmarked ? 'fill-blue-500 text-blue-500' : ''
                      }`}
                    />
                  </button>

                  {/* Quick info over cover */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] text-white/90 font-medium">
                    <span className="flex items-center gap-1">
                      <FileText className="w-3.5 h-3.5 text-blue-300" />
                      {book.pagesCount} sahifa
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {book.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                {/* Book Details */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                      {book.author}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                      {book.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                      <span>Hajmi: {book.fileSize}</span>
                      <span>{book.downloadsCount} marta o‘qilgan</span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleOpenReader(book)}
                        className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer shadow-xs shadow-blue-500/20"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>O‘qish</span>
                      </button>

                      <button
                        onClick={(e) => handleDownload(book, e)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
                        title="PDF yuklab olish"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Yuklash</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Interactive E-Book Reader Modal */}
      {readingBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Reader Header */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white truncate">
                    {readingBook.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {readingBook.author} • {readingBook.category}
                  </p>
                </div>
              </div>

              {/* Reader Controls */}
              <div className="flex items-center gap-2">
                {/* Font size adjuster */}
                <div className="hidden sm:flex items-center bg-slate-200/80 dark:bg-slate-700 rounded-xl p-1 text-xs">
                  <button
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-1 rounded-lg font-bold transition ${
                      fontSize === 'sm'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-1 rounded-lg font-bold transition ${
                      fontSize === 'base'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    A
                  </button>
                  <button
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-1 rounded-lg font-bold transition ${
                      fontSize === 'lg'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    A+
                  </button>
                  <button
                    onClick={() => setFontSize('xl')}
                    className={`px-2 py-1 rounded-lg font-bold transition ${
                      fontSize === 'xl'
                        ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    A++
                  </button>
                </div>

                {/* Download PDF directly */}
                <button
                  onClick={(e) => handleDownload(readingBook, e)}
                  className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  title="PDF yuklab olish"
                >
                  <Download className="w-5 h-5" />
                </button>

                {/* Close modal */}
                <button
                  onClick={() => setReadingBook(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Reader Content Body */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-6">
              {/* Chapter title */}
              <div className="pb-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {readingBook.sampleContent[currentChapterIndex]?.chapter ||
                    readingBook.tableOfContents[currentChapterIndex] ||
                    'Asosiy matn'}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  Bob: {currentChapterIndex + 1} / {readingBook.tableOfContents.length}
                </span>
              </div>

              {/* Book Chapter Text */}
              <div
                className={`prose dark:prose-invert max-w-none text-slate-800 dark:text-slate-200 leading-relaxed font-serif whitespace-pre-line ${
                  fontSize === 'sm'
                    ? 'text-sm'
                    : fontSize === 'base'
                    ? 'text-base'
                    : fontSize === 'lg'
                    ? 'text-lg'
                    : 'text-xl'
                }`}
              >
                {readingBook.sampleContent[currentChapterIndex]?.text ||
                  readingBook.description}
              </div>

              {/* Table of contents preview */}
              <div className="mt-10 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">
                  Kitob Mundarijasi
                </h4>
                <div className="space-y-1.5">
                  {readingBook.tableOfContents.map((chap, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentChapterIndex(idx)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition flex items-center justify-between ${
                        currentChapterIndex === idx
                          ? 'bg-blue-600 text-white font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                      }`}
                    >
                      <span>{chap}</span>
                      {currentChapterIndex === idx && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reader Footer Navigation */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <button
                disabled={currentChapterIndex === 0}
                onClick={() => setCurrentChapterIndex((c) => Math.max(0, c - 1))}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Oldingi bob</span>
              </button>

              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {currentChapterIndex + 1} / {readingBook.tableOfContents.length}
              </div>

              <button
                disabled={
                  currentChapterIndex === readingBook.tableOfContents.length - 1
                }
                onClick={() =>
                  setCurrentChapterIndex((c) =>
                    Math.min(readingBook.tableOfContents.length - 1, c + 1)
                  )
                }
                className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5 shadow-xs"
              >
                <span>Keyingi bob</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Yangi Kitob Qo‘shish
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBook} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kitob nomi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: JavaScript To‘liq Qo‘llanma"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Muallif *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Muallif ismi"
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
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
                          | 'Psixologiya & Rivojlanish'
                      )
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  >
                    <option value="Dasturlash">Dasturlash</option>
                    <option value="Sun'iy Intellekt">Sun'iy Intellekt</option>
                    <option value="Kiberxavfsizlik">Kiberxavfsizlik</option>
                    <option value="Dizayn">Dizayn</option>
                    <option value="Xorijiy Tillar">Xorijiy Tillar</option>
                    <option value="Aniq Fanlar">Aniq Fanlar</option>
                    <option value="Psixologiya & Rivojlanish">
                      Psixologiya & Rivojlanish
                    </option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Sahifalar soni
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newPages}
                    onChange={(e) => setNewPages(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Muqova rasmi (URL)
                  </label>
                  <input
                    type="url"
                    value={newCover}
                    onChange={(e) => setNewCover(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Qisqacha tavsif
                </label>
                <textarea
                  rows={3}
                  placeholder="Kitob haqida qisqacha ma'lumot..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-hidden resize-none"
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
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  Kitobni saqlash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
