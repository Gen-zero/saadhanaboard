
import { useState, useEffect } from 'react';

export interface SadhanaData {
  purpose: string;
  goal: string;
  deity: string;
  message: string;
  offerings: string[];
}

export interface SadhanaState {
  hasStarted: boolean;
  isCreating: boolean;
  data: SadhanaData | null;
  startedAt?: string;
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
    data: null
  };
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
    setSadhanaState({
      hasStarted: true,
      isCreating: false,
      data,
      startedAt: new Date().toISOString()
    });
  };

  const updateSadhana = (data: SadhanaData) => {
    setSadhanaState(prev => ({
      ...prev,
      data
    }));
  };

  const completeSadhana = () => {
    setSadhanaState({
      hasStarted: false,
      isCreating: false,
      data: null
    });
  };

  const formatPaperContent = (data: SadhanaData): string => {
    return `
Purpose:
${data.purpose}

Goal:
${data.goal}

Divine Focus:
${data.deity}

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
    completeSadhana
  };
};
