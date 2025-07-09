
import { useState, useEffect } from 'react';
import { addDays, format, isAfter, isSameDay } from 'date-fns';

export interface SadhanaData {
  purpose: string;
  goal: string;
  deity: string;
  message: string;
  offerings: string[];
  startDate: string;
  endDate: string;
  durationDays: number;
}

export interface SadhanaState {
  hasStarted: boolean;
  isCreating: boolean;
  data: SadhanaData | null;
  startedAt?: string;
  completedAt?: string;
  brokenAt?: string;
  status: 'active' | 'completed' | 'broken';
}

const STORAGE_KEY = 'sadhana-state';

const getInitialState = (): SadhanaState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.log('Could not load sadhana state from localStorage');
  }
  
  return {
    hasStarted: false,
    isCreating: false,
    data: null,
    status: 'active'
  };
};

// Helper function to create daily tasks from sadhana offerings
const createSadhanaTasksInLocalStorage = (sadhanaData: SadhanaData) => {
  try {
    const existingTasks = JSON.parse(localStorage.getItem('saadhanas') || '[]');
    const newTasks = [];
    
    // Create tasks for each day of the sadhana period
    for (let day = 0; day < sadhanaData.durationDays; day++) {
      const taskDate = addDays(new Date(sadhanaData.startDate), day);
      const formattedDate = format(taskDate, 'yyyy-MM-dd');
      
      // Create a task for each offering on each day
      sadhanaData.offerings.forEach((offering, index) => {
        const task = {
          id: Date.now() + day * 1000 + index, // Unique ID
          title: offering,
          description: `Daily offering for your ${sadhanaData.durationDays}-day spiritual practice dedicated to ${sadhanaData.deity}`,
          completed: false,
          category: 'daily' as const,
          dueDate: formattedDate,
          priority: 'high' as const,
          tags: ['sadhana', 'offering'],
          sadhanaId: Date.now() // Link to the sadhana
        };
        newTasks.push(task);
      });
    }
    
    // Combine with existing tasks and save
    const allTasks = [...existingTasks, ...newTasks];
    localStorage.setItem('saadhanas', JSON.stringify(allTasks));
    
    console.log(`Created ${newTasks.length} sadhana tasks for ${sadhanaData.durationDays} days`);
  } catch (error) {
    console.log('Could not create sadhana tasks:', error);
  }
};

// Helper function to remove sadhana tasks when sadhana is broken/reset
const removeSadhanaTasksFromLocalStorage = (sadhanaId: number) => {
  try {
    const existingTasks = JSON.parse(localStorage.getItem('saadhanas') || '[]');
    const filteredTasks = existingTasks.filter((task: any) => task.sadhanaId !== sadhanaId);
    localStorage.setItem('saadhanas', JSON.stringify(filteredTasks));
    console.log('Removed sadhana tasks from localStorage');
  } catch (error) {
    console.log('Could not remove sadhana tasks:', error);
  }
};

