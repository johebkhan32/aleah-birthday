import { useState, useCallback } from 'react';

export type ExperienceState = 'landing' | 'microphone-setup' | 'cake' | 'gallery' | 'letter';

export interface ExperienceContextType {
  state: ExperienceState;
  setState: (state: ExperienceState) => void;
  candlesLit: boolean;
  setCandlesLit: (lit: boolean) => void;
  micEnabled: boolean;
  setMicEnabled: (enabled: boolean) => void;
  backgroundMusicEnabled: boolean;
  setBackgroundMusicEnabled: (enabled: boolean) => void;
}

export function useExperienceState(): ExperienceContextType {
  const [state, setState] = useState<ExperienceState>('landing');
  const [candlesLit, setCandlesLit] = useState(true);
  const [micEnabled, setMicEnabled] = useState(false);
  const [backgroundMusicEnabled, setBackgroundMusicEnabled] = useState(false);

  return {
    state,
    setState,
    candlesLit,
    setCandlesLit,
    micEnabled,
    setMicEnabled,
    backgroundMusicEnabled,
    setBackgroundMusicEnabled,
  };
}
