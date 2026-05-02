import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useExperience } from '@/contexts/ExperienceContext';
import { LandingScreen } from '@/components/LandingScreen';
import { MicrophoneSetup } from '@/components/MicrophoneSetup';
import { BirthdayCake } from '@/components/BirthdayCake';
import { MemoryGallery } from '@/components/MemoryGallery';
import { LetterSection } from '@/components/LetterSection';
import { MusicToggle } from '@/components/MusicToggle';
import ReactPlayer from 'react-player';

const SONG_URL = 'https://www.youtube.com/watch?v=cNGjD0VG4R8';

/**
 * Design Philosophy: Ethereal Minimalism with Warm Accents
 * - Soft cream and warm ivory backgrounds
 * - Muted gold accents for celebration
 * - Elegant serif typography (Playfair Display)
 * - Generous whitespace and asymmetric layouts
 * - Subtle animations (fade-ins, gentle scales)
 */

export default function Home() {
  const { state, setState, backgroundMusicEnabled, setBackgroundMusicEnabled } = useExperience();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleStartExperience = () => {
    setState('microphone-setup');
    setBackgroundMusicEnabled(true);
  };

  const handleMicEnabled = () => {
    setState('cake');
  };

  const handleBackToLanding = () => {
    setState('landing');
  };

  const handleCandlesExtinguished = () => {
    setState('gallery');
  };

  const handleContinueToLetter = () => {
    setState('letter');
  };

  const handleRestart = () => {
    setState('landing');
  };

  const handleMusicToggle = () => {
    setBackgroundMusicEnabled(!backgroundMusicEnabled);
  };

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Music Toggle */}
      <MusicToggle isPlaying={backgroundMusicEnabled} onToggle={handleMusicToggle} />

      {/* Global Background Music */}
      {backgroundMusicEnabled && (
        <iframe
          width="0"
          height="0"
          src="https://www.youtube.com/embed/cNGjD0VG4R8?autoplay=1&loop=1&playlist=cNGjD0VG4R8"
          allow="autoplay"
          style={{ display: 'none' }}
          title="Background Music"
        />
      )}

      <AnimatePresence mode="wait">
        {state === 'landing' && (
          <LandingScreen key="landing" onStart={handleStartExperience} />
        )}
        {state === 'microphone-setup' && (
          <MicrophoneSetup
            key="microphone-setup"
            onMicEnabled={handleMicEnabled}
            onBack={handleBackToLanding}
          />
        )}
        {state === 'cake' && (
          <BirthdayCake
            key="cake"
            candlesLit={true}
            onCandlesExtinguished={handleCandlesExtinguished}
            micEnabled={true}
          />
        )}
        {state === 'gallery' && (
          <MemoryGallery
            key="gallery"
            onContinue={handleContinueToLetter}
          />
        )}
        {state === 'letter' && (
          <LetterSection
            key="letter"
            onRestart={handleRestart}
          />
        )}
      </AnimatePresence>
    </>
  );
}
