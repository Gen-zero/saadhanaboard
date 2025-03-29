
export interface SpiritualBook {
  id: string;
  title: string;
  author: string;
  traditions: string[];
  content: string;
  coverUrl?: string;
  description?: string;
  year?: number;
  source?: string;
  language?: string;
  pageCount?: number;
}

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  profilePicture?: string;
  preferences?: {
    favoriteBooks?: string[];
    readingHistory?: {
      bookId: string;
      lastReadPosition: number;
      lastReadDate: string;
    }[];
    theme?: 'light' | 'dark' | 'system';
  };
}
