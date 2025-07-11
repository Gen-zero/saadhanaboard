
import { useState, useEffect } from 'react';
import { Sadhana } from '@/types/sadhana';
import { isToday, isPast, isFuture, parseISO } from 'date-fns';

interface GroupedSaadhanas {
  overdue: Sadhana[];
  today: Sadhana[];
  upcoming: Sadhana[];
  noDueDate: Sadhana[];
  completed: Sadhana[];
}

const STORAGE_KEY = 'saadhanas';

export const useSaadhanas = () => {
  const [saadhanas, setSaadhanas] = useState<Sadhana[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [reflectingSadhana, setReflectingSadhana] = useState<Sadhana | null>(null);
  const [reflectionText, setReflectionText] = useState('');

  // Load saadhanas from localStorage on mount
  useEffect(() => {
    const loadSaadhanas = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsedSaadhanas = JSON.parse(stored);
          setSaadhanas(parsedSaadhanas);
        }
      } catch (error) {
        console.log('Could not load saadhanas from localStorage');
      }
    };

    loadSaadhanas();

    // Listen for storage changes (in case other tabs modify the data)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        loadSaadhanas();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Save saadhanas to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saadhanas));
    } catch (error) {
      console.log('Could not save saadhanas to localStorage');
    }
  }, [saadhanas]);

  const handleAddSadhana = (newSadhana: Omit<Sadhana, 'id'>) => {
    const sadhana: Sadhana = {
      ...newSadhana,
      id: Date.now(),
    };
    setSaadhanas(prev => [...prev, sadhana]);
  };

  const handleUpdateSadhana = (updatedSadhana: Sadhana) => {
    setSaadhanas(prev => 
      prev.map(sadhana => 
        sadhana.id === updatedSadhana.id ? updatedSadhana : sadhana
      )
    );
  };

  const handleDeleteSadhana = (id: number) => {
    setSaadhanas(prev => prev.filter(sadhana => sadhana.id !== id));
  };

  const handleToggleCompletion = (sadhana: Sadhana) => {
    const updatedSadhana = { ...sadhana, completed: !sadhana.completed };
    handleUpdateSadhana(updatedSadhana);
    
    if (updatedSadhana.completed) {
      setReflectingSadhana(updatedSadhana);
      setReflectionText(updatedSadhana.reflection || '');
    }
  };

  const handleSaveReflection = () => {
    if (reflectingSadhana) {
      const updatedSadhana = { ...reflectingSadhana, reflection: reflectionText };
      handleUpdateSadhana(updatedSadhana);
      setReflectingSadhana(null);
      setReflectionText('');
    }
  };

  // Filter and search saadhanas
  const filteredSaadhanas = saadhanas.filter(sadhana => {
    const matchesSearch = sadhana.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sadhana.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         sadhana.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFilter = filter === 'all' || sadhana.priority === filter;
    
    return matchesSearch && matchesFilter;
  });

  // Group saadhanas by status and due date
  const groupedSaadhanas: GroupedSaadhanas = filteredSaadhanas.reduce(
    (groups, sadhana) => {
      if (sadhana.completed) {
        groups.completed.push(sadhana);
      } else if (!sadhana.dueDate) {
        groups.noDueDate.push(sadhana);
      } else {
        const dueDate = parseISO(sadhana.dueDate);
        if (isToday(dueDate)) {
          groups.today.push(sadhana);
        } else if (isPast(dueDate)) {
          groups.overdue.push(sadhana);
        } else if (isFuture(dueDate)) {
          groups.upcoming.push(sadhana);
        }
      }
      return groups;
    },
    {
      overdue: [] as Sadhana[],
      today: [] as Sadhana[],
      upcoming: [] as Sadhana[],
      noDueDate: [] as Sadhana[],
      completed: [] as Sadhana[]
    }
  );

  return {
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
    reflectingSadhana,
    setReflectingSadhana,
    reflectionText,
    setReflectionText,
    groupedSaadhanas,
    handleAddSadhana,
    handleUpdateSadhana,
    handleDeleteSadhana,
    handleToggleCompletion,
    handleSaveReflection
  };
};
