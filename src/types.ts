export type NavigationTab =
  | 'dashboard'
  | 'courses'
  | 'course-detail'
  | 'video-lessons'
  | 'books'
  | 'games'
  | 'game-play'
  | 'quizzes'
  | 'quiz-play'
  | 'schedule'
  | 'students'
  | 'teachers'
  | 'results'
  | 'announcements'
  | 'profile'
  | 'settings';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  grade: string;
  school: string;
  bio: string;
  totalPoints: number;
  completedCoursesCount: number;
  inProgressCoursesCount: number;
  level: string;
  rank: number;
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  videoUrl?: string;
  summary: string;
  isCompleted: boolean;
  resources?: { name: string; size: string; type: string; downloadUrl: string }[];
}

export interface CourseAssignment {
  id: string;
  title: string;
  deadline: string;
  description: string;
  submitted?: boolean;
  grade?: string;
  feedback?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  teacher: string;
  teacherRole: string;
  teacherAvatar: string;
  description: string;
  image: string;
  duration: string;
  totalLessons: number;
  progressPercent: number;
  isCompleted: boolean;
  level: 'Boshlang\'ich' | 'O\'rta' | 'Mukammal';
  rating: number;
  studentsCount: number;
  lessons: Lesson[];
  assignments: CourseAssignment[];
  syllabusOverview: string[];
}

export type GameType = 'quiz_battle' | 'math_challenge' | 'word_scramble' | 'logic_puzzle' | 'schedule_builder';

export interface GameInfo {
  id: GameType;
  title: string;
  icon: string;
  category: string;
  description: string;
  difficulty: 'Oson' | 'O\'rtacha' | 'Qiyin';
  timeLimitSeconds: number;
  totalQuestions: number;
  rewardPoints: number;
  colorScheme: string;
  highScore?: number;
  playsCount: number;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  subject: string;
  questionsCount: number;
  timeLimitMinutes: number;
  difficulty: 'Oson' | 'O\'rtacha' | 'Qiyin';
  passingScorePercent: number;
  author: string;
  description: string;
  questions: QuizQuestion[];
  attemptsCount: number;
  lastScorePercent?: number;
}

export interface ScheduleItem {
  id: string;
  day: 'Dushanba' | 'Seshanba' | 'Chorshanba' | 'Payshanba' | 'Juma' | 'Shanba';
  subject: string;
  teacher: string;
  startTime: string;
  endTime: string;
  room: string;
  type: 'Ma\'ruza' | 'Amaliyot' | 'Laboratoriya' | 'Seminar';
  color: string;
}

export interface Student {
  id: string;
  fullName: string;
  username: string;
  studentIdCode: string;
  password?: string;
  passwordStrength?: 'Kuchsiz' | 'O\'rtacha' | 'Kuchli' | 'Juda xavfsiz';
  group: string;
  email: string;
  phone: string;
  avatar: string;
  enrolledCourses: number;
  averageScore: number;
  points: number;
  status: 'Faol' | 'Ta\'tilda' | 'Bitirgan';
  lastLogin?: string;
  twoFactorEnabled?: boolean;
  isAccountLocked?: boolean;
}

export interface Teacher {
  id: string;
  fullName: string;
  subject: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  rating: number;
  coursesCount: number;
  studentsCount: number;
  experience: string;
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Muhim' | 'Imtihon' | 'Vebinar' | 'Tadbir' | 'Eslatma';
  content: string;
  date: string;
  author: string;
  isPinned?: boolean;
}

export interface GameResultRecord {
  gameId: GameType;
  gameTitle: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
  percent: number;
  date: string;
  timeSpentSeconds: number;
}

export interface GoogleFormParticipant {
  studentId: string;
  studentName: string;
  username?: string;
  group: string;
  email: string;
  avatar: string;
  status: 'Bajarildi' | 'Jarayonda' | 'Kirmagan';
  enteredAt?: string;
  submittedAt?: string;
  score?: number;
  note?: string;
}

export interface QuizResultRecord {
  quizId: string;
  quizTitle: string;
  subject: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  date: string;
  timeSpentSeconds: number;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: 'Dasturlash' | 'Sun\'iy Intellekt' | 'Kiberxavfsizlik' | 'Dizayn' | 'Xorijiy Tillar' | 'Aniq Fanlar' | 'Psixologiya & Rivojlanish';
  coverImage: string;
  description: string;
  pagesCount: number;
  fileSize: string;
  year: number;
  language: 'O\'zbekcha' | 'Inglizcha' | 'Ruscha';
  rating: number;
  downloadsCount: number;
  readTime: string;
  tableOfContents: string[];
  sampleContent: {
    chapter: string;
    text: string;
  }[];
  isFeatured?: boolean;
}

export interface VideoLessonItem {
  id: string;
  title: string;
  courseId?: string;
  courseName: string;
  teacher: string;
  teacherRole: string;
  teacherAvatar: string;
  category: 'Dasturlash' | 'Sun\'iy Intellekt' | 'Kiberxavfsizlik' | 'Dizayn' | 'Xorijiy Tillar' | 'Aniq Fanlar';
  duration: string;
  viewsCount: number;
  videoUrl: string;
  thumbnail: string;
  summary: string;
  keyTakeaways: string[];
  level: 'Boshlang\'ich' | 'O\'rta' | 'Mukammal';
  date: string;
  isCompleted?: boolean;
}


