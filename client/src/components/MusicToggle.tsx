import { motion } from 'framer-motion';
import { Music, Music2 } from 'lucide-react';

interface MusicToggleProps {
  isPlaying: boolean;
  onToggle: () => void;
}

export function MusicToggle({ isPlaying, onToggle }: MusicToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-accent-warm text-white shadow-soft-lg hover:shadow-soft-lg transition-all duration-300"
      aria-label={isPlaying ? 'Pause music' : 'Play music'}
    >
      {isPlaying ? (
        <Music className="w-6 h-6" />
      ) : (
        <Music2 className="w-6 h-6" />
      )}
    </motion.button>
  );
}
