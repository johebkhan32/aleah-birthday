import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

interface LandingScreenProps {
  onStart: () => void;
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center bg-background grain relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-accent opacity-5"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute bottom-20 left-20 w-40 h-40 rounded-full bg-accent opacity-5"
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-7xl font-display font-bold text-foreground mb-4">
            Happy Birthday
          </h1>
          <motion.p
            className="text-5xl md:text-6xl font-accent text-accent-warm"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Aleah
          </motion.p>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 leading-relaxed"
        >
          A special celebration just for you
        </motion.p>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-accent-warm to-transparent mb-12 origin-center"
        />

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Button
            onClick={onStart}
            size="lg"
            className="bg-accent-warm hover:bg-accent-warm/90 text-blue-600 px-8 py-6 text-lg rounded-full shadow-soft-lg transition-all duration-300 hover:shadow-soft-lg hover:scale-105"
          >
            <Mic className="mr-2 h-5 w-5" />
            Start Experience
          </Button>
        </motion.div>

        {/* Decorative text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-sm text-muted-foreground mt-12"
        >
          ✨ Make a wish and blow out the candles ✨
        </motion.p>
      </div>
    </motion.div>
  );
}
