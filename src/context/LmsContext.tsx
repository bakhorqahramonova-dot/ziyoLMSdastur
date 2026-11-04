import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  NavigationTab,
  UserProfile,
  Course,
  GameType,
  GameResultRecord,
  QuizResultRecord,
  ScheduleItem,
  Student,
  Teacher,
  Announcement,
  Quiz,
  GoogleFormParticipant,
  Book,
  VideoLessonItem,
} from '../types';
import {
  initialUserProfile,
  initialCourses,
  initialQuizzes,
  weeklySchedule,
  initialStudents,
  initialTeachers,
  initialAnnouncements,
} from '../data/initialData';
import { initialBooks, initialVideoLessons } from '../data/learningResourcesData';
import {
  generateSecurePassword,
  calculatePasswordStrength,
  generateStudentUsername,
  generateStudentIdCode,
} from '../utils/security';

interface SettingsState {
  theme: 'light' | 'dark';
  language: 'uz' | 'ru' | 'en';
  emailNotifications: boolean;
  pushNotifications: boolean;
  lessonReminders: boolean;
}

interface LmsContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedCourseId: string | null;
  selectedGameId: GameType | null;
  selectedQuizId: string | null;
  selectedBookId: string | null;
  setSelectedBookId: (id: string | null) => void;
  selectedVideoLessonId: string | null;
  setSelectedVideoLessonId: (id: string | null) => void;
  
  // Navigation helpers
  navigateToCourse: (courseId: string) => void;
  navigateToGame: (gameId: GameType) => void;
  navigateToQuiz: (quizId: string) => void;
  navigateToBook: (bookId: string) => void;
  navigateToVideoLesson: (videoId: string) => void;
  navigateBack: () => void;
  
  // Data State
  userProfile: UserProfile;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  courses: Course[];
  toggleLessonCompletion: (courseId: string, lessonId: string) => void;
  submitCourseAssignment: (courseId: string, assignmentId: string) => void;

  // Books & Video Lessons
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'downloadsCount' | 'rating'>) => void;
  videoLessons: VideoLessonItem[];
  addVideoLesson: (video: Omit<VideoLessonItem, 'id' | 'viewsCount'>) => void;
  toggleVideoLessonCompletion: (videoId: string) => void;
  
  quizzes: Quiz[];
  schedule: ScheduleItem[];
  addScheduleItem: (item: Omit<ScheduleItem, 'id'>) => void;
  
  students: Student[];
  addStudent: (student: Omit<Student, 'id' | 'points' | 'averageScore' | 'enrolledCourses' | 'username' | 'studentIdCode'> & { username?: string; password?: string }) => void;
  resetStudentPassword: (studentId: string, customPass?: string) => string;
  updateStudentCredentials: (studentId: string, updates: Partial<Student>) => void;
  toggleStudentAccountLock: (studentId: string) => void;
  toggleStudent2FA: (studentId: string) => void;
  loginAsStudent: (student: Student) => void;
  teachers: Teacher[];
  
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  
  // Results
  gameResults: GameResultRecord[];
  addGameResult: (result: GameResultRecord) => void;
  quizResults: QuizResultRecord[];
  addQuizResult: (result: QuizResultRecord) => void;
  
  // Settings
  settings: SettingsState;
  updateSettings: (updates: Partial<SettingsState>) => void;
  toggleTheme: () => void;

  // Google Form Online Test Tracking
  googleFormUrl: string;
  googleFormParticipants: GoogleFormParticipant[];
  recordGoogleFormEntry: (studentId: string, studentName?: string) => void;
  recordGoogleFormSubmission: (studentId: string, score?: number) => void;
  updateGoogleFormParticipantStatus: (
    studentId: string,
    status: 'Bajarildi' | 'Jarayonda' | 'Kirmagan',
    score?: number,
    note?: string
  ) => void;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const LmsContext = createContext<LmsContextType | undefined>(undefined);

