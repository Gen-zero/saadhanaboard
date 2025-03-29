
import { SpiritualBook } from "@/types/books";

// API endpoints
const GUTENDEX_API = "https://gutendex.com/books";
const OPEN_LIBRARY_API = "https://openlibrary.org/subjects/spirituality.json";
const BHAGAVAD_GITA_API = "https://bhagavadgita.io/api/v1/chapters";

// Function to fetch books from Gutendex (Project Gutenberg)
export async function fetchGutendexBooks(): Promise<SpiritualBook[]> {
  try {
    const response = await fetch(`${GUTENDEX_API}?topic=spirituality&page=1`);
    if (!response.ok) throw new Error('Failed to fetch Gutendex books');
    const data = await response.json();
    
    return data.results.map((book: any) => ({
      id: `gutendex-${book.id}`,
      title: book.title,
      author: book.authors[0]?.name || 'Unknown Author',
      traditions: ['Gutenberg Collection'],
      content: book.formats['text/plain'] || book.formats['text/html'] || '',
    }));
  } catch (error) {
    console.error("Error fetching Gutendex books:", error);
    return [];
  }
}

// Function to fetch books from Open Library
export async function fetchOpenLibraryBooks(): Promise<SpiritualBook[]> {
  try {
    const response = await fetch(OPEN_LIBRARY_API);
    if (!response.ok) throw new Error('Failed to fetch Open Library books');
    const data = await response.json();
    
    return data.works.map((book: any) => ({
      id: `openlibrary-${book.key.replace('/works/', '')}`,
      title: book.title,
      author: book.authors?.[0]?.name || 'Unknown Author',
      traditions: ['Open Library'],
      content: `https://openlibrary.org${book.key}`,
    }));
  } catch (error) {
    console.error("Error fetching Open Library books:", error);
    return [];
  }
}

// Function to fetch Bhagavad Gita chapters
export async function fetchBhagavadGitaChapters(): Promise<SpiritualBook[]> {
  try {
    const response = await fetch(BHAGAVAD_GITA_API);
    if (!response.ok) throw new Error('Failed to fetch Bhagavad Gita chapters');
    const data = await response.json();
    
    return data.map((chapter: any) => ({
      id: `bhagavadgita-${chapter.chapter_number}`,
      title: `Chapter ${chapter.chapter_number}: ${chapter.name}`,
      author: 'Vyasa',
      traditions: ['Hinduism', 'Vedic'],
      content: chapter.chapter_summary || '',
    }));
  } catch (error) {
    console.error("Error fetching Bhagavad Gita chapters:", error);
    return [];
  }
}

// Combined function to fetch books from all sources
export async function fetchAllSpiritualBooks(): Promise<SpiritualBook[]> {
  try {
    const [gutendexBooks, openLibraryBooks] = await Promise.all([
      fetchGutendexBooks(),
      fetchOpenLibraryBooks(),
      // We can add more API calls here as needed
    ]);
    
    return [...gutendexBooks, ...openLibraryBooks];
  } catch (error) {
    console.error("Error fetching all spiritual books:", error);
    return [];
  }
}
