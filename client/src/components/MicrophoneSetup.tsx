import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Mic, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface MicrophoneSetupProps {
  onMicEnabled: () => void;
  onBack: () => void;
}

export function MicrophoneSetup({ onMicEnabled, onBack }: MicrophoneSetupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnableMic = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      // Stop the stream immediately - we just needed permission
      stream.getTracks().forEach((track) => track.stop());

      onMicEnabled();
    } catch (err) {
      setError(
        'Unable to access microphone. Please check your browser permissions.'
      );
      console.error('Microphone error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 right-20 w-32 h-32 rounded-full bg-accent opacity-5"
        />
      </div>

      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-5xl md:text-6xl font-display font-bold text-foreground mb-4">
            Enable Microphone
          </h2>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-12"
        >
          <p className="text-lg md:text-xl text-muted-foreground mb-6">
            To blow out the candles, we need access to your microphone.
          </p>
          <p className="text-base text-muted-foreground">
            When you click the button below, your browser will ask for permission to use your microphone. Please allow access to continue.
          </p>
        </motion.div>

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive"
          >
            {error}
          </motion.div>
        )}

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="h-px bg-gradient-to-r from-transparent via-accent-warm to-transparent mb-12 origin-center"
        />

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            onClick={handleEnableMic}
            disabled={isLoading}
            size="lg"
            className="bg-accent-warm hover:bg-accent-warm/90 text-blue-600 px-8 py-6 text-lg rounded-full shadow-soft-lg transition-all duration-300 hover:shadow-soft-lg hover:scale-105"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Enabling...
              </>
            ) : (
              <>
                <Mic className="mr-2 h-5 w-5" />
                Enable Microphone
              </>
            )}
          </Button>

          <Button
            onClick={onBack}
            disabled={isLoading}
            variant="outline"
            size="lg"
            className="px-8 py-6 text-lg rounded-full"
          >
            Go Back
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