export const useSadhanaData = () => {
  const [sadhanaState, setSadhanaState] = useState<SadhanaState>(getInitialState);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(sadhanaState));
    } catch (error) {
      console.log('Could not save sadhana state to localStorage');
    }
  }, [sadhanaState]);

  const startSadhanaCreation = () => {
    setSadhanaState(prev => ({
      ...prev,
      isCreating: true
    }));
  };

  const cancelSadhanaCreation = () => {
    setSadhanaState(prev => ({
      ...prev,
      isCreating: false
    }));
  };

  const createSadhana = (data: SadhanaData) => {
    const sadhanaId = Date.now();
    
    setSadhanaState({
      hasStarted: true,
      isCreating: false,
      data,
      startedAt: new Date().toISOString(),
      status: 'active'
    });
    
    // Create daily tasks from offerings
    createSadhanaTasksInLocalStorage(data);
  };

  const updateSadhana = (data: SadhanaData) => {
    setSadhanaState(prev => ({
      ...prev,
      data
    }));
  };

  const completeSadhana = () => {
    if (!sadhanaState.data) return;
    
    // Save to history before resetting
    const historicalSadhana = {
      id: Date.now().toString(),
      title: `${sadhanaState.data.durationDays}-Day Spiritual Practice`,
      ...sadhanaState.data,
      completedAt: new Date().toISOString(),
      status: 'completed' as const,
      actualDuration: sadhanaState.data.durationDays
    };
    
    // Dispatch custom event for profile data to listen to
    window.dispatchEvent(new CustomEvent('sadhana-completed', { detail: historicalSadhana }));
    
    setSadhanaState(prev => ({
      ...prev,
      completedAt: new Date().toISOString(),
      status: 'completed'
    }));
  };

  const breakSadhana = () => {
    if (!sadhanaState.data) return;
    
    // Calculate actual duration based on start date
    const today = new Date();
    const startDate = new Date(sadhanaState.data.startDate);
    const diffTime = today.getTime() - startDate.getTime();
    const actualDuration = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
    
    // Save to history before resetting
    const historicalSadhana = {
      id: Date.now().toString(),
      title: `${sadhanaState.data.durationDays}-Day Spiritual Practice (Broken)`,
      ...sadhanaState.data,
      brokenAt: new Date().toISOString(),
      status: 'broken' as const,
      actualDuration
    };
    
    // Dispatch custom event for profile data to listen to
    window.dispatchEvent(new CustomEvent('sadhana-broken', { detail: historicalSadhana }));
    
    // Remove sadhana tasks from localStorage
    const sadhanaId = Date.now(); // This should be stored when creating sadhana
    removeSadhanaTasksFromLocalStorage(sadhanaId);
    
    setSadhanaState(prev => ({
      ...prev,
      brokenAt: new Date().toISOString(),
      status: 'broken'
    }));
  };

  const resetSadhana = () => {
    // Remove sadhana tasks from localStorage when resetting
    if (sadhanaState.data) {
      const sadhanaId = Date.now(); // This should be stored when creating sadhana
      removeSadhanaTasksFromLocalStorage(sadhanaId);
    }
    
    setSadhanaState({
      hasStarted: false,
      isCreating: false,
      data: null,
      status: 'active'
    });
  };

  const canComplete = (): boolean => {
    if (!sadhanaState.data) return false;
    const today = new Date();
    const endDate = new Date(sadhanaState.data.endDate);
    return isAfter(today, endDate) || isSameDay(today, endDate);
  };

  const getDaysRemaining = (): number => {
    if (!sadhanaState.data) return 0;
    const today = new Date();
    const endDate = new Date(sadhanaState.data.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const getDaysCompleted = (): number => {
    if (!sadhanaState.data) return 0;
    const today = new Date();
    const startDate = new Date(sadhanaState.data.startDate);
    const diffTime = today.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(diffDays, sadhanaState.data.durationDays));
  };

  const getProgress = (): number => {
    if (!sadhanaState.data) return 0;
    const completed = getDaysCompleted();
    return Math.min(100, (completed / sadhanaState.data.durationDays) * 100);
  };

  const formatPaperContent = (data: SadhanaData): string => {
    return `
Purpose:
${data.purpose}

Goal:
${data.goal}

Divine Focus:
${data.deity}

Duration:
${data.durationDays} days (${format(new Date(data.startDate), 'MMM dd, yyyy')} - ${format(new Date(data.endDate), 'MMM dd, yyyy')})

Message:
"${data.message}"

My Offerings:
${data.offerings.map((o, i) => `${i+1}. ${o}`).join('\n')}
    `;
  };

  return {
    sadhanaState,
    sadhanaData: sadhanaState.data,
    paperContent: sadhanaState.data ? formatPaperContent(sadhanaState.data) : '',
    startSadhanaCreation,
    cancelSadhanaCreation,
    createSadhana,
    updateSadhana,
    completeSadhana,
    breakSadhana,
    resetSadhana,
    canComplete: canComplete(),
    daysRemaining: getDaysRemaining(),
    daysCompleted: getDaysCompleted(),
    progress: getProgress()
  };
};
