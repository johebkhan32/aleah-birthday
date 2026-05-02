import React, { createContext, useContext } from 'react';
import { useExperienceState, ExperienceContextType } from '@/hooks/useExperienceState';

const ExperienceContext = createContext<ExperienceContextType | undefined>(undefined);

export function ExperienceProvider({ children }: { children: React.ReactNode }) {
  const state = useExperienceState();

  return (
    <ExperienceContext.Provider value={state}>
      {children}
    </ExperienceContext.Provider>
  );
}

export function useExperience(): ExperienceContextType {
  const context = useContext(ExperienceContext);
  if (!context) {
    throw new Error('useExperience must be used within ExperienceProvider');
  }
  return context;
}
