export interface DuaResponse {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string; // e.g., "Surah Al-Baqarah 2:286" or "Inspirational"
  guidance: string; // Comforting explanation
}

export interface MoodPreset {
  emoji: string;
  label: string;
  query: string;
}

export interface Verse {
  id: string;
  verseNumber: number;
  arabicText: string;
  translation: string;
}

export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  verses: Verse[];
}

export interface UserProgress {
  box: number;
  nextReviewDate?: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}