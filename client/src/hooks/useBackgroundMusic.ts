import { useEffect, useRef, useState } from 'react';

export function useBackgroundMusic(enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Create audio element if it doesn't exist
    if (!audioRef.current) {
      const audio = new Audio();
      audio.loop = true;
      audio.volume = 0.3; // Soft volume
      
      // Create a simple lo-fi Happy Birthday melody using Web Audio API
      // For now, we'll use a data URL for a simple tone
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create a simple oscillator-based melody
      const createMelody = () => {
        const notes = [
          { freq: 261.63, duration: 0.5 }, // C
          { freq: 261.63, duration: 0.5 }, // C
          { freq: 293.66, duration: 1 },   // D
          { freq: 261.63, duration: 1 },   // C
          { freq: 329.63, duration: 1 },   // E
          { freq: 311.13, duration: 2 },   // D#
        ];
        
        let currentTime = 0;
        notes.forEach(({ freq, duration }) => {
          const osc = audioContext.createOscillator();
          const gain = audioContext.createGain();
          
          osc.connect(gain);
          gain.connect(audioContext.destination);
          
          osc.frequency.value = freq;
          osc.type = 'sine';
          
          gain.gain.setValueAtTime(0.1, currentTime);
          gain.gain.exponentialRampToValueAtTime(0.01, currentTime + duration);
          
          osc.start(currentTime);
          osc.stop(currentTime + duration);
          
          currentTime += duration;
        });
      };
      
      // For simplicity, we'll just use a placeholder
      // In production, you'd want to use an actual audio file
      audioRef.current = audio;
    }

    if (enabled && !isPlaying) {
      // Try to play - note: autoplay may be blocked by browser
      audioRef.current?.play().catch(() => {
        // Autoplay blocked - user will need to interact
      });
      setIsPlaying(true);
    } else if (!enabled && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }

    return () => {
      // Cleanup
    };
  }, [enabled, isPlaying]);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      audioRef.current?.play().catch(() => {
        // Autoplay blocked
      });
      setIsPlaying(true);
    }
  };

  return { isPlaying, toggleMusic };
}