export const LmsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [historyStack, setHistoryStack] = useState<NavigationTab[]>(['dashboard']);
  
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>('course-1');
  const [selectedGameId, setSelectedGameId] = useState<GameType | null>('quiz_battle');
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>('quiz-1');
  const [selectedBookId, setSelectedBookId] = useState<string | null>('book-1');
  const [selectedVideoLessonId, setSelectedVideoLessonId] = useState<string | null>('vid-1');

  // User profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('ziyo_user_profile');
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  // Courses
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('ziyo_courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });

  // Books (Elektron Kutubxona)
  const [books, setBooks] = useState<Book[]>(() => {
    const saved = localStorage.getItem('ziyo_books');
    return saved ? JSON.parse(saved) : initialBooks;
  });

  // Video Lessons
  const [videoLessons, setVideoLessons] = useState<VideoLessonItem[]>(() => {
    const saved = localStorage.getItem('ziyo_video_lessons');
    return saved ? JSON.parse(saved) : initialVideoLessons;
  });

  // Quizzes
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('ziyo_quizzes');
    return saved ? JSON.parse(saved) : initialQuizzes;
  });

  // Schedule
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('ziyo_schedule');
    return saved ? JSON.parse(saved) : weeklySchedule;
  });

  // Students & Teachers
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('ziyo_students');
    return saved ? JSON.parse(saved) : initialStudents;
  });
  const [teachers] = useState<Teacher[]>(initialTeachers);

  // Announcements
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('ziyo_announcements');
    return saved ? JSON.parse(saved) : initialAnnouncements;
  });

  // Game Results History
  const [gameResults, setGameResults] = useState<GameResultRecord[]>(() => {
    const saved = localStorage.getItem('ziyo_game_results');
    return saved
      ? JSON.parse(saved)
      : [
          {
            gameId: 'quiz_battle',
            gameTitle: 'Bilimlar bellashuvi',
            score: 90,
            correctAnswers: 9,
            wrongAnswers: 1,
            percent: 90,
            date: 'Kecha, 18:20',
            timeSpentSeconds: 120,
          },
          {
            gameId: 'math_challenge',
            gameTitle: 'Matematik o‘yin',
            score: 100,
            correctAnswers: 10,
            wrongAnswers: 0,
            percent: 100,
            date: '2 kun oldin',
            timeSpentSeconds: 95,
          },
        ];
  });

  // Quiz Results History
  const [quizResults, setQuizResults] = useState<QuizResultRecord[]>(() => {
    const saved = localStorage.getItem('ziyo_quiz_results');
    return saved
      ? JSON.parse(saved)
      : [
          {
            quizId: 'quiz-1',
            quizTitle: 'React 19 va Zamonaviy Frontend Standartlari',
            subject: 'Web Dasturlash',
            score: 80,
            total: 100,
            percent: 80,
            passed: true,
            date: '3 kun oldin',
            timeSpentSeconds: 480,
          },
        ];
  });

  // Settings
  const [settings, setSettings] = useState<SettingsState>(() => {
    const saved = localStorage.getItem('ziyo_settings');
    return saved
      ? JSON.parse(saved)
      : {
          theme: 'light',
          language: 'uz',
          emailNotifications: true,
          pushNotifications: true,
          lessonReminders: true,
        };
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('ziyo_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('ziyo_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('ziyo_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('ziyo_schedule', JSON.stringify(schedule));
  }, [schedule]);

  // Google Forms online test URL
  const GOOGLE_FORM_URL =
    'https://docs.google.com/forms/d/e/1FAIpQLSf8NCKJoGAMiq3CO6OvLqymA7kU33-TkiYtttde4kP8QeO2Pw/viewform?usp=header';

  // Google Forms participants tracking
  const [googleFormParticipants, setGoogleFormParticipants] = useState<GoogleFormParticipant[]>(() => {
    const saved = localStorage.getItem('ziyo_google_form_participants');
    if (saved) return JSON.parse(saved);
    return [
      {
        studentId: 'st-2',
        studentName: 'Mohinur Ismoilova',
        username: 'm.ismoilova24',
        group: 'WEB-2024-A',
        email: 'mohinur.ismoilova@ziyolms.uz',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        status: 'Bajarildi',
        enteredAt: 'Bugun, 09:15',
        submittedAt: 'Bugun, 09:42',
        score: 95,
        note: 'A\'lo darajada topshirdi',
      },
      {
        studentId: 'st-1',
        studentName: 'Javohir Rustamov',
        username: 'j.rustamov24',
        group: 'WEB-2024-A',
        email: 'javohir.rustamov@ziyolms.uz',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'Bajarildi',
        enteredAt: 'Bugun, 10:05',
        submittedAt: 'Bugun, 10:35',
        score: 90,
        note: 'Barcha savollarga to\'liq javob berilgan',
      },
      {
        studentId: 'st-4',
        studentName: 'Zarnigor To\'xtayeva',
        username: 'z.tuxtayeva24',
        group: 'UIUX-2024-A',
        email: 'zarnigor.t@ziyolms.uz',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
        status: 'Jarayonda',
        enteredAt: 'Bugun, 11:20',
        note: 'Hozirda testni yechmoqda...',
      },
      {
        studentId: 'st-3',
        studentName: 'Sardorbek Olimov',
        username: 's.olimov24',
        group: 'AI-2024-B',
        email: 'sardorbek.olimov@ziyolms.uz',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'Jarayonda',
        enteredAt: 'Bugun, 11:45',
        note: 'Test jarayonida',
      },
      {
        studentId: 'st-5',
        studentName: 'Bobur Mirzayev',
        username: 'b.mirzayev24',
        group: 'SEC-2024-C',
        email: 'bobur.mirzayev@ziyolms.uz',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        status: 'Kirmagan',
        note: 'Hali havola orqali kirmagan',
      },
      {
        studentId: 'st-6',
        studentName: 'Dildora Yusupova',
        username: 'd.yusupova24',
        group: 'WEB-2024-A',
        email: 'dildora.yusupova@ziyolms.uz',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        status: 'Kirmagan',
        note: 'Eslatma xati yuborilgan',
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('ziyo_google_form_participants', JSON.stringify(googleFormParticipants));
  }, [googleFormParticipants]);

  useEffect(() => {
    localStorage.setItem('ziyo_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('ziyo_video_lessons', JSON.stringify(videoLessons));
  }, [videoLessons]);

  useEffect(() => {
    localStorage.setItem('ziyo_students', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('ziyo_announcements', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('ziyo_game_results', JSON.stringify(gameResults));
  }, [gameResults]);

  useEffect(() => {
    localStorage.setItem('ziyo_quiz_results', JSON.stringify(quizResults));
  }, [quizResults]);

  useEffect(() => {
    localStorage.setItem('ziyo_settings', JSON.stringify(settings));
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSetActiveTab = (tab: NavigationTab) => {
    setHistoryStack((prev) => [...prev, tab]);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    handleSetActiveTab('course-detail');
  };

  const navigateToBook = (bookId: string) => {
    setSelectedBookId(bookId);
    handleSetActiveTab('books');
  };

  const navigateToVideoLesson = (videoId: string) => {
    setSelectedVideoLessonId(videoId);
    handleSetActiveTab('video-lessons');
  };

  const toggleVideoLessonCompletion = (videoId: string) => {
    setVideoLessons((prev) =>
      prev.map((v) => {
        if (v.id === videoId) {
          const nextCompleted = !v.isCompleted;
          if (nextCompleted) {
            setUserProfile((u) => ({
              ...u,
              totalPoints: u.totalPoints + 15,
            }));
            showToast('Video dars yakunlandi! +15 Ball berildi 🌟');
          } else {
            showToast('Dars holati yangilandi');
          }
          return { ...v, isCompleted: nextCompleted };
        }
        return v;
      })
    );
  };

  const addBook = (bookData: Omit<Book, 'id' | 'downloadsCount' | 'rating'>) => {
    const newBook: Book = {
      ...bookData,
      id: `book-${Date.now()}`,
      downloadsCount: 1,
      rating: 5.0,
    };
    setBooks((prev) => [newBook, ...prev]);
    showToast('Yangi kitob kutubxonaga muvaffaqiyatli qo\'shildi!');
  };

  const addVideoLesson = (videoData: Omit<VideoLessonItem, 'id' | 'viewsCount'>) => {
    const newVideo: VideoLessonItem = {
      ...videoData,
      id: `vid-${Date.now()}`,
      viewsCount: 1,
      isCompleted: false,
    };
    setVideoLessons((prev) => [newVideo, ...prev]);
    showToast('Yangi video darslik muvaffaqiyatli qo\'shildi!');
  };

  const navigateToGame = (gameId: GameType) => {
    setSelectedGameId(gameId);
    handleSetActiveTab('game-play');
  };

  const navigateToQuiz = (quizId: string) => {
    setSelectedQuizId(quizId);
    handleSetActiveTab('quiz-play');
  };

  const navigateBack = () => {
    if (historyStack.length > 1) {
      const newStack = [...historyStack];
      newStack.pop();
      const prevTab = newStack[newStack.length - 1];
      setHistoryStack(newStack);
      setActiveTab(prevTab);
    } else {
      setActiveTab('dashboard');
    }
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...updates }));
    showToast('Profil ma\'lumotlari muvaffaqiyatli yangilandi!');
  };

  const toggleLessonCompletion = (courseId: string, lessonId: string) => {
    setCourses((prevCourses) =>
      prevCourses.map((c) => {
        if (c.id !== courseId) return c;
        const updatedLessons = c.lessons.map((l) =>
          l.id === lessonId ? { ...l, isCompleted: !l.isCompleted } : l
        );
        const completedCount = updatedLessons.filter((l) => l.isCompleted).length;
        const newProgress = Math.round((completedCount / updatedLessons.length) * 100);
        return {
          ...c,
          lessons: updatedLessons,
          progressPercent: newProgress,
          isCompleted: newProgress === 100,
        };
      })
    );
    showToast('Dars holati yangilandi!');
  };

  const submitCourseAssignment = (courseId: string, assignmentId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        return {
          ...c,
          assignments: c.assignments.map((a) =>
            a.id === assignmentId
              ? {
                  ...a,
                  submitted: true,
                  grade: 'Kutilmoqda (Tekshiruvda)',
                  feedback: 'Topshirig\'ingiz o\'qituvchiga muvaffaqiyatli yuborildi.',
                }
              : a
          ),
        };
      })
    );
    showToast('Topshiriq tekshiruv uchun muvaffaqiyatli yuborildi!');
  };

  const addScheduleItem = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      ...item,
      id: `sch-${Date.now()}`,
    };
    setSchedule((prev) => [...prev, newItem]);
    showToast('Yangi dars jadvalga kiritildi!');
  };

  const addStudent = (
    studentData: Omit<Student, 'id' | 'points' | 'averageScore' | 'enrolledCourses' | 'username' | 'studentIdCode'> & {
      username?: string;
      password?: string;
    }
  ) => {
    const generatedUsername = studentData.username?.trim() || generateStudentUsername(studentData.fullName, students.length + 1);
    const generatedPassword = studentData.password?.trim() || generateSecurePassword(12);
    const strength = calculatePasswordStrength(generatedPassword).label;

    const newStudent: Student = {
      ...studentData,
      id: `st-${Date.now()}`,
      username: generatedUsername,
      studentIdCode: generateStudentIdCode(students.length + 1),
      password: generatedPassword,
      passwordStrength: strength,
      points: 1000,
      averageScore: 85,
      enrolledCourses: 3,
      status: 'Faol',
      lastLogin: 'Hozirgina qo\'shildi',
      twoFactorEnabled: true,
      isAccountLocked: false,
    };
    setStudents((prev) => [newStudent, ...prev]);
    showToast(`O'quvchi qo'shildi! Login: ${generatedUsername}`);
  };

  const resetStudentPassword = (studentId: string, customPass?: string): string => {
    const newPass = customPass?.trim() || generateSecurePassword(12);
    const strength = calculatePasswordStrength(newPass).label;

    setStudents((prev) =>
      prev.map((st) =>
        st.id === studentId
          ? {
              ...st,
              password: newPass,
              passwordStrength: strength,
            }
          : st
      )
    );
    showToast(`Yangi xavfsiz parol o'rnatildi: ${newPass}`);
    return newPass;
  };

  const updateStudentCredentials = (studentId: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((st) => (st.id === studentId ? { ...st, ...updates } : st))
    );
    showToast('O‘quvchi ma\'lumotlari yangilandi!');
  };

  const toggleStudentAccountLock = (studentId: string) => {
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === studentId) {
          const nextState = !st.isAccountLocked;
          showToast(nextState ? 'O‘quvchi hisobi vaqtincha bloklandi!' : 'O‘quvchi hisobi faollashtirildi!');
          return { ...st, isAccountLocked: nextState };
        }
        return st;
      })
    );
  };

  const toggleStudent2FA = (studentId: string) => {
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === studentId) {
          const nextState = !st.twoFactorEnabled;
          showToast(nextState ? '2FA (Ikki bosqichli himoya) yoqildi!' : '2FA o‘chirildi!');
          return { ...st, twoFactorEnabled: nextState };
        }
        return st;
      })
    );
  };

  const loginAsStudent = (student: Student) => {
    const now = new Date();
    const timeStr = `Bugun, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    // Update student's last login
    setStudents((prev) =>
      prev.map((st) => (st.id === student.id ? { ...st, lastLogin: timeStr } : st))
    );

    const parts = student.fullName.split(' ');
    setUserProfile({
      id: student.id,
      firstName: parts[0] || student.fullName,
      lastName: parts.slice(1).join(' ') || '',
      email: student.email,
      phone: student.phone,
      role: `O'quvchi / ${student.group}`,
      avatar: student.avatar,
      grade: `${student.group} guruhi talabasi`,
      school: 'Raqamli Texnologiyalar Akademiyasi',
      bio: `${student.fullName} — ZiyoLMS platformasining faol o'quvchisi.`,
      totalPoints: student.points,
      completedCoursesCount: 2,
      inProgressCoursesCount: student.enrolledCourses,
      level: 'Faol O\'quvchi',
      rank: 4,
    });

    handleSetActiveTab('dashboard');
    showToast(`${student.fullName} hisobiga muvaffaqiyatli kirildi!`);
  };

  const addAnnouncement = (item: Omit<Announcement, 'id' | 'date'>) => {
    const newAnn: Announcement = {
      ...item,
      id: `ann-${Date.now()}`,
      date: 'Hozirgina',
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    showToast('Yangi e\'lon chop etildi!');
  };

  const addGameResult = (result: GameResultRecord) => {
    setGameResults((prev) => [result, ...prev]);
    // update user score
    setUserProfile((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + result.score,
    }));
  };

  const addQuizResult = (result: QuizResultRecord) => {
    setQuizResults((prev) => [result, ...prev]);
    setUserProfile((prev) => ({
      ...prev,
      totalPoints: prev.totalPoints + result.score,
    }));
  };

  const updateSettings = (updates: Partial<SettingsState>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    showToast('Sozlamalar saqlandi!');
  };

  const toggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === 'light' ? 'dark' : 'light',
    }));
  };

  // Google Form Online Test Tracking Actions
  const recordGoogleFormEntry = (studentId: string, studentName?: string) => {
    const now = new Date();
    const timeStr = `Bugun, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setGoogleFormParticipants((prev) => {
      const exists = prev.some((p) => p.studentId === studentId);
      if (exists) {
        return prev.map((p) => {
          if (p.studentId === studentId) {
            // Keep Bajarildi if already submitted, otherwise set Jarayonda
            if (p.status === 'Bajarildi') return p;
            return {
              ...p,
              status: 'Jarayonda',
              enteredAt: p.enteredAt || timeStr,
              note: 'Hozirda testni yechmoqda...',
            };
          }
          return p;
        });
      } else {
        // Add new participant entry
        const matchedStudent = students.find((s) => s.id === studentId);
        const newPart: GoogleFormParticipant = {
          studentId,
          studentName: studentName || matchedStudent?.fullName || userProfile.firstName + ' ' + userProfile.lastName,
          username: matchedStudent?.username,
          group: matchedStudent?.group || userProfile.grade || 'WEB-2024-A',
          email: matchedStudent?.email || userProfile.email,
          avatar: matchedStudent?.avatar || userProfile.avatar,
          status: 'Jarayonda',
          enteredAt: timeStr,
          note: 'Test jarayonida',
        };
        return [newPart, ...prev];
      }
    });

    showToast('Testga kirishingiz qayd etildi (Status: Jarayonda)');
  };

  const recordGoogleFormSubmission = (studentId: string, score?: number) => {
    const now = new Date();
    const timeStr = `Bugun, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setGoogleFormParticipants((prev) => {
      const exists = prev.some((p) => p.studentId === studentId);
      if (exists) {
        return prev.map((p) => {
          if (p.studentId === studentId) {
            return {
              ...p,
              status: 'Bajarildi',
              submittedAt: timeStr,
              score: score ?? p.score ?? 85,
              note: 'Test muvaffaqiyatli topshirildi va qayd etildi',
            };
          }
          return p;
        });
      } else {
        const matchedStudent = students.find((s) => s.id === studentId);
        const newPart: GoogleFormParticipant = {
          studentId,
          studentName: matchedStudent?.fullName || userProfile.firstName + ' ' + userProfile.lastName,
          username: matchedStudent?.username,
          group: matchedStudent?.group || userProfile.grade || 'WEB-2024-A',
          email: matchedStudent?.email || userProfile.email,
          avatar: matchedStudent?.avatar || userProfile.avatar,
          status: 'Bajarildi',
          enteredAt: timeStr,
          submittedAt: timeStr,
          score: score ?? 85,
          note: 'Test topshirildi',
        };
        return [newPart, ...prev];
      }
    });

    showToast('Tabriklaymiz! Testni topshirganingiz muvaffaqiyatli qayd etildi (Status: Bajarildi) ✓');
  };

  const updateGoogleFormParticipantStatus = (
    studentId: string,
    status: 'Bajarildi' | 'Jarayonda' | 'Kirmagan',
    score?: number,
    note?: string
  ) => {
    const now = new Date();
    const timeStr = `Bugun, ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    setGoogleFormParticipants((prev) =>
      prev.map((p) => {
        if (p.studentId === studentId) {
          return {
            ...p,
            status,
            score: score !== undefined ? score : p.score,
            note: note || p.note,
            submittedAt: status === 'Bajarildi' ? p.submittedAt || timeStr : undefined,
            enteredAt: status !== 'Kirmagan' ? p.enteredAt || timeStr : undefined,
          };
        }
        return p;
      })
    );

    showToast(`O'quvchi holati yangilandi: ${status}`);
  };

  return (
    <LmsContext.Provider
      value={{
        activeTab,
        setActiveTab: handleSetActiveTab,
        selectedCourseId,
        selectedGameId,
        selectedQuizId,
        selectedBookId,
        setSelectedBookId,
        selectedVideoLessonId,
        setSelectedVideoLessonId,
        navigateToCourse,
        navigateToGame,
        navigateToQuiz,
        navigateToBook,
        navigateToVideoLesson,
        navigateBack,
        userProfile,
        updateUserProfile,
        courses,
        toggleLessonCompletion,
        submitCourseAssignment,
        books,
        addBook,
        videoLessons,
        addVideoLesson,
        toggleVideoLessonCompletion,
        quizzes,
        schedule,
        addScheduleItem,
        students,
        addStudent,
        resetStudentPassword,
        updateStudentCredentials,
        toggleStudentAccountLock,
        toggleStudent2FA,
        loginAsStudent,
        teachers,
        announcements,
        addAnnouncement,
        gameResults,
        addGameResult,
        quizResults,
        addQuizResult,
        settings,
        updateSettings,
        toggleTheme,
        googleFormUrl: GOOGLE_FORM_URL,
        googleFormParticipants,
        recordGoogleFormEntry,
        recordGoogleFormSubmission,
        updateGoogleFormParticipantStatus,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </LmsContext.Provider>
  );
};

export const useLms = () => {
  const context = useContext(LmsContext);
  if (!context) {
    throw new Error('useLms must be used within an LmsProvider');
  }
  return context;
};
