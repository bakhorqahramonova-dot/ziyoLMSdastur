/**
 * Security and Password Management Utilities for ZiyoLMS
 */

export interface PasswordStrengthResult {
  score: number; // 0 - 100
  label: 'Kuchsiz' | 'O\'rtacha' | 'Kuchli' | 'Juda xavfsiz';
  color: string;
  bgColor: string;
  tips: string[];
}

const UPPERCASE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ'; // Removed confusing O, I
const LOWERCASE_CHARS = 'abcdefghijkmnopqrstuvwxyz'; // Removed confusing l
const NUMBER_CHARS = '23456789'; // Removed confusing 0, 1
const SYMBOL_CHARS = '!@#$%^&*_-+=';

/**
 * Generates a high-entropy cryptographically secure password
 */
export function generateSecurePassword(length = 12): string {
  // Guarantee at least 2 uppercase, 2 lowercase, 2 numbers, 2 symbols
  const guaranteed = [
    UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)],
    UPPERCASE_CHARS[Math.floor(Math.random() * UPPERCASE_CHARS.length)],
    LOWERCASE_CHARS[Math.floor(Math.random() * LOWERCASE_CHARS.length)],
    LOWERCASE_CHARS[Math.floor(Math.random() * LOWERCASE_CHARS.length)],
    NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)],
    NUMBER_CHARS[Math.floor(Math.random() * NUMBER_CHARS.length)],
    SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)],
    SYMBOL_CHARS[Math.floor(Math.random() * SYMBOL_CHARS.length)],
  ];

  const allChars = UPPERCASE_CHARS + LOWERCASE_CHARS + NUMBER_CHARS + SYMBOL_CHARS;
  const remainingCount = Math.max(0, length - guaranteed.length);

  const remaining: string[] = [];
  for (let i = 0; i < remainingCount; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    remaining.push(allChars[randomIndex]);
  }

  // Combine and shuffle thoroughly (Fisher-Yates)
  const combined = [...guaranteed, ...remaining];
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }

  return combined.join('');
}

/**
 * Evaluates password strength and returns rating
 */
export function calculatePasswordStrength(password: string): PasswordStrengthResult {
  if (!password) {
    return {
      score: 0,
      label: 'Kuchsiz',
      color: 'text-rose-500',
      bgColor: 'bg-rose-500',
      tips: ['Parol kiritilmadi'],
    };
  }

  let score = 0;
  const tips: string[] = [];

  // Length check
  if (password.length >= 8) score += 25;
  if (password.length >= 12) score += 20;
  if (password.length < 8) tips.push('Kamida 8 ta belgidan iborat bo\'lishi tavsiya etiladi');

  // Character variety checks
  if (/[A-Z]/.test(password)) {
    score += 15;
  } else {
    tips.push('Katta harf (A-Z) qo\'shing');
  }

  if (/[a-z]/.test(password)) {
    score += 15;
  } else {
    tips.push('Kichik harf (a-z) qo\'shing');
  }

  if (/[0-9]/.test(password)) {
    score += 15;
  } else {
    tips.push('Raqamlar (0-9) qo\'shing');
  }

  if (/[!@#$%^&*_\-+=~|]/.test(password)) {
    score += 10;
  } else {
    tips.push('Maxsus belgilar (!@#$%^&*) qo\'shing');
  }

  // Rating
  if (score < 50) {
    return {
      score,
      label: 'Kuchsiz',
      color: 'text-rose-600',
      bgColor: 'bg-rose-500',
      tips,
    };
  } else if (score < 75) {
    return {
      score,
      label: 'O\'rtacha',
      color: 'text-amber-600',
      bgColor: 'bg-amber-500',
      tips,
    };
  } else if (score < 90) {
    return {
      score,
      label: 'Kuchli',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500',
      tips,
    };
  } else {
    return {
      score: 100,
      label: 'Juda xavfsiz',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500',
      tips: ["A'lo darajada! Parol xalqaro xavfsizlik talablariga to'liq javob beradi."],
    };
  }
}

/**
 * Transliterates Uzbek Cyrillic/Latin to standard clean username slug
 */
export function generateStudentUsername(fullName: string, indexId?: number | string): string {
  const parts = fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .split(/\s+/);

  if (parts.length === 0 || !parts[0]) {
    return `student_${Math.floor(1000 + Math.random() * 9000)}`;
  }

  const firstName = parts[0];
  const lastName = parts[1] || '';
  const suffix = indexId ? String(indexId).slice(-3) : Math.floor(100 + Math.random() * 900);

  if (lastName) {
    return `${firstName[0]}.${lastName}${suffix}`;
  }
  return `${firstName}${suffix}`;
}

/**
 * Generates unique student ID code (e.g. STU-2024-842)
 */
export function generateStudentIdCode(index?: number): string {
  const num = index !== undefined ? 1000 + index : Math.floor(10000 + Math.random() * 90000);
  return `STU-${num}`;
}
