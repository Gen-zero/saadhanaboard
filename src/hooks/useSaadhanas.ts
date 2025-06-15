import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sadhana } from '@/types/sadhana';

export const useSaadhanas = () => {
  const [saadhanas, setSaadhanas] = useState<Sadhana[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [reflectingSadhana, setReflectingSadhana] = useState<Sadhana | null>(null);
  const [reflectionText, setReflectionText] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    const savedSaadhanas = localStorage.getItem('saadhanas');
    if (savedSaadhanas) {
      try {
        setSaadhanas(JSON.parse(savedSaadhanas));
      } catch (e) {
        console.error('Failed to parse saadhanas from localStorage:', e);
        setSaadhanas([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('saadhanas', JSON.stringify(saadhanas));
  }, [saadhanas]);

  const handleAddSadhana = (newSadhana: Omit<Sadhana, 'id' | 'reflection'>) => {
    if (!newSadhana.title.trim()) {
      toast({
        title: "Sadhana title required",
        description: "Please provide a title for your sadhana.",
        variant: "destructive"
      });
      return false;
    }
    
    const newSadhanaWithId: Sadhana = { ...newSadhana, id: Date.now() };
    setSaadhanas(prev => [...prev, newSadhanaWithId]);
    
    toast({
      title: "Sadhana added",
      description: "Your sadhana has been successfully added."
    });
    return true;
  };

  const handleUpdateSadhana = (sadhanaToUpdate: Sadhana) => {
    if (!sadhanaToUpdate.title.trim()) {
      toast({
        title: "Sadhana title required",
        description: "Please provide a title for your sadhana.",
        variant: "destructive"
      });
      return;
    }
    
    setSaadhanas(saadhanas.map(s => s.id === sadhanaToUpdate.id ? sadhanaToUpdate : s));
    
    toast({
      title: "Sadhana updated",
      description: "Your sadhana has been successfully updated."
    });
  };

  const handleDeleteSadhana = (id: number) => {
    setSaadhanas(saadhanas.filter(s => s.id !== id));
    toast({
      title: "Sadhana deleted",
      description: "Your sadhana has been deleted."
    });
  };

  const handleToggleCompletion = (sadhanaToToggle: Sadhana) => {
    if (sadhanaToToggle.completed) {
      setSaadhanas(prev =>
        prev.map(s =>
          s.id === sadhanaToToggle.id ? { ...s, completed: false, reflection: undefined } : s
        )
      );
      toast({
        title: "Sadhana incomplete",
        description: "Your sadhana has been marked as incomplete."
      });
    } else {
      setReflectingSadhana(sadhanaToToggle);
    }
  };

  const handleSaveReflection = () => {
    if (!reflectingSadhana) return;

    setSaadhanas(prev =>
      prev.map(s =>
        s.id === reflectingSadhana.id ? { ...s, completed: true, reflection: reflectionText } : s
      )
    );

    toast({
      title: "Sadhana Completed!",
      description: "Great job on your practice. Your reflection is saved."
    });

    setReflectingSadhana(null);
    setReflectionText('');
  };

  const groupedSaadhanas = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const groups: {
      overdue: Sadhana[];
      today: Sadhana[];
      upcoming: Sadhana[];
      noDueDate: Sadhana[];
      completed: Sadhana[];
    } = {
      overdue: [],
      today: [],
      upcoming: [],
      noDueDate: [],
      completed: [],
    };

    const filtered = saadhanas.filter(sadhana => {
      if (filter !== 'all' && sadhana.priority !== filter) return false;
      if (searchQuery && !sadhana.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });

    for (const sadhana of filtered) {
      if (sadhana.completed) {
        groups.completed.push(sadhana);
        continue;
      }
      if (sadhana.category === 'daily') {
        groups.today.push(sadhana);
        continue;
      }
      if (sadhana.dueDate) {
        const dueDate = new Date(sadhana.dueDate);
        if (dueDate.getTime() < now.getTime()) {
          groups.overdue.push(sadhana);
        } else if (dueDate.getFullYear() === now.getFullYear() && dueDate.getMonth() === now.getMonth() && dueDate.getDate() === now.getDate()) {
          groups.today.push(sadhana);
        } else {
          groups.upcoming.push(sadhana);
        }
      } else {
        groups.noDueDate.push(sadhana);
      }
    }

    const priorityOrder = { high: 0, medium: 1, low: 2 };
    const baseSort = (a: Sadhana, b: Sadhana) => {
      if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
      return a.title.localeCompare(b.title);
    };

    groups.overdue.sort((a, b) => {
        const aDate = new Date(a.dueDate!).getTime();
        const bDate = new Date(b.dueDate!).getTime();
        if (aDate !== bDate) return aDate - bDate;
        return baseSort(a,b);
    });
    groups.today.sort(baseSort);
    groups.upcoming.sort((a, b) => {
        const aDate = new Date(a.dueDate!).getTime();
        const bDate = new Date(b.dueDate!).getTime();
        if (aDate !== bDate) return aDate - bDate;
        return baseSort(a,b);
    });
    groups.noDueDate.sort(baseSort);
    groups.completed.sort((a, b) => b.id - a.id);

    return groups;
  }, [saadhanas, filter, searchQuery]);

  return {
    searchQuery, setSearchQuery,
    filter, setFilter,
    reflectingSadhana, setReflectingSadhana,
    reflectionText, setReflectionText,
    groupedSaadhanas,
    handleAddSadhana,
    handleUpdateSadhana,
    handleDeleteSadhana,
    handleToggleCompletion,
    handleSaveReflection
  };
};
