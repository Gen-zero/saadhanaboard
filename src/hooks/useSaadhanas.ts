
import { useState, useEffect, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Sadhana } from '@/types/sadhana';

export const useSaadhanas = () => {
  const [saadhanas, setSaadhanas] = useState<Sadhana[]>([]);
  const [activeTab, setActiveTab] = useState('all');
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

  const filteredSaadhanas = useMemo(() => saadhanas.filter(sadhana => {
    if (activeTab === 'daily' && sadhana.category !== 'daily') return false;
    if (activeTab === 'goals' && sadhana.category !== 'goal') return false;
    if (activeTab === 'completed' && !sadhana.completed) return false;
    if (activeTab === 'incomplete' && sadhana.completed) return false;
    if (filter !== 'all' && sadhana.priority !== filter) return false;
    if (searchQuery && !sadhana.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [saadhanas, activeTab, filter, searchQuery]);

  const sortedSaadhanas = useMemo(() => [...filteredSaadhanas].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    if (a.priority !== b.priority) return priorityOrder[a.priority] - priorityOrder[b.priority];
    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    return a.title.localeCompare(b.title);
  }), [filteredSaadhanas]);

  return {
    activeTab, setActiveTab,
    searchQuery, setSearchQuery,
    filter, setFilter,
    reflectingSadhana, setReflectingSadhana,
    reflectionText, setReflectionText,
    sortedSaadhanas,
    handleAddSadhana,
    handleUpdateSadhana,
    handleDeleteSadhana,
    handleToggleCompletion,
    handleSaveReflection
  };
};
